import { saveTrajectory, getAllTrajectories, deleteTrajectory } from "../db.js";

/**
 * Trajectory Model
 * Menghandle business logic untuk trajectories
 */

export async function findAll() {
  const trajectories = await getAllTrajectories();
  return trajectories.map((traj) => ({
    ...traj,
    points: JSON.parse(traj.points),
  }));
}

export async function create(data) {
  const { name, points, duration, distance } = data;

  if (!name || !points) {
    throw new Error("Name and points are required");
  }

  if (!Array.isArray(points)) {
    throw new Error("Points must be an array");
  }

  const id = await saveTrajectory(name, points, duration || 0, distance || 0);
  return { id };
}

export async function remove(id) {
  await deleteTrajectory(id);
  return { id };
}
