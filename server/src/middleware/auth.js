const { adminAuth } = require("../config/firebase");

// Verify Firebase authentication token
async function requireAuth(req, res, next) {
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

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email address.",
      });
    }

    req.user = decodedToken;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token.",
    });
  }
}

// Administrator authorization
function requireAdmin(req, res, next) {
  if (req.user?.admin !== true) {
    return res.status(403).json({
      success: false,
      error: "Administrator access required.",
    });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};