# App Store screenshots

## iphone-6.9/ — ready-to-upload set

Exact **1320 × 2868 px** (iPhone 6.9" requirement, the only mandatory iPhone
size). Captured from the web build (identical RN components rendered by
react-native-web) headlessly in Chrome at 440×956 logical / 3× scale, with
seeded AsyncStorage for realistic content:

| File | Shows |
|---|---|
| 01-focus.png | Focus session running (14:34, session 3 of 4) |
| 02-break-verse.png | Short break with Scripture verse (Matthew 11:28) |
| 03-stats.png | Stats sheet — 6 today, 21-day streak, 7-day chart |
| 04-durations.png | Custom durations sheet |
| 05-sounds.png | Alarm sound picker (Church Bell selected) |

Suggested upload order: 02 (verse — the differentiator) first, then 01, 03,
04, 05.

**Caveat:** these are web-render captures with no iOS status bar. Apple
accepts status-bar-less screenshots, and the UI is pixel-identical to the
native render for this app. If you'd rather use true device captures, take
them on the TestFlight build (Settings → any sheet) and either upload
1290×2796-cropped versions from a 6.9" device or re-frame them; the capture
scripts are in this folder for regenerating the web set after UI changes.

## Regenerating

```bash
npx expo start --web --port 8085        # in the app root
node docs/screenshots/capture.js docs/screenshots/iphone-6.9   # needs puppeteer-core + Chrome
node docs/screenshots/capture-sounds.js docs/screenshots/iphone-6.9
```

## iPad

Not needed — v1 is iPhone-only (`supportsTablet: false`). If iPad support is
added later, rerun capture.js with viewport 1032×1376 @ 2× (13" — 2064×2752)
after checking the layout.
