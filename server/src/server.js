
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const chatRoutes = require("./routes/chat");
const incidentRoutes = require("./routes/incidents");

const app = express();

// Trust the hosting platform's reverse proxy.
app.set("trust proxy", 1);

// Rate limiter
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

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

app.use("/api", apiLimiter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Finland Cybersecurity Assistant API is running!",
  });
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Finland Cybersecurity Assistant",
  });
});

// API routes
app.use("/api", chatRoutes);
app.use("/api/incidents", incidentRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
