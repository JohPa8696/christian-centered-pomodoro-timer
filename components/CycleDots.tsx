import { View } from 'react-native';
import type { CycleDotsProps } from '../lib/types';

export function CycleDots({ currentSession, totalSessions }: CycleDotsProps) {
  return (
    <View className="flex-row gap-3">
      {Array.from({ length: totalSessions }).map((_, index) => {
        const isCompleted = index < currentSession;
        return (
          <View
            key={index}
            className={`w-3 h-3 rounded-full ${
              isCompleted ? 'bg-white' : 'bg-neutral-700'
            }`}
          />
        );
      })}
    </View>
  );
}
