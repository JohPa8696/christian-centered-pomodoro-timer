import { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '../components/ProgressRing';
import { TimerDisplay } from '../components/TimerDisplay';
import { PhaseLabel } from '../components/PhaseLabel';
import { CycleDots } from '../components/CycleDots';
import { Controls } from '../components/Controls';
import { SettingsMenu } from '../components/SettingsMenu';
import { SoundPicker } from '../components/SoundPicker';
import { StatsSheet } from '../components/StatsSheet';
import { SESSIONS_PER_CYCLE, PHASE_COLORS } from '../lib/constants';
import { usePomodoro } from '../hooks/usePomodoro';

export function TimerScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  // Open a sub-sheet from the settings menu. Close the menu first, then open the
  // chosen sheet after a beat — presenting a new modal while another is still
  // dismissing can race on iOS and leave a blank sheet.
  const openStats = () => {
    setSettingsVisible(false);
    setTimeout(() => setStatsVisible(true), 250);
  };
  const openSound = () => {
    setSettingsVisible(false);
    setTimeout(() => setSoundPickerVisible(true), 250);
  };

  const {
    phase,
    minutes,
    seconds,
    currentSession,
    progress,
    isRunning,
    startPause,
    skip,
    jumpToEnd,
  } = usePomodoro();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      {/* Header row — single settings button (top right) */}
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable
          onPress={() => setSettingsVisible(true)}
          className="bg-neutral-800 w-11 h-11 rounded-full items-center justify-center active:bg-neutral-700"
        >
          <Ionicons name="settings-outline" size={22} color="#e5e5e5" />
        </Pressable>
      </View>

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
          onStartPause={startPause}
          onSkip={skip}
        />

        {/* DEV ONLY: jump to 3s left to test completion chime/buzz quickly.
            __DEV__ is false in production builds, so this auto-hides on ship. */}
        {__DEV__ && (
          <Pressable
            onPress={jumpToEnd}
            className="mt-10 bg-amber-700/40 border border-amber-600 px-4 py-2 rounded"
          >
            <Text className="text-amber-300 text-xs">DEV: jump to 0:03</Text>
          </Pressable>
        )}
      </View>

      <SettingsMenu
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onOpenStats={openStats}
        onOpenSound={openSound}
      />

      <SoundPicker
        visible={soundPickerVisible}
        onClose={() => setSoundPickerVisible(false)}
      />

      <StatsSheet
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
      />
    </SafeAreaView>
  );
}
