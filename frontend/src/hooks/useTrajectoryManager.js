import { useState, useEffect } from "react";
import { saveTrajectory, getTrajectories, deleteTrajectory } from "../services/api";

/**
 * Custom hook for managing UAV trajectory recording and persistence
 * @returns {Object} Trajectory manager state and methods
 */
export const useTrajectoryManager = () => {
  const [recordedTrajectories, setRecordedTrajectories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  // Load trajectories from database on mount
  useEffect(() => {
    loadTrajectoriesFromDB();
  }, []);

  const loadTrajectoriesFromDB = async () => {
    try {
      setIsLoading(true);
      const trajectories = await getTrajectories();
      const formattedTrajectories = trajectories.map((t) => ({
        id: t.id,
        name: t.name,
        points: t.points,
        duration: t.duration,
        distance: t.distance,
        created_at: t.created_at,
      }));
      setRecordedTrajectories(formattedTrajectories);
    } catch (error) {
      console.error("Failed to load trajectories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculate distance between GPS points using Haversine formula
   * @param {Array} points - Array of [lat, lng] coordinates
   * @returns {number} Total distance in meters
   */
  const calculateDistance = (points) => {
    if (points.length < 2) return 0;
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const [lat1, lng1] = points[i - 1];
      const [lat2, lng2] = points[i];
      const R = 6371000; // Earth radius in meters
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
    return totalDistance;
  };

  /**
   * Save trajectory to database
   * @param {Array} trajectory - Array of GPS coordinates
   * @returns {Promise<boolean>} Success status
   */
  const saveTrajectoryToDB = async (trajectory) => {
    if (trajectory.length < 2) return false;

    const duration = (Date.now() - recordingStartTime) / 1000; // seconds
    const distance = calculateDistance(trajectory);
    const trajectoryName = `Simulation_${new Date().toLocaleString()}`;

    try {
      setIsSaving(true);

      // Show loading message for large trajectories
      if (trajectory.length > 10000) {
        console.log(`⏳ Saving large trajectory with ${trajectory.length} points. This may take a while...`);
      }

      const savedTrajectory = await saveTrajectory({
        name: trajectoryName,
        points: trajectory,
        duration: Math.round(duration),
        distance: Math.round(distance),
      });

      setRecordedTrajectories([
        ...recordedTrajectories,
        {
          id: savedTrajectory.id,
          name: trajectoryName,
          points: trajectory,
          duration: Math.round(duration),
          distance: Math.round(distance),
          created_at: new Date().toISOString(),
        },
      ]);

      alert(`✅ Trajectory saved!\nPoints: ${trajectory.length}\nDuration: ${Math.round(duration)}s\nDistance: ${Math.round(distance)}m`);
      return true;
    } catch (error) {
      console.error("Failed to save trajectory:", error);

      // More specific error messages
      if (error.name === "AbortError") {
        alert("❌ Request timeout! Trajectory too large or server not responding.\nTry recording for a shorter duration.");
      } else if (error.message.includes("payload")) {
        alert("❌ Trajectory too large to save!\nTry recording for a shorter duration or reduce recording frequency.");
      } else {
        alert(`❌ Failed to save trajectory: ${error.message}`);
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Delete all trajectories from database
   */
  const clearAllTrajectories = async () => {
    if (recordedTrajectories.length === 0) return;

    if (window.confirm(`Delete all ${recordedTrajectories.length} saved trajectories?`)) {
      try {
        setIsLoading(true);
        await Promise.all(recordedTrajectories.map((traj) => (traj.id ? deleteTrajectory(traj.id) : Promise.resolve())));

        setRecordedTrajectories([]);
        alert("✅ All trajectories cleared!");
      } catch (error) {
        console.error("Failed to clear trajectories:", error);
        alert("❌ Failed to clear some trajectories");
      } finally {
        setIsLoading(false);
      }
    }
  };

  /**
   * Delete single trajectory from database
   * @param {number} trajectoryId - ID of trajectory to delete
   */
  const deleteSingleTrajectory = async (trajectoryId) => {
    try {
      await deleteTrajectory(trajectoryId);
      setRecordedTrajectories(recordedTrajectories.filter((t) => t.id !== trajectoryId));
      alert("✅ Trajectory deleted!");
    } catch (error) {
      console.error("Failed to delete trajectory:", error);
      alert("❌ Failed to delete trajectory");
    }
  };

  return {
    recordedTrajectories,
    isLoading,
    isSaving,
    recordingStartTime,
    setRecordingStartTime,
    saveTrajectoryToDB,
    clearAllTrajectories,
    deleteSingleTrajectory,
  };
};
