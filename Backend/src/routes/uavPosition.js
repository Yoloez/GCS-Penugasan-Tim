import express from "express";
import * as UavPositionController from "../controllers/uavPositionController.js";

const router = express.Router();

/**
 * UAV Position Routes
 * Base path: /api/uav-position
 */

// GET /api/uav-position - Get latest UAV position
router.get("/", UavPositionController.getLatest);

// GET /api/uav-position/history - Get position history
router.get("/history", UavPositionController.getHistory);

// POST /api/uav-position - Save new position
router.post("/", UavPositionController.create);

export default router;
