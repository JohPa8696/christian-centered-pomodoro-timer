# Sacred Focus — App Store Connect Listing Kit

Everything to paste into App Store Connect when creating the app record.
Character limits noted; all values verified against them.

---

## App record (New App form)

| Field | Value |
|---|---|
| Platform | iOS |
| Name | `Sacred Focus` |
| Primary language | English (U.S.) |
| Bundle ID | `com.johpham.sacredfocus` (select from dropdown after first EAS build registers it) |
| SKU | `sacred-focus-ios` |
| User access | Full Access |

> If "Sacred Focus" is taken, fallback names (30 char max):
> `Sacred Focus — Faith Pomodoro` (29) or `Sacred Focus: Prayer Timer` (26)

## Listing

**Subtitle** (30 char max):

```
Pomodoro timer with Scripture
```
(29 chars)

**Promotional text** (170 char max — editable without a new build):

```
Work with focus. Rest with purpose. A clean Pomodoro timer that turns every break into a quiet moment with Scripture.
```
(118 chars)

**Description** (4000 char max):

```
Sacred Focus is a Pomodoro timer with a Christian touch. Work in focused
25-minute sessions — and when it's time to rest, a calming Scripture verse
appears, turning every break into a small moment of spiritual re-centering.

THE RHYTHM
• Classic Pomodoro cycle: 25 minutes of focus, 5-minute short breaks, and a
  15-minute long break after four sessions
• Auto-advance keeps the rhythm going — no tapping between phases
• A progress ring and session dots show exactly where you are in the cycle
• Fully adjustable durations to match how you work

SCRIPTURE DURING BREAKS
• 196 hand-curated verses on rest, peace, and trust in God
• Drawn verbatim from the Douay-Rheims Bible (Challoner revision) — a classic
  Catholic translation in the public domain
• Verses appear only during breaks; focus time stays quiet and distraction-free

MADE TO STAY OUT OF YOUR WAY
• Completion sounds you can choose — including a church bell
• Local notifications when a session ends, even with the app in the background
• The timer keeps accurate time if you leave and come back, like the built-in
  Clock app
• Stats: sessions today, day streak, all-time count, and a 7-day chart

PRIVATE BY DESIGN
• No account, no sign-up, no ads, no analytics
• Nothing ever leaves your device — everything is stored locally
• Works completely offline

Whether you're studying, working, writing, or praying through a busy day,
Sacred Focus helps you do the work in front of you — and rest in what matters.
```
(~1,450 chars — room to grow later)

**Keywords** (100 char max, comma-separated, no spaces after commas):

```
pomodoro,focus,timer,study,productivity,bible,scripture,verse,catholic,christian,prayer,work,break
```
(99 chars)

**URLs**

| Field | Value |
|---|---|
| Support URL | `https://github.com/JohPa8696/christian-centered-pomodoro-timer` |
| Marketing URL (optional) | `https://johnpham.dev` |
| Privacy Policy URL | `https://johnpham.dev/sacred-focus/privacy` |

## App Information

| Field | Value |
|---|---|
| Primary category | Productivity |
| Secondary category | Lifestyle |
| Content rights | Does not contain third-party content (Douay-Rheims is public domain) |
| Age rating | 4+ — answer **No/None** to every questionnaire item |
| Copyright | © 2026 John Pham |

## App Privacy section

- Privacy policy URL: `https://johnpham.dev/sacred-focus/privacy`
- Data collection: **"Data Not Collected"** — answer **No** to all data-type
  questions. (True: no analytics, no crash reporting, no accounts; AsyncStorage
  is on-device only and does not count as collection.)

## Pricing & Availability

- Price: Free
- Availability: all territories (default)

## App Review Information

| Field | Value |
|---|---|
| Sign-in required | No — no account system |
| Contact | John Pham + phone/email (fill in ASC) |
| Notes | See below |

**Review notes:**

```
Sacred Focus is a fully offline Pomodoro focus timer. No account or sign-in is
required. All data is stored locally on-device; the app makes no network
requests.

To test quickly: tap Start, then use the Skip button to advance through
work/break phases without waiting. Scripture verses (public-domain
Douay-Rheims translation) appear during break phases only. The gear icon
(top right) opens Settings: Durations, Alarm Sound, and Stats.

Notification permission is requested on first launch and is used solely for
local notifications that fire when a timer phase completes while the app is
backgrounded.
```

## Version info

- Version: `1.0.0` (matches app.json; build number auto-increments via EAS)
- "What's New": n/a for first release

---

## Screenshot requirements (see docs/screenshots-plan.md)

- **6.9" iPhone** (required): 1320 × 2868 px (or 1290 × 2796) — up to 10, min 1
- iPad: not required — v1 is iPhone-only (`supportsTablet: false`).
