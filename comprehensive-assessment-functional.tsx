"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function ComprehensiveAssessmentFunctional() {
	const [viewMode, setViewMode] = useState({
		nephropathy: "chart",
		mentalHealth: "chart",
	});

	const [selectedAssessment, setSelectedAssessment] = useState("");
	const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(
		{}
	);
	const [actionPlans, setActionPlans] = useState<Record<string, string>>({});
	const [drawingData, setDrawingData] = useState<Record<string, any>>({});
	const [customFollowUp, setCustomFollowUp] = useState<
		Record<string, string>
	>({});

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

	return (
		<div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-3xl font-bold text-navy-600 mb-6">
				Comprehensive Assessment of Complications and Comorbidities
			</h1>

			<Tabs
				defaultValue="complications"
				className="w-full">
				<TabsList className="mb-4">
					<TabsTrigger value="complications">
						Complications Assessment
					</TabsTrigger>
					<TabsTrigger value="retinopathy">
						Retinopathy Specialist
					</TabsTrigger>
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
			</Tabs>
		</div>
	);
}
