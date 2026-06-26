import { Pressable, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { ControlsProps } from '../lib/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Controls({ isRunning, onStartPause, onSkip }: ControlsProps) {
  return (
    <View className="flex-row gap-4">
      <AnimatedButton onPress={onStartPause} primary>
        <Text className="text-white text-lg font-semibold">
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </AnimatedButton>

      <AnimatedButton onPress={onSkip}>
        <Text className="text-white text-lg font-semibold">
          Skip
        </Text>
      </AnimatedButton>
    </View>
  );
}

function AnimatedButton({
  onPress,
  primary = false,
  children
}: {
  onPress: () => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.85, { damping: 5, stiffness: 100 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 3, stiffness: 80 }))}
      onPress={onPress}
      style={animatedStyle}
      className={`${primary ? 'bg-blue-500' : 'bg-neutral-700'} px-8 py-4 rounded-full`}
    >
      {children}
    </AnimatedPressable>
  );
}
