import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CustomText } from "../components/custom-text";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apis/axios-client";
import MaxWidthWrapper from "../components/max-width-wrapper";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type CollectionName = "users" | "textbooks" | "purchases";

const DatabaseViewer = () => {
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionName>("users");

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["database-users"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.users;
    },
    enabled: selectedCollection === "users",
  });

  // Fetch all textbooks
  const { data: textbooks, isLoading: textbooksLoading } = useQuery({
    queryKey: ["database-textbooks"],
    queryFn: async () => {
      const response = await apiClient.get("/textbooks");
      return response.data;
    },
    enabled: selectedCollection === "textbooks",
  });

  // Fetch all purchases
  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ["database-purchases"],
    queryFn: async () => {
      const response = await apiClient.get("/purchases");
      return response.data;
    },
    enabled: selectedCollection === "purchases",
  });

  const isLoading = usersLoading || textbooksLoading || purchasesLoading;

  const renderUsersTable = () => {
    if (!users || users.length === 0) {
      return (
        <View className="p-4 bg-gray-100 rounded-lg">
          <CustomText variant="medium" className="text-gray-500 text-center">
            No users found
          </CustomText>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          {/* Header */}
          <View className="flex-row bg-primary">
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                ID
              </CustomText>
            </View>
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Full Name
              </CustomText>
            </View>
            <View className="w-64 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Email
              </CustomText>
            </View>
            <View className="w-32 p-3">
              <CustomText variant="bold" className="text-white text-xs">
                Role
              </CustomText>
            </View>
          </View>

          {/* Rows */}
          {users.map((user: any, index: number) => (
            <View
              key={user._id || index}
              className={`flex-row ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {user._id}
                </CustomText>
              </View>
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {user.fullName}
                </CustomText>
              </View>
              <View className="w-64 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {user.email}
                </CustomText>
              </View>
              <View className="w-32 p-3">
                <View
                  className={`px-2 py-1 rounded ${user.role === "lecturer" ? "bg-blue-100" : "bg-green-100"}`}
                >
                  <CustomText
                    variant="medium"
                    className={`text-xs ${user.role === "lecturer" ? "text-blue-700" : "text-green-700"}`}
                  >
                    {user.role}
                  </CustomText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderTextbooksTable = () => {
    if (!textbooks || textbooks.length === 0) {
      return (
        <View className="p-4 bg-gray-100 rounded-lg">
          <CustomText variant="medium" className="text-gray-500 text-center">
            No textbooks found
          </CustomText>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          {/* Header */}
          <View className="flex-row bg-primary">
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                ID
              </CustomText>
            </View>
            <View className="w-64 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Title
              </CustomText>
            </View>
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Author
              </CustomText>
            </View>
            <View className="w-32 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Price
              </CustomText>
            </View>
            <View className="w-40 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Category
              </CustomText>
            </View>
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Lecturer
              </CustomText>
            </View>
            <View className="w-40 p-3">
              <CustomText variant="bold" className="text-white text-xs">
                ISBN
              </CustomText>
            </View>
          </View>

          {/* Rows */}
          {textbooks.map((textbook: any, index: number) => (
            <View
              key={textbook._id || index}
              className={`flex-row ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {textbook._id}
                </CustomText>
              </View>
              <View className="w-64 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {textbook.title}
                </CustomText>
              </View>
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {textbook.author}
                </CustomText>
              </View>
              <View className="w-32 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  N{textbook.price}
                </CustomText>
              </View>
              <View className="w-40 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {textbook.category}
                </CustomText>
              </View>
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {textbook.lecturerName}
                </CustomText>
              </View>
              <View className="w-40 p-3">
                <CustomText variant="medium" className="text-xs">
                  {textbook.isbn || "N/A"}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderPurchasesTable = () => {
    if (!purchases || purchases.length === 0) {
      return (
        <View className="p-4 bg-gray-100 rounded-lg">
          <CustomText variant="medium" className="text-gray-500 text-center">
            No purchases found
          </CustomText>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          {/* Header */}
          <View className="flex-row bg-primary">
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                ID
              </CustomText>
            </View>
            <View className="w-48 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Student ID
              </CustomText>
            </View>
            <View className="w-64 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Textbook Title
              </CustomText>
            </View>
            <View className="w-32 p-3 border-r border-white">
              <CustomText variant="bold" className="text-white text-xs">
                Amount
              </CustomText>
            </View>
            <View className="w-48 p-3">
              <CustomText variant="bold" className="text-white text-xs">
                Purchase Date
              </CustomText>
            </View>
          </View>

          {/* Rows */}
          {purchases.map((purchase: any, index: number) => (
            <View
              key={purchase._id || index}
              className={`flex-row ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {purchase._id}
                </CustomText>
              </View>
              <View className="w-48 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {purchase.studentId}
                </CustomText>
              </View>
              <View className="w-64 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  {purchase.textbook?.title || purchase.textbookId}
                </CustomText>
              </View>
              <View className="w-32 p-3 border-r border-gray-200">
                <CustomText variant="medium" className="text-xs">
                  N{purchase.amount}
                </CustomText>
              </View>
              <View className="w-48 p-3">
                <CustomText variant="medium" className="text-xs">
                  {new Date(purchase.createdAt).toLocaleString()}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white" }}
      className="flex-1 mx-auto w-full"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={"flex-1 h-full py-2.5 pt-5 px-5"}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
            <CustomText variant="bold" className="text-xl">
              ←
            </CustomText>
          </TouchableOpacity>
          <CustomText variant="bold" className="text-2xl">
            Database Viewer
          </CustomText>
        </View>

        {/* Collection Tabs */}
        <View className="flex-row gap-2 mb-6">
          <TouchableOpacity
            onPress={() => setSelectedCollection("users")}
            className={`flex-1 p-3 rounded-lg ${
              selectedCollection === "users" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <CustomText
              variant="bold"
              className={`text-center ${
                selectedCollection === "users" ? "text-white" : "text-gray-700"
              }`}
            >
              Users ({users?.length || 0})
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedCollection("textbooks")}
            className={`flex-1 p-3 rounded-lg ${
              selectedCollection === "textbooks" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <CustomText
              variant="bold"
              className={`text-center ${
                selectedCollection === "textbooks"
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              Textbooks ({textbooks?.length || 0})
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedCollection("purchases")}
            className={`flex-1 p-3 rounded-lg ${
              selectedCollection === "purchases" ? "bg-primary" : "bg-gray-200"
            }`}
          >
            <CustomText
              variant="bold"
              className={`text-center ${
                selectedCollection === "purchases"
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              Purchases ({purchases?.length || 0})
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator size="large" color="#0000ff" />
            <CustomText variant="medium" className="text-gray-500 mt-4">
              Loading data...
            </CustomText>
          </View>
        )}

        {/* Table Content */}
        {!isLoading && (
          <View className="mb-6 mx-auto">
            {selectedCollection === "users" && renderUsersTable()}
            {selectedCollection === "textbooks" && renderTextbooksTable()}
            {selectedCollection === "purchases" && renderPurchasesTable()}
          </View>
        )}

        {/* Summary Stats */}
        {/* <View className="bg-gray-100 p-4 rounded-xl mb-6">
          <CustomText variant="bold" className="text-lg mb-3">
            Database Summary
          </CustomText>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <CustomText variant="medium" className="text-gray-700">
                Total Users:
              </CustomText>
              <CustomText variant="bold" className="text-gray-900">
                {users?.length || 0}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText variant="medium" className="text-gray-700">
                Total Textbooks:
              </CustomText>
              <CustomText variant="bold" className="text-gray-900">
                {textbooks?.length || 0}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText variant="medium" className="text-gray-700">
                Total Purchases:
              </CustomText>
              <CustomText variant="bold" className="text-gray-900">
                {purchases?.length || 0}
              </CustomText>
            </View>
            <View className="flex-row justify-between border-t border-gray-300 pt-2 mt-2">
              <CustomText variant="bold" className="text-gray-700">
                Total Revenue:
              </CustomText>
              <CustomText variant="bold" className="text-green-600">
                N
                {purchases
                  ?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
                  .toFixed(2) || "0.00"}
              </CustomText>
            </View>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatabaseViewer;
