import React from "react";

/**
 * Telemetry panel component displaying UAV position and keyboard controls
 * @param {Object} props
 * @param {Array} props.uavPosition - Current UAV position [lat, lng]
 */
const TelemetryPanel = ({ uavPosition }) => {
  return (
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
  );
};

export default TelemetryPanel;
