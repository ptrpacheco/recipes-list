import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeScreen({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
}