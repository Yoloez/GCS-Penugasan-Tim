import React, { useState, useCallback, useEffect } from "react";
import MapComponent from "../components/MapComponent";
import PlanningControls from "../components/PlanningControls";
import PlanList from "../components/PlanList";
import {
	savePlanToFile,
	loadPlanFromFile,
	loadPlansFromStorage,
} from "../utils/fileHandler";

const PlanningPage = () => {
	const [mapType, setMapType] = useState("normal");
	const [drawingMode, setDrawingMode] = useState(null);
	const [plans, setPlans] = useState([]);
	const [activePlan, setActivePlan] = useState(null);
	const [mapRef, setMapRef] = useState(null);
	const [showNameDialog, setShowNameDialog] = useState(false);
	const [pendingPlanData, setPendingPlanData] = useState(null);
	const [planName, setPlanName] = useState("");

	useEffect(() => {
		const savedPlans = loadPlansFromStorage();
		setPlans(savedPlans);
	}, []);

	const handlePlanSave = useCallback((planData) => {
		setPendingPlanData(planData);
		setShowNameDialog(true);
	}, []);

	const handleConfirmPlanName = useCallback(() => {
		if (!pendingPlanData) return;

		const newPlan = {
			id: Date.now().toString(),
			name: planName.trim() || `Plan_${new Date().toLocaleString()}`,
			data: pendingPlanData,
			createdAt: new Date().toISOString(),
		};

		setPlans((prev) => [...prev, newPlan]);
		savePlanToFile(newPlan);
		setDrawingMode(null);
		setShowNameDialog(false);
		setPlanName("");
		setPendingPlanData(null);
		return newPlan;
	}, [pendingPlanData, planName]);

	const handleCancelNameDialog = useCallback(() => {
		setShowNameDialog(false);
		setPlanName("");
		setPendingPlanData(null);
	}, []);

	const handleDrawingCancel = useCallback(() => {
		setDrawingMode(null);
	}, []);

	const handlePlanLoad = useCallback(
		async (planId) => {
			const plan = plans.find((p) => p.id === planId);
			if (plan) {
				setActivePlan(plan);
			}
		},
		[plans]
	);

	const handlePlanDelete = useCallback(
		(planId) => {
			setPlans((prev) => prev.filter((p) => p.id !== planId));
			if (activePlan?.id === planId) {
				setActivePlan(null);
			}
			localStorage.removeItem(`plan_${planId}`);
		},
		[activePlan]
	);

	const handleFileUpload = useCallback(async (event) => {
		const file = event.target.files[0];
		if (file) {
			try {
				const plan = await loadPlanFromFile(file);
				setPlans((prev) => [...prev, plan]);
				setActivePlan(plan);
			} catch (error) {
				alert("Error loading plan file: " + error.message);
			}
		}
	}, []);

	return (
		<div className="planning-container">
			<MapComponent
				mapType={mapType}
				drawingMode={drawingMode}
				activePlan={activePlan}
				onPlanSave={handlePlanSave}
				onDrawingCancel={handleDrawingCancel}
				onMapInit={setMapRef}
			/>

			<PlanningControls
				mapType={mapType}
				onMapTypeChange={setMapType}
				drawingMode={drawingMode}
				onDrawingModeChange={setDrawingMode}
				onFileUpload={handleFileUpload}
				mapRef={mapRef}
			/>

			{showNameDialog && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 2000,
					}}
				>
					<div
						style={{
							background: "white",
							borderRadius: "8px",
							padding: "2rem",
							minWidth: "300px",
							boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
						}}
					>
						<h2
							style={{ marginTop: 0, marginBottom: "1rem", color: "#1a73eb" }}
						>
							Name Your Plan
						</h2>
						<input
							type="text"
							value={planName}
							onChange={(e) => setPlanName(e.target.value)}
							placeholder="Enter plan name..."
							style={{
								width: "100%",
								padding: "0.75rem",
								border: "1px solid #ddd",
								borderRadius: "4px",
								marginBottom: "1.5rem",
								fontSize: "1rem",
								boxSizing: "border-box",
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleConfirmPlanName();
								if (e.key === "Escape") handleCancelNameDialog();
							}}
							autoFocus
						/>
						<div
							style={{
								display: "flex",
								gap: "0.5rem",
								justifyContent: "flex-end",
							}}
						>
							<button
								onClick={handleCancelNameDialog}
								style={{
									padding: "0.5rem 1rem",
									border: "1px solid #ddd",
									borderRadius: "4px",
									background: "#f5f5f5",
									cursor: "pointer",
									fontSize: "0.9rem",
								}}
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmPlanName}
								style={{
									padding: "0.5rem 1rem",
									border: "none",
									borderRadius: "4px",
									background: "#1a73eb",
									color: "white",
									cursor: "pointer",
									fontSize: "0.9rem",
									fontWeight: "500",
								}}
							>
								Save Plan
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				style={{
					position: "absolute",
					top: "20px",
					right: "20px",
					zIndex: 1000,
					background: "white",
					borderRadius: "8px",
					padding: "1rem",
					minWidth: "250px",
					maxHeight: "500px",
					boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
					overflowY: "auto",
				}}
			>
				<PlanList
					plans={plans}
					activePlan={activePlan}
					onPlanLoad={handlePlanLoad}
					onPlanDelete={handlePlanDelete}
				/>
			</div>
		</div>
	);
};

export default PlanningPage;
