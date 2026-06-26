import { Text } from 'react-native';
import { PHASE_LABELS } from '../lib/constants';
import type { PhaseLabelProps } from '../lib/types';

export function PhaseLabel({ phase }: PhaseLabelProps) {
  return (
    <Text className="text-sm text-neutral-400 uppercase tracking-wider">
      {PHASE_LABELS[phase]}
    </Text>
  );
}
