import {
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { useState } from "react";
import { CustomText } from "./custom-text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

// Country codes data with flag URLs
const countries = [
  { name: "Nigeria", code: "+234", iso: "NG" },
  { name: "United States", code: "+1", iso: "US" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "Canada", code: "+1", iso: "CA" },
  { name: "Australia", code: "+61", iso: "AU" },
  { name: "Germany", code: "+49", iso: "DE" },
  { name: "France", code: "+33", iso: "FR" },
  { name: "Italy", code: "+39", iso: "IT" },
  { name: "Spain", code: "+34", iso: "ES" },
  { name: "Netherlands", code: "+31", iso: "NL" },
  { name: "Japan", code: "+81", iso: "JP" },
  { name: "China", code: "+86", iso: "CN" },
  { name: "India", code: "+91", iso: "IN" },
  { name: "Brazil", code: "+55", iso: "BR" },
  { name: "Mexico", code: "+52", iso: "MX" },

  { name: "South Africa", code: "+27", iso: "ZA" },
];

// Helper function to get flag URL
const getFlagUrl = (iso: string) =>
  `https://flagcdn.com/w80/${iso.toLowerCase()}.png`;

interface PhoneNumberProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onCountryChange?: (country: (typeof countries)[0]) => void;
  labelStyle?: string;
  containerStyle?: string;
  error?: string;
}

const PhoneNumber = ({
  label = "Phone Number",
  placeholder = "Enter your phone number",
  value = "",
  onChangeText,
  onCountryChange,
  labelStyle = "",
  containerStyle = "",
  error,
}: PhoneNumberProps) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setIsModalVisible(false);
    onCountryChange?.(country);
  };

  const renderCountryItem = ({ item }: { item: (typeof countries)[0] }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-neutral-accent/20"
      onPress={() => handleCountrySelect(item)}
    >
      <Image
        source={{ uri: getFlagUrl(item.iso) }}
        className="w-8 h-6 mr-3 rounded-sm"
        resizeMode="cover"
      />
      <View className="flex-1">
        <CustomText variant="medium" className="text-primary-text">
          {item.name}
        </CustomText>
        <CustomText className="text-secondary-text text-sm">
          {item.code}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="w-full my-2 mb-4">
      <CustomText
        variant="medium"
        className={`text-primary-text mb-2 ${labelStyle}`}
      >
        {label}
      </CustomText>

      <View className={`flex-row gap-2 ${containerStyle}`}>
        {/* Country Code Selector */}
        <TouchableOpacity
          className="h-16 bg-background rounded-2xl flex-row items-center justify-center px-3 min-w-[100px]"
          onPress={() => setIsModalVisible(true)}
        >
          <Image
            source={{ uri: getFlagUrl(selectedCountry.iso) }}
            className="w-6 h-4 mr-2"
            resizeMode="cover"
          />
          <CustomText
            variant="medium"
            className="text-primary-text text-sm mr-1"
          >
            {selectedCountry.code}
          </CustomText>
          {/* Dropdown Arrow */}
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} color="#6F6D6D" />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View className="flex-1 h-16 bg-background rounded-2xl justify-center px-4">
          <TextInput
            className="h-full font-SfProMedium pb-1 text-base text-primary-text"
            placeholder={placeholder}
            placeholderTextColor="#C8C8C8"
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            maxLength={15}
            style={{
              outline: "none",
              boxShadow: "none",
              borderWidth: 0,
            }}
          />
        </View>
      </View>

      {/* Error Message */}
      {error && (
        <CustomText className="text-red-500 text-sm mt-1 ml-2">
          {error}
        </CustomText>
      )}

      {/* Country Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-accent/20">
            <CustomText variant="bold" className="text-lg text-primary-text">
              Select Country
            </CustomText>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="px-4 py-2"
            >
              <CustomText variant="medium" className="text-primary text-base">
                Done
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Countries List */}
          <FlatList
            data={countries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.iso}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PhoneNumber;
