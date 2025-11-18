import React from "react";

const SimulationPage = () => {
	return (
		<div
			style={{
				padding: "2rem",
				textAlign: "center",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<h1>Simulation Page</h1>
			<p style={{ marginTop: "1rem", color: "#666" }}>
				Simulation functionality will be implemented here. UAV mission playback
				and real-time monitoring will be available.
			</p>
			<div
				style={{
					marginTop: "2rem",
					padding: "2rem",
					background: "#f5f5f5",
					borderRadius: "8px",
					maxWidth: "500px",
				}}
			>
				<h3>Coming Soon Features:</h3>
				<ul style={{ textAlign: "left", marginTop: "1rem" }}>
					<li>Real-time UAV tracking</li>
					<li>Mission playback</li>
					<li>Telemetry data visualization</li>
					<li>Obstacle detection simulation</li>
				</ul>
			</div>
		</div>
	);
};

export default SimulationPage;
