import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { getRecipeDetails } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import Line from '@/components/Line';
import PrimaryButton from '@/components/buttons/PrimaryButton';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeDetails(id as string),
    enabled: !!id,
  });

  const getIngredients = (data: any) => {
    const indexes = Array.from({ length: 20 }, (_, i) => i + 1);
    return indexes
      .map((i) => ({
        ingredient: data[`strIngredient${i}`],
        measure: data[`strMeasure${i}`],
      }))
      .filter((item) => item.ingredient && item.ingredient.trim() !== '');
  };

  if (isLoading || !recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <View className="flex-1 bg-white">
      <View className="relative h-80 w-full bg-gray-200">
        <Image source={{ uri: recipe.strMealThumb }} className="h-full w-full" resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          className="absolute left-0 top-0 h-24 w-full"
        />
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4 top-8 h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:bg-white/40">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView
        className="-mt-8 rounded-t-3xl bg-white px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-col gap-4">
          <View className="flex-col gap-2">
            <Text className="text-2xl font-bold leading-tight text-gray-900">{recipe.strMeal}</Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="rounded bg-orange-100 px-3 py-1">
                <Text className="text-xs font-bold uppercase text-orange-700">
                  {recipe.strCategory}
                </Text>
              </View>
              <View className="rounded bg-orange-100 px-3 py-1">
                <Text className="text-xs font-bold uppercase text-orange-700">
                  {recipe.strArea}
                </Text>
              </View>
            </View>
          </View>

          <Line />

          <View className="flex-col gap-2">
            <Text className="text-lg font-bold text-gray-800">Ingredientes</Text>
            <View className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              {ingredients.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row justify-between py-2 ${
                    index !== ingredients.length - 1 ? 'border-b border-gray-200' : ''
                  }`}>
                  <Text className="font-medium capitalize text-gray-700">{item.ingredient}</Text>
                  <Text className="text-gray-500">{item.measure}</Text>
                </View>
              ))}
            </View>
          </View>

          <Line />

          <View className="flex-col gap-2">
            <Text className="mb-3 text-lg font-bold text-gray-800">Modo de Preparo</Text>
            <Text className="text-justify text-base leading-6 text-gray-600">
              {recipe.strInstructions}
            </Text>
          </View>

          <Line />

          {recipe.strYoutube && (
            <PrimaryButton
              classname="w-full h-16 rounded-lg"
              onPress={() => Linking.openURL(recipe.strYoutube)}>
              <Ionicons name="logo-youtube" size={24} color="white" />
              <Text className="ml-2 text-base font-bold text-white">Ver no YouTube</Text>
            </PrimaryButton>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
