const path = require("path");

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccountPath = path.resolve(
  __dirname,
  "../../",
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH
);

const serviceAccount = require(serviceAccountPath);

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

const adminAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

module.exports = {
  adminAuth,
  db,
};