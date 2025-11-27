import React, { useState, useRef, useEffect } from "react";
import { MdOutlinePolyline } from "react-icons/md";
import { BiShapePolygon } from "react-icons/bi";
import { PiRectangle } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa6";
import { FaMap, FaGlobeAmericas } from "react-icons/fa";

const PlanningControls = ({
	mapType,
	onMapTypeChange,
	drawingMode,
	onDrawingModeChange,
	mapRef,
}) => {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const dockRef = useRef(null);

	// Debug: Log props changes
	useEffect(() => {
		console.log("📊 PlanningControls Props:", {
			mapType,
			drawingMode,
			hasMapTypeHandler: !!onMapTypeChange,
			hasDrawingHandler: !!onDrawingModeChange,
		});
	}, [mapType, drawingMode, onMapTypeChange, onDrawingModeChange]);

	const handleDrawingModeClick = (mode) => {
		console.log("🎨 Drawing mode clicked:", {
			clickedMode: mode,
			currentMode: drawingMode,
			willToggle: drawingMode === mode,
		});

		try {
			if (drawingMode === mode) {
				console.log("❌ Deactivating drawing mode");
				onDrawingModeChange(null);
			} else {
				console.log("✅ Activating drawing mode:", mode);
				onDrawingModeChange(mode);
			}
			console.log("✅ Handler executed successfully");
		} catch (error) {
			console.error("❌ Error in handleDrawingModeClick:", error);
		}
	};

	const handleMapTypeClick = (type) => {
		console.log("🗺️ Map type clicked:", {
			clickedType: type,
			currentType: mapType,
		});

		try {
			onMapTypeChange(type);
			console.log("✅ Map type changed successfully");
		} catch (error) {
			console.error("❌ Error in handleMapTypeClick:", error);
		}
	};

	const getScale = (index) => {
		if (hoveredIndex === null) return 1;
		const distance = Math.abs(index - hoveredIndex);
		if (distance === 0) return 1.5;
		if (distance === 1) return 1.25;
		if (distance === 2) return 1.1;
		return 1;
	};

	const mapTools = [
		{ id: "normal", icon: FaMap, label: "Normal Map" },
		{ id: "satellite", icon: FaGlobeAmericas, label: "Satellite" },
	];

	const drawingTools = [
		{ id: "polyline", icon: MdOutlinePolyline, label: "Polyline" },
		{ id: "polygon", icon: BiShapePolygon, label: "Polygon" },
		{ id: "rectangle", icon: PiRectangle, label: "Rectangle" },
		{ id: "circle", icon: FaRegCircle, label: "Circle" },
	];

	return (
		<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-1000 gap-3 px-10 py-4">
			<div
				ref={dockRef}
				className="relative bg-linear-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-3xl px-4 py-3 shadow-2xl"
				onMouseLeave={() => setHoveredIndex(null)}
			>
				<div className="flex items-end gap-2">
					{/* Map Type Buttons */}
					{mapTools.map((tool, index) => {
						const Icon = tool.icon;
						const scale = getScale(index);
						const isActive = mapType === tool.id;

						return (
							<div
								key={tool.id}
								className="relative flex flex-col items-center"
								onMouseEnter={() => setHoveredIndex(index)}
							>
								<button
									onClick={() => handleMapTypeClick(tool.id)}
									className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ease-out border-2 ${
										isActive
											? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50"
											: "bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/70 hover:border-gray-500/70"
									}`}
									style={{
										width: `${50 * scale}px`,
										height: `${50 * scale}px`,
										transform: `translateY(${-12 * (scale - 1)}px)`,
									}}
									title={tool.label}
								>
									<Icon
										style={{
											fontSize: `${22 * scale}px`,
										}}
									/>
									{isActive && (
										<div className="absolute -bottom-2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-lg shadow-blue-500/50" />
									)}
								</button>

								{hoveredIndex === index && (
									<div className="absolute -top-12 bg-gray-800/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-xl border border-gray-700/50">
										{tool.label}
									</div>
								)}
							</div>
						);
					})}

					{/* Separator */}
					<div className="w-px h-14 bg-linear-to-b from-transparent via-gray-600 to-transparent mx-2 self-center" />

					{/* Drawing Tools */}
					{drawingTools.map((tool, index) => {
						const actualIndex = index + mapTools.length + 1;
						const Icon = tool.icon;
						const scale = getScale(actualIndex);
						const isActive = drawingMode === tool.id;

						return (
							<div
								key={tool.id}
								className="relative flex flex-col items-center"
								onMouseEnter={() => setHoveredIndex(actualIndex)}
							>
								<button
									onClick={() => handleDrawingModeClick(tool.id)}
									className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ease-out border-2 ${
										isActive
											? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/50"
											: "bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/70 hover:border-gray-500/70"
									}`}
									style={{
										width: `${50 * scale}px`,
										height: `${50 * scale}px`,
										transform: `translateY(${-12 * (scale - 1)}px)`,
									}}
									title={tool.label}
								>
									<Icon
										style={{
											fontSize: `${22 * scale}px`,
										}}
									/>
									{isActive && (
										<div className="absolute -bottom-2 w-1.5 h-1.5 bg-green-300 rounded-full shadow-lg shadow-green-500/50" />
									)}
								</button>

								{hoveredIndex === actualIndex && (
									<div className="absolute -top-12 bg-gray-800/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-xl border border-gray-700/50">
										{tool.label}
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* Keyboard Hint */}
				{drawingMode && (
					<div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-gray-800/95 backdrop-blur-sm text-white text-sm px-4 py-2.5 rounded-xl whitespace-nowrap pointer-events-none shadow-xl border border-gray-700/50">
						<strong className="text-green-400">Keyboard:</strong>{" "}
						<span className="text-gray-300">
							<kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs">
								Enter
							</kbd>{" "}
							Save •{" "}
							<kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs">ESC</kbd>{" "}
							Cancel
						</span>
					</div>
				)}
			</div>

			{/* Debug Info - Remove this in production */}
			{process.env.NODE_ENV === "development" && (
				<div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-green-400 text-xs px-3 py-2 rounded font-mono whitespace-nowrap">
					Map: {mapType} | Draw: {drawingMode || "none"}
				</div>
			)}
		</div>
	);
};

export default PlanningControls;
