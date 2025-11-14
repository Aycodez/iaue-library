import s3 from "../config/aws.mjs";
import path from "path";

/**
 * Upload file buffer to S3
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} originalname - Original filename
 * @param {string} mimetype - File mimetype
 * @param {string} fieldname - Form field name
 * @returns {Object} Upload result with location and key
 */
export const uploadToS3 = async (
  fileBuffer,
  originalname,
  mimetype,
  fieldname
) => {
  try {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(originalname);
    const fileName = fieldname + "-" + uniqueSuffix + fileExtension;

    // Organize files by type
    let folder = "uploads";
    if (fieldname === "image" || fieldname === "thumbnail") {
      folder = "blogs";
    } else if (fieldname === "file") {
      folder = "files";
    }

    const key = `${folder}/${fileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    const result = await s3.upload(uploadParams).promise();

    // Generate pre-signed URL for viewing (24 hours)
    const viewUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: result.Key,
      Expires: 86400, // 24 hours
    });

    return {
      location: viewUrl, // Pre-signed URL for viewing
      key: result.Key,
      bucket: result.Bucket,
      etag: result.ETag,
      originalLocation: result.Location, // Keep original for reference
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(`Failed to upload to S3: ${error.message}`);
  }
};

/**
 * Generate pre-signed URL for file access
 * @param {string} key - S3 object key
 * @param {number} expires - Expiration time in seconds (default: 24 hours)
 * @param {boolean} forceDownload - Whether to force download
 * @param {string} filename - Custom filename for download
 * @returns {string} Pre-signed URL
 */
export const getSignedUrl = (
  key,
  expires = 86400,
  forceDownload = false,
  filename = null
) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: expires,
  };

  // Add download headers if needed
  if (forceDownload && filename) {
    params.ResponseContentDisposition = `attachment; filename="${filename}"`;
  }

  return s3.getSignedUrl("getObject", params);
};

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise} Delete result
 */
export const deleteFromS3 = async (key) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const result = await s3.deleteObject(deleteParams).promise();
    return result;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw new Error(`Failed to delete from S3: ${error.message}`);
  }
};
