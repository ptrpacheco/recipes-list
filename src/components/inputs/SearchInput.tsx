import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
};

export default function SearchInput({ value, onChangeText, onSubmitEditing }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  return (
    <View className="h-12 flex-1 flex-row items-center rounded-full border-2 border-gray-100 bg-white px-4 shadow-lg">
      <Ionicons name="search" size={20} color="#f97316" />
      <TextInput
        className="ml-2 flex-1 text-base text-gray-800 placeholder:text-gray-400"
        placeholder="Buscar receita..."
        value={inputValue}
        onChangeText={(text) => {
          setInputValue(text);
          onChangeText(text);
        }}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
      {inputValue.length > 0 && (
        <Pressable
          onPress={() => {
            setInputValue('');
            onChangeText('');
          }}>
          <Ionicons name="close-circle" size={18} color="#f97316" />
        </Pressable>
      )}
    </View>
  );
}
