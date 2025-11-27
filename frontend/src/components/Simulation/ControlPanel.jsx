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
 * @param {Function} props.onToggleTrajectory - Callback to toggle trajectory visibility
 * @param {Set} props.activeTrajectories - Set of active trajectory IDs
 * @param {number} props.speed - Current movement speed
 * @param {Function} props.onSpeedChange - Callback to change speed
 */
const ControlPanel = ({
  isRecording,
  isSaving,
  isLoading,
  onStartRecord,
  onStopRecord,
  onClearAll,
  showPrecisionCircle,
  onTogglePrecisionCircle,
  trajectory,
  recordedTrajectories,
  onDeleteTrajectory,
  onToggleTrajectory,
  activeTrajectories,
  speed,
  onSpeedChange,
}) => {
  const handleIncreaseSpeed = () => {
    onSpeedChange(Math.min(speed * 2, 0.001)); // Max speed: 0.001
  };

  const handleDecreaseSpeed = () => {
    onSpeedChange(Math.max(speed / 2, 0.000001)); // Min speed: 0.000001
  };

  const getSpeedLabel = () => {
    if (speed >= 0.0005) return "Very Fast";
    if (speed >= 0.0001) return "Fast";
    if (speed >= 0.00005) return "Medium";
    if (speed >= 0.000005) return "Normal";
    return "Slow";
  };

  return (
    <div className="absolute top-[55px] right-2.5 bg-white/95 p-4 rounded-lg z-1000 font-sans shadow-lg text-black min-w-[220px]">
      <h3 className="m-0 mb-4 font-bold text-lg">Control Panel</h3>

      {/* Start/Stop Recording Button */}
      <div className="mb-2.5">
        {isRecording ? (
          <button
            onClick={onStopRecord}
            disabled={isSaving}
            className={`w-full py-2.5 px-4 text-white border-none rounded font-bold text-sm transition-colors ${isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
          >
            {isSaving ? "Saving..." : "Stop Recording"}
          </button>
        ) : (
          <button
            onClick={onStartRecord}
            disabled={isLoading || isSaving}
            className={`w-full py-2.5 px-4 text-white border-none rounded font-bold text-sm transition-colors ${isLoading || isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"}`}
          >
            {isLoading ? "Loading..." : "Start Recording"}
          </button>
        )}
      </div>

      {/* Clear All Button */}
      <div className="mb-2.5">
        <button
          onClick={onClearAll}
          disabled={recordedTrajectories.length === 0 || isLoading || isSaving}
          className={`w-full py-2.5 px-4 text-white border-none rounded font-bold text-sm transition-colors ${
            recordedTrajectories.length === 0 || isLoading || isSaving ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
          }`}
        >
          {isLoading ? "Clearing..." : "Clear All Tracks"}
        </button>
      </div>

      {/* Speed Control */}
      <div className="mb-2.5">
        <label className="text-sm mb-1 block font-bold">Speed: {getSpeedLabel()}</label>
        <div className="flex gap-1 items-center">
          <button
            onClick={handleDecreaseSpeed}
            disabled={speed <= 0.000001}
            className={`flex-1 py-2 px-4 text-white border-none rounded font-bold text-base transition-colors ${speed <= 0.000001 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}
          >
            −
          </button>
          <span className="text-xs text-gray-500 min-w-[60px] text-center">{speed.toFixed(6)}</span>
          <button
            onClick={handleIncreaseSpeed}
            disabled={speed >= 0.001}
            className={`flex-1 py-2 px-4 text-white border-none rounded font-bold text-base transition-colors ${speed >= 0.001 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Precision Circle Toggle */}
      <div className="mb-4">
        <label className="flex items-center cursor-pointer text-sm gap-2">
          <input type="checkbox" checked={showPrecisionCircle} onChange={onTogglePrecisionCircle} className="cursor-pointer" />
          Show Precision Circle
        </label>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* Status Display */}
      {isRecording && (
        <div className="bg-blue-500/10 p-2.5 rounded mb-2.5 border border-blue-500/30">
          <p className="my-1 text-xs">
            <strong>Current Points:</strong> {trajectory.length}
          </p>
        </div>
      )}

      {/* Trajectory List */}
      <TrajectoryList trajectories={recordedTrajectories} onDelete={onDeleteTrajectory} onToggle={onToggleTrajectory} activeTrajectories={activeTrajectories} />

      {/* Loading Indicator */}
      {isLoading && <div className="p-2 bg-blue-500/20 rounded text-center text-xs">⏳ Loading trajectories...</div>}
    </div>
  );
};

export default ControlPanel;
