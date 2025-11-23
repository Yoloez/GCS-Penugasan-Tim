import { getAllFlightPlans, getFlightPlanById, createFlightPlan, updateFlightPlan, deleteFlightPlan } from "../db.js";

/**
 * Flight Plan Model
 * Menghandle business logic untuk flight plans
 */

export async function findAll() {
  const plans = await getAllFlightPlans();
  return plans.map((plan) => ({
    ...plan,
    waypoints: JSON.parse(plan.waypoints),
  }));
}

export async function findById(id) {
  const plan = await getFlightPlanById(id);
  if (!plan) return null;
  return {
    ...plan,
    waypoints: JSON.parse(plan.waypoints),
  };
}

export async function create(data) {
  const { name, description, waypoints } = data;

  if (!name || !waypoints) {
    throw new Error("Name and waypoints are required");
  }

  if (!Array.isArray(waypoints)) {
    throw new Error("Waypoints must be an array");
  }

  const id = await createFlightPlan(name, description || "", waypoints);
  return { id };
}

export async function update(id, data) {
  const { name, description, waypoints } = data;

  if (!name || !waypoints) {
    throw new Error("Name and waypoints are required");
  }

  await updateFlightPlan(id, name, description || "", waypoints);
  return { id };
}

export async function remove(id) {
  await deleteFlightPlan(id);
  return { id };
}
