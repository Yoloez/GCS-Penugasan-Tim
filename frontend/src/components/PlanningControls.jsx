import React, { useRef } from "react";
import { MdOutlinePolyline } from "react-icons/md";
import { BiShapePolygon } from "react-icons/bi";
import { PiRectangle } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa6";

const PlanningControls = ({
	mapType,
	onMapTypeChange,
	drawingMode,
	onDrawingModeChange,
	mapRef,
}) => {
	const handleDrawingModeClick = (mode) => {
		if (drawingMode === mode) {
			onDrawingModeChange(null);
		} else {
			onDrawingModeChange(mode);
		}
	};

	return (
		<div>
			<div className="absolute bg-linear-to-r from-purple-500 to-pink-500 min-w-3xs top-100 right-5 z-1000 rounded-lg px-4">
				<div className="m-5 text-white text-3xl ">
					<h3>Map Type</h3>
					<div className="bottom-4 ">
						<button
							className={`control-btn ${mapType === "normal" ? "active" : ""}`}
							onClick={() => onMapTypeChange("normal")}
						>
							Normal
						</button>
						<button
							className={`control-btn ${
								mapType === "satellite" ? "active" : ""
							}`}
							onClick={() => onMapTypeChange("satellite")}
						>
							Satellite
						</button>
					</div>
				</div>
				<div className="text-white text-3xl">
					<h3>Drawing Tools</h3>
					<div className="p-52">
						<button
							className={`control-btn ${
								drawingMode === "polyline" ? "active" : ""
							}`}
							onClick={() => handleDrawingModeClick("polyline")}
						>
							<MdOutlinePolyline />
						</button>
						<button
							className={`control-btn ${
								drawingMode === "polygon" ? "active" : ""
							}`}
							onClick={() => handleDrawingModeClick("polygon")}
						>
							<BiShapePolygon />
						</button>
						<button
							className={`control-btn ${
								drawingMode === "rectangle" ? "active" : ""
							}`}
							onClick={() => handleDrawingModeClick("rectangle")}
						>
							<PiRectangle />
						</button>
						<button
							className={`control-btn ${
								drawingMode === "circle" ? "active" : ""
							}`}
							onClick={() => handleDrawingModeClick("circle")}
						>
							<FaRegCircle />
						</button>
					</div>
				</div>

				{drawingMode && (
					<div className="keyboard-hint">
						<strong>Keyboard Controls:</strong>
						<br />
						Enter: Save plan <br />
						ESC: Cancel
					</div>
				)}
			</div>
		</div>
	);
};

export default PlanningControls;
