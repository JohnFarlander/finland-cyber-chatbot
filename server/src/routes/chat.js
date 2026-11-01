const express = require("express");
const { detectIntent } = require("../services/dialogflow");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/chat", requireAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Validate message
    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 1000
    ) {
      return res.status(400).json({
        error: "Message must contain 1–1000 characters.",
      });
    }

    // Dialogflow session IDs must be 1–36 characters
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