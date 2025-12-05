import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

type RecipeCardProps = {
  recipe: any;
  forcedCategory?: string;
  forcedArea?: string;
};

export function RecipeCard({ recipe, forcedCategory, forcedArea }: RecipeCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const category = recipe.strCategory || forcedCategory;
  const area = recipe.strArea || forcedArea;

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 100 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <Animated.View
      style={useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }))}>
      <Pressable
        className="mb-4 overflow-hidden rounded-xl border-2 border-gray-100 bg-white shadow-lg"
        onPress={() => router.push(`/recipe/${recipe.idMeal}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <Image
          source={recipe.strMealThumb}
          style={{ width: '100%', height: 200 }}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />

        <View className="flex-col gap-2 p-4">

          <Text className="text-xl font-bold text-gray-800" numberOfLines={1} ellipsizeMode="tail">
            {recipe.strMeal}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {category && (
              <View className="rounded bg-orange-100 px-2 py-1">
                <Text className="text-xs font-bold uppercase text-orange-700">{category}</Text>
              </View>
            )}
            {area && (
              <View className="rounded bg-orange-100 px-2 py-1">
                <Text className="text-xs font-bold uppercase text-orange-700">{area}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
