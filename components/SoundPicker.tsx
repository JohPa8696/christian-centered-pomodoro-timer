import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  SOUND_OPTIONS,
  previewSound,
  stopSound,
  setActiveSound,
  getActiveSound,
  getSoundDurationMs,
  type SoundId,
} from '../lib/sounds';
import { saveSoundId } from '../lib/storage';

interface SoundPickerProps {
  visible: boolean;
  onClose: () => void;
}

// A vector icon per sound, so the list reads visually and matches the rest of
// the UI's icon set. Keyed by sound id.
const SOUND_ICONS: Record<SoundId, keyof typeof Ionicons.glyphMap> = {
  'ringtone-1': 'notifications',
  'ringtone-2': 'musical-notes',
  'ringtone-3': 'notifications-circle',
  'church-bell': 'notifications-circle-outline',
  marimba: 'musical-note',
  beep: 'radio',
};

/**
 * Bottom-sheet picker for the completion sound. Tapping a row previews + selects
 * it (persisted immediately); the playing row shows an animated-looking
 * indicator. Closing stops any preview that's still playing.
 */
export function SoundPicker({ visible, onClose }: SoundPickerProps) {
  const [selected, setSelected] = useState<SoundId>(getActiveSound());
  const [playingId, setPlayingId] = useState<SoundId | null>(null);

  // Clears the "Playing…" label once the preview finishes.
  const playingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPlayingTimer = () => {
    if (playingTimeout.current !== null) {
      clearTimeout(playingTimeout.current);
      playingTimeout.current = null;
    }
  };

  const handleSelect = (id: SoundId) => {
    setSelected(id);
    setActiveSound(id);
    saveSoundId(id);
    setPlayingId(id);
    previewSound(id); // hear it immediately

    // Clear the "Playing…" indicator when the sound is expected to finish.
    clearPlayingTimer();
    playingTimeout.current = setTimeout(() => {
      setPlayingId(null);
      playingTimeout.current = null;
    }, getSoundDurationMs(id));
  };

  // Stop any preview and close.
  const handleClose = () => {
    clearPlayingTimer();
    stopSound();
    setPlayingId(null);
    onClose();
  };

  // Safety: stop preview if the component unmounts while a sound is playing.
  useEffect(() => {
    return () => {
      clearPlayingTimer();
      stopSound();
    };
  }, []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      {/* Dim backdrop — tap to dismiss */}
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={handleClose}>
        {/* Sheet — stop propagation so taps inside don't dismiss */}
        <Pressable
          className="bg-neutral-900 rounded-t-[28px] px-5 pt-3 pb-10 border-t border-neutral-800"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Grab handle */}
          <View className="items-center mb-5">
            <View className="w-10 h-1.5 rounded-full bg-neutral-700" />
          </View>

          {/* Header */}
          <View className="mb-5 px-1">
            <Text className="text-white text-2xl font-bold tracking-tight">
              Alarm Sound
            </Text>
            <Text className="text-neutral-500 text-sm mt-1">
              Plays when a session ends. Tap to preview.
            </Text>
          </View>

          {/* Sound rows */}
          <View className="gap-2">
            {SOUND_OPTIONS.map((opt) => {
              const isSelected = opt.id === selected;
              const isPlaying = opt.id === playingId;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleSelect(opt.id)}
                  className={`flex-row items-center py-3.5 px-4 rounded-2xl ${
                    isSelected
                      ? 'bg-blue-500/15 border border-blue-500/80'
                      : 'bg-neutral-800/70 border border-transparent'
                  }`}
                >
                  {/* Icon bubble */}
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      isSelected ? 'bg-blue-500/25' : 'bg-neutral-700/60'
                    }`}
                  >
                    <Ionicons
                      name={SOUND_ICONS[opt.id]}
                      size={18}
                      color={isSelected ? '#60a5fa' : '#d4d4d4'}
                    />
                  </View>

                  {/* Label + playing hint */}
                  <View className="flex-1">
                    <Text
                      className={`text-base ${
                        isSelected ? 'text-white font-semibold' : 'text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </Text>
                    {isPlaying && (
                      <Text className="text-blue-400 text-xs mt-0.5">Playing…</Text>
                    )}
                  </View>

                  {/* Trailing check / play indicator */}
                  {isSelected ? (
                    <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                      <Ionicons name="checkmark" size={14} color="#ffffff" />
                    </View>
                  ) : (
                    <Ionicons name="play" size={16} color="#737373" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Done button */}
          <Pressable
            onPress={handleClose}
            className="mt-6 bg-blue-500 py-4 rounded-2xl items-center active:bg-blue-600"
          >
            <Text className="text-white text-base font-semibold">Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
