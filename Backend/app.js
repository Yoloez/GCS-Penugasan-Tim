import express from "express";
import cors from "cors";
import { openDb } from "./src/db.js";
import apiRoutes from "./src/routes/index.js";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
openDb().then(() => {
  console.log("✅ Database connected");
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "UAV Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      api: "/api",
      flightPlans: "/api/flight-plans",
      trajectories: "/api/trajectories",
      uavPosition: "/api/uav-position",
    },
  });
});

// Mount API routes
app.use("/api", apiRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 APLIKASI BERJALAN DI PORT: ${port}`);
  console.log(`📡 API tersedia di: http://localhost:${port}`);
});
