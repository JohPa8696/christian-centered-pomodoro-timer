import "./global.css";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TimerScreen } from "./screens/TimerScreen";
import { requestNotificationPermissions } from "./lib/notifications";
import { initSounds, setActiveSound, SOUND_OPTIONS, type SoundId } from "./lib/sounds";
import {
  initChants,
  setActiveChant,
  setChantsEnabled,
  CHANT_OPTIONS,
} from "./lib/chants";
import {
  loadSoundId,
  loadChantId,
  loadChantsEnabled,
} from "./lib/storage";

export default function App() {
  useEffect(() => {
    // Request notification permissions and preload audio on app start
    requestNotificationPermissions();
    (async () => {
      await initSounds();
      initChants();

      // Restore the user's saved completion-sound choice, if any.
      const savedSound = await loadSoundId();
      if (savedSound && SOUND_OPTIONS.some((o) => o.id === savedSound)) {
        setActiveSound(savedSound as SoundId);
      }

      // Restore chant preferences.
      const savedChant = await loadChantId();
      if (savedChant && CHANT_OPTIONS.some((o) => o.id === savedChant)) {
        setActiveChant(savedChant);
      }
      const chantsOn = await loadChantsEnabled();
      if (chantsOn !== null) {
        setChantsEnabled(chantsOn);
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
