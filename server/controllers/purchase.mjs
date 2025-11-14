import { asyncHandler } from "../middleware/index.mjs";
import Purchase from "../models/purchase.mjs";
import Textbook from "../models/textbook.mjs";

// Create a new purchase (student buys a textbook)
export const createPurchase = asyncHandler(async (req, res) => {
  const { textbookId, amount } = req.body;
  const studentId = req.user._id.toString();

  // Validate required fields
  if (!textbookId || !amount) {
    return res.status(400).json({
      success: false,
      message: "Please provide textbookId and amount",
    });
  }

  // Check if user is a student
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only students can purchase textbooks",
    });
  }

  // Verify textbook exists
  const textbook = await Textbook.findById(textbookId);
  if (!textbook) {
    return res.status(404).json({
      success: false,
      message: "Textbook not found",
    });
  }

  // Check if student already purchased this textbook
  const existingPurchase = await Purchase.findOne({ textbookId, studentId });
  if (existingPurchase) {
    return res.status(400).json({
      success: false,
      message: "You have already purchased this textbook",
    });
  }

  // Verify amount matches textbook price
  if (amount !== textbook.price) {
    return res.status(400).json({
      success: false,
      message: "Amount does not match textbook price",
    });
  }

  const purchase = new Purchase({
    textbookId,
    studentId,
    amount,
  });

  await purchase.save();

  res.status(201).json({
    success: true,
    message: "Purchase completed successfully",
    data: purchase,
  });
});

// Get all purchases (admin only)
export const getAllPurchases = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: purchases.length,
    data: purchases,
  });
});

// Get a single purchase by ID
export const getPurchaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const purchase = await Purchase.findById(id);

  if (!purchase) {
    return res.status(404).json({
      success: false,
      message: "Purchase not found",
    });
  }

  // Check authorization - user can only view their own purchase or admin can view all
  if (
    req.user.role !== "admin" &&
    purchase.studentId !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view this purchase",
    });
  }

  res.status(200).json({
    success: true,
    data: purchase,
  });
});

// Get purchases by student (authenticated student's own purchases)
export const getMyPurchases = asyncHandler(async (req, res) => {
  const studentId = req.user._id.toString();

  const purchases = await Purchase.find({ studentId }).sort({ createdAt: -1 });

  // Populate textbook details
  const purchasesWithTextbooks = await Promise.all(
    purchases.map(async (purchase) => {
      const textbook = await Textbook.findById(purchase.textbookId);
      return {
        ...purchase.toObject(),
        textbook: textbook || null,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: purchasesWithTextbooks.length,
    data: purchasesWithTextbooks,
  });
});

// Get purchases for a specific student (admin or lecturer can view)
export const getPurchasesByStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Check authorization
  if (req.user.role !== "admin" && req.user.role !== "lecturer") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view student purchases",
    });
  }

  const purchases = await Purchase.find({ studentId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: purchases.length,
    data: purchases,
  });
});

// Get purchases for a specific textbook
export const getPurchasesByTextbook = asyncHandler(async (req, res) => {
  const { textbookId } = req.params;

  // Verify textbook exists
  const textbook = await Textbook.findById(textbookId);
  if (!textbook) {
    return res.status(404).json({
      success: false,
      message: "Textbook not found",
    });
  }

  // Check authorization - only lecturer who owns the textbook or admin can view
  if (
    req.user.role !== "admin" &&
    (req.user.role !== "lecturer" ||
      textbook.lecturerId !== req.user._id.toString())
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view purchases for this textbook",
    });
  }

  const purchases = await Purchase.find({ textbookId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: purchases.length,
    totalRevenue: purchases.reduce((sum, p) => sum + p.amount, 0),
    data: purchases,
  });
});

// Check if student has purchased a textbook
export const checkPurchaseStatus = asyncHandler(async (req, res) => {
  const { textbookId } = req.params;
  const studentId = req.user._id.toString();

  const purchase = await Purchase.findOne({ textbookId, studentId });

  res.status(200).json({
    success: true,
    hasPurchased: !!purchase,
    purchase: purchase || null,
  });
});

// Get purchase statistics (admin or lecturer)
export const getPurchaseStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "lecturer") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view purchase statistics",
    });
  }

  let query = {};

  // If lecturer, only show stats for their textbooks
  if (req.user.role === "lecturer") {
    const lecturerTextbooks = await Textbook.find({
      lecturerId: req.user._id.toString(),
    });
    const textbookIds = lecturerTextbooks.map((t) => t._id.toString());
    query.textbookId = { $in: textbookIds };
  }

  const purchases = await Purchase.find(query);
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalPurchases = purchases.length;

  // Get purchases by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentPurchases = purchases.filter(
    (p) => new Date(p.createdAt) >= sixMonthsAgo
  );

  res.status(200).json({
    success: true,
    data: {
      totalPurchases,
      totalRevenue,
      recentPurchases: recentPurchases.length,
      averageAmount: totalPurchases > 0 ? totalRevenue / totalPurchases : 0,
    },
  });
});

// Get all purchases for a lecturer's textbooks
export const getPurchasesByLecturer = asyncHandler(async (req, res) => {
  const { lecturerId } = req.params;

  // Check authorization - only the lecturer themselves or admin can view
  if (
    req.user.role !== "admin" &&
    (req.user.role !== "lecturer" || req.user._id.toString() !== lecturerId)
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to view purchases for this lecturer",
    });
  }

  // Get all textbooks by this lecturer
  const lecturerTextbooks = await Textbook.find({ lecturerId });

  if (lecturerTextbooks.length === 0) {
    return res.status(200).json({
      success: true,
      count: 0,
      totalRevenue: 0,
      data: [],
      message: "No textbooks found for this lecturer",
    });
  }

  // Get all textbook IDs
  const textbookIds = lecturerTextbooks.map((t) => t._id.toString());

  // Find all purchases for these textbooks
  const purchases = await Purchase.find({
    textbookId: { $in: textbookIds },
  }).sort({ createdAt: -1 });

  // Populate with textbook details
  const purchasesWithDetails = await Promise.all(
    purchases.map(async (purchase) => {
      const textbook = lecturerTextbooks.find(
        (t) => t._id.toString() === purchase.textbookId
      );
      return {
        ...purchase.toObject(),
        textbook: textbook || null,
      };
    })
  );

  // Calculate total revenue
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

  res.status(200).json({
    success: true,
    count: purchases.length,
    totalRevenue,
    textbooksCount: lecturerTextbooks.length,
    data: purchasesWithDetails,
  });
});
