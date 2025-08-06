import type React from "react";

export interface AssessmentItem {
	name: string;
	icon: React.ComponentType<{ className?: string }>;
	status: string;
	actualDiagnosis: string;
	lastAssessed: string;
	nextDue: string;
	riskLevel?: string;
	investigations: string[];
	consultations: string[];
	actionOptions: string[];
	selectedAction?: string;
	personalNotes?: string;
	hasDrawing?: boolean;
	drawingData?: any;
	followUpCustom?: string;
	trendData?: any[];
	hasContinuousData?: boolean;
	reports: {
		date: string;
		type: string;
		finding: string;
		file: string;
	}[];
}

export interface RetinopathyHistory {
	diabetesDuration: string;
	controlStatus: string;
	decreasedVision: boolean;
	floaters: boolean;
	previousInjection: boolean;
	eyeTreatmentLaser: boolean;
	cataractSurgery: boolean;
}

export interface RetinopathyEvaluation {
	visualAcuityRight: string;
	visualAcuityLeft: string;
	pupilReactionRight: string;
	pupilReactionLeft: string;
	irisDetailsRight: string;
	irisDetailsLeft: string;
	neoVascularisationRight: boolean;
	neoVascularisationLeft: boolean;
	intraocularPressureRight: string;
	intraocularPressureLeft: string;
	fundusFindingsRight: string;
	fundusFindingsLeft: string;
	additionalNotes: string;
}

export interface RetinopathyManagement {
	diabetesControl: string;
	followUp: string;
	intravitreal: boolean;
	prpLaser: boolean;
	vitrectomy: boolean;
	eyeDrops: string[];
	personalNotes: string;
}

export interface NeuropathyHistory {
	diabetesDuration: string;
	previousAmputation: boolean;
	diabeticFootSurgery: boolean;
	positiveSymptoms: boolean;
	positiveLocation: string;
	negativeSymptoms: boolean;
	negativeLocation: string;
	carpalTunnel: boolean;
	carpalSide: string;
}

export interface NeuropathyExamination {
	muscleRightUpperProximal: string;
	muscleRightUpperDistal: string;
	muscleLeftUpperProximal: string;
	muscleLeftUpperDistal: string;
	muscleRightLowerProximal: string;
	muscleRightLowerDistal: string;
	muscleLeftLowerProximal: string;
	muscleLeftLowerDistal: string;
	musclePersonalNotes: string;
	reflexBicepsRight: string;
	reflexTricepsRight: string;
	reflexSupinatorRight: string;
	reflexKneeRight: string;
	reflexAnkleRight: string;
	reflexPlantarRight: string;
	reflexBicepsLeft: string;
	reflexTricepsLeft: string;
	reflexSupinatorLeft: string;
	reflexKneeLeft: string;
	reflexAnkleLeft: string;
	reflexPlantarLeft: string;
	sensoryPersonalNotes: string;
	rhombergTest: string;
	gait: string;
}

export interface CVAHistory {
	diabetesDuration: string;
	hypertensionDuration: string;
	ihdHistory: boolean;
	tiaHistory: boolean;
	strokeHistory: boolean;
	recurrentStroke: boolean;
	currentSymptoms: string;
	befastSymptoms: boolean;
	befastNotes: string;
}

export interface CVAExamination {
	nihssScore: number;
	higherMentalFunction: string;
	cranialNerves: string;
	motor: string;
	sensory: string;
	language: string;
	cerebellum: string;
	personalNotes: string;
}

export interface CVAManagement {
	treatmentType: string;
	strokeUnit: boolean;
	medications: string[];
}

export interface NephrologyData {
	diabetesDuration: string;
	hypertensionDuration: string;
	familyHistory: string;
	symptoms: {
		edema: boolean;
		nocturia: boolean;
		foamyUrine: boolean;
	};
	ckdStage: string;
	albuminuriaCategory: string;
	riskCategory: string;
	clinicalNotes: string;
	selectedTest: string;
	orderedTests: string[];
	selectedReferral: string;
	referrals: string[];
	actionPlan: string;
	showOtherOrgans: boolean;
}

export interface MentalHealthData {
	date: string;
	phq9: number;
	gad7: number;
	stressLevel: number;
}

export interface AssessmentProps {
	initialSubTab?: string;
	onNavigate?: (tab: string) => void;
}

export type ViewMode = {
	[key: string]: "chart" | "table";
};