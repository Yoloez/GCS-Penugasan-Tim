import { saveUavPosition, getLatestUavPosition, getUavPositionHistory } from "../db.js";

/**
 * UAV Position Model
 * Menghandle business logic untuk UAV positions
 */

export async function getLatest() {
  return await getLatestUavPosition();
}

export async function getHistory(limit = 100) {
  return await getUavPositionHistory(limit);
}

export async function create(data) {
  const { latitude, longitude, altitude, heading, speed } = data;

  if (latitude === undefined || longitude === undefined) {
    throw new Error("Latitude and longitude are required");
  }

  const id = await saveUavPosition(latitude, longitude, altitude || 0, heading || 0, speed || 0);
  return { id };
}
