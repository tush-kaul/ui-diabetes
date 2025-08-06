"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Footprints, Activity, TestTube, UserCheck, Save, Palette, AlertTriangle } from "lucide-react";

interface FootHistory {
	diabetesDuration: string;
	previousUlcers: boolean;
	ulcerHistory: string;
	previousAmputation: boolean;
	amputationDetails: string;
	footDeformity: boolean;
	deformityDetails: string;
	footwearIssues: boolean;
	footCare: string;
	smokingStatus: string;
	currentSymptoms: {
		pain: boolean;
		numbness: boolean;
		tingling: boolean;
		burning: boolean;
		cramping: boolean;
		coldness: boolean;
		swelling: boolean;
		discoloration: boolean;
	};
}

interface FootExamination {
	rightFoot: {
		inspection: string;
		skinCondition: string;
		nailCondition: string;
		deformities: string;
		temperature: string;
		pulses: {
			dorsalisPedis: string;
			posteriorTibial: string;
		};
		sensation: {
			monofilament: string;
			vibration: string;
			pinprick: string;
			temperature: string;
		};
		reflexes: string;
	};
	leftFoot: {
		inspection: string;
		skinCondition: string;
		nailCondition: string;
		deformities: string;
		temperature: string;
		pulses: {
			dorsalisPedis: string;
			posteriorTibial: string;
		};
		sensation: {
			monofilament: string;
			vibration: string;
			pinprick: string;
			temperature: string;
		};
		reflexes: string;
	};
	footwearAssessment: string;
	riskClassification: string;
	personalNotes: string;
}

interface WoundAssessment {
	present: boolean;
	location: string;
	size: string;
	depth: string;
	appearance: string;
	drainage: string;
	odor: boolean;
	painLevel: number;
	healing: string;
	treatment: string;
}

const DiabeticFootAssessment: React.FC = () => {
	const [footHistory, setFootHistory] = useState<FootHistory>({
		diabetesDuration: "",
		previousUlcers: false,
		ulcerHistory: "",
		previousAmputation: false,
		amputationDetails: "",
		footDeformity: false,
		deformityDetails: "",
		footwearIssues: false,
		footCare: "",
		smokingStatus: "",
		currentSymptoms: {
			pain: false,
			numbness: false,
			tingling: false,
			burning: false,
			cramping: false,
			coldness: false,
			swelling: false,
			discoloration: false,
		},
	});

	const [footExamination, setFootExamination] = useState<FootExamination>({
		rightFoot: {
			inspection: "",
			skinCondition: "",
			nailCondition: "",
			deformities: "",
			temperature: "",
			pulses: { dorsalisPedis: "", posteriorTibial: "" },
			sensation: { monofilament: "", vibration: "", pinprick: "", temperature: "" },
			reflexes: "",
		},
		leftFoot: {
			inspection: "",
			skinCondition: "",
			nailCondition: "",
			deformities: "",
			temperature: "",
			pulses: { dorsalisPedis: "", posteriorTibial: "" },
			sensation: { monofilament: "", vibration: "", pinprick: "", temperature: "" },
			reflexes: "",
		},
		footwearAssessment: "",
		riskClassification: "",
		personalNotes: "",
	});

	const [woundAssessment, setWoundAssessment] = useState<WoundAssessment>({
		present: false,
		location: "",
		size: "",
		depth: "",
		appearance: "",
		drainage: "",
		odor: false,
		painLevel: 0,
		healing: "",
		treatment: "",
	});

	const [orderedTests, setOrderedTests] = useState<string[]>([]);
	const [referrals, setReferrals] = useState<string[]>([]);

	// Drawing canvas refs
	const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
	const [isDrawing, setIsDrawing] = useState(false);

	const availableTests = [
		"Ankle-Brachial Index (ABI)", "Doppler Studies", "X-ray Foot",
		"MRI Foot", "Bone Scan", "Wound Culture", "Tissue Biopsy"
	];

	const availableReferrals = [
		"Podiatry", "Vascular Surgery", "Wound Care Clinic",
		"Orthopedics", "Infectious Disease", "Endocrinology"
	];

	const addTest = (test: string) => {
		if (!orderedTests.includes(test)) {
			setOrderedTests(prev => [...prev, test]);
		}
	};

	const removeTest = (index: number) => {
		setOrderedTests(prev => prev.filter((_, i) => i !== index));
	};

	const addReferral = (referral: string) => {
		if (!referrals.includes(referral)) {
			setReferrals(prev => [...prev, referral]);
		}
	};

	const removeReferral = (index: number) => {
		setReferrals(prev => prev.filter((_, i) => i !== index));
	};

	// Drawing functions
	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, canvasId: string) => {
		setIsDrawing(true);
		const canvas = canvasRefs.current[canvasId];
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
				ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
			}
		}
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement>, canvasId: string) => {
		if (!isDrawing) return;
		const canvas = canvasRefs.current[canvasId];
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

	const clearDrawing = (canvasId: string) => {
		const canvas = canvasRefs.current[canvasId];
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case "high": return "text-red-600 bg-red-50 border-red-200";
			case "moderate": return "text-orange-600 bg-orange-50 border-orange-200";
			case "low": return "text-green-600 bg-green-50 border-green-200";
			default: return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	const updateSymptom = (symptom: keyof FootHistory['currentSymptoms'], checked: boolean) => {
		setFootHistory(prev => ({
			...prev,
			currentSymptoms: {
				...prev.currentSymptoms,
				[symptom]: checked,
			},
		}));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="bg-white shadow-lg border-l-4 border-l-blue-500">
				<CardHeader>
					<CardTitle className="text-xl text-navy-600 flex items-center">
						<Footprints className="h-6 w-6 mr-2 text-blue-500" />
						Diabetic Foot Assessment
						<Badge className="ml-4 bg-green-100 text-green-800">
							Low Risk
						</Badge>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Foot History */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Foot History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="diabetes-duration">Duration of Diabetes</Label>
							<Input
								id="diabetes-duration"
								value={footHistory.diabetesDuration}
								onChange={(e) => setFootHistory(prev => ({
									...prev,
									diabetesDuration: e.target.value,
								}))}
								placeholder="e.g., 10 years"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="smoking-status">Smoking Status</Label>
							<Select
								value={footHistory.smokingStatus}
								onValueChange={(value) => setFootHistory(prev => ({
									...prev,
									smokingStatus: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select smoking status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="never">Never Smoked</SelectItem>
									<SelectItem value="current">Current Smoker</SelectItem>
									<SelectItem value="former">Former Smoker</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="foot-care">Foot Care Practices</Label>
							<Textarea
								id="foot-care"
								value={footHistory.footCare}
								onChange={(e) => setFootHistory(prev => ({
									...prev,
									footCare: e.target.value,
								}))}
								placeholder="Daily foot care routine, professional care..."
								className="mt-2"
								rows={2}
							/>
						</div>

						{/* Previous History */}
						<div className="space-y-4">
							<Label>Previous Foot Problems</Label>
							<div className="space-y-2 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-ulcers"
										checked={footHistory.previousUlcers}
										onChange={(e) => setFootHistory(prev => ({
											...prev,
											previousUlcers: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-ulcers">Previous Foot Ulcers</Label>
								</div>
								{footHistory.previousUlcers && (
									<div>
										<Textarea
											value={footHistory.ulcerHistory}
											onChange={(e) => setFootHistory(prev => ({
												...prev,
												ulcerHistory: e.target.value,
											}))}
											placeholder="Details about previous ulcers..."
											rows={2}
										/>
									</div>
								)}

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-amputation"
										checked={footHistory.previousAmputation}
										onChange={(e) => setFootHistory(prev => ({
											...prev,
											previousAmputation: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-amputation">Previous Amputation</Label>
								</div>
								{footHistory.previousAmputation && (
									<div>
										<Textarea
											value={footHistory.amputationDetails}
											onChange={(e) => setFootHistory(prev => ({
												...prev,
												amputationDetails: e.target.value,
											}))}
											placeholder="Details about amputation..."
											rows={2}
										/>
									</div>
								)}

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="foot-deformity"
										checked={footHistory.footDeformity}
										onChange={(e) => setFootHistory(prev => ({
											...prev,
											footDeformity: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="foot-deformity">Foot Deformities</Label>
								</div>
								{footHistory.footDeformity && (
									<div>
										<Textarea
											value={footHistory.deformityDetails}
											onChange={(e) => setFootHistory(prev => ({
												...prev,
												deformityDetails: e.target.value,
											}))}
											placeholder="Describe deformities..."
											rows={2}
										/>
									</div>
								)}

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="footwear-issues"
										checked={footHistory.footwearIssues}
										onChange={(e) => setFootHistory(prev => ({
											...prev,
											footwearIssues: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="footwear-issues">Footwear Problems</Label>
								</div>
							</div>
						</div>

						{/* Current Symptoms */}
						<div className="space-y-4 col-span-2">
							<Label>Current Symptoms</Label>
							<div className="grid grid-cols-2 gap-4 mt-2">
								{Object.entries({
									pain: "Pain",
									numbness: "Numbness",
									tingling: "Tingling",
									burning: "Burning sensation",
									cramping: "Cramping",
									coldness: "Cold feet",
									swelling: "Swelling",
									discoloration: "Discoloration"
								}).map(([key, label]) => (
									<div key={key} className="flex items-center space-x-2">
										<input
											type="checkbox"
											id={key}
											checked={footHistory.currentSymptoms[key as keyof FootHistory['currentSymptoms']]}
											onChange={(e) => updateSymptom(key as keyof FootHistory['currentSymptoms'], e.target.checked)}
											className="rounded"
										/>
										<Label htmlFor={key}>{label}</Label>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Foot Examination */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Physical Examination</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Right Foot */}
						<div>
							<h4 className="font-semibold text-lg mb-4 text-blue-600">Right Foot</h4>
							<div className="space-y-4">
								<div>
									<Label>General Inspection</Label>
									<Input
										value={footExamination.rightFoot.inspection}
										onChange={(e) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												inspection: e.target.value,
											},
										}))}
										placeholder="Overall appearance, color, swelling..."
										className="mt-2"
									/>
								</div>

								<div>
									<Label>Skin Condition</Label>
									<Select
										value={footExamination.rightFoot.skinCondition}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												skinCondition: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select skin condition" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="dry">Dry</SelectItem>
											<SelectItem value="cracked">Cracked</SelectItem>
											<SelectItem value="callused">Callused</SelectItem>
											<SelectItem value="infected">Signs of Infection</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Nail Condition</Label>
									<Select
										value={footExamination.rightFoot.nailCondition}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												nailCondition: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select nail condition" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="thickened">Thickened</SelectItem>
											<SelectItem value="ingrown">Ingrown</SelectItem>
											<SelectItem value="fungal">Fungal Infection</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Temperature</Label>
									<Select
										value={footExamination.rightFoot.temperature}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												temperature: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select temperature" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="warm">Warm</SelectItem>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="cool">Cool</SelectItem>
											<SelectItem value="cold">Cold</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Pulses */}
								<div>
									<Label>Dorsalis Pedis Pulse</Label>
									<Select
										value={footExamination.rightFoot.pulses.dorsalisPedis}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												pulses: {
													...prev.rightFoot.pulses,
													dorsalisPedis: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select pulse strength" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3+">3+ (Strong)</SelectItem>
											<SelectItem value="2+">2+ (Normal)</SelectItem>
											<SelectItem value="1+">1+ (Weak)</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Posterior Tibial Pulse</Label>
									<Select
										value={footExamination.rightFoot.pulses.posteriorTibial}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												pulses: {
													...prev.rightFoot.pulses,
													posteriorTibial: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select pulse strength" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3+">3+ (Strong)</SelectItem>
											<SelectItem value="2+">2+ (Normal)</SelectItem>
											<SelectItem value="1+">1+ (Weak)</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Sensation Tests */}
								<div>
									<Label>Monofilament Test</Label>
									<Select
										value={footExamination.rightFoot.sensation.monofilament}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												sensation: {
													...prev.rightFoot.sensation,
													monofilament: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select result" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal (10/10 sites)</SelectItem>
											<SelectItem value="reduced">Reduced (5-9/10 sites)</SelectItem>
											<SelectItem value="absent">Absent (&lt;5/10 sites)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Vibration Sense</Label>
									<Select
										value={footExamination.rightFoot.sensation.vibration}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											rightFoot: {
												...prev.rightFoot,
												sensation: {
													...prev.rightFoot.sensation,
													vibration: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select result" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="reduced">Reduced</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Left Foot */}
						<div>
							<h4 className="font-semibold text-lg mb-4 text-blue-600">Left Foot</h4>
							<div className="space-y-4">
								<div>
									<Label>General Inspection</Label>
									<Input
										value={footExamination.leftFoot.inspection}
										onChange={(e) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												inspection: e.target.value,
											},
										}))}
										placeholder="Overall appearance, color, swelling..."
										className="mt-2"
									/>
								</div>

								<div>
									<Label>Skin Condition</Label>
									<Select
										value={footExamination.leftFoot.skinCondition}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												skinCondition: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select skin condition" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="dry">Dry</SelectItem>
											<SelectItem value="cracked">Cracked</SelectItem>
											<SelectItem value="callused">Callused</SelectItem>
											<SelectItem value="infected">Signs of Infection</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Nail Condition</Label>
									<Select
										value={footExamination.leftFoot.nailCondition}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												nailCondition: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select nail condition" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="thickened">Thickened</SelectItem>
											<SelectItem value="ingrown">Ingrown</SelectItem>
											<SelectItem value="fungal">Fungal Infection</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Temperature</Label>
									<Select
										value={footExamination.leftFoot.temperature}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												temperature: value,
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select temperature" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="warm">Warm</SelectItem>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="cool">Cool</SelectItem>
											<SelectItem value="cold">Cold</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Pulses */}
								<div>
									<Label>Dorsalis Pedis Pulse</Label>
									<Select
										value={footExamination.leftFoot.pulses.dorsalisPedis}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												pulses: {
													...prev.leftFoot.pulses,
													dorsalisPedis: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select pulse strength" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3+">3+ (Strong)</SelectItem>
											<SelectItem value="2+">2+ (Normal)</SelectItem>
											<SelectItem value="1+">1+ (Weak)</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Posterior Tibial Pulse</Label>
									<Select
										value={footExamination.leftFoot.pulses.posteriorTibial}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												pulses: {
													...prev.leftFoot.pulses,
													posteriorTibial: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select pulse strength" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="3+">3+ (Strong)</SelectItem>
											<SelectItem value="2+">2+ (Normal)</SelectItem>
											<SelectItem value="1+">1+ (Weak)</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Sensation Tests */}
								<div>
									<Label>Monofilament Test</Label>
									<Select
										value={footExamination.leftFoot.sensation.monofilament}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												sensation: {
													...prev.leftFoot.sensation,
													monofilament: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select result" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal (10/10 sites)</SelectItem>
											<SelectItem value="reduced">Reduced (5-9/10 sites)</SelectItem>
											<SelectItem value="absent">Absent (&lt;5/10 sites)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Vibration Sense</Label>
									<Select
										value={footExamination.leftFoot.sensation.vibration}
										onValueChange={(value) => setFootExamination(prev => ({
											...prev,
											leftFoot: {
												...prev.leftFoot,
												sensation: {
													...prev.leftFoot.sensation,
													vibration: value,
												},
											},
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select result" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">Normal</SelectItem>
											<SelectItem value="reduced">Reduced</SelectItem>
											<SelectItem value="absent">Absent</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					{/* Risk Classification */}
					<div className="mt-8 pt-6 border-t">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label htmlFor="risk-classification">Risk Classification</Label>
								<Select
									value={footExamination.riskClassification}
									onValueChange={(value) => setFootExamination(prev => ({
										...prev,
										riskClassification: value,
									}))}>
									<SelectTrigger className="mt-2">
										<SelectValue placeholder="Select risk level" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low Risk - No loss of sensation, palpable pulses</SelectItem>
										<SelectItem value="moderate">Moderate Risk - Loss of sensation or absent pulses</SelectItem>
										<SelectItem value="high">High Risk - Loss of sensation + absent pulses or deformity</SelectItem>
										<SelectItem value="very-high">Very High Risk - Previous ulcer or amputation</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="footwear-assessment">Footwear Assessment</Label>
								<Textarea
									id="footwear-assessment"
									value={footExamination.footwearAssessment}
									onChange={(e) => setFootExamination(prev => ({
										...prev,
										footwearAssessment: e.target.value,
									}))}
									placeholder="Assessment of current footwear, recommendations..."
									className="mt-2"
									rows={2}
								/>
							</div>

							<div className="col-span-full">
								<Label htmlFor="examination-notes">Additional Examination Notes</Label>
								<Textarea
									id="examination-notes"
									value={footExamination.personalNotes}
									onChange={(e) => setFootExamination(prev => ({
										...prev,
										personalNotes: e.target.value,
									}))}
									placeholder="Additional findings or observations..."
									className="mt-2"
									rows={3}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Wound Assessment */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<AlertTriangle className="h-5 w-5 mr-2" />
						Wound Assessment
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="wound-present"
								checked={woundAssessment.present}
								onChange={(e) => setWoundAssessment(prev => ({
									...prev,
									present: e.target.checked,
								}))}
								className="rounded"
							/>
							<Label htmlFor="wound-present">Active Wound/Ulcer Present</Label>
						</div>

						{woundAssessment.present && (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div>
									<Label htmlFor="wound-location">Location</Label>
									<Input
										id="wound-location"
										value={woundAssessment.location}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											location: e.target.value,
										}))}
										placeholder="e.g., Right great toe, heel"
										className="mt-2"
									/>
								</div>

								<div>
									<Label htmlFor="wound-size">Size (cm)</Label>
									<Input
										id="wound-size"
										value={woundAssessment.size}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											size: e.target.value,
										}))}
										placeholder="e.g., 2.5 x 1.8"
										className="mt-2"
									/>
								</div>

								<div>
									<Label htmlFor="wound-depth">Depth</Label>
									<Select
										value={woundAssessment.depth}
										onValueChange={(value) => setWoundAssessment(prev => ({
											...prev,
											depth: value,
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select depth" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="superficial">Superficial</SelectItem>
											<SelectItem value="partial-thickness">Partial Thickness</SelectItem>
											<SelectItem value="full-thickness">Full Thickness</SelectItem>
											<SelectItem value="bone-exposed">Bone/Tendon Exposed</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="wound-appearance">Appearance</Label>
									<Textarea
										id="wound-appearance"
										value={woundAssessment.appearance}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											appearance: e.target.value,
										}))}
										placeholder="Color, edges, surrounding tissue..."
										className="mt-2"
										rows={2}
									/>
								</div>

								<div>
									<Label htmlFor="wound-drainage">Drainage</Label>
									<Select
										value={woundAssessment.drainage}
										onValueChange={(value) => setWoundAssessment(prev => ({
											...prev,
											drainage: value,
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select drainage" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">None</SelectItem>
											<SelectItem value="minimal">Minimal</SelectItem>
											<SelectItem value="moderate">Moderate</SelectItem>
											<SelectItem value="copious">Copious</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="pain-level">Pain Level (0-10)</Label>
									<Input
										id="pain-level"
										type="number"
										min="0"
										max="10"
										value={woundAssessment.painLevel}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											painLevel: parseInt(e.target.value) || 0,
										}))}
										className="mt-2"
									/>
								</div>

								<div className="flex items-center space-x-2 mt-6">
									<input
										type="checkbox"
										id="wound-odor"
										checked={woundAssessment.odor}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											odor: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="wound-odor">Offensive Odor Present</Label>
								</div>

								<div>
									<Label htmlFor="wound-healing">Healing Status</Label>
									<Select
										value={woundAssessment.healing}
										onValueChange={(value) => setWoundAssessment(prev => ({
											...prev,
											healing: value,
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select healing status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="healing">Healing Well</SelectItem>
											<SelectItem value="static">Static</SelectItem>
											<SelectItem value="deteriorating">Deteriorating</SelectItem>
											<SelectItem value="infected">Signs of Infection</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="col-span-full">
									<Label htmlFor="wound-treatment">Current Treatment</Label>
									<Textarea
										id="wound-treatment"
										value={woundAssessment.treatment}
										onChange={(e) => setWoundAssessment(prev => ({
											...prev,
											treatment: e.target.value,
										}))}
										placeholder="Current wound care regimen, dressings, medications..."
										className="mt-2"
										rows={3}
									/>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Foot Diagram Drawing */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Palette className="h-5 w-5 mr-2" />
						Foot Assessment Drawing
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<div className="flex justify-between items-center mb-2">
								<Label>Right Foot</Label>
								<Button
									size="sm"
									variant="outline"
									onClick={() => clearDrawing("rightFoot")}>
									Clear
								</Button>
							</div>
							<canvas
								ref={(el) => {
									canvasRefs.current["rightFoot"] = el;
								}}
								width={250}
								height={350}
								className="border rounded cursor-crosshair bg-gray-50"
								style={{
									backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 350'%3E%3Cpath d='M125 50 C100 50 80 70 80 100 L80 200 C80 250 90 280 110 300 L110 330 C110 340 120 350 130 350 L170 350 C180 350 190 340 190 330 L190 300 C210 280 220 250 220 200 L220 100 C220 70 200 50 175 50 L125 50 Z' fill='none' stroke='%23ccc' strokeWidth='2'/%3E%3Cellipse cx='125' cy='80' rx='15' ry='10' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='110' cy='100' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='125' cy='105' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='140' cy='100' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='155' cy='95' rx='6' ry='5' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3C/svg%3E")`,
									backgroundSize: "contain",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
								onMouseDown={(e) => startDrawing(e, "rightFoot")}
								onMouseMove={(e) => draw(e, "rightFoot")}
								onMouseUp={stopDrawing}
								onMouseLeave={stopDrawing}
							/>
							<p className="text-xs text-gray-600 mt-2">Click and drag to mark affected areas</p>
						</div>

						<div>
							<div className="flex justify-between items-center mb-2">
								<Label>Left Foot</Label>
								<Button
									size="sm"
									variant="outline"
									onClick={() => clearDrawing("leftFoot")}>
									Clear
								</Button>
							</div>
							<canvas
								ref={(el) => {
									canvasRefs.current["leftFoot"] = el;
								}}
								width={250}
								height={350}
								className="border rounded cursor-crosshair bg-gray-50"
								style={{
									backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 250 350'%3E%3Cpath d='M125 50 C150 50 170 70 170 100 L170 200 C170 250 160 280 140 300 L140 330 C140 340 130 350 120 350 L80 350 C70 350 60 340 60 330 L60 300 C40 280 30 250 30 200 L30 100 C30 70 50 50 75 50 L125 50 Z' fill='none' stroke='%23ccc' strokeWidth='2'/%3E%3Cellipse cx='125' cy='80' rx='15' ry='10' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='140' cy='100' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='125' cy='105' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='110' cy='100' rx='8' ry='6' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3Cellipse cx='95' cy='95' rx='6' ry='5' fill='none' stroke='%23ccc' strokeWidth='1'/%3E%3C/svg%3E")`,
									backgroundSize: "contain",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
								onMouseDown={(e) => startDrawing(e, "leftFoot")}
								onMouseMove={(e) => draw(e, "leftFoot")}
								onMouseUp={stopDrawing}
								onMouseLeave={stopDrawing}
							/>
							<p className="text-xs text-gray-600 mt-2">Click and drag to mark affected areas</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Investigations */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<TestTube className="h-5 w-5 mr-2" />
						Investigations
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<Label>Order Tests</Label>
							<Select onValueChange={addTest}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select investigation" />
								</SelectTrigger>
								<SelectContent>
									{availableTests.map((test) => (
										<SelectItem key={test} value={test}>{test}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{orderedTests.length > 0 && (
							<div>
								<Label>Ordered Tests</Label>
								<div className="mt-2 space-y-2">
									{orderedTests.map((test, index) => (
										<div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
											<span>{test}</span>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeTest(index)}>
												Remove
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Referrals */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<UserCheck className="h-5 w-5 mr-2" />
						Referrals
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<Label>Add Referral</Label>
							<Select onValueChange={addReferral}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select specialty" />
								</SelectTrigger>
								<SelectContent>
									{availableReferrals.map((referral) => (
										<SelectItem key={referral} value={referral}>{referral}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{referrals.length > 0 && (
							<div>
								<Label>Active Referrals</Label>
								<div className="mt-2 space-y-2">
									{referrals.map((referral, index) => (
										<div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
											<span>{referral}</span>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeReferral(index)}>
												Remove
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Save Assessment */}
			<div className="flex justify-end">
				<Button className="bg-blue-600 hover:bg-blue-700">
					<Save className="h-4 w-4 mr-2" />
					Save Assessment
				</Button>
			</div>
		</div>
	);
};

export default DiabeticFootAssessment;