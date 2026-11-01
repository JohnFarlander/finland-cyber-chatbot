const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");

const { db } = require("../config/firebase");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const allowedCategories = [
  "Phishing",
  "Online Fraud",
  "Account Compromise",
  "Malware",
  "Data Breach",
  "Other",
];

const allowedSeverities = ["Low", "Medium", "High", "Critical"];

const allowedStatuses = ["Open", "Under Review", "Resolved"];

// ADMIN: GET /api/incidents
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db
      .collection("incidents")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const incidents = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        category: data.category || "Other",
        description: data.description || "",
        severity: data.severity || "Low",
        status: data.status === "Pending"
          ? "Open"
          : data.status || "Open",
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : null,
      };
    });

    return res.json({
      success: true,
      total: incidents.length,
      incidents,
    });
  } catch (error) {
    console.error("Failed to fetch incidents:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to retrieve incidents.",
    });
  }
});

// SIGNED-IN USER: POST /api/incidents
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, category, description, severity } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 100
    ) {
      return res.status(400).json({
        error: "Enter a valid name.",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: "Invalid incident category.",
      });
    }

    if (
      typeof description !== "string" ||
      description.trim().length < 10 ||
      description.length > 5000
    ) {
      return res.status(400).json({
        error: "Description must be between 10 and 5000 characters.",
      });
    }

    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({
        error: "Invalid severity.",
      });
    }

    if (!req.user.email) {
      return res.status(403).json({
        error: "Your account must have a verified email address.",
      });
    }

    const incident = {
      name: name.trim(),
      email: req.user.email.toLowerCase(),
      submittedBy: req.user.uid,
      category,
      description: description.trim(),
      severity,
      status: "Open",
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("incidents").add(incident);

    return res.status(201).json({
      success: true,
      message: "Incident report submitted successfully.",
      incidentId: docRef.id,
    });
  } catch (error) {
    console.error("Incident submission failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to submit incident report.",
    });
  }
});

// ADMIN: PATCH /api/incidents/:id/status
router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid incident status.",
      });
    }

    const incidentRef = db.collection("incidents").doc(id);
    const incidentDoc = await incidentRef.get();

    if (!incidentDoc.exists) {
      return res.status(404).json({
        error: "Incident not found.",
      });
    }

    await incidentRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.json({
      success: true,
      message: "Incident status updated successfully.",
      incidentId: id,
      status,
    });
  } catch (error) {
    console.error("Status update failed:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to update incident status.",
    });
  }
});

module.exports = router;