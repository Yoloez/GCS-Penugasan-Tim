import React from "react";
import TrajectoryList from "./TrajectoryList";

/**
 * Control panel component for managing trajectory recording
 * @param {Object} props
 * @param {boolean} props.isRecording - Recording state
 * @param {boolean} props.isSaving - Saving state
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onStartRecord - Callback to start recording
 * @param {Function} props.onStopRecord - Callback to stop recording
 * @param {Function} props.onClearAll - Callback to clear all trajectories
 * @param {boolean} props.showPrecisionCircle - Precision circle visibility state
 * @param {Function} props.onTogglePrecisionCircle - Callback to toggle precision circle
 * @param {Array} props.trajectory - Current trajectory points
 * @param {Array} props.recordedTrajectories - Array of saved trajectories
 * @param {Function} props.onDeleteTrajectory - Callback to delete single trajectory
 */
const ControlPanel = ({ isRecording, isSaving, isLoading, onStartRecord, onStopRecord, onClearAll, showPrecisionCircle, onTogglePrecisionCircle, trajectory, recordedTrajectories, onDeleteTrajectory }) => {
  return (
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

      {/* Start/Stop Recording Button */}
      <div style={{ marginBottom: "10px" }}>
        {isRecording ? (
          <button
            onClick={onStopRecord}
            disabled={isSaving}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isSaving ? "#95A5A6" : "#E74C3C",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {isSaving ? "💾 Saving..." : "⏹ Stop Recording"}
          </button>
        ) : (
          <button
            onClick={onStartRecord}
            disabled={isLoading || isSaving}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: isLoading || isSaving ? "#95A5A6" : "#27AE60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading || isSaving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {isLoading ? "⏳ Loading..." : "▶ Start Recording"}
          </button>
        )}
      </div>

      {/* Clear All Button */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={onClearAll}
          disabled={recordedTrajectories.length === 0 || isLoading || isSaving}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: recordedTrajectories.length === 0 || isLoading || isSaving ? "#BDC3C7" : "#E67E22",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: recordedTrajectories.length === 0 || isLoading || isSaving ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {isLoading ? "⏳ Clearing..." : "🗑️ Clear All Tracks"}
        </button>
      </div>

      {/* Precision Circle Toggle */}
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
          <input type="checkbox" checked={showPrecisionCircle} onChange={onTogglePrecisionCircle} style={{ cursor: "pointer" }} />
          Show Precision Circle
        </label>
      </div>

      <hr style={{ margin: "15px 0" }} />

      {/* Status Display */}
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

      {/* Trajectory List */}
      <TrajectoryList trajectories={recordedTrajectories} onDelete={onDeleteTrajectory} />

      {/* Loading Indicator */}
      {isLoading && (
        <div
          style={{
            padding: "8px",
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          ⏳ Loading trajectories...
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
