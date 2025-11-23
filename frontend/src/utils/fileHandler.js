export const savePlanToFile = (plan) => {
  // Simpan ke localStorage sebagai backup saja (tidak auto-download)
  const existingPlans = JSON.parse(localStorage.getItem("uav_plans") || "[]");
  const updatedPlans = [...existingPlans.filter((p) => p.id !== plan.id), plan];
  localStorage.setItem("uav_plans", JSON.stringify(updatedPlans));
};

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

export const loadPlansFromStorage = () => {
  return JSON.parse(localStorage.getItem("uav_plans") || "[]");
};
