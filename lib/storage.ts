import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Phase } from './types';

// Storage keys — namespaced to avoid collisions
const KEYS = {
  timerState: '@pomodoro/timerState',
  soundId: '@pomodoro/soundId',
  durations: '@pomodoro/durations',
} as const;

/**
 * Persisted timer state. We store `timeRemaining` along with the timestamp it
 * was saved at, so on restore we can subtract any elapsed time if it was running.
 */
export interface PersistedTimerState {
  phase: Phase;
  timeRemaining: number;
  currentSession: number;
  phaseDuration: number;
  isRunning: boolean;
  savedAt: number; // epoch ms when this state was written
}

/**
 * Save the current timer state to local storage.
 */
export async function saveTimerState(state: PersistedTimerState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.timerState, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
}

/**
 * Load the persisted timer state. Returns null if nothing saved or on error.
 */
export async function loadTimerState(): Promise<PersistedTimerState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.timerState);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedTimerState;
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
}

/**
 * Clear the persisted timer state.
 */
export async function clearTimerState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.timerState);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
}

/**
 * Save the chosen completion-sound id.
 */
export async function saveSoundId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.soundId, id);
  } catch (error) {
    console.error('Failed to save sound id:', error);
  }
}

/**
 * Load the chosen completion-sound id. Returns null if none saved.
 */
export async function loadSoundId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.soundId);
  } catch (error) {
    console.error('Failed to load sound id:', error);
    return null;
  }
}

/** Durations persisted in seconds, keyed by phase. */
export interface PersistedDurations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

/**
 * Save custom phase durations (in seconds).
 */
export async function saveDurations(durations: PersistedDurations): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.durations, JSON.stringify(durations));
  } catch (error) {
    console.error('Failed to save durations:', error);
  }
}

/**
 * Load custom phase durations. Returns null if none saved or on error.
 */
export async function loadDurations(): Promise<PersistedDurations | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.durations);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDurations;
  } catch (error) {
    console.error('Failed to load durations:', error);
    return null;
  }
}
