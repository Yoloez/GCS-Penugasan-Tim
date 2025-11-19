import React from "react";

const PlanList = ({ plans, activePlan, onPlanLoad, onPlanDelete }) => {
	const handlePlanClick = (plan) => {
		onPlanLoad(plan.id);
	};

	const handleDeleteClick = (plan, e) => {
		e.stopPropagation();
		if (window.confirm(`Delete plan "${plan.name}"?`)) {
			onPlanDelete(plan.id);
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
		<div className="plan-list-container">
			<h3>Saved Plans ({plans.length})</h3>

			{plans.length === 0 ? (
				<p style={{ color: "#666", fontStyle: "italic" }}>No plans saved yet</p>
			) : (
				<div className="plan-list">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={`plan-item ${
								activePlan?.id === plan.id ? "active" : ""
							}`}
							onClick={() => handlePlanClick(plan)}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "start",
								}}
							>
								<div style={{ flex: 1 }}>
									<strong>{plan.name}</strong>
									<div style={{ fontSize: "0.8rem", color: "#666" }}>
										{new Date(plan.createdAt).toLocaleString()}
									</div>
									<div style={{ fontSize: "0.8rem", color: "#888" }}>
										Type: {plan.data?.type}
									</div>
								</div>
								<div
									style={{
										display: "flex",
										gap: "0.25rem",
										marginLeft: "0.5rem",
									}}
								>
									<button
										onClick={(e) => handleExportClick(plan, e)}
										style={{
											background: "none",
											border: "none",
											color: "#1a73e8",
											cursor: "pointer",
											fontSize: "0.8rem",
										}}
										title="Export"
									>
										⬇️
									</button>
									<button
										onClick={(e) => handleDeleteClick(plan, e)}
										style={{
											background: "none",
											border: "none",
											color: "#d93025",
											cursor: "pointer",
											fontSize: "0.8rem",
										}}
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
	);
};

export default PlanList;
