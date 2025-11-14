import express from "express";
import {
  uploadFile,
  saveFile,
  getAllFiles,
  getFileById,
  deleteFile,
  getFileInfo,
  getDownloadUrl,
  getViewUrl,
  updateFile,
  refreshFileUrls,
} from "../controllers/file.mjs";
import upload from "../middleware/upload.mjs";
import { authenticate, authorizeAdmin } from "../middleware/index.mjs";

const router = express.Router();

// Public routes
router.get("/", getAllFiles);
router.get("/:id", getFileById);
router.get("/info/:fileKey", getFileInfo);
router.get("/download/file", getDownloadUrl);
router.get("/view/:fileKey", getViewUrl);
router.get("/refresh/:id", refreshFileUrls);

// Protected routes
router.post("/upload", upload.single("file"), uploadFile);
router.post(
  "/save",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  authenticate,
  authorizeAdmin,
  saveFile
);
router.put(
  "/:id",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  authenticate,
  authorizeAdmin,
  updateFile
);
router.delete("/:id", authenticate, authorizeAdmin, deleteFile);

export default router;
