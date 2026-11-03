const express = require("express");
const { detectIntent } = require("../services/dialogflow");
const { requireChatAuth } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// A tighter per-IP limit protects the public guest preview from excessive
// Dialogflow traffic. The global API limiter in server.js still applies too.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "The demo chat limit has been reached. Please try again later.",
  },
});

// Verified users and anonymous portfolio-demo users may use the chatbot.
router.post("/chat", chatLimiter, requireChatAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 1000
    ) {
      return res.status(400).json({
        error: "Message must contain 1–1000 characters.",
      });
    }

    if (
      typeof sessionId !== "string" ||
      !/^[A-Za-z0-9_-]{1,36}$/.test(sessionId)
    ) {
      return res.status(400).json({
        error: "A valid session ID is required.",
      });
    }

    const result = await detectIntent(message.trim(), sessionId);

    return res.json({
      success: true,
      reply: result.reply,
      intent: result.intent,
      confidence: result.confidence,
    });
  } catch (error) {
    console.error("Dialogflow request failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to process your message right now.",
    });
  }
});

module.exports = router;
