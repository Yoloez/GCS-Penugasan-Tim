import React from "react";

/**
 * Trajectory list component displaying saved trajectories with delete option
 * @param {Object} props
 * @param {Array} props.trajectories - Array of saved trajectory objects
 * @param {Function} props.onDelete - Callback function when deleting a trajectory
 */
const TrajectoryList = ({ trajectories, onDelete }) => {
  if (trajectories.length === 0) return null;

  return (
    <>
      <hr style={{ margin: "15px 0" }} />
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#2C3E50" }}>📊 Saved Trajectories ({trajectories.length})</h4>
        <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "11px" }}>
          {trajectories.map((traj, idx) => (
            <div
              key={traj.id || idx}
              style={{
                padding: "8px",
                marginBottom: "5px",
                backgroundColor: "rgba(52, 152, 219, 0.1)",
                borderRadius: "4px",
                border: "1px solid rgba(52, 152, 219, 0.3)",
              }}
            >
              <p style={{ margin: "2px 0", fontWeight: "bold", color: "#2C3E50" }}>{traj.name || `Trajectory ${idx + 1}`}</p>
              <p style={{ margin: "2px 0", color: "#7F8C8D" }}>
                📍 Points: {traj.points?.length || 0} | ⏱️ {traj.duration || 0}s | 📏 {traj.distance || 0}m
              </p>
              {traj.created_at && <p style={{ margin: "2px 0", color: "#95A5A6", fontSize: "10px" }}>🕒 {new Date(traj.created_at).toLocaleString()}</p>}
              {traj.id && (
                <button
                  onClick={() => onDelete(traj.id)}
                  style={{
                    marginTop: "5px",
                    padding: "3px 8px",
                    backgroundColor: "#E74C3C",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrajectoryList;
