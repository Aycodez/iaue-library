import s3 from "../config/aws.mjs";
import { uploadToS3, getSignedUrl, deleteFromS3 } from "../utils/s3Helper.mjs";

// Upload file to S3
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload",
      });
    }

    // Upload file to S3
    const uploadResult = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.file.fieldname
    );

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileName: req.file.originalname,
        fileUrl: uploadResult.location,
        fileKey: uploadResult.key,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate download URL for file
export const getDownloadUrl = async (req, res) => {
  try {
    const { fileName, fileKey } = req.query; // Optional custom filename

    // Generate pre-signed URL with download disposition (max 7 days)
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      Expires: 604800, // 7 days (maximum allowed by AWS)
      ResponseContentDisposition: `attachment; filename="${
        fileName || "download"
      }"`,
    };

    const downloadUrl = s3.getSignedUrl("getObject", params);

    res.status(200).json({
      success: true,
      data: {
        downloadUrl,
        expiresIn: "7 days",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get fresh view URL for files (for thumbnails and viewing)
export const getViewUrl = async (req, res) => {
  try {
    const { fileKey } = req.params;

    // Generate view URL (24 hours expiration)
    const viewUrl = getSignedUrl(fileKey, 86400, false);

    res.status(200).json({
      success: true,
      data: {
        viewUrl,
        expiresIn: "24 hours",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
