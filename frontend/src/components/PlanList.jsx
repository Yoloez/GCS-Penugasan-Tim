import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const PlanList = ({
	plans,
	activePlan,
	onPlanLoad,
	onPlanDelete,
	onPlanUpdate,
	onPlanEditGeometry,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [editingPlan, setEditingPlan] = useState(null);
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);

	const handlePlanClick = (plan) => {
		onPlanLoad(plan.id);
	};

	const handleDeleteClick = (plan, e) => {
		e.stopPropagation();
		if (window.confirm(`Delete plan "${plan.name}"?`)) {
			onPlanDelete(plan.id);
		}
	};

	const handleEditClick = (plan, e) => {
		e.stopPropagation();
		setEditingPlan(plan);
		setEditName(plan.name);
		setEditDescription(plan.description || "");
	};

	const handleEditGeometryClick = (plan, e) => {
		e.stopPropagation();
		if (
			window.confirm(
				`Enable editing mode for "${plan.name}"? You can modify the geometry on the map.`
			)
		) {
			onPlanEditGeometry(plan);
		}
	};

	const handleCancelEdit = () => {
		setEditingPlan(null);
		setEditName("");
		setEditDescription("");
	};

	const handleConfirmEdit = async () => {
		if (!editName.trim()) {
			alert("Plan name cannot be empty!");
			return;
		}

		try {
			setIsUpdating(true);

			const updatedData = {
				name: editName.trim(),
				description: editDescription.trim(),
				waypoints: editingPlan.data.points,
			};

			await onPlanUpdate(editingPlan.id, updatedData);
			handleCancelEdit();
			alert("✅ Plan updated successfully!");
		} catch (error) {
			console.error("Failed to update plan:", error);
			alert("❌ Failed to update plan. Please try again.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleExportClick = (plan, e) => {
		e.stopPropagation();
		const dataStr = JSON.stringify(plan, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(dataBlob);
		link.download = `${plan.name.replace(/\s+/g, "_")}.json`;
		link.click();
	};

	return (
		<>
			{/* Hamburger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed top-6 right-6 z-1001 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl text-white hover:bg-white/20 transition-all duration-300"
				title="Toggle Plans Menu"
			>
				{isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
				{plans.length > 0 && (
					<span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
						{plans.length}
					</span>
				)}
			</button>

			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-1000 transition-opacity duration-300"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar Menu */}
			<div
				className={`fixed top-0 right-0 h-full w-96 bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl z-1001 transform transition-transform duration-300 ease-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="h-full flex flex-col">
					{/* Header */}
					<div className="p-6 border-b border-white/20">
						<h3 className="text-2xl font-bold text-white m-0">
							Saved Plans
							<span className="ml-2 text-lg text-white/60">
								({plans.length})
							</span>
						</h3>
					</div>

					{/* Plans List */}
					<div className="flex-1 overflow-y-auto p-4">
						{plans.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center">
								<div className="text-6xl mb-4">📍</div>
								<p className="text-white/60 text-sm">
									No plans saved yet
									<br />
									<span className="text-xs">
										Start drawing to create your first plan
									</span>
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{plans.map((plan) => (
									<div
										key={plan.id}
										className={`bg-white/10 backdrop-blur-lg hover:bg-white/20 cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
											activePlan?.id === plan.id
												? "border-blue-400 border-2 shadow-lg shadow-blue-500/20"
												: "border-white/20 hover:border-white/30"
										}`}
										onClick={() => handlePlanClick(plan)}
									>
										<div className="flex justify-between items-start">
											<div className="flex-1 min-w-0">
												<strong className="text-white text-base block truncate">
													{plan.name}
												</strong>
												<div className="text-xs text-white/60 mt-2 space-y-1">
													<div>
														📅 {new Date(plan.createdAt).toLocaleDateString()}
													</div>
													<div>🔷 Type: {plan.data?.type}</div>
													<div>📍 Points: {plan.data?.points?.length || 0}</div>
												</div>
											</div>
											<div className="flex flex-col gap-2 ml-3">
												<button
													onClick={(e) => handleEditClick(plan, e)}
													className="bg-white/10 hover:bg-blue-500/80 border-none text-white cursor-pointer text-sm rounded-lg p-2 transition-all hover:scale-110"
													title="Edit Name & Description"
												>
													✏️
												</button>
												<button
													onClick={(e) => handleEditGeometryClick(plan, e)}
													className="bg-white/10 hover:bg-purple-500/80 border-none text-white cursor-pointer text-sm rounded-lg p-2 transition-all hover:scale-110"
													title="Edit Geometry"
												>
													🗺️
												</button>
												<button
													onClick={(e) => handleExportClick(plan, e)}
													className="bg-white/10 hover:bg-green-500/80 border-none text-white cursor-pointer text-sm rounded-lg p-2 transition-all hover:scale-110"
													title="Export"
												>
													⬇️
												</button>
												<button
													onClick={(e) => handleDeleteClick(plan, e)}
													className="bg-white/10 hover:bg-red-500/80 border-none text-white cursor-pointer text-sm rounded-lg p-2 transition-all hover:scale-110"
													title="Delete"
												>
													🗑️
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Edit Dialog */}
			{editingPlan && (
				<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-2000">
					<div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 min-w-[400px] shadow-2xl border border-white/20">
						<h2 className="mt-0 mb-4 text-blue-600 text-xl font-semibold">
							Edit Plan
						</h2>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Plan Name
							</label>
							<input
								type="text"
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								placeholder="Enter plan name..."
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								disabled={isUpdating}
							/>
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description (Optional)
							</label>
							<textarea
								value={editDescription}
								onChange={(e) => setEditDescription(e.target.value)}
								placeholder="Enter description..."
								rows="3"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
								disabled={isUpdating}
							/>
						</div>

						<div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-gray-700">
							<strong>Note:</strong> To edit waypoints/geometry, close this
							dialog and use the 🗺️ button.
						</div>

						<div className="flex gap-2 justify-end">
							<button
								onClick={handleCancelEdit}
								className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer text-sm hover:bg-gray-200 transition-colors"
								disabled={isUpdating}
							>
								Cancel
							</button>
							<button
								onClick={handleConfirmEdit}
								className="px-4 py-2 border-none rounded-lg bg-blue-600 text-white cursor-pointer text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isUpdating}
							>
								{isUpdating && (
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
								)}
								{isUpdating ? "Updating..." : "Update Plan"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PlanList;
