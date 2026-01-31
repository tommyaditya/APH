import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../hooks/useTheme";

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}
