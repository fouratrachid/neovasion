
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { colors } from '@/constants/Colors';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="p-2 rounded-full bg-neutral-100 dark:bg-dark-800 border border-neutral-200 dark:border-dark-700"
    >
      <Ionicons
        name={colorScheme === 'dark' ? 'moon' : 'sunny'}
        size={24}
        color={colorScheme === 'dark' ? '#FFFFFF' : colors.neutral[900]}
      />
    </TouchableOpacity>
  );
}
