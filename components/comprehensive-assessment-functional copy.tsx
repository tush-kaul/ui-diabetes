"use client";

import React, { useState, useEffect } from "react";
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
import {
	Eye,
	Heart,
	Brain,
	Activity,
	Zap,
	Footprints,
	Stethoscope,
	LeafIcon as Liver,
	TestTube,
	UserCheck,
	Save,
	Plus,
	X,
} from "lucide-react";
import {
	RetinopathyAssessment,
	NephrologyAssessment,
	MentalHealthTracking,
	CardiacAssessment,
	NeurologicalAssessment,
	LiverAssessment,
	DiabeticFootAssessment,
	AssessmentItem,
	AssessmentProps,
	ViewMode,
} from "./assessment";
import { getRiskColor, getStatusColor } from "./assessment/utils";

export default function ComprehensiveAssessmentFunctional({
	initialSubTab,
	onNavigate,
}: AssessmentProps) {
	const [activeTab, setActiveTab] = useState(
		initialSubTab || "complications"
	);
	const [viewMode, setViewMode] = useState<ViewMode>({
		nephropathy: "chart",
		mentalHealth: "chart",
	});
	const [pendingOrders, setPendingOrders] = useState<string[]>([]);
	const [pendingReferrals, setPendingReferrals] = useState<string[]>([]);
	const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(
		{}
	);
	const [actionPlans, setActionPlans] = useState<Record<string, string>>({});
	const [customFollowUp, setCustomFollowUp] = useState<
		Record<string, string>
	>({});
	const [expandedAssessments, setExpandedAssessments] = useState<
		Record<string, boolean>
	>({});

	// Update active tab when initialSubTab changes
	useEffect(() => {
		if (initialSubTab) {
			setActiveTab(initialSubTab);
		}
	}, [initialSubTab]);

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

	const toggleViewMode = (metric: string) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
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

	const removeOrder = (index: number) => {
		setPendingOrders((prev) => prev.filter((_, i) => i !== index));
	};

	const removeReferral = (index: number) => {
		setPendingReferrals((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-3xl font-bold text-navy-600 mb-6">
				Comprehensive Assessment of Complications and Comorbidities
			</h1>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full">
				<TabsList className="mb-4 overflow-x-auto whitespace-nowrap">
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
					<TabsTrigger value="neuro">Neurological</TabsTrigger>
					<TabsTrigger value="liver">Liver Assessment</TabsTrigger>
					<TabsTrigger value="foot">Diabetic Foot</TabsTrigger>
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
													{item.reports.length > 0 ? (
														<div>
															<h3 className="text-lg font-semibold mb-3">
																Reports &
																Documents
															</h3>
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
														</div>
													) : (
														<p className="text-gray-500">
															No reports available
														</p>
													)}
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
					<RetinopathyAssessment />
				</TabsContent>

				<TabsContent value="nephropathy">
					<NephrologyAssessment onNavigate={onNavigate} />
				</TabsContent>

				<TabsContent value="mental-health">
					<MentalHealthTracking
						viewMode={viewMode}
						onViewModeChange={toggleViewMode}
					/>
				</TabsContent>

				<TabsContent value="orders">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Test Orders & Investigations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-sm text-blue-800 mb-3">
									Pending orders from assessments will appear
									here
								</p>
								{pendingOrders.length > 0 ? (
									<div className="space-y-2">
										{pendingOrders.map((order, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-3 bg-white rounded border">
												<span className="font-medium">
													{order}
												</span>
												<Button
													size="sm"
													variant="ghost"
													onClick={() =>
														removeOrder(index)
													}>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500 text-center py-4">
										No orders pending
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="referrals">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Specialist Referrals
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<p className="text-sm text-green-800 mb-3">
									Pending referrals from assessments will
									appear here
								</p>
								{pendingReferrals.length > 0 ? (
									<div className="space-y-2">
										{pendingReferrals.map(
											(referral, index) => (
												<div
													key={index}
													className="flex items-center justify-between p-3 bg-white rounded border">
													<span className="font-medium">
														{referral}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															removeReferral(
																index
															)
														}>
														<X className="h-4 w-4" />
													</Button>
												</div>
											)
										)}
									</div>
								) : (
									<p className="text-gray-500 text-center py-4">
										No referrals pending
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="cardiac">
					<CardiacAssessment />
				</TabsContent>

				<TabsContent value="neuro">
					<NeurologicalAssessment />
				</TabsContent>

				<TabsContent value="liver">
					<LiverAssessment />
				</TabsContent>

				<TabsContent value="foot">
					<DiabeticFootAssessment />
				</TabsContent>
			</Tabs>
		</div>
	);
}
