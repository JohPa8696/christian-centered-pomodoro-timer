import { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DURATIONS, DURATION_LIMITS, PHASE_COLORS } from '../lib/constants';
import { getActiveDurations, setActiveDurations } from '../lib/durations';
import type { Phase } from '../lib/types';

interface DurationsSheetProps {
  visible: boolean;
  onClose: () => void;
}

// Rows to render, in order. Labels match the phases.
const ROWS: { phase: Phase; label: string }[] = [
  { phase: 'work', label: 'Focus' },
  { phase: 'shortBreak', label: 'Short Break' },
  { phase: 'longBreak', label: 'Long Break' },
];

/**
 * Bottom-sheet to customize phase durations with − / + steppers. Changes apply
 * from the next phase (the running timer keeps its current length). Values are
 * edited in minutes here and stored in seconds.
 */
export function DurationsSheet({ visible, onClose }: DurationsSheetProps) {
  // Local working copy in MINUTES, seeded from the active (saved) durations.
  const [mins, setMins] = useState({ work: 25, shortBreak: 5, longBreak: 15 });

  // Re-seed from active durations each time the sheet opens.
  useEffect(() => {
    if (!visible) return;
    const active = getActiveDurations();
    setMins({
      work: Math.round(active.work / 60),
      shortBreak: Math.round(active.shortBreak / 60),
      longBreak: Math.round(active.longBreak / 60),
    });
  }, [visible]);

  const adjust = (phase: Phase, dir: -1 | 1) => {
    const { min, max, step } = DURATION_LIMITS[phase];
    setMins((prev) => {
      const next = Math.min(max, Math.max(min, prev[phase] + dir * step));
      return { ...prev, [phase]: next };
    });
  };

  // Persist (convert minutes → seconds) and close.
  const handleSave = () => {
    setActiveDurations({
      work: mins.work * 60,
      shortBreak: mins.shortBreak * 60,
      longBreak: mins.longBreak * 60,
    });
    onClose();
  };

  // Reset working copy to the app defaults (not yet saved until "Save").
  const handleReset = () => {
    setMins({
      work: DURATIONS.work / 60,
      shortBreak: DURATIONS.shortBreak / 60,
      longBreak: DURATIONS.longBreak / 60,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
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
            <Text className="text-white text-2xl font-bold tracking-tight">Durations</Text>
            <Text className="text-neutral-500 text-sm mt-1">
              Changes apply from the next phase
            </Text>
          </View>

          {/* Stepper rows */}
          <View className="gap-2">
            {ROWS.map(({ phase, label }) => {
              const { min, max } = DURATION_LIMITS[phase];
              const value = mins[phase];
              const atMin = value <= min;
              const atMax = value >= max;
              return (
                <View
                  key={phase}
                  className="flex-row items-center justify-between bg-neutral-800/70 rounded-2xl px-4 py-3"
                >
                  {/* Color dot + label */}
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-2.5 h-2.5 rounded-full mr-3"
                      style={{ backgroundColor: PHASE_COLORS[phase] }}
                    />
                    <Text className="text-neutral-100 text-base">{label}</Text>
                  </View>

                  {/* Stepper */}
                  <View className="flex-row items-center">
                    <StepperButton
                      icon="remove"
                      disabled={atMin}
                      onPress={() => adjust(phase, -1)}
                    />
                    <Text className="text-white text-base font-semibold w-16 text-center">
                      {value} min
                    </Text>
                    <StepperButton
                      icon="add"
                      disabled={atMax}
                      onPress={() => adjust(phase, 1)}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Reset to defaults */}
          <Pressable onPress={handleReset} className="mt-4 py-2 items-center">
            <Text className="text-neutral-500 text-sm">Reset to defaults</Text>
          </Pressable>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            className="mt-2 bg-blue-500 py-4 rounded-2xl items-center active:bg-blue-600"
          >
            <Text className="text-white text-base font-semibold">Save</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** A round − / + button; dimmed and non-interactive at its limit. */
function StepperButton({
  icon,
  disabled,
  onPress,
}: {
  icon: 'add' | 'remove';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => !disabled && onPress()}
      disabled={disabled}
      className={`w-9 h-9 rounded-full items-center justify-center ${
        disabled ? 'bg-neutral-800 opacity-40' : 'bg-neutral-700 active:bg-neutral-600'
      }`}
    >
      <Ionicons name={icon} size={18} color="#ffffff" />
    </Pressable>
  );
}
