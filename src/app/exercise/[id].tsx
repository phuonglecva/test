import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-[#0F0F0F] px-6">
      <Text className="text-white text-lg font-semibold">Exercise detail: {id}</Text>
    </View>
  );
}
