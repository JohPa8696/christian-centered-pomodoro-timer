import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * In-app completion alarm. Plays a chosen sound when a phase ends. The
 * downloaded ringtones are full melodies that play through once. No haptics —
 * they don't sync cleanly with varied ringtone rhythms.
 *
 * Only covers the app-OPEN case; backgrounded completion uses the notification
 * sound — see lib/notifications.ts.
 */

// Sound catalog. `require` needs static literal paths, so we map them here.
// `durationMs` is the sound's length — used to delay auto-advance until the
// ringtone finishes, so the next phase doesn't start mid-sound.
export const SOUND_OPTIONS = [
  { id: 'ringtone-1', label: 'Ringtone 1', asset: require('../assets/sounds/ringtone-1.mp3'), durationMs: 8300 },
  { id: 'ringtone-2', label: 'Ringtone 2', asset: require('../assets/sounds/ringtone-2.mp3'), durationMs: 10100 },
  { id: 'ringtone-3', label: 'Ringtone 3', asset: require('../assets/sounds/ringtone-3.mp3'), durationMs: 6900 },
  { id: 'church-bell', label: 'Church Bell', asset: require('../assets/sounds/church-bell.mp3'), durationMs: 4400 },
  { id: 'marimba', label: 'Marimba', asset: require('../assets/sounds/marimba.wav'), durationMs: 450 },
  { id: 'beep', label: 'Beep', asset: require('../assets/sounds/beep.wav'), durationMs: 120 },
] as const;

export type SoundId = (typeof SOUND_OPTIONS)[number]['id'];
export const DEFAULT_SOUND_ID: SoundId = 'ringtone-1';

const optionById = (id: SoundId) => SOUND_OPTIONS.find((o) => o.id === id)!;

/** How long the given sound plays, in ms. Used to time the auto-advance delay. */
export function getSoundDurationMs(id: SoundId): number {
  return optionById(id).durationMs;
}

// One preloaded player per sound, so playback is instant.
const players: Partial<Record<SoundId, AudioPlayer>> = {};

// The currently selected completion sound. Held at module scope so the timer's
// completion handler always uses the latest choice without prop-threading.
let activeSoundId: SoundId = DEFAULT_SOUND_ID;

/** Set which sound the completion alarm uses. */
export function setActiveSound(id: SoundId): void {
  activeSoundId = id;
}

/** Get the currently selected completion sound. */
export function getActiveSound(): SoundId {
  return activeSoundId;
}

/**
 * Preload all sounds and allow playback through the silent switch (like an
 * alarm). Call once on app start.
 */
export async function initSounds(): Promise<void> {
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
    for (const opt of SOUND_OPTIONS) {
      players[opt.id] = createAudioPlayer(opt.asset);
    }
  } catch (error) {
    console.error('Failed to init sounds:', error);
  }
}

// Tracks the player currently sounding, so we can stop it on skip/restart.
let activePlayer: AudioPlayer | null = null;

/** Play a sound once from the start. Used for both previews and the real alarm. */
function playOnce(id: SoundId): void {
  stopSound(); // stop anything already playing
  const player = players[id];
  if (!player) return;
  player.seekTo(0);
  player.play();
  activePlayer = player;
}

/** Preview a sound — used in the picker. */
export function previewSound(id: SoundId): void {
  try {
    playOnce(id);
  } catch (error) {
    console.error('Failed to preview sound:', error);
  }
}

/**
 * Play the completion alarm: the chosen sound plays through once. Calling again
 * restarts cleanly.
 */
export function playCompletionAlarm(id: SoundId = activeSoundId): void {
  try {
    playOnce(id);
  } catch (error) {
    console.error('Failed to play completion alarm:', error);
  }
}

/**
 * Stop whatever sound is currently playing (a preview or the completion alarm).
 */
export function stopSound(): void {
  try {
    if (activePlayer) {
      activePlayer.pause();
      activePlayer.seekTo(0);
      activePlayer = null;
    }
  } catch {
    // player may already be released — safe to ignore
  }
}

/** Back-compat alias — the timer stops the post-completion alarm via this name. */
export const stopCompletionAlarm = stopSound;
