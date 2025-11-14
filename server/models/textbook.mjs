import mongoose from "mongoose";

const textbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    lecturerId: {
      type: String,
      required: true,
    },
    lecturerName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: false,
    },
    fileKey: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    thumbnailKey: {
      type: String,
      required: false,
    },
    thumbnailName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Textbook = mongoose.model("Textbook", textbookSchema);

export default Textbook;
