const restaurantRepo = require("../repositories/restaurantRepository");

const getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, long, radius } = req.query;

    if (!lat || !long) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    // convert to numbers
    const userLat = parseFloat(lat);
    const userLong = parseFloat(long);
    const searchRadius = parseFloat(radius) || 5000;

    const restaurants = await restaurantRepo.findNearby(userLat, userLong, searchRadius);

    res.json({
      count: restaurants.length,
      data: restaurants
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getNearbyRestaurants };