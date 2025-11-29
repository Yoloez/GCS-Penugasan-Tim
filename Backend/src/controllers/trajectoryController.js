import * as TrajectoryModel from "../models/trajectoryModel.js";

/**
 * Trajectory Controller
 * Menghandle HTTP requests untuk trajectories
 */

// Get all trajectories
export async function getAll(req, res) {
  try {
    const trajectories = await TrajectoryModel.findAll();
    res.json(trajectories);
  } catch (error) {``
    console.error("Error getting trajectories:", error);
    res.status(500).json({ error: error.message });
  }
}

// Create new trajectory
export async function create(req, res) {
  try {
    const result = await TrajectoryModel.create(req.body);
    res.status(201).json({
      ...result,
      message: "Trajectory saved successfully",
    });
  } catch (error) {
    console.error("Error creating trajectory:", error);

    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
}

// Delete trajectory
export async function remove(req, res) {
  try {
    await TrajectoryModel.remove(req.params.id);
    res.json({ message: "Trajectory deleted successfully" });
  } catch (error) {
    console.error("Error deleting trajectory:", error);
    res.status(500).json({ error: error.message });
  }
}
