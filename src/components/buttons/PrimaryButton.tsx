import { ReactNode, useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type PrimaryButtonProps = {
  onPress?: () => void;
  classname?: string;
  children: ReactNode;
  disabled?: boolean;
};

export default function PrimaryButton({
  onPress,
  classname,
  children,
  disabled = false,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (!disabled) {
      scale.value = withTiming(0.9, { duration: 60 });
    }
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    if (!disabled) {
      scale.value = withTiming(1, { duration: 60 });
    }
  }, [disabled, scale]);

  return (
    <Animated.View
      style={useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }))}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`h-12 w-12 flex-row items-center justify-center gap-2 rounded-full bg-orange-500 shadow-md shadow-orange-500 ${classname}`}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
