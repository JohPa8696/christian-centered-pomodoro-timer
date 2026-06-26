# Pomodoro App - Implementation Plan

**Project:** Minimal Pomodoro Timer (MVP)  
**Created:** 2026-06-26  
**Status:** Not Started

---

## 🎯 Project Overview

A single-screen Pomodoro timer that runs the standard cycle:
- 4 work sessions (25 min each)
- Short breaks (5 min) after sessions 1, 2, 3
- Long break (15 min) after session 4
- Auto-advances between phases
- Visual progress ring and cycle tracker

**Constraints:**
- Local-only (no backend, no auth, no persistence)
- Foreground-only (timer pauses when backgrounded)
- Hardcoded durations (no settings screen)

---

## 📁 Target File Structure

```
pomodoro-app/
├── App.tsx                      # Root: imports global.css, renders TimerScreen
├── screens/
│   └── TimerScreen.tsx          # Main screen: composes all components
├── components/
│   ├── ProgressRing.tsx         # SVG circular progress (with Reanimated)
│   ├── TimerDisplay.tsx         # Large countdown text (25:00)
│   ├── PhaseLabel.tsx           # "Focus Time" / "Short Break" / "Long Break"
│   ├── CycleDots.tsx            # ○○○○ visual tracker
│   └── Controls.tsx             # Start/Pause/Skip buttons
├── hooks/
│   └── usePomodoro.ts           # State machine + timer logic
├── lib/
│   ├── constants.ts             # Durations, colors, labels
│   └── types.ts                 # TypeScript types
├── global.css                   # Tailwind styles
└── index.ts                     # Entry point
```

---

## 📋 Implementation Tasks

### **Phase 1: Foundation (Static UI)** — Tasks 1-10

Build the visual interface without functionality.

#### ✅ Task 1: Create project file structure
**Status:** Pending  
**Description:** Create directories: `screens/`, `components/`, `hooks/`, `lib/`

**Commands:**
```bash
cd /Users/john.pham/Source/Projects/pomodoro-app
mkdir -p screens components hooks lib
```

---

#### ✅ Task 2: Create lib/constants.ts
**Status:** Pending  
**Description:** Define durations, colors, labels, and session count

**File:** `lib/constants.ts`
```typescript
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
```

---

#### ✅ Task 3: Create lib/types.ts
**Status:** Pending  
**Description:** Define TypeScript interfaces for type safety

**File:** `lib/types.ts`
```typescript
export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  phase: Phase;
  timeRemaining: number;      // seconds
  isRunning: boolean;
  currentSession: number;     // 1-4
  phaseDuration: number;      // seconds (total duration of current phase)
}

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
```

---

#### ✅ Task 4: Build PhaseLabel component (static)
**Status:** Pending  
**Description:** Display current phase label

**File:** `components/PhaseLabel.tsx`
```typescript
import { Text } from 'react-native';
import { PHASE_LABELS } from '../lib/constants';
import type { PhaseLabelProps } from '../lib/types';

export function PhaseLabel({ phase }: PhaseLabelProps) {
  return (
    <Text className="text-sm text-neutral-400 uppercase tracking-wider">
      {PHASE_LABELS[phase]}
    </Text>
  );
}
```

---

#### ✅ Task 5: Build TimerDisplay component (static)
**Status:** Pending  
**Description:** Show countdown time in MM:SS format

**File:** `components/TimerDisplay.tsx`
```typescript
import { Text } from 'react-native';
import type { TimerDisplayProps } from '../lib/types';

export function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return (
    <Text className="text-7xl font-bold text-white">
      {formattedMinutes}:{formattedSeconds}
    </Text>
  );
}
```

---

#### ✅ Task 6: Build CycleDots component (static)
**Status:** Pending  
**Description:** Show 4 dots representing work sessions in current cycle

**File:** `components/CycleDots.tsx`
```typescript
import { View } from 'react-native';
import type { CycleDotsProps } from '../lib/types';

export function CycleDots({ currentSession, totalSessions }: CycleDotsProps) {
  return (
    <View className="flex-row gap-3">
      {Array.from({ length: totalSessions }).map((_, index) => {
        const isCompleted = index < currentSession;
        return (
          <View
            key={index}
            className={`w-3 h-3 rounded-full ${
              isCompleted ? 'bg-white' : 'bg-neutral-700'
            }`}
          />
        );
      })}
    </View>
  );
}
```

---

#### ✅ Task 7: Build Controls component (static)
**Status:** Pending  
**Description:** Start/Pause and Skip buttons

**File:** `components/Controls.tsx`
```typescript
import { Pressable, Text, View } from 'react-native';
import type { ControlsProps } from '../lib/types';

export function Controls({ isRunning, onStartPause, onSkip }: ControlsProps) {
  return (
    <View className="flex-row gap-4">
      <Pressable
        onPress={onStartPause}
        className="bg-blue-500 px-8 py-4 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </Pressable>
      
      <Pressable
        onPress={onSkip}
        className="bg-neutral-700 px-8 py-4 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">
          Skip
        </Text>
      </Pressable>
    </View>
  );
}
```

---

#### ✅ Task 8: Build ProgressRing component (basic SVG)
**Status:** Pending  
**Description:** Circular progress ring using react-native-svg

**File:** `components/ProgressRing.tsx`
```typescript
import Svg, { Circle } from 'react-native-svg';
import type { ProgressRingProps } from '../lib/types';

export function ProgressRing({ progress, color, size, strokeWidth }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#262626"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}
```

---

#### ✅ Task 9: Create TimerScreen and compose all components
**Status:** Pending  
**Description:** Main screen that arranges all components in a layout

**File:** `screens/TimerScreen.tsx`
```typescript
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ProgressRing';
import { TimerDisplay } from '../components/TimerDisplay';
import { PhaseLabel } from '../components/PhaseLabel';
import { CycleDots } from '../components/CycleDots';
import { Controls } from '../components/Controls';
import { SESSIONS_PER_CYCLE, PHASE_COLORS } from '../lib/constants';

export function TimerScreen() {
  // Temporary hardcoded values for static UI
  const phase = 'work';
  const minutes = 25;
  const seconds = 0;
  const currentSession = 1;
  const progress = 0;
  const isRunning = false;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        {/* Progress Ring with Timer inside */}
        <View className="items-center justify-center mb-12">
          <ProgressRing
            progress={progress}
            color={PHASE_COLORS[phase]}
            size={280}
            strokeWidth={12}
          />
          <View className="absolute items-center">
            <PhaseLabel phase={phase} />
            <View className="mt-4">
              <TimerDisplay minutes={minutes} seconds={seconds} />
            </View>
          </View>
        </View>

        {/* Cycle Dots */}
        <View className="mb-12">
          <CycleDots
            currentSession={currentSession}
            totalSessions={SESSIONS_PER_CYCLE}
          />
        </View>

        {/* Controls */}
        <Controls
          isRunning={isRunning}
          onStartPause={() => console.log('Start/Pause')}
          onSkip={() => console.log('Skip')}
        />
      </View>
    </SafeAreaView>
  );
}
```

---

#### ✅ Task 10: Update App.tsx to render TimerScreen
**Status:** Pending  
**Description:** Replace placeholder content with TimerScreen

**File:** `App.tsx`
```typescript
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TimerScreen } from "./screens/TimerScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <TimerScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
```

**Test:** Run `npm start` and scan QR code. You should see static UI.

---

### **Phase 2: Functionality (Timer Logic)** — Tasks 11-18

Add the brain that makes the timer work.

#### ✅ Task 11: Build usePomodoro hook - initial state
**Status:** Pending  
**Description:** Set up state management for timer

**File:** `hooks/usePomodoro.ts`
```typescript
import { useState } from 'react';
import { DURATIONS } from '../lib/constants';
import type { Phase, PomodoroState } from '../lib/types';

export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeRemaining, setTimeRemaining] = useState(DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [phaseDuration, setPhaseDuration] = useState(DURATIONS.work);

  // Actions will be added in next tasks
  const startPause = () => {
    // TODO: Implement in Task 13
  };

  const skip = () => {
    // TODO: Implement in Task 14
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
```

---

#### ✅ Task 12: Build usePomodoro hook - countdown timer logic
**Status:** Pending  
**Description:** Add interval that decrements timeRemaining every second

**Add to `hooks/usePomodoro.ts`:**
```typescript
import { useState, useEffect } from 'react';

// ... existing state ...

useEffect(() => {
  if (!isRunning) return;
  
  const interval = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(interval);
}, [isRunning]);
```

---

#### ✅ Task 13: Build usePomodoro hook - start/pause action
**Status:** Pending  
**Description:** Toggle timer running state

**Update `startPause` function:**
```typescript
const startPause = () => {
  setIsRunning((prev) => !prev);
};
```

---

#### ✅ Task 14: Build usePomodoro hook - skip action
**Status:** Pending  
**Description:** Immediately advance to next phase

**Update `skip` function:**
```typescript
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
```

---

#### ✅ Task 15: Build usePomodoro hook - auto-advance logic
**Status:** Pending  
**Description:** Automatically advance when timer reaches 0

**Update countdown useEffect:**
```typescript
useEffect(() => {
  if (!isRunning) return;
  
  const interval = setInterval(() => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        setIsRunning(false);
        // Auto-advance to next phase
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
```

---

#### ✅ Task 16: Connect usePomodoro hook to TimerScreen
**Status:** Pending  
**Description:** Replace hardcoded values with hook state

**Update `screens/TimerScreen.tsx`:**
```typescript
import { usePomodoro } from '../hooks/usePomodoro';

export function TimerScreen() {
  const {
    phase,
    minutes,
    seconds,
    currentSession,
    progress,
    isRunning,
    startPause,
    skip,
  } = usePomodoro();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        {/* Progress Ring with Timer inside */}
        <View className="items-center justify-center mb-12">
          <ProgressRing
            progress={progress}
            color={PHASE_COLORS[phase]}
            size={280}
            strokeWidth={12}
          />
          <View className="absolute items-center">
            <PhaseLabel phase={phase} />
            <View className="mt-4">
              <TimerDisplay minutes={minutes} seconds={seconds} />
            </View>
          </View>
        </View>

        {/* Cycle Dots */}
        <View className="mb-12">
          <CycleDots
            currentSession={currentSession}
            totalSessions={SESSIONS_PER_CYCLE}
          />
        </View>

        {/* Controls */}
        <Controls
          isRunning={isRunning}
          onStartPause={startPause}
          onSkip={skip}
        />
      </View>
    </SafeAreaView>
  );
}
```

---

#### ✅ Task 17: Connect ProgressRing to timer progress
**Status:** Pending  
**Description:** Already done in Task 16 via `progress` prop

**Verify:** Progress ring should fill as timer counts down, reset on phase change.

---

#### ✅ Task 18: Test full timer functionality on device
**Status:** Pending  
**Description:** Comprehensive testing of timer behavior

**Test cases:**
1. ✅ Start timer → counts down from 25:00
2. ✅ Pause timer → countdown stops
3. ✅ Resume timer → countdown continues
4. ✅ Skip during work → advances to short break
5. ✅ Complete 4 work sessions → long break triggers
6. ✅ After long break → resets to session 1
7. ✅ Cycle dots update correctly
8. ✅ Progress ring fills correctly
9. ✅ Phase labels change correctly

**Use Skip button to fast-test without waiting 25 minutes.**

---

### **Phase 3: Polish (Animations & UX)** — Tasks 19-23

Make it feel smooth and production-ready.

#### ✅ Task 19: Add Reanimated animations to ProgressRing
**Status:** Pending  
**Description:** Smooth progress transitions

**Update `components/ProgressRing.tsx`:**
```typescript
import { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import type { ProgressRingProps } from '../lib/types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({ progress, color, size, strokeWidth }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 300 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#262626"
        strokeWidth={strokeWidth}
        fill="none"
      />
      
      {/* Progress circle */}
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}
```

---

#### ✅ Task 20: Add button press animations to Controls
**Status:** Pending  
**Description:** Scale down on press for tactile feedback

**Update `components/Controls.tsx`:**
```typescript
import { Pressable, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { ControlsProps } from '../lib/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Controls({ isRunning, onStartPause, onSkip }: ControlsProps) {
  return (
    <View className="flex-row gap-4">
      <AnimatedButton onPress={onStartPause} primary>
        <Text className="text-white text-lg font-semibold">
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </AnimatedButton>
      
      <AnimatedButton onPress={onSkip}>
        <Text className="text-white text-lg font-semibold">
          Skip
        </Text>
      </AnimatedButton>
    </View>
  );
}

function AnimatedButton({ onPress, primary = false, children }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      style={animatedStyle}
      className={`${primary ? 'bg-blue-500' : 'bg-neutral-700'} px-8 py-4 rounded-full`}
    >
      {children}
    </AnimatedPressable>
  );
}
```

---

#### ✅ Task 21: Add color transitions for phase changes
**Status:** Pending  
**Description:** Smooth color fade when changing phases

**Update `components/ProgressRing.tsx` to animate color:**
```typescript
import { interpolateColor } from 'react-native-reanimated';

// Inside component:
const animatedColor = useSharedValue(color);

useEffect(() => {
  animatedColor.value = withTiming(color, { duration: 500 });
}, [color]);

// In animatedProps:
const animatedProps = useAnimatedProps(() => ({
  strokeDashoffset: circumference * (1 - animatedProgress.value),
  stroke: animatedColor.value,
}));
```

---

#### ✅ Task 22: Polish UI - refine spacing, colors, and typography
**Status:** Pending  
**Description:** Fine-tune visual design

**Adjustments:**
- Ensure readable contrast (white text on dark background)
- Test on different iPhone screen sizes (SE, 13 Pro, 15 Pro Max)
- Adjust font sizes if too small/large
- Tweak spacing for balance
- Consider locking to dark mode in `app.json` (`"userInterfaceStyle": "dark"`)

---

#### ✅ Task 23: Final testing - complete cycle on device
**Status:** Pending  
**Description:** End-to-end testing with edge cases

**Full test:**
1. ✅ Complete full 4-session cycle with breaks
2. ✅ Verify long break after 4th session
3. ✅ Verify cycle resets to session 1 after long break
4. ✅ Test pause mid-session → resume
5. ✅ Test rapid skip presses → no crashes
6. ✅ Test backgrounding app → timer pauses (expected behavior)
7. ✅ Test animations are smooth
8. ✅ Test on multiple screen sizes

**If all tests pass → MVP is complete! 🎉**

---

## 📊 Progress Tracking

- **Phase 1 (Foundation):** 0/10 tasks complete
- **Phase 2 (Functionality):** 0/8 tasks complete
- **Phase 3 (Polish):** 0/5 tasks complete
- **Overall:** 0/23 tasks complete (0%)

---

## 🚀 Getting Started

To begin implementation:
```bash
cd /Users/john.pham/Source/Projects/pomodoro-app
npm start
```

Start with **Task 1** and work sequentially through each phase.

---

## 📝 Notes

- Use Skip button during testing to avoid waiting 25 minutes
- Test on physical device via Expo Go (no simulator needed)
- Each phase has a clear checkpoint for testing
- All animations are optional polish — ship without them if needed

---

**Ready to build! Let's start with Task 1 when you're ready.**
