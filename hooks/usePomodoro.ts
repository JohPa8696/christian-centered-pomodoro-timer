import { useState, useEffect } from 'react';
import { DURATIONS } from '../lib/constants';
import type { Phase } from '../lib/types';

export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeRemaining, setTimeRemaining] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [phaseDuration, setPhaseDuration] = useState(DURATIONS.work);

  // Countdown timer logic with auto-advance
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // Auto-advance to next phase after 1 second
          setTimeout(() => {
            advancePhase();
            setIsRunning(true); // Auto-start next phase
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, currentSession]);

  // Actions
  const startPause = () => {
    setIsRunning((prev) => !prev);
  };

  const skip = () => {
    setIsRunning(false);
    advancePhase();
  };

  // Helper function to determine next phase
  const advancePhase = () => {
    if (phase === 'work') {
      if (currentSession === 4) {
        // After 4th work session → long break
        setPhase('longBreak');
        setPhaseDuration(DURATIONS.longBreak);
        setTimeRemaining(DURATIONS.longBreak);
        setCurrentSession(1); // Reset cycle
      } else {
        // After work sessions 1-3 → short break
        setPhase('shortBreak');
        setPhaseDuration(DURATIONS.shortBreak);
        setTimeRemaining(DURATIONS.shortBreak);
      }
    } else {
      // After any break → work
      setPhase('work');
      setPhaseDuration(DURATIONS.work);
      setTimeRemaining(DURATIONS.work);
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
  };
}
