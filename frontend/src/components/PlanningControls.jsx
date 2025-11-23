import React, { useRef } from "react";

const PlanningControls = ({ mapType, onMapTypeChange, drawingMode, onDrawingModeChange, mapRef }) => {
  const handleDrawingModeClick = (mode) => {
    if (drawingMode === mode) {
      onDrawingModeChange(null);
    } else {
      onDrawingModeChange(mode);
    }
  };

  return (
    <div className="controls-overlay">
      <div className="control-group">
        <h3>Map Type</h3>
        <div className="map-type-selector">
          <button className={`control-btn ${mapType === "normal" ? "active" : ""}`} onClick={() => onMapTypeChange("normal")}>
            Normal
          </button>
          <button className={`control-btn ${mapType === "satellite" ? "active" : ""}`} onClick={() => onMapTypeChange("satellite")}>
            Satellite
          </button>
        </div>
      </div>
      <div className="control-group">
        <h3>Drawing Tools</h3>
        <div className="control-buttons">
          <button className={`control-btn ${drawingMode === "polyline" ? "active" : ""}`} onClick={() => handleDrawingModeClick("polyline")}>
            Polyline
          </button>
          <button className={`control-btn ${drawingMode === "polygon" ? "active" : ""}`} onClick={() => handleDrawingModeClick("polygon")}>
            Polygon
          </button>
          <button className={`control-btn ${drawingMode === "rectangle" ? "active" : ""}`} onClick={() => handleDrawingModeClick("rectangle")}>
            Rectangle
          </button>
          <button className={`control-btn ${drawingMode === "circle" ? "active" : ""}`} onClick={() => handleDrawingModeClick("circle")}>
            Circle
          </button>
        </div>
      </div>

      {drawingMode && (
        <div className="keyboard-hint">
          <strong>Keyboard Controls:</strong>
          <br />
          WASD/Arrows: Move point <br />
          Enter: Save plan <br />
          ESC: Cancel
        </div>
      )}
    </div>
  );
};

export default PlanningControls;
