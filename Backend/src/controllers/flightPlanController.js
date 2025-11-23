import * as FlightPlanModel from "../models/flightPlanModel.js";

/**
 * Flight Plan Controller
 * Menghandle HTTP requests untuk flight plans
 */

// Get all flight plans
export async function getAll(req, res) {
  try {
    const plans = await FlightPlanModel.findAll();
    res.json(plans);
  } catch (error) {
    console.error("Error getting flight plans:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get single flight plan by ID
export async function getById(req, res) {
  try {
    const plan = await FlightPlanModel.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Flight plan not found" });
    }

    res.json(plan);
  } catch (error) {
    console.error("Error getting flight plan:", error);
    res.status(500).json({ error: error.message });
  }
}

// Create new flight plan
export async function create(req, res) {
  try {
    const result = await FlightPlanModel.create(req.body);
    res.status(201).json({
      ...result,
      message: "Flight plan created successfully",
    });
  } catch (error) {
    console.error("Error creating flight plan:", error);

    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
}

// Update flight plan
export async function update(req, res) {
  try {
    await FlightPlanModel.update(req.params.id, req.body);
    res.json({ message: "Flight plan updated successfully" });
  } catch (error) {
    console.error("Error updating flight plan:", error);

    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
}

// Delete flight plan
export async function remove(req, res) {
  try {
    await FlightPlanModel.remove(req.params.id);
    res.json({ message: "Flight plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting flight plan:", error);
    res.status(500).json({ error: error.message });
  }
}
