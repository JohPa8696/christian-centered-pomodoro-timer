import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TimerScreen } from "./screens/TimerScreen";
import { requestNotificationPermissions } from "./lib/notifications";
import { initSounds, setActiveSound, SOUND_OPTIONS, type SoundId } from "./lib/sounds";
import { loadSoundId } from "./lib/storage";

export default function App() {
  useEffect(() => {
    // Request notification permissions and preload sounds on app start
    requestNotificationPermissions();
    (async () => {
      await initSounds();
      // Restore the user's saved completion-sound choice, if any.
      const savedId = await loadSoundId();
      if (savedId && SOUND_OPTIONS.some((o) => o.id === savedId)) {
        setActiveSound(savedId as SoundId);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <TimerScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
