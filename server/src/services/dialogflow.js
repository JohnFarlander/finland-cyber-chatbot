const dialogflow = require("@google-cloud/dialogflow");

const projectId = process.env.DIALOGFLOW_PROJECT_ID;

if (!projectId) {
  throw new Error("DIALOGFLOW_PROJECT_ID is missing from .env");
}

const sessionsClient = new dialogflow.SessionsClient();

async function detectIntent(message, sessionId) {
  const sessionPath = sessionsClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en",
      },
    },
  };

  const [response] = await sessionsClient.detectIntent(request);
  const result = response.queryResult;

  return {
    reply:
      result.fulfillmentText ||
      "I couldn't find a suitable answer. Could you rephrase your question?",
    intent: result.intent?.displayName || "Unknown",
    confidence: result.intentDetectionConfidence || 0,
  };
}

module.exports = { detectIntent };