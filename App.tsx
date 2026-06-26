import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TimerScreen } from "./screens/TimerScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <TimerScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
