// Durations (in seconds)
export const DURATIONS = {
  work: 25 * 60,           // 25 minutes
  shortBreak: 5 * 60,      // 5 minutes
  longBreak: 15 * 60,      // 15 minutes
} as const;

// Total work sessions per cycle
export const SESSIONS_PER_CYCLE = 4;

// Colors per phase
export const PHASE_COLORS = {
  work: '#3B82F6',         // Blue
  shortBreak: '#10B981',   // Green
  longBreak: '#8B5CF6',    // Purple
} as const;

// Labels
export const PHASE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
} as const;
