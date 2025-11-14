import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { CustomText } from "../../components/custom-text";
import { useAuth } from "../../contexts/AuthContext";
import { useTextbooks } from "../../contexts/TextbookContext";
import { router } from "expo-router";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import { useState } from "react";
import { Textbook } from "../../types/index.d";
import InputField from "../../components/input-field";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apis/axios-client";

const BrowseTextbooks = () => {
  const { data: textbooks } = useQuery({
    queryKey: ["textbooks"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/textbooks");
        console.log(response);
        return response.data as Textbook[];
      } catch {
        return [];
      }
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories from textbooks
  const categories = ["All", ...new Set(textbooks.map((t) => t.category))];

  // Filter textbooks based on search and category
  const filteredTextbooks = textbooks.filter((textbook) => {
    const matchesSearch =
      textbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      textbook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      textbook.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || textbook.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleTextbookPress = (textbook: Textbook) => {
    router.push({
      pathname: "/(student)/textbook-detail",
      params: { id: textbook._id },
    });
  };

  return (
    <MaxWidthWrapper scrollable>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <CustomText variant="bold" className="text-xl">
            ←
          </CustomText>
        </TouchableOpacity>
        <CustomText variant="bold" className="text-2xl flex-1 ml-2">
          Browse Textbooks
        </CustomText>
      </View>

      {/* Search Bar */}
      <InputField
        label=""
        placeholder="Search textbooks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        className="text-base"
        style={{ fontFamily: "SfPro" }}
      />

      <View className="flex-wrap mb-3 flex flex-row gap-3">
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory === category
                ? "bg-primary border-primary"
                : "bg-white border-gray-300"
            }`}
          >
            <CustomText
              variant="medium"
              className={`text-sm ${
                selectedCategory === category ? "text-white" : "text-gray-700"
              }`}
            >
              {category}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Count */}
      <CustomText variant="medium" className="text-sm text-gray-600 mb-4">
        {filteredTextbooks.length}{" "}
        {filteredTextbooks.length === 1 ? "textbook" : "textbooks"} found
      </CustomText>

      {/* Textbooks Grid */}
      {filteredTextbooks.length === 0 ? (
        <View className="bg-gray-100 p-8 rounded-xl items-center">
          <CustomText variant="medium" className="text-gray-500 text-center">
            No textbooks found.
            {"\n"}
            Try adjusting your search or filters.
          </CustomText>
        </View>
      ) : (
        <View className="gap-4 mb-8">
          {filteredTextbooks.map((textbook) => (
            <TouchableOpacity
              key={textbook._id}
              onPress={() => handleTextbookPress(textbook)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 flex-row"
            >
              <Image
                source={{ uri: textbook.coverImage }}
                className="w-28 h-40"
                resizeMode="cover"
              />
              <View className="flex-1 p-4">
                <CustomText
                  variant="bold"
                  className="text-lg mb-1"
                  numberOfLines={2}
                >
                  {textbook.title}
                </CustomText>
                <CustomText
                  variant="medium"
                  className="text-sm text-gray-600 mb-1"
                >
                  by {textbook.author}
                </CustomText>
                <View className="bg-primary/10 px-2 py-1 rounded self-start mb-2">
                  <CustomText variant="medium" className="text-xs text-primary">
                    {textbook.category}
                  </CustomText>
                </View>
                <CustomText
                  variant="bold"
                  className="text-primary text-xl mt-auto"
                >
                  N{textbook.price.toFixed(2)}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </MaxWidthWrapper>
  );
};

export default BrowseTextbooks;
