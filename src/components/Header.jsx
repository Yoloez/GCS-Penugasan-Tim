import React from "react";
import "../App.css";

const Header = () => {
	return (
		<header className="flex flex-col justify-center items-center w-full bg-amber-200">
			<h1>INI HEADER BESAR BANGET</h1>
			<h2>Halooo</h2>
			<nav className="flex flex-row items-center justify-center gap-4">
				<a href="../pages/PlanningPage.jsx">Planning</a>
				<a href="../pages/SimulationPage.jsx">Simulation</a>
			</nav>
		</header>
	);
};

export default Header;
