import express from "express";
import {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  getMyPurchases,
  getPurchasesByStudent,
  getPurchasesByTextbook,
  checkPurchaseStatus,
  getPurchaseStats,
  getPurchasesByLecturer,
} from "../controllers/purchase.mjs";
import { authenticate, authorizeAdmin } from "../middleware/index.mjs";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Student routes
router.post("/", createPurchase);
router.get("/my-purchases", getMyPurchases);
router.get("/check/:textbookId", checkPurchaseStatus);

// Admin/Lecturer routes
router.get("/stats", getPurchaseStats);
router.get("/student/:studentId", getPurchasesByStudent);
router.get("/textbook/:textbookId", getPurchasesByTextbook);
router.get("/lecturer/:lecturerId", getPurchasesByLecturer);

// Admin only routes
router.get("/", getAllPurchases);

// General routes (with authorization checks in controller)
router.get("/:id", getPurchaseById);

export default router;
