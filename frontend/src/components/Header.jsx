import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbDrone } from "react-icons/tb";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	return (
		<header className="w-full bg-linear-to-r from-slate-700 via-gray-700 to-slate-800 backdrop-blur-xl shadow-xl ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo/Brand Section */}
					<div className="flex items-center space-x-4">
						{/* Logo/Icon */}
						<div className="shrink-0">
							<div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
								<TbDrone
									className="w-8 h-8 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								/>
							</div>
						</div>

						{/* Brand Text */}
						<div className="hidden sm:block">
							<h1 className="text-white font-bold text-xl tracking-wide">
								Ground Control Station
							</h1>
							<p className="text-white text-xs font-medium tracking-wider">
								UAV Mission Planning System
							</p>
						</div>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-2">
						<Link
							to="/planning"
							className={`group relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
								isActive("/planning")
									? "bg-gray-500 text-white shadow-lg"
									: "text-white hover:bg-white/10"
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
										d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
									/>
								</svg>
								<span>Planning</span>
							</div>
							{!isActive("/planning") && (
								<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
							)}
						</Link>

						<Link
							to="/simulation"
							className={`group relative px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
								isActive("/simulation")
									? "bg-gray-500 text-white shadow-lg"
									: "text-white hover:bg-white/10"
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
							{!isActive("/simulation") && (
								<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
							)}
						</Link>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
							aria-label="Toggle menu"
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

				{/* Mobile Navigation Menu */}
				{isMenuOpen && (
					<div className="md:hidden pb-4 space-y-2 animate-fadeIn">
						<Link
							to="/planning"
							onClick={() => setIsMenuOpen(false)}
							className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
								isActive("/planning")
									? "bg-yellow-500 text-blue-900 shadow-lg"
									: "text-white hover:bg-white/10"
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
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
								/>
							</svg>
							<span>Planning</span>
						</Link>

						<Link
							to="/simulation"
							onClick={() => setIsMenuOpen(false)}
							className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
								isActive("/simulation")
									? "bg-yellow-500 text-blue-900 shadow-lg"
									: "text-white hover:bg-white/10"
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
