const express = require('express');
const db = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes'); // <--- Import

const app = express();
app.use(express.json());

// routes
app.use('/api/restaurants', restaurantRoutes); // <--- Mount

const startServer = async () => {
  try {
    // Test DB connection
    await db.query('SELECT NOW()');
    console.log("✅ PostGIS Database Connected");
    
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
};

startServer();