import express from "express";

import {
  getLocalBusinesses,
  getBusinessesByCategory,
  addLocalBusiness,
  getLocalBusinessById,
  getNearbyLocalBusinesses,
} from "../Controllers/localBusinessController.js";

const router = express.Router();

// Get nearby businesses using current location
router.get("/nearby", getNearbyLocalBusinesses);

// Get all local businesses
router.get("/", getLocalBusinesses);

// Get businesses by category
router.get("/category/:category", getBusinessesByCategory);

// Get single business details
router.get("/:id", getLocalBusinessById);

// Add new local business
router.post("/add", addLocalBusiness);

export default router;
