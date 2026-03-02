import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
connectDB();

// 2. Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// Rate Limiting: Prevents brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// 3. Dynamic CORS Configuration
// This allows local dev, your main production URL, and any Vercel preview links.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  /\.vercel\.app$/, // Regex to allow all Vercel subdomains
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 4. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ai", aiRoutes);

// 6. Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "LifeOS API is operational",
    timestamp: new Date().toISOString(),
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Logic: In production, don't leak the stack trace for security
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
});

// 8. Server Start
app.listen(PORT, () => {
  console.log(` LifeOS Server active on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});
