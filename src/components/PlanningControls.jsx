import React, { useRef } from "react";

const PlanningControls = ({
	mapType,
	onMapTypeChange,
	drawingMode,
	onDrawingModeChange,
	onFileUpload,
	mapRef,
}) => {
	const handleDrawingModeClick = (mode) => {
		if (drawingMode === mode) {
			onDrawingModeChange(null);
		} else {
			onDrawingModeChange(mode);
		}
	};

	const handleExportAll = () => {
		//Export semua plan ke file JSON
		const plans = JSON.parse(localStorage.getItem("uav_plans") || "[]");
		const dataStr = JSON.stringify(plans, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });

		const link = document.createElement("a");
		link.href = URL.createObjectURL(dataBlob);
		link.download = `uav_plans_${new Date().toISOString().split("T")[0]}.json`;
		link.click();
	};

	return (
		<div className="controls-overlay">
			<div className="control-group">
				<h3>Map Type</h3>
				<div className="map-type-selector">
					<button
						className={`control-btn ${mapType === "normal" ? "active" : ""}`}
						onClick={() => onMapTypeChange("normal")}
					>
						Normal
					</button>
					<button
						className={`control-btn ${mapType === "satellite" ? "active" : ""}`}
						onClick={() => onMapTypeChange("satellite")}
					>
						Satellite
					</button>
				</div>
			</div>
			<div className="control-group">
				<h3>Drawing Tools</h3>
				<div className="control-buttons">
					<button
						className={`control-btn ${
							drawingMode === "polyline" ? "active" : ""
						}`}
						onClick={() => handleDrawingModeClick("polyline")}
					>
						Polyline
					</button>
					<button
						className={`control-btn ${
							drawingMode === "polygon" ? "active" : ""
						}`}
						onClick={() => handleDrawingModeClick("polygon")}
					>
						Polygon
					</button>
					<button
						className={`control-btn ${
							drawingMode === "rectangle" ? "active" : ""
						}`}
						onClick={() => handleDrawingModeClick("rectangle")}
					>
						Rectangle
					</button>
					<button
						className={`control-btn ${
							drawingMode === "circle" ? "active" : ""
						}`}
						onClick={() => handleDrawingModeClick("circle")}
					>
						Circle
					</button>
				</div>
			</div>
			<div className="control-group">
				<h3>File Operations</h3>
				<div
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					<input
						type="file"
						accept=".json"
						onChange={onFileUpload}
						style={{ display: "none" }}
						id="file-upload"
					/>
					<label
						htmlFor="file-upload"
						className="control-btn secondary"
						style={{ textAlign: "center" }}
					>
						Load Plan
					</label>
					<button className="control-btn secondary" onClick={handleExportAll}>
						Export All
					</button>
				</div>
			</div>
			{drawingMode && (
				<div className="keyboard-hint">
					<strong>Keyboard Controls:</strong>
					<br />
					WASD/Arrows: Move point <br />
					Enter: Save plan <br />
					ESC: Cancel
				</div>
			)}
		</div>
	);
};

export default PlanningControls;
