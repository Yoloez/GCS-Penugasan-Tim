import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<header className="w-full bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 shadow-lg">
			<div className="max-w mx-4 px-8 sm:px-6 lg:px-8 ">
				<div className="flex items-center justify-between h-16 mx-4">
					{/* Logo/Brand */}
					<div className="shrink-0">
						<div className="flex items-center space-x-2">
							<span className="text-white font-bold text-xl hidden sm:block">
								Ground Control System Simulator
							</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-1 gap-56">
						<Link
							to="/planning"
							className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
								isActive("/planning")
									? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
									: "text-gray-300 hover:text-white hover:bg-white/10"
							}`}
						>
							<div className="flex items-center space-x-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								<span>Planning</span>
							</div>
						</Link>

						<Link
							to="/simulation"
							className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
								isActive("/simulation")
									? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
									: "text-gray-300 hover:text-white hover:bg-white/10"
							}`}
						>
							<div className="flex items-center space-x-2">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								<span>Simulation</span>
							</div>
						</Link>
					</nav>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden py-4 space-y-2">
						<Link
							to="/planning"
							onClick={() => setIsMenuOpen(false)}
							className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
								isActive("/planning")
									? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
									: "text-gray-300 hover:text-white hover:bg-white/10"
							}`}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<span>Planning</span>
						</Link>

						<Link
							to="/simulation"
							onClick={() => setIsMenuOpen(false)}
							className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
								isActive("/simulation")
									? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg"
									: "text-gray-300 hover:text-white hover:bg-white/10"
							}`}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							<span>Simulation</span>
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
