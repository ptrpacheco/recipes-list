import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { getAreasList, getCategoriesList } from '@/services/api';
import PrimaryButton from './buttons/PrimaryButton';

type FilterType = { type: 'category' | 'area'; value: string } | null;

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: FilterType) => void;
  currentFilter: FilterType;
}

export function FilterModal({ visible, onClose, onApply, currentFilter }: FilterModalProps) {
  const [selectedTab, setSelectedTab] = useState<'category' | 'area'>('category');
  const [tempFilter, setTempFilter] = useState<FilterType>(currentFilter);

  const { data: categories, isLoading: loadingCat } = useQuery({
    queryKey: ['list_categories'],
    queryFn: getCategoriesList,
  });

  const { data: areas, isLoading: loadingArea } = useQuery({
    queryKey: ['list_areas'],
    queryFn: getAreasList,
  });

  useEffect(() => {
    setTempFilter(currentFilter);
  }, [visible, currentFilter]);

  const handleApply = () => {
    onApply(tempFilter);
    onClose();
  };

  const handleClear = () => {
    setTempFilter(null);
    onApply(null);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="flex h-[70%] w-full overflow-hidden rounded-t-3xl bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 p-6">
            <Text onPress={handleClear} className="font-medium text-orange-500">
              Limpar
            </Text>
            <Text className="text-lg font-bold text-gray-800">Filtrar Receitas</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          <View className="mx-4 mt-2 flex-row rounded-lg bg-gray-100 p-2">
            <Pressable
              onPress={() => setSelectedTab('category')}
              className={`flex-1 items-center rounded-md py-2 ${selectedTab === 'category' ? 'bg-white' : ''}`}>
              <Text
                className={`font-semibold ${selectedTab === 'category' ? 'text-orange-500' : 'text-gray-500'}`}>
                Categorias
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSelectedTab('area')}
              className={`flex-1 items-center rounded-md py-2 ${selectedTab === 'area' ? 'bg-white' : ''}`}>
              <Text
                className={`font-semibold ${selectedTab === 'area' ? 'text-orange-500' : 'text-gray-500'}`}>
                Países
              </Text>
            </Pressable>
          </View>

          <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
            {loadingCat || loadingArea ? (
              <ActivityIndicator size="large" className="mt-10" />
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {selectedTab === 'category'
                  ? categories?.map((c: any) => (
                      <OptionChip
                        key={c.strCategory}
                        label={c.strCategory}
                        isSelected={
                          tempFilter?.type === 'category' && tempFilter?.value === c.strCategory
                        }
                        onPress={() => setTempFilter({ type: 'category', value: c.strCategory })}
                      />
                    ))
                  : areas?.map((a: any) => (
                      <OptionChip
                        key={a.strArea}
                        label={a.strArea}
                        isSelected={tempFilter?.type === 'area' && tempFilter?.value === a.strArea}
                        onPress={() => setTempFilter({ type: 'area', value: a.strArea })}
                      />
                    ))}
              </View>
            )}
          </ScrollView>

          <View className="border-t border-gray-100 bg-white p-4">
            <PrimaryButton classname="w-full h-16 rounded-lg" onPress={handleApply}>
              <Text className="text-lg font-bold text-white">Ver Resultados</Text>
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function OptionChip({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${
        isSelected ? 'border-orange-500 bg-orange-100' : 'border-gray-200 bg-white'
      }`}>
      <Text className={isSelected ? 'font-bold text-orange-600' : 'text-gray-600'}>{label}</Text>
    </Pressable>
  );
}
