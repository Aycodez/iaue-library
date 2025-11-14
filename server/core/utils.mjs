import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const accessTokenAge = 30 * 24 * 60 * 60; // 30 days in seconds
const refreshTokenAge = 90 * 24 * 60 * 60; // 90 days in seconds
const JWT_SECRET = process.env.JWT_SECRET;

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: accessTokenAge,
  });

  const refreshToken = jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: refreshTokenAge,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: accessTokenAge,
  };
};

// Keep the old function for backward compatibility
export const generateToken = (res, userId) => {
  const { accessToken } = generateTokens(userId);
  return accessToken;
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
