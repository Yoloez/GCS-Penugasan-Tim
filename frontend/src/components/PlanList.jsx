import React from "react";

const PlanList = ({ plans, activePlan, onPlanLoad, onPlanDelete }) => {
  const handlePlanClick = (plan) => {
    onPlanLoad(plan.id);
  };

  const handleDeleteClick = (plan, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete plan "${plan.name}"?`)) {
      onPlanDelete(plan.id);
    }
  };

  const handleExportClick = (plan, e) => {
    e.stopPropagation();
    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${plan.name.replace(/\s+/g, "_")}.json`;
    link.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Saved Plans ({plans.length})</h3>

      {plans.length === 0 ? (
        <p className="text-gray-500 italic text-sm">No plans saved yet</p>
      ) : (
        <div className="space-y-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${activePlan?.id === plan.id ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"}`}
              onClick={() => handlePlanClick(plan)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{plan.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(plan.createdAt).toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Type: {plan.data?.type}</div>
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  <button onClick={(e) => handleExportClick(plan, e)} className="bg-transparent border-none text-blue-600 cursor-pointer text-sm p-1 hover:bg-blue-100 rounded transition-colors" title="Export">
                    ⬇️
                  </button>
                  <button onClick={(e) => handleDeleteClick(plan, e)} className="bg-transparent border-none text-red-600 cursor-pointer text-sm p-1 hover:bg-red-100 rounded transition-colors" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanList;
