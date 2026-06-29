import { DURATIONS } from './constants';
import { saveDurations, loadDurations, type PersistedDurations } from './storage';

/**
 * Active phase durations (in seconds). Held at module scope so the timer reads
 * the latest values at each phase transition without prop-threading — this is
 * what makes custom durations "apply on the next phase" for free.
 *
 * Defaults to the constants until loadActiveDurations() restores any saved
 * overrides on app start.
 */
let active: PersistedDurations = {
  work: DURATIONS.work,
  shortBreak: DURATIONS.shortBreak,
  longBreak: DURATIONS.longBreak,
};

/** Get the current active durations (seconds). */
export function getActiveDurations(): PersistedDurations {
  return active;
}

/** Replace active durations (seconds) and persist them. */
export function setActiveDurations(next: PersistedDurations): void {
  active = next;
  saveDurations(next);
}

/** Restore saved durations from storage. Call once on app start. */
export async function loadActiveDurations(): Promise<void> {
  const saved = await loadDurations();
  if (saved) {
    active = saved;
  }
}
