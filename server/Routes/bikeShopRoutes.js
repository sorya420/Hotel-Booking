import express from "express";

import {
    addBikeShop,
    getBikeShops
} from "../Controllers/bikeShopController.js";


const router = express.Router();


// Add Bike Shop
router.post(
    "/add",
    addBikeShop
);


// Get All Bike Shops
router.get(
    "/all",
    getBikeShops
);


export default router;