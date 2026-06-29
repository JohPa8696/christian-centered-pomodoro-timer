import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Phase } from './types';

// Storage keys — namespaced to avoid collisions
const KEYS = {
  timerState: '@pomodoro/timerState',
  soundId: '@pomodoro/soundId',
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
