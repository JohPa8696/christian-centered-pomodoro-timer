import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressRing } from '../components/ProgressRing';
import { TimerDisplay } from '../components/TimerDisplay';
import { PhaseLabel } from '../components/PhaseLabel';
import { CycleDots } from '../components/CycleDots';
import { Controls } from '../components/Controls';
import { SESSIONS_PER_CYCLE, PHASE_COLORS } from '../lib/constants';

export function TimerScreen() {
  // Temporary hardcoded values for static UI
  const phase = 'work';
  const minutes = 25;
  const seconds = 0;
  const currentSession = 1;
  const progress = 0;
  const isRunning = false;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        {/* Progress Ring with Timer inside */}
        <View className="items-center justify-center mb-12">
          <ProgressRing
            progress={progress}
            color={PHASE_COLORS[phase]}
            size={280}
            strokeWidth={12}
          />
          <View className="absolute items-center">
            <PhaseLabel phase={phase} />
            <View className="mt-4">
              <TimerDisplay minutes={minutes} seconds={seconds} />
            </View>
          </View>
        </View>

        {/* Cycle Dots */}
        <View className="mb-12">
          <CycleDots
            currentSession={currentSession}
            totalSessions={SESSIONS_PER_CYCLE}
          />
        </View>

        {/* Controls */}
        <Controls
          isRunning={isRunning}
          onStartPause={() => console.log('Start/Pause')}
          onSkip={() => console.log('Skip')}
        />
      </View>
    </SafeAreaView>
  );
}
