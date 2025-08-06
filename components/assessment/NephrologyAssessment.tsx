"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BeanIcon, ChevronDown, ChevronRight } from "lucide-react";
import { NephrologyData, AssessmentProps } from "./types";
import { saveNephrologyDataToStorage } from "./utils";

export default function NephrologyAssessment({ onNavigate }: AssessmentProps) {
	const [nephrologyData, setNephrologyData] = useState<NephrologyData>({
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
		orderedTests: [],
		selectedReferral: "",
		referrals: [],
		actionPlan: "",
		showOtherOrgans: false,
	});

	// Auto-save nephrology data to other components as per V3 requirements
	useEffect(() => {
		// Only save if there's actual data
		if (
			nephrologyData.diabetesDuration ||
			nephrologyData.clinicalNotes ||
			nephrologyData.orderedTests.length > 0 ||
			nephrologyData.referrals.length > 0
		) {
			saveNephrologyDataToStorage(nephrologyData);
		}
	}, [nephrologyData]);

	const handleTestOrder = () => {
		if (
			nephrologyData.selectedTest &&
			!nephrologyData.orderedTests.includes(nephrologyData.selectedTest)
		) {
			setNephrologyData((prev) => ({
				...prev,
				orderedTests: [...prev.orderedTests, prev.selectedTest],
				selectedTest: "",
			}));
		}
	};

	const handleReferralAdd = () => {
		if (
			nephrologyData.selectedReferral &&
			!nephrologyData.referrals.includes(nephrologyData.selectedReferral)
		) {
			setNephrologyData((prev) => ({
				...prev,
				referrals: [...prev.referrals, prev.selectedReferral],
				selectedReferral: "",
			}));
		}
	};

	const removeTest = (index: number) => {
		setNephrologyData((prev) => ({
			...prev,
			orderedTests: prev.orderedTests.filter((_, i) => i !== index),
		}));
	};

	const removeReferral = (index: number) => {
		setNephrologyData((prev) => ({
			...prev,
			referrals: prev.referrals.filter((_, i) => i !== index),
		}));
	};

	const testOptions = [
		{ value: "serum-creatinine", label: "Serum Creatinine" },
		{ value: "urine-routine", label: "Urine Routine" },
		{ value: "urine-acr", label: "Urine ACR" },
		{ value: "urine-pcr", label: "Urine PCR" },
		{ value: "potassium", label: "Potassium" },
		{ value: "sodium", label: "Sodium" },
		{ value: "chloride", label: "Chloride" },
		{ value: "ultrasound-abdomen", label: "Ultrasound Abdomen" },
		{ value: "calcium", label: "Calcium" },
		{ value: "phosphorus", label: "Phosphorus" },
		{ value: "uric-acid", label: "Uric Acid" },
		{ value: "vitamin-d", label: "Vitamin D" },
		{ value: "pth", label: "PTH" },
		{ value: "fbs", label: "FBS" },
		{ value: "ppbs", label: "PPBS" },
		{ value: "hba1c", label: "HbA1c" },
	];

	const referralOptions = [
		{ value: "ophthalmologist", label: "Ophthalmologist" },
		{ value: "neurologist", label: "Neurologist" },
		{ value: "cardiologist", label: "Cardiologist" },
		{ value: "nutritionist", label: "Nutritionist" },
		{ value: "others", label: "Others" },
	];

	return (
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
								<p className="text-2xl font-bold text-blue-700">85</p>
								<p className="text-sm text-blue-600">ml/min/1.73m²</p>
							</div>
							<div className="p-4 bg-green-50 rounded-lg border border-green-200">
								<h3 className="font-semibold text-green-800 mb-2">
									Urine ACR
								</h3>
								<p className="text-2xl font-bold text-green-700">15</p>
								<p className="text-sm text-green-600">mg/g</p>
							</div>
							<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
								<h3 className="font-semibold text-orange-800 mb-2">
									Serum Creatinine
								</h3>
								<p className="text-2xl font-bold text-orange-700">1.1</p>
								<p className="text-sm text-orange-600">mg/dL</p>
							</div>
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
										value={nephrologyData.diabetesDuration}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												diabetesDuration: e.target.value,
											}))
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
										value={nephrologyData.hypertensionDuration}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												hypertensionDuration: e.target.value,
											}))
										}
									/>
								</div>

								<div>
									<Label className="text-sm font-medium">
										Family History of Kidney Disease
									</Label>
									<Select
										value={nephrologyData.familyHistory}
										onValueChange={(value) =>
											setNephrologyData((prev) => ({
												...prev,
												familyHistory: value,
											}))
										}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select option" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="yes">Yes</SelectItem>
											<SelectItem value="no">No</SelectItem>
											<SelectItem value="unknown">Unknown</SelectItem>
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
												aria-label="Nephrology Symptoms - Edema"
												type="checkbox"
												id="nephr-edema"
												checked={nephrologyData.symptoms.edema}
												onChange={(e) =>
													setNephrologyData((prev) => ({
														...prev,
														symptoms: {
															...prev.symptoms,
															edema: e.target.checked,
														},
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="nephr-edema">Edema</Label>
										</div>
										<div className="flex items-center space-x-2">
											<input
												aria-label="Nephrology Symptoms - Nocturia"
												type="checkbox"
												id="nephr-nocturia"
												checked={nephrologyData.symptoms.nocturia}
												onChange={(e) =>
													setNephrologyData((prev) => ({
														...prev,
														symptoms: {
															...prev.symptoms,
															nocturia: e.target.checked,
														},
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="nephr-nocturia">Nocturia</Label>
										</div>
										<div className="flex items-center space-x-2">
											<input
												aria-label="Nephrology Symptoms - Foamy Urine"
												type="checkbox"
												id="nephr-foamy"
												checked={nephrologyData.symptoms.foamyUrine}
												onChange={(e) =>
													setNephrologyData((prev) => ({
														...prev,
														symptoms: {
															...prev.symptoms,
															foamyUrine: e.target.checked,
														},
													}))
												}
												className="rounded"
											/>
											<Label htmlFor="nephr-foamy">Foamy Urine</Label>
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
									<Label className="text-sm font-medium">CKD Stage</Label>
									<Select
										value={nephrologyData.ckdStage}
										onValueChange={(value) =>
											setNephrologyData((prev) => ({
												...prev,
												ckdStage: value,
											}))
										}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select CKD stage" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="normal">
												Normal (eGFR ≥90)
											</SelectItem>
											<SelectItem value="stage1">
												Stage 1 (eGFR ≥90 with kidney damage)
											</SelectItem>
											<SelectItem value="stage2">
												Stage 2 (eGFR 60-89)
											</SelectItem>
											<SelectItem value="stage3a">
												Stage 3a (eGFR 45-59)
											</SelectItem>
											<SelectItem value="stage3b">
												Stage 3b (eGFR 30-44)
											</SelectItem>
											<SelectItem value="stage4">
												Stage 4 (eGFR 15-29)
											</SelectItem>
											<SelectItem value="stage5">
												Stage 5 (eGFR &lt;15)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className="text-sm font-medium">
										Albuminuria Category
									</Label>
									<Select
										value={nephrologyData.albuminuriaCategory}
										onValueChange={(value) =>
											setNephrologyData((prev) => ({
												...prev,
												albuminuriaCategory: value,
											}))
										}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select albuminuria category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="a1">
												A1: Normal to mildly increased (&lt;30 mg/g)
											</SelectItem>
											<SelectItem value="a2">
												A2: Moderately increased (30-300 mg/g)
											</SelectItem>
											<SelectItem value="a3">
												A3: Severely increased (&gt;300 mg/g)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className="text-sm font-medium">Risk Category</Label>
									<div className="mt-2 p-3 bg-gray-50 rounded-lg">
										<span
											className={`px-2 py-1 rounded text-sm font-medium ${
												nephrologyData.riskCategory === "low"
													? "bg-green-100 text-green-800"
													: nephrologyData.riskCategory === "moderate"
													? "bg-yellow-100 text-yellow-800"
													: nephrologyData.riskCategory === "high"
													? "bg-orange-100 text-orange-800"
													: "bg-red-100 text-red-800"
											}`}>
											{nephrologyData.riskCategory
												.charAt(0)
												.toUpperCase() +
												nephrologyData.riskCategory.slice(1)}{" "}
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
										value={nephrologyData.clinicalNotes}
										onChange={(e) =>
											setNephrologyData((prev) => ({
												...prev,
												clinicalNotes: e.target.value,
											}))
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
										value={nephrologyData.selectedTest}
										onValueChange={(value) =>
											setNephrologyData((prev) => ({
												...prev,
												selectedTest: value,
											}))
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select test to order" />
										</SelectTrigger>
										<SelectContent>
											{testOptions.map((test) => (
												<SelectItem key={test.value} value={test.value}>
													{test.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										onClick={handleTestOrder}
										className="w-full"
										size="sm">
										Add Test
									</Button>
									{nephrologyData.orderedTests.length > 0 && (
										<div className="space-y-2">
											<p className="text-sm font-medium text-gray-700">
												Ordered Tests:
											</p>
											{nephrologyData.orderedTests.map((test, index) => (
												<div
													key={index}
													className="flex justify-between items-center p-2 bg-blue-50 rounded">
													<span className="text-sm capitalize">
														{test.replace("-", " ")}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => removeTest(index)}>
														×
													</Button>
												</div>
											))}
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
										value={nephrologyData.selectedReferral}
										onValueChange={(value) =>
											setNephrologyData((prev) => ({
												...prev,
												selectedReferral: value,
											}))
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select referral" />
										</SelectTrigger>
										<SelectContent>
											{referralOptions.map((referral) => (
												<SelectItem key={referral.value} value={referral.value}>
													{referral.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										onClick={handleReferralAdd}
										className="w-full"
										size="sm">
										Add Referral
									</Button>
									{nephrologyData.referrals.length > 0 && (
										<div className="space-y-2">
											<p className="text-sm font-medium text-gray-700">
												Active Referrals:
											</p>
											{nephrologyData.referrals.map((referral, index) => (
												<div
													key={index}
													className="flex justify-between items-center p-2 bg-green-50 rounded">
													<span className="text-sm capitalize">
														{referral}
													</span>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => removeReferral(index)}>
														×
													</Button>
												</div>
											))}
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
										value={nephrologyData.actionPlan}
										onValueChange={(value) => {
											setNephrologyData((prev) => ({
												...prev,
												actionPlan: value,
											}));
											if (value === "optimize-medications" && onNavigate) {
												onNavigate("medications");
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

									{nephrologyData.actionPlan === "order-tests" && (
										<div className="mt-3">
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Select test to order" />
												</SelectTrigger>
												<SelectContent>
													{testOptions.map((test) => (
														<SelectItem key={test.value} value={test.value}>
															{test.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}

									<div className="text-sm text-gray-600 mt-2">
										{nephrologyData.actionPlan === "optimize-medications" && (
											<p>
												Clicking this option will navigate to medications
												page where you can add, modify, or adjust dosages.
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
										showOtherOrgans: !prev.showOtherOrgans,
									}))
								}
								className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
								{nephrologyData.showOtherOrgans ? (
									<ChevronDown className="h-5 w-5" />
								) : (
									<ChevronRight className="h-5 w-5" />
								)}
								<span className="font-medium">
									Comprehensive Assessment (Other Target Organs)
								</span>
							</button>

							{nephrologyData.showOtherOrgans && (
								<div className="mt-4 p-4 bg-gray-50 rounded-lg">
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										<button
											onClick={() =>
												onNavigate && onNavigate("retinopathy")
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
												onNavigate && onNavigate("cardiac")
											}
											className="p-3 text-left bg-white rounded border hover:border-red-500 hover:bg-red-50 transition-colors">
											<div className="text-sm font-medium">Cardiac</div>
											<div className="text-xs text-gray-500">
												Heart assessment
											</div>
										</button>
										<button
											onClick={() =>
												onNavigate && onNavigate("neuro")
											}
											className="p-3 text-left bg-white rounded border hover:border-purple-500 hover:bg-purple-50 transition-colors">
											<div className="text-sm font-medium">
												Neurological
											</div>
											<div className="text-xs text-gray-500">
												Nerve assessment
											</div>
										</button>
										<button
											onClick={() =>
												onNavigate && onNavigate("liver")
											}
											className="p-3 text-left bg-white rounded border hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
											<div className="text-sm font-medium">Liver</div>
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
	);
}