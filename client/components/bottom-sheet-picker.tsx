import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface BottomSheetPickerProps {
  visible: boolean;
  title: string;
  options: readonly string[] | string[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  maxHeight?: number;
}

// Lightweight bottom sheet using Modal
const BottomSheetPickerComponent: React.FC<BottomSheetPickerProps> = ({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
  maxHeight = 500,
}) => {
  const [query, setQuery] = React.useState("");
  const data = React.useMemo(() => {
    if (!query.trim()) return options as string[];
    const q = query.toLowerCase();
    return (options as string[]).filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50" accessibilityLabel="Close picker">
        <View className="mt-auto bg-white rounded-t-2xl p-4 pb-8 pt-3">
          {/* Drag handle */}
          <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-3" />
          <Text className="text-sm text-center font-GorditaMedium mb-3">
            {title}
          </Text>
          <View className="border border-gray-200 rounded-lg px-3 py-2">
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              className="text-sm font-Gordita"
            />
          </View>

          <FlatList
            data={data}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            className="mt-6"
            style={{ maxHeight }}
            ItemSeparatorComponent={() => (
              <View className="h-px bg-gray-200 my-2.5" />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item}
                onPress={() => onSelect(item)}
                className="px-2 flex-row items-center justify-between"
                accessibilityRole="button"
                accessibilityLabel={`Select ${item}`}
              >
                <Text className="text-sm font-Gordita">{item}</Text>
                <FontAwesome6
                  name="check-square"
                  size={24}
                  color={item === selected ? "black" : "#0418271A"}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const BottomSheetPicker = React.memo(BottomSheetPickerComponent);
export default BottomSheetPicker;
