import '@/styles/global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '@/components/SafeScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeScreen>
          <StatusBar style="light" backgroundColor="#f97316" />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="recipe" options={{ headerShown: false }} />
          </Stack>
        </SafeScreen>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
