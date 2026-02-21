const db = require("../config/db");

const findNearby = async (lat, long, radius) => {
  // ST_MakePoint takes (Longitude, Latitude) -> (x, y)
  // ST_Distance returns meters
  // ST_X and ST_Y convert the binary location back to readable numbers

  const query = `
    SELECT 
      id, 
      name, 
      ST_X(location::geometry) as longitude,
      ST_Y(location::geometry) as latitude,
      ST_Distance(
        location, 
        ST_SetSRID(ST_MakePoint($1, $2), 4326)
      ) AS distance
    FROM restaurants
    WHERE ST_DWithin(
      location, 
      ST_SetSRID(ST_MakePoint($1, $2), 4326), 
      $3
    )
    ORDER BY distance ASC;
  `;

  const params = [long, lat, radius];

  const result = await db.query(query, params);
  return result.rows;
};

module.exports = { findNearby };
