import { View, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { CustomText } from "../../components/custom-text";
import { useAuth } from "../../contexts/AuthContext";
import { useTextbooks } from "../../contexts/TextbookContext";
import { router, useLocalSearchParams } from "expo-router";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import Button from "../../components/button";
import { useEffect, useState } from "react";
import { Textbook } from "../../types/index.d";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apis/axios-client";

const TextbookDetail = () => {
  const { id, purchased } = useLocalSearchParams();
  const { user } = useAuth();
  const { data: textbooks } = useQuery({
    queryKey: ["textbooks"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/textbooks");
        return response.data as Textbook[];
      } catch {
        return [];
      }
    },
  });

  const [isPurchased, setIsPurchased] = useState(() => {
    return purchased === "true";
  });
  const [isLoading, setIsLoading] = useState(false);

  const textbook = textbooks?.find((item) => item._id === id);

  const handlePurchase = async () => {
    if (!user) return;
    console.log("purchasing");

    setIsLoading(true);
    try {
      const res = await apiClient.post("purchases", {
        textbookId: textbook._id,
        amount: textbook.price,
      });
      console.log(res);
      setIsPurchased(true);
      alert("Success!");
    } catch (error) {
      alert("Error. Failed to purchase textbook. Please try again.");
      console.error("Purchase error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(textbook);

  if (!textbook) {
    return (
      <MaxWidthWrapper>
        <View className="flex-1 items-center justify-center p-8">
          <CustomText variant="medium" className="text-gray-500">
            Textbook not found
          </CustomText>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-primary px-6 py-3 rounded-lg"
          >
            <CustomText variant="bold" className="text-white">
              Go Back
            </CustomText>
          </TouchableOpacity>
        </View>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper scrollable>
      <View className="relative">
        {/* Cover Image */}
        <Image
          source={{ uri: textbook.coverImage }}
          className="w-full h-80"
          resizeMode="cover"
        />

        {/* Back Button Overlay */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-8 left-6 bg-white/90 rounded-full p-2"
        >
          <CustomText variant="bold" className="text-xl">
            ←
          </CustomText>
        </TouchableOpacity>
      </View>

      <View className="px-6 py-6">
        {/* Category Badge */}
        <View className="bg-primary/10 px-3 py-1 rounded-lg self-start mb-3">
          <CustomText variant="medium" className="text-sm text-primary">
            {textbook.category}
          </CustomText>
        </View>

        {/* Title */}
        <CustomText variant="bold" className="text-3xl mb-2">
          {textbook.title}
        </CustomText>

        {/* Author & Lecturer */}
        <CustomText variant="medium" className="text-lg text-gray-600 mb-1">
          by {textbook.author}
        </CustomText>
        <CustomText variant="medium" className="text-sm text-gray-500 mb-4">
          Uploaded by {textbook.lecturerName}
        </CustomText>

        {/* Price */}
        <CustomText variant="bold" className="text-4xl text-primary mb-6">
          N{textbook.price.toFixed(2)}
        </CustomText>

        {/* Description */}
        <View className="mb-6">
          <CustomText variant="bold" className="text-xl mb-3">
            Description
          </CustomText>
          <CustomText
            variant="medium"
            className="text-base text-gray-700 leading-6"
          >
            {textbook.description}
          </CustomText>
        </View>

        {/* Details */}
        <View className="bg-gray-100 rounded-xl p-4 mb-6">
          <CustomText variant="bold" className="text-lg mb-3">
            Details
          </CustomText>
          {textbook.isbn && (
            <View className="flex-row mb-2">
              <CustomText variant="medium" className="text-gray-600 w-24">
                ISBN:
              </CustomText>
              <CustomText variant="medium" className="flex-1">
                {textbook.isbn}
              </CustomText>
            </View>
          )}
          <View className="flex-row mb-2">
            <CustomText variant="medium" className="text-gray-600 w-24">
              Category:
            </CustomText>
            <CustomText variant="medium" className="flex-1">
              {textbook.category}
            </CustomText>
          </View>
          <View className="flex-row">
            <CustomText variant="medium" className="text-gray-600 w-24">
              Uploaded:
            </CustomText>
            <CustomText variant="medium" className="flex-1">
              {new Date(textbook.updatedAt).toLocaleString()}
            </CustomText>
          </View>
        </View>

        {/* Purchase Button */}
        <View className="mb-8">
          {isPurchased ? (
            <View className="bg-green-100 p-4 rounded-xl items-center">
              <CustomText variant="bold" className="text-green-700 text-lg">
                ✓ Already Purchased
              </CustomText>
              <CustomText
                variant="medium"
                className="text-green-600 text-sm mt-1"
              >
                Check your library to read this textbook
              </CustomText>
            </View>
          ) : (
            <Button
              text={
                isLoading
                  ? "Processing..."
                  : `Purchase for N${textbook.price.toFixed(2)}`
              }
              onPress={handlePurchase}
              disabled={isLoading}
            />
          )}
        </View>
      </View>
    </MaxWidthWrapper>
  );
};

export default TextbookDetail;
