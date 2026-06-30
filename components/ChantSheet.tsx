import { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CHANT_OPTIONS,
  previewChant,
  stopChant,
  setActiveChant,
  getActiveChant,
  setChantsEnabled,
  getChantsEnabled,
  type ChantId,
} from '../lib/chants';
import { saveChantId, saveChantsEnabled } from '../lib/storage';

interface ChantSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Bottom-sheet to enable/disable break chants and pick which one plays. Chants
 * loop softly during breaks (paired with the Scripture verse). Tapping a row
 * previews + selects it; closing stops any preview.
 */
export function ChantSheet({ visible, onClose }: ChantSheetProps) {
  const [enabled, setEnabled] = useState(getChantsEnabled());
  const [selected, setSelected] = useState<ChantId | null>(getActiveChant());

  // Re-sync from module state each open.
  useEffect(() => {
    if (!visible) return;
    setEnabled(getChantsEnabled());
    setSelected(getActiveChant());
  }, [visible]);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    setChantsEnabled(value);
    saveChantsEnabled(value);
    if (!value) stopChant();
  };

  const handleSelect = (id: ChantId) => {
    setSelected(id);
    setActiveChant(id);
    saveChantId(id);
    if (enabled) previewChant(id); // hear it immediately
  };

  const handleClose = () => {
    stopChant();
    onClose();
  };

  const hasChants = CHANT_OPTIONS.length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={handleClose}>
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
            <Text className="text-white text-2xl font-bold tracking-tight">Break Chant</Text>
            <Text className="text-neutral-500 text-sm mt-1">
              Gregorian chant plays softly during breaks
            </Text>
          </View>

          {/* Enable toggle */}
          <View className="flex-row items-center justify-between bg-neutral-800/70 rounded-2xl px-4 py-3.5 mb-4">
            <Text className="text-neutral-100 text-base">Play chant during breaks</Text>
            <Switch
              value={enabled}
              onValueChange={handleToggle}
              trackColor={{ false: '#404040', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Chant list, or empty state */}
          {hasChants ? (
            <View className={`gap-2 ${enabled ? '' : 'opacity-40'}`} pointerEvents={enabled ? 'auto' : 'none'}>
              {CHANT_OPTIONS.map((opt) => {
                const isSelected = opt.id === selected;
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
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                        isSelected ? 'bg-blue-500/25' : 'bg-neutral-700/60'
                      }`}
                    >
                      <Ionicons
                        name="leaf-outline"
                        size={18}
                        color={isSelected ? '#60a5fa' : '#d4d4d4'}
                      />
                    </View>
                    <Text
                      className={`flex-1 text-base ${
                        isSelected ? 'text-white font-semibold' : 'text-neutral-200'
                      }`}
                    >
                      {opt.label}
                    </Text>
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
          ) : (
            <View className="bg-neutral-800/50 rounded-2xl px-4 py-5 items-center">
              <Ionicons name="leaf-outline" size={24} color="#737373" />
              <Text className="text-neutral-400 text-sm text-center mt-2">
                No chants added yet. Chant tracks will appear here once bundled.
              </Text>
            </View>
          )}

          {/* Done */}
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
