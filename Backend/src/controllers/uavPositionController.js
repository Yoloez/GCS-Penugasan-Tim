import * as UavPositionModel from "../models/uavPositionModel.js";

/**
 * UAV Position Controller
 * Menghandle HTTP requests untuk UAV positions
 */

// Get latest UAV position
export async function getLatest(req, res) {
  try {
    const position = await UavPositionModel.getLatest();

    if (!position) {
      return res.json({ message: "No position data available" });
    }

    res.json(position);
  } catch (error) {
    console.error("Error getting latest position:", error);
    res.status(500).json({ error: error.message });
  }
}

// Get UAV position history
export async function getHistory(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const history = await UavPositionModel.getHistory(limit);
    res.json(history);
  } catch (error) {
    console.error("Error getting position history:", error);
    res.status(500).json({ error: error.message });
  }
}

// Save new UAV position
export async function create(req, res) {
  try {
    const result = await UavPositionModel.create(req.body);
    res.status(201).json({
      ...result,
      message: "Position saved successfully",
    });
  } catch (error) {
    console.error("Error saving position:", error);

    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
}
