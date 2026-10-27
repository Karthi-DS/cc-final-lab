require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { syncAndSeedDatabase, FoodItem, Order } = require("./models");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for frontend Vite dev server (e.g. http://localhost:5173) and any origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Online Food Ordering Backend API",
    timestamp: new Date().toISOString(),
  });
});

// Dashboard stats endpoint for quick admin insights
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const totalDishes = await FoodItem.count();
    const availableDishes = await FoodItem.count({ where: { isAvailable: true } });
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { orderStatus: "Pending" } });
    const orders = await Order.findAll({ attributes: ["totalAmount", "orderStatus"] });

    const totalRevenue = orders
      .filter((o) => o.orderStatus !== "Cancelled")
      .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

    res.json({
      totalDishes,
      availableDishes,
      totalOrders,
      pendingOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Serve frontend build if dist folder exists
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await syncAndSeedDatabase();
    return new Promise((resolve) => {
      const server = app.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(`Food Ordering Service running on port ${PORT}`);
        console.log(`App URL:     http://localhost:${PORT}`);
        console.log(`Foods API:   http://localhost:${PORT}/api/foods`);
        console.log(`Orders API:  http://localhost:${PORT}/api/orders`);
        console.log(`===============================================`);
        resolve(server);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    throw error;
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
