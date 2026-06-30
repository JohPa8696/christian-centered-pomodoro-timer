# Sacred Focus

A faith-centered Pomodoro focus timer for Catholics and Christians. Work in
focused sessions, and during each break receive a calming verse of Scripture —
turning rest between work into a small moment of spiritual re-centering.

> *"Come to me, all you that labour, and are burdened, and I will refresh you."*
> — Matthew 11:28 (Douay-Rheims)

Built with React Native + Expo as a learning project.

## Features

- **Pomodoro cycle** — 25m focus / 5m short break / 15m long break, 4 sessions
  per cycle, with automatic phase transitions.
- **Scripture during breaks** — 196 curated verses on themes of rest, peace,
  trust, and God's care, shown with a gentle fade-in. Work phases stay quiet.
- **Progress ring + cycle tracker** — animated SVG ring and session dots.
- **Completion sounds** — choose from several alarm sounds; plays through the
  silent switch like a real timer. Auto-advance waits for the sound to finish.
- **Custom durations** — set your own focus/break lengths (changes apply next
  phase).
- **Focus stats** — completed sessions, daily streak, all-time totals, and a
  7-day bar chart.
- **Background-aware** — like the iOS Clock, the timer keeps correct time when
  backgrounded or closed, with a local notification when a phase ends.
- **Persistence** — resumes where you left off, even after a full app close.

Everything is **local-only** — no account, no backend, no cloud sync.

## Scripture source

Verses use the **Douay-Rheims (Challoner revision, 1899 American Edition)** — a
Catholic translation in the public domain. The reference list is hand-curated for
calming/encouraging themes; the verse text is pulled verbatim from a verified
dataset (not transcribed by hand) so wording and references are accurate. Book
names display in the traditional Catholic form (Apocalypse, Isaias, Ecclesiasticus).

## Tech stack

- [Expo](https://expo.dev) SDK 54, React Native 0.81, React 19, TypeScript
- [NativeWind](https://www.nativewind.dev) v4 (Tailwind CSS for React Native)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) 4 for animations
- `react-native-svg` (progress ring), `@expo/vector-icons` (UI icons)
- `expo-audio` (sounds), `expo-notifications` (background alerts),
  AsyncStorage (persistence)

## Running locally

Requires [Node 20+](https://nodejs.org) and the **Expo Go** app on your phone
(from the App Store / Play Store).

```bash
npm install
npm start
```

Then scan the QR code with Expo Go (iPhone: Camera app; Android: Expo Go's
scanner). Make sure your phone and computer are on the same Wi-Fi.

> Tip: use the **Skip** control to fast-test phase transitions without waiting.

## Project structure

```
App.tsx                  Root: styles, permissions, sound preload
screens/TimerScreen.tsx  Main screen: ring, verse, controls, settings sheets
hooks/usePomodoro.ts     Timer state machine, persistence, background handling
components/              UI components (ring, dots, verse, settings sheets, …)
lib/                     Logic: durations, sounds, notifications, storage, stats, verses
```

## Roadmap

- [ ] iOS Live Activities (Dynamic Island timer pill) — needs a dev build
- [ ] Custom notification sound when backgrounded
- [ ] Gregorian chant / hymns during breaks
- [ ] Liturgical season theming
- [ ] TestFlight & App Store release

## License

Code is released under the [MIT License](LICENSE). The Douay-Rheims Bible text
is in the public domain.

---

*Ora et labora — pray and work.*
