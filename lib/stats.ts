import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Session history + derived stats. We record one entry per *completed work
 * session* (breaks don't count toward productivity). The list is append-only
 * and small enough to keep entirely in AsyncStorage — see the sizing note in
 * the project history (a few MB even after years of heavy use).
 */

const KEY = '@pomodoro/sessionHistory';

export interface SessionRecord {
  completedAt: number; // epoch ms
  durationSec: number; // length of the focus session
}

export interface Stats {
  todayCount: number;
  todayFocusSec: number;
  totalCount: number;
  totalFocusSec: number;
  streakDays: number;
  /** Last 7 days, oldest→newest: session count per day. */
  last7Days: { label: string; count: number }[];
}

/** Load the full session history (oldest first). */
export async function loadHistory(): Promise<SessionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionRecord[];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/** Append a completed work session to the history. */
export async function recordSession(durationSec: number, completedAt: number): Promise<void> {
  try {
    const history = await loadHistory();
    history.push({ completedAt, durationSec });
    await AsyncStorage.setItem(KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to record session:', error);
  }
}

/** Clear all history (used by a "reset stats" action). */
export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

// --- Date helpers (local time) ---

/** A day key like "2026-06-29" in the device's local timezone. */
function dayKey(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Short weekday label like "Mon". */
function weekdayLabel(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { weekday: 'short' });
}

/**
 * Compute derived stats from history. `now` is passed in (epoch ms) so the
 * caller controls "today" — keeps this function pure and testable.
 */
export function computeStats(history: SessionRecord[], now: number): Stats {
  const todayKey = dayKey(now);

  let todayCount = 0;
  let todayFocusSec = 0;
  let totalFocusSec = 0;
  const perDay = new Map<string, number>();

  for (const rec of history) {
    totalFocusSec += rec.durationSec;
    const key = dayKey(rec.completedAt);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
    if (key === todayKey) {
      todayCount += 1;
      todayFocusSec += rec.durationSec;
    }
  }

  // Streak: walk backwards from today while each day has ≥1 session.
  let streakDays = 0;
  const dayMs = 24 * 60 * 60 * 1000;
  // If there's nothing today, the streak may still be "yesterday's" — but a
  // streak is conventionally broken once today passes with no session. We count
  // consecutive days ending today; if today is empty, streak is 0.
  let cursor = now;
  while (perDay.has(dayKey(cursor))) {
    streakDays += 1;
    cursor -= dayMs;
  }

  // Last 7 days (oldest → newest).
  const last7Days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const ms = now - i * dayMs;
    last7Days.push({ label: weekdayLabel(ms), count: perDay.get(dayKey(ms)) ?? 0 });
  }

  return {
    todayCount,
    todayFocusSec,
    totalCount: history.length,
    totalFocusSec,
    streakDays,
    last7Days,
  };
}
