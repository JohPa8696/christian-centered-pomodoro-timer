import { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Alert } from 'react-native';
import { loadHistory, computeStats, clearHistory, type Stats } from '../lib/stats';

interface StatsSheetProps {
  visible: boolean;
  onClose: () => void;
}

/** Format a number of seconds as "Xh Ym" / "Ym" / "0m". */
function formatDuration(totalSec: number): string {
  const mins = Math.round(totalSec / 60);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Bottom-sheet showing focus stats: today, streak, all-time totals, and a
 * last-7-days bar chart. Recomputed each time the sheet opens.
 */
export function StatsSheet({ visible, onClose }: StatsSheetProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  // Recompute whenever the sheet becomes visible.
  useEffect(() => {
    if (!visible) return;
    (async () => {
      const history = await loadHistory();
      setStats(computeStats(history, Date.now()));
    })();
  }, [visible]);

  const handleReset = () => {
    Alert.alert(
      'Reset Stats?',
      'This permanently deletes your entire focus history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setStats(computeStats([], Date.now()));
          },
        },
      ]
    );
  };

  const maxBar = stats ? Math.max(1, ...stats.last7Days.map((d) => d.count)) : 1;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
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
            <Text className="text-white text-2xl font-bold tracking-tight">
              Your Focus
            </Text>
            <Text className="text-neutral-500 text-sm mt-1">
              Completed focus sessions only
            </Text>
          </View>

          {stats && (
            <>
              {/* Top stat cards */}
              <View className="flex-row gap-3 mb-3">
                <StatCard
                  label="Today"
                  value={String(stats.todayCount)}
                  sub={formatDuration(stats.todayFocusSec)}
                  accent="text-blue-400"
                />
                <StatCard
                  label="Streak"
                  value={String(stats.streakDays)}
                  sub={stats.streakDays === 1 ? 'day' : 'days'}
                  accent="text-orange-400"
                />
              </View>

              {/* All-time card */}
              <View className="bg-neutral-800/70 rounded-2xl px-4 py-4 mb-5 flex-row justify-between items-center">
                <View>
                  <Text className="text-neutral-400 text-xs uppercase tracking-wide">
                    All Time
                  </Text>
                  <Text className="text-white text-lg font-semibold mt-1">
                    {stats.totalCount} sessions
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-neutral-400 text-xs uppercase tracking-wide">
                    Focus Time
                  </Text>
                  <Text className="text-white text-lg font-semibold mt-1">
                    {formatDuration(stats.totalFocusSec)}
                  </Text>
                </View>
              </View>

              {/* Last 7 days bar chart */}
              <Text className="text-neutral-400 text-xs uppercase tracking-wide mb-3 px-1">
                Last 7 Days
              </Text>
              <View className="flex-row justify-between items-end h-28 mb-2">
                {stats.last7Days.map((day, i) => {
                  const heightPct = (day.count / maxBar) * 100;
                  return (
                    <View key={i} className="flex-1 items-center justify-end h-full">
                      {day.count > 0 && (
                        <Text className="text-neutral-300 text-xs mb-1">{day.count}</Text>
                      )}
                      <View
                        className={`w-6 rounded-t-md ${
                          day.count > 0 ? 'bg-blue-500' : 'bg-neutral-800'
                        }`}
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <Text className="text-neutral-500 text-[10px] mt-1.5">
                        {day.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Actions */}
          <Pressable
            onPress={onClose}
            className="mt-6 bg-blue-500 py-4 rounded-2xl items-center active:bg-blue-600"
          >
            <Text className="text-white text-base font-semibold">Done</Text>
          </Pressable>
          <Pressable onPress={handleReset} className="mt-3 py-2 items-center">
            <Text className="text-neutral-500 text-sm">Reset stats</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** A compact stat card for the top row. */
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <View className="flex-1 bg-neutral-800/70 rounded-2xl px-4 py-4">
      <Text className="text-neutral-400 text-xs uppercase tracking-wide">{label}</Text>
      <Text className={`text-3xl font-bold mt-1 ${accent}`}>{value}</Text>
      <Text className="text-neutral-500 text-sm mt-0.5">{sub}</Text>
    </View>
  );
}
