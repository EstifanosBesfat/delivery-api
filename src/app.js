const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes"); // <--- Import

const app = express();
app.use(express.json());

// create the http server explicitly
const server = http.createServer(app);

// attach socket.io to the server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// real time event loop
io.on("connection", (socket) => {
  console.log(`new client connected: ${socket.id}`);
  // event: driver sends their location
  socket.on("driverLocation", (data) => {
    console.log(`Driver ${data.drivedId} is at: ${data.lat}, ${data.long}`);

    // in a real app we would send only to the speciif customer
    // for now we broadcast it to everyone for testing
    io.emit("trackDriver", data);
  });
  socket.on("disconnect", () => {
    console.log(`client disconnected: ${socket.id}`);
  });
});
// routes
app.use("/api/restaurants", restaurantRoutes); // <--- Mount

const startServer = async () => {
  try {
    // Test DB connection
    await db.query("SELECT NOW()");
    console.log("✅ PostGIS Database Connected");

    server.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ DB Connection Failed:", err);
  }
};

startServer();
