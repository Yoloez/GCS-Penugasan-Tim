import { useEffect, useState } from "react";
import { getPlans, deletePlan } from "../services/api";

export default function Plans() {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [deleteConfirm, setDeleteConfirm] = useState(null);

	useEffect(() => {
		loadPlans();
	}, []);

	const loadPlans = async () => {
		setLoading(true);
		try {
			const data = await getPlans();
			setPlans(data);
			if (data.length === 0) {
				setMessage("No plans yet. Create one to get started!");
			}
		} catch (error) {
			setMessage(`Error loading plans: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deletePlan(id);
			setPlans(plans.filter((p) => p.id !== id));
			setMessage("✓ Plan deleted successfully");
			setDeleteConfirm(null);
			setTimeout(() => setMessage(""), 3000);
		} catch (error) {
			setMessage(`Error deleting plan: ${error}`);
		}
	};

	const handleEdit = (id) => {
		// TODO: Implement edit functionality
		alert(`Edit plan ${id} - Coming soon!`);
	};

	const handleDuplicate = (plan) => {
		// TODO: Implement duplicate functionality
		alert(`Duplicate plan "${plan.name}" - Coming soon!`);
	};

	const downloadPlanJSON = (plan) => {
		const dataStr = JSON.stringify(plan, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${plan.name}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">My Plans</h1>
				<p className="text-gray-600">
					View and manage all your saved plans here.
				</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-lg mb-6 ${
						message.includes("Error")
							? "bg-red-100 text-red-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{message}
				</div>
			)}

			{loading ? (
				<div className="flex justify-center items-center h-96">
					<div className="text-gray-500">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						Loading plans...
					</div>
				</div>
			) : plans.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<h3 className="text-xl font-semibold mb-2">No plans yet</h3>
					<p className="text-gray-600 mb-4">
						You haven't created any plans. Start by creating one!
					</p>
					<a
						href="/editor"
						className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition"
					>
						Create First Plan
					</a>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
						>
							<div className="mb-4">
								<h3 className="text-xl font-bold mb-2">{plan.name}</h3>
								<div className="flex gap-2 mb-3">
									<span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
										{plan.type}
									</span>
									<span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
										{plan.coordinates.length} points
									</span>
								</div>
								<p className="text-sm text-gray-500">
									Created: {new Date(plan.createdAt).toLocaleDateString()}
								</p>
								{plan.updatedAt && plan.updatedAt !== plan.createdAt && (
									<p className="text-sm text-gray-500">
										Updated: {new Date(plan.updatedAt).toLocaleDateString()}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<details className="bg-gray-50 p-3 rounded text-sm">
									<summary className="font-semibold cursor-pointer hover:text-blue-600">
										View Details
									</summary>
									<div className="mt-2 text-xs text-gray-600 max-h-40 overflow-y-auto">
										<p className="font-mono break-all">
											{JSON.stringify(plan.coordinates, null, 2)}
										</p>
									</div>
								</details>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-2">
								<button
									onClick={() => handleEdit(plan.id)}
									className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm font-medium transition"
								>
									Edit
								</button>
								<button
									onClick={() => handleDuplicate(plan)}
									className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium transition"
								>
									Duplicate
								</button>
								<button
									onClick={() => downloadPlanJSON(plan)}
									className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium transition"
								>
									Download
								</button>
								<button
									onClick={() => setDeleteConfirm(plan.id)}
									className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium transition"
								>
									Delete
								</button>
							</div>

							{deleteConfirm === plan.id && (
								<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
									<p className="text-sm font-semibold mb-2">
										Delete this plan?
									</p>
									<div className="flex gap-2">
										<button
											onClick={() => handleDelete(plan.id)}
											className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm font-medium transition"
										>
											Confirm
										</button>
										<button
											onClick={() => setDeleteConfirm(null)}
											className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-1 px-2 rounded text-sm font-medium transition"
										>
											Cancel
										</button>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
