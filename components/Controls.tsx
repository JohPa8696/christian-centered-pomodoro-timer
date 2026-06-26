import { Pressable, Text, View } from 'react-native';
import type { ControlsProps } from '../lib/types';

export function Controls({ isRunning, onStartPause, onSkip }: ControlsProps) {
  return (
    <View className="flex-row gap-4">
      <Pressable
        onPress={onStartPause}
        className="bg-blue-500 px-8 py-4 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onSkip}
        className="bg-neutral-700 px-8 py-4 rounded-full"
      >
        <Text className="text-white text-lg font-semibold">
          Skip
        </Text>
      </Pressable>
    </View>
  );
}
