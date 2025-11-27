import React from "react";

/**
 * Telemetry panel component displaying UAV position and keyboard controls
 * @param {Object} props
 * @param {Array} props.uavPosition - Current UAV position [lat, lng]
 */
const TelemetryPanel = ({ uavPosition }) => {
  return (
    <div className="absolute top-[100px] left-2.5 bg-white/95 p-4 rounded-lg z-1000 font-sans shadow-md text-black">
      <h3 className="m-0 mb-2.5 text-[#2C3E50]"> UAV Telemetry</h3>

      <div className="bg-[#ECF0F1] p-2.5 rounded font-mono text-[13px] mb-2.5">
        <p className="my-0.5">
          <strong>Lat:</strong> {uavPosition[0].toFixed(8)}°
        </p>
        <p className="my-0.5">
          <strong>Lng:</strong> {uavPosition[1].toFixed(8)}°
        </p>
      </div>

      <hr className="my-2.5" />

      <div className="text-xs">
        <p className="my-1.5">
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">↑</kbd>
          {" / "}
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">W</kbd>
          {" - Move North"}
        </p>
        <p className="my-1.5">
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">↓</kbd>
          {" / "}
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">S</kbd>
          {" - Move South"}
        </p>
        <p className="my-1.5">
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">←</kbd>
          {" / "}
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">A</kbd>
          {" - Move West"}
        </p>
        <p className="my-1.5">
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">→</kbd>
          {" / "}
          <kbd className="px-1.5 py-0.5 bg-[#34495E] text-white rounded text-[11px]">D</kbd>
          {" - Move East"}
        </p>
      </div>
    </div>
  );
};

export default TelemetryPanel;
