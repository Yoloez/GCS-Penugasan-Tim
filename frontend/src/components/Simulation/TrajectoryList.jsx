import React from "react";

/**
 * Trajectory list component displaying saved trajectories with delete option
 * @param {Object} props
 * @param {Array} props.trajectories - Array of saved trajectory objects
 * @param {Function} props.onDelete - Callback function when deleting a trajectory
 * @param {Function} props.onToggle - Callback function when toggling trajectory visibility
 * @param {Set} props.activeTrajectories - Set of active trajectory IDs
 */
const TrajectoryList = ({ trajectories, onDelete, onToggle, activeTrajectories }) => {
  if (trajectories.length === 0) return null;

  return (
    <>
      <hr style={{ margin: "15px 0" }} />
      <div style={{ marginBottom: "10px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#2C3E50" }}>Saved Trajectories ({trajectories.length})</h4>
        <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "11px" }}>
          {trajectories.map((traj, idx) => {
            const isActive = activeTrajectories?.has(traj.id);
            return (
              <div
                key={traj.id || idx}
                onClick={() => onToggle && traj.id && onToggle(traj.id)}
                style={{
                  padding: "10px",
                  marginBottom: "12px",
                  backgroundColor: isActive ? "rgba(52, 152, 219, 0.35)" : "rgba(52, 152, 219, 0.1)",
                  borderRadius: "4px",
                  border: isActive ? "2px solid rgba(52, 152, 219, 0.7)" : "1px solid rgba(52, 152, 219, 0.3)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", flexDirection: "column" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "2px 0", fontWeight: "bold", color: "#2C3E50" }}>
                      <span style={{ marginRight: "5px" }}>{isActive ? "" : ""}</span>
                      {traj.name || `Trajectory ${idx + 1}`}
                      <span style={{ marginLeft: "5px", fontSize: "9px", color: isActive ? "#27AE60" : "#95A5A6" }}>{isActive ? "ACTIVE" : "INACTIVE"}</span>
                    </p>
                    <p style={{ margin: "2px 0", color: "#7F8C8D" }}>
                      📍 Points: {traj.points?.length || 0} | ⏱️ {traj.duration || 0}s | 📏 {traj.distance || 0}m
                    </p>
                  </div>
                  {traj.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(traj.id);
                      }}
                      style={{
                        marginLeft: "5px",
                        padding: "3px 8px",
                        backgroundColor: "#E74C3C",
                        color: "white",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TrajectoryList;
