const API_BASE = "http://localhost:4000/api";

// ==================== FLIGHT PLANS ====================

// Get all flight plans
export const getPlans = async () => {
  try {
    const response = await fetch(`${API_BASE}/flight-plans`);
    if (!response.ok) throw new Error("Failed to fetch plans");
    return response.json();
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

// Get single flight plan
export const getPlan = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/flight-plans/${id}`);
    if (!response.ok) throw new Error("Failed to fetch plan");
    return response.json();
  } catch (error) {
    console.error("Error fetching plan:", error);
    throw error;
  }
};

// Create flight plan
export const createPlan = async (plan) => {
  try {
    const response = await fetch(`${API_BASE}/flight-plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: plan.name,
        description: plan.description || "",
        waypoints: plan.waypoints || plan.points || [],
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create plan");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

// Update flight plan
export const updatePlan = async (id, plan) => {
  try {
    const response = await fetch(`${API_BASE}/flight-plans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: plan.name,
        description: plan.description || "",
        waypoints: plan.waypoints || plan.points || [],
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update plan");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};

// Delete flight plan
export const deletePlan = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/flight-plans/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete plan");
    return response.json();
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw error;
  }
};

// ==================== TRAJECTORIES ====================

// Get all trajectories
export const getTrajectories = async () => {
  try {s
    const response = await fetch(`${API_BASE}/trajectories`);
    if (!response.ok) throw new Error("Failed to fetch trajectories");
    return response.json();
  } catch (error) {
    console.error("Error fetching trajectories:", error);
    throw error;
  }
};

// Save trajectory
export const saveTrajectory = async (trajectory) => {
  try {
    const response = await fetch(`${API_BASE}/trajectories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trajectory.name,
        points: trajectory.points,
        duration: trajectory.duration || 0,
        distance: trajectory.distance || 0,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save trajectory");
    }
    return response.json();
  } catch (error) {
    console.error("Error saving trajectory:", error);
    throw error;
  }
};

// Delete trajectory
export const deleteTrajectory = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/trajectories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete trajectory");
    return response.json();
  } catch (error) {
    console.error("Error deleting trajectory:", error);
    throw error;
  }
};

// ==================== UAV POSITION ====================

// Get latest UAV position
export const getLatestPosition = async () => {
  try {
    const response = await fetch(`${API_BASE}/uav-position`);
    if (!response.ok) throw new Error("Failed to fetch position");
    return response.json();
  } catch (error) {
    console.error("Error fetching position:", error);
    throw error;
  }
};

// Get UAV position history
export const getPositionHistory = async (limit = 100) => {
  try {
    const response = await fetch(`${API_BASE}/uav-position/history?limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch position history");
    return response.json();
  } catch (error) {
    console.error("Error fetching position history:", error);
    throw error;
  }
};

// Save UAV position
export const savePosition = async (position) => {
  try {
    const response = await fetch(`${API_BASE}/uav-position`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: position.latitude,
        longitude: position.longitude,
        altitude: position.altitude || 0,
        heading: position.heading || 0,
        speed: position.speed || 0,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save position");
    }
    return response.json();
  } catch (error) {
    console.error("Error saving position:", error);
    throw error;
  }
};
