import express from "express";
import http from "http";
import cors from "cors";

import connectDB from "./config/database.mjs";
import dotenv from "dotenv";

//routes
import userRoute from "./routes/userRoutes.mjs";
import textbookRoute from "./routes/textbook.mjs";
import purchaseRoute from "./routes/purchaseRoute.mjs";

dotenv.config();

const app = express();
const httpServer = http.Server(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "https://iaue-library.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cors(corsOptions));

connectDB();

app.use("/api/v1/users/", userRoute);
app.use("/api/v1/textbooks/", textbookRoute);
app.use("/api/v1/purchases/", purchaseRoute);
// 404 handler

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "API was not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("=== Global Error Handler ===");
  console.error("Error:", error);
  console.error("Stack:", error.stack);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log("Server running on Port: " + PORT);
});
