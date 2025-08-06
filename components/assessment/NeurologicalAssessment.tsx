"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Zap, Activity, TestTube, UserCheck, Save, Stethoscope } from "lucide-react";

interface NeurologicalHistory {
	diabetesDuration: string;
	hypertensionDuration: string;
	strokeHistory: boolean;
	strokeDetails: string;
	tiaHistory: boolean;
	headaches: boolean;
	seizures: boolean;
	cognitiveChanges: boolean;
	behaviorChanges: boolean;
	speechProblems: boolean;
	visionProblems: boolean;
	balanceProblems: boolean;
	weakness: boolean;
	numbness: boolean;
	tremor: boolean;
}

interface NeurologicalExamination {
	mentalStatus: string;
	orientation: string;
	memory: string;
	language: string;
	cranialNerves: string;
	motorFunction: string;
	sensoryFunction: string;
	reflexes: string;
	coordination: string;
	gait: string;
	rombergTest: string;
	personalNotes: string;
}

interface StrokeAssessment {
	nihssScore: number;
	befastPositive: boolean;
	befastDetails: string;
	riskFactors: string[];
	carotidBruit: boolean;
	recommendations: string;
}

const NeurologicalAssessment: React.FC = () => {
	const [neurologicalHistory, setNeurologicalHistory] = useState<NeurologicalHistory>({
		diabetesDuration: "",
		hypertensionDuration: "",
		strokeHistory: false,
		strokeDetails: "",
		tiaHistory: false,
		headaches: false,
		seizures: false,
		cognitiveChanges: false,
		behaviorChanges: false,
		speechProblems: false,
		visionProblems: false,
		balanceProblems: false,
		weakness: false,
		numbness: false,
		tremor: false,
	});

	const [neurologicalExamination, setNeurologicalExamination] = useState<NeurologicalExamination>({
		mentalStatus: "",
		orientation: "",
		memory: "",
		language: "",
		cranialNerves: "",
		motorFunction: "",
		sensoryFunction: "",
		reflexes: "",
		coordination: "",
		gait: "",
		rombergTest: "",
		personalNotes: "",
	});

	const [strokeAssessment, setStrokeAssessment] = useState<StrokeAssessment>({
		nihssScore: 0,
		befastPositive: false,
		befastDetails: "",
		riskFactors: [],
		carotidBruit: false,
		recommendations: "",
	});

	const [orderedTests, setOrderedTests] = useState<string[]>([]);
	const [referrals, setReferrals] = useState<string[]>([]);

	const availableTests = [
		"MRI Brain", "CT Brain", "CT Angiography", "MRA", "Carotid Doppler",
		"EEG", "EMG/NCS", "Lumbar Puncture", "PET Scan", "SPECT"
	];

	const availableReferrals = [
		"Neurology", "Neurosurgery", "Stroke Clinic", "Memory Clinic",
		"Movement Disorders", "Epilepsy Clinic"
	];

	const riskFactorOptions = [
		"Diabetes", "Hypertension", "Atrial Fibrillation", "Smoking",
		"High Cholesterol", "Obesity", "Family History", "Age > 65"
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

	const toggleRiskFactor = (factor: string) => {
		setStrokeAssessment(prev => ({
			...prev,
			riskFactors: prev.riskFactors.includes(factor)
				? prev.riskFactors.filter(rf => rf !== factor)
				: [...prev.riskFactors, factor]
		}));
	};

	const getNIHSSColor = (score: number) => {
		if (score === 0) return "text-green-600 bg-green-50";
		if (score <= 4) return "text-yellow-600 bg-yellow-50";
		if (score <= 15) return "text-orange-600 bg-orange-50";
		return "text-red-600 bg-red-50";
	};

	const getNIHSSInterpretation = (score: number) => {
		if (score === 0) return "No stroke symptoms";
		if (score <= 4) return "Minor stroke";
		if (score <= 15) return "Moderate stroke";
		if (score <= 20) return "Moderate to severe stroke";
		return "Severe stroke";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="bg-white shadow-lg border-l-4 border-l-purple-500">
				<CardHeader>
					<CardTitle className="text-xl text-navy-600 flex items-center">
						<Brain className="h-6 w-6 mr-2 text-purple-500" />
						Neurological Assessment (CVA/Stroke)
						<Badge className="ml-4 bg-gray-100 text-gray-800">
							Pending Assessment
						</Badge>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Neurological History */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Neurological History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="diabetes-duration">Duration of Diabetes</Label>
							<Input
								id="diabetes-duration"
								value={neurologicalHistory.diabetesDuration}
								onChange={(e) => setNeurologicalHistory(prev => ({
									...prev,
									diabetesDuration: e.target.value,
								}))}
								placeholder="e.g., 10 years"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="hypertension-duration">Duration of Hypertension</Label>
							<Input
								id="hypertension-duration"
								value={neurologicalHistory.hypertensionDuration}
								onChange={(e) => setNeurologicalHistory(prev => ({
									...prev,
									hypertensionDuration: e.target.value,
								}))}
								placeholder="e.g., 5 years"
								className="mt-2"
							/>
						</div>

						{/* Previous Stroke/TIA */}
						<div className="space-y-4">
							<Label>Previous Stroke/TIA History</Label>
							<div className="space-y-2 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="stroke-history"
										checked={neurologicalHistory.strokeHistory}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											strokeHistory: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="stroke-history">Previous Stroke</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="tia-history"
										checked={neurologicalHistory.tiaHistory}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											tiaHistory: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="tia-history">Previous TIA</Label>
								</div>
							</div>
							{neurologicalHistory.strokeHistory && (
								<div>
									<Label htmlFor="stroke-details">Stroke Details</Label>
									<Textarea
										id="stroke-details"
										value={neurologicalHistory.strokeDetails}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											strokeDetails: e.target.value,
										}))}
										placeholder="Details about previous stroke..."
										className="mt-2"
										rows={2}
									/>
								</div>
							)}
						</div>

						{/* Neurological Symptoms */}
						<div className="space-y-4 col-span-2">
							<Label>Current Neurological Symptoms</Label>
							<div className="grid grid-cols-2 gap-4 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="headaches"
										checked={neurologicalHistory.headaches}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											headaches: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="headaches">Headaches</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="seizures"
										checked={neurologicalHistory.seizures}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											seizures: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="seizures">Seizures</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="cognitive-changes"
										checked={neurologicalHistory.cognitiveChanges}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											cognitiveChanges: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="cognitive-changes">Memory/Cognitive Changes</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="speech-problems"
										checked={neurologicalHistory.speechProblems}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											speechProblems: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="speech-problems">Speech Problems</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="vision-problems"
										checked={neurologicalHistory.visionProblems}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											visionProblems: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="vision-problems">Vision Problems</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="balance-problems"
										checked={neurologicalHistory.balanceProblems}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											balanceProblems: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="balance-problems">Balance Problems</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="weakness"
										checked={neurologicalHistory.weakness}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											weakness: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="weakness">Weakness</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="numbness"
										checked={neurologicalHistory.numbness}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											numbness: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="numbness">Numbness</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="tremor"
										checked={neurologicalHistory.tremor}
										onChange={(e) => setNeurologicalHistory(prev => ({
											...prev,
											tremor: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="tremor">Tremor</Label>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* BE-FAST Stroke Assessment */}
			<Card className="bg-white shadow-lg border-l-4 border-l-red-500">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Zap className="h-5 w-5 mr-2 text-red-500" />
						BE-FAST Stroke Assessment
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<Label htmlFor="nihss-score">NIHSS Score</Label>
								<Input
									id="nihss-score"
									type="number"
									min="0"
									max="42"
									value={strokeAssessment.nihssScore}
									onChange={(e) => setStrokeAssessment(prev => ({
										...prev,
										nihssScore: parseInt(e.target.value) || 0,
									}))}
									className="mt-2"
								/>
								<div className="mt-2">
									<Badge className={getNIHSSColor(strokeAssessment.nihssScore)}>
										{getNIHSSInterpretation(strokeAssessment.nihssScore)}
									</Badge>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="befast-positive"
										checked={strokeAssessment.befastPositive}
										onChange={(e) => setStrokeAssessment(prev => ({
											...prev,
											befastPositive: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="befast-positive">BE-FAST Positive</Label>
								</div>

								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="carotid-bruit"
										checked={strokeAssessment.carotidBruit}
										onChange={(e) => setStrokeAssessment(prev => ({
											...prev,
											carotidBruit: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="carotid-bruit">Carotid Bruit Present</Label>
								</div>
							</div>
						</div>

						<div>
							<Label htmlFor="befast-details">BE-FAST Details</Label>
							<Textarea
								id="befast-details"
								value={strokeAssessment.befastDetails}
								onChange={(e) => setStrokeAssessment(prev => ({
									...prev,
									befastDetails: e.target.value,
								}))}
								placeholder="B-Balance, E-Eyes, F-Face, A-Arms, S-Speech, T-Time..."
								className="mt-2"
								rows={3}
							/>
						</div>

						<div>
							<Label>Stroke Risk Factors</Label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
								{riskFactorOptions.map((factor) => (
									<div key={factor} className="flex items-center space-x-2">
										<input
											type="checkbox"
											id={`risk-${factor}`}
											checked={strokeAssessment.riskFactors.includes(factor)}
											onChange={() => toggleRiskFactor(factor)}
											className="rounded"
										/>
										<Label htmlFor={`risk-${factor}`} className="text-sm">{factor}</Label>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Neurological Examination */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Stethoscope className="h-5 w-5 mr-2" />
						Neurological Examination
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<Label htmlFor="mental-status">Mental Status</Label>
							<Select
								value={neurologicalExamination.mentalStatus}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									mentalStatus: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select mental status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="alert-oriented">Alert & Oriented</SelectItem>
									<SelectItem value="confused">Confused</SelectItem>
									<SelectItem value="lethargic">Lethargic</SelectItem>
									<SelectItem value="stuporous">Stuporous</SelectItem>
									<SelectItem value="comatose">Comatose</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="orientation">Orientation</Label>
							<Input
								id="orientation"
								value={neurologicalExamination.orientation}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									orientation: e.target.value,
								}))}
								placeholder="Person, Place, Time"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="memory">Memory</Label>
							<Select
								value={neurologicalExamination.memory}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									memory: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select memory status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="intact">Intact</SelectItem>
									<SelectItem value="mild-impairment">Mild Impairment</SelectItem>
									<SelectItem value="moderate-impairment">Moderate Impairment</SelectItem>
									<SelectItem value="severe-impairment">Severe Impairment</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="language">Language</Label>
							<Select
								value={neurologicalExamination.language}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									language: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select language function" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="normal">Normal</SelectItem>
									<SelectItem value="dysarthria">Dysarthria</SelectItem>
									<SelectItem value="aphasia">Aphasia</SelectItem>
									<SelectItem value="dysphasia">Dysphasia</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="cranial-nerves">Cranial Nerves</Label>
							<Textarea
								id="cranial-nerves"
								value={neurologicalExamination.cranialNerves}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									cranialNerves: e.target.value,
								}))}
								placeholder="CN I-XII examination findings..."
								className="mt-2"
								rows={2}
							/>
						</div>

						<div>
							<Label htmlFor="motor-function">Motor Function</Label>
							<Textarea
								id="motor-function"
								value={neurologicalExamination.motorFunction}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									motorFunction: e.target.value,
								}))}
								placeholder="Strength, tone, bulk assessment..."
								className="mt-2"
								rows={2}
							/>
						</div>

						<div>
							<Label htmlFor="sensory-function">Sensory Function</Label>
							<Textarea
								id="sensory-function"
								value={neurologicalExamination.sensoryFunction}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									sensoryFunction: e.target.value,
								}))}
								placeholder="Light touch, vibration, position sense..."
								className="mt-2"
								rows={2}
							/>
						</div>

						<div>
							<Label htmlFor="reflexes">Reflexes</Label>
							<Textarea
								id="reflexes"
								value={neurologicalExamination.reflexes}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									reflexes: e.target.value,
								}))}
								placeholder="Deep tendon reflexes, plantar response..."
								className="mt-2"
								rows={2}
							/>
						</div>

						<div>
							<Label htmlFor="coordination">Coordination</Label>
							<Select
								value={neurologicalExamination.coordination}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									coordination: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select coordination status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="normal">Normal</SelectItem>
									<SelectItem value="mild-ataxia">Mild Ataxia</SelectItem>
									<SelectItem value="moderate-ataxia">Moderate Ataxia</SelectItem>
									<SelectItem value="severe-ataxia">Severe Ataxia</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="gait">Gait</Label>
							<Select
								value={neurologicalExamination.gait}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									gait: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select gait pattern" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="normal">Normal</SelectItem>
									<SelectItem value="hemiparetic">Hemiparetic</SelectItem>
									<SelectItem value="ataxic">Ataxic</SelectItem>
									<SelectItem value="parkinsonian">Parkinsonian</SelectItem>
									<SelectItem value="unable-to-assess">Unable to Assess</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="romberg-test">Romberg Test</Label>
							<Select
								value={neurologicalExamination.rombergTest}
								onValueChange={(value) => setNeurologicalExamination(prev => ({
									...prev,
									rombergTest: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select result" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="negative">Negative</SelectItem>
									<SelectItem value="positive">Positive</SelectItem>
									<SelectItem value="unable-to-perform">Unable to Perform</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="col-span-full">
							<Label htmlFor="examination-notes">Additional Examination Notes</Label>
							<Textarea
								id="examination-notes"
								value={neurologicalExamination.personalNotes}
								onChange={(e) => setNeurologicalExamination(prev => ({
									...prev,
									personalNotes: e.target.value,
								}))}
								placeholder="Additional findings or observations..."
								className="mt-2"
								rows={3}
							/>
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

			{/* Management Recommendations */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Management Recommendations</CardTitle>
				</CardHeader>
				<CardContent>
					<div>
						<Label htmlFor="recommendations">Clinical Recommendations</Label>
						<Textarea
							id="recommendations"
							value={strokeAssessment.recommendations}
							onChange={(e) => setStrokeAssessment(prev => ({
								...prev,
								recommendations: e.target.value,
							}))}
							placeholder="Management plan, follow-up recommendations, risk modification strategies..."
							className="mt-2"
							rows={4}
						/>
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

export default NeurologicalAssessment;