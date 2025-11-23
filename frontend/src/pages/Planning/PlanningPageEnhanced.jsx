import React, { useState, useCallback, useEffect } from "react";
import MapComponent from "../../components/MapPlanning";
import PlanningControls from "../../components/PlanningControls";
import PlanList from "../../components/PlanList";
import { savePlanToFile } from "../../utils/fileHandler";
import { createPlan, getPlans, deletePlan as apiDeletePlan } from "../../services/api";

const PlanningPageEnhanced = () => {
  const [mapType, setMapType] = useState("normal");
  const [drawingMode, setDrawingMode] = useState(null);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingPlanData, setPendingPlanData] = useState(null);
  const [planName, setPlanName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load plans from database on mount
  useEffect(() => {
    loadPlansFromDatabase();
  }, []);

  const loadPlansFromDatabase = async () => {
    try {
      setIsLoading(true);
      const dbPlans = await getPlans();

      // Transform database plans to match local format
      const transformedPlans = dbPlans.map((plan) => {
        // Extract type from description (format: "Type: polyline" or "Type: polygon", etc.)
        let extractedType = "polyline"; // Default fallback
        if (plan.description && plan.description.startsWith("Type: ")) {
          extractedType = plan.description.replace("Type: ", "").trim();
        }

        // Reconstruct shape for rectangle and circle
        let shape = null;
        if (extractedType === "rectangle" && plan.waypoints.length === 4) {
          // Rectangle: reconstruct bounds from 4 corners
          const lats = plan.waypoints.map((p) => p[0]);
          const lngs = plan.waypoints.map((p) => p[1]);
          shape = [
            [Math.max(...lats), Math.min(...lngs)], // Top-left
            [Math.min(...lats), Math.max(...lngs)], // Bottom-right
          ];
        } else if (extractedType === "circle" && plan.waypoints.length > 1) {
          // Circle: first point is center, calculate radius from perimeter points
          const center = plan.waypoints[0];
          const firstPerimeterPoint = plan.waypoints[1];
          const radius = Math.sqrt(Math.pow(firstPerimeterPoint[0] - center[0], 2) + Math.pow(firstPerimeterPoint[1] - center[1], 2)) * 111000; // Convert to meters
          shape = { center, radius };
        }

        return {
          id: plan.id.toString(),
          name: plan.name,
          description: plan.description,
          data: {
            type: extractedType,
            points: plan.waypoints,
            shape: shape, // Add reconstructed shape
            createdAt: plan.created_at,
          },
          createdAt: plan.created_at,
        };
      });

      setPlans(transformedPlans);
      setError(null);
    } catch (err) {
      console.error("Failed to load plans from database:", err);
      setError("Failed to load plans from database. Please check if backend is running.");
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSave = useCallback((planData) => {
    setPendingPlanData(planData);
    setShowNameDialog(true);
  }, []);

  const handleConfirmPlanName = useCallback(async () => {
    if (!pendingPlanData) return;

    const planNameTrimmed = planName.trim() || `Plan_${new Date().toLocaleString()}`;

    try {
      setIsLoading(true);

      // Save to database
      const response = await createPlan({
        name: planNameTrimmed,
        description: `Type: ${pendingPlanData.type}`,
        waypoints: pendingPlanData.points,
      });

      // Create plan object with database ID
      const newPlan = {
        id: response.id.toString(),
        name: planNameTrimmed,
        data: pendingPlanData,
        createdAt: new Date().toISOString(),
      };

      setPlans((prev) => [...prev, newPlan]);

      // Also save to localStorage as backup
      savePlanToFile(newPlan);

      setDrawingMode(null);
      setShowNameDialog(false);
      setPlanName("");
      setPendingPlanData(null);
      setError(null);

      // Show success message
      alert("✅ Plan saved to database successfully!");

      return newPlan;
    } catch (err) {
      console.error("Failed to save plan to database:", err);
      setError("Failed to save plan to database");
      alert("❌ Failed to save plan to database. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  }, [pendingPlanData, planName]);

  const handleCancelNameDialog = useCallback(() => {
    setShowNameDialog(false);
    setPlanName("");
    setPendingPlanData(null);
  }, []);

  const handleDrawingCancel = useCallback(() => {
    setDrawingMode(null);
  }, []);

  const handlePlanLoad = useCallback(
    async (planId) => {
      const plan = plans.find((p) => p.id === planId);
      if (plan) {
        setActivePlan(plan);
      }
    },
    [plans]
  );

  const handlePlanDelete = useCallback(
    async (planId) => {
      try {
        setIsLoading(true);

        // Delete from database
        await apiDeletePlan(planId);

        // Remove from state
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        if (activePlan?.id === planId) {
          setActivePlan(null);
        }

        // Also remove from localStorage
        localStorage.removeItem(`plan_${planId}`);
        setError(null);
        alert("✅ Plan deleted successfully!");
      } catch (err) {
        console.error("Failed to delete plan from database:", err);
        setError("Failed to delete plan from database");
        alert("❌ Failed to delete plan from database. Please check if backend is running.");
      } finally {
        setIsLoading(false);
      }
    },
    [activePlan]
  );

  return (
    <div className="planning-container">
      <MapComponent mapType={mapType} drawingMode={drawingMode} activePlan={activePlan} onPlanSave={handlePlanSave} onDrawingCancel={handleDrawingCancel} onMapInit={setMapRef} />

      <PlanningControls mapType={mapType} onMapTypeChange={setMapType} drawingMode={drawingMode} onDrawingModeChange={setDrawingMode} mapRef={mapRef} />

      {/* Loading Indicator */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2001,
            background: "rgba(26, 115, 235, 0.9)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid white",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span>Processing...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2001,
            background: "rgba(220, 38, 38, 0.95)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            maxWidth: "400px",
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "1rem",
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {showNameDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "2rem",
              minWidth: "300px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "1rem", color: "#1a73eb" }}>Name Your Plan</h2>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter plan name..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                marginBottom: "1.5rem",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirmPlanName();
                if (e.key === "Escape") handleCancelNameDialog();
              }}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancelNameDialog}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlanName}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  background: "#1a73eb",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: "white",
          borderRadius: "8px",
          padding: "1rem",
          minWidth: "250px",
          maxHeight: "500px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          overflowY: "auto",
        }}
      >
        <PlanList plans={plans} activePlan={activePlan} onPlanLoad={handlePlanLoad} onPlanDelete={handlePlanDelete} />
      </div>
    </div>
  );
};

export default PlanningPageEnhanced;
