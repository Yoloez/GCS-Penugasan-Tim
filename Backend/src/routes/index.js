import express from "express";
import flightPlansRouter from "./flightPlans.js";
import trajectoriesRouter from "./trajectories.js";
import uavPositionRouter from "./uavPosition.js";

const router = express.Router();

/**
 * Main Router - Combines all route modules
 * Base path: /api
 */

// Mount route modules
router.use("/flight-plans", flightPlansRouter);
router.use("/trajectories", trajectoriesRouter);
router.use("/uav-position", uavPositionRouter);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "UAV Backend API",
    version: "1.0.0",
    endpoints: {
      flightPlans: "/api/flight-plans",
      trajectories: "/api/trajectories",
      uavPosition: "/api/uav-position",
    },
  });
});

export default router;
