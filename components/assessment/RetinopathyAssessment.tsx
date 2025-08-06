"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save } from "lucide-react";
import { RetinopathyHistory, RetinopathyEvaluation, RetinopathyManagement } from "./types";

export default function RetinopathyAssessment() {
	const [retinopathyHistory, setRetinopathyHistory] = useState<RetinopathyHistory>({
		diabetesDuration: "",
		controlStatus: "",
		decreasedVision: false,
		floaters: false,
		previousInjection: false,
		eyeTreatmentLaser: false,
		cataractSurgery: false,
	});

	const [retinopathyEvaluation, setRetinopathyEvaluation] = useState<RetinopathyEvaluation>({
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

	const [retinopathyManagement, setRetinopathyManagement] = useState<RetinopathyManagement>({
		diabetesControl: "",
		followUp: "",
		intravitreal: false,
		prpLaser: false,
		vitrectomy: false,
		eyeDrops: [],
		personalNotes: "",
	});

	return (
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
								value={retinopathyHistory.diabetesDuration}
								onChange={(e) =>
									setRetinopathyHistory(
										(prev) => ({
											...prev,
											diabetesDuration: e.target.value,
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
								value={retinopathyHistory.controlStatus}
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
										checked={retinopathyHistory.decreasedVision}
										onChange={(e) =>
											setRetinopathyHistory(
												(prev) => ({
													...prev,
													decreasedVision: e.target.checked,
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
										checked={retinopathyHistory.floaters}
										onChange={(e) =>
											setRetinopathyHistory(
												(prev) => ({
													...prev,
													floaters: e.target.checked,
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
										checked={retinopathyHistory.previousInjection}
										onChange={(e) =>
											setRetinopathyHistory(
												(prev) => ({
													...prev,
													previousInjection: e.target.checked,
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
										checked={retinopathyHistory.eyeTreatmentLaser}
										onChange={(e) =>
											setRetinopathyHistory(
												(prev) => ({
													...prev,
													eyeTreatmentLaser: e.target.checked,
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
										checked={retinopathyHistory.cataractSurgery}
										onChange={(e) =>
											setRetinopathyHistory(
												(prev) => ({
													...prev,
													cataractSurgery: e.target.checked,
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
											value={retinopathyEvaluation.visualAcuityRight}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														visualAcuityRight: e.target.value,
													})
												)
											}
											placeholder="e.g., 6/6"
											className="w-full"
										/>
									</td>
									<td className="border border-gray-300 p-3">
										<Input
											value={retinopathyEvaluation.visualAcuityLeft}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														visualAcuityLeft: e.target.value,
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
											value={retinopathyEvaluation.pupilReactionRight}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														pupilReactionRight: e.target.value,
													})
												)
											}
											placeholder="Normal/Abnormal"
											className="w-full"
										/>
									</td>
									<td className="border border-gray-300 p-3">
										<Input
											value={retinopathyEvaluation.pupilReactionLeft}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														pupilReactionLeft: e.target.value,
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
												value={retinopathyEvaluation.irisDetailsRight}
												onChange={(e) =>
													setRetinopathyEvaluation(
														(prev) => ({
															...prev,
															irisDetailsRight: e.target.value,
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
													checked={retinopathyEvaluation.neoVascularisationRight}
													onChange={(e) =>
														setRetinopathyEvaluation(
															(prev) => ({
																...prev,
																neoVascularisationRight: e.target.checked,
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
												value={retinopathyEvaluation.irisDetailsLeft}
												onChange={(e) =>
													setRetinopathyEvaluation(
														(prev) => ({
															...prev,
															irisDetailsLeft: e.target.value,
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
													checked={retinopathyEvaluation.neoVascularisationLeft}
													onChange={(e) =>
														setRetinopathyEvaluation(
															(prev) => ({
																...prev,
																neoVascularisationLeft: e.target.checked,
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
											value={retinopathyEvaluation.intraocularPressureRight}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														intraocularPressureRight: e.target.value,
													})
												)
											}
											placeholder="e.g., 14 mmHg"
											className="w-full"
										/>
									</td>
									<td className="border border-gray-300 p-3">
										<Input
											value={retinopathyEvaluation.intraocularPressureLeft}
											onChange={(e) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														intraocularPressureLeft: e.target.value,
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
											value={retinopathyEvaluation.fundusFindingsRight}
											onValueChange={(value) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														fundusFindingsRight: value,
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
											value={retinopathyEvaluation.fundusFindingsLeft}
											onValueChange={(value) =>
												setRetinopathyEvaluation(
													(prev) => ({
														...prev,
														fundusFindingsLeft: value,
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
							value={retinopathyEvaluation.additionalNotes}
							onChange={(e) =>
								setRetinopathyEvaluation(
									(prev) => ({
										...prev,
										additionalNotes: e.target.value,
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
										value={retinopathyManagement.diabetesControl}
										onValueChange={(value) =>
											setRetinopathyManagement(
												(prev) => ({
													...prev,
													diabetesControl: value,
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
										value={retinopathyManagement.followUp}
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
												checked={retinopathyManagement.intravitreal}
												onChange={(e) =>
													setRetinopathyManagement(
														(prev) => ({
															...prev,
															intravitreal: e.target.checked,
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
												checked={retinopathyManagement.prpLaser}
												onChange={(e) =>
													setRetinopathyManagement(
														(prev) => ({
															...prev,
															prpLaser: e.target.checked,
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
												checked={retinopathyManagement.vitrectomy}
												onChange={(e) =>
													setRetinopathyManagement(
														(prev) => ({
															...prev,
															vitrectomy: e.target.checked,
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
										value={retinopathyManagement.personalNotes}
										onChange={(e) =>
											setRetinopathyManagement(
												(prev) => ({
													...prev,
													personalNotes: e.target.value,
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
	);
}