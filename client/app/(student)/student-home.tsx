import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { CustomText } from "../../components/custom-text";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import { Purchase, Textbook } from "../../types";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../lib/apis/axios-client";

const StudentHome = () => {
  const { user, signOut } = useAuth();
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
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/purchases/my-purchases");
        return response.data as Purchase[];
      } catch {
        return [];
      }
    },
    refetchOnMount: "always",
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <MaxWidthWrapper scrollable>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <CustomText variant="bold" className="text-2xl">
            Welcome, {user?.fullName}
          </CustomText>
          <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
            📚 Student Portal
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
            {purchases?.length}
          </CustomText>
          <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
            Purchased
          </CustomText>
        </View>
        <View className="flex-1 bg-blue-100 p-4 rounded-xl">
          <CustomText variant="bold" className="text-3xl text-blue-600">
            {textbooks?.length}
          </CustomText>
          <CustomText variant="medium" className="text-sm text-gray-600 mt-1">
            Available
          </CustomText>
        </View>
      </View>

      {/* Browse Section */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <CustomText variant="bold" className="text-xl">
            Browse Textbooks
          </CustomText>
          <TouchableOpacity onPress={() => router.push("/(student)/browse")}>
            <CustomText variant="bold" className="text-primary text-sm">
              See All →
            </CustomText>
          </TouchableOpacity>
        </View>
        {!textbooks || textbooks.length === 0 ? (
          <View className="bg-gray-100 p-8 rounded-xl items-center">
            <CustomText variant="medium" className="text-gray-500 text-center">
              No textbooks available yet.
              {"\n"}
              Check back soon!
            </CustomText>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {textbooks?.slice(0, 5).map((textbook) => (
                <TouchableOpacity
                  key={textbook._id}
                  onPress={() =>
                    router.push({
                      pathname: "/(student)/textbook-detail",
                      params: { id: textbook._id },
                    })
                  }
                  className="w-40 bg-white rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image
                    source={{ uri: textbook.coverImage }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="p-3">
                    <CustomText
                      variant="bold"
                      className="text-sm mb-1"
                      numberOfLines={2}
                    >
                      {textbook.title}
                    </CustomText>
                    <CustomText variant="bold" className="text-primary">
                      N{textbook.price.toFixed(2)}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* My Library Section */}
      <View className="mb-4">
        <CustomText variant="bold" className="text-xl mb-4">
          My Library
        </CustomText>
        {isLoading ? (
          <View className="bg-gray-100 p-8 rounded-xl items-center">
            <CustomText variant="medium" className="text-gray-500">
              Loading...
            </CustomText>
          </View>
        ) : purchases?.length === 0 ? (
          <View className="bg-gray-100 p-8 rounded-xl items-center">
            <CustomText variant="medium" className="text-gray-500 text-center">
              You haven&apos;t purchased any textbooks yet.
              {"\n"}
              Browse textbooks to get started!
            </CustomText>
            <TouchableOpacity
              onPress={() => router.push("/(student)/browse")}
              className="mt-4 bg-primary px-6 py-3 rounded-lg"
            >
              <CustomText variant="bold" className="text-white">
                Browse Textbooks
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {purchases?.map((purchase) => (
              <TouchableOpacity
                key={purchase.id}
                onPress={() =>
                  router.push({
                    pathname: "/(student)/textbook-detail",
                    params: { id: purchase.textbook._id, purchased: "true" },
                  })
                }
                className="bg-white p-4 rounded-xl border border-gray-200 flex-row gap-4"
              >
                <Image
                  source={{ uri: purchase.textbook.coverImage }}
                  className="w-20 h-28 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <CustomText variant="bold" className="text-lg mb-1">
                    {purchase.textbook.title}
                  </CustomText>
                  <CustomText
                    variant="medium"
                    className="text-sm text-gray-600 mb-2"
                  >
                    {purchase.textbook.author}
                  </CustomText>
                  <View className="bg-green-100 px-3 py-1 rounded-lg self-start">
                    <CustomText
                      variant="bold"
                      className="text-green-700 text-xs"
                    >
                      ✓ Owned
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </MaxWidthWrapper>
  );
};

export default StudentHome;
