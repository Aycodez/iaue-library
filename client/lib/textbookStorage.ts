import AsyncStorage from "@react-native-async-storage/async-storage";
import { Textbook, Purchase } from "../types/index.d";

const TEXTBOOKS_KEY = "textbooks";
const PURCHASES_KEY = "purchases";

// Textbook Storage Functions
export const getAllTextbooks = async (): Promise<Textbook[]> => {
  try {
    const textbooksJson = await AsyncStorage.getItem(TEXTBOOKS_KEY);
    return textbooksJson ? JSON.parse(textbooksJson) : [];
  } catch (error) {
    console.error("Error getting textbooks:", error);
    return [];
  }
};

export const getTextbookById = async (id: string): Promise<Textbook | null> => {
  try {
    const textbooks = await getAllTextbooks();
    return textbooks.find((t) => t.id === id) || null;
  } catch (error) {
    console.error("Error getting textbook:", error);
    return null;
  }
};

export const getTextbooksByLecturer = async (
  lecturerId: string
): Promise<Textbook[]> => {
  try {
    const textbooks = await getAllTextbooks();
    return textbooks.filter((t) => t.lecturerId === lecturerId);
  } catch (error) {
    console.error("Error getting lecturer textbooks:", error);
    return [];
  }
};

export const addTextbook = async (textbook: Textbook): Promise<void> => {
  try {
    const textbooks = await getAllTextbooks();
    textbooks.push(textbook);
    await AsyncStorage.setItem(TEXTBOOKS_KEY, JSON.stringify(textbooks));
  } catch (error) {
    console.error("Error adding textbook:", error);
    throw error;
  }
};

export const updateTextbook = async (textbook: Textbook): Promise<void> => {
  try {
    const textbooks = await getAllTextbooks();
    const index = textbooks.findIndex((t) => t.id === textbook.id);
    if (index !== -1) {
      textbooks[index] = textbook;
      await AsyncStorage.setItem(TEXTBOOKS_KEY, JSON.stringify(textbooks));
    }
  } catch (error) {
    console.error("Error updating textbook:", error);
    throw error;
  }
};

export const deleteTextbook = async (id: string): Promise<void> => {
  try {
    const textbooks = await getAllTextbooks();
    const filtered = textbooks.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TEXTBOOKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting textbook:", error);
    throw error;
  }
};

// Purchase Storage Functions
export const getAllPurchases = async (): Promise<Purchase[]> => {
  try {
    const purchasesJson = await AsyncStorage.getItem(PURCHASES_KEY);
    return purchasesJson ? JSON.parse(purchasesJson) : [];
  } catch (error) {
    console.error("Error getting purchases:", error);
    return [];
  }
};

export const getPurchasesByStudent = async (
  studentId: string
): Promise<Purchase[]> => {
  try {
    const purchases = await getAllPurchases();
    return purchases.filter((p) => p.studentId === studentId);
  } catch (error) {
    console.error("Error getting student purchases:", error);
    return [];
  }
};

export const getPurchasedTextbooks = async (
  studentId: string
): Promise<Textbook[]> => {
  try {
    const purchases = await getPurchasesByStudent(studentId);
    const textbooks = await getAllTextbooks();
    const purchasedIds = purchases.map((p) => p.textbookId);
    return textbooks.filter((t) => purchasedIds.includes(t.id));
  } catch (error) {
    console.error("Error getting purchased textbooks:", error);
    return [];
  }
};

export const addPurchase = async (purchase: Purchase): Promise<void> => {
  try {
    const purchases = await getAllPurchases();
    purchases.push(purchase);
    await AsyncStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  } catch (error) {
    console.error("Error adding purchase:", error);
    throw error;
  }
};

export const hasPurchasedTextbook = async (
  studentId: string,
  textbookId: string
): Promise<boolean> => {
  try {
    const purchases = await getPurchasesByStudent(studentId);
    return purchases.some((p) => p.textbookId === textbookId);
  } catch (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
};

// Utility: Get sales count for a lecturer
export const getSalesCountByLecturer = async (
  lecturerId: string
): Promise<number> => {
  try {
    const textbooks = await getTextbooksByLecturer(lecturerId);
    const purchases = await getAllPurchases();
    const textbookIds = textbooks.map((t) => t.id);
    return purchases.filter((p) => textbookIds.includes(p.textbookId)).length;
  } catch (error) {
    console.error("Error getting sales count:", error);
    return 0;
  }
};

// Utility: Search textbooks
export const searchTextbooks = async (query: string): Promise<Textbook[]> => {
  try {
    const textbooks = await getAllTextbooks();
    const lowercaseQuery = query.toLowerCase();
    return textbooks.filter(
      (t) =>
        t.title.toLowerCase().includes(lowercaseQuery) ||
        t.author.toLowerCase().includes(lowercaseQuery) ||
        t.category.toLowerCase().includes(lowercaseQuery) ||
        t.description.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error("Error searching textbooks:", error);
    return [];
  }
};

// Utility: Filter by category
export const getTextbooksByCategory = async (
  category: string
): Promise<Textbook[]> => {
  try {
    const textbooks = await getAllTextbooks();
    return textbooks.filter((t) => t.category === category);
  } catch (error) {
    console.error("Error filtering by category:", error);
    return [];
  }
};
