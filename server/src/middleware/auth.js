const { adminAuth } = require("../config/firebase");

// Verify a Firebase ID token. Anonymous credentials are accepted only
// for the chatbot preview; all other protected endpoints require a
// verified email account.
async function verifyFirebaseToken(req, res, next, allowAnonymous = false) {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please sign in.",
      });
    }

    const idToken = authorization.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken, true);
    const isAnonymous =
      decodedToken.firebase?.sign_in_provider === "anonymous";

    if (isAnonymous && !allowAnonymous) {
      return res.status(403).json({
        success: false,
        error: "Guest preview access is limited to the chatbot.",
      });
    }

    if (!isAnonymous && !decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email address.",
      });
    }

    req.user = decodedToken;
    req.isGuest = isAnonymous;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token.",
    });
  }
}

function requireAuth(req, res, next) {
  return verifyFirebaseToken(req, res, next, false);
}

function requireChatAuth(req, res, next) {
  return verifyFirebaseToken(req, res, next, true);
}

function requireAdmin(req, res, next) {
  if (req.user?.admin !== true || req.isGuest) {
    return res.status(403).json({
      success: false,
      error: "Administrator access required.",
    });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireChatAuth,
  requireAdmin,
};
