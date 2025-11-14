import { Textbook } from "../../types";
import apiClient from "./axios-client";

export const getTextbooks = async () => {
  try {
    const textbooks = await apiClient.get<Textbook[]>("/textbooks");
    return textbooks;
  } catch (error) {
    console.error("Error fetching textbooks:", error);
    throw error;
  }
};

// Upload PDF file and get fileKey and fileName
export const uploadPdfFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.upload<{
      data: {
        fileKey: string;
        fileName: string;
        fileUrl: string;
      };
    }>("/textbooks/upload", formData);

    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

// Upload thumbnail/cover image and get thumbnailKey and thumbnailName
export const uploadThumbnail = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response = await apiClient.upload<{
      data: {
        fileKey: string;
        fileName: string;
        fileUrl: string;
      };
    }>("/textbooks/upload/thumbnail", formData);

    return response.data;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error;
  }
};

// Create textbook with all the required fields including file keys
export const createTextbook = async (textbookData: {
  title: string;
  description: string;
  author: string;
  price: number;
  coverImage: string;
  pdfUrl: string;
  lecturerId: string;
  lecturerName: string;
  category: string;
  isbn?: string;
  fileKey: string;
  fileName: string;
  thumbnailKey: string;
  thumbnailName: string;
}) => {
  try {
    const response = await apiClient.post<Textbook>("/textbooks", textbookData);
    return response;
  } catch (error) {
    console.error("Error creating textbook:", error);
    throw error;
  }
};
