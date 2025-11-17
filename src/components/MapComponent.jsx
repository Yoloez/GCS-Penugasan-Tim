import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom UAV icon
const uavIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSIjRUMwQzBDIi8+PHJlY3QgeD0iNiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjciLz48cmVjdCB4PSIxNCIgeT0iNiIgd2lkdGg9IjQiIGhlaWdodD0iMjAiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuNyIvPjwvc3ZnPg==",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Komponen untuk map controller
const MapController = ({ uavPosition, setUavPosition, isRecording, trajectory, setTrajectory }) => {
  const map = useMap();
  const speed = 0.001; // Kecepatan pergerakan dalam derajat

  useEffect(() => {
    // Center map ke UAV
    map.setView(uavPosition, 18);
  }, [uavPosition, map]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const [lat, lng] = uavPosition;
      let newPosition = null;

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          newPosition = [lat + speed, lng];
          e.preventDefault();
          break;
        case "arrowdown":
        case "s":
          newPosition = [lat - speed, lng];
          e.preventDefault();
          break;
        case "arrowleft":
        case "a":
          newPosition = [lat, lng - speed];
          e.preventDefault();
          break;
        case "arrowright":
        case "d":
          newPosition = [lat, lng + speed];
          e.preventDefault();
          break;
        default:
          break;
      }

      if (newPosition) {
        setUavPosition(newPosition);
        // Tambah ke trajectory jika recording
        if (isRecording) {
          setTrajectory([...trajectory, newPosition]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [uavPosition, setUavPosition, isRecording, trajectory, setTrajectory]);

  return null;
};

const MapComponent = () => {
  const [uavPosition, setUavPosition] = useState([-6.2, 106.816666]);
  const [isRecording, setIsRecording] = useState(false);
  const [trajectory, setTrajectory] = useState([]);
  const [recordedTrajectories, setRecordedTrajectories] = useState([]);

  const handleStartRecord = () => {
    setIsRecording(true);
    setTrajectory([uavPosition]); // Start dari posisi UAV saat ini
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
      <MapContainer center={uavPosition} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

        {/* Render recorded trajectories */}
        {recordedTrajectories.map((traj, idx) => (
          <Polyline key={idx} positions={traj} color="blue" weight={2} opacity={0.7} />
        ))}

        {/* Render current trajectory saat recording */}
        {isRecording && trajectory.length > 1 && <Polyline positions={trajectory} color="red" weight={3} opacity={0.8} />}

        {/* UAV Marker */}
        <Marker position={uavPosition} icon={uavIcon}>
          <Popup>
            <div>
              <h4>UAV Position</h4>
              <p>Lat: {uavPosition[0].toFixed(6)}</p>
              <p>Lng: {uavPosition[1].toFixed(6)}</p>
              <hr />
              <p style={{ fontSize: "12px" }}>Gunakan arrow keys atau WASD untuk bergerak</p>
            </div>
          </Popup>
        </Marker>

        {/* Map Controller untuk keyboard input */}
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
        <h3 style={{ margin: "0 0 15px 0" }}>📋 Menu</h3>

        <div style={{ marginBottom: "10px" }}>
          {isRecording ? (
            <button
              onClick={handleStopRecord}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              ⏹ Stop Record
            </button>
          ) : (
            <button
              onClick={handleStartRecord}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              ⏺ Start Record
            </button>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={handleClearTrajectory}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            🗑 Clear All
          </button>
        </div>

        <hr style={{ margin: "15px 0" }} />

        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          <p style={{ margin: "5px 0", fontSize: "12px" }}>
            <strong>Status:</strong> {isRecording ? "🔴 Recording..." : "⚪ Idle"}
          </p>
          <p style={{ margin: "5px 0", fontSize: "12px" }}>
            <strong>Tracks:</strong> {recordedTrajectories.length}
          </p>
          {isRecording && (
            <p style={{ margin: "5px 0", fontSize: "12px" }}>
              <strong>Points:</strong> {trajectory.length}
            </p>
          )}
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
        <h3 style={{ margin: "0 0 10px 0" }}>🚁 UAV Simulator</h3>
        <p style={{ margin: "5px 0" }}>
          <strong>Lat:</strong> {uavPosition[0].toFixed(6)}
        </p>
        <p style={{ margin: "5px 0" }}>
          <strong>Lng:</strong> {uavPosition[1].toFixed(6)}
        </p>
        <hr style={{ margin: "10px 0" }} />
        <p style={{ margin: "5px 0", fontSize: "12px" }}>
          <kbd>↑</kbd> / <kbd>W</kbd> - Maju
        </p>
        <p style={{ margin: "5px 0", fontSize: "12px" }}>
          <kbd>↓</kbd> / <kbd>S</kbd> - Mundur
        </p>
        <p style={{ margin: "5px 0", fontSize: "12px" }}>
          <kbd>←</kbd> / <kbd>A</kbd> - Kiri
        </p>
        <p style={{ margin: "5px 0", fontSize: "12px" }}>
          <kbd>→</kbd> / <kbd>D</kbd> - Kanan
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
