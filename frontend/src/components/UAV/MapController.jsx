import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

/**
 * Map controller component for handling UAV keyboard navigation
 * @param {Object} props
 * @param {Array} props.uavPosition - Current UAV position [lat, lng]
 * @param {Function} props.setUavPosition - Function to update UAV position
 * @param {boolean} props.isRecording - Recording state
 * @param {Array} props.trajectory - Current trajectory points
 * @param {Function} props.setTrajectory - Function to update trajectory
 */
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

export default MapController;
