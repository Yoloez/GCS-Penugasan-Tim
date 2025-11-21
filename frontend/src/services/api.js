const API_BASE = "http://localhost:3001";

// Get all plans
export const getPlans = async () => {
	const response = await fetch(`${API_BASE}/plans`);
	if (!response.ok) throw new Error("Failed to fetch plans");
	return response.json();
};

// Get single plan
export const getPlan = async (id) => {
	const response = await fetch(`${API_BASE}/plans/${id}`);
	if (!response.ok) throw new Error("Failed to fetch plan");
	return response.json();
};

// Create plan
export const createPlan = async (plan) => {
	const response = await fetch(`${API_BASE}/plans`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...plan,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}),
	});
	if (!response.ok) throw new Error("Failed to create plan");
	return response.json();
};

// Update plan
export const updatePlan = async (id, plan) => {
	const response = await fetch(`${API_BASE}/plans/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...plan,
			updatedAt: new Date().toISOString(),
		}),
	});
	if (!response.ok) throw new Error("Failed to update plan");
	return response.json();
};

// Delete plan
export const deletePlan = async (id) => {
	const response = await fetch(`${API_BASE}/plans/${id}`, {
		method: "DELETE",
	});
	if (!response.ok) throw new Error("Failed to delete plan");
};
