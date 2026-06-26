@AGENTS.md

# Pomodoro App — Project Instructions

A minimal, slick Pomodoro timer. First mobile app built to validate the
React Native + Expo workflow end-to-end (see `~/Source/MOBILE_STACK.md`).

## What it is

A single-screen focus timer that runs the standard Pomodoro cycle and
auto-advances between phases, with a progress ring and a visual cycle tracker.

## The cycle (fixed in MVP)

```
Work 25m → Short Break 5m → Work 25m → Short Break 5m →
Work 25m → Short Break 5m → Work 25m → Long Break 15m → ↺ repeat
```

- 4 work sessions per cycle. After the 4th, a long break, then reset to session 1.
- Auto-advance: each phase starts the next automatically.
- A row of 4 dots visualizes work sessions completed in the current cycle.

## Constraints

- **Local-only.** No backend, no auth, no persistence. All state is in-memory.
- **Foreground-only.** Timer pauses when the app is backgrounded. Background
  execution + end-of-phase notifications are deferred.
- Durations are hardcoded constants (no settings screen yet).

## Tech stack

- Expo SDK 56, React Native 0.85, React 19, TypeScript (strict).
- **NativeWind v4** (Tailwind classes via `className`) for styling.
- **Reanimated 4** (+ `react-native-worklets`) for animations.
- **react-native-svg** for the progress ring.
- `react-native-safe-area-context` for safe areas.

### Config notes (version-sensitive — verify against SDK 56 docs)

- `babel.config.js`: `babel-preset-expo` with `jsxImportSource: "nativewind"`,
  preset `nativewind/babel`, and `react-native-worklets/plugin` **last**.
- `metro.config.js`: wrapped with `withNativeWind(config, { input: "./global.css" })`.
- `global.css` is imported once at the top of `App.tsx`.

## Run / test

Expo Go on a physical iPhone (no Xcode/Simulator needed):

```bash
npm start        # then scan the QR code with the Expo Go app
```

Use the **Skip** control to fast-test phase transitions without waiting 25 min.

## Structure (MVP)

```
App.tsx                 # Root; imports global.css, renders TimerScreen
screens/TimerScreen.tsx # Composes ring + dots + controls
components/             # ProgressRing, CycleDots, Controls
hooks/usePomodoro.ts    # State machine + countdown
lib/constants.ts        # Durations, session count, colors, labels
```

## Deferred (not in MVP)

Persistence/stats, settings/custom durations, background timer + notifications,
sounds/haptics, gamification (streaks/achievements), Android verification,
EAS build/submit.
