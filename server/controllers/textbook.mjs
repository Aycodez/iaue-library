import { asyncHandler } from "../middleware/index.mjs";
import Textbook from "../models/textbook.mjs";
import { getSignedUrl, deleteFromS3 } from "../utils/s3Helper.mjs";

// Create a new textbook
export const createTextbook = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    author,
    price,
    coverImage,
    pdfUrl,
    lecturerId,
    lecturerName,
    category,
    isbn,
    fileKey,
    fileName,
    thumbnailKey,
    thumbnailName,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !author ||
    !price ||
    !coverImage ||
    !pdfUrl ||
    !lecturerId ||
    !lecturerName ||
    !category ||
    !fileKey ||
    !fileName
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  if (req.user.role !== "lecturer") {
    return res.status(403).json({
      success: false,
      message: "Only lecturers can create textbooks",
    });
  }

  const textbook = new Textbook({
    title,
    description,
    author,
    price,
    coverImage,
    pdfUrl,
    lecturerId,
    lecturerName,
    category,
    isbn,
    fileKey,
    fileName,
    thumbnailKey,
    thumbnailName,
  });

  await textbook.save();

  res.status(201).json({
    success: true,
    message: "Textbook created successfully",
    data: textbook,
  });
});

// Get all textbooks
export const getAllTextbooks = asyncHandler(async (req, res) => {
  const { category, lecturerId, search } = req.query;

  let query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by lecturer
  if (lecturerId) {
    query.lecturerId = lecturerId;
  }

  // Search by title or author
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  const textbooks = await Textbook.find(query).sort({ createdAt: -1 });

  // Generate fresh signed URLs for viewing
  const textbooksWithUrls = textbooks.map((textbook) => {
    const textbookObj = textbook.toObject();

    // Generate signed URL for PDF (24 hours)
    if (textbookObj.fileKey) {
      textbookObj.pdfUrl = getSignedUrl(textbookObj.fileKey, 86400, false);
    }

    // Generate signed URL for thumbnail (24 hours)
    if (textbookObj.thumbnailKey) {
      textbookObj.coverImage = getSignedUrl(
        textbookObj.thumbnailKey,
        86400,
        false
      );
    }

    return textbookObj;
  });

  res.status(200).json({
    success: true,
    count: textbooksWithUrls.length,
    data: textbooksWithUrls,
  });
});

// Get a single textbook by ID
export const getTextbookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const textbook = await Textbook.findById(id);

  if (!textbook) {
    return res.status(404).json({
      success: false,
      message: "Textbook not found",
    });
  }

  const textbookObj = textbook.toObject();

  // Generate fresh signed URLs
  if (textbookObj.fileKey) {
    textbookObj.pdfUrl = getSignedUrl(textbookObj.fileKey, 86400, false);
  }

  if (textbookObj.thumbnailKey) {
    textbookObj.coverImage = getSignedUrl(
      textbookObj.thumbnailKey,
      86400,
      false
    );
  }

  res.status(200).json({
    success: true,
    data: textbookObj,
  });
});

// Update a textbook
export const updateTextbook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const textbook = await Textbook.findById(id);

  if (!textbook) {
    return res.status(404).json({
      success: false,
      message: "Textbook not found",
    });
  }

  // Update fields
  Object.keys(updates).forEach((key) => {
    textbook[key] = updates[key];
  });

  await textbook.save();

  res.status(200).json({
    success: true,
    message: "Textbook updated successfully",
    data: textbook,
  });
});

// Delete a textbook
export const deleteTextbook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const textbook = await Textbook.findById(id);

  if (!textbook) {
    return res.status(404).json({
      success: false,
      message: "Textbook not found",
    });
  }

  // Delete files from S3
  try {
    if (textbook.fileKey) {
      await deleteFromS3(textbook.fileKey);
    }
    if (textbook.thumbnailKey) {
      await deleteFromS3(textbook.thumbnailKey);
    }
  } catch (error) {
    console.error("Error deleting files from S3:", error);
  }

  await Textbook.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Textbook deleted successfully",
  });
});

// Get textbooks by lecturer
export const getTextbooksByLecturer = asyncHandler(async (req, res) => {
  const { lecturerId } = req.params;

  const textbooks = await Textbook.find({ lecturerId }).sort({ createdAt: -1 });

  // Generate fresh signed URLs
  const textbooksWithUrls = textbooks.map((textbook) => {
    const textbookObj = textbook.toObject();

    if (textbookObj.fileKey) {
      textbookObj.pdfUrl = getSignedUrl(textbookObj.fileKey, 86400, false);
    }

    if (textbookObj.thumbnailKey) {
      textbookObj.coverImage = getSignedUrl(
        textbookObj.thumbnailKey,
        86400,
        false
      );
    }

    return textbookObj;
  });

  res.status(200).json({
    success: true,
    count: textbooksWithUrls.length,
    data: textbooksWithUrls,
  });
});

// Get textbooks by category
export const getTextbooksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const textbooks = await Textbook.find({ category }).sort({ createdAt: -1 });

  // Generate fresh signed URLs
  const textbooksWithUrls = textbooks.map((textbook) => {
    const textbookObj = textbook.toObject();

    if (textbookObj.fileKey) {
      textbookObj.pdfUrl = getSignedUrl(textbookObj.fileKey, 86400, false);
    }

    if (textbookObj.thumbnailKey) {
      textbookObj.coverImage = getSignedUrl(
        textbookObj.thumbnailKey,
        86400,
        false
      );
    }

    return textbookObj;
  });

  res.status(200).json({
    success: true,
    count: textbooksWithUrls.length,
    data: textbooksWithUrls,
  });
});
