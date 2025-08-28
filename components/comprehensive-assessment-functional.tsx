"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
	Eye,
	Heart,
	Brain,
	Activity,
	Zap,
	Footprints,
	Stethoscope,
	LeafIcon as Liver,
	BarChart3,
	Table,
	Plus,
	Users,
	Palette,
	Save,
	TestTube,
	UserCheck,
	ChevronDown,
	ChevronUp,
	ChevronRight,
	BeanIcon,
	Calculator,
	AlertTriangle,
	ArrowRight,
	Pill,
	X,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	ReferenceLine,
	ReferenceArea,
} from "recharts";

interface AssessmentItem {
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

export default function ComprehensiveAssessmentFunctional({
	initialSubTab,
	onNavigate,
}: {
	initialSubTab?: string;
	onNavigate?: (tab: string) => void;
}) {
	const [activeTab, setActiveTab] = useState(
		initialSubTab || "complications"
	);
	const [viewMode, setViewMode] = useState({
		nephropathy: "chart",
		mentalHealth: "chart",
	});

	// Update active tab when initialSubTab changes
	useEffect(() => {
		if (initialSubTab) {
			setActiveTab(initialSubTab);
		}
	}, [initialSubTab]);

	const [selectedAssessment, setSelectedAssessment] = useState("");
	const [isNephrologyView, setIsNephrologyView] = useState(false);
	const [expandedAssessments, setExpandedAssessments] = useState<
		Record<string, boolean>
	>({});
	const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(
		{}
	);
	const [actionPlans, setActionPlans] = useState<Record<string, string>>({});
	const [drawingData, setDrawingData] = useState<Record<string, any>>({});
	const [customFollowUp, setCustomFollowUp] = useState<
		Record<string, string>
	>({});

	// FIB-4 Calculation State
	const [inputs, setInputs] = useState({
		age: "",
		ast: "",
		alt: "",
		plateletCount: "",
	});

	const [result, setResult] = useState<number | null>(null);
	const [interpretation, setInterpretation] = useState<
		"Low Risk" | "Intermediate Risk" | "High Risk" | ""
	>("");

	const handleChange = (field: keyof typeof inputs, value: string) => {
		// allow only digits and optional decimal
		if (/^\d*(\.\d*)?$/.test(value)) {
			setInputs((prev) => ({ ...prev, [field]: value }));
		}
	};

	const calculateFib4 = () => {
		const ageNum = parseFloat(inputs.age);
		const astNum = parseFloat(inputs.ast);
		const altNum = parseFloat(inputs.alt);
		const pltNum = parseFloat(inputs.plateletCount);

		if (
			isNaN(ageNum) ||
			isNaN(astNum) ||
			isNaN(altNum) ||
			isNaN(pltNum) ||
			ageNum <= 0 ||
			astNum <= 0 ||
			altNum <= 0 ||
			pltNum <= 0
		) {
			setResult(null);
			setInterpretation("");
			return;
		}

		const score = (ageNum * astNum) / (pltNum * Math.sqrt(altNum));
		setResult(score);
		if (score > 3.25) setInterpretation("High Risk");
		else if (score >= 1.45) setInterpretation("Intermediate Risk");
		else setInterpretation("Low Risk");
	};

	// map interpretation to color classes
	const colorMap: Record<string, string> = {
		"Low Risk": "text-green-700 bg-green-100",
		"Intermediate Risk": "text-yellow-800 bg-yellow-100",
		"High Risk": "text-red-700 bg-red-100",
		"": "text-gray-500 bg-gray-50",
	};

	// Drawing canvas refs
	const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
	const [isDrawing, setIsDrawing] = useState(false);

	// Mental Health Data
	const [newPhq9, setNewPhq9] = useState("");
	const [newGad7, setNewGad7] = useState("");
	const [newStress, setNewStress] = useState("");
	const [mentalHealthData, setMentalHealthData] = useState([
		{ date: "Jan 2024", phq9: 3, gad7: 2, stressLevel: 3 },
		{ date: "Apr 2024", phq9: 2, gad7: 3, stressLevel: 4 },
		{ date: "Jul 2024", phq9: 3, gad7: 3, stressLevel: 3 },
	]);

	// Orders and Referrals State
	const [pendingOrders, setPendingOrders] = useState<string[]>([]);
	const [pendingReferrals, setPendingReferrals] = useState<string[]>([]);
	// Local selection state for Order Tests
	const [liverTests, setLiverTests] = useState<Record<string, boolean>>({});
	const [cvaTests, setCvaTests] = useState<Record<string, boolean>>({});

	const liverTestLabels: Record<string, string> = {
		lft: "Liver Function Test (LFT)",
		"cbc-platelet": "CBC/Platelet Count",
		"ultrasound-yearly": "Ultrasound (Yearly)",
		fibroscan: "FibroScan",
		"hba1c-liver": "HbA1c",
		"lipid-profile-liver": "Lipid Profile",
	};
	const cvaTestLabels: Record<string, string> = {
		"carotid-doppler": "Carotid/Vertebral Doppler",
		"transcranial-doppler": "Transcranial Doppler",
		"mri-brain": "MRI Brain",
		"ct-brain": "CT Brain",
		"ecg-stroke": "ECG",
		"echo-stroke": "Echocardiogram",
		"lipid-profile-stroke": "Lipid Profile",
		holter: "Holter Monitoring",
	};

	const addSelectedTests = (
		selections: Record<string, boolean>,
		labels: Record<string, string>
	) => {
		const toAdd = Object.entries(selections)
			.filter(([, checked]) => checked)
			.map(([id]) => labels[id] || id)
			.filter((label) => label);
		if (toAdd.length) {
			setPendingOrders((prev) => [...prev, ...toAdd]);
		}
	};

	// Retinopathy State
	const [retinopathyHistory, setRetinopathyHistory] = useState({
		diabetesDuration: "",
		controlStatus: "",
		decreasedVision: false,
		floaters: false,
		previousInjection: false,
		eyeTreatmentLaser: false,
		cataractSurgery: false,
	});

	// Neuropathy State (from MD requirements)
	const [neuropathyHistory, setNeuropathyHistory] = useState({
		diabetesDuration: "",
		previousAmputation: false,
		diabeticFootSurgery: false,
		positiveSymptoms: false,
		positiveLocation: "",
		negativeSymptoms: false,
		negativeLocation: "",
		carpalTunnel: false,
		carpalSide: "",
	});

	const [neuropathyExamination, setNeuropathyExamination] = useState({
		muscleRightUpperProximal: "",
		muscleRightUpperDistal: "",
		muscleLeftUpperProximal: "",
		muscleLeftUpperDistal: "",
		muscleRightLowerProximal: "",
		muscleRightLowerDistal: "",
		muscleLeftLowerProximal: "",
		muscleLeftLowerDistal: "",
		musclePersonalNotes: "",
		reflexBicepsRight: "",
		reflexTricepsRight: "",
		reflexSupinatorRight: "",
		reflexKneeRight: "",
		reflexAnkleRight: "",
		reflexPlantarRight: "",
		reflexBicepsLeft: "",
		reflexTricepsLeft: "",
		reflexSupinatorLeft: "",
		reflexKneeLeft: "",
		reflexAnkleLeft: "",
		reflexPlantarLeft: "",
		sensoryPersonalNotes: "",
		rhombergTest: "",
		gait: "",
	});

	const [neuropathyTests, setNeuropathyTests] = useState<string[]>([]);
	const [neuropathyReferrals, setNeuropathyReferrals] = useState<string[]>(
		[]
	);
	const [neuropathyMedications, setNeuropathyMedications] = useState([]);

	// CVA/Stroke State (from MD requirements)
	const [cvaHistory, setCvaHistory] = useState({
		diabetesDuration: "",
		hypertensionDuration: "",
		ihdHistory: false,
		tiaHistory: false,
		strokeHistory: false,
		recurrentStroke: false,
		currentSymptoms: "",
		befastSymptoms: false,
		befastNotes: "",
	});

	const [cvaExamination, setCvaExamination] = useState({
		nihssScore: 0,
		higherMentalFunction: "",
		cranialNerves: "",
		motor: "",
		sensory: "",
		language: "",
		cerebellum: "",
		personalNotes: "",
	});

	const [cvaManagement, setCvaManagement] = useState({
		treatmentType: "",
		strokeUnit: false,
		medications: [],
	});

	const [nephrologyData, setNephrologyData] = useState({
		diabetesDuration: "",
		hypertensionDuration: "",
		familyHistory: "",
		symptoms: {
			edema: false,
			nocturia: false,
			foamyUrine: false,
		},
		ckdStage: "",
		albuminuriaCategory: "",
		riskCategory: "low",
		clinicalNotes: "",
		selectedTest: "",
		orderedTests: [] as string[],
		selectedReferral: "",
		referrals: [] as string[],
		actionPlan: "",
		showOtherOrgans: false,
		currentEgfr: "",
		currentAcr: "",
		currentCreatinine: "",
	});

	// Auto-save nephrology data to other components as per V3 requirements
	useEffect(() => {
		// Save nephrology data to overview, medications, and advice pages
		const saveNephrologyDataToOverview = () => {
			// This would typically save to a global state or localStorage
			// For now, we'll use localStorage to persist the data
			localStorage.setItem(
				"nephrologyData",
				JSON.stringify(nephrologyData)
			);

			// Trigger overview page update
			const overviewUpdateEvent = new CustomEvent(
				"nephrologyDataUpdate",
				{
					detail: nephrologyData,
				}
			);
			window.dispatchEvent(overviewUpdateEvent);
		};

		// Only save if there's actual data
		if (
			nephrologyData.diabetesDuration ||
			nephrologyData.clinicalNotes ||
			nephrologyData.orderedTests.length > 0 ||
			nephrologyData.referrals.length > 0
		) {
			saveNephrologyDataToOverview();
		}
	}, [nephrologyData]);

	const [retinopathyEvaluation, setRetinopathyEvaluation] = useState({
		visualAcuityRight: "",
		visualAcuityLeft: "",
		pupilReactionRight: "",
		pupilReactionLeft: "",
		irisDetailsRight: "",
		irisDetailsLeft: "",
		neoVascularisationRight: false,
		neoVascularisationLeft: false,
		intraocularPressureRight: "",
		intraocularPressureLeft: "",
		fundusFindingsRight: "",
		fundusFindingsLeft: "",
		additionalNotes: "",
	});

	const [retinopathyManagement, setRetinopathyManagement] = useState({
		diabetesControl: "",
		followUp: "",
		intravitreal: false,
		prpLaser: false,
		vitrectomy: false,
		eyeDrops: [],
		personalNotes: "",
	});

	const assessmentItems: AssessmentItem[] = [
		{
			name: "Retinopathy",
			icon: Eye,
			status: "Assessed",
			actualDiagnosis:
				"Moderate NPDR with microaneurysms and hard exudates",
			lastAssessed: "15/10/2023",
			nextDue: "15/04/2024",
			riskLevel: "moderate",
			investigations: [
				"Fundus Photography",
				"OCT",
				"Fluorescein Angiography",
			],
			consultations: ["Ophthalmology"],
			actionOptions: [
				"continue same",
				"optimize medications",
				"add medications",
				"refer to specialist",
				"order investigations",
			],
			selectedAction: "continue same",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: false,
			followUpCustom: "6 months",
			reports: [
				{
					date: "15/10/2023",
					type: "Fundus Photography",
					finding: "Moderate NPDR with microaneurysms",
					file: "fundus_oct2023.pdf",
				},
			],
		},
		{
			name: "Nephropathy",
			icon: Activity,
			status: "Assessed",
			actualDiagnosis:
				"Normal kidney function - eGFR 85 ml/min/1.73m², ACR 15 mg/g",
			lastAssessed: "01/07/2024",
			nextDue: "01/07/2025",
			riskLevel: "low",
			investigations: [
				"Serum Creatinine",
				"Urine Routine",
				"Urine ACR",
				"Urine PCR",
				"Potassium",
				"Sodium",
				"Chloride",
				"Ultrasound Abdomen",
				"Calcium",
				"Phosphorus",
				"Uric Acid",
				"Vitamin D",
				"PTH",
				"FBS",
				"PPBS",
				"HbA1c",
			],
			consultations: [
				"Ophthalmologist",
				"Neurologist",
				"Cardiologist",
				"Nutritionist",
				"Others",
			],
			actionOptions: [
				"continue same",
				"optimize medications",
				"order investigations",
			],
			selectedAction: "continue same",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: true,
			followUpCustom: "12 months",
			trendData: [
				{ date: "2022", creatinine: 0.9, potassium: 4.2, acr: 12 },
				{ date: "2023", creatinine: 1.0, potassium: 4.1, acr: 14 },
				{ date: "2024", creatinine: 1.1, potassium: 4.3, acr: 15 },
			],
			reports: [
				{
					date: "01/07/2024",
					type: "Lab Report",
					finding: "Normal kidney function",
					file: "kidney_jul2024.pdf",
				},
			],
		},
		{
			name: "Neuropathy",
			icon: Zap,
			status: "Assessed",
			actualDiagnosis:
				"Asymptomatic - Normal monofilament test, intact vibration sense",
			lastAssessed: "15/10/2023",
			nextDue: "15/10/2024",
			riskLevel: "low",
			investigations: [
				"Monofilament Test",
				"Vibration Sense",
				"NCV Study",
			],
			consultations: ["Neurology", "Podiatry"],
			actionOptions: [
				"continue same",
				"optimize medications",
				"add medications",
				"refer to specialist",
				"order investigations",
			],
			selectedAction: "continue same",
			personalNotes: "",
			hasDrawing: true,
			hasContinuousData: false,
			followUpCustom: "12 months",
			reports: [],
		},
		{
			name: "IHD (Ischemic Heart Disease)",
			icon: Heart,
			status: "Assessed",
			actualDiagnosis:
				"Mild ECG changes - T wave flattening in V5-V6, ECHO EF 60%",
			lastAssessed: "15/10/2023",
			nextDue: "15/04/2024",
			riskLevel: "moderate",
			investigations: [
				"ECG",
				"ECHO",
				"Stress Test",
				"Coronary Angiography",
			],
			consultations: ["Cardiology"],
			actionOptions: [
				"continue same",
				"optimize medications",
				"add medications",
				"refer to specialist",
				"order investigations",
			],
			selectedAction: "optimize medications",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: true,
			followUpCustom: "6 months",
			trendData: [
				{ date: "2022", ejectionFraction: 62, troponin: 0.01 },
				{ date: "2023", ejectionFraction: 60, troponin: 0.02 },
			],
			reports: [
				{
					date: "15/10/2023",
					type: "ECG",
					finding: "T wave flattening V5-V6",
					file: "ecg_oct2023.pdf",
				},
				{
					date: "15/10/2023",
					type: "ECHO",
					finding: "EF 60%, mild LV dysfunction",
					file: "echo_oct2023.pdf",
				},
			],
		},
		{
			name: "CVA/Stroke",
			icon: Brain,
			status: "Pending Assessment",
			actualDiagnosis: "Status unknown - No previous assessment done",
			lastAssessed: "Never",
			nextDue: "Due now",
			riskLevel: "unknown",
			investigations: ["Carotid Doppler", "MRI Brain", "CT Angiography"],
			consultations: ["Neurology", "Vascular Surgery"],
			actionOptions: [
				"order investigations",
				"refer to specialist",
				"continue same",
			],
			selectedAction: "order investigations",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: false,
			followUpCustom: "Based on findings",
			trendData: [],
			reports: [],
		},
		{
			name: "PVD (Peripheral Vascular Disease)",
			icon: Stethoscope,
			status: "Pending Assessment",
			actualDiagnosis: "Status unknown - No previous assessment done",
			lastAssessed: "Never",
			nextDue: "Due now",
			riskLevel: "unknown",
			investigations: ["ABI", "Doppler Studies", "CT Angiography"],
			consultations: ["Vascular Surgery"],
			actionOptions: [
				"order investigations",
				"refer to specialist",
				"continue same",
			],
			selectedAction: "order investigations",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: false,
			followUpCustom: "Based on findings",
			trendData: [],
			reports: [],
		},
		{
			name: "MASLD (Metabolic Dysfunction-Associated Steatotic Liver Disease)",
			icon: Liver,
			status: "Pending Assessment",
			actualDiagnosis: "Status unknown - No previous assessment done",
			lastAssessed: "Never",
			nextDue: "Due now",
			riskLevel: "unknown",
			investigations: [
				"Liver Function Tests",
				"Ultrasound Abdomen",
				"FibroScan",
				"FIB-4 Score",
			],
			consultations: ["Hepatology"],
			actionOptions: [
				"order investigations",
				"refer to specialist",
				"continue same",
			],
			selectedAction: "order investigations",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: false,
			followUpCustom: "Based on findings",
			trendData: [],
			reports: [],
		},
		{
			name: "Diabetic Foot",
			icon: Footprints,
			status: "Assessed",
			actualDiagnosis:
				"Low risk - Intact sensation, good circulation, no deformities",
			lastAssessed: "15/10/2023",
			nextDue: "15/10/2024",
			riskLevel: "low",
			investigations: [
				"Foot Examination",
				"Doppler Studies",
				"X-ray Foot",
			],
			consultations: ["Podiatry", "Vascular Surgery"],
			actionOptions: [
				"continue same",
				"refer to specialist",
				"order investigations",
			],
			selectedAction: "continue same",
			personalNotes: "",
			hasDrawing: false,
			hasContinuousData: false,
			followUpCustom: "12 months",
			trendData: [],
			reports: [],
		},
	];

	// Drawing functions
	const startDrawing = (
		e: React.MouseEvent<HTMLCanvasElement>,
		assessmentName: string
	) => {
		setIsDrawing(true);
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
				ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
			}
		}
	};

	const draw = (
		e: React.MouseEvent<HTMLCanvasElement>,
		assessmentName: string
	) => {
		if (!isDrawing) return;
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
				ctx.stroke();
			}
		}
	};

	const stopDrawing = () => {
		setIsDrawing(false);
	};

	const clearDrawing = (assessmentName: string) => {
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	};

	const getRiskColor = (risk: string) => {
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Assessed":
				return "text-green-600 bg-green-50";
			case "Pending Assessment":
				return "text-orange-600 bg-orange-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	const handleNotesChange = (assessmentName: string, notes: string) => {
		setPersonalNotes((prev) => ({
			...prev,
			[assessmentName]: notes,
		}));
	};

	const handleActionChange = (assessmentName: string, action: string) => {
		setActionPlans((prev) => ({
			...prev,
			[assessmentName]: action,
		}));
	};

	const handleFollowUpChange = (assessmentName: string, followUp: string) => {
		setCustomFollowUp((prev) => ({
			...prev,
			[assessmentName]: followUp,
		}));
	};

	const addToOrders = (investigation: string) => {
		setPendingOrders((prev) => [...prev, investigation]);
	};

	const addToReferrals = (consultation: string) => {
		setPendingReferrals((prev) => [...prev, consultation]);
	};

	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};

	const getScoreColor = (score: number, maxScore: number) => {
		const percentage = (score / maxScore) * 100;
		if (percentage <= 25) return "#22c55e";
		if (percentage <= 50) return "#eab308";
		return "#ef4444";
	};

	const addMentalHealthScore = () => {
		if (newPhq9 && newGad7 && newStress) {
			const newEntry = {
				date: new Date().toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				phq9: Number.parseInt(newPhq9),
				gad7: Number.parseInt(newGad7),
				stressLevel: Number.parseInt(newStress),
			};
			setMentalHealthData((prev) => [...prev, newEntry]);
			setNewPhq9("");
			setNewGad7("");
			setNewStress("");
		}
	};

	const toggleAssessmentExpansion = (assessmentName: string) => {
		setExpandedAssessments((prev) => ({
			...prev,
			[assessmentName]: !prev[assessmentName],
		}));
	};

	const renderMentalHealthView = () => {
		const isChart = viewMode.mentalHealth === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Mental Health Trends
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("mentalHealth")}
						aria-label="Toggle mental health view">
						{isChart ? (
							<Table className="h-4 w-4" />
						) : (
							<BarChart3 className="h-4 w-4" />
						)}
					</Toggle>
				</div>

				{/* Renal Risk Heatmap (KDIGO) */}
				<div>
					<h3 className="text-lg font-semibold mb-3 text-blue-900">
						Renal Risk Heatmap
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
						<div>
							<Label className="text-sm">
								eGFR (ml/min/1.73m²)
							</Label>
							<Input
								placeholder="e.g. 85"
								value={nephrologyData.currentEgfr}
								onChange={(e) =>
									setNephrologyData((prev) => ({
										...prev,
										currentEgfr: e.target.value,
									}))
								}
							/>
						</div>
						<div>
							<Label className="text-sm">Urine ACR (mg/g)</Label>
							<Input
								placeholder="e.g. 30"
								value={nephrologyData.currentAcr}
								onChange={(e) =>
									setNephrologyData((prev) => ({
										...prev,
										currentAcr: e.target.value,
									}))
								}
							/>
						</div>
						<div>
							<Label className="text-sm">
								Serum Creatinine (mg/dL)
							</Label>
							<Input
								placeholder="e.g. 1.1"
								value={nephrologyData.currentCreatinine}
								onChange={(e) =>
									setNephrologyData((prev) => ({
										...prev,
										currentCreatinine: e.target.value,
									}))
								}
							/>
						</div>
					</div>

					{(() => {
						const egfr = parseFloat(
							nephrologyData.currentEgfr || "-1"
						);
						const acr = parseFloat(
							nephrologyData.currentAcr || "-1"
						);
						const gIdx =
							egfr >= 90
								? 0
								: egfr >= 60
								? 1
								: egfr >= 45
								? 2
								: egfr >= 30
								? 3
								: egfr >= 15
								? 4
								: egfr >= 0
								? 5
								: -1;
						const aIdx =
							acr >= 0 && acr < 30
								? 0
								: acr <= 300
								? 1
								: acr > 300
								? 2
								: -1;
						const colors = [
							["#22c55e", "#eab308", "#ef4444"],
							["#84cc16", "#f59e0b", "#ef4444"],
							["#f59e0b", "#f97316", "#dc2626"],
							["#f97316", "#fb923c", "#dc2626"],
							["#ef4444", "#dc2626", "#b91c1c"],
							["#b91c1c", "#991b1b", "#7f1d1d"],
						];
						return (
							<div className="overflow-x-auto">
								<table className="w-full text-xs border">
									<thead>
										<tr>
											<th className="p-2 border bg-gray-50">
												eGFR↓ / ACR→
											</th>
											<th className="p-2 border">
												A1
												<div className="text-[10px] text-gray-500">
													&lt;30
												</div>
											</th>
											<th className="p-2 border">
												A2
												<div className="text-[10px] text-gray-500">
													30–300
												</div>
											</th>
											<th className="p-2 border">
												A3
												<div className="text-[10px] text-gray-500">
													&gt;300
												</div>
											</th>
										</tr>
									</thead>
									<tbody>
										{[
											"G1 ≥90",
											"G2 60–89",
											"G3a 45–59",
											"G3b 30–44",
											"G4 15–29",
											"G5 <15",
										].map((g, gi) => (
											<tr key={g}>
												<td className="p-2 border bg-gray-50">
													{g}
												</td>
												{[0, 1, 2].map((ai) => (
													<td
														key={ai}
														className="p-2 border text-center">
														<div
															style={{
																backgroundColor:
																	colors[gi][
																		ai
																	],
															}}
															className={`w-16 h-6 mx-auto rounded ${
																gi === gIdx &&
																ai === aIdx
																	? "ring-2 ring-black"
																	: ""
															}`}></div>
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
								<div className="mt-2 text-xs text-gray-600">
									Creatinine:{" "}
									{nephrologyData.currentCreatinine || "-"}{" "}
									mg/dL
								</div>
							</div>
						);
					})()}
				</div>

				{isChart ? (
					<>
						<ResponsiveContainer
							width="100%"
							height={300}>
							<LineChart data={mentalHealthData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip
									formatter={(value, name) => [
										`${value} ${
											name === "phq9"
												? "(PHQ-9)"
												: name === "gad7"
												? "(GAD-7)"
												: "(Stress)"
										}`,
										name === "phq9"
											? "Depression Score"
											: name === "gad7"
											? "Anxiety Score"
											: "Stress Level",
									]}
								/>
								<ReferenceArea
									y1={0}
									y2={4}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={5}
									y2={9}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={10}
									y2={27}
									fill="#ef4444"
									fillOpacity={0.1}
								/>
								<ReferenceLine
									y={4}
									stroke="#22c55e"
									strokeDasharray="3 3"
									label={{
										value: "Normal: ≤4",
										position: "insideTopLeft",
									}}
								/>
								<ReferenceLine
									y={9}
									stroke="#eab308"
									strokeDasharray="3 3"
									label={{
										value: "Mild: 5-9",
										position: "insideTopLeft",
									}}
								/>
								<Line
									type="monotone"
									dataKey="phq9"
									stroke="#8884d8"
									name="PHQ-9 Score"
									dot={(props) => {
										const { cx, cy, payload } = props;
										const color = getScoreColor(
											payload.phq9,
											27
										);
										return (
											<circle
												key={payload.date}
												cx={cx}
												cy={cy}
												r={4}
												fill={color}
												stroke={color}
												strokeWidth={2}
											/>
										);
									}}
								/>
								<Line
									type="monotone"
									dataKey="gad7"
									stroke="#82ca9d"
									name="GAD-7 Score"
									dot={(props) => {
										const { cx, cy, payload } = props;
										const color = getScoreColor(
											payload.gad7,
											21
										);
										return (
											<circle
												key={payload.date}
												cx={cx}
												cy={cy}
												r={4}
												fill={color}
												stroke={color}
												strokeWidth={2}
											/>
										);
									}}
								/>
								<Line
									type="monotone"
									dataKey="stressLevel"
									stroke="#ffc658"
									name="Stress Level"
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex justify-center space-x-6 text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-green-200 rounded"></div>
								<span>Normal (PHQ-9: ≤4, GAD-7: ≤4)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-yellow-200 rounded"></div>
								<span>Mild (PHQ-9: 5-9, GAD-7: 5-9)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-red-200 rounded"></div>
								<span>Severe (PHQ-9: ≥10, GAD-7: ≥10)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-3 text-left">Date</th>
									<th className="p-3 text-left">PHQ-9</th>
									<th className="p-3 text-left">GAD-7</th>
									<th className="p-3 text-left">Stress</th>
									<th className="p-3 text-left">
										Thresholds
									</th>
									<th className="p-3 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								{mentalHealthData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-3">{item.date}</td>
										<td className="p-3">
											<span
												style={{
													color: getScoreColor(
														item.phq9,
														27
													),
												}}>
												{item.phq9}
											</span>
										</td>
										<td className="p-3">
											<span
												style={{
													color: getScoreColor(
														item.gad7,
														21
													),
												}}>
												{item.gad7}
											</span>
										</td>
										<td className="p-3">
											{item.stressLevel}/10
										</td>
										<td className="p-3 text-xs text-gray-600">
											PHQ-9: Normal ≤4, Mild 5-9, Severe
											≥10
											<br />
											GAD-7: Normal ≤4, Mild 5-9, Severe
											≥10
										</td>
										<td className="p-3">
											<Badge
												variant={
													item.phq9 <= 4 &&
													item.gad7 <= 4
														? "default"
														: "destructive"
												}>
												{item.phq9 <= 4 &&
												item.gad7 <= 4
													? "Normal"
													: "Elevated"}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		);
	};

	const renderNephrologyFocusedView = () => {
		const nephrologyAssessment = assessmentItems.find(
			(item) => item.name === "Nephropathy"
		);
		if (!nephrologyAssessment) return null;

		return (
			<div className="space-y-6">
				{/* Nephrology Main Assessment */}
				<Card className="bg-white shadow-lg border-l-4 border-l-blue-600">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<BeanIcon className="h-6 w-6 text-blue-600" />
								<span className="text-blue-900">
									Nephrology Assessment
								</span>
							</div>
							<Badge className="bg-green-100 text-green-800">
								{nephrologyAssessment.status}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Current Status */}
						<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
							<Label className="text-sm font-medium text-blue-900">
								Current Status:
							</Label>
							<p className="text-sm mt-1 text-blue-800">
								{nephrologyAssessment.actualDiagnosis}
							</p>
							<div className="flex justify-between text-xs text-blue-600 mt-2">
								<span>
									Last: {nephrologyAssessment.lastAssessed}
								</span>
								<span>
									Next: {nephrologyAssessment.nextDue}
								</span>
							</div>
						</div>

						{/* Order Tests Dropdown - Updated */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label className="text-sm font-medium">
									Order Tests
								</Label>
								<Select
									onValueChange={(value) =>
										addToOrders(value)
									}>
									<SelectTrigger className="mt-2">
										<SelectValue placeholder="Select investigation" />
									</SelectTrigger>
									<SelectContent>
										{nephrologyAssessment.investigations.map(
											(test) => (
												<SelectItem
													key={test}
													value={test}>
													{test}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							{/* Referrals Dropdown - Updated */}
							<div>
								<Label className="text-sm font-medium">
									Referrals
								</Label>
								<Select
									onValueChange={(value) =>
										addToReferrals(value)
									}>
									<SelectTrigger className="mt-2">
										<SelectValue placeholder="Select referral" />
									</SelectTrigger>
									<SelectContent>
										{nephrologyAssessment.consultations.map(
											(consultation) => (
												<SelectItem
													key={consultation}
													value={consultation}>
													{consultation}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Action Plan - Updated */}
						<div>
							<Label className="text-sm font-medium">
								Action Plan
							</Label>
							<Select
								value={
									actionPlans[nephrologyAssessment.name] ||
									nephrologyAssessment.selectedAction
								}
								onValueChange={(value) => {
									if (value === "optimize medications") {
										if (onNavigate)
											onNavigate("medications");
										else if (
											typeof window !== "undefined"
										) {
											const params = new URLSearchParams(
												window.location.search
											);
											params.set("tab", "medications");
											window.location.search = `?${params}`;
										}
									}
									handleActionChange(
										nephrologyAssessment.name,
										value
									);
								}}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									{nephrologyAssessment.actionOptions.map(
										(option) => (
											<SelectItem
												key={option}
												value={option}>
												{option
													.charAt(0)
													.toUpperCase() +
													option.slice(1)}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</div>

						{/* Renal Risk Heatmap (KDIGO) */}
						<div>
							<h3 className="text-lg font-semibold mb-3 text-blue-900">
								Renal Risk Heatmap
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
								<div>
									<Label className="text-sm">
										eGFR (ml/min/1.73m²)
									</Label>
									<Input
										placeholder="e.g. 85"
										value={nephrologyData.currentEgfr}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												currentEgfr: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<Label className="text-sm">
										Urine ACR (mg/g)
									</Label>
									<Input
										placeholder="e.g. 30"
										value={nephrologyData.currentAcr}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												currentAcr: e.target.value,
											}))
										}
									/>
								</div>
								<div>
									<Label className="text-sm">
										Serum Creatinine (mg/dL)
									</Label>
									<Input
										placeholder="e.g. 1.1"
										value={nephrologyData.currentCreatinine}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												currentCreatinine:
													e.target.value,
											}))
										}
									/>
								</div>
							</div>

							{(() => {
								const egfr = parseFloat(
									nephrologyData.currentEgfr || "-1"
								);
								const acr = parseFloat(
									nephrologyData.currentAcr || "-1"
								);
								const gIdx =
									egfr >= 90
										? 0
										: egfr >= 60
										? 1
										: egfr >= 45
										? 2
										: egfr >= 30
										? 3
										: egfr >= 15
										? 4
										: egfr >= 0
										? 5
										: -1;
								const aIdx =
									acr >= 0 && acr < 30
										? 0
										: acr <= 300
										? 1
										: acr > 300
										? 2
										: -1;
								const colors = [
									["#22c55e", "#eab308", "#ef4444"],
									["#84cc16", "#f59e0b", "#ef4444"],
									["#f59e0b", "#f97316", "#dc2626"],
									["#f97316", "#fb923c", "#dc2626"],
									["#ef4444", "#dc2626", "#b91c1c"],
									["#b91c1c", "#991b1b", "#7f1d1d"],
								];
								return (
									<div className="overflow-x-auto">
										<table className="w-full text-xs border">
											<thead>
												<tr>
													<th className="p-2 border bg-gray-50">
														eGFR↓ / ACR→
													</th>
													<th className="p-2 border">
														A1
														<div className="text-[10px] text-gray-500">
															&lt;30
														</div>
													</th>
													<th className="p-2 border">
														A2
														<div className="text-[10px] text-gray-500">
															30–300
														</div>
													</th>
													<th className="p-2 border">
														A3
														<div className="text-[10px] text-gray-500">
															&gt;300
														</div>
													</th>
												</tr>
											</thead>
											<tbody>
												{[
													"G1 ≥90",
													"G2 60–89",
													"G3a 45–59",
													"G3b 30–44",
													"G4 15–29",
													"G5 <15",
												].map((g, gi) => (
													<tr key={g}>
														<td className="p-2 border bg-gray-50">
															{g}
														</td>
														{[0, 1, 2].map((ai) => (
															<td
																key={ai}
																className="p-2 border text-center">
																<div
																	style={{
																		backgroundColor:
																			colors[
																				gi
																			][
																				ai
																			],
																	}}
																	className={`w-16 h-6 mx-auto rounded ${
																		gi ===
																			gIdx &&
																		ai ===
																			aIdx
																			? "ring-2 ring-black"
																			: ""
																	}`}></div>
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
										<div className="mt-2 text-xs text-gray-600">
											Creatinine:{" "}
											{nephrologyData.currentCreatinine ||
												"-"}{" "}
											mg/dL
										</div>
									</div>
								);
							})()}
						</div>

						{/* Trend Analysis for Nephrology Specific Metrics */}
						{nephrologyAssessment.trendData &&
							nephrologyAssessment.trendData.length > 0 && (
								<div>
									<h3 className="text-lg font-semibold mb-3 text-blue-900">
										Trend Analysis
									</h3>
									<ResponsiveContainer
										width="100%"
										height={300}>
										<LineChart
											data={
												nephrologyAssessment.trendData
											}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis />
											<Tooltip />
											<Line
												type="monotone"
												dataKey="creatinine"
												stroke="#8884d8"
												name="Serum Creatinine"
												strokeWidth={3}
											/>
											<Line
												type="monotone"
												dataKey="potassium"
												stroke="#82ca9d"
												name="Potassium"
												strokeWidth={3}
											/>
											<Line
												type="monotone"
												dataKey="acr"
												stroke="#ffc658"
												name="Urine ACR"
												strokeWidth={3}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							)}

						{/* Personal Notes */}
						<div>
							<Label className="text-sm font-medium">
								Personal Notes
							</Label>
							<Textarea
								value={
									personalNotes[nephrologyAssessment.name] ||
									""
								}
								onChange={(e) =>
									handleNotesChange(
										nephrologyAssessment.name,
										e.target.value
									)
								}
								placeholder="Add any personal notes, referral comments, or special instructions..."
								className="mt-2"
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Other Target Organs - Collapsible */}
				<Card className="bg-white shadow-lg">
					<CardHeader className="pb-3">
						<CardTitle
							className="text-lg flex items-center justify-between cursor-pointer"
							onClick={() =>
								toggleAssessmentExpansion("otherOrgans")
							}>
							<span className="text-gray-700">
								Other Target Organ Assessments
							</span>
							{expandedAssessments["otherOrgans"] ? (
								<ChevronUp className="h-5 w-5" />
							) : (
								<ChevronDown className="h-5 w-5" />
							)}
						</CardTitle>
					</CardHeader>
					{expandedAssessments["otherOrgans"] && (
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{assessmentItems
									.filter(
										(item) => item.name !== "Nephropathy"
									)
									.map((item, index) => {
										const IconComponent = item.icon;
										return (
											<Card
												key={index}
												className="bg-gray-50 border border-gray-200">
												<CardHeader className="pb-2">
													<CardTitle className="text-sm flex items-center justify-between">
														<div className="flex items-center space-x-2">
															<IconComponent className="h-4 w-4" />
															<span>
																{item.name}
															</span>
														</div>
														<Badge
															className={getStatusColor(
																item.status
															)}
															variant="outline">
															{item.status}
														</Badge>
													</CardTitle>
												</CardHeader>
												<CardContent className="space-y-2">
													<p className="text-xs text-gray-600">
														{item.actualDiagnosis}
													</p>
													<div className="text-xs text-gray-500">
														<span>
															Last:{" "}
															{item.lastAssessed}
														</span>
													</div>
												</CardContent>
											</Card>
										);
									})}
							</div>
						</CardContent>
					)}
				</Card>
			</div>
		);
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-2xl sm:text-3xl font-bold text-navy-600 mb-4 sm:mb-6">
				Comprehensive Assessment of Complications and Comorbidities
			</h1>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full">
				<TabsList className="mb-3 sm:mb-4 overflow-x-auto whitespace-nowrap w-full">
					<TabsTrigger value="complications">
						Complications Assessment
					</TabsTrigger>
					<TabsTrigger value="retinopathy">
						Retinopathy Specialist
					</TabsTrigger>
					<TabsTrigger value="nephropathy">Nephropathy</TabsTrigger>
					<TabsTrigger value="cardiac">
						Cardiac Assessment
					</TabsTrigger>
					<TabsTrigger value="neuro">CVA/Stroke</TabsTrigger>
					<TabsTrigger value="liver">Liver Assessment</TabsTrigger>
					<TabsTrigger value="foot">Diabetic Foot</TabsTrigger>
					<TabsTrigger value="pmr">PMR</TabsTrigger>
					<TabsTrigger value="mental-health">
						Mental Health Tracking
					</TabsTrigger>
					<TabsTrigger value="orders">
						Order Tests/Investigations
					</TabsTrigger>
					<TabsTrigger value="referrals">Referrals</TabsTrigger>
				</TabsList>

				<TabsContent value="complications">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{assessmentItems.map((item: AssessmentItem, index) => {
							const IconComponent = item.icon;
							return (
								<Card
									key={index}
									className="bg-white shadow-lg border-l-4 border-l-blue-500">
									<CardHeader className="pb-3">
										<CardTitle className="text-lg flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<IconComponent className="h-5 w-5" />
												<span>{item.name}</span>
											</div>
											<Badge
												className={getStatusColor(
													item.status
												)}>
												{item.status}
											</Badge>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Actual Diagnosis */}
										<div className="bg-gray-50 p-3 rounded-lg">
											<Label className="text-sm font-medium text-gray-700">
												Current Status:
											</Label>
											<p className="text-sm mt-1">
												{item.actualDiagnosis}
											</p>
											<div className="flex justify-between text-xs text-gray-500 mt-2">
												<span>
													Last: {item.lastAssessed}
												</span>
												<span>
													Next: {item.nextDue}
												</span>
											</div>
										</div>

										{/* Action Plan */}
										<div>
											<Label className="text-sm font-medium">
												Action Plan
											</Label>
											<Select
												value={
													actionPlans[item.name] ||
													item.selectedAction
												}
												onValueChange={(value) =>
													handleActionChange(
														item.name,
														value
													)
												}>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select action" />
												</SelectTrigger>
												<SelectContent>
													{item.actionOptions.map(
														(option) => (
															<SelectItem
																key={option}
																value={option}>
																{option
																	.charAt(0)
																	.toUpperCase() +
																	option.slice(
																		1
																	)}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
										</div>

										{/* Custom Follow-up */}
										<div>
											<Label className="text-sm font-medium">
												Custom Follow-up
											</Label>
											<Input
												value={
													customFollowUp[item.name] ||
													item.followUpCustom
												}
												onChange={(e) =>
													handleFollowUpChange(
														item.name,
														e.target.value
													)
												}
												placeholder="e.g., 6 months, based on findings"
												className="mt-2"
											/>
										</div>

										{/* Personal Notes */}
										<div>
											<Label className="text-sm font-medium">
												Personal Notes
											</Label>
											<Textarea
												value={
													personalNotes[item.name] ||
													""
												}
												onChange={(e) =>
													handleNotesChange(
														item.name,
														e.target.value
													)
												}
												placeholder="Add any personal notes, referral comments, or special instructions..."
												className="mt-2"
												rows={3}
											/>
										</div>

										{/* Drawing Feature for Neuropathy */}
										{item.hasDrawing && (
											<div>
												<Label className="text-sm font-medium flex items-center space-x-2">
													<Palette className="h-4 w-4" />
													<span>
														Neuropathy Assessment
														Drawing
													</span>
												</Label>
												<div className="mt-2 border rounded-lg p-4 bg-white">
													<div className="flex justify-between items-center mb-2">
														<span className="text-xs text-gray-600">
															Draw affected areas
															on the body diagram
														</span>
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																clearDrawing(
																	item.name
																)
															}>
															Clear
														</Button>
													</div>
													<canvas
														ref={(el) => {
															canvasRefs.current[
																item.name
															] = el;
														}}
														width={300}
														height={400}
														className="border rounded cursor-crosshair bg-gray-50"
														style={{
															backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Cpath d='M150 50 C130 50 120 70 120 90 L120 150 L100 180 L100 250 L120 280 L120 350 L140 380 L160 380 L180 350 L180 280 L200 250 L200 180 L180 150 L180 90 C180 70 170 50 150 50 Z' fill='none' stroke='%23ccc' strokeWidth='2'/%3E%3Ccircle cx='150' cy='70' r='20' fill='none' stroke='%23ccc' strokeWidth='2'/%3E%3C/svg%3E")`,
															backgroundSize:
																"contain",
															backgroundRepeat:
																"no-repeat",
															backgroundPosition:
																"center",
														}}
														onMouseDown={(e) =>
															startDrawing(
																e,
																item.name
															)
														}
														onMouseMove={(e) =>
															draw(e, item.name)
														}
														onMouseUp={stopDrawing}
														onMouseLeave={
															stopDrawing
														}
													/>
												</div>
											</div>
										)}

										{/* Quick Actions */}
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												className="flex-1 bg-transparent"
												onClick={() => {
													item.investigations.forEach(
														(inv) =>
															addToOrders(inv)
													);
												}}>
												<TestTube className="h-4 w-4 mr-1" />
												Order Tests
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="flex-1 bg-transparent"
												onClick={() => {
													item.consultations.forEach(
														(cons) =>
															addToReferrals(cons)
													);
												}}>
												<UserCheck className="h-4 w-4 mr-1" />
												Refer
											</Button>
										</div>

										{/* Detailed View Dialog */}
										<Dialog>
											<DialogTrigger asChild>
												<Button
													size="sm"
													variant="ghost"
													className="w-full text-xs mt-2">
													View Detailed Reports &
													Trends
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-4xl">
												<DialogHeader>
													<DialogTitle>
														{item.name} - Detailed
														Assessment
													</DialogTitle>
												</DialogHeader>
												<div className="space-y-6">
													{/* Trend Analysis - Only for continuous data */}
													{item.hasContinuousData &&
														item.trendData &&
														item.trendData.length >
															0 && (
															<div>
																<h3 className="text-lg font-semibold mb-3">
																	Trend
																	Analysis
																</h3>
																<ResponsiveContainer
																	width="100%"
																	height={
																		250
																	}>
																	<LineChart
																		data={
																			item.trendData
																		}>
																		<CartesianGrid strokeDasharray="3 3" />
																		<XAxis dataKey="date" />
																		<YAxis />
																		<Tooltip />
																		<Line
																			type="monotone"
																			dataKey={Object.keys(
																				item
																					.trendData[0]
																			).find(
																				(
																					key
																				) =>
																					key !==
																					"date"
																			)}
																			stroke="#8884d8"
																			strokeWidth={
																				3
																			}
																		/>
																	</LineChart>
																</ResponsiveContainer>
															</div>
														)}

													{/* Reports */}
													<div>
														<h3 className="text-lg font-semibold mb-3">
															Reports & Documents
														</h3>
														{item.reports.length >
														0 ? (
															<div className="space-y-2">
																{item.reports.map(
																	(
																		report,
																		idx
																	) => (
																		<div
																			key={
																				idx
																			}
																			className="flex items-center justify-between p-3 border rounded-lg">
																			<div>
																				<div className="font-medium">
																					{
																						report.type
																					}
																				</div>
																				<div className="text-sm text-gray-600">
																					{
																						report.date
																					}
																				</div>
																				<div className="text-sm">
																					{
																						report.finding
																					}
																				</div>
																			</div>
																			<Button
																				size="sm"
																				variant="outline">
																				View
																				Report
																			</Button>
																		</div>
																	)
																)}
															</div>
														) : (
															<p className="text-gray-500">
																No reports
																available
															</p>
														)}
													</div>

													{/* Add New Assessment */}
													<div>
														<h3 className="text-lg font-semibold mb-3">
															Add New Assessment
														</h3>
														<div className="grid grid-cols-2 gap-4">
															<div>
																<Label>
																	Assessment
																	Date
																</Label>
																<Input type="date" />
															</div>
															<div>
																<Label>
																	Status
																</Label>
																<Select>
																	<SelectTrigger>
																		<SelectValue placeholder="Select status" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="normal">
																			Normal
																		</SelectItem>
																		<SelectItem value="mild">
																			Mild
																		</SelectItem>
																		<SelectItem value="moderate">
																			Moderate
																		</SelectItem>
																		<SelectItem value="severe">
																			Severe
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
															<div className="col-span-2">
																<Label>
																	Findings
																</Label>
																<Textarea placeholder="Enter assessment findings..." />
															</div>
														</div>
														<Button className="mt-4">
															<Save className="h-4 w-4 mr-2" />
															Save Assessment
														</Button>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Summary Card */}
					<Card className="mt-6 bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Assessment Summary
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-4 gap-4 text-center">
								<div className="p-4 bg-red-50 rounded-lg border border-red-200">
									<div className="text-2xl font-bold text-red-600">
										0
									</div>
									<div className="text-sm text-red-600">
										High Risk
									</div>
								</div>
								<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
									<div className="text-2xl font-bold text-orange-600">
										2
									</div>
									<div className="text-sm text-orange-600">
										Moderate Risk
									</div>
								</div>
								<div className="p-4 bg-green-50 rounded-lg border border-green-200">
									<div className="text-2xl font-bold text-green-600">
										3
									</div>
									<div className="text-sm text-green-600">
										Low Risk
									</div>
								</div>
								<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
									<div className="text-2xl font-bold text-gray-600">
										3
									</div>
									<div className="text-sm text-gray-600">
										Pending Assessment
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="retinopathy">
					<div className="space-y-6">
						{/* Retinopathy History Section */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Eye className="h-6 w-6 mr-2" />
									Retinopathy History
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<div>
										<Label htmlFor="diabetes-duration">
											Duration of Diabetes
										</Label>
										<Input
											id="diabetes-duration"
											value={
												retinopathyHistory.diabetesDuration
											}
											onChange={(e) =>
												setRetinopathyHistory(
													(prev) => ({
														...prev,
														diabetesDuration:
															e.target.value,
													})
												)
											}
											placeholder="e.g., 10 years"
											className="mt-2"
										/>
									</div>
									<div>
										<Label htmlFor="control-status">
											Under Control (As per HbA1c)
										</Label>
										<Select
											value={
												retinopathyHistory.controlStatus
											}
											onValueChange={(value) =>
												setRetinopathyHistory(
													(prev) => ({
														...prev,
														controlStatus: value,
													})
												)
											}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Select control status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="controlled">
													Well Controlled
												</SelectItem>
												<SelectItem value="poorly-controlled">
													Poorly Controlled
												</SelectItem>
												<SelectItem value="uncontrolled">
													Uncontrolled
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Symptoms */}
									<div className="space-y-4">
										<Label>Symptoms</Label>
										<div className="space-y-2 mt-2">
											<div className="flex items-center space-x-2">
												<input
													aria-label="Retinopathy Symptoms - Decreased Vision"
													name="retinopathy-symptoms"
													alt="Retinopathy Symptoms"
													type="checkbox"
													id="decreased-vision"
													checked={
														retinopathyHistory.decreasedVision
													}
													onChange={(e) =>
														setRetinopathyHistory(
															(prev) => ({
																...prev,
																decreasedVision:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="decreased-vision">
													Decreased Vision
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Retinopathy Symptoms - Blurred Vision"
													type="checkbox"
													id="floaters"
													checked={
														retinopathyHistory.floaters
													}
													onChange={(e) =>
														setRetinopathyHistory(
															(prev) => ({
																...prev,
																floaters:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="floaters">
													Floaters
												</Label>
											</div>
										</div>
									</div>

									{/* History */}
									<div className="space-y-4">
										<Label>
											Previous Treatment History
										</Label>
										<div className="space-y-2 mt-2">
											<div className="flex items-center space-x-2">
												<input
													aria-label="Previous Injection"
													type="checkbox"
													id="previous-injection"
													checked={
														retinopathyHistory.previousInjection
													}
													onChange={(e) =>
														setRetinopathyHistory(
															(prev) => ({
																...prev,
																previousInjection:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="previous-injection">
													History of Previous
													Injection
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Eye Treatment - Laser"
													type="checkbox"
													id="eye-treatment-laser"
													checked={
														retinopathyHistory.eyeTreatmentLaser
													}
													onChange={(e) =>
														setRetinopathyHistory(
															(prev) => ({
																...prev,
																eyeTreatmentLaser:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="eye-treatment-laser">
													History of Eye Treatment -
													Laser
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Cataract Surgery"
													type="checkbox"
													id="cataract-surgery"
													checked={
														retinopathyHistory.cataractSurgery
													}
													onChange={(e) =>
														setRetinopathyHistory(
															(prev) => ({
																...prev,
																cataractSurgery:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="cataract-surgery">
													Cataract Surgery
												</Label>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Evaluation Notes Section */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Evaluation Notes
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<table className="w-full border-collapse border border-gray-300">
										<thead>
											<tr className="bg-gray-50">
												<th className="border border-gray-300 p-3 text-left font-semibold">
													Evaluation Item
												</th>
												<th className="border border-gray-300 p-3 text-left font-semibold">
													Right Eye
												</th>
												<th className="border border-gray-300 p-3 text-left font-semibold">
													Left Eye
												</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td className="border border-gray-300 p-3 font-medium">
													Visual Acuity
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.visualAcuityRight
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	visualAcuityRight:
																		e.target
																			.value,
																})
															)
														}
														placeholder="e.g., 6/6"
														className="w-full"
													/>
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.visualAcuityLeft
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	visualAcuityLeft:
																		e.target
																			.value,
																})
															)
														}
														placeholder="e.g., 6/6"
														className="w-full"
													/>
												</td>
											</tr>
											<tr>
												<td className="border border-gray-300 p-3 font-medium">
													Pupil Reaction
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.pupilReactionRight
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	pupilReactionRight:
																		e.target
																			.value,
																})
															)
														}
														placeholder="Normal/Abnormal"
														className="w-full"
													/>
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.pupilReactionLeft
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	pupilReactionLeft:
																		e.target
																			.value,
																})
															)
														}
														placeholder="Normal/Abnormal"
														className="w-full"
													/>
												</td>
											</tr>
											<tr>
												<td className="border border-gray-300 p-3 font-medium">
													Iris Details & Neo
													Vascularity
												</td>
												<td className="border border-gray-300 p-3">
													<div className="space-y-2">
														<Input
															value={
																retinopathyEvaluation.irisDetailsRight
															}
															onChange={(e) =>
																setRetinopathyEvaluation(
																	(prev) => ({
																		...prev,
																		irisDetailsRight:
																			e
																				.target
																				.value,
																	})
																)
															}
															placeholder="Iris details"
															className="w-full"
														/>
														<div className="flex items-center space-x-2">
															<input
																aria-label="Neo Vascularisation Right"
																type="checkbox"
																id="neo-vasc-right"
																checked={
																	retinopathyEvaluation.neoVascularisationRight
																}
																onChange={(e) =>
																	setRetinopathyEvaluation(
																		(
																			prev
																		) => ({
																			...prev,
																			neoVascularisationRight:
																				e
																					.target
																					.checked,
																		})
																	)
																}
																className="rounded"
															/>
															<Label
																htmlFor="neo-vasc-right"
																className="text-sm">
																Neo
																Vascularisation
																Present
															</Label>
														</div>
													</div>
												</td>
												<td className="border border-gray-300 p-3">
													<div className="space-y-2">
														<Input
															value={
																retinopathyEvaluation.irisDetailsLeft
															}
															onChange={(e) =>
																setRetinopathyEvaluation(
																	(prev) => ({
																		...prev,
																		irisDetailsLeft:
																			e
																				.target
																				.value,
																	})
																)
															}
															placeholder="Iris details"
															className="w-full"
														/>
														<div className="flex items-center space-x-2">
															<input
																aria-label="Neo Vascularisation Left"
																type="checkbox"
																id="neo-vasc-left"
																checked={
																	retinopathyEvaluation.neoVascularisationLeft
																}
																onChange={(e) =>
																	setRetinopathyEvaluation(
																		(
																			prev
																		) => ({
																			...prev,
																			neoVascularisationLeft:
																				e
																					.target
																					.checked,
																		})
																	)
																}
																className="rounded"
															/>
															<Label
																htmlFor="neo-vasc-left"
																className="text-sm">
																Neo
																Vascularisation
																Present
															</Label>
														</div>
													</div>
												</td>
											</tr>
											<tr>
												<td className="border border-gray-300 p-3 font-medium">
													Intraocular Pressure
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.intraocularPressureRight
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	intraocularPressureRight:
																		e.target
																			.value,
																})
															)
														}
														placeholder="e.g., 14 mmHg"
														className="w-full"
													/>
												</td>
												<td className="border border-gray-300 p-3">
													<Input
														value={
															retinopathyEvaluation.intraocularPressureLeft
														}
														onChange={(e) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	intraocularPressureLeft:
																		e.target
																			.value,
																})
															)
														}
														placeholder="e.g., 14 mmHg"
														className="w-full"
													/>
												</td>
											</tr>
											<tr>
												<td className="border border-gray-300 p-3 font-medium">
													Fundus Findings
												</td>
												<td className="border border-gray-300 p-3">
													<Select
														value={
															retinopathyEvaluation.fundusFindingsRight
														}
														onValueChange={(
															value
														) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	fundusFindingsRight:
																		value,
																})
															)
														}>
														<SelectTrigger>
															<SelectValue placeholder="Select findings" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="no-npdr">
																No NPDR
															</SelectItem>
															<SelectItem value="mild-npdr">
																Mild NPDR
															</SelectItem>
															<SelectItem value="moderate-npdr">
																Moderate NPDR
															</SelectItem>
															<SelectItem value="severe-npdr">
																Severe NPDR
															</SelectItem>
															<SelectItem value="pdr">
																PDR
															</SelectItem>
															<SelectItem value="advanced">
																Advanced
																Diabetic Eye
																Disease
															</SelectItem>
														</SelectContent>
													</Select>
												</td>
												<td className="border border-gray-300 p-3">
													<Select
														value={
															retinopathyEvaluation.fundusFindingsLeft
														}
														onValueChange={(
															value
														) =>
															setRetinopathyEvaluation(
																(prev) => ({
																	...prev,
																	fundusFindingsLeft:
																		value,
																})
															)
														}>
														<SelectTrigger>
															<SelectValue placeholder="Select findings" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="no-npdr">
																No NPDR
															</SelectItem>
															<SelectItem value="mild-npdr">
																Mild NPDR
															</SelectItem>
															<SelectItem value="moderate-npdr">
																Moderate NPDR
															</SelectItem>
															<SelectItem value="severe-npdr">
																Severe NPDR
															</SelectItem>
															<SelectItem value="pdr">
																PDR
															</SelectItem>
															<SelectItem value="advanced">
																Advanced
																Diabetic Eye
																Disease
															</SelectItem>
														</SelectContent>
													</Select>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								{/* Additional Notes */}
								<div className="mt-4">
									<Label htmlFor="additional-notes">
										Additional Notes
									</Label>
									<Textarea
										id="additional-notes"
										value={
											retinopathyEvaluation.additionalNotes
										}
										onChange={(e) =>
											setRetinopathyEvaluation(
												(prev) => ({
													...prev,
													additionalNotes:
														e.target.value,
												})
											)
										}
										placeholder="Enter additional evaluation notes..."
										className="mt-2"
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Auto-populated Investigations */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Relevant Investigations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<p className="text-sm text-blue-800 mb-3 font-medium">
										Auto-populated from patient records (All
										nephropathy patients need vigilant
										retina check)
									</p>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												HbA1c
											</div>
											<div className="text-lg font-semibold text-red-600">
												8.2%
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												FBS
											</div>
											<div className="text-lg font-semibold text-orange-600">
												160 mg/dL
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												PPBS
											</div>
											<div className="text-lg font-semibold text-red-600">
												280 mg/dL
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												Hb
											</div>
											<div className="text-lg font-semibold text-green-600">
												12.8 g/dL
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												Creatinine
											</div>
											<div className="text-lg font-semibold text-green-600">
												1.1 mg/dL
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
										<div className="bg-white p-3 rounded border">
											<div className="text-xs text-gray-600">
												Urine Routine
											</div>
											<div className="text-lg font-semibold text-green-600">
												Normal
											</div>
											<div className="text-xs text-gray-500">
												Jul 2024
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Tests and Management */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Order Tests & Management
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Order Tests */}
									<div>
										<h3 className="font-semibold mb-3">
											Order Tests
										</h3>
										<div className="space-y-2">
											{["OCT", "FFA"].map((test) => (
												<div
													key={test}
													className="flex items-center justify-between p-3 border rounded-lg">
													<span className="font-medium">
														{test}
													</span>
													<Button
														size="sm"
														variant="outline">
														Order
													</Button>
												</div>
											))}
										</div>
									</div>

									{/* Management Options */}
									<div>
										<h3 className="font-semibold mb-3">
											Management Options
										</h3>
										<div className="space-y-3">
											<div>
												<Label htmlFor="diabetes-control">
													Diabetes Control + Follow up
												</Label>
												<Select
													value={
														retinopathyManagement.diabetesControl
													}
													onValueChange={(value) =>
														setRetinopathyManagement(
															(prev) => ({
																...prev,
																diabetesControl:
																	value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select control plan" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="strict-control">
															Strict Diabetes
															Control
														</SelectItem>
														<SelectItem value="optimize-control">
															Optimize Current
															Control
														</SelectItem>
														<SelectItem value="maintain-control">
															Maintain Current
															Control
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label htmlFor="follow-up">
													Follow-up Schedule
												</Label>
												<Select
													value={
														retinopathyManagement.followUp
													}
													onValueChange={(value) =>
														setRetinopathyManagement(
															(prev) => ({
																...prev,
																followUp: value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select follow-up" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1-month">
															1 Month
														</SelectItem>
														<SelectItem value="3-months">
															3 Months
														</SelectItem>
														<SelectItem value="6-months">
															6 Months
														</SelectItem>
														<SelectItem value="1-year">
															1 Year
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											{/* Treatment Options */}
											<div className="space-y-2">
												<Label>Treatment Options</Label>
												<div className="space-y-2">
													<div className="flex items-center space-x-2">
														<input
															aria-label="Intravitreal Injection"
															type="checkbox"
															id="intravitreal"
															checked={
																retinopathyManagement.intravitreal
															}
															onChange={(e) =>
																setRetinopathyManagement(
																	(prev) => ({
																		...prev,
																		intravitreal:
																			e
																				.target
																				.checked,
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="intravitreal">
															Intravitreal
															Injection
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<input
															aria-label="PRP/Laser Therapy"
															type="checkbox"
															id="prp-laser"
															checked={
																retinopathyManagement.prpLaser
															}
															onChange={(e) =>
																setRetinopathyManagement(
																	(prev) => ({
																		...prev,
																		prpLaser:
																			e
																				.target
																				.checked,
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="prp-laser">
															PRP/Laser Therapy
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<input
															aria-label="Vitrectomy"
															type="checkbox"
															id="vitrectomy"
															checked={
																retinopathyManagement.vitrectomy
															}
															onChange={(e) =>
																setRetinopathyManagement(
																	(prev) => ({
																		...prev,
																		vitrectomy:
																			e
																				.target
																				.checked,
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="vitrectomy">
															Vitrectomy
														</Label>
													</div>
												</div>
											</div>

											{/* Eye Drops */}
											<div>
												<Label>Eye Drops</Label>
												<div className="space-y-2 mt-2">
													{[
														"Nepafenac Eye Drops",
														"Carboxymethyl Cellulose",
													].map((drop) => (
														<div
															key={drop}
															className="flex items-center justify-between p-2 border rounded">
															<span className="text-sm">
																{drop}
															</span>
															<Button
																size="sm"
																variant="outline">
																Prescribe
															</Button>
														</div>
													))}
												</div>
											</div>

											{/* Personal Notes */}
											<div>
												<Label htmlFor="personal-notes">
													Personal Notes
												</Label>
												<Textarea
													id="personal-notes"
													value={
														retinopathyManagement.personalNotes
													}
													onChange={(e) =>
														setRetinopathyManagement(
															(prev) => ({
																...prev,
																personalNotes:
																	e.target
																		.value,
															})
														)
													}
													placeholder="Enter personal notes for management..."
													className="mt-2"
													rows={3}
												/>
											</div>
										</div>
									</div>

									{/* Save Button */}
									<div className="mt-6">
										<Button className="w-full">
											<Save className="h-4 w-4 mr-2" />
											Save Retinopathy Assessment
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="nephropathy">
					<div className="space-y-6">
						{/* Nephrology Focused Page */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<BeanIcon className="h-6 w-6 mr-2" />
									Nephrology Assessment - Comprehensive View
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Current Kidney Status */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
											<h3 className="font-semibold text-blue-800 mb-2">
												Current eGFR
											</h3>
											<p className="text-2xl font-bold text-blue-700">
												85
											</p>
											<p className="text-sm text-blue-600">
												ml/min/1.73m²
											</p>
										</div>
										<div className="p-4 bg-green-50 rounded-lg border border-green-200">
											<h3 className="font-semibold text-green-800 mb-2">
												Urine ACR
											</h3>
											<p className="text-2xl font-bold text-green-700">
												15
											</p>
											<p className="text-sm text-green-600">
												mg/g
											</p>
										</div>
										<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
											<h3 className="font-semibold text-orange-800 mb-2">
												Serum Creatinine
											</h3>
											<p className="text-2xl font-bold text-orange-700">
												1.1
											</p>
											<p className="text-sm text-orange-600">
												mg/dL
											</p>
										</div>
									</div>

									{/* Renal Risk Heatmap (KDIGO) */}
									<div>
										<h3 className="text-lg font-semibold mb-3 text-blue-900">
											Renal Risk Heatmap
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
											<div>
												<Label className="text-sm">
													eGFR (ml/min/1.73m²)
												</Label>
												<Input
													placeholder="e.g. 85"
													value={
														nephrologyData.currentEgfr
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																currentEgfr:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>
											<div>
												<Label className="text-sm">
													Urine ACR (mg/g)
												</Label>
												<Input
													placeholder="e.g. 30"
													value={
														nephrologyData.currentAcr
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																currentAcr:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>
											<div>
												<Label className="text-sm">
													Serum Creatinine (mg/dL)
												</Label>
												<Input
													placeholder="e.g. 1.1"
													value={
														nephrologyData.currentCreatinine
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																currentCreatinine:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>
										</div>

										{(() => {
											const egfr = parseFloat(
												nephrologyData.currentEgfr ||
													"-1"
											);
											const acr = parseFloat(
												nephrologyData.currentAcr ||
													"-1"
											);
											const gIdx =
												egfr >= 90
													? 0
													: egfr >= 60
													? 1
													: egfr >= 45
													? 2
													: egfr >= 30
													? 3
													: egfr >= 15
													? 4
													: egfr >= 0
													? 5
													: -1;
											const aIdx =
												acr >= 0 && acr < 30
													? 0
													: acr <= 300
													? 1
													: acr > 300
													? 2
													: -1;
											const colors = [
												[
													"#22c55e",
													"#eab308",
													"#ef4444",
												],
												[
													"#84cc16",
													"#f59e0b",
													"#ef4444",
												],
												[
													"#f59e0b",
													"#f97316",
													"#dc2626",
												],
												[
													"#f97316",
													"#fb923c",
													"#dc2626",
												],
												[
													"#ef4444",
													"#dc2626",
													"#b91c1c",
												],
												[
													"#b91c1c",
													"#991b1b",
													"#7f1d1d",
												],
											];
											return (
												<div className="overflow-x-auto">
													<table className="w-full text-xs border">
														<thead>
															<tr>
																<th className="p-2 border bg-gray-50">
																	eGFR↓ / ACR→
																</th>
																<th className="p-2 border">
																	A1
																	<div className="text-[10px] text-gray-500">
																		&lt;30
																	</div>
																</th>
																<th className="p-2 border">
																	A2
																	<div className="text-[10px] text-gray-500">
																		30–300
																	</div>
																</th>
																<th className="p-2 border">
																	A3
																	<div className="text-[10px] text-gray-500">
																		&gt;300
																	</div>
																</th>
															</tr>
														</thead>
														<tbody>
															{[
																"G1 ≥90",
																"G2 60–89",
																"G3a 45–59",
																"G3b 30–44",
																"G4 15–29",
																"G5 <15",
															].map((g, gi) => (
																<tr key={g}>
																	<td className="p-2 border bg-gray-50">
																		{g}
																	</td>
																	{[
																		0, 1, 2,
																	].map(
																		(
																			ai
																		) => (
																			<td
																				key={
																					ai
																				}
																				className="p-2 border text-center">
																				<div
																					style={{
																						backgroundColor:
																							colors[
																								gi
																							][
																								ai
																							],
																					}}
																					className={`w-16 h-6 mx-auto rounded ${
																						gi ===
																							gIdx &&
																						ai ===
																							aIdx
																							? "ring-2 ring-black"
																							: ""
																					}`}></div>
																			</td>
																		)
																	)}
																</tr>
															))}
														</tbody>
													</table>
													<div className="mt-2 text-xs text-gray-600">
														Creatinine:{" "}
														{nephrologyData.currentCreatinine ||
															"-"}{" "}
														mg/dL
													</div>
												</div>
											);
										})()}
									</div>

									{/* Assessment Form */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Clinical History */}
										<div className="space-y-4">
											<h3 className="font-semibold text-gray-800 text-lg">
												Clinical History
											</h3>

											<div>
												<Label className="text-sm font-medium">
													Diabetes Duration
												</Label>
												<Input
													placeholder="Years"
													className="mt-2"
													value={
														nephrologyData.diabetesDuration
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																diabetesDuration:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Hypertension Duration
												</Label>
												<Input
													placeholder="Years"
													className="mt-2"
													value={
														nephrologyData.hypertensionDuration
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																hypertensionDuration:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Family History of Kidney
													Disease
												</Label>
												<Select
													value={
														nephrologyData.familyHistory
													}
													onValueChange={(value) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																familyHistory:
																	value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select option" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="yes">
															Yes
														</SelectItem>
														<SelectItem value="no">
															No
														</SelectItem>
														<SelectItem value="unknown">
															Unknown
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Current Symptoms
												</Label>
												<div className="mt-2 space-y-2">
													<div className="flex items-center space-x-2">
														<input
															aria-label="Nephrology Symptoms - Fatigue"
															type="checkbox"
															id="nephr-edema"
															checked={
																nephrologyData
																	.symptoms
																	.edema
															}
															onChange={(e) =>
																setNephrologyData(
																	(prev) => ({
																		...prev,
																		symptoms:
																			{
																				...prev.symptoms,
																				edema: e
																					.target
																					.checked,
																			},
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="nephr-edema">
															Edema
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<input
															aria-label="Nephrology Symptoms - Nocturia"
															type="checkbox"
															id="nephr-nocturia"
															checked={
																nephrologyData
																	.symptoms
																	.nocturia
															}
															onChange={(e) =>
																setNephrologyData(
																	(prev) => ({
																		...prev,
																		symptoms:
																			{
																				...prev.symptoms,
																				nocturia:
																					e
																						.target
																						.checked,
																			},
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="nephr-nocturia">
															Nocturia
														</Label>
													</div>
													<div className="flex items-center space-x-2">
														<input
															aria-label="Nephrology Symptoms - Foamy Urine"
															type="checkbox"
															id="nephr-foamy"
															checked={
																nephrologyData
																	.symptoms
																	.foamyUrine
															}
															onChange={(e) =>
																setNephrologyData(
																	(prev) => ({
																		...prev,
																		symptoms:
																			{
																				...prev.symptoms,
																				foamyUrine:
																					e
																						.target
																						.checked,
																			},
																	})
																)
															}
															className="rounded"
														/>
														<Label htmlFor="nephr-foamy">
															Foamy Urine
														</Label>
													</div>
												</div>
											</div>
										</div>

										{/* Assessment Results */}
										<div className="space-y-4">
											<h3 className="font-semibold text-gray-800 text-lg">
												Assessment Results
											</h3>

											<div>
												<Label className="text-sm font-medium">
													CKD Stage
												</Label>
												<Select
													value={
														nephrologyData.ckdStage
													}
													onValueChange={(value) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																ckdStage: value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select CKD stage" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="normal">
															Normal (eGFR ≥90)
														</SelectItem>
														<SelectItem value="stage1">
															Stage 1 (eGFR ≥90
															with kidney damage)
														</SelectItem>
														<SelectItem value="stage2">
															Stage 2 (eGFR 60-89)
														</SelectItem>
														<SelectItem value="stage3a">
															Stage 3a (eGFR
															45-59)
														</SelectItem>
														<SelectItem value="stage3b">
															Stage 3b (eGFR
															30-44)
														</SelectItem>
														<SelectItem value="stage4">
															Stage 4 (eGFR 15-29)
														</SelectItem>
														<SelectItem value="stage5">
															Stage 5 (eGFR
															&lt;15)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Albuminuria Category
												</Label>
												<Select
													value={
														nephrologyData.albuminuriaCategory
													}
													onValueChange={(value) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																albuminuriaCategory:
																	value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select albuminuria category" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="a1">
															A1: Normal to mildly
															increased (&lt;30
															mg/g)
														</SelectItem>
														<SelectItem value="a2">
															A2: Moderately
															increased (30-300
															mg/g)
														</SelectItem>
														<SelectItem value="a3">
															A3: Severely
															increased (&gt;300
															mg/g)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Risk Category
												</Label>
												<div className="mt-2 p-3 bg-gray-50 rounded-lg">
													<span
														className={`px-2 py-1 rounded text-sm font-medium ${
															nephrologyData.riskCategory ===
															"low"
																? "bg-green-100 text-green-800"
																: nephrologyData.riskCategory ===
																  "moderate"
																? "bg-yellow-100 text-yellow-800"
																: nephrologyData.riskCategory ===
																  "high"
																? "bg-orange-100 text-orange-800"
																: "bg-red-100 text-red-800"
														}`}>
														{nephrologyData.riskCategory
															.charAt(0)
															.toUpperCase() +
															nephrologyData.riskCategory.slice(
																1
															)}{" "}
														Risk
													</span>
												</div>
											</div>

											<div>
												<Label className="text-sm font-medium">
													Clinical Notes
												</Label>
												<Textarea
													placeholder="Enter clinical observations and notes..."
													className="mt-2"
													rows={4}
													value={
														nephrologyData.clinicalNotes
													}
													onChange={(e) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																clinicalNotes:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>
										</div>
									</div>

									{/* Trend Analysis - Limited to 3 metrics as per V3 specs */}
									<div>
										<h3 className="font-semibold text-gray-800 text-lg mb-4">
											Trend Analysis (Key Metrics)
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="p-4 bg-white border rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">
													Serum Creatinine
												</h4>
												<div className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>Jan 2024:</span>
														<span>1.2 mg/dL</span>
													</div>
													<div className="flex justify-between text-sm">
														<span>Jul 2024:</span>
														<span>1.1 mg/dL</span>
													</div>
													<div className="flex justify-between text-sm font-medium text-green-600">
														<span>Current:</span>
														<span>1.1 mg/dL ↓</span>
													</div>
												</div>
											</div>
											<div className="p-4 bg-white border rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">
													Potassium
												</h4>
												<div className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>Jan 2024:</span>
														<span>4.2 mEq/L</span>
													</div>
													<div className="flex justify-between text-sm">
														<span>Jul 2024:</span>
														<span>4.1 mEq/L</span>
													</div>
													<div className="flex justify-between text-sm font-medium text-green-600">
														<span>Current:</span>
														<span>4.0 mEq/L ↓</span>
													</div>
												</div>
											</div>
											<div className="p-4 bg-white border rounded-lg">
												<h4 className="font-medium text-gray-700 mb-2">
													Urine ACR
												</h4>
												<div className="space-y-1">
													<div className="flex justify-between text-sm">
														<span>Jan 2024:</span>
														<span>18 mg/g</span>
													</div>
													<div className="flex justify-between text-sm">
														<span>Jul 2024:</span>
														<span>16 mg/g</span>
													</div>
													<div className="flex justify-between text-sm font-medium text-green-600">
														<span>Current:</span>
														<span>15 mg/g ↓</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Management Actions */}
									<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
										{/* Order Tests */}
										<div>
											<h3 className="font-semibold text-gray-800 text-lg mb-3">
												Order Tests
											</h3>
											<div className="space-y-3">
												<Select
													value={
														nephrologyData.selectedTest
													}
													onValueChange={(value) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																selectedTest:
																	value,
															})
														)
													}>
													<SelectTrigger>
														<SelectValue placeholder="Select test to order" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="serum-creatinine">
															Serum creatinine
														</SelectItem>
														<SelectItem value="urine-routine">
															Urine routine
														</SelectItem>
														<SelectItem value="urine-acr">
															Urine ACR
														</SelectItem>
														<SelectItem value="urine-pcr">
															Urine PCR
														</SelectItem>
														<SelectItem value="potassium">
															Potassium
														</SelectItem>
														<SelectItem value="sodium">
															Sodium
														</SelectItem>
														<SelectItem value="chloride">
															Chloride
														</SelectItem>
														<SelectItem value="ultrasound-abdomen">
															Ultrasound abdomen
														</SelectItem>
														<SelectItem value="calcium">
															Calcium
														</SelectItem>
														<SelectItem value="phosphorus">
															Phosphorus
														</SelectItem>
														<SelectItem value="uric-acid">
															Uric acid
														</SelectItem>
														<SelectItem value="vitamin-d">
															Vitamin D
														</SelectItem>
														<SelectItem value="pth">
															PTH
														</SelectItem>
														<SelectItem value="fbs">
															FBS
														</SelectItem>
														<SelectItem value="ppbs">
															PPBS
														</SelectItem>
														<SelectItem value="hba1c">
															HbA1c
														</SelectItem>
													</SelectContent>
												</Select>
												<Button
													onClick={() => {
														if (
															nephrologyData.selectedTest &&
															!nephrologyData.orderedTests.includes(
																nephrologyData.selectedTest
															)
														) {
															setNephrologyData(
																(prev) => ({
																	...prev,
																	orderedTests:
																		[
																			...prev.orderedTests,
																			prev.selectedTest,
																		],
																	selectedTest:
																		"",
																})
															);
														}
													}}
													className="w-full"
													size="sm">
													Add Test
												</Button>
												{nephrologyData.orderedTests
													.length > 0 && (
													<div className="space-y-2">
														<p className="text-sm font-medium text-gray-700">
															Ordered Tests:
														</p>
														{nephrologyData.orderedTests.map(
															(test, index) => (
																<div
																	key={index}
																	className="flex justify-between items-center p-2 bg-blue-50 rounded">
																	<span className="text-sm capitalize">
																		{test.replace(
																			"-",
																			" "
																		)}
																	</span>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			setNephrologyData(
																				(
																					prev
																				) => ({
																					...prev,
																					orderedTests:
																						prev.orderedTests.filter(
																							(
																								_,
																								i
																							) =>
																								i !==
																								index
																						),
																				})
																			)
																		}>
																		×
																	</Button>
																</div>
															)
														)}
													</div>
												)}
											</div>
										</div>

										{/* Referrals */}
										<div>
											<h3 className="font-semibold text-gray-800 text-lg mb-3">
												Referrals
											</h3>
											<div className="space-y-3">
												<Select
													value={
														nephrologyData.selectedReferral
													}
													onValueChange={(value) =>
														setNephrologyData(
															(prev) => ({
																...prev,
																selectedReferral:
																	value,
															})
														)
													}>
													<SelectTrigger>
														<SelectValue placeholder="Select referral" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="ophthalmologist">
															Ophthalmologist
														</SelectItem>
														<SelectItem value="neurologist">
															Neurologist
														</SelectItem>
														<SelectItem value="cardiologist">
															Cardiologist
														</SelectItem>
														<SelectItem value="nutritionist">
															Nutritionist
														</SelectItem>
														<SelectItem value="others">
															Others
														</SelectItem>
													</SelectContent>
												</Select>
												<Button
													onClick={() => {
														if (
															nephrologyData.selectedReferral &&
															!nephrologyData.referrals.includes(
																nephrologyData.selectedReferral
															)
														) {
															setNephrologyData(
																(prev) => ({
																	...prev,
																	referrals: [
																		...prev.referrals,
																		prev.selectedReferral,
																	],
																	selectedReferral:
																		"",
																})
															);
														}
													}}
													className="w-full"
													size="sm">
													Add Referral
												</Button>
												{nephrologyData.referrals
													.length > 0 && (
													<div className="space-y-2">
														<p className="text-sm font-medium text-gray-700">
															Active Referrals:
														</p>
														{nephrologyData.referrals.map(
															(
																referral,
																index
															) => (
																<div
																	key={index}
																	className="flex justify-between items-center p-2 bg-green-50 rounded">
																	<span className="text-sm capitalize">
																		{
																			referral
																		}
																	</span>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			setNephrologyData(
																				(
																					prev
																				) => ({
																					...prev,
																					referrals:
																						prev.referrals.filter(
																							(
																								_,
																								i
																							) =>
																								i !==
																								index
																						),
																				})
																			)
																		}>
																		×
																	</Button>
																</div>
															)
														)}
													</div>
												)}
											</div>
										</div>

										{/* Action Plan */}
										<div>
											<h3 className="font-semibold text-gray-800 text-lg mb-3">
												Action Plan
											</h3>
											<div className="space-y-3">
												<Select
													value={
														nephrologyData.actionPlan
													}
													onValueChange={(value) => {
														setNephrologyData(
															(prev) => ({
																...prev,
																actionPlan:
																	value,
															})
														);
														if (
															value ===
															"optimize-medications"
														) {
															if (onNavigate)
																onNavigate(
																	"medications"
																);
															else if (
																typeof window !==
																"undefined"
															) {
																const params =
																	new URLSearchParams(
																		window.location.search
																	);
																params.set(
																	"tab",
																	"medications"
																);
																window.location.search = `?${params}`;
															}
														}
													}}>
													<SelectTrigger>
														<SelectValue placeholder="Select action plan" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="continue-same">
															Continue same
														</SelectItem>
														<SelectItem value="optimize-medications">
															Optimize medications
														</SelectItem>
														<SelectItem value="order-tests">
															Order tests
														</SelectItem>
													</SelectContent>
												</Select>

												{nephrologyData.actionPlan ===
													"order-tests" && (
													<div className="mt-3">
														<Select>
															<SelectTrigger>
																<SelectValue placeholder="Select test to order" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="serum-creatinine">
																	Serum
																	creatinine
																</SelectItem>
																<SelectItem value="urine-routine">
																	Urine
																	routine
																</SelectItem>
																<SelectItem value="urine-acr">
																	Urine ACR
																</SelectItem>
																<SelectItem value="urine-pcr">
																	Urine PCR
																</SelectItem>
																<SelectItem value="potassium">
																	Potassium
																</SelectItem>
																<SelectItem value="sodium">
																	Sodium
																</SelectItem>
																<SelectItem value="chloride">
																	Chloride
																</SelectItem>
																<SelectItem value="ultrasound-abdomen">
																	Ultrasound
																	abdomen
																</SelectItem>
																<SelectItem value="calcium">
																	Calcium
																</SelectItem>
																<SelectItem value="phosphorus">
																	Phosphorus
																</SelectItem>
																<SelectItem value="uric-acid">
																	Uric acid
																</SelectItem>
																<SelectItem value="vitamin-d">
																	Vitamin D
																</SelectItem>
																<SelectItem value="pth">
																	PTH
																</SelectItem>
																<SelectItem value="fbs">
																	FBS
																</SelectItem>
																<SelectItem value="ppbs">
																	PPBS
																</SelectItem>
																<SelectItem value="hba1c">
																	HbA1c
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												)}

												<div className="text-sm text-gray-600 mt-2">
													{nephrologyData.actionPlan ===
														"optimize-medications" && (
														<p>
															Clicking this option
															will navigate to
															medications page
															where you can add,
															modify, or adjust
															dosages.
														</p>
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Expandable Other Organs Section */}
									<div className="border-t pt-6">
										<button
											onClick={() =>
												setNephrologyData((prev) => ({
													...prev,
													showOtherOrgans:
														!prev.showOtherOrgans,
												}))
											}
											className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
											{nephrologyData.showOtherOrgans ? (
												<ChevronDown className="h-5 w-5" />
											) : (
												<ChevronRight className="h-5 w-5" />
											)}
											<span className="font-medium">
												Comprehensive Assessment (Other
												Target Organs)
											</span>
										</button>

										{nephrologyData.showOtherOrgans && (
											<div className="mt-4 p-4 bg-gray-50 rounded-lg">
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
													<button
														onClick={() =>
															onNavigate &&
															onNavigate(
																"retinopathy"
															)
														}
														className="p-3 text-left bg-white rounded border hover:border-blue-500 hover:bg-blue-50 transition-colors">
														<div className="text-sm font-medium">
															Retinopathy
														</div>
														<div className="text-xs text-gray-500">
															Eye assessment
														</div>
													</button>
													<button
														onClick={() =>
															onNavigate &&
															onNavigate(
																"cardiac"
															)
														}
														className="p-3 text-left bg-white rounded border hover:border-red-500 hover:bg-red-50 transition-colors">
														<div className="text-sm font-medium">
															Cardiac
														</div>
														<div className="text-xs text-gray-500">
															Heart assessment
														</div>
													</button>
													<button
														onClick={() =>
															onNavigate &&
															onNavigate("neuro")
														}
														className="p-3 text-left bg-white rounded border hover:border-purple-500 hover:bg-purple-50 transition-colors">
														<div className="text-sm font-medium">
															CVA/Stroke
														</div>
														<div className="text-xs text-gray-500">
															Stroke/CVA
															assessment
														</div>
													</button>
													<button
														onClick={() =>
															onNavigate &&
															onNavigate("liver")
														}
														className="p-3 text-left bg-white rounded border hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
														<div className="text-sm font-medium">
															Liver
														</div>
														<div className="text-xs text-gray-500">
															Liver assessment
														</div>
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="cardiac">
					<div className="space-y-6">
						{/* IHD/HF Previous History & Current Status */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Heart className="h-6 w-6 mr-2" />
									IHD/HF Previous History & Current Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Previous History */}
									<div className="space-y-4">
										<h3 className="font-semibold text-gray-800">
											Previous History/Current Status
										</h3>
										<div>
											<Label className="text-sm font-medium">
												IHD History
											</Label>
											<Select>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select IHD type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="nstemi">
														NSTEMI
													</SelectItem>
													<SelectItem value="stemi">
														STEMI
													</SelectItem>
													<SelectItem value="none">
														No IHD
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label className="text-sm font-medium">
												Heart Failure Type
											</Label>
											<Select>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select HF type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="hfref">
														HFrEF
													</SelectItem>
													<SelectItem value="hfief">
														HFiEF
													</SelectItem>
													<SelectItem value="hfpef">
														HFpEF
													</SelectItem>
													<SelectItem value="none">
														No HF
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label className="text-sm font-medium">
												Previous Treatment
											</Label>
											<Select>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select previous treatment" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="pci">
														PCI
													</SelectItem>
													<SelectItem value="cabg">
														CABG
													</SelectItem>
													<SelectItem value="medical">
														Medical management only
													</SelectItem>
													<SelectItem value="none">
														No previous treatment
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									{/* Current Symptoms */}
									<div className="space-y-4">
										<h3 className="font-semibold text-gray-800">
											Current Symptoms
										</h3>
										<div className="space-y-3">
											<div className="flex items-center space-x-2">
												<input
													aria-label="Chest pain/discomfort"
													type="checkbox"
													id="chest-pain"
													className="rounded"
												/>
												<Label htmlFor="chest-pain">
													Chest pain/discomfort
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Shortness of breath"
													type="checkbox"
													id="shortness-breath"
													className="rounded"
												/>
												<Label htmlFor="shortness-breath">
													Shortness of breath
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Fatigue"
													type="checkbox"
													id="fatigue"
													className="rounded"
												/>
												<Label htmlFor="fatigue">
													Fatigue
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Ankle swelling"
													type="checkbox"
													id="ankle-swelling"
													className="rounded"
												/>
												<Label htmlFor="ankle-swelling">
													Ankle swelling
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="Palpitations"
													type="checkbox"
													id="palpitations"
													className="rounded"
												/>
												<Label htmlFor="palpitations">
													Palpitations
												</Label>
											</div>
										</div>
									</div>
								</div>

								{/* Summary Notes */}
								<div className="mt-6">
									<Label className="text-sm font-medium">
										Summary of IHD/HF, Personal Notes
									</Label>
									<Textarea
										placeholder="Enter summary and personal notes about IHD/HF status..."
										className="mt-2"
										rows={3}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Recommendation Alert */}
						<Card className="bg-orange-50 border-orange-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-orange-700 flex items-center">
									<Heart className="h-5 w-5 mr-2" />
									Recommendation Alert
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="p-4 bg-orange-100 rounded-lg border border-orange-300">
									<div className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
										<div>
											<p className="font-medium text-orange-800">
												Assess for Heart Failure
											</p>
											<p className="text-orange-700 text-sm mt-1">
												BMI &gt;30: Obesity patients
												invariably could have stage 1 HF
												without any symptoms.
												Comprehensive cardiac assessment
												is recommended.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Tests */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<TestTube className="h-5 w-5 mr-2" />
									Order Tests
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{[
										"ECG",
										"ECHO",
										"NT Pro BNP",
										"Trop I",
										"TMT",
										"Angiogram",
										"CT calcium scores",
										"Lipid profile",
										"Potassium",
										"Serum creatinine",
									].map((test) => (
										<div
											key={test}
											className="flex items-center space-x-2 p-2 border rounded">
											<input
												aria-label={test}
												type="checkbox"
												id={test}
												className="rounded"
											/>
											<Label
												htmlFor={test}
												className="text-sm">
												{test}
											</Label>
										</div>
									))}
								</div>
								<Button className="mt-4">
									<Plus className="h-4 w-4 mr-2" />
									Add Selected Tests to Orders
								</Button>
							</CardContent>
						</Card>

						{/* Medication Optimization */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<Pill className="h-5 w-5 mr-2" />
									Medication Optimization
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											For IHD
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="Aspirin"
													type="checkbox"
													id="sapt"
													className="rounded"
												/>
												<Label
													htmlFor="sapt"
													className="text-sm">
													Single anti-platelet therapy
													(SAPT)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="DAPT"
													type="checkbox"
													id="dapt"
													className="rounded"
												/>
												<Label
													htmlFor="dapt"
													className="text-sm">
													Dual anti-platelet therapy
													(DAPT)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="Beta blocker"
													type="checkbox"
													id="statin-ihd"
													className="rounded"
												/>
												<Label
													htmlFor="statin-ihd"
													className="text-sm">
													Statin
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="Ezetimibe"
													type="checkbox"
													id="ezetimibe"
													className="rounded"
												/>
												<Label
													htmlFor="ezetimibe"
													className="text-sm">
													Ezetimibe (LDL above
													goal/statin-intolerant)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="Bempedoic Acid"
													type="checkbox"
													id="bempedoic-acid"
													className="rounded"
												/>
												<Label
													htmlFor="bempedoic-acid"
													className="text-sm">
													Bempedoic Acid (if
													additional LDL lowering
													needed)
												</Label>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											For Heart Failure
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="Beta blocker"
													type="checkbox"
													id="beta-blocker"
													className="rounded"
												/>
												<Label
													htmlFor="beta-blocker"
													className="text-sm">
													Beta blocker
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="ACE i/ARBS/ARNI"
													type="checkbox"
													id="ace-arb"
													className="rounded"
												/>
												<Label
													htmlFor="ace-arb"
													className="text-sm">
													ACE i/ARBS/ARNI
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="SGLT2 inhibitor"
													type="checkbox"
													id="sglt2i"
													className="rounded"
												/>
												<Label
													htmlFor="sglt2i"
													className="text-sm">
													SGLT2 inhibitor
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="MRA"
													type="checkbox"
													id="mra"
													className="rounded"
												/>
												<Label
													htmlFor="mra"
													className="text-sm">
													MRA
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="GLP-1 agonist"
													type="checkbox"
													id="glp1"
													className="rounded"
												/>
												<Label
													htmlFor="glp1"
													className="text-sm">
													GLP-1 agonist
												</Label>
											</div>
										</div>
									</div>

									<Button
										className="w-full"
										onClick={() => {
											if (onNavigate)
												onNavigate("medications");
											else if (
												typeof window !== "undefined"
											) {
												const params =
													new URLSearchParams(
														window.location.search
													);
												params.set(
													"tab",
													"medications"
												);
												window.location.search = `?${params}`;
											}
										}}>
										<ArrowRight className="h-4 w-4 mr-2" />
										Open Medications Management Page
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Education Prescription */}
						<Card className="bg-blue-50 border-blue-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-blue-700">
									Education Prescription
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											aria-label="Salt restriction"
											type="checkbox"
											id="salt-restriction"
											className="rounded"
										/>
										<Label htmlFor="salt-restriction">
											Reinforce salt restriction
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="Fluid restriction"
											type="checkbox"
											id="fluid-restriction"
											className="rounded"
										/>
										<Label htmlFor="fluid-restriction">
											Fluid restriction for HF patients
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="Medication counselling"
											type="checkbox"
											id="medication-counselling"
											className="rounded"
										/>
										<Label htmlFor="medication-counselling">
											Other medication prescription
											counselling
										</Label>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Referral */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600">
									Referral
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<h4 className="font-medium">
											Cardiology
										</h4>
										<p className="text-sm text-gray-600">
											For comprehensive cardiac evaluation
											and management
										</p>
									</div>
									<Button>
										<UserCheck className="h-4 w-4 mr-2" />
										Refer to Cardiology
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="neuro">
					<div className="space-y-6">
						{/* Neuropathy Assessment (moved to Diabetic Foot per spec) */}
						{false && (
							<Card className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl text-navy-600 flex items-center">
										<Zap className="h-6 w-6 mr-2" />
										Neuropathy Assessment
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* A. History and Symptoms */}
									<div className="border rounded-lg p-4">
										<h3 className="text-lg font-semibold text-blue-700 mb-4">
											A. History and Symptoms
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label>
													Duration of diabetes in
													years
												</Label>
												<Input
													value={
														neuropathyHistory.diabetesDuration
													}
													onChange={(e) =>
														setNeuropathyHistory(
															(prev) => ({
																...prev,
																diabetesDuration:
																	e.target
																		.value,
															})
														)
													}
													placeholder="Can auto-populate"
													className="mt-2"
												/>
											</div>
											<div className="space-y-4">
												<div className="flex items-center space-x-2">
													<input
														aria-label="Previous amputation"
														type="checkbox"
														id="previous-amputation"
														checked={
															neuropathyHistory.previousAmputation
														}
														onChange={(e) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	previousAmputation:
																		e.target
																			.checked,
																})
															)
														}
														className="rounded"
													/>
													<Label htmlFor="previous-amputation">
														Previous history of
														amputation
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="Diabetic foot surgery"
														type="checkbox"
														id="diabetic-foot-surgery"
														checked={
															neuropathyHistory.diabeticFootSurgery
														}
														onChange={(e) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	diabeticFootSurgery:
																		e.target
																			.checked,
																})
															)
														}
														className="rounded"
													/>
													<Label htmlFor="diabetic-foot-surgery">
														Diabetic foot surgery
													</Label>
												</div>
											</div>
										</div>

										<div className="mt-6 space-y-4">
											<div>
												<div className="flex items-center space-x-2 mb-2">
													<input
														aria-label="Positive symptoms"
														type="checkbox"
														id="positive-symptoms"
														checked={
															neuropathyHistory.positiveSymptoms
														}
														onChange={(e) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	positiveSymptoms:
																		e.target
																			.checked,
																})
															)
														}
														className="rounded"
													/>
													<Label htmlFor="positive-symptoms">
														Positive symptoms
														(burning pain, tingling,
														paresthesia, pricking
														sensation)
													</Label>
												</div>
												{neuropathyHistory.positiveSymptoms && (
													<Select
														value={
															neuropathyHistory.positiveLocation
														}
														onValueChange={(
															value
														) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	positiveLocation:
																		value,
																})
															)
														}>
														<SelectTrigger className="ml-6 w-48">
															<SelectValue placeholder="Select location" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="upper-limb">
																Upper limb
															</SelectItem>
															<SelectItem value="lower-limb">
																Lower limb
															</SelectItem>
															<SelectItem value="both">
																Both
															</SelectItem>
														</SelectContent>
													</Select>
												)}
											</div>

											<div>
												<div className="flex items-center space-x-2 mb-2">
													<input
														aria-label="Negative symptoms"
														type="checkbox"
														id="negative-symptoms"
														checked={
															neuropathyHistory.negativeSymptoms
														}
														onChange={(e) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	negativeSymptoms:
																		e.target
																			.checked,
																})
															)
														}
														className="rounded"
													/>
													<Label htmlFor="negative-symptoms">
														Negative symptoms
														(numbness, loss of
														power/weakness/function,
														slippage of chappals)
													</Label>
												</div>
												{neuropathyHistory.negativeSymptoms && (
													<Select
														value={
															neuropathyHistory.negativeLocation
														}
														onValueChange={(
															value
														) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	negativeLocation:
																		value,
																})
															)
														}>
														<SelectTrigger className="ml-6 w-48">
															<SelectValue placeholder="Select location" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="upper-limb">
																Upper limb
															</SelectItem>
															<SelectItem value="lower-limb">
																Lower limb
															</SelectItem>
															<SelectItem value="both">
																Both
															</SelectItem>
														</SelectContent>
													</Select>
												)}
											</div>

											<div>
												<div className="flex items-center space-x-2 mb-2">
													<input
														aria-label="Carpal tunnel syndrome"
														type="checkbox"
														id="carpal-tunnel"
														checked={
															neuropathyHistory.carpalTunnel
														}
														onChange={(e) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	carpalTunnel:
																		e.target
																			.checked,
																})
															)
														}
														className="rounded"
													/>
													<Label htmlFor="carpal-tunnel">
														Features suggestive of
														carpal tunnel syndrome
													</Label>
												</div>
												{neuropathyHistory.carpalTunnel && (
													<Select
														value={
															neuropathyHistory.carpalSide
														}
														onValueChange={(
															value
														) =>
															setNeuropathyHistory(
																(prev) => ({
																	...prev,
																	carpalSide:
																		value,
																})
															)
														}>
														<SelectTrigger className="ml-6 w-48">
															<SelectValue placeholder="Select side" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="right">
																Right side
															</SelectItem>
															<SelectItem value="left">
																Left side
															</SelectItem>
														</SelectContent>
													</Select>
												)}
											</div>
										</div>
									</div>

									{/* B. Examination */}
									<div className="border rounded-lg p-4">
										<h3 className="text-lg font-semibold text-blue-700 mb-4">
											B. Examination
										</h3>

										{/* Muscle Power Assessment */}
										<div className="mb-6">
											<h4 className="font-semibold mb-3">
												1. Muscle power assessment
											</h4>
											<div className="overflow-x-auto">
												<table className="w-full border-collapse border border-gray-300">
													<thead>
														<tr className="bg-gray-50">
															<th className="border border-gray-300 p-2"></th>
															<th className="border border-gray-300 p-2">
																Right
															</th>
															<th className="border border-gray-300 p-2">
																Left
															</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td
																rowSpan={2}
																className="border border-gray-300 p-2 font-medium">
																Upper limb
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Proximal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleRightUpperProximal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleRightUpperProximal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Proximal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleLeftUpperProximal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleLeftUpperProximal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
														</tr>
														<tr>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Distal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleRightUpperDistal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleRightUpperDistal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Distal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleLeftUpperDistal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleLeftUpperDistal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
														</tr>
														<tr>
															<td
																rowSpan={2}
																className="border border-gray-300 p-2 font-medium">
																Lower limb
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Proximal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleRightLowerProximal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleRightLowerProximal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Proximal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleLeftLowerProximal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleLeftLowerProximal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
														</tr>
														<tr>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Distal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleRightLowerDistal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleRightLowerDistal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
															<td className="border border-gray-300 p-2">
																<div className="flex items-center space-x-2">
																	<span className="text-sm">
																		Distal:
																	</span>
																	<Select
																		value={
																			neuropathyExamination.muscleLeftLowerDistal
																		}
																		onValueChange={(
																			value
																		) =>
																			setNeuropathyExamination(
																				(
																					prev
																				) => ({
																					...prev,
																					muscleLeftLowerDistal:
																						value,
																				})
																			)
																		}>
																		<SelectTrigger className="w-20">
																			<SelectValue />
																		</SelectTrigger>
																		<SelectContent>
																			<SelectItem value="0/5">
																				0/5
																			</SelectItem>
																			<SelectItem value="1/5">
																				1/5
																			</SelectItem>
																			<SelectItem value="2/5">
																				2/5
																			</SelectItem>
																			<SelectItem value="3/5">
																				3/5
																			</SelectItem>
																			<SelectItem value="4/5">
																				4/5
																			</SelectItem>
																			<SelectItem value="5/5">
																				5/5
																			</SelectItem>
																		</SelectContent>
																	</Select>
																</div>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
											<div className="mt-2">
												<Label>Personal notes:</Label>
												<Textarea
													value={
														neuropathyExamination.musclePersonalNotes
													}
													onChange={(e) =>
														setNeuropathyExamination(
															(prev) => ({
																...prev,
																musclePersonalNotes:
																	e.target
																		.value,
															})
														)
													}
													placeholder="Add personal notes about muscle power assessment"
													className="mt-1"
													rows={2}
												/>
											</div>
										</div>

										{/* Deep Tendon Reflexes */}
										<div className="mb-6">
											<h4 className="font-semibold mb-3">
												2. Deep tendon reflexes
											</h4>
											<div className="overflow-x-auto">
												<table className="w-full border-collapse border border-gray-300">
													<thead>
														<tr className="bg-gray-50">
															<th className="border border-gray-300 p-2"></th>
															<th className="border border-gray-300 p-2">
																Biceps
															</th>
															<th className="border border-gray-300 p-2">
																Triceps
															</th>
															<th className="border border-gray-300 p-2">
																Supinator
															</th>
															<th className="border border-gray-300 p-2">
																Knee
															</th>
															<th className="border border-gray-300 p-2">
																Ankle
															</th>
															<th className="border border-gray-300 p-2">
																Plantar
															</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td className="border border-gray-300 p-2 font-medium">
																Right
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexBicepsRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexBicepsRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexTricepsRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexTricepsRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexSupinatorRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexSupinatorRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexKneeRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexKneeRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexAnkleRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexAnkleRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexPlantarRight
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexPlantarRight:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-20">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="extensor">
																			Extensor
																		</SelectItem>
																		<SelectItem value="flexor">
																			Flexor
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
														</tr>
														<tr>
															<td className="border border-gray-300 p-2 font-medium">
																Left
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexBicepsLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexBicepsLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexTricepsLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexTricepsLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexSupinatorLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexSupinatorLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexKneeLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexKneeLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexAnkleLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexAnkleLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-16">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="0">
																			0
																		</SelectItem>
																		<SelectItem value="1+">
																			1+
																		</SelectItem>
																		<SelectItem value="2+">
																			2+
																		</SelectItem>
																		<SelectItem value="3+">
																			3+
																		</SelectItem>
																		<SelectItem value="4+">
																			4+
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
															<td className="border border-gray-300 p-2">
																<Select
																	value={
																		neuropathyExamination.reflexPlantarLeft
																	}
																	onValueChange={(
																		value
																	) =>
																		setNeuropathyExamination(
																			(
																				prev
																			) => ({
																				...prev,
																				reflexPlantarLeft:
																					value,
																			})
																		)
																	}>
																	<SelectTrigger className="w-20">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="extensor">
																			Extensor
																		</SelectItem>
																		<SelectItem value="flexor">
																			Flexor
																		</SelectItem>
																	</SelectContent>
																</Select>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										{/* Sensory Assessment */}
										<div className="mb-6">
											<h4 className="font-semibold mb-3">
												3. Sensory Assessment
											</h4>
											<p className="text-sm text-gray-600 mb-3">
												Light touch, pain (pin-prick),
												Temperature, Joint position
												sense, Vibration
											</p>
											<div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
												<div className="text-center text-gray-500 mb-2">
													<span className="text-sm">
														Humanoid Figure Diagrams
														(Ventral and Dorsal)
													</span>
												</div>
												<div className="text-xs text-gray-500 text-center space-y-1">
													<p>
														↓ Downward arrow:
														Reduced sensation
													</p>
													<p>
														↑ Upward arrow:
														Increased sensation
													</p>
												</div>
												<div className="mt-4 text-center text-sm text-blue-600">
													[Interactive sensory mapping
													would be implemented here]
												</div>
											</div>
											<div className="mt-2">
												<Label>Personal notes:</Label>
												<Textarea
													value={
														neuropathyExamination.sensoryPersonalNotes
													}
													onChange={(e) =>
														setNeuropathyExamination(
															(prev) => ({
																...prev,
																sensoryPersonalNotes:
																	e.target
																		.value,
															})
														)
													}
													placeholder="Add notes about sensory findings"
													className="mt-1"
													rows={2}
												/>
											</div>
										</div>

										{/* Additional Tests */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label>
													4. Rhomberg's test
												</Label>
												<Select
													value={
														neuropathyExamination.rhombergTest
													}
													onValueChange={(value) =>
														setNeuropathyExamination(
															(prev) => ({
																...prev,
																rhombergTest:
																	value,
															})
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select result" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="positive">
															Positive
														</SelectItem>
														<SelectItem value="negative">
															Negative
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label>5. Gait</Label>
												<Input
													value={
														neuropathyExamination.gait
													}
													onChange={(e) =>
														setNeuropathyExamination(
															(prev) => ({
																...prev,
																gait: e.target
																	.value,
															})
														)
													}
													placeholder="Normal, ataxic, short steppage, high steppage"
													className="mt-2"
												/>
											</div>
										</div>
									</div>

									{/* C. Order Tests */}
									<div className="border rounded-lg p-4">
										<h3 className="text-lg font-semibold text-blue-700 mb-4">
											C. Order Tests
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label>
													Select tests to order:
												</Label>
												<Select
													onValueChange={(value) =>
														setNeuropathyTests(
															(prev) => [
																...prev,
																value,
															]
														)
													}>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select test" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="FBS">
															FBS
														</SelectItem>
														<SelectItem value="PPBS">
															PPBS
														</SelectItem>
														<SelectItem value="HbA1c">
															HbA1c
														</SelectItem>
														<SelectItem value="HIV">
															HIV
														</SelectItem>
														<SelectItem value="Vitamin B12">
															Vitamin B12
														</SelectItem>
														<SelectItem value="TSH">
															TSH
														</SelectItem>
														<SelectItem value="Lipid profile">
															Lipid profile
														</SelectItem>
														<SelectItem value="Nerve conduction study">
															Nerve conduction
															study
														</SelectItem>
														<SelectItem value="Sudoscan">
															Sudoscan
														</SelectItem>
														<SelectItem value="CTS protocol">
															CTS protocol
														</SelectItem>
														<SelectItem value="MRI - Whole spine">
															MRI - Whole spine
														</SelectItem>
														<SelectItem value="MRI - C spine">
															MRI - C spine
														</SelectItem>
														<SelectItem value="MRI - LS spine">
															MRI - LS spine
														</SelectItem>
														<SelectItem value="MRI - Plexus study">
															MRI - Plexus study
														</SelectItem>
													</SelectContent>
												</Select>
												{neuropathyTests.length > 0 && (
													<div className="mt-2 space-y-1">
														{neuropathyTests.map(
															(test, index) => (
																<div
																	key={index}
																	className="flex items-center justify-between bg-blue-50 p-2 rounded">
																	<span className="text-sm">
																		{test}
																	</span>
																	<Button
																		size="sm"
																		variant="ghost"
																		onClick={() =>
																			setNeuropathyTests(
																				(
																					prev
																				) =>
																					prev.filter(
																						(
																							_,
																							i
																						) =>
																							i !==
																							index
																					)
																			)
																		}>
																		<X className="h-3 w-3" />
																	</Button>
																</div>
															)
														)}
													</div>
												)}
											</div>
										</div>
									</div>

									{/* D. Referrals */}
									<div className="border rounded-lg p-4">
										<h3 className="text-lg font-semibold text-blue-700 mb-4">
											D. Referrals
										</h3>
										<div>
											<Label>Select referrals:</Label>
											<Select
												onValueChange={(value) =>
													setNeuropathyReferrals(
														(prev) => [
															...prev,
															value,
														]
													)
												}>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select referral" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Ophthalmology">
														Ophthalmology
													</SelectItem>
													<SelectItem value="Endocrinology">
														Endocrinology
													</SelectItem>
													<SelectItem value="Nephrology">
														Nephrology
													</SelectItem>
													<SelectItem value="General medicine">
														General medicine
													</SelectItem>
													<SelectItem value="Podologist">
														Podologist
													</SelectItem>
													<SelectItem value="Vascular surgeon">
														Vascular surgeon
													</SelectItem>
													<SelectItem value="Interventional radiology">
														Interventional radiology
													</SelectItem>
												</SelectContent>
											</Select>
											{neuropathyReferrals.length > 0 && (
												<div className="mt-2 space-y-1">
													{neuropathyReferrals.map(
														(referral, index) => (
															<div
																key={index}
																className="flex items-center justify-between bg-green-50 p-2 rounded">
																<span className="text-sm">
																	{referral}
																</span>
																<Button
																	size="sm"
																	variant="ghost"
																	onClick={() =>
																		setNeuropathyReferrals(
																			(
																				prev
																			) =>
																				prev.filter(
																					(
																						_,
																						i
																					) =>
																						i !==
																						index
																				)
																		)
																	}>
																	<X className="h-3 w-3" />
																</Button>
															</div>
														)
													)}
												</div>
											)}
										</div>
									</div>

									{/* E. Medication Management */}
									<div className="border rounded-lg p-4">
										<h3 className="text-lg font-semibold text-blue-700 mb-4">
											E. Medication Management
										</h3>
										<div className="space-y-4">
											<div>
												<Button
													onClick={() => {
														if (onNavigate)
															onNavigate(
																"medications"
															);
														else if (
															typeof window !==
															"undefined"
														) {
															const params =
																new URLSearchParams(
																	window.location.search
																);
															params.set(
																"tab",
																"medications"
															);
															window.location.search = `?${params}`;
														}
													}}
													className="w-full">
													<Pill className="h-4 w-4 mr-2" />
													Open Medications Page
												</Button>
												<p className="text-xs text-gray-600 mt-2">
													Integrated prescription with
													Pregabalin, Gabapentin,
													Gabagesic ointment
												</p>
											</div>
											<div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
												<p className="text-sm text-yellow-800">
													<strong>Note:</strong> When
													neurologist is consulted for
													neurological symptoms and
													patient has optimal HbA1c
													control, DM and HTN
													medications will be included
													in integrated prescription.
													Otherwise, refer to
													endocrinology or general
													medicine for DM/HTN
													medication optimization.
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* CVA/Stroke Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Brain className="h-6 w-6 mr-2" />
									CVA/Stroke Assessment
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* A. History and Symptoms */}
								<div className="border rounded-lg p-4">
									<h3 className="text-lg font-semibold text-blue-700 mb-4">
										A. History and Symptoms
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label>
												1. History of diabetes duration
											</Label>
											<Input
												value={
													cvaHistory.diabetesDuration
												}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														diabetesDuration:
															e.target.value,
													}))
												}
												placeholder="Auto-populate"
												className="mt-2"
											/>
										</div>
										<div>
											<Label>
												2. History of hypertension
												duration
											</Label>
											<Input
												value={
													cvaHistory.hypertensionDuration
												}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														hypertensionDuration:
															e.target.value,
													}))
												}
												placeholder="Auto-populate"
												className="mt-2"
											/>
										</div>
									</div>

									<div className="mt-6 space-y-4">
										<div className="flex items-center space-x-2">
											<input
												aria-label="IHD History"
												type="checkbox"
												id="ihd-history"
												checked={cvaHistory.ihdHistory}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														ihdHistory:
															e.target.checked,
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="ihd-history">
												3. History of IHD
												(Auto-populate)
											</Label>
										</div>

										<div className="flex items-center space-x-2">
											<input
												aria-label="TIA History"
												type="checkbox"
												id="tia-history"
												checked={cvaHistory.tiaHistory}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														tiaHistory:
															e.target.checked,
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="tia-history">
												4. Past history of TIA
											</Label>
										</div>

										<div className="flex items-center space-x-2">
											<input
												aria-label="Stroke History"
												type="checkbox"
												id="stroke-history"
												checked={
													cvaHistory.strokeHistory
												}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														strokeHistory:
															e.target.checked,
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="stroke-history">
												5. Past history of stroke
											</Label>
										</div>

										<div className="flex items-center space-x-2">
											<input
												aria-label="Recurrent Stroke"
												type="checkbox"
												id="recurrent-stroke"
												checked={
													cvaHistory.recurrentStroke
												}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														recurrentStroke:
															e.target.checked,
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="recurrent-stroke">
												6. Recurrent stroke
											</Label>
										</div>
									</div>

									<div className="mt-6 space-y-4">
										<div>
											<Label>
												7. Current symptoms / TIA
												symptoms / Stroke
											</Label>
											<Textarea
												value={
													cvaHistory.currentSymptoms
												}
												onChange={(e) =>
													setCvaHistory((prev) => ({
														...prev,
														currentSymptoms:
															e.target.value,
													}))
												}
												placeholder="Enter current symptoms as free text"
												className="mt-2"
												rows={3}
											/>
										</div>

										<div>
											<div className="flex items-center space-x-2 mb-2">
												<input
													aria-label="BEFAST Symptoms"
													type="checkbox"
													id="befast-symptoms"
													checked={
														cvaHistory.befastSymptoms
													}
													onChange={(e) =>
														setCvaHistory(
															(prev) => ({
																...prev,
																befastSymptoms:
																	e.target
																		.checked,
															})
														)
													}
													className="rounded"
												/>
												<Label htmlFor="befast-symptoms">
													8. BEFAST symptoms
												</Label>
											</div>
											{cvaHistory.befastSymptoms && (
												<Textarea
													value={
														cvaHistory.befastNotes
													}
													onChange={(e) =>
														setCvaHistory(
															(prev) => ({
																...prev,
																befastNotes:
																	e.target
																		.value,
															})
														)
													}
													placeholder="Personal notes about BEFAST symptoms"
													className="mt-2"
													rows={2}
												/>
											)}
										</div>
									</div>
								</div>

								{/* B. Examination */}
								<div className="border rounded-lg p-4">
									<h3 className="text-lg font-semibold text-blue-700 mb-4">
										B. Examination
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<Label>1. NIHSS score</Label>
											<div className="flex items-center space-x-2 mt-2">
												<Input
													type="number"
													value={
														cvaExamination.nihssScore
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																nihssScore:
																	parseInt(
																		e.target
																			.value
																	) || 0,
															})
														)
													}
													placeholder="0"
													className="w-20"
												/>
												<Button
													size="sm"
													variant="outline">
													<Calculator className="h-4 w-4 mr-1" />
													Calculator
												</Button>
											</div>
										</div>

										<div className="space-y-4">
											<h5 className="font-semibold">
												2. Neurological Assessment
											</h5>
											<div className="grid grid-cols-1 gap-2">
												<Input
													placeholder="Higher mental function"
													value={
														cvaExamination.higherMentalFunction
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																higherMentalFunction:
																	e.target
																		.value,
															})
														)
													}
												/>
												<Input
													placeholder="Cranial nerves"
													value={
														cvaExamination.cranialNerves
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																cranialNerves:
																	e.target
																		.value,
															})
														)
													}
												/>
												<Input
													placeholder="Motor"
													value={cvaExamination.motor}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																motor: e.target
																	.value,
															})
														)
													}
												/>
												<Input
													placeholder="Sensory"
													value={
														cvaExamination.sensory
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																sensory:
																	e.target
																		.value,
															})
														)
													}
												/>
												<Input
													placeholder="Language"
													value={
														cvaExamination.language
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																language:
																	e.target
																		.value,
															})
														)
													}
												/>
												<Input
													placeholder="Cerebellum"
													value={
														cvaExamination.cerebellum
													}
													onChange={(e) =>
														setCvaExamination(
															(prev) => ({
																...prev,
																cerebellum:
																	e.target
																		.value,
															})
														)
													}
												/>
											</div>
										</div>
									</div>

									<div className="mt-4">
										<Label>
											3. Personal notes (Audio to text
											feature or typing)
										</Label>
										<Textarea
											value={cvaExamination.personalNotes}
											onChange={(e) =>
												setCvaExamination((prev) => ({
													...prev,
													personalNotes:
														e.target.value,
												}))
											}
											placeholder="Enter examination notes"
											className="mt-2"
											rows={3}
										/>
									</div>
								</div>

								{/* C. Order Tests */}
								<div className="border rounded-lg p-4">
									<h3 className="text-lg font-semibold text-blue-700 mb-4">
										C. Order Tests
									</h3>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
										{[
											"FBS",
											"PPBS",
											"HbA1c",
											"Lipid profile",
											"ECHO",
											"ECG",
											"Trop I",
											"MRI brain stroke protocol",
											"CT plain",
											"CT Angio",
										].map((test) => (
											<div
												key={test}
												className="p-2 border rounded text-sm bg-blue-50">
												{test}
											</div>
										))}
									</div>
								</div>

								{/* D. Referral */}
								<div className="border rounded-lg p-4">
									<h3 className="text-lg font-semibold text-blue-700 mb-4">
										D. Referral
									</h3>
									<div className="p-3 border rounded bg-red-50 border-red-200">
										<span className="text-red-700 font-medium">
											Emergency services
										</span>
									</div>
								</div>

								{/* E. Management */}
								<div className="border rounded-lg p-4">
									<h3 className="text-lg font-semibold text-blue-700 mb-4">
										E. Management
									</h3>
									<div className="space-y-4">
										<div>
											<Label>Treatment approach:</Label>
											<Select
												value={
													cvaManagement.treatmentType
												}
												onValueChange={(value) =>
													setCvaManagement(
														(prev) => ({
															...prev,
															treatmentType:
																value,
														})
													)
												}>
												<SelectTrigger className="mt-2">
													<SelectValue placeholder="Select treatment" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="thrombolysis">
														Thrombolysis
													</SelectItem>
													<SelectItem value="mechanical-thrombectomy">
														Mechanical thrombectomy
													</SelectItem>
													<SelectItem value="medical-management">
														Medical management
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="flex items-center space-x-2">
											<input
												aria-label="stroke-unit"
												type="checkbox"
												id="stroke-unit"
												checked={
													cvaManagement.strokeUnit
												}
												onChange={(e) =>
													setCvaManagement(
														(prev) => ({
															...prev,
															strokeUnit:
																e.target
																	.checked,
														})
													)
												}
												className="rounded"
											/>
											<Label htmlFor="stroke-unit">
												Admission to dedicated stroke
												unit
											</Label>
										</div>

										<div>
											<Label className="font-medium">
												Medication categories:
											</Label>
											<div className="mt-2 space-y-2 text-sm">
												<div className="p-2 border rounded bg-gray-50">
													<div className="font-medium">
														Antiplatelet drugs:
													</div>
													<div className="text-gray-600">
														Aspirin, Clopidogrel,
														Cilostazol, Ticagrelor
													</div>
												</div>
												<div className="p-2 border rounded bg-gray-50">
													<div className="font-medium">
														Anticoagulant drugs:
													</div>
													<div className="text-gray-600">
														Apixaban, Dabigatran,
														Rivaroxaban, Warfarin,
														Others
													</div>
												</div>
												<div className="p-2 border rounded bg-gray-50">
													<div className="font-medium">
														Other medications:
													</div>
													<div className="text-gray-600">
														Statin, Citicoline,
														Piracetam
													</div>
												</div>
											</div>
										</div>

										<div>
											<Button
												onClick={() => {
													if (onNavigate)
														onNavigate(
															"medications"
														);
													else if (
														typeof window !==
														"undefined"
													) {
														const params =
															new URLSearchParams(
																window.location.search
															);
														params.set(
															"tab",
															"medications"
														);
														window.location.search = `?${params}`;
													}
												}}
												className="w-full">
												<Pill className="h-4 w-4 mr-2" />
												Medication Management - Add
												medications
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Tests */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<TestTube className="h-5 w-5 mr-2" />
									Order Tests
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<Label className="text-sm font-medium text-orange-700 mb-2 block">
											⚠️ Special Emphasis:
											Carotid/Vertebral Doppler
											(especially for TIA symptoms)
										</Label>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
											<div className="flex items-center space-x-2 p-3 border-2 border-orange-200 rounded bg-orange-50">
												<input
													aria-label="carotid-doppler"
													type="checkbox"
													id="carotid-doppler"
													className="rounded"
													checked={
														!!cvaTests[
															"carotid-doppler"
														]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["carotid-doppler"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="carotid-doppler"
													className="text-sm font-medium">
													Carotid/Vertebral Doppler
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="transcranial-doppler"
													type="checkbox"
													id="transcranial-doppler"
													className="rounded"
													checked={
														!!cvaTests[
															"transcranial-doppler"
														]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["transcranial-doppler"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="transcranial-doppler"
													className="text-sm">
													Transcranial Doppler
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="mri-brain"
													type="checkbox"
													id="mri-brain"
													className="rounded"
													checked={
														!!cvaTests["mri-brain"]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["mri-brain"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="mri-brain"
													className="text-sm">
													MRI Brain
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="ct-brain"
													type="checkbox"
													id="ct-brain"
													className="rounded"
													checked={
														!!cvaTests["ct-brain"]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["ct-brain"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="ct-brain"
													className="text-sm">
													CT Brain
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="ct-angio"
													type="checkbox"
													id="ecg-stroke"
													className="rounded"
													checked={
														!!cvaTests["ecg-stroke"]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["ecg-stroke"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="ecg-stroke"
													className="text-sm">
													ECG
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="echo-stroke"
													type="checkbox"
													id="echo-stroke"
													className="rounded"
													checked={
														!!cvaTests[
															"echo-stroke"
														]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["echo-stroke"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="echo-stroke"
													className="text-sm">
													Echocardiogram
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="lipid-profile-stroke"
													type="checkbox"
													id="lipid-profile-stroke"
													className="rounded"
													checked={
														!!cvaTests[
															"lipid-profile-stroke"
														]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															["lipid-profile-stroke"]:
																e.target
																	.checked,
														}))
													}
												/>
												<Label
													htmlFor="lipid-profile-stroke"
													className="text-sm">
													Lipid Profile
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="holter"
													type="checkbox"
													id="holter"
													className="rounded"
													checked={
														!!cvaTests["holter"]
													}
													onChange={(e) =>
														setCvaTests((p) => ({
															...p,
															holter: e.target
																.checked,
														}))
													}
												/>
												<Label
													htmlFor="holter"
													className="text-sm">
													Holter Monitoring
												</Label>
											</div>
										</div>
									</div>
									<Button
										className="mt-4"
										onClick={() =>
											addSelectedTests(
												cvaTests,
												cvaTestLabels
											)
										}>
										<Plus className="h-4 w-4 mr-2" />
										Add Selected Tests to Orders
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Medication Optimization */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<Pill className="h-5 w-5 mr-2" />
									Medication Optimization Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											Stroke Prevention Medications
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-3 border rounded bg-blue-50">
												<input
													aria-label="statin-stroke"
													type="checkbox"
													id="statin-stroke"
													className="rounded"
												/>
												<Label
													htmlFor="statin-stroke"
													className="text-sm font-medium">
													Statin therapy
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="sapt-stroke"
													type="checkbox"
													id="sapt-stroke"
													className="rounded"
												/>
												<Label
													htmlFor="sapt-stroke"
													className="text-sm">
													Single Anti-Platelet Therapy
													(SAPT)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="dapt-stroke"
													type="checkbox"
													id="dapt-stroke"
													className="rounded"
												/>
												<Label
													htmlFor="dapt-stroke"
													className="text-sm">
													Dual Anti-Platelet Therapy
													(DAPT)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="anticoagulant"
													type="checkbox"
													id="anticoagulant"
													className="rounded"
												/>
												<Label
													htmlFor="anticoagulant"
													className="text-sm">
													Anticoagulant (if AF)
												</Label>
											</div>
										</div>
									</div>

									<Button
										className="w-full"
										onClick={() => {
											if (onNavigate)
												onNavigate("medications");
											else if (
												typeof window !== "undefined"
											) {
												const params =
													new URLSearchParams(
														window.location.search
													);
												params.set(
													"tab",
													"medications"
												);
												window.location.search = `?${params}`;
											}
										}}>
										<ArrowRight className="h-4 w-4 mr-2" />
										Open Medications Management Page
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Education Prescription */}
						<Card className="bg-blue-50 border-blue-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-blue-700">
									Education Prescription
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											aria-label="stroke-signs"
											type="checkbox"
											id="stroke-signs"
											className="rounded"
										/>
										<Label htmlFor="stroke-signs">
											Education on FAST signs of stroke
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="stroke-prevention"
											type="checkbox"
											id="smoking-cessation"
											className="rounded"
										/>
										<Label htmlFor="smoking-cessation">
											Smoking cessation counseling
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="medication-adherence"
											type="checkbox"
											id="medication-adherence"
											className="rounded"
										/>
										<Label htmlFor="medication-adherence">
											Medication adherence counseling
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="lifestyle-modification"
											type="checkbox"
											id="lifestyle-modification"
											className="rounded"
										/>
										<Label htmlFor="lifestyle-modification">
											Lifestyle modification counseling
										</Label>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Referrals */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600">
									Referrals
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												Neurology
											</h4>
											<p className="text-sm text-gray-600">
												For comprehensive neurological
												evaluation
											</p>
										</div>
										<Button>
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to Neurology
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												Physiotherapy
											</h4>
											<p className="text-sm text-gray-600">
												For rehabilitation and mobility
												improvement
											</p>
										</div>
										<Button variant="outline">
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to Physiotherapy
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												PMR (Physical Medicine &
												Rehabilitation)
											</h4>
											<p className="text-sm text-gray-600">
												For comprehensive rehabilitation
											</p>
										</div>
										<Button variant="outline">
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to PMR
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="liver">
					<div className="space-y-6">
						{/* BMI Alert for FIB-4 Assessment */}
						<Card className="bg-red-50 border-red-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-red-700 flex items-center">
									<AlertTriangle className="h-5 w-5 mr-2" />
									Critical Alert
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="p-4 bg-red-100 rounded-lg border border-red-300">
									<div className="flex items-start space-x-2">
										<div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
										<div>
											<p className="font-medium text-red-800">
												FIB-4 Score Assessment Required
											</p>
											<p className="text-red-700 text-sm mt-1">
												If BMI ≥30, FIB-4 score must be
												assessed. Liver function test
												and platelet count essential.
											</p>
											<p className="text-red-700 text-sm mt-1 font-medium">
												⚠️ Based on FIB-4 score,
												ultrasound may be recommended
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* MASLD Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Liver className="h-6 w-6 mr-2" />
									MASLD (Metabolic Dysfunction-Associated
									Steatotic Liver Disease) Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Patient Details for FIB-4 */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-4">
											<h3 className="font-semibold text-gray-800">
												Patient Information for FIB-4
												Calculation
											</h3>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label className="text-sm font-medium">
														Age (years)
													</Label>
													<Input
														className="mt-2"
														type="number"
														placeholder="Enter age"
													/>
												</div>
												<div>
													<Label className="text-sm font-medium">
														Current BMI
													</Label>
													<Input
														className="mt-2"
														type="number"
														placeholder="Current BMI"
														step="0.1"
													/>
												</div>
											</div>
										</div>

										{/* Risk Factors */}
										<div className="space-y-4">
											<h3 className="font-semibold text-gray-800">
												MASLD Risk Factors
											</h3>
											<div className="space-y-3">
												<div className="flex items-center space-x-2">
													<input
														aria-label="obesity-masld"
														type="checkbox"
														id="obesity-masld"
														className="rounded"
													/>
													<Label htmlFor="obesity-masld">
														Obesity (BMI ≥30)
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="hypertension-masld"
														type="checkbox"
														id="diabetes-masld"
														className="rounded"
													/>
													<Label htmlFor="diabetes-masld">
														Type 2 Diabetes
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="hypertension-masld"
														type="checkbox"
														id="dyslipidemia"
														className="rounded"
													/>
													<Label htmlFor="dyslipidemia">
														Dyslipidemia
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="hypertension-masld"
														type="checkbox"
														id="metabolic-syndrome"
														className="rounded"
													/>
													<Label htmlFor="metabolic-syndrome">
														Metabolic Syndrome
													</Label>
												</div>
											</div>
										</div>
									</div>

									{/* Order Tests - moved to top per spec */}
									<Card className="bg-white shadow-lg">
										<CardHeader>
											<CardTitle className="text-navy-600 flex items-center">
												<TestTube className="h-5 w-5 mr-2" />
												Order Tests
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<Label className="text-sm font-medium text-blue-700 mb-2 block">
														Essential Tests for
														FIB-4 Calculation
													</Label>
													<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
														<div className="flex items-center space-x-2 p-3 border-2 border-blue-200 rounded bg-blue-50">
															<input
																aria-label="LFT"
																type="checkbox"
																id="lft"
																className="rounded"
																checked={
																	!!liverTests[
																		"lft"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			lft: e
																				.target
																				.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="lft"
																className="text-sm font-medium">
																Liver Function
																Test (LFT)
															</Label>
														</div>
														<div className="flex items-center space-x-2 p-3 border-2 border-blue-200 rounded bg-blue-50">
															<input
																aria-label="platelet-count"
																type="checkbox"
																id="cbc-platelet"
																className="rounded"
																checked={
																	!!liverTests[
																		"cbc-platelet"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			["cbc-platelet"]:
																				e
																					.target
																					.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="cbc-platelet"
																className="text-sm font-medium">
																CBC/Platelet
																Count
															</Label>
														</div>
														<div className="flex items-center space-x-2 p-3 border-2 border-orange-200 rounded bg-orange-50">
															<input
																aria-label="ultrasound-liver"
																type="checkbox"
																id="ultrasound-yearly"
																className="rounded"
																checked={
																	!!liverTests[
																		"ultrasound-yearly"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			["ultrasound-yearly"]:
																				e
																					.target
																					.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="ultrasound-yearly"
																className="text-sm font-medium">
																Ultrasound
																(Yearly)
															</Label>
														</div>
														<div className="flex items-center space-x-2 p-2 border rounded">
															<input
																aria-label="fibroscan"
																type="checkbox"
																id="fibroscan"
																className="rounded"
																checked={
																	!!liverTests[
																		"fibroscan"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			fibroscan:
																				e
																					.target
																					.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="fibroscan"
																className="text-sm">
																FibroScan
															</Label>
														</div>
														<div className="flex items-center space-x-2 p-2 border rounded">
															<input
																aria-label="hba1c-liver"
																type="checkbox"
																id="hba1c-liver"
																className="rounded"
																checked={
																	!!liverTests[
																		"hba1c-liver"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			["hba1c-liver"]:
																				e
																					.target
																					.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="hba1c-liver"
																className="text-sm">
																HbA1c
															</Label>
														</div>
														<div className="flex items-center space-x-2 p-2 border rounded">
															<input
																aria-label="lipid-profile-liver"
																type="checkbox"
																id="lipid-profile-liver"
																className="rounded"
																checked={
																	!!liverTests[
																		"lipid-profile-liver"
																	]
																}
																onChange={(e) =>
																	setLiverTests(
																		(
																			p
																		) => ({
																			...p,
																			["lipid-profile-liver"]:
																				e
																					.target
																					.checked,
																		})
																	)
																}
															/>
															<Label
																htmlFor="lipid-profile-liver"
																className="text-sm">
																Lipid Profile
															</Label>
														</div>
													</div>
												</div>
												<Button
													className="mt-2"
													onClick={() =>
														addSelectedTests(
															liverTests,
															liverTestLabels
														)
													}>
													<Plus className="h-4 w-4 mr-2" />
													Add Selected Tests to Orders
												</Button>
											</div>
										</CardContent>
									</Card>

									{/* FIB-4 Score Calculation */}
									<Card className="bg-blue-50 border-blue-200">
										<CardHeader>
											<CardTitle className="text-blue-700 flex items-center">
												<Calculator className="h-5 w-5 mr-2" />
												FIB-4 Score Calculation
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
												{/* Age */}
												<div>
													<Label className="text-sm font-medium">
														Age (years)
													</Label>
													<Input
														type="text"
														placeholder="e.g. 45"
														value={inputs.age}
														onChange={(e) =>
															handleChange(
																"age",
																e.target.value
															)
														}
													/>
												</div>
												{/* AST */}
												<div>
													<Label className="text-sm font-medium">
														AST (IU/L)
													</Label>
													<Input
														type="text"
														placeholder="e.g. 30"
														value={inputs.ast}
														onChange={(e) =>
															handleChange(
																"ast",
																e.target.value
															)
														}
													/>
												</div>
												{/* ALT */}
												<div>
													<Label className="text-sm font-medium">
														ALT (IU/L)
													</Label>
													<Input
														type="text"
														placeholder="e.g. 28"
														value={inputs.alt}
														onChange={(e) =>
															handleChange(
																"alt",
																e.target.value
															)
														}
													/>
												</div>
												{/* Platelet Count */}
												<div>
													<Label className="text-sm font-medium">
														Platelet Count (10³/μL)
													</Label>
													<Input
														type="text"
														placeholder="e.g. 250"
														value={
															inputs.plateletCount
														}
														onChange={(e) =>
															handleChange(
																"plateletCount",
																e.target.value
															)
														}
													/>
												</div>
											</div>

											<div className="flex items-center justify-between mb-4">
												<Button
													onClick={calculateFib4}
													className="bg-blue-600 hover:bg-blue-700">
													<Calculator className="h-4 w-4 mr-2" />{" "}
													Calculate
												</Button>
												<span className="text-xs text-gray-500">
													Formula: (Age × AST) /
													(Platelet × √ALT)
												</span>
											</div>

											<div
												className={`p-4 rounded border ${
													interpretation
														? ""
														: "border-gray-200"
												} ${
													interpretation ===
													"Low Risk"
														? "border-green-200 bg-green-100"
														: interpretation ===
														  "Intermediate Risk"
														? "border-yellow-200 bg-yellow-100"
														: interpretation ===
														  "High Risk"
														? "border-red-200 bg-red-100"
														: "bg-gray-50"
												}`}>
												<Label className="text-sm font-medium">
													Result
												</Label>
												<div
													className={`mt-2 text-lg font-bold ${colorMap[interpretation]}`}>
													{result !== null
														? result.toFixed(2)
														: "--"}
												</div>
												{interpretation && (
													<div
														className={`mt-1 text-sm font-semibold ${
															interpretation ===
															"Low Risk"
																? "text-green-800"
																: interpretation ===
																  "Intermediate Risk"
																? "text-yellow-900"
																: "text-red-800"
														}`}>
														{interpretation}
													</div>
												)}
											</div>
										</CardContent>
									</Card>

									{/* Personal Notes */}
									<div>
										<Label className="text-sm font-medium">
											Personal Notes & Assessment Summary
										</Label>
										<Textarea
											placeholder="Enter notes about liver assessment, MASLD risk factors, FIB-4 interpretation, and clinical findings..."
											className="mt-2"
											rows={3}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Medication Optimization & Action Plan */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<Pill className="h-5 w-5 mr-2" />
									Medication Optimization & Action Plan
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											Medications Recommended/To Be
											Considered
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-3 border rounded bg-green-50">
												<input
													aria-label="metformin"
													type="checkbox"
													id="dapagliflozin"
													className="rounded"
												/>
												<Label
													htmlFor="dapagliflozin"
													className="text-sm font-medium">
													Dapagliflozin (SGLT2
													inhibitor)
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded bg-green-50">
												<input
													aria-label="liraglutide"
													type="checkbox"
													id="glp1-liver"
													className="rounded"
												/>
												<Label
													htmlFor="glp1-liver"
													className="text-sm font-medium">
													GLP-1 agonist
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded bg-green-50">
												<input
													aria-label="pioglitazone-liver"
													type="checkbox"
													id="pioglitazone-liver"
													className="rounded"
												/>
												<Label
													htmlFor="pioglitazone-liver"
													className="text-sm font-medium">
													Pioglitazone
												</Label>
											</div>
										</div>
									</div>

									<Button
										className="w-full"
										onClick={() => {
											if (onNavigate)
												onNavigate("medications");
											else if (
												typeof window !== "undefined"
											) {
												const params =
													new URLSearchParams(
														window.location.search
													);
												params.set(
													"tab",
													"medications"
												);
												window.location.search = `?${params}`;
											}
										}}>
										<ArrowRight className="h-4 w-4 mr-2" />
										Open Medications Management Page
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Lifestyle Reinforcement */}
						<Card className="bg-green-50 border-green-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-green-700">
									Lifestyle Reinforcement
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											aria-label="plant-based-diet"
											type="checkbox"
											id="plant-based-diet"
											className="rounded"
										/>
										<Label htmlFor="plant-based-diet">
											Plant-based high fibre diet
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="gut-microbiome"
											type="checkbox"
											id="gut-microbiome"
											className="rounded"
										/>
										<Label htmlFor="gut-microbiome">
											Concept of Gut microbiome education
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="avoid-meat"
											type="checkbox"
											id="avoid-meat"
											className="rounded"
										/>
										<Label htmlFor="avoid-meat">
											Avoid meat consumption
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="weight-reduction"
											type="checkbox"
											id="weight-reduction"
											className="rounded"
										/>
										<Label htmlFor="weight-reduction">
											Weight reduction counseling
										</Label>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Education Prescription */}
						<Card className="bg-blue-50 border-blue-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-blue-700">
									Education Prescription
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											aria-label="liver-education"
											type="checkbox"
											id="case-stories"
											className="rounded"
										/>
										<Label htmlFor="case-stories">
											Case stories & experience videos by
											Dr Sowmya
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="lifestyle-suggestions"
											type="checkbox"
											id="lifestyle-suggestions"
											className="rounded"
										/>
										<Label htmlFor="lifestyle-suggestions">
											Additional lifestyle suggestions
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="sglt2-hygiene"
											type="checkbox"
											id="sglt2-hygiene"
											className="rounded"
										/>
										<Label htmlFor="sglt2-hygiene">
											SGLT2 inhibitor genital hygiene
											instructions
										</Label>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Referrals */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600">
									Referrals
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between p-4 border rounded-lg">
									<div>
										<h4 className="font-medium">
											Dietician
										</h4>
										<p className="text-sm text-gray-600">
											For specialized nutrition counseling
											and meal planning
										</p>
									</div>
									<Button>
										<UserCheck className="h-4 w-4 mr-2" />
										Refer to Dietician
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="foot">
					<div className="space-y-6">
						{/* PVD Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Activity className="h-6 w-6 mr-2" />
									Peripheral Vascular Disease (PVD) Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Symptoms Screening */}
									<div className="space-y-4">
										<h3 className="font-semibold text-gray-800">
											Screening Symptoms
										</h3>
										<div className="space-y-3">
											<div className="flex items-center space-x-2">
												<input
													aria-label="intermittent-claudication"
													type="checkbox"
													id="intermittent-claudication"
													className="rounded"
												/>
												<Label htmlFor="intermittent-claudication">
													Intermittent claudication
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="pain-walking"
													type="checkbox"
													id="pain-walking"
													className="rounded"
												/>
												<Label htmlFor="pain-walking">
													Pain on walking
												</Label>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Neuropathy Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Brain className="h-6 w-6 mr-2" />
									Diabetic Neuropathy Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Affected Domain */}
									<div>
										<h3 className="font-semibold text-gray-800 mb-3">
											Affected Domain
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="motor-neuropathy"
													type="checkbox"
													id="motor-neuropathy"
													className="rounded"
												/>
												<Label
													htmlFor="motor-neuropathy"
													className="text-sm">
													Motor
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="sensory-neuropathy"
													type="checkbox"
													id="sensory-neuropathy"
													className="rounded"
												/>
												<Label
													htmlFor="sensory-neuropathy"
													className="text-sm">
													Sensory
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="motor-sensory"
													type="checkbox"
													id="motor-sensory"
													className="rounded"
												/>
												<Label
													htmlFor="motor-sensory"
													className="text-sm">
													Motor + Sensory
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="autonomic-neuropathy"
													type="checkbox"
													id="autonomic-neuropathy"
													className="rounded"
												/>
												<Label
													htmlFor="autonomic-neuropathy"
													className="text-sm">
													Autonomic
												</Label>
											</div>
										</div>
									</div>

									{/* Neuropathy Disability Score Tests */}
									<div>
										<h3 className="font-semibold text-gray-800 mb-3">
											Neuropathy Disability Score - Test
											Results
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div className="space-y-3">
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Vibration sensation
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Normal
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Touch sensation
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Normal
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Deep tendon reflex/Ankle
														jerk
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Present
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Pain sensation
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Normal
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Temperature sensation
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Normal
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className="flex items-center justify-between p-2 border rounded">
													<Label className="text-sm">
														Joint position sense
													</Label>
													<Select>
														<SelectTrigger className="w-24">
															<SelectValue placeholder="Score" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="0">
																Normal
															</SelectItem>
															<SelectItem value="1">
																Reduced
															</SelectItem>
															<SelectItem value="2">
																Absent
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Diabetic Foot Specific Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Footprints className="h-6 w-6 mr-2" />
									Diabetic Foot Specific Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Current Symptoms */}
									<div>
										<h3 className="font-semibold text-gray-800 mb-3">
											Current Symptoms
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-3">
												<div className="flex items-center space-x-2">
													<input
														aria-label="foot-pain"
														type="checkbox"
														id="foot-pain"
														className="rounded"
													/>
													<Label htmlFor="foot-pain">
														Foot pain/burning
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="tingling"
														type="checkbox"
														id="tingling"
														className="rounded"
													/>
													<Label htmlFor="tingling">
														Tingling sensation
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="numbness"
														type="checkbox"
														id="numbness"
														className="rounded"
													/>
													<Label htmlFor="numbness">
														Numbness
													</Label>
												</div>
											</div>
											<div className="space-y-3">
												<div className="flex items-center space-x-2">
													<input
														aria-label="foot-deformity"
														type="checkbox"
														id="foot-deformity"
														className="rounded"
													/>
													<Label htmlFor="foot-deformity">
														Foot deformity
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="calluses"
														type="checkbox"
														id="calluses"
														className="rounded"
													/>
													<Label htmlFor="calluses">
														Calluses/corns
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<input
														aria-label="foot-ulcer"
														type="checkbox"
														id="foot-ulcer"
														className="rounded"
													/>
													<Label htmlFor="foot-ulcer">
														Current foot ulcer
													</Label>
												</div>
											</div>
										</div>
									</div>

									{/* Neuropathy Type */}
									<div>
										<h3 className="font-semibold text-gray-800 mb-3">
											Neuropathy Type
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="painful-neuropathy"
													type="radio"
													name="neuropathy-type"
													id="painful-neuropathy"
													className="rounded"
												/>
												<Label
													htmlFor="painful-neuropathy"
													className="text-sm">
													Painful neuropathy
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="painless-neuropathy"
													type="radio"
													name="neuropathy-type"
													id="painless-neuropathy"
													className="rounded"
												/>
												<Label
													htmlFor="painless-neuropathy"
													className="text-sm">
													Painless neuropathy
												</Label>
											</div>
										</div>
									</div>

									{/* Personal Notes */}
									<div>
										<Label className="text-sm font-medium">
											Personal Notes & Assessment Summary
										</Label>
										<Textarea
											placeholder="Enter notes about diabetic foot examination, neuropathy findings, PVD assessment, and risk stratification..."
											className="mt-2"
											rows={3}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Tests */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<TestTube className="h-5 w-5 mr-2" />
									Order Tests
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<Label className="text-sm font-medium text-blue-700 mb-2 block">
											Recommended Tests
										</Label>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
											<div className="flex items-center space-x-2 p-3 border-2 border-blue-200 rounded bg-blue-50">
												<input
													aria-label="abi-doppler"
													type="checkbox"
													id="abi-doppler"
													className="rounded"
												/>
												<Label
													htmlFor="abi-doppler"
													className="text-sm font-medium">
													ABI Doppler
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border-2 border-orange-200 rounded bg-orange-50">
												<input
													aria-label="toe-pressure"
													type="checkbox"
													id="vitamin-b12"
													className="rounded"
												/>
												<Label
													htmlFor="vitamin-b12"
													className="text-sm font-medium">
													Vitamin B12
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="nerve-conduction"
													type="checkbox"
													id="nerve-conduction"
													className="rounded"
												/>
												<Label
													htmlFor="nerve-conduction"
													className="text-sm">
													Nerve conduction study
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="foot-xray"
													type="checkbox"
													id="foot-xray"
													className="rounded"
												/>
												<Label
													htmlFor="foot-xray"
													className="text-sm">
													Foot X-ray
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-2 border rounded">
												<input
													aria-label="wound-culture"
													type="checkbox"
													id="wound-culture"
													className="rounded"
												/>
												<Label
													htmlFor="wound-culture"
													className="text-sm">
													Wound culture (if ulcer)
												</Label>
											</div>
										</div>
									</div>
									<Button className="mt-4">
										<Plus className="h-4 w-4 mr-2" />
										Add Selected Tests to Orders
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Action Plan & Medication Optimization */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600 flex items-center">
									<Pill className="h-5 w-5 mr-2" />
									Action Plan & Medication Optimization
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											For PVD - Required Medications
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-3 border rounded bg-red-50">
												<input
													aria-label="aspirin-pvd"
													type="checkbox"
													id="aspirin-pvd"
													className="rounded"
												/>
												<Label
													htmlFor="aspirin-pvd"
													className="text-sm font-medium">
													Aspirin
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded bg-red-50">
												<input
													aria-label="clopidogrel-pvd"
													type="checkbox"
													id="statin-pvd"
													className="rounded"
												/>
												<Label
													htmlFor="statin-pvd"
													className="text-sm font-medium">
													Statin
												</Label>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											For Painful Neuropathy
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="pregabalin"
													type="checkbox"
													id="pregabalin"
													className="rounded"
												/>
												<Label
													htmlFor="pregabalin"
													className="text-sm">
													Pregabalin
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="gabapentin"
													type="checkbox"
													id="gabapentin"
													className="rounded"
												/>
												<Label
													htmlFor="gabapentin"
													className="text-sm">
													Gabapentin
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="duloxetine"
													type="checkbox"
													id="duloxetine"
													className="rounded"
												/>
												<Label
													htmlFor="duloxetine"
													className="text-sm">
													Duloxetine
												</Label>
											</div>
											<div className="flex items-center space-x-2 p-3 border rounded">
												<input
													aria-label="amitriptyline"
													type="checkbox"
													id="amitriptyline"
													className="rounded"
												/>
												<Label
													htmlFor="amitriptyline"
													className="text-sm">
													Amitriptyline
												</Label>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-medium text-gray-800 mb-3">
											Foot Care & Footwear
										</h4>
										<div className="space-y-3">
											<div className="flex items-center space-x-2">
												<input
													aria-label="diabetic-footwear"
													type="checkbox"
													id="diabetic-footwear"
													className="rounded"
												/>
												<Label htmlFor="diabetic-footwear">
													Recommend diabetic footwear
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="orthotic-insoles"
													type="checkbox"
													id="orthotic-insoles"
													className="rounded"
												/>
												<Label htmlFor="orthotic-insoles">
													Custom orthotic insoles
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<input
													aria-label="wound-dressing"
													type="checkbox"
													id="wound-dressing"
													className="rounded"
												/>
												<Label htmlFor="wound-dressing">
													Specialized wound dressing
												</Label>
											</div>
										</div>
									</div>

									<Button
										className="w-full"
										onClick={() => {
											if (onNavigate)
												onNavigate("medications");
											else if (
												typeof window !== "undefined"
											) {
												const params =
													new URLSearchParams(
														window.location.search
													);
												params.set(
													"tab",
													"medications"
												);
												window.location.search = `?${params}`;
											}
										}}>
										<ArrowRight className="h-4 w-4 mr-2" />
										Open Medications Management Page
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Education Prescription */}
						<Card className="bg-blue-50 border-blue-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-blue-700">
									Education Prescription
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											aria-label="foot-care-education"
											type="checkbox"
											id="foot-care-education"
											className="rounded"
										/>
										<Label htmlFor="foot-care-education">
											Comprehensive foot care education
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="daily-inspection"
											type="checkbox"
											id="daily-inspection"
											className="rounded"
										/>
										<Label htmlFor="daily-inspection">
											Daily foot inspection technique
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="proper-footwear"
											type="checkbox"
											id="proper-footwear"
											className="rounded"
										/>
										<Label htmlFor="proper-footwear">
											Proper footwear selection
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="wound-care"
											type="checkbox"
											id="wound-care"
											className="rounded"
										/>
										<Label htmlFor="wound-care">
											Wound care instructions
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="smoking-cessation-foot"
											type="checkbox"
											id="smoking-cessation-foot"
											className="rounded"
										/>
										<Label htmlFor="smoking-cessation-foot">
											Stop smoking education
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input
											aria-label="foot-care-videos"
											type="checkbox"
											id="foot-care-videos"
											className="rounded"
										/>
										<Label htmlFor="foot-care-videos">
											Educational videos & case stories
										</Label>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Referrals */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-navy-600">
									Referrals
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												Vascular Surgeon
											</h4>
											<p className="text-sm text-gray-600">
												For PVD evaluation and
												management
											</p>
										</div>
										<Button>
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to Vascular Surgery
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												Surgeon (if ulcer present)
											</h4>
											<p className="text-sm text-gray-600">
												For wound assessment and
												surgical intervention
											</p>
										</div>
										<Button variant="outline">
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to Surgery
										</Button>
									</div>
									<div className="flex items-center justify-between p-4 border rounded-lg">
										<div>
											<h4 className="font-medium">
												Podiatrist
											</h4>
											<p className="text-sm text-gray-600">
												For specialized foot care and
												footwear
											</p>
										</div>
										<Button variant="outline">
											<UserCheck className="h-4 w-4 mr-2" />
											Refer to Podiatry
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="mental-health">
					<div className="space-y-6">
						{/* Mental Health Tracking */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Mental Health Monitoring
								</CardTitle>
							</CardHeader>
							<CardContent>
								{renderMentalHealthView()}

								<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="p-4 border rounded-lg">
										<h4 className="font-semibold mb-2">
											Latest PHQ-9 Score
										</h4>
										<div className="text-2xl font-bold text-blue-600 mb-2">
											3
										</div>
										<p className="text-sm text-gray-600">
											Minimal depression
										</p>
										<p className="text-xs text-gray-500">
											Last assessed: July 2024
										</p>
									</div>
									<div className="p-4 border rounded-lg">
										<h4 className="font-semibold mb-2">
											Latest GAD-7 Score
										</h4>
										<div className="text-2xl font-bold text-green-600 mb-2">
											3
										</div>
										<p className="text-sm text-gray-600">
											Minimal anxiety
										</p>
										<p className="text-xs text-gray-500">
											Last assessed: July 2024
										</p>
									</div>
									<div className="p-4 border rounded-lg">
										<h4 className="font-semibold mb-2">
											Stress Level
										</h4>
										<div className="text-2xl font-bold text-yellow-600 mb-2">
											3/10
										</div>
										<p className="text-sm text-gray-600">
											Low stress
										</p>
										<p className="text-xs text-gray-500">
											Self-reported
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Mental Health Assessment Form */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
									Mental Health Assessment - Data Input
									<Button
										size="sm"
										variant="outline">
										<Plus className="h-4 w-4 mr-2" />
										Quick Add
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<Label htmlFor="assessment-date">
											Assessment Date
										</Label>
										<Input
											id="assessment-date"
											type="date"
										/>
									</div>
									<div>
										<Label htmlFor="phq9">
											PHQ-9 Score (0-27)
										</Label>
										<Input
											id="phq9"
											type="number"
											min="0"
											max="27"
											placeholder="Enter PHQ-9 score"
											value={newPhq9}
											onChange={(e) =>
												setNewPhq9(e.target.value)
											}
										/>
										<p className="text-xs text-gray-500 mt-1">
											0-4: Minimal, 5-9: Mild, 10-14:
											Moderate, 15-19: Moderately severe,
											20-27: Severe
										</p>
									</div>
									<div>
										<Label htmlFor="gad7">
											GAD-7 Score (0-21)
										</Label>
										<Input
											id="gad7"
											type="number"
											min="0"
											max="21"
											placeholder="Enter GAD-7 score"
											value={newGad7}
											onChange={(e) =>
												setNewGad7(e.target.value)
											}
										/>
										<p className="text-xs text-gray-500 mt-1">
											0-4: Minimal, 5-9: Mild, 10-14:
											Moderate, 15-21: Severe
										</p>
									</div>
									<div>
										<Label htmlFor="stress">
											Stress Level (1-10)
										</Label>
										<Input
											id="stress"
											type="number"
											min="1"
											max="10"
											placeholder="Enter stress level"
											value={newStress}
											onChange={(e) =>
												setNewStress(e.target.value)
											}
										/>
										<p className="text-xs text-gray-500 mt-1">
											1-3: Low, 4-6: Moderate, 7-10: High
										</p>
									</div>
								</div>
								<Button
									className="mt-4"
									onClick={addMentalHealthScore}>
									Save Assessment
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="orders">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center">
								<TestTube className="h-6 w-6 mr-2" />
								Order Tests & Investigations
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{/* Nephrology Lab Tests */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Nephrology Laboratory Tests
										</h3>
										<div className="space-y-2">
											{[
												"Serum Creatinine",
												"Urine Routine",
												"Urine ACR",
												"Urine PCR",
												"Potassium",
												"Sodium",
												"Chloride",
												"Ultrasound Abdomen",
												"Calcium",
												"Phosphorus",
												"Uric Acid",
												"Vitamin D",
												"PTH",
												"FBS",
												"PPBS",
												"HbA1c",
											].map((test) => (
												<div
													key={test}
													className="flex items-center justify-between">
													<span className="text-sm">
														{test}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToOrders(test)
														}>
														Order
													</Button>
												</div>
											))}
										</div>
									</div>

									{/* Imaging */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Imaging Studies
										</h3>
										<div className="space-y-2">
											{[
												"ECG",
												"ECHO",
												"Chest X-ray",
												"Ultrasound Abdomen",
												"CT Scan",
											].map((imaging) => (
												<div
													key={imaging}
													className="flex items-center justify-between">
													<span className="text-sm">
														{imaging}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToOrders(imaging)
														}>
														Order
													</Button>
												</div>
											))}
										</div>
									</div>

									{/* Specialized Tests */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Specialized Tests
										</h3>
										<div className="space-y-2">
											{[
												"Fundus Photography",
												"NCV Study",
												"ABI",
												"FibroScan",
												"Stress Test",
											].map((test) => (
												<div
													key={test}
													className="flex items-center justify-between">
													<span className="text-sm">
														{test}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToOrders(test)
														}>
														Order
													</Button>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Pending Orders */}
								{pendingOrders.length > 0 && (
									<div className="mt-6">
										<h3 className="font-semibold mb-3">
											Pending Orders (
											{pendingOrders.length})
										</h3>
										<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
											<div className="flex flex-wrap gap-2">
												{pendingOrders.map(
													(order, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="bg-blue-100 text-blue-800">
															{order}
														</Badge>
													)
												)}
											</div>
											<Button
												className="mt-3"
												onClick={() =>
													setPendingOrders([])
												}>
												Submit All Orders
											</Button>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="referrals">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center">
								<Users className="h-6 w-6 mr-2" />
								Referrals & Consultations
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{/* Nephrology Referrals */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Nephrology Referrals
										</h3>
										<div className="space-y-2">
											{[
												"Ophthalmologist",
												"Neurologist",
												"Cardiologist",
												"Nutritionist",
												"Others",
											].map((specialty) => (
												<div
													key={specialty}
													className="flex items-center justify-between">
													<span className="text-sm">
														{specialty}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToReferrals(
																specialty
															)
														}>
														Refer
													</Button>
												</div>
											))}
										</div>
									</div>

									{/* Surgical Specialties */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Surgical Specialties
										</h3>
										<div className="space-y-2">
											{[
												"Vascular Surgery",
												"Plastic Surgery",
												"General Surgery",
												"Orthopedics",
											].map((specialty) => (
												<div
													key={specialty}
													className="flex items-center justify-between">
													<span className="text-sm">
														{specialty}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToReferrals(
																specialty
															)
														}>
														Refer
													</Button>
												</div>
											))}
										</div>
									</div>

									{/* Allied Health */}
									<div className="border rounded-lg p-4">
										<h3 className="font-semibold mb-3">
											Allied Health
										</h3>
										<div className="space-y-2">
											{[
												"Ophthalmology",
												"Podiatry",
												"Dietitian",
												"Physiotherapy",
												"Psychology",
											].map((service) => (
												<div
													key={service}
													className="flex items-center justify-between">
													<span className="text-sm">
														{service}
													</span>
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															addToReferrals(
																service
															)
														}>
														Refer
													</Button>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Pending Referrals */}
								{pendingReferrals.length > 0 && (
									<div className="mt-6">
										<h3 className="font-semibold mb-3">
											Pending Referrals (
											{pendingReferrals.length})
										</h3>
										<div className="bg-green-50 border border-green-200 rounded-lg p-4">
											<div className="flex flex-wrap gap-2">
												{pendingReferrals.map(
													(referral, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="bg-green-100 text-green-800">
															{referral}
														</Badge>
													)
												)}
											</div>
											<Button
												className="mt-3"
												onClick={() =>
													setPendingReferrals([])
												}>
												Submit All Referrals
											</Button>
										</div>
									</div>
								)}

								{/* Referral Template */}
								<div className="mt-6">
									<h3 className="font-semibold mb-3">
										Referral Letter Template
									</h3>
									<div className="border rounded-lg p-4">
										<Textarea
											placeholder="Dear Colleague,

I am referring this patient for your expert opinion and management...

Patient Details:
- Name: [Patient Name]
- Age: [Age]
- Diagnosis: [Primary Diagnosis]
- Current Medications: [List]
- Specific Concern: [Reason for referral]

Thank you for your time and expertise.

Best regards,
[Your Name]"
											rows={10}
											className="w-full"
										/>
										<Button className="mt-3">
											Generate Referral Letter
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* PMR Subtab */}
				<TabsContent value="pmr">
					<div className="space-y-6">
						{/* Diabetic Foot (PMR) */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									PMR — Diabetic Foot
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label>
											Duration of Diabetes (years)
										</Label>
										<Input placeholder="e.g. 5" />
										<p className="text-xs text-gray-500 mt-1">
											If ≥1 year: ensure annual screening.
										</p>
									</div>
									<div>
										<Label>Treatment Type</Label>
										<Select>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="oral">
													Oral drugs only
												</SelectItem>
												<SelectItem value="oral+insulin">
													Oral + Insulin
												</SelectItem>
											</SelectContent>
										</Select>
										<p className="text-xs text-gray-500 mt-1">
											Helps infer long-term control.
										</p>
									</div>
									<div>
										<Label>Medication Adherence (%)</Label>
										<Input placeholder="e.g. 90" />
									</div>
									<div>
										<Label>Diet Adherence (%)</Label>
										<Input placeholder="e.g. 85" />
									</div>
								</div>

								<div>
									<Label className="font-medium">
										Symptom Screening (check positives)
									</Label>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
										{[
											"Tingling / numbness / paresthesia",
											"Intermittent claudication (PVD)",
											"Not able to grip chappals",
											"Sensory loss: hot/cold or sock feel",
											"Foot deformity (hallux valgus, claw)",
											"Skin changes: hyperpigmentation, fissures, corns",
											"History of foot ulcer",
											"Balance issues with feet on ground",
											"Prior amputation",
											"Lower limb joint pain / OA",
										].map((label, idx) => (
											<label
												key={idx}
												className="flex items-center space-x-2 text-sm">
												<Checkbox />
												<span>{label}</span>
											</label>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<Label>Last Ulcer — Site</Label>
										<Input placeholder="e.g. plantar hallux" />
										<Label className="mt-2">When</Label>
										<Input placeholder="e.g. Jan 2025" />
										<Label className="mt-2">
											Time to heal
										</Label>
										<Input placeholder="e.g. 4 weeks" />
									</div>
									<div>
										<Label>
											Current Ulcer —
											Site/Size/Base/Staging
										</Label>
										<Textarea
											rows={4}
											placeholder="Describe current ulcer if present"
										/>
									</div>
									<div>
										<Label>Cellulitis Details</Label>
										<Textarea
											rows={4}
											placeholder="Redness, warmth, lymphangitis, etc."
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<Label>Neuropathy Tests</Label>
										<div className="space-y-2 mt-2 text-sm">
											<label className="flex items-center space-x-2">
												<Checkbox /> <span>IPTT</span>
											</label>
											<label className="flex items-center space-x-2">
												<Checkbox />{" "}
												<span>Monofilament</span>
											</label>
											<Textarea
												rows={3}
												placeholder="Personal notes"
											/>
										</div>
									</div>
									<div>
										<Label>
											Vasculopathy — Peripheral Pulses
										</Label>
										<div className="mt-2 border rounded">
											<table className="w-full text-sm">
												<thead className="bg-gray-50">
													<tr>
														<th className="p-2 text-left"></th>
														<th className="p-2 text-left">
															Right
														</th>
														<th className="p-2 text-left">
															Left
														</th>
													</tr>
												</thead>
												<tbody>
													<tr className="border-t">
														<td className="p-2">
															Dorsalis Pedis
														</td>
														<td className="p-2">
															<Checkbox /> Present
														</td>
														<td className="p-2">
															<Checkbox /> Present
														</td>
													</tr>
													<tr className="border-t">
														<td className="p-2">
															Posterior Tibial
														</td>
														<td className="p-2">
															<Checkbox /> Present
														</td>
														<td className="p-2">
															<Checkbox /> Present
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<div>
										<Label>Autonomic Neuropathy</Label>
										<div className="mt-2 space-y-2 text-sm">
											<label className="flex items-center space-x-2">
												<Checkbox />{" "}
												<span>Nail changes</span>
											</label>
											<label className="flex items-center space-x-2">
												<Checkbox />{" "}
												<span>Skin changes</span>
											</label>
										</div>
									</div>
								</div>

								<div>
									<Label className="font-medium">
										Motor Power (0/5 to 5/5)
									</Label>
									<div className="overflow-x-auto mt-2">
										<table className="w-full text-sm border">
											<thead className="bg-gray-50">
												<tr>
													<th className="p-2 text-left"></th>
													<th className="p-2 text-left">
														Right
													</th>
													<th className="p-2 text-left">
														Left
													</th>
												</tr>
											</thead>
											<tbody>
												{[
													"Dorsi Flexion",
													"Plantar Flexion",
													"Extensor Hallucis Longus",
													"Intrinsics",
												].map((muscle) => (
													<tr
														key={muscle}
														className="border-t">
														<td className="p-2">
															{muscle}
														</td>
														<td className="p-2">
															<Select>
																<SelectTrigger className="w-28">
																	<SelectValue placeholder="Select" />
																</SelectTrigger>
																<SelectContent>
																	{[
																		0, 1, 2,
																		3, 4, 5,
																	].map(
																		(n) => (
																			<SelectItem
																				key={
																					n
																				}
																				value={`${n}/5`}>
																				{
																					n
																				}
																				/5
																			</SelectItem>
																		)
																	)}
																</SelectContent>
															</Select>
														</td>
														<td className="p-2">
															<Select>
																<SelectTrigger className="w-28">
																	<SelectValue placeholder="Select" />
																</SelectTrigger>
																<SelectContent>
																	{[
																		0, 1, 2,
																		3, 4, 5,
																	].map(
																		(n) => (
																			<SelectItem
																				key={
																					n
																				}
																				value={`${n}/5`}>
																				{
																					n
																				}
																				/5
																			</SelectItem>
																		)
																	)}
																</SelectContent>
															</Select>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="md:col-span-2">
										<Label>Diagnosis</Label>
										<Textarea
											rows={3}
											placeholder="e.g. Diabetic neuropathy with vasculopathy, autonomic neuropathy with ulcer over... grade... with foot deformity..."
										/>
									</div>
									<div>
										<Label>Advice (select to add)</Label>
										<Select>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Choose advice" />
											</SelectTrigger>
											<SelectContent>
												{[
													"Emollients",
													"Salicylic acid",
													"Debridement and dressing",
													"Amoxicillin + Clavulanic acid",
													"Ciprofloxacin",
													"Clindamycin",
													"Linezolid",
												].map((a) => (
													<SelectItem
														key={a}
														value={a}>
														{a}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-xs text-gray-500 mt-1">
											Integrated with prescriptions to
											print.
										</p>
									</div>
									<div>
										<Label>Footwear Customization</Label>
										<Input placeholder="Free-text customization requirements" />
										<Label className="mt-2">
											Orthotic Device
										</Label>
										<Input placeholder="Free-text customization requirements" />
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<Label>Education</Label>
										<div className="mt-2 space-y-2 text-sm">
											<label className="flex items-center space-x-2">
												<Checkbox />{" "}
												<span>Diabetic foot care</span>
											</label>
											<label className="flex items-center space-x-2">
												<Checkbox />{" "}
												<span>Diet chart</span>
											</label>
										</div>
									</div>
									<div>
										<Label>Referrals</Label>
										<Select
											onValueChange={(v) =>
												addToReferrals(v)
											}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Add referral" />
											</SelectTrigger>
											<SelectContent>
												{[
													"Nutrition",
													"Endocrine",
													"General Surgery",
													"Plastic Surgery",
													"Others",
												].map((r) => (
													<SelectItem
														key={r}
														value={r}>
														{r}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Input
											className="mt-2"
											placeholder="Referral notes (optional)"
										/>
									</div>
									<div>
										<Label>Order Tests</Label>
										<Select
											onValueChange={(v) =>
												addToOrders(v)
											}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Add test" />
											</SelectTrigger>
											<SelectContent>
												{[
													"X-ray Foot",
													"MRI Foot",
													"Doppler Peripheral Artery",
													"DVT scan",
													"USG Extremity",
												].map((t) => (
													<SelectItem
														key={t}
														value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Follow-up</Label>
										<div className="flex items-center space-x-2 mt-2">
											<Input
												className="w-20"
												placeholder="#"
											/>
											<Select>
												<SelectTrigger className="w-32">
													<SelectValue placeholder="Unit" />
												</SelectTrigger>
												<SelectContent>
													{[
														"days",
														"weeks",
														"months",
														"year",
													].map((u) => (
														<SelectItem
															key={u}
															value={u}>
															{u}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Stroke & Rehabilitation (PMR) */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									PMR — Stroke & Rehabilitation
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<Label>Stroke Type</Label>
										<Select>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="New or Old" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="new">
													New stroke
												</SelectItem>
												<SelectItem value="old">
													Old stroke
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="md:col-span-3">
										<Label>
											Screen-positive persistent symptoms
											(check)
										</Label>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
											{[
												"Weakness persists",
												"Speech difficulty",
												"Swallowing difficulty",
												"Cognitive issues (recognition/memory)",
												"Urinary or bowel control issues",
											].map((s, i) => (
												<label
													key={i}
													className="flex items-center space-x-2">
													<Checkbox />{" "}
													<span>{s}</span>
												</label>
											))}
										</div>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<Label>HbA1c (%)</Label>
										<Input
											placeholder="Auto"
											defaultValue="8.2"
										/>
									</div>
									<div>
										<Label>BP (mmHg)</Label>
										<Input
											placeholder="Auto"
											defaultValue="130/84"
										/>
									</div>
									<div>
										<Label>LDL (mg/dL)</Label>
										<Input
											placeholder="Auto"
											defaultValue="77"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label>
											NIHSS / mRS / Scandinavian Scale
										</Label>
										<Textarea
											rows={4}
											placeholder="Enter scores or notes"
										/>
										<Label className="mt-2">GCS</Label>
										<Textarea
											rows={3}
											placeholder="GCS notes"
										/>
										<Label className="mt-2">
											Cognition (MMSE / MOCA / ACER)
										</Label>
										<Textarea
											rows={3}
											placeholder="Cognition notes"
										/>
									</div>
									<div>
										<Label>
											Motor exam (tone, power, reflexes,
											ROM)
										</Label>
										<Textarea
											rows={4}
											placeholder="Motor examination notes"
										/>
										<Label className="mt-2">Gait</Label>
										<Textarea
											rows={3}
											placeholder="Gait notes"
										/>
										<Label className="mt-2">
											Functional status (FIM / Barthel)
										</Label>
										<Textarea
											rows={3}
											placeholder="Functional status notes"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
									<div className="md:col-span-2">
										<Label>
											Advice (opens Medications)
										</Label>
										<Select
											onValueChange={(value) => {
												if (onNavigate)
													onNavigate("medications");
												else if (
													typeof window !==
													"undefined"
												) {
													const params =
														new URLSearchParams(
															window.location.search
														);
													params.set(
														"tab",
														"medications"
													);
													window.location.search = `?${params}`;
												}
											}}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{[
													"Syndopa",
													"Amantadine",
													"Modafinil",
													"Baclofen",
													"Tizanidine",
													"Tolperisone",
													"Donepezil",
													"Memantine",
													"Bromocriptine",
													"Botox injection",
													"Others",
												].map((m) => (
													<SelectItem
														key={m}
														value={m}>
														{m}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Order Tests</Label>
										<Select
											onValueChange={(v) =>
												addToOrders(v)
											}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Add test" />
											</SelectTrigger>
											<SelectContent>
												{[
													"HbA1c",
													"Lipid profile",
													"Serum creatinine",
													"Blood urea",
													"Electrolytes",
													"Urine routine",
													"CT",
													"EEG",
													"X-ray",
													"US Shoulder",
													"US Wrist",
													"US Hip",
													"US Knee",
												].map((t) => (
													<SelectItem
														key={t}
														value={t}>
														{t}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label>Referrals</Label>
										<Select
											onValueChange={(v) =>
												addToReferrals(v)
											}>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Add referral" />
											</SelectTrigger>
											<SelectContent>
												{[
													"Physiotherapy",
													"Occupational Therapy",
													"Speech & Language",
													"Swallow Therapy",
													"Orthotics",
													"Neurology",
												].map((r) => (
													<SelectItem
														key={r}
														value={r}>
														{r}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Input
											className="mt-2"
											placeholder="Referral personal notes / interventions"
										/>
									</div>
									<div>
										<Label>Follow-up Advice</Label>
										<Select>
											<SelectTrigger className="mt-2">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1m">
													1 month (spasticity,
													uncontrolled HbA1c/BP/LDL)
												</SelectItem>
												<SelectItem value="3m">
													3 months (spasticity, good
													control)
												</SelectItem>
												<SelectItem value="6m">
													6 months (stable, no
													symptoms)
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
