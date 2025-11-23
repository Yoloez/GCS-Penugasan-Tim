import express from "express";
import * as TrajectoryController from "../controllers/trajectoryController.js";

const router = express.Router();

/**
 * Trajectories Routes
 * Base path: /api/trajectories
 */

// GET /api/trajectories - Get all trajectories
router.get("/", TrajectoryController.getAll);

// POST /api/trajectories - Save new trajectory
router.post("/", TrajectoryController.create);

// DELETE /api/trajectories/:id - Delete trajectory
router.delete("/:id", TrajectoryController.remove);

export default router;
