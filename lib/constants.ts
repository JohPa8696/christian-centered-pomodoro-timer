// Default durations (in seconds). Users can override these in Settings; these
// are the fallbacks and the "reset to defaults" values.
export const DURATIONS = {
  work: 25 * 60,           // 25 minutes
  shortBreak: 5 * 60,      // 5 minutes
  longBreak: 15 * 60,      // 15 minutes
} as const;

// Editing config for custom durations, per phase (all in minutes).
// `step` is how much each − / + tap changes the value.
export const DURATION_LIMITS = {
  work: { min: 5, max: 60, step: 5 },
  shortBreak: { min: 1, max: 30, step: 1 },
  longBreak: { min: 5, max: 60, step: 5 },
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
