import { useState } from 'react';
import { View, Pressable } from 'react-native';
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
import { DurationsSheet } from '../components/DurationsSheet';
import { VerseDisplay } from '../components/VerseDisplay';
import { SESSIONS_PER_CYCLE, PHASE_COLORS } from '../lib/constants';
import { usePomodoro } from '../hooks/usePomodoro';
import { getVerseByIndex } from '../lib/verses';

export function TimerScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [durationsVisible, setDurationsVisible] = useState(false);

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
  const openDurations = () => {
    setSettingsVisible(false);
    setTimeout(() => setDurationsVisible(true), 250);
  };

  const {
    phase,
    minutes,
    seconds,
    currentSession,
    progress,
    isRunning,
    breakCount,
    startPause,
    skip,
  } = usePomodoro();

  // During breaks, show a Scripture verse (the heart of the faith-centered
  // experience). Work phases stay quiet and focused.
  const isBreak = phase === 'shortBreak' || phase === 'longBreak';
  const verse = getVerseByIndex(breakCount);

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
        <View className="mb-8">
          <CycleDots
            currentSession={currentSession}
            totalSessions={SESSIONS_PER_CYCLE}
          />
        </View>

        {/* Scripture during breaks — the faith-centered rest moment */}
        {isBreak && (
          <View className="mb-10 min-h-[120px] justify-center">
            <VerseDisplay verse={verse} />
          </View>
        )}

        {/* Controls */}
        <Controls
          isRunning={isRunning}
          onStartPause={startPause}
          onSkip={skip}
        />
      </View>

      <SettingsMenu
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onOpenStats={openStats}
        onOpenSound={openSound}
        onOpenDurations={openDurations}
      />

      <SoundPicker
        visible={soundPickerVisible}
        onClose={() => setSoundPickerVisible(false)}
      />

      <StatsSheet
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
      />

      <DurationsSheet
        visible={durationsVisible}
        onClose={() => setDurationsVisible(false)}
      />
    </SafeAreaView>
  );
}
