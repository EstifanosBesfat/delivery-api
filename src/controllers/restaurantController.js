const restaurantRepo = require("../repositories/restaurantRepository");
const redisClient = require("../config/redis");

const getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, long, radius } = req.query;

    if (!lat || !long) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    // convert to numbers
    const userLat = parseFloat(lat);
    const userLong = parseFloat(long);
    const searchRadius = parseFloat(radius) || 5000;

    // cache check
    // create a unique key for this specific search
    const cacheKey = `restaurants:${userLat}:${userLong}:${searchRadius}`;

    // check redis
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("serving from chace");
      return res.json(JSON.parse(cachedData));
    }

    console.log("serving from database");

    const restaurants = await restaurantRepo.findNearby(
      userLat,
      userLong,
      searchRadius,
    );

    const response = {
      count: restaurants.length,
      data: restaurants,
    };

    // save to cach
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 60 });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getNearbyRestaurants };
