import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { DURATIONS, PHASE_LABELS } from '../lib/constants';
import { scheduleNotification, cancelAllNotifications } from '../lib/notifications';
import { saveTimerState, loadTimerState } from '../lib/storage';
import { recordSession } from '../lib/stats';
import { getActiveDurations, loadActiveDurations } from '../lib/durations';
import {
  playCompletionAlarm,
  stopCompletionAlarm,
  getActiveSound,
  getSoundDurationMs,
} from '../lib/sounds';
import type { Phase } from '../lib/types';

export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeRemaining, setTimeRemaining] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [phaseDuration, setPhaseDuration] = useState(DURATIONS.work);

  // Track when app goes to background
  const backgroundTimestamp = useRef<number | null>(null);

  // Pending auto-advance timer (the wait for the completion sound to finish).
  // Held in a ref so user actions (Start/Skip) can cancel it and advance early.
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydration guard: don't save until we've loaded persisted state once,
  // otherwise the initial defaults would clobber what was saved.
  const [isHydrated, setIsHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      // Load custom durations first so fresh-start init uses the right values.
      await loadActiveDurations();
      const saved = await loadTimerState();
      if (saved) {
        // Always restore phase/session/duration so dots + colors are correct.
        setPhase(saved.phase);
        setCurrentSession(saved.currentSession);
        setPhaseDuration(saved.phaseDuration);

        if (saved.isRunning) {
          // Timer was running when we left. Like the iOS Clock, we don't keep a
          // timer alive in the background — we stored the time + a timestamp, so
          // we reconstruct what's left by subtracting real elapsed time.
          const elapsed = Math.floor((Date.now() - saved.savedAt) / 1000);
          const restoredTime = saved.timeRemaining - elapsed;

          if (restoredTime > 0) {
            // Still time left → keep counting down, no tap needed.
            setTimeRemaining(restoredTime);
            setIsRunning(true);
          } else {
            // Phase finished while we were away. Show it complete; the countdown
            // effect will auto-advance to the next phase on the next mount tick.
            setTimeRemaining(0);
            setIsRunning(true);
          }
        } else {
          // Was paused when saved → restore paused exactly where we left off.
          setTimeRemaining(saved.timeRemaining);
          setIsRunning(false);
        }
      } else {
        // No saved timer → start fresh on a work phase using the active
        // (possibly custom) work duration rather than the hardcoded default.
        const work = getActiveDurations().work;
        setPhaseDuration(work);
        setTimeRemaining(work);
      }
      setIsHydrated(true);
    })();
  }, []);

  // Persist state on meaningful changes (after hydration). We intentionally do
  // NOT depend on `timeRemaining` — that changes every second, and saving each
  // tick would hammer the disk. Instead we capture the current time + a
  // timestamp on start/pause/phase/session changes; on restore the elapsed
  // time since `savedAt` is subtracted to reconstruct the live countdown.
  useEffect(() => {
    if (!isHydrated) return;
    saveTimerState({
      phase,
      timeRemaining,
      currentSession,
      phaseDuration,
      isRunning,
      savedAt: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, phase, currentSession, phaseDuration, isRunning]);

  // Countdown timer logic with auto-advance
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // Only completed WORK sessions count toward stats (breaks don't, and
          // skipped sessions aren't recorded — this only fires on natural finish).
          if (phase === 'work') {
            recordSession(phaseDuration, Date.now());
          }
          // Phase finished on its own → play the completion sound, then wait for
          // it to finish before auto-advancing (so the next phase doesn't start
          // mid-ringtone). Add a small tail so it doesn't feel abrupt. The
          // timeout is stored in a ref so Start/Skip can cancel it and advance
          // early (stopping the sound).
          playCompletionAlarm();
          const waitMs = getSoundDurationMs(getActiveSound()) + 500;
          advanceTimeout.current = setTimeout(() => {
            advanceTimeout.current = null;
            advancePhase();
            setIsRunning(true); // Auto-start next phase
          }, waitMs);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentSession]);

  // Clean up any pending auto-advance timeout on unmount.
  useEffect(() => {
    return () => {
      if (advanceTimeout.current !== null) {
        clearTimeout(advanceTimeout.current);
        advanceTimeout.current = null;
      }
    };
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'background' && isRunning) {
        // App went to background while timer running
        backgroundTimestamp.current = Date.now();

        // Schedule notification for when phase completes
        await scheduleNotification(
          `${PHASE_LABELS[phase]} Complete!`,
          `Time for ${getNextPhaseLabel()}`,
          timeRemaining
        );

        console.log('App backgrounded, notification scheduled for', timeRemaining, 'seconds');
      } else if (nextAppState === 'active' && backgroundTimestamp.current !== null) {
        // App came back to foreground
        const elapsed = Math.floor((Date.now() - backgroundTimestamp.current) / 1000);
        backgroundTimestamp.current = null;

        // Cancel any pending notifications
        await cancelAllNotifications();

        console.log('App foregrounded, elapsed:', elapsed, 'seconds');

        // Recalculate time remaining
        setTimeRemaining((prev) => {
          const newTime = prev - elapsed;
          if (newTime <= 0) {
            // Phase completed while backgrounded. Record it if it was a work
            // session, mirroring the natural-completion path. Stamp the time at
            // when it actually finished, not now (we may return much later).
            if (phase === 'work') {
              const finishedAt = Date.now() - Math.abs(newTime) * 1000;
              recordSession(phaseDuration, finishedAt);
            }
            setIsRunning(false);
            setTimeout(() => {
              advancePhase();
              setIsRunning(true);
            }, 100);
            return 0;
          }
          return newTime;
        });
      }
    });

    return () => subscription.remove();
  }, [isRunning, timeRemaining, phase]);

  // Helper to get next phase label for notifications
  const getNextPhaseLabel = () => {
    if (phase === 'work') {
      return currentSession === 4 ? PHASE_LABELS.longBreak : PHASE_LABELS.shortBreak;
    }
    return PHASE_LABELS.work;
  };

  // If a phase just finished and we're waiting for the completion sound to play
  // out, this cancels that wait and stops the sound. Returns true if there was a
  // pending advance (so callers know we were in the post-completion window).
  const cancelPendingAdvance = (): boolean => {
    if (advanceTimeout.current !== null) {
      clearTimeout(advanceTimeout.current);
      advanceTimeout.current = null;
      stopCompletionAlarm();
      return true;
    }
    return false;
  };

  // Actions
  const startPause = () => {
    // If the completion sound is playing post-phase, "Start" should cut it off
    // and jump straight into the next session rather than resuming a finished one.
    if (cancelPendingAdvance()) {
      advancePhase();
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const skip = async () => {
    // Skipping during the post-completion sound also cuts it off.
    cancelPendingAdvance();
    setIsRunning(false);
    // Cancel any pending notifications when user manually skips
    await cancelAllNotifications();
    advancePhase();
  };

  // DEV ONLY: jump to ~3s before the phase ends and start running, so the
  // natural completion flow (sound + auto-advance) fires for testing.
  const jumpToEnd = () => {
    cancelPendingAdvance();
    setTimeRemaining(3);
    setIsRunning(true);
  };

  // Helper function to determine next phase. Reads the *active* durations at
  // transition time, so custom-duration changes take effect from the next phase.
  const advancePhase = () => {
    const durations = getActiveDurations();
    if (phase === 'work') {
      if (currentSession === 4) {
        // After 4th work session → long break
        setPhase('longBreak');
        setPhaseDuration(durations.longBreak);
        setTimeRemaining(durations.longBreak);
        setCurrentSession(1); // Reset cycle
      } else {
        // After work sessions 1-3 → short break
        setPhase('shortBreak');
        setPhaseDuration(durations.shortBreak);
        setTimeRemaining(durations.shortBreak);
      }
    } else {
      // After any break → work
      setPhase('work');
      setPhaseDuration(durations.work);
      setTimeRemaining(durations.work);
      if (phase === 'shortBreak') {
        setCurrentSession((prev) => prev + 1);
      }
    }
  };

  // Derived values
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (phaseDuration - timeRemaining) / phaseDuration;

  return {
    phase,
    timeRemaining,
    isRunning,
    currentSession,
    phaseDuration,
    minutes,
    seconds,
    progress,
    startPause,
    skip,
    jumpToEnd,
  };
}
