require("dotenv").config();

const { adminAuth } = require("../src/config/firebase");

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error(
      "Usage: node scripts/make-admin.js admin@example.com"
    );
    process.exitCode = 1;
    return;
  }

  try {
    const user = await adminAuth.getUserByEmail(email);

    if (!user.emailVerified) {
      console.error(
        "This account must verify its email before becoming an admin."
      );
      process.exitCode = 1;
      return;
    }

    const existingClaims = user.customClaims || {};

    await adminAuth.setCustomUserClaims(user.uid, {
      ...existingClaims,
      admin: true,
    });

    console.log("Administrator role assigned successfully.");
    console.log("Email:", user.email);
    console.log("UID:", user.uid);
    console.log("Ask this user to sign out and sign in again.");
  } catch (error) {
    console.error("Could not assign administrator:", error.message);
    process.exitCode = 1;
  }
}

makeAdmin();