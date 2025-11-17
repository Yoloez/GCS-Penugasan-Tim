import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-4 py-4 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold">GCS</span>
					</div>
					<span className="text-xl font-bold text-gray-800">
						Ground Control System
					</span>
				</Link>

				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="text-gray-600 hover:text-blue-600 font-medium transition"
					>
						Home
					</Link>
					<Link
						to="/editor"
						className="text-gray-600 hover:text-blue-600 font-medium transition"
					>
						Create Plan
					</Link>
					<Link
						to="/plans"
						className="text-gray-600 hover:text-blue-600 font-medium transition"
					>
						All Plans
					</Link>
					<Link
						to="/map"
						className="text-gray-600 hover:text-blue-600 font-medium transition"
					>
						Map View
					</Link>
					<Link
						to="/profile"
						className="text-gray-600 hover:text-blue-600 font-medium transition"
					>
						Profile
					</Link>
				</div>
			</nav>
		</header>
	);
};

export default Header;
