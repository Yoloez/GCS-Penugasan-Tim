import { useState } from "react";
import MapEditor from "../components/MapEditor";
import { createPlan } from "../services/api";

export default function Editor() {
	const [planName, setPlanName] = useState("");
	const [mapData, setMapData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleMapSave = (data) => {
		setMapData(data);
		setMessage("Shape drawn successfully! Now name it and save.");
	};

	const handleSavePlan = async () => {
		if (!planName.trim()) {
			setMessage("Please enter a plan name");
			return;
		}

		if (!mapData) {
			setMessage("Please draw something on the map first");
			return;
		}

		setIsLoading(true);
		try {
			const newPlan = {
				name: planName,
				type: mapData.layerType,
				coordinates: mapData.coordinates,
			};

			const result = await createPlan(newPlan);
			setMessage(`✓ Plan "${result.name}" saved successfully!`);
			setPlanName("");
			setMapData(null);

			setTimeout(() => {
				window.location.href = "/plans";
			}, 1500);
		} catch (error) {
			setMessage(`Error saving plan: ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-2">Plan Editor</h1>
			<p className="text-gray-600 mb-8">
				Draw a plan on the map below, then save it with a name.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow p-4 h-96 lg:h-[500px]">
						<MapEditor onSave={handleMapSave} />
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg shadow p-6 sticky top-4">
						<h2 className="text-2xl font-bold mb-4">Save Plan</h2>

						{message && (
							<div
								className={`p-3 rounded mb-4 text-sm ${
									message.includes("Error")
										? "bg-red-100 text-red-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{message}
							</div>
						)}

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Plan Name
								</label>
								<input
									type="text"
									value={planName}
									onChange={(e) => setPlanName(e.target.value)}
									placeholder="Enter plan name..."
									className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									disabled={isLoading}
								/>
							</div>

							{mapData && (
								<div className="bg-blue-50 p-3 rounded">
									<p className="text-sm font-semibold text-blue-900">
										✓ Shape ready to save
									</p>
									<p className="text-xs text-blue-700">
										Type: {mapData.layerType}
									</p>
									<p className="text-xs text-blue-700">
										Points: {mapData.coordinates.length}
									</p>
								</div>
							)}

							<button
								onClick={handleSavePlan}
								disabled={!mapData || !planName.trim() || isLoading}
								className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition"
							>
								{isLoading ? "Saving..." : "Save Plan"}
							</button>

							<p className="text-xs text-gray-500">
								After saving, you can view all your plans on the Plans page.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
