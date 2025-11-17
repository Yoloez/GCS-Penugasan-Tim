import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapEditor = ({ onSave }) => {
	const mapRef = useRef(null);
	const featureGroupRef = useRef(null);
	const [mapData, setMapData] = useState(null);
	const [drawingMode, setDrawingMode] = useState(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const coordsRef = useRef([]);
	const tempLayerRef = useRef(null);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;

		const updateTempLayerLocal = () => {
			const featureGroup = featureGroupRef.current;
			if (!featureGroup) return;

			if (tempLayerRef.current) {
				featureGroup.removeLayer(tempLayerRef.current);
			}

			if (coordsRef.current.length < 2) return;

			const latLngs = coordsRef.current.map((c) => [c.lat, c.lng]);

			if (drawingMode === "polyline") {
				const line = L.polyline(latLngs, { color: "#3b82f6", weight: 2 });
				featureGroup.addLayer(line);
				tempLayerRef.current = line;
			} else if (drawingMode === "polygon") {
				const polygon = L.polygon(latLngs, {
					color: "#3b82f6",
					weight: 2,
					fillColor: "#93c5fd",
					fillOpacity: 0.3,
				});
				featureGroup.addLayer(polygon);
				tempLayerRef.current = polygon;
			} else if (drawingMode === "rectangle" && coordsRef.current.length >= 2) {
				const bounds = L.latLngBounds([
					[coordsRef.current[0].lat, coordsRef.current[0].lng],
					[coordsRef.current[1].lat, coordsRef.current[1].lng],
				]);
				const rect = L.rectangle(bounds, {
					color: "#3b82f6",
					weight: 2,
					fillColor: "#93c5fd",
					fillOpacity: 0.3,
				});
				featureGroup.addLayer(rect);
				tempLayerRef.current = rect;
			} else if (drawingMode === "circle" && coordsRef.current.length >= 1) {
				const center = coordsRef.current[0];
				if (coordsRef.current.length >= 2) {
					const radius = L.latLng(center).distanceTo(
						L.latLng(coordsRef.current[1])
					);
					const circle = L.circle([center.lat, center.lng], {
						radius,
						color: "#3b82f6",
						weight: 2,
						fillColor: "#93c5fd",
						fillOpacity: 0.3,
					});
					featureGroup.addLayer(circle);
					tempLayerRef.current = circle;
				}
			}
		};

		const handleMapClick = (e) => {
			if (!isDrawing || !drawingMode) return;

			const { lat, lng } = e.latlng;
			coordsRef.current.push({ lat, lng });

			L.circleMarker([lat, lng], {
				radius: 4,
				fillColor: "#3b82f6",
				color: "#1e40af",
				weight: 2,
				opacity: 1,
				fillOpacity: 0.8,
			}).addTo(featureGroup.current);

			updateTempLayerLocal();
		};

		map.on("click", handleMapClick);
		return () => {
			map.off("click", handleMapClick);
		};
	}, [isDrawing, drawingMode]);

	const startDrawing = (mode) => {
		setDrawingMode(mode);
		setIsDrawing(true);
		coordsRef.current = [];
		if (featureGroupRef.current) {
			featureGroupRef.current.clearLayers();
		}
	};

	const finishDrawing = () => {
		if (coordsRef.current.length === 0) {
			setIsDrawing(false);
			setDrawingMode(null);
			return;
		}

		const newMapData = {
			layerType: drawingMode || "polyline",
			coordinates: [...coordsRef.current],
		};

		setMapData(newMapData);
		setIsDrawing(false);
		setDrawingMode(null);
	};

	const clearDrawing = () => {
		if (featureGroupRef.current) {
			featureGroupRef.current.clearLayers();
		}
		setMapData(null);
		coordsRef.current = [];
		tempLayerRef.current = null;
		setDrawingMode(null);
		setIsDrawing(false);
	};

	const handleSave = () => {
		if (mapData && mapData.coordinates.length > 0) {
			onSave(mapData);
			clearDrawing();
		}
	};

	return (
		<div className="flex flex-col h-full gap-4">
			<div className="flex-1 rounded-lg overflow-hidden border border-gray-300">
				<MapContainer
					center={[-6.2088, 106.8456]}
					zoom={13}
					className="w-full h-full"
					ref={mapRef}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<FeatureGroup ref={featureGroupRef} />
				</MapContainer>
			</div>

			<div className="bg-white p-4 rounded-lg shadow space-y-3">
				<div className="grid grid-cols-2 gap-2">
					<button
						onClick={() => startDrawing("polyline")}
						disabled={isDrawing}
						className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition"
					>
						Draw Polyline
					</button>
					<button
						onClick={() => startDrawing("polygon")}
						disabled={isDrawing}
						className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition"
					>
						Draw Polygon
					</button>
					<button
						onClick={() => startDrawing("rectangle")}
						disabled={isDrawing}
						className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition"
					>
						Draw Rectangle
					</button>
					<button
						onClick={() => startDrawing("circle")}
						disabled={isDrawing}
						className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-3 rounded text-sm font-medium transition"
					>
						Draw Circle
					</button>
				</div>

				{isDrawing && (
					<div className="flex gap-2">
						<button
							onClick={finishDrawing}
							className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition"
						>
							Finish Drawing
						</button>
						<button
							onClick={clearDrawing}
							className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-medium transition"
						>
							Cancel
						</button>
					</div>
				)}

				{mapData && (
					<div className="bg-blue-50 p-3 rounded">
						<div className="text-sm text-gray-700">
							<p className="font-semibold">
								Current Shape: {mapData.layerType}
							</p>
							<p>Points: {mapData.coordinates.length}</p>
						</div>
						<div className="flex gap-2 mt-3">
							<button
								onClick={handleSave}
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition"
							>
								Save Drawing
							</button>
							<button
								onClick={clearDrawing}
								className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-medium transition"
							>
								Clear
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MapEditor;
