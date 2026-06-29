import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenStats: () => void;
  onOpenSound: () => void;
  onOpenDurations: () => void;
}

// Menu rows. `disabled` items are shown as "coming soon" placeholders so the
// menu hints at the roadmap without dead-ends.
type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  action: 'stats' | 'sound' | 'durations' | null;
};

const ROWS: Row[] = [
  { icon: 'time-outline', label: 'Durations', sub: 'Focus & break lengths', action: 'durations' },
  { icon: 'musical-note', label: 'Alarm Sound', sub: 'Choose completion sound', action: 'sound' },
  { icon: 'stats-chart', label: 'Stats', sub: 'Focus history & streak', action: 'stats' },
];

/**
 * Settings bottom-sheet — a single entry point that routes to Durations, Alarm
 * Sound, and Stats. Keeps the timer header to one clean icon.
 */
export function SettingsMenu({
  visible,
  onClose,
  onOpenStats,
  onOpenSound,
  onOpenDurations,
}: SettingsMenuProps) {
  const handlePress = (action: Row['action']) => {
    if (action === 'stats') onOpenStats();
    else if (action === 'sound') onOpenSound();
    else if (action === 'durations') onOpenDurations();
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
            <Text className="text-white text-2xl font-bold tracking-tight">Settings</Text>
          </View>

          {/* Rows */}
          <View className="gap-2">
            {ROWS.map((row) => {
              const disabled = row.action === null;
              return (
                <Pressable
                  key={row.label}
                  onPress={() => !disabled && handlePress(row.action)}
                  disabled={disabled}
                  className={`flex-row items-center py-3.5 px-4 rounded-2xl bg-neutral-800/70 ${
                    disabled ? 'opacity-40' : 'active:bg-neutral-700/70'
                  }`}
                >
                  <View className="w-10 h-10 rounded-full bg-neutral-700/60 items-center justify-center mr-3">
                    <Ionicons name={row.icon} size={20} color="#e5e5e5" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-neutral-100 text-base font-medium">{row.label}</Text>
                    <Text className="text-neutral-500 text-xs mt-0.5">{row.sub}</Text>
                  </View>
                  {!disabled && (
                    <Ionicons name="chevron-forward" size={18} color="#737373" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Done */}
          <Pressable
            onPress={onClose}
            className="mt-6 bg-neutral-800 py-4 rounded-2xl items-center active:bg-neutral-700"
          >
            <Text className="text-white text-base font-semibold">Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
