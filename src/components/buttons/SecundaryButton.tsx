import { ReactNode, useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type SecundaryButtonProps = {
  onPress?: () => void;
  classname?: string;
  children: ReactNode;
  disabled?: boolean;
};

export default function SecundaryButton({
  onPress,
  classname,
  children,
  disabled = false,
}: SecundaryButtonProps) {
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
        className={`h-12 w-12 items-center justify-center rounded-full border-2 border-orange-500 bg-white shadow-md shadow-orange-500 ${classname}`}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
