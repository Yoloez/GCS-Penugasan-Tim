import express from "express";
import * as FlightPlanController from "../controllers/flightPlanController.js";

const router = express.Router();

/**
 * Flight Plans Routes
 * Base path: /api/flight-plans
 */

// GET /api/flight-plans - Get all flight plans
router.get("/", FlightPlanController.getAll);

// GET /api/flight-plans/:id - Get single flight plan
router.get("/:id", FlightPlanController.getById);

// POST /api/flight-plans - Create new flight plan
router.post("/", FlightPlanController.create);

// PUT /api/flight-plans/:id - Update flight plan
router.put("/:id", FlightPlanController.update);

// DELETE /api/flight-plans/:id - Delete flight plan
router.delete("/:id", FlightPlanController.remove);

export default router;
