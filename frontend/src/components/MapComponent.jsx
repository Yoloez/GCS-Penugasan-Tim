import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { uavIcon } from "./UAV/UAVIcon";
import MapController from "./UAV/MapController";
import ControlPanel from "./UAV/ControlPanel";
import TelemetryPanel from "./UAV/TelemetryPanel";
import { useTrajectoryManager } from "../hooks/useTrajectoryManager";

const MapComponent = () => {
  const [uavPosition, setUavPosition] = useState([-6.2, 106.816666]);
  const [isRecording, setIsRecording] = useState(false);
  const [trajectory, setTrajectory] = useState([]);
  const [showPrecisionCircle, setShowPrecisionCircle] = useState(true);

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

  return (
    <div style={{ position: "relative" }}>
      <MapContainer center={uavPosition} zoom={18} style={{ height: "100vh", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="🛰️ Google Satellite">
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="&copy; Google" maxZoom={22} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🗺️ Google Hybrid">
            <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="&copy; Google" maxZoom={22} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🌍 ESRI Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; Esri" maxZoom={19} />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🗺️ Street Map">
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' maxZoom={19} />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Precision accuracy circle */}
        {showPrecisionCircle && (
          <Circle
            center={uavPosition}
            radius={2}
            pathOptions={{
              color: "#3498DB",
              fillColor: "#3498DB",
              fillOpacity: 0.1,
              weight: 1,
              dashArray: "5, 5",
            }}
          />
        )}

        {/* Recorded trajectories */}
        {recordedTrajectories.map((traj, idx) => (
          <Polyline key={traj.id || idx} positions={traj.points || traj} color="blue" weight={2} opacity={0.7} />
        ))}

        {/* Current trajectory */}
        {isRecording && trajectory.length > 1 && <Polyline positions={trajectory} color="red" weight={3} opacity={0.8} />}

        {/* UAV Marker with precise positioning */}
        <Marker position={uavPosition} icon={uavIcon}>
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h4 style={{ margin: "0 0 0 0", color: "#2C3E50" }}>🚁 UAV Position</h4>
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

        <MapController uavPosition={uavPosition} setUavPosition={setUavPosition} isRecording={isRecording} trajectory={trajectory} setTrajectory={setTrajectory} />
      </MapContainer>

      {/* Control Panel */}
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
      />

      {/* Telemetry Panel */}
      <TelemetryPanel uavPosition={uavPosition} />
    </div>
  );
};

export default MapComponent;
