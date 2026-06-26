import { Text } from 'react-native';
import type { TimerDisplayProps } from '../lib/types';

export function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <Text className="text-7xl font-bold text-white">
      {formattedMinutes}:{formattedSeconds}
    </Text>
  );
}
