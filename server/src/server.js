
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const chatRoutes = require("./routes/chat");
const incidentRoutes = require("./routes/incidents");

const app = express();

// Trust Render's reverse proxy.
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Finland Cybersecurity Assistant API is running!",
  });
});

// Health check — intentionally excluded from rate limiting.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Finland Cybersecurity Assistant",
  });
});

// Rate limiter — applies to application API routes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// API routes
app.use("/api", chatRoutes);
app.use("/api/incidents", incidentRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
