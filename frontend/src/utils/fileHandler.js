// Save to localStorage as fallback and trigger download
export const savePlanToFile = (plan) => {
	// Save ke localStorage
	const existingPlans = JSON.parse(localStorage.getItem("uav_plans") || "[]");
	const updatedPlans = [...existingPlans.filter((p) => p.id !== plan.id), plan];
	localStorage.setItem("uav_plans", JSON.stringify(updatedPlans));

	// Optional: trigger download
	const dataStr = JSON.stringify(plan, null, 2);
	const dataBlob = new Blob([dataStr], { type: "application/json" });

	const link = document.createElement("a");
	link.href = URL.createObjectURL(dataBlob);
	link.download = `${plan.name.replace(/\s+/g, "_")}.json`;
	link.click();
};

// Load plan from file
export const loadPlanFromFile = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const plan = JSON.parse(e.target.result);
				if (!plan.id || !plan.name || !plan.data) {
					throw new Error("Invalid plan file format");
				}
				resolve(plan);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsText(file);
	});
};

// Load plans from localStorage
export const loadPlansFromStorage = () => {
	return JSON.parse(localStorage.getItem("uav_plans") || "[]");
};

// Server API functions
export const savePlanToServer = async (plan) => {
	await fetch("http://localhost:4000/plan", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(plan),
	});
};

export const loadPlanFromServer = async (id) => {
	const res = await fetch(`http://localhost:4000/plan/${id}`);
	return await res.json();
};

export const loadAllPlans = async () => {
	const res = await fetch(`http://localhost:4000/plans`);
	return await res.json();
};
