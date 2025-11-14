import React, { createContext, useContext, useState, useEffect } from "react";
import { Textbook, Purchase } from "../types/index.d";
import {
  getAllTextbooks,
  addTextbook,
  deleteTextbook,
  getTextbooksByLecturer,
  getPurchasedTextbooks,
  addPurchase,
  hasPurchasedTextbook,
  getSalesCountByLecturer,
} from "../lib/textbookStorage";
import { mockTextbooks } from "../utils/mockData";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TextbookContextType {
  textbooks: Textbook[];
  isLoading: boolean;
  refreshTextbooks: () => Promise<void>;
  addNewTextbook: (textbook: Textbook) => Promise<void>;
  removeTextbook: (id: string) => Promise<void>;
  getLecturerTextbooks: (lecturerId: string) => Promise<Textbook[]>;
  getStudentLibrary: (studentId: string) => Promise<Textbook[]>;
  purchaseTextbook: (studentId: string, textbook: Textbook) => Promise<void>;
  checkIfPurchased: (studentId: string, textbookId: string) => Promise<boolean>;
  getLecturerSalesCount: (lecturerId: string) => Promise<number>;
}

const TextbookContext = createContext<TextbookContextType | undefined>(
  undefined
);

export const TextbookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTextbooks();
  }, []);

  const initializeTextbooks = async () => {
    try {
      // Check if textbooks have been initialized
      const initialized = await AsyncStorage.getItem("textbooks_initialized");

      if (!initialized) {
        // First time - load mock data
        await AsyncStorage.setItem("textbooks", JSON.stringify(mockTextbooks));
        await AsyncStorage.setItem("textbooks_initialized", "true");
      }

      // Load textbooks
      const loadedTextbooks = await getAllTextbooks();
      setTextbooks(loadedTextbooks);
    } catch (error) {
      console.error("Error initializing textbooks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTextbooks = async () => {
    try {
      const loadedTextbooks = await getAllTextbooks();
      setTextbooks(loadedTextbooks);
    } catch (error) {
      console.error("Error refreshing textbooks:", error);
    }
  };

  const addNewTextbook = async (textbook: Textbook) => {
    try {
      await addTextbook(textbook);
      await refreshTextbooks();
    } catch (error) {
      console.error("Error adding textbook:", error);
      throw error;
    }
  };

  const removeTextbook = async (id: string) => {
    try {
      await deleteTextbook(id);
      await refreshTextbooks();
    } catch (error) {
      console.error("Error removing textbook:", error);
      throw error;
    }
  };

  const getLecturerTextbooks = async (
    lecturerId: string
  ): Promise<Textbook[]> => {
    try {
      return await getTextbooksByLecturer(lecturerId);
    } catch (error) {
      console.error("Error getting lecturer textbooks:", error);
      return [];
    }
  };

  const getStudentLibrary = async (studentId: string): Promise<Textbook[]> => {
    try {
      return await getPurchasedTextbooks(studentId);
    } catch (error) {
      console.error("Error getting student library:", error);
      return [];
    }
  };

  const purchaseTextbook = async (studentId: string, textbook: Textbook) => {
    try {
      const purchase: Purchase = {
        id: Date.now().toString(),
        textbookId: textbook.id,
        studentId,
        purchaseDate: new Date(),
        amount: textbook.price,
      };
      await addPurchase(purchase);
    } catch (error) {
      console.error("Error purchasing textbook:", error);
      throw error;
    }
  };

  const checkIfPurchased = async (
    studentId: string,
    textbookId: string
  ): Promise<boolean> => {
    try {
      return await hasPurchasedTextbook(studentId, textbookId);
    } catch (error) {
      console.error("Error checking purchase:", error);
      return false;
    }
  };

  const getLecturerSalesCount = async (lecturerId: string): Promise<number> => {
    try {
      return await getSalesCountByLecturer(lecturerId);
    } catch (error) {
      console.error("Error getting sales count:", error);
      return 0;
    }
  };

  return (
    <TextbookContext.Provider
      value={{
        textbooks,
        isLoading,
        refreshTextbooks,
        addNewTextbook,
        removeTextbook,
        getLecturerTextbooks,
        getStudentLibrary,
        purchaseTextbook,
        checkIfPurchased,
        getLecturerSalesCount,
      }}
    >
      {children}
    </TextbookContext.Provider>
  );
};

export const useTextbooks = () => {
  const context = useContext(TextbookContext);
  if (context === undefined) {
    throw new Error("useTextbooks must be used within a TextbookProvider");
  }
  return context;
};
