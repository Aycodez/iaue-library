import express from "express";
import {
  createTextbook,
  getAllTextbooks,
  getTextbookById,
  updateTextbook,
  deleteTextbook,
  getTextbooksByLecturer,
  getTextbooksByCategory,
} from "../controllers/textbook.mjs";
import { authenticate, authorizeAdmin } from "../middleware/index.mjs";
import { getDownloadUrl, uploadFile } from "../controllers/file.mjs";
import upload from "../middleware/upload.mjs";

const router = express.Router();

// Public routes
router.get("/", getAllTextbooks);
router.get("/:id", getTextbookById);
router.get("/lecturer/:lecturerId", getTextbooksByLecturer);
router.get("/category/:category", getTextbooksByCategory);
router.post("/upload", upload.single("file"), uploadFile);
router.post("/upload/thumbnail", upload.single("thumbnail"), uploadFile);
router.get("/files", getDownloadUrl);
// Protected routes (require authentication)
router.post("/", authenticate, createTextbook);
router.put("/:id", authenticate, updateTextbook);
router.delete("/:id", authenticate, deleteTextbook);

export default router;
