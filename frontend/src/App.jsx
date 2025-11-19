import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PlanningPageEnhanced from "./pages/Planning/PlanningPageEnhanced";
import SimulationPage from "./pages/Simulation/SimulationPage";
import Header from "./components/Header";
import "./App.css";

function App() {
	return (
		<div className="app">
			<Header />
			<Routes>
				<Route path="/" element={<Navigate to="/planning" replace />} />
				<Route path="/planning" element={<PlanningPageEnhanced />} />
				<Route path="/simulation" element={<SimulationPage />} />
			</Routes>
		</div>
	);
}

export default App;
