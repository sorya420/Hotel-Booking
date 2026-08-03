import express from "express";

import {
  createEmergencyRequest,
  getAllEmergencyRequests,
  updateEmergencyStatus,
  deleteEmergencyRequest,
} from "../Controllers/emergencyController.js";

const router = express.Router();

// Create Emergency Request
router.post("/request", createEmergencyRequest);

// Get All Requests
router.get("/all", getAllEmergencyRequests);

// Update Status
router.put("/status/:id", updateEmergencyStatus);

// Delete Request
router.delete("/delete/:id", deleteEmergencyRequest);

export default router;