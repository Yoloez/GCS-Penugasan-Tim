import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Map from "./pages/Map.jsx";
import Editor from "./pages/Editor.jsx";
import Plans from "./pages/Plans.jsx";

const App = () => {
	return (
		<div>
			<Header />
			<Routes>
				<Route path="/map" element={<Map />} />
				<Route path="/editor" element={<Editor />} />
				<Route path="/" element={<Plans />} />
			</Routes>
		</div>
	);
};

export default App;
