import React, { useState, useCallback, useEffect } from "react";
import MapComponent from "../../components/MapPlanning";
import PlanningControls from "../../components/PlanningControls";
import PlanList from "../../components/PlanList";
import { savePlanToFile } from "../../utils/fileHandler";
import {
	createPlan,
	getPlans,
	deletePlan as apiDeletePlan,
	updatePlan,
} from "../../services/api";

const PlanningPageEnhanced = () => {
	const [mapType, setMapType] = useState("normal");
	const [drawingMode, setDrawingMode] = useState(null);
	const [plans, setPlans] = useState([]);
	const [activePlan, setActivePlan] = useState(null);
	const [mapRef, setMapRef] = useState(null);
	const [showNameDialog, setShowNameDialog] = useState(false);
	const [pendingPlanData, setPendingPlanData] = useState(null);
	const [planName, setPlanName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [editingPlanId, setEditingPlanId] = useState(null);

	// Load plans from database on mount
	useEffect(() => {
		loadPlansFromDatabase();
	}, []);

	const loadPlansFromDatabase = async () => {
		try {
			setIsLoading(true);
			const dbPlans = await getPlans();

			// Transform database plans to match local format
			const transformedPlans = dbPlans.map((plan) => {
				// Extract type from description (format: "Type: polyline" or "Type: polygon", etc.)
				let extractedType = "polyline"; // Default fallback
				if (plan.description && plan.description.startsWith("Type: ")) {
					extractedType = plan.description.replace("Type: ", "").trim();
				}

				// Reconstruct shape for rectangle and circle
				let shape = null;
				if (extractedType === "rectangle" && plan.waypoints.length === 4) {
					// Rectangle: reconstruct bounds from 4 corners
					const lats = plan.waypoints.map((p) => p[0]);
					const lngs = plan.waypoints.map((p) => p[1]);
					shape = [
						[Math.max(...lats), Math.min(...lngs)], // Top-left
						[Math.min(...lats), Math.max(...lngs)], // Bottom-right
					];
				} else if (extractedType === "circle" && plan.waypoints.length > 1) {
					// Circle: first point is center, calculate radius from perimeter points
					const center = plan.waypoints[0];
					const firstPerimeterPoint = plan.waypoints[1];
					const radius =
						Math.sqrt(
							Math.pow(firstPerimeterPoint[0] - center[0], 2) +
								Math.pow(firstPerimeterPoint[1] - center[1], 2)
						) * 111000; // Convert to meters
					shape = { center, radius };
				}

				return {
					id: plan.id.toString(),
					name: plan.name,
					description: plan.description,
					data: {
						type: extractedType,
						points: plan.waypoints,
						shape: shape,
						createdAt: plan.created_at,
					},
					createdAt: plan.created_at,
				};
			});

			setPlans(transformedPlans);
			setError(null);
		} catch (err) {
			console.error("Failed to load plans from database:", err);
			setError(
				"Failed to load plans from database. Please check if backend is running."
			);
			setPlans([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePlanSave = useCallback((planData) => {
		setPendingPlanData(planData);
		setShowNameDialog(true);
	}, []);

	const handleConfirmPlanName = useCallback(async () => {
		if (!pendingPlanData) return;

		try {
			setIsLoading(true);

			// Check if we're editing an existing plan
			if (editingPlanId) {
				// UPDATE MODE: Replace old waypoints with new ones
				const existingPlan = plans.find((p) => p.id === editingPlanId);

				if (!existingPlan) {
					throw new Error("Plan not found");
				}

				const updatedData = {
					name: existingPlan.name,
					description:
						existingPlan.description || `Type: ${pendingPlanData.type}`,
					waypoints: pendingPlanData.points,
				};

				// Update to database
				await updatePlan(editingPlanId, updatedData);

				// Update local state
				setPlans((prev) =>
					prev.map((p) =>
						p.id === editingPlanId
							? {
									...p,
									data: {
										type: pendingPlanData.type,
										points: pendingPlanData.points,
										shape: pendingPlanData.shape,
										createdAt: p.data.createdAt,
									},
							  }
							: p
					)
				);

				// Update active plan
				if (activePlan?.id === editingPlanId) {
					setActivePlan((prev) => ({
						...prev,
						data: {
							type: pendingPlanData.type,
							points: pendingPlanData.points,
							shape: pendingPlanData.shape,
							createdAt: prev.data.createdAt,
						},
					}));
				}

				alert("✅ Plan geometry updated successfully!");
				setEditingPlanId(null);
			} else {
				// CREATE MODE: Save new plan
				const planNameTrimmed =
					planName.trim() || `Plan_${new Date().toLocaleString()}`;

				const response = await createPlan({
					name: planNameTrimmed,
					description: `Type: ${pendingPlanData.type}`,
					waypoints: pendingPlanData.points,
				});

				// Create plan object with database ID
				const newPlan = {
					id: response.id.toString(),
					name: planNameTrimmed,
					description: `Type: ${pendingPlanData.type}`,
					data: pendingPlanData,
					createdAt: new Date().toISOString(),
				};

				setPlans((prev) => [...prev, newPlan]);

				// Also save to localStorage as backup
				savePlanToFile(newPlan);

				alert("✅ Plan saved to database successfully!");
			}

			setDrawingMode(null);
			setShowNameDialog(false);
			setPlanName("");
			setPendingPlanData(null);
			setError(null);
		} catch (err) {
			console.error("Failed to save/update plan:", err);
			setError(
				editingPlanId
					? "Failed to update plan"
					: "Failed to save plan to database"
			);
			alert(
				editingPlanId
					? "❌ Failed to update plan geometry. Please try again."
					: "❌ Failed to save plan to database. Please check if backend is running."
			);
		} finally {
			setIsLoading(false);
		}
	}, [pendingPlanData, planName, editingPlanId, plans, activePlan]);

	const handleCancelNameDialog = useCallback(() => {
		setShowNameDialog(false);
		setPlanName("");
		setPendingPlanData(null);
		setEditingPlanId(null);
		setDrawingMode(null);
	}, []);

	const handleDrawingCancel = useCallback(() => {
		setDrawingMode(null);
		setEditingPlanId(null);
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
		async (planId) => {
			try {
				setIsLoading(true);

				// Delete from database
				await apiDeletePlan(planId);

				// Remove from state
				setPlans((prev) => prev.filter((p) => p.id !== planId));
				if (activePlan?.id === planId) {
					setActivePlan(null);
				}

				// Also remove from localStorage
				localStorage.removeItem(`plan_${planId}`);
				setError(null);
				alert("✅ Plan deleted successfully!");
			} catch (err) {
				console.error("Failed to delete plan from database:", err);
				setError("Failed to delete plan from database");
				alert(
					"❌ Failed to delete plan from database. Please check if backend is running."
				);
			} finally {
				setIsLoading(false);
			}
		},
		[activePlan]
	);

	const handlePlanUpdate = useCallback(
		async (planId, updatedData) => {
			try {
				setIsLoading(true);

				// Update to database
				await updatePlan(planId, updatedData);

				// Update local state
				setPlans((prev) =>
					prev.map((p) =>
						p.id === planId
							? {
									...p,
									name: updatedData.name,
									description: updatedData.description,
							  }
							: p
					)
				);

				// Update active plan if it's the one being edited
				if (activePlan?.id === planId) {
					setActivePlan((prev) => ({
						...prev,
						name: updatedData.name,
						description: updatedData.description,
					}));
				}

				setError(null);
			} catch (err) {
				console.error("Failed to update plan:", err);
				setError("Failed to update plan");
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[activePlan]
	);

	const handlePlanEditGeometry = useCallback((plan) => {
		setEditingPlanId(plan.id);
		setActivePlan(null);
		setDrawingMode(plan.data.type);

		alert(
			`✏️ Edit mode activated for "${plan.name}".\n\nDraw the new geometry on the map. The old waypoints will be replaced.`
		);
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
				mapRef={mapRef}
			/>

			{/* Loading Indicator */}
			{isLoading && (
				<div className="fixed top-5 left-1/2 -translate-x-1/2 z-2001 bg-blue-600/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
					<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					<span>Processing...</span>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="fixed top-5 left-1/2 -translate-x-1/2 z-2001 bg-red-600/95 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
					<span>⚠️ {error}</span>
					<button
						onClick={() => setError(null)}
						className="ml-4 bg-transparent border border-white text-white px-3 py-1 rounded cursor-pointer text-sm hover:bg-white/10 transition-colors"
					>
						Dismiss
					</button>
				</div>
			)}

			{/* Editing Mode Indicator */}
			{editingPlanId && (
				<div className="fixed top-20 left-1/2 -translate-x-1/2 z-2001 bg-purple-600/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
					<span>
						🗺️ Editing Geometry:{" "}
						<strong>{plans.find((p) => p.id === editingPlanId)?.name}</strong>
					</span>
					<button
						onClick={() => {
							if (window.confirm("Cancel editing? Changes will be lost.")) {
								setEditingPlanId(null);
								setDrawingMode(null);
								setPendingPlanData(null);
							}
						}}
						className="ml-2 bg-white/20 border border-white text-white px-3 py-1 rounded cursor-pointer text-sm hover:bg-white/30 transition-colors"
					>
						Cancel
					</button>
				</div>
			)}

			{showNameDialog && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-2000">
					<div className="bg-white/75 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in">
						<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
							{editingPlanId ? "Confirm Geometry Update" : "Name Your Plan"}
						</h2>

						{editingPlanId ? (
							<div className="mb-6">
								<p className="text-gray-700 mb-3 text-center">
									Update geometry for{" "}
									<strong className="text-blue-600">
										{plans.find((p) => p.id === editingPlanId)?.name}
									</strong>
									?
								</p>
								<div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-4 text-sm text-gray-700">
									<div className="flex items-start gap-2">
										<span className="text-lg">⚠️</span>
										<div>
											<strong className="block mb-1">Warning:</strong>
											<span>
												This will replace the old waypoints with the new
												geometry you just drew.
											</span>
										</div>
									</div>
								</div>
							</div>
						) : (
							<input
								type="text"
								value={planName}
								onChange={(e) => setPlanName(e.target.value)}
								placeholder="Enter plan name..."
								className="w-full px-4 py-3 rounded-lg mb-6 text-base bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all"
								onKeyDown={(e) => {
									if (e.key === "Enter") handleConfirmPlanName();
									if (e.key === "Escape") handleCancelNameDialog();
								}}
								autoFocus
							/>
						)}

						<div className="flex gap-3 justify-end">
							<button
								onClick={handleCancelNameDialog}
								className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-red-500/80 text-gray-700 cursor-pointer text-sm font-semibold transition-all shadow-md hover:shadow-lg"
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmPlanName}
								className="px-6 py-2.5 rounded-lg bg-white/10 text-gray-700 cursor-pointer text-sm font-semibold hover:bg-green-500/80 transition-all shadow-md hover:shadow-lg"
							>
								{editingPlanId ? "Update Geometry" : "Save Plan"}
							</button>
						</div>
					</div>
				</div>
			)}

			<PlanList
				plans={plans}
				activePlan={activePlan}
				onPlanLoad={handlePlanLoad}
				onPlanDelete={handlePlanDelete}
				onPlanUpdate={handlePlanUpdate}
				onPlanEditGeometry={handlePlanEditGeometry}
			/>
		</div>
	);
};

export default PlanningPageEnhanced;
