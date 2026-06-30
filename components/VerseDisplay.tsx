import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { Verse } from '../lib/verses';

interface VerseDisplayProps {
  verse: Verse;
}

/**
 * A break-time Scripture card. Calm, centered typography with a gentle fade +
 * rise on mount, so it appears softly when a break begins. Re-fades whenever the
 * verse changes (keyed by reference).
 */
export function VerseDisplay({ verse }: VerseDisplayProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    // Reset then animate in whenever the verse changes.
    opacity.value = 0;
    translateY.value = 8;
    opacity.value = withTiming(1, { duration: 900 });
    translateY.value = withTiming(0, { duration: 900 });
  }, [verse.reference]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="px-8 items-center">
      <Text className="text-neutral-100 text-lg leading-7 text-center font-light italic">
        “{verse.text}”
      </Text>
      <Text className="text-neutral-500 text-sm mt-4 tracking-wide uppercase">
        {verse.reference}
      </Text>
    </Animated.View>
  );
}
