import { ReactNode } from "react";
import { TextInputProps } from "react-native";

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: ReactNode;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  sign?: ReactNode;
}

export type UserRole = "lecturer" | "student";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
}

export interface Textbook {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  coverImage: string;
  pdfUrl: string;
  lecturerId: string;
  lecturerName: string;
  updatedAt: Date;
  category: string;
  isbn?: string;
  fileKey: string;
  fileName: string;
  thumbnailKey: string;
  thumbnailName: string;
}

export interface Purchase {
  id: string;

  studentId: string;
  createdAt: string;
  amount: number;
  textbook: Textbook;
}
