import {
  View,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
} from "react-native";
import { CustomText } from "../../components/custom-text";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";
import MaxWidthWrapper from "../../components/max-width-wrapper";
import InputField from "../../components/input-field";
import Button from "../../components/button";
import { useState } from "react";
import { textbookCategories } from "../../utils/mockData";
import {
  uploadPdfFile,
  uploadThumbnail,
  createTextbook,
} from "../../lib/apis/textbook";

const UploadTextbook = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Computer Science");
  const [isbn, setIsbn] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCoverImageSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Alert.alert("Error", "Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert("Error", "Image size should be less than 5MB");
        return;
      }
      setCoverImageFile(file);
    }
  };

  const handlePdfSelect = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        Alert.alert("Error", "Please select a valid PDF file");
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        Alert.alert("Error", "PDF size should be less than 50MB");
        return;
      }
      setPdfFile(file);
    }
  };

  const handleUpload = async () => {
    // Validation
    if (
      !title ||
      !description ||
      !author ||
      !price ||
      !coverImageFile ||
      !pdfFile
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Upload PDF file to server

      const pdfUploadResult = await uploadPdfFile(pdfFile);

      // Step 2: Upload thumbnail/cover image to server

      const thumbnailUploadResult = await uploadThumbnail(coverImageFile);

      // Step 3: Create textbook with all the data including file keys
      Alert.alert("Creating", "Creating textbook...");
      const textbookData = {
        title,
        description,
        author,
        price: priceNum,
        coverImage: thumbnailUploadResult.fileUrl,
        pdfUrl: pdfUploadResult.fileUrl,
        lecturerId: user!.id,
        lecturerName: user!.fullName,
        category,
        isbn: isbn || undefined,
        fileKey: pdfUploadResult.fileKey,
        fileName: pdfUploadResult.fileName,
        thumbnailKey: thumbnailUploadResult.fileKey,
        thumbnailName: thumbnailUploadResult.fileName,
      };

      await createTextbook(textbookData);

      alert("Success! Textbook uploaded successfully!");
      setTitle("");
      setDescription("");
      setAuthor("");
      setCategory("");
      setCoverImageFile(null);
      setPdfFile(null);
      setIsbn("");
      setPrice("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload textbook. Please try again.";
      Alert.alert("Error", errorMessage);
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthWrapper scrollable>
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <CustomText variant="bold" className="text-xl">
            ←
          </CustomText>
        </TouchableOpacity>
        <CustomText variant="bold" className="text-2xl">
          Upload Textbook
        </CustomText>
      </View>

      {/* Form */}
      <View className="gap-y-4">
        <InputField
          label="Title *"
          placeholder="e.g., Introduction to Computer Science"
          value={title}
          onChangeText={setTitle}
        />

        <View>
          <CustomText variant="medium" className="text-sm mb-2">
            Category *
          </CustomText>
          <View className="flex-wrap flex flex-row gap-2 mb-2">
            {textbookCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg border ${
                  category === cat
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
              >
                <CustomText
                  variant="medium"
                  className={`text-sm ${
                    category === cat ? "text-white" : "text-gray-700"
                  }`}
                >
                  {cat}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Author *"
          placeholder="e.g., Dr. John Smith"
          value={author}
          onChangeText={setAuthor}
        />

        <InputField
          label="Price (NGN) *"
          placeholder="e.g., 45.99"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <View>
          <CustomText variant="medium" className="text-sm mb-2 text-gray-700">
            Description *
          </CustomText>
          <TextInput
            placeholder="Enter a detailed description of the textbook..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{
              borderWidth: 0,
              minHeight: 96,
              backgroundColor: "#f9fafb",
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>

        {/* Cover Image Upload */}
        <View>
          <CustomText variant="medium" className="text-sm mb-2 text-gray-700">
            Cover Image *
          </CustomText>
          {Platform.OS === "web" ? (
            <View>
              <label
                htmlFor="coverImage"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  border: "2px dashed #d1d5db",
                  cursor: "pointer",
                  minHeight: "100px",
                }}
              >
                <View className="items-center">
                  <CustomText
                    variant="medium"
                    className="text-gray-600 text-center"
                  >
                    {coverImageFile
                      ? coverImageFile.name
                      : "Click to upload cover image"}
                  </CustomText>
                  {coverImageFile && (
                    <CustomText
                      variant="medium"
                      className="text-xs text-green-600 mt-2"
                    >
                      ✓ File selected ({(coverImageFile.size / 1024).toFixed(2)}{" "}
                      KB)
                    </CustomText>
                  )}
                  <CustomText
                    variant="medium"
                    className="text-xs text-gray-500 mt-2"
                  >
                    Supported: JPG, PNG (Max 5MB)
                  </CustomText>
                </View>
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageSelect}
                style={{ display: "none" }}
              />
            </View>
          ) : (
            <InputField
              label=""
              placeholder="Cover image upload (Web only)"
              editable={false}
            />
          )}
        </View>

        {/* PDF Upload */}
        <View>
          <CustomText variant="medium" className="text-sm mb-2 text-gray-700">
            Textbook PDF *
          </CustomText>
          {Platform.OS === "web" ? (
            <View>
              <label
                htmlFor="pdfFile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  border: "2px dashed #d1d5db",
                  cursor: "pointer",
                  minHeight: "100px",
                }}
              >
                <View className="items-center">
                  <CustomText
                    variant="medium"
                    className="text-gray-600 text-center"
                  >
                    {pdfFile ? pdfFile.name : "Click to upload PDF file"}
                  </CustomText>
                  {pdfFile && (
                    <CustomText
                      variant="medium"
                      className="text-xs text-green-600 mt-2"
                    >
                      ✓ File selected ({(pdfFile.size / 1024 / 1024).toFixed(2)}{" "}
                      MB)
                    </CustomText>
                  )}
                  <CustomText
                    variant="medium"
                    className="text-xs text-gray-500 mt-2"
                  >
                    Supported: PDF only (Max 50MB)
                  </CustomText>
                </View>
              </label>
              <input
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={handlePdfSelect}
                style={{ display: "none" }}
              />
            </View>
          ) : (
            <InputField
              label=""
              placeholder="PDF upload (Web only)"
              editable={false}
            />
          )}
        </View>

        <InputField
          label="ISBN (Optional)"
          placeholder="978-3-16-148410-0"
          value={isbn}
          onChangeText={setIsbn}
        />

        <View className="mt-4 mb-8">
          <Button
            text={isLoading ? "Uploading..." : "Upload Textbook"}
            onPress={handleUpload}
            disabled={isLoading}
          />
        </View>
      </View>
    </MaxWidthWrapper>
  );
};

export default UploadTextbook;
