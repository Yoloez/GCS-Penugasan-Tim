import React from "react";
import { Route, Routes } from "react-router-dom";
// import Home from "./pages/Home.jsx";
// import Header from "./components/Header.jsx";
// import Map from "./pages/Map.jsx";
// import Editor from "./pages/Editor.jsx";
// import Plans from "./pages/Plans.jsx";
import {  Navigate } from "react-router-dom";
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
