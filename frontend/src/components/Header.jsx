import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Header = () => {
	const location = useLocation();

	return (
		<header className="app-nav">
			<div className="nav-brand">
				<h2>UAV Ground Control System</h2>
			</div>
			<nav className="nav-links">
				<Link
					to="/planning"
					className={`nav-link ${
						location.pathname === "/planning" ? "active" : ""
					}`}
				>
					Planning
				</Link>
				<Link
					to="/simulation"
					className={`nav-link ${
						location.pathname === "/simulation" ? "active" : ""
					}`}
				>
					Simulation
				</Link>
			</nav>
		</header>
	);
};

export default Header;
