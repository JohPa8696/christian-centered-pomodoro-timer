export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface ProgressRingProps {
  progress: number;           // 0 to 1
  color: string;
  size: number;
  strokeWidth: number;
}

export interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

export interface PhaseLabelProps {
  phase: Phase;
}

export interface CycleDotsProps {
  currentSession: number;     // 1-4
  totalSessions: number;      // Always 4 for MVP
}

export interface ControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onSkip: () => void;
}
