import { ComprehensiveAssessmentRefactored } from "./index";

// Example of how to use the refactored component
export default function AssessmentDemo() {
	const handleNavigate = (tab: string) => {
		console.log(`Navigate to ${tab}`);
	};

	return (
		<ComprehensiveAssessmentRefactored
			initialSubTab="complications"
			onNavigate={handleNavigate}
		/>
	);
}