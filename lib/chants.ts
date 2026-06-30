import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

/**
 * Gregorian chant / hymns played softly DURING breaks, then stopped when work
 * resumes. This is distinct from the completion alarm (lib/sounds.ts): chants
 * loop for the length of a break rather than playing once.
 *
 * Audio files are bundled (public-domain / royalty-free). Add files under
 * assets/chants/ and register them in CHANT_OPTIONS below (require() needs
 * static literal paths). Until real files are added, the catalog may be empty
 * and the feature simply no-ops.
 *
 * Sourcing: Pixabay, archive.org, Wikimedia Commons — calming, longer tracks
 * loop best. See README / project notes.
 */

// Chant catalog. To add a track: drop the file in assets/chants/, then add a
// line here with a unique id, a label, and require(its path).
//
// Example once you have files:
//   { id: 'salve-regina', label: 'Salve Regina', asset: require('../assets/chants/salve-regina.mp3') },
export const CHANT_OPTIONS: { id: string; label: string; asset: number }[] = [
  // (placeholder — add real chant files here)
];

export type ChantId = string;
export const DEFAULT_CHANT_ID: ChantId | null =
  CHANT_OPTIONS.length > 0 ? CHANT_OPTIONS[0].id : null;

const optionById = (id: ChantId) => CHANT_OPTIONS.find((o) => o.id === id);

// Preloaded players, one per chant.
const players: Record<string, AudioPlayer> = {};

// Whether chants should play during breaks at all (Settings toggle), and which
// chant is selected. Held at module scope so the timer reads the latest values.
let chantsEnabled = true;
let activeChantId: ChantId | null = DEFAULT_CHANT_ID;

export function setChantsEnabled(enabled: boolean): void {
  chantsEnabled = enabled;
  if (!enabled) stopChant();
}
export function getChantsEnabled(): boolean {
  return chantsEnabled;
}
export function setActiveChant(id: ChantId): void {
  activeChantId = id;
}
export function getActiveChant(): ChantId | null {
  return activeChantId;
}

/** Preload all chant tracks. Call once on app start (after initSounds). */
export function initChants(): void {
  try {
    for (const opt of CHANT_OPTIONS) {
      const player = createAudioPlayer(opt.asset);
      player.loop = true; // chants loop for the duration of the break
      players[opt.id] = player;
    }
  } catch (error) {
    console.error('Failed to init chants:', error);
  }
}

let activePlayer: AudioPlayer | null = null;

/**
 * Start the selected chant looping (for a break). No-ops if chants are
 * disabled, none is selected, or the catalog is empty.
 */
export function startChant(id: ChantId | null = activeChantId): void {
  try {
    if (!chantsEnabled || !id) return;
    const player = players[id];
    if (!player) return;
    stopChant(); // never overlap two chants
    player.seekTo(0);
    player.play();
    activePlayer = player;
  } catch (error) {
    console.error('Failed to start chant:', error);
  }
}

/** Stop the currently playing chant (work resumes, skip, or toggle off). */
export function stopChant(): void {
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

/** Preview a chant briefly in the picker (same as start; caller stops it). */
export function previewChant(id: ChantId): void {
  startChant(id);
}
