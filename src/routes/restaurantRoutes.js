const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

// get /api/restaurants
router.get("/", restaurantController.getNearbyRestaurants);

module.exports = router;