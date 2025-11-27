import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { uavIcon } from "./Simulation/UAVIcon";
import MapController from "./Simulation/MapController";
import ControlPanel from "./Simulation/ControlPanel";
import TelemetryPanel from "./Simulation/TelemetryPanel";
import SearchLocation from "./Simulation/SearchLocation";
import { useTrajectoryManager } from "../hooks/useTrajectoryManager";

// Component to handle double click events on map
const MapClickHandler = ({ onDoubleClick }) => {
  useMapEvents({
    dblclick: (e) => {
      onDoubleClick(e.latlng);
    },
  });
  return null;
};

const MapComponent = () => {
  const [uavPosition, setUavPosition] = useState([-7.770786982211191, 110.37785276629407]);
  const [isRecording, setIsRecording] = useState(false);
  const [trajectory, setTrajectory] = useState([]);
  const [showPrecisionCircle, setShowPrecisionCircle] = useState(false);
  const [speed, setSpeed] = useState(0.000007);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [activeTrajectories, setActiveTrajectories] = useState(new Set());

  // Use custom hook for trajectory management
  const { recordedTrajectories, isLoading, isSaving, recordingStartTime, setRecordingStartTime, saveTrajectoryToDB, clearAllTrajectories, deleteSingleTrajectory } = useTrajectoryManager();

  const handleStartRecord = () => {
    setIsRecording(true);
    setTrajectory([uavPosition]);
    setRecordingStartTime(Date.now());
  };

  const handleStopRecord = async () => {
    setIsRecording(false);
    await saveTrajectoryToDB(trajectory);
    setTrajectory([]);
    setRecordingStartTime(null);
  };

  const handleMapDoubleClick = (latlng) => {
    setUavPosition([latlng.lat, latlng.lng]);
  };

  const handleLocationSearch = (coordinates) => {
    setUavPosition(coordinates);
  };

  const handleToggleTrajectory = (trajectoryId) => {
    setActiveTrajectories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(trajectoryId)) {
        newSet.delete(trajectoryId);
      } else {
        newSet.add(trajectoryId);
      }
      return newSet;
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={uavPosition} zoom={18} style={{ height: "100vh", width: "100%" }} scrollWheelZoom={true}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Google Satellite">
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="&copy; Google" maxZoom={22} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Google Hybrid">
            <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="&copy; Google" maxZoom={22} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="ESRI Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" maxZoom={19} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Street Map">
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' maxZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Precision accuracy circle */}
        {/* {showPrecisionCircle && (
          <Circle
            center={uavPosition}
            radius={10}
            pathOptions={{
              color: "#3498DB",
              fillColor: "#3498DB",
              fillOpacity: 0.8,
              weight: 0,
              dashArray: "5, 5",
            }}
          />
        )} */}

        {/* Recorded trajectories */}
        {recordedTrajectories
          .filter((traj) => activeTrajectories.has(traj.id))
          .map((traj, idx) => (
            <Polyline key={traj.id || idx} positions={traj.points || traj} color="yellow" weight={6} opacity={0.7} />
          ))}

        {/* Current trajectory */}
        {isRecording && trajectory.length > 1 && <Polyline positions={trajectory} color="red" weight={5} opacity={0.8} />}

        {/* UAV Marker with precise positioning */}
        <Marker position={uavPosition} icon={uavIcon}>
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h4 style={{ margin: "0 0 0 0", color: "#2C3E50" }}>UAV Position</h4>
              <div
                style={{
                  backgroundColor: "#ECF0F1",
                  padding: "8px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                }}
              >
                <p style={{ margin: "3px 0" }}>
                  <strong>Latitude:</strong> {uavPosition[0].toFixed(8)}°
                </p>
                <p style={{ margin: "3px 0" }}>
                  <strong>Longitude:</strong> {uavPosition[1].toFixed(8)}°
                </p>
              </div>
              <hr style={{ margin: "10px 0" }} />
              <p style={{ fontSize: "11px", margin: "5px 0", color: "#7F8C8D" }}>
                <strong>Accuracy:</strong> ±2m GPS precision
              </p>
              <p style={{ fontSize: "11px", margin: "5px 0", color: "#7F8C8D" }}>Red dot = exact GPS coordinates</p>
            </div>
          </Popup>
        </Marker>

        <MapController uavPosition={uavPosition} setUavPosition={setUavPosition} isRecording={isRecording} trajectory={trajectory} setTrajectory={setTrajectory} speed={speed} />
        <MapClickHandler onDoubleClick={handleMapDoubleClick} />
      </MapContainer>

      {/* Toggle Button for Control Panel */}
      <button
        onClick={() => setShowControlPanel(!showControlPanel)}
        className="absolute top-2.5 right-2.5 z-1001 bg-white/95 hover:bg-white p-2.5 rounded-lg shadow-md transition-all duration-200 border border-gray-200"
        title={showControlPanel ? "Hide Control Panel" : "Show Control Panel"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${showControlPanel ? "" : "rotate-180"}`}
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Control Panel */}
      {showControlPanel && (
        <ControlPanel
          isRecording={isRecording}
          isSaving={isSaving}
          isLoading={isLoading}
          onStartRecord={handleStartRecord}
          onStopRecord={handleStopRecord}
          onClearAll={clearAllTrajectories}
          showPrecisionCircle={showPrecisionCircle}
          onTogglePrecisionCircle={(e) => setShowPrecisionCircle(e.target.checked)}
          trajectory={trajectory}
          recordedTrajectories={recordedTrajectories}
          onDeleteTrajectory={deleteSingleTrajectory}
          onToggleTrajectory={handleToggleTrajectory}
          activeTrajectories={activeTrajectories}
          speed={speed}
          onSpeedChange={setSpeed}
        />
      )}

      {/* Search Location */}
      <SearchLocation onLocationSelect={handleLocationSearch} />

      {/* Telemetry Panel */}
      <TelemetryPanel uavPosition={uavPosition} />
    </div>
  );
};

export default MapComponent;
