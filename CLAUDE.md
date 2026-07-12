@AGENTS.md

# Sacred Focus — Project Instructions

A faith-centered Pomodoro focus timer for Catholics/Christians. During breaks it
shows a calming Scripture verse, turning rest between work sessions into a small
moment of spiritual re-centering. First mobile app, built to validate the
React Native + Expo workflow end-to-end (see `~/Source/MOBILE_STACK.md` and
`~/Source/MOBILE_LESSONS.md`).

Repo: github.com/JohPa8696/christian-centered-pomodoro-timer

## What it is

A single-screen focus timer running the standard Pomodoro cycle with auto-advance,
a progress ring, and a cycle tracker. Breaks display a Scripture verse. Work phases
stay quiet and focused. Sounds, stats, custom durations, and a settings menu round
it out.

## The cycle

```
Work 25m → Short Break 5m → Work 25m → Short Break 5m →
Work 25m → Short Break 5m → Work 25m → Long Break 15m → ↺ repeat
```

- 4 work sessions per cycle. After the 4th, a long break, then reset to session 1.
- Auto-advance: each phase starts the next automatically (waits for the completion
  sound to finish; Start/Skip cut it off and advance immediately).
- A row of 4 dots visualizes work sessions completed in the current cycle.
- Durations are user-customizable (Settings → Durations); changes apply next phase.

## Faith feature

- During short/long breaks, a curated Scripture verse fades in (`VerseDisplay`).
- 196 hand-curated verses on rest/peace/trust themes; text is pulled verbatim from
  a verified **Douay-Rheims (Challoner, 1899 DRA)** dataset — public domain — so
  wording/references are accurate by construction. References display in
  traditional Catholic/Douay book names (Apocalypse, Isaias, etc.).
- Regenerate with `node .tmp/generate-verses.js` (see that file for the dataset URL).

## Constraints

- **Local-only.** No backend, no auth, no cloud sync. All state in AsyncStorage;
  fine to lose on app delete. (User confirmed: no cross-device sync wanted.)
- Runs in **Expo Go** today. Live Activities, custom notification sounds, and
  App Store/TestFlight all need a dev build (deferred — see below).

## Tech stack

- Expo **SDK 54**, React Native 0.81, React 19, TypeScript (strict).
- **NativeWind v4** (Tailwind via `className`) for styling.
- **Reanimated 4** (+ `react-native-worklets`) for animations.
- **react-native-svg** (progress ring), **@expo/vector-icons** (Ionicons).
- **expo-audio** (completion sounds), **expo-notifications** (backgrounded alerts),
  **@react-native-async-storage/async-storage** (persistence).

### Config notes (version-sensitive)

- `babel.config.js`: `babel-preset-expo` (`jsxImportSource: "nativewind"`),
  preset `nativewind/babel`, and **`react-native-reanimated/plugin` last**
  (NOT `react-native-worklets/plugin` — that name caused runtime crashes).
- `metro.config.js`: wrapped with `withNativeWind(config, { input: "./global.css" })`.
- `global.css` imported once at the top of `App.tsx`.
- After dependency/asset changes, clear cache: `npx expo start --clear`.

## Run / test

Expo Go on a physical iPhone (no Xcode/Simulator needed):

```bash
npm start        # then scan the QR code with the Expo Go app
```

Use the **Skip** control to fast-test phase transitions without waiting.

## Structure

```
App.tsx                  # Root; imports global.css, requests perms, loads sounds
screens/TimerScreen.tsx  # Composes ring + dots + verse + controls + settings sheets
hooks/usePomodoro.ts     # State machine, countdown, persistence, background handling
components/              # ProgressRing, CycleDots, Controls, TimerDisplay, PhaseLabel,
                         #   VerseDisplay, SettingsMenu, SoundPicker, StatsSheet, DurationsSheet
lib/constants.ts         # Durations, limits, colors, labels
lib/durations.ts         # Active (custom) durations: get/set/load
lib/sounds.ts            # Completion alarm + sound picker catalog
lib/notifications.ts     # Local scheduled notifications (backgrounded completion)
lib/storage.ts           # AsyncStorage wrappers (timer state, sound, durations)
lib/stats.ts             # Session history + derived stats
lib/verses.ts            # GENERATED — 196 Douay-Rheims verses
lib/types.ts             # Shared types
```

## Built features

Core timer · progress ring + animations · web support · background timer +
notifications · persistence (iOS-Clock-style resume) · selectable completion
sounds · stats & history (streak, 7-day chart) · custom durations · settings menu ·
Scripture verses during breaks.

## Deferred

- **Live Activities** (Dynamic Island timer pill) — needs dev build + Swift.
- **Custom notification sound** (chosen ringtone when backgrounded) — needs native
  sound registration; not reliable in Expo Go.
- **TestFlight / App Store** — needs dev build (EAS, no Xcode required) + Apple
  Developer account ($99/yr). User plans this ~next month.
- Verse spot-check against a printed Catholic Bible recommended before submission.

## Task Management

This project uses structured task files for complex multi-step work (launches, migrations, etc.).

**Location:** `.tasks/` directory

**Current active task list:**
- `.tasks/LAUNCH_CHECKLIST.md` — Complete guide for App Store submission

**For AI agents:**

When user asks "what's next" or "show me tasks":
1. Read `.tasks/LAUNCH_CHECKLIST.md` (or relevant task file)
2. Find tasks marked ⬜ Not Started or 🟡 In Progress
3. Present next actionable task with clear objective

When executing a task:
1. Read full task section
2. Follow steps sequentially
3. Run commands exactly as written
4. Verify acceptance criteria
5. Update status emoji when complete

**Task discovery:**
```bash
# Find incomplete tasks
grep "Status: ⬜" .tasks/*.md

# Show current phase
head -20 .tasks/LAUNCH_CHECKLIST.md
```

See `~/Source/.claude/TASK_MANAGEMENT.md` for full system documentation.
