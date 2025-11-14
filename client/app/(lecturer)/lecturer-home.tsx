import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { CustomText } from "../../components/custom-text";
import { useAuth } from "../../contexts/AuthContext";
import { useTextbooks } from "../../contexts/TextbookContext";
import { router } from "expo-router";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import { useEffect, useState } from "react";
import { Textbook } from "../../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apis/axios-client";

const LecturerHome = () => {
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: textbooks,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["textbooks", user?.id],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/textbooks/lecturer/" + user.id);
        return response.data as Textbook[];
      } catch {
        return [];
      }
    },
    enabled: !!user?.id,
  });
  const { data: purchases } = useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/purchases/lecturer/" + user.id);
        return response;
      } catch {
        return [];
      }
    },
  });
  useEffect(() => {
    if (!user) return;
    if (user.role !== "lecturer") router.replace("/student-home");
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", maxWidth: 500 }}
      className="flex-1 mx-auto w-full"
    >
      <ScrollView
        className="flex-1 p-3"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <CustomText variant="bold" className="text-2xl">
              Welcome, {user?.fullName}
            </CustomText>
            <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
              👨‍🏫 Lecturer Dashboard
            </CustomText>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            <CustomText variant="bold" className="text-white text-sm">
              Sign Out
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-primary/10 p-4 rounded-xl">
            <CustomText variant="bold" className="text-3xl text-primary">
              {textbooks?.length}
            </CustomText>
            <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
              Textbooks
            </CustomText>
          </View>
          <View className="flex-1 bg-green-100 p-4 rounded-xl">
            <CustomText variant="bold" className="text-3xl text-green-600">
              {purchases?.count}
            </CustomText>
            <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
              Sales
            </CustomText>
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={() => router.push("/(lecturer)/upload")}
          className="bg-primary p-4 rounded-xl mb-6"
        >
          <CustomText variant="bold" className="text-white text-center text-lg">
            Upload New Textbook
          </CustomText>
        </TouchableOpacity>

        {/* My Textbooks Section */}
        <View className="mb-4">
          <CustomText variant="bold" className="text-xl mb-4">
            My Textbooks
          </CustomText>
          {isLoading ? (
            <View className="bg-gray-100 p-8 rounded-xl items-center">
              <CustomText variant="medium" className="text-gray-500">
                Loading...
              </CustomText>
            </View>
          ) : textbooks?.length === 0 ? (
            <View className="bg-gray-100 p-8 rounded-xl items-center">
              <CustomText
                variant="medium"
                className="text-gray-500 text-center"
              >
                No textbooks uploaded yet.
                {"\n"}
                Start by uploading your first textbook!
              </CustomText>
            </View>
          ) : (
            <View className="gap-4">
              {textbooks?.map((textbook) => (
                <View
                  key={textbook._id}
                  className="bg-white p-4 rounded-xl border border-gray-200"
                >
                  <CustomText variant="bold" className="text-lg mb-1">
                    {textbook.title}
                  </CustomText>
                  <CustomText
                    variant="medium"
                    className="text-sm text-gray-600 mb-2"
                  >
                    {textbook.category}
                  </CustomText>
                  <CustomText variant="bold" className="text-primary text-lg">
                    N{textbook.price.toFixed(2)}
                  </CustomText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LecturerHome;
