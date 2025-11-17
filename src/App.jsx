import React from "react";
import { Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import Home from "./pages/Home.jsx";
=======
import Header from "./components/Header.jsx";
>>>>>>> 0d326e493569399ba34b84a18d2d6bc6bba76536
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
