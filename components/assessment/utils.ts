export const getRiskColor = (risk: string) => {
	switch (risk) {
		case "high":
			return "text-red-600 bg-red-50 border-red-200";
		case "moderate":
			return "text-orange-600 bg-orange-50 border-orange-200";
		case "low":
			return "text-green-600 bg-green-50 border-green-200";
		default:
			return "text-gray-600 bg-gray-50 border-gray-200";
	}
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case "Assessed":
			return "text-green-600 bg-green-50";
		case "Pending Assessment":
			return "text-orange-600 bg-orange-50";
		default:
			return "text-gray-600 bg-gray-50";
	}
};

export const getScoreColor = (score: number, maxScore: number) => {
	const percentage = (score / maxScore) * 100;
	if (percentage <= 25) return "#22c55e";
	if (percentage <= 50) return "#eab308";
	return "#ef4444";
};

export const saveNephrologyDataToStorage = (nephrologyData: any) => {
	localStorage.setItem("nephrologyData", JSON.stringify(nephrologyData));
	
	// Trigger overview page update
	const overviewUpdateEvent = new CustomEvent("nephrologyDataUpdate", {
		detail: nephrologyData,
	});
	window.dispatchEvent(overviewUpdateEvent);
};