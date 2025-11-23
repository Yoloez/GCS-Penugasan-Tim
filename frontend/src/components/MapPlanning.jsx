import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMapEvent, Polyline, Polygon, Rectangle, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";

const MapEvents = ({ drawingMode, onPlanSave, onDrawingCancel }) => {
  const [points, setPoints] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);

  useMapEvent({
    click(e) {
      if (!drawingMode) return;
      const { lat, lng } = e.latlng;

      switch (drawingMode) {
        case "polyline":
          setPoints((prev) => [...prev, [lat, lng]]);
          break;

        case "polygon":
          setPoints((prev) => [...prev, [lat, lng]]);
          break;

        case "rectangle":
          if (points.length === 0) {
            setPoints([[lat, lng]]);
          } else if (points.length === 1) {
            // Complete rectangle on second click
            // Calculate 4 corners (clockwise from top-left)
            const [startLat, startLng] = points[0];
            const rectangleCorners = [
              [Math.max(startLat, lat), Math.min(startLng, lng)], // Top-left
              [Math.max(startLat, lat), Math.max(startLng, lng)], // Top-right
              [Math.min(startLat, lat), Math.max(startLng, lng)], // Bottom-right
              [Math.min(startLat, lat), Math.min(startLng, lng)], // Bottom-left
            ];
            onPlanSave({
              type: "rectangle",
              points: rectangleCorners, // 4 corner points
              shape: currentShape,
              createdAt: new Date().toISOString(),
            });
            setPoints([]);
            setCurrentShape(null);
          }
          break;

        case "circle":
          if (points.length === 0) {
            setPoints([[lat, lng]]);
          } else if (points.length === 1) {
            // Complete circle on second click
            const [centerLat, centerLng] = points[0];
            const radius = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)) * 111000; // Convert lat/lng distance to meters

            // Generate circle waypoints: center + perimeter points (36 points = every 10 degrees)
            const circleWaypoints = [[centerLat, centerLng]]; // Center point first
            const numPoints = 36; // Number of points on perimeter
            const radiusInDegrees = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2));

            for (let i = 0; i < numPoints; i++) {
              const angle = ((i * 360) / numPoints) * (Math.PI / 180); // Convert to radians
              const perimeterLat = centerLat + radiusInDegrees * Math.cos(angle);
              const perimeterLng = centerLng + radiusInDegrees * Math.sin(angle);
              circleWaypoints.push([perimeterLat, perimeterLng]);
            }

            onPlanSave({
              type: "circle",
              points: circleWaypoints, // Center + 36 perimeter points
              shape: { center: points[0], radius: radius },
              createdAt: new Date().toISOString(),
            });
            setPoints([]);
            setCurrentShape(null);
          }
          break;

        default:
          break;
      }
    },
  });

  // Mouse move for real-time rectangle and circle rendering
  useMapEvent({
    mousemove(e) {
      if (!drawingMode || points.length === 0) return;
      const { lat, lng } = e.latlng;

      switch (drawingMode) {
        case "rectangle":
          if (points.length === 1) {
            const [startLat, startLng] = points[0];
            setCurrentShape([
              [startLat, startLng],
              [lat, lng],
            ]);
          }
          break;

        case "circle":
          if (points.length === 1) {
            const [centerLat, centerLng] = points[0];
            const radius = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2)) * 111000; // Convert to meters
            setCurrentShape({ center: [centerLat, centerLng], radius });
          }
          break;

        default:
          break;
      }
      setMousePosition([lat, lng]);
    },
  });

  // Keyboard Navigation Hook - support all drawing modes
  useKeyboardNavigation({
    enabled: drawingMode && points.length > 0,
    onMove: (dx, dy) => {
      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        const newPoint = [lastPoint[0] + dy * 0.0001, lastPoint[1] + dx * 0.0001];
        setPoints((prev) => [...prev.slice(0, -1), newPoint]);
      }
    },
    onEnter: () => {
      // Finalize drawing for all modes
      if (points.length > 0 && onPlanSave) {
        let finalPoints = points;

        // Process points based on drawing mode
        if (drawingMode === "rectangle" && points.length === 2) {
          // Calculate 4 corners for rectangle
          const [startLat, startLng] = points[0];
          const [endLat, endLng] = points[1];
          finalPoints = [
            [Math.max(startLat, endLat), Math.min(startLng, endLng)], // Top-left
            [Math.max(startLat, endLat), Math.max(startLng, endLng)], // Top-right
            [Math.min(startLat, endLat), Math.max(startLng, endLng)], // Bottom-right
            [Math.min(startLat, endLat), Math.min(startLng, endLng)], // Bottom-left
          ];
        } else if (drawingMode === "circle" && points.length === 2) {
          // Generate circle waypoints: center + perimeter
          const [centerLat, centerLng] = points[0];
          const [edgeLat, edgeLng] = points[1];
          const radiusInDegrees = Math.sqrt(Math.pow(edgeLat - centerLat, 2) + Math.pow(edgeLng - centerLng, 2));

          finalPoints = [[centerLat, centerLng]]; // Center point first
          const numPoints = 36;

          for (let i = 0; i < numPoints; i++) {
            const angle = ((i * 360) / numPoints) * (Math.PI / 180);
            const perimeterLat = centerLat + radiusInDegrees * Math.cos(angle);
            const perimeterLng = centerLng + radiusInDegrees * Math.sin(angle);
            finalPoints.push([perimeterLat, perimeterLng]);
          }
        }

        const planData = {
          type: drawingMode,
          points: finalPoints,
          shape: currentShape,
          createdAt: new Date().toISOString(),
        };
        onPlanSave(planData);
        setPoints([]);
        setCurrentShape(null);
      }
    },
    onCancel: () => {
      // Cancel drawing
      if (onDrawingCancel) {
        onDrawingCancel();
      }
      setPoints([]);
      setCurrentShape(null);
    },
  });

  //Render current drawing
  const renderCurrentDrawing = () => {
    if (points.length === 0) return null;

    switch (drawingMode) {
      case "polyline":
        return <Polyline positions={points} color="blue" />;

      case "polygon":
        return <Polygon positions={points} color="green" />;

      case "rectangle":
        if (currentShape) {
          return <Rectangle bounds={currentShape} color="red" />;
        }
        return null;

      case "circle":
        if (currentShape) {
          return <Circle center={currentShape.center} radius={currentShape.radius} color="purple" />;
        }
        return null;

      default:
        return null;
    }
  };

  return <>{renderCurrentDrawing()}</>;
};

const MapComponent = ({ mapType, drawingMode, activePlan, onPlanSave, onDrawingCancel, onMapInit }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current && onMapInit) {
      onMapInit(mapRef.current);
    }
  }, [onMapInit]);

  const getTileLayer = () => {
    if (mapType === "satellite") {
      return <TileLayer url="https://{s}.google.com/vt/lyrs/=s&x={x}&y={y}&z={z}" subdomains={["mt0", "mt1", "mt2", "mt3"]} attribution="&copy; Google" />;
    } else {
      return <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />;
    }
  };

  const renderActivePlan = () => {
    if (!activePlan?.data) return null;

    const { type, points, shape } = activePlan.data;

    switch (type) {
      case "polyline":
        return <Polyline positions={points} color="blue" weight={3} />;

      case "polygon":
        return <Polygon positions={points} color="green" weight={3} />;

      case "rectangle":
        return <Rectangle bounds={shape} color="red" weight={3} />;

      case "circle":
        return <Circle center={shape.center} radius={shape.radius} color="purple" weight={3} />;
      default:
        return null;
    }
  };

  return (
    <MapContainer
      center={[-7.7956, 110.3695]} // Yogyakarta
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      {getTileLayer()}
      <MapEvents drawingMode={drawingMode} onPlanSave={onPlanSave} onDrawingCancel={onDrawingCancel} />

      {renderActivePlan()}
    </MapContainer>
  );
};

export default MapComponent;
