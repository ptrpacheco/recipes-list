import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, ActivityIndicator, Keyboard } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { FilterModal } from '@/components/FilterModal';
import { getRecipesBySearch, getRecipesByFilter, getRecipesByFirstLetter } from '@/services/api';
import { RecipeCard } from '@/components/RecipeCard';
import { useClientPagination } from '@/hooks/useClientPagination';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import SecundaryButton from '@/components/buttons/SecundaryButton';
import SearchInput from '@/components/inputs/SearchInput';

type FilterState = { type: 'category' | 'area'; value: string } | null;
const ALPHABET = 'abcdefghijklmnoprstvwy';
const RANDOM_LETTER = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');

  const [activeSearch, setActiveSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterState>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { data: allRecipes, isLoading } = useQuery({
    queryKey: ['recipes', activeSearch, activeFilter],
    queryFn: () => {
      if (activeFilter) {
        return getRecipesByFilter(activeFilter.type, activeFilter.value);
      }

      if (activeSearch.trim() !== '') {
        return getRecipesBySearch(activeSearch);
      }
      return getRecipesByFirstLetter(RANDOM_LETTER);
    },
  });

  const { visibleData, loadMore } = useClientPagination(allRecipes, 10);

  const handleSearch = () => {
    setActiveFilter(null);
    setActiveSearch(searchText);
    Keyboard.dismiss();
  };

  const handleApplyFilter = (filter: FilterState) => {
    setSearchText('');
    setActiveSearch('');
    setActiveFilter(filter);
  };

  return (
    <View className="flex-1 bg-white">
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilter}
        currentFilter={activeFilter}
      />
      <View className="z-10 border-b-2 border-gray-100 bg-white px-4 py-4 shadow-lg">
        <View className="flex-row items-center gap-3">
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          {activeFilter ? (
            <PrimaryButton onPress={() => setIsFilterVisible(true)}>
              <Ionicons name="options" size={24} color={activeFilter ? 'white' : '#f97316'} />
            </PrimaryButton>
          ) : (
            <SecundaryButton onPress={() => setIsFilterVisible(true)}>
              <Ionicons name="options" size={24} color={activeFilter ? 'white' : '#f97316'} />
            </SecundaryButton>
          )}
          <PrimaryButton onPress={handleSearch}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </PrimaryButton>
        </View>
        <View className="mt-3 flex-row gap-2">
          <Text className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {activeFilter
              ? `Filtrando por ${activeFilter.type === 'category' ? 'Categoria' : 'País'}: ${activeFilter.value}`
              : activeSearch
                ? `Busca: ${activeSearch}`
                : 'Recomendados'}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlashList
          data={visibleData}
          renderItem={({ item }) => {
            let contextCategory = undefined;
            let contextArea = undefined;
            if (activeFilter) {
              if (activeFilter.type === 'category') contextCategory = activeFilter.value;
              if (activeFilter.type === 'area') contextArea = activeFilter.value;
            }

            return (
              <RecipeCard recipe={item} forcedCategory={contextCategory} forcedArea={contextArea} />
            );
          }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={() => (
            <View className="mt-10 items-center">
              <Text className="text-lg text-gray-500">Nenhuma receita encontrada.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
