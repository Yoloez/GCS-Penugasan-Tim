import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, LayersControl, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Precise UAV icon dengan detail yang lebih akurat
const createPreciseUAVIcon = () => {
  const svgIcon = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="24" cy="42" rx="8" ry="2" fill="black" opacity="0.2"/>
      
      <!-- Main body -->
      <circle cx="24" cy="24" r="6" fill="#2C3E50" stroke="#34495E" stroke-width="0.5"/>
      
      <!-- Center point (exact GPS location) -->
      <circle cx="24" cy="24" r="1.5" fill="#E74C3C" stroke="#C0392B" stroke-width="0.5"/>
      
      <!-- Arms (4 rotors) -->
      <!-- Front arm -->
      <line x1="24" y1="24" x2="24" y2="8" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Back arm -->
      <line x1="24" y1="24" x2="24" y2="40" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Left arm -->
      <line x1="24" y1="24" x2="8" y2="24" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      <!-- Right arm -->
      <line x1="24" y1="24" x2="40" y2="24" stroke="#34495E" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Rotors -->
      <!-- Front rotor -->
      <circle cx="24" cy="8" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="24" cy="8" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Back rotor -->
      <circle cx="24" cy="40" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="24" cy="40" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Left rotor -->
      <circle cx="8" cy="24" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="8" cy="24" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Right rotor -->
      <circle cx="40" cy="24" r="5" fill="none" stroke="#3498DB" stroke-width="1.5" opacity="0.7"/>
      <circle cx="40" cy="24" r="3" fill="#3498DB" opacity="0.3"/>
      
      <!-- Rotor centers -->
      <circle cx="24" cy="8" r="1" fill="#2C3E50"/>
      <circle cx="24" cy="40" r="1" fill="#2C3E50"/>
      <circle cx="8" cy="24" r="1" fill="#2C3E50"/>
      <circle cx="40" cy="24" r="1" fill="#2C3E50"/>
      
      <!-- Direction indicator (front) -->
      <path d="M 24 8 L 22 4 L 26 4 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="0.5"/>
      
      <!-- Precision crosshair -->
      <line x1="24" y1="20" x2="24" y2="28" stroke="#E74C3C" stroke-width="0.5" opacity="0.5"/>
      <line x1="20" y1="24" x2="28" y2="24" stroke="#E74C3C" stroke-width="0.5" opacity="0.5"/>
    </svg>
  `;

  const iconUrl = "data:image/svg+xml;base64," + btoa(svgIcon);

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [48, 48],
    iconAnchor: [24, 24], // Center point - exact GPS position
    popupAnchor: [0, -24],
    className: "precise-uav-icon",
  });
};

const uavIcon = createPreciseUAVIcon();

// Komponen untuk map controller
const MapController = ({ uavPosition, setUavPosition, isRecording, trajectory, setTrajectory }) => {
  const map = useMap();
  const speed = 0.00001;
  const [keysPressed, setKeysPressed] = useState({});

  useEffect(() => {
    map.setView(uavPosition, 18);
  }, [uavPosition, map]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const validKeys = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"];

      if (validKeys.includes(key)) {
        e.preventDefault();
        setKeysPressed((prev) => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setKeysPressed((prev) => ({ ...prev, [key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let deltaLat = 0;
      let deltaLng = 0;

      if (keysPressed["arrowup"] || keysPressed["w"]) deltaLat += speed;
      if (keysPressed["arrowdown"] || keysPressed["s"]) deltaLat -= speed;
      if (keysPressed["arrowleft"] || keysPressed["a"]) deltaLng -= speed;
      if (keysPressed["arrowright"] || keysPressed["d"]) deltaLng += speed;

      if (deltaLat !== 0 || deltaLng !== 0) {
        const [lat, lng] = uavPosition;
        const newPosition = [lat + deltaLat, lng + deltaLng];

        setUavPosition(newPosition);

        if (isRecording) {
          setTrajectory((prev) => [...prev, newPosition]);
        }
      }
    }, 5);

    return () => clearInterval(interval);
  }, [keysPressed, uavPosition, setUavPosition, isRecording, setTrajectory]);

  return null;
};

const MapComponent = () => {
  const [uavPosition, setUavPosition] = useState([-6.2, 106.816666]);
  const [isRecording, setIsRecording] = useState(false);
  const [trajectory, setTrajectory] = useState([]);
  const [recordedTrajectories, setRecordedTrajectories] = useState([]);
  const [showPrecisionCircle, setShowPrecisionCircle] = useState(true);

  const handleStartRecord = () => {
    setIsRecording(true);
    setTrajectory([uavPosition]);
  };

  const handleStopRecord = () => {
    setIsRecording(false);
    if (trajectory.length > 1) {
      setRecordedTrajectories([...recordedTrajectories, trajectory]);
    }
    setTrajectory([]);
  };

  const handleClearTrajectory = () => {
    setRecordedTrajectories([]);
    setTrajectory([]);
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
          <Polyline key={idx} positions={traj} color="blue" weight={2} opacity={0.7} />
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

      {/* Menu Panel */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "15px",
          borderRadius: "8px",
          zIndex: 1000,
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          color: "black",
          minWidth: "220px",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Control Panel</h3>

        <div style={{ marginBottom: "10px" }}>
          {isRecording ? (
            <button
              onClick={handleStopRecord}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#E74C3C",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              ⏹ Stop Recording
            </button>
          ) : (
            <button
              onClick={handleStartRecord}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#27AE60",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Start Recording
            </button>
          )}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={handleClearTrajectory}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#E67E22",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            🗑️ Clear All Tracks
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "13px",
              gap: "8px",
            }}
          >
            <input type="checkbox" checked={showPrecisionCircle} onChange={(e) => setShowPrecisionCircle(e.target.checked)} style={{ cursor: "pointer" }} />
            Show Precision Circle
          </label>
        </div>

        <hr style={{ margin: "15px 0" }} />

        <div
          style={{
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
            border: "1px solid rgba(52, 152, 219, 0.3)",
          }}
        >
          <p style={{ margin: "5px 0", fontSize: "12px" }}>
            <strong>Status:</strong> {isRecording ? "🔴 Recording" : "⚪ Idle"}
          </p>
          <p style={{ margin: "5px 0", fontSize: "12px" }}>
            <strong>Saved Tracks:</strong> {recordedTrajectories.length}
          </p>
          {isRecording && (
            <p style={{ margin: "5px 0", fontSize: "12px" }}>
              <strong>Current Points:</strong> {trajectory.length}
            </p>
          )}
          <p style={{ margin: "5px 0", fontSize: "12px" }}>
            <strong>GPS Accuracy:</strong> ±2m
          </p>
        </div>
      </div>

      {/* Info Panel */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "15px",
          borderRadius: "8px",
          zIndex: 1000,
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          color: "black",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#2C3E50" }}>🚁 UAV Telemetry</h3>
        <div
          style={{
            backgroundColor: "#ECF0F1",
            padding: "10px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "13px",
            marginBottom: "10px",
          }}
        >
          <p style={{ margin: "3px 0" }}>
            <strong>Lat:</strong> {uavPosition[0].toFixed(8)}°
          </p>
          <p style={{ margin: "3px 0" }}>
            <strong>Lng:</strong> {uavPosition[1].toFixed(8)}°
          </p>
        </div>
        <hr style={{ margin: "10px 0" }} />
        <div style={{ fontSize: "12px" }}>
          <p style={{ margin: "5px 0" }}>
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              ↑
            </kbd>{" "}
            /{" "}
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              W
            </kbd>{" "}
            - Move North
          </p>
          <p style={{ margin: "5px 0" }}>
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              ↓
            </kbd>{" "}
            /{" "}
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              S
            </kbd>{" "}
            - Move South
          </p>
          <p style={{ margin: "5px 0" }}>
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              ←
            </kbd>{" "}
            /{" "}
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              A
            </kbd>{" "}
            - Move West
          </p>
          <p style={{ margin: "5px 0" }}>
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              →
            </kbd>{" "}
            /{" "}
            <kbd
              style={{
                padding: "2px 6px",
                backgroundColor: "#34495E",
                color: "white",
                borderRadius: "3px",
                fontSize: "11px",
              }}
            >
              D
            </kbd>{" "}
            - Move East
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
