"use client";

import { useState } from "react";
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
	Eye,
	BabyIcon as Kidney,
	Brain,
	Heart,
	Activity,
	Zap,
	User,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

export default function ComprehensiveAssessmentEnhanced() {
	const [selectedAssessment, setSelectedAssessment] = useState("");

	// Mental Health Data
	const mentalHealthData = [
		{ date: "2024-01", phq9: 4, gad7: 3, stressLevel: 6 },
		{ date: "2024-02", phq9: 3, gad7: 4, stressLevel: 5 },
		{ date: "2024-03", phq9: 3, gad7: 3, stressLevel: 4 },
		{ date: "2024-04", phq9: 4, gad7: 3, stressLevel: 5 },
		{ date: "2024-05", phq9: 3, gad7: 3, stressLevel: 4 },
		{ date: "2024-06", phq9: 3, gad7: 3, stressLevel: 4 },
		{ date: "2024-07", phq9: 3, gad7: 3, stressLevel: 3 },
	];

	const assessmentItems = [
		{
			name: "Retinopathy",
			icon: Eye,
			status: "Moderate NPDR",
			lastAssessed: "2023-10-15",
			riskLevel: "high",
			investigations: [
				"Fundus Photography",
				"OCT",
				"Fluorescein Angiography",
			],
			consultations: ["Ophthalmology"],
			followUp: "6 months",
			trendData: [
				{ date: "2021", severity: 1 },
				{ date: "2022", severity: 2 },
				{ date: "2023", severity: 3 },
			],
		},
		{
			name: "Nephropathy",
			icon: Kidney,
			status: "Normal",
			lastAssessed: "2024-07-01",
			riskLevel: "low",
			investigations: ["Serum Creatinine", "Urine ACR", "eGFR"],
			consultations: ["Nephrology"],
			followUp: "1 year",
			trendData: [
				{ date: "2022", creatinine: 0.9 },
				{ date: "2023", creatinine: 1.0 },
				{ date: "2024", creatinine: 1.1 },
			],
		},
		{
			name: "Neuropathy",
			icon: Brain,
			status: "Asymptomatic",
			lastAssessed: "2023-10-15",
			riskLevel: "moderate",
			investigations: [
				"Monofilament Test",
				"Vibration Sense",
				"NCV Study",
			],
			consultations: ["Neurology", "Podiatry"],
			followUp: "1 year",
			trendData: [
				{ date: "2022", score: 0 },
				{ date: "2023", score: 1 },
			],
		},
		{
			name: "Autonomic Neuropathy",
			icon: Zap,
			status: "Not Assessed",
			lastAssessed: "Never",
			riskLevel: "unknown",
			investigations: [
				"Heart Rate Variability",
				"Orthostatic BP",
				"Gastroparesis Assessment",
			],
			consultations: ["Cardiology", "Gastroenterology"],
			followUp: "As needed",
			trendData: [],
		},
		{
			name: "IHD",
			icon: Heart,
			status: "ECG Changes",
			lastAssessed: "2023-10-15",
			riskLevel: "moderate",
			investigations: [
				"ECG",
				"ECHO",
				"Stress Test",
				"Coronary Angiography",
			],
			consultations: ["Cardiology"],
			followUp: "6 months",
			trendData: [
				{ date: "2022", ejectionFraction: 62 },
				{ date: "2023", ejectionFraction: 60 },
			],
		},
		{
			name: "CVA/Stroke",
			icon: Brain,
			status: "No History",
			lastAssessed: "2023-10-15",
			riskLevel: "moderate",
			investigations: ["Carotid Doppler", "MRI Brain", "CT Angiography"],
			consultations: ["Neurology", "Vascular Surgery"],
			followUp: "2 years",
			trendData: [],
		},
		{
			name: "PVD",
			icon: Activity,
			status: "Not Assessed",
			lastAssessed: "Never",
			riskLevel: "unknown",
			investigations: ["ABI", "Doppler Studies", "CT Angiography"],
			consultations: ["Vascular Surgery"],
			followUp: "1 year",
			trendData: [],
		},
		{
			name: "MASLD",
			icon: Activity,
			status: "Not Assessed",
			lastAssessed: "Never",
			riskLevel: "unknown",
			investigations: [
				"Liver Function Tests",
				"Ultrasound Abdomen",
				"FibroScan",
			],
			consultations: ["Hepatology"],
			followUp: "1 year",
			trendData: [],
		},
		{
			name: "Diabetic Foot",
			icon: Activity,
			status: "Low Risk",
			lastAssessed: "2023-10-15",
			riskLevel: "low",
			investigations: [
				"Foot Examination",
				"Doppler Studies",
				"X-ray Foot",
			],
			consultations: ["Podiatry", "Vascular Surgery"],
			followUp: "1 year",
			trendData: [
				{ date: "2022", riskScore: 1 },
				{ date: "2023", riskScore: 1 },
			],
		},
		{
			name: "Skin Changes",
			icon: User,
			status: "Granuloma Annulare",
			lastAssessed: "2024-01-15",
			riskLevel: "low",
			investigations: ["Skin Biopsy", "Dermoscopy"],
			consultations: ["Dermatology"],
			followUp: "6 months",
			trendData: [],
		},
		{
			name: "Sexual Health",
			icon: User,
			status: "Not Assessed",
			lastAssessed: "Never",
			riskLevel: "unknown",
			investigations: ["Testosterone Levels", "IIEF Questionnaire"],
			consultations: ["Urology", "Endocrinology"],
			followUp: "As needed",
			trendData: [],
		},
	];

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case "high":
				return "text-red-500 bg-red-50";
			case "moderate":
				return "text-yellow-500 bg-yellow-50";
			case "low":
				return "text-green-500 bg-green-50";
			default:
				return "text-gray-500 bg-gray-50";
		}
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
					<TabsTrigger value="mental-health">
						Mental Health Tracking
					</TabsTrigger>
				</TabsList>

				<TabsContent value="complications">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{assessmentItems.map((item, index) => {
							const IconComponent = item.icon;
							return (
								<Card
									key={index}
									className="bg-white shadow-lg">
									<CardHeader className="pb-3">
										<CardTitle className="text-lg flex items-center space-x-2">
											<IconComponent className="h-5 w-5" />
											<span>{item.name}</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Status */}
										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium">
													Status:
												</span>
												<Badge
													className={getRiskColor(
														item.riskLevel
													)}>
													{item.riskLevel}
												</Badge>
											</div>
											<p className="text-sm">
												{item.status}
											</p>
											<p className="text-xs text-gray-500">
												Last assessed:{" "}
												{item.lastAssessed}
											</p>
										</div>

										{/* Trend Chart (if data available) */}
										{item.trendData.length > 0 && (
											<div>
												<h4 className="text-sm font-medium mb-2">
													Trend Analysis
												</h4>
												<ResponsiveContainer
													width="100%"
													height={100}>
													<LineChart
														data={item.trendData}>
														<XAxis dataKey="date" />
														<YAxis />
														<Tooltip />
														<Line
															type="monotone"
															dataKey={Object.keys(
																item
																	.trendData[0]
															).find(
																(key) =>
																	key !==
																	"date"
															)}
															stroke="#8884d8"
															strokeWidth={2}
														/>
													</LineChart>
												</ResponsiveContainer>
											</div>
										)}

										{/* Action Plan */}
										<div className="space-y-3">
											<h4 className="text-sm font-medium">
												Action Plan:
											</h4>

											{/* Investigations */}
											<div>
												<label className="text-xs text-gray-600">
													Investigations:
												</label>
												<Select>
													<SelectTrigger className="w-full h-8">
														<SelectValue placeholder="Select investigation" />
													</SelectTrigger>
													<SelectContent>
														{item.investigations.map(
															(inv, idx) => (
																<SelectItem
																	key={idx}
																	value={inv}>
																	{inv}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											{/* Consultations */}
											<div>
												<label className="text-xs text-gray-600">
													Consultations:
												</label>
												<Select>
													<SelectTrigger className="w-full h-8">
														<SelectValue placeholder="Select consultation" />
													</SelectTrigger>
													<SelectContent>
														{item.consultations.map(
															(cons, idx) => (
																<SelectItem
																	key={idx}
																	value={
																		cons
																	}>
																	{cons}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>

											{/* Follow-up */}
											<div className="flex items-center justify-between">
												<span className="text-xs text-gray-600">
													Follow-up:
												</span>
												<span className="text-xs font-medium">
													{item.followUp}
												</span>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												className="flex-1 bg-transparent">
												Order Tests
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="flex-1 bg-transparent">
												Refer
											</Button>
										</div>

										{/* Link to detailed reports */}
										<Button
											size="sm"
											variant="ghost"
											className="w-full text-xs">
											View Detailed Reports & Trends
										</Button>
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
								<div className="p-4 bg-red-50 rounded-lg">
									<div className="text-2xl font-bold text-red-600">
										1
									</div>
									<div className="text-sm text-red-600">
										High Risk
									</div>
								</div>
								<div className="p-4 bg-yellow-50 rounded-lg">
									<div className="text-2xl font-bold text-yellow-600">
										3
									</div>
									<div className="text-sm text-yellow-600">
										Moderate Risk
									</div>
								</div>
								<div className="p-4 bg-green-50 rounded-lg">
									<div className="text-2xl font-bold text-green-600">
										3
									</div>
									<div className="text-sm text-green-600">
										Low Risk
									</div>
								</div>
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-gray-600">
										4
									</div>
									<div className="text-sm text-gray-600">
										Not Assessed
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
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
								<div className="mb-4">
									<ResponsiveContainer
										width="100%"
										height={300}>
										<LineChart data={mentalHealthData}>
											<XAxis dataKey="date" />
											<YAxis />
											<Tooltip />
											<Line
												type="monotone"
												dataKey="phq9"
												stroke="#8884d8"
												name="PHQ-9 Score"
											/>
											<Line
												type="monotone"
												dataKey="gad7"
												stroke="#82ca9d"
												name="GAD-7 Score"
											/>
											<Line
												type="monotone"
												dataKey="stressLevel"
												stroke="#ffc658"
												name="Stress Level"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
								<CardTitle className="text-xl text-navy-600">
									Mental Health Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
										/>
										<p className="text-xs text-gray-500 mt-1">
											1-3: Low, 4-6: Moderate, 7-10: High
										</p>
									</div>
								</div>
								<Button className="mt-4">
									Save Assessment
								</Button>
							</CardContent>
						</Card>

						{/* Sleep Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Sleep Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="p-4 border rounded-lg">
										<h4 className="font-semibold mb-2">
											Sleep Quality
										</h4>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label htmlFor="sleep-hours">
													Hours of Sleep
												</Label>
												<Input
													id="sleep-hours"
													type="number"
													placeholder="e.g., 6"
												/>
											</div>
											<div>
												<Label htmlFor="sleep-quality">
													Sleep Quality (1-10)
												</Label>
												<Input
													id="sleep-quality"
													type="number"
													min="1"
													max="10"
													placeholder="Rate quality"
												/>
											</div>
										</div>
										<div className="mt-3">
											<Label>Sleep Issues:</Label>
											<div className="flex flex-wrap gap-2 mt-2">
												<Badge variant="outline">
													Disturbed sleep patterns
												</Badge>
												<Badge variant="outline">
													Occasional alprazolam use
												</Badge>
												<Badge variant="outline">
													Occasional zolpidem use
												</Badge>
											</div>
										</div>
									</div>
								</div>
								<Button className="mt-4">
									Update Sleep Assessment
								</Button>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
