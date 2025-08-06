"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Stethoscope, Activity, TestTube, UserCheck, Save, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface CardiacHistory {
	diabetesDuration: string;
	hypertensionDuration: string;
	familyHistoryIHD: boolean;
	smokingHistory: string;
	chestPain: boolean;
	dyspnea: boolean;
	palpitations: boolean;
	syncope: boolean;
	edema: boolean;
	previousMI: boolean;
	previousPCI: boolean;
	previousCABG: boolean;
}

interface CardiacExamination {
	heartRate: string;
	bloodPressure: string;
	heartSounds: string;
	murmurs: string;
	peripheralPulses: string;
	jvp: string;
	hepatomegaly: boolean;
	pedalEdema: string;
	personalNotes: string;
}

interface CardiacManagement {
	riskStratification: string;
	medications: string[];
	lifestyle: string;
	followUp: string;
	specialistReferral: boolean;
	personalNotes: string;
}

const CardiacAssessment: React.FC = () => {
	const [cardiacHistory, setCardiacHistory] = useState<CardiacHistory>({
		diabetesDuration: "",
		hypertensionDuration: "",
		familyHistoryIHD: false,
		smokingHistory: "",
		chestPain: false,
		dyspnea: false,
		palpitations: false,
		syncope: false,
		edema: false,
		previousMI: false,
		previousPCI: false,
		previousCABG: false,
	});

	const [cardiacExamination, setCardiacExamination] = useState<CardiacExamination>({
		heartRate: "",
		bloodPressure: "",
		heartSounds: "",
		murmurs: "",
		peripheralPulses: "",
		jvp: "",
		hepatomegaly: false,
		pedalEdema: "",
		personalNotes: "",
	});

	const [cardiacManagement, setCardiacManagement] = useState<CardiacManagement>({
		riskStratification: "",
		medications: [],
		lifestyle: "",
		followUp: "",
		specialistReferral: false,
		personalNotes: "",
	});

	const [orderedTests, setOrderedTests] = useState<string[]>([]);
	const [referrals, setReferrals] = useState<string[]>([]);

	const cardiacTrendData = [
		{ date: "Jan 2024", ejectionFraction: 62, troponin: 0.01, bnp: 45 },
		{ date: "Apr 2024", ejectionFraction: 60, troponin: 0.02, bnp: 52 },
		{ date: "Jul 2024", ejectionFraction: 58, troponin: 0.03, bnp: 58 },
	];

	const availableTests = [
		"ECG", "ECHO", "Stress Test", "Coronary Angiography", "CT Angiography", 
		"Cardiac MRI", "Holter Monitor", "BNP", "Troponin", "Lipid Profile",
		"HbA1c", "CRP"
	];

	const availableReferrals = ["Cardiology", "Cardiac Surgery", "Interventional Cardiology"];

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

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case "high": return "text-red-600 bg-red-50 border-red-200";
			case "moderate": return "text-orange-600 bg-orange-50 border-orange-200";
			case "low": return "text-green-600 bg-green-50 border-green-200";
			default: return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="bg-white shadow-lg border-l-4 border-l-red-500">
				<CardHeader>
					<CardTitle className="text-xl text-navy-600 flex items-center">
						<Heart className="h-6 w-6 mr-2 text-red-500" />
						Cardiac Assessment (IHD)
						<Badge className="ml-4 bg-orange-100 text-orange-800">
							Moderate Risk
						</Badge>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Cardiac History */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Cardiac History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="diabetes-duration">Duration of Diabetes</Label>
							<Input
								id="diabetes-duration"
								value={cardiacHistory.diabetesDuration}
								onChange={(e) => setCardiacHistory(prev => ({
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
								value={cardiacHistory.hypertensionDuration}
								onChange={(e) => setCardiacHistory(prev => ({
									...prev,
									hypertensionDuration: e.target.value,
								}))}
								placeholder="e.g., 5 years"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="smoking-history">Smoking History</Label>
							<Select
								value={cardiacHistory.smokingHistory}
								onValueChange={(value) => setCardiacHistory(prev => ({
									...prev,
									smokingHistory: value,
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

						{/* Risk Factors */}
						<div className="space-y-4">
							<Label>Risk Factors</Label>
							<div className="space-y-2 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="family-history-ihd"
										checked={cardiacHistory.familyHistoryIHD}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											familyHistoryIHD: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="family-history-ihd">Family History of IHD</Label>
								</div>
							</div>
						</div>

						{/* Symptoms */}
						<div className="space-y-4 col-span-2">
							<Label>Current Symptoms</Label>
							<div className="grid grid-cols-2 gap-4 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="chest-pain"
										checked={cardiacHistory.chestPain}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											chestPain: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="chest-pain">Chest Pain</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="dyspnea"
										checked={cardiacHistory.dyspnea}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											dyspnea: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="dyspnea">Shortness of Breath</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="palpitations"
										checked={cardiacHistory.palpitations}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											palpitations: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="palpitations">Palpitations</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="syncope"
										checked={cardiacHistory.syncope}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											syncope: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="syncope">Syncope</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="edema"
										checked={cardiacHistory.edema}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											edema: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="edema">Pedal Edema</Label>
								</div>
							</div>
						</div>

						{/* Previous Interventions */}
						<div className="space-y-4">
							<Label>Previous Cardiac Interventions</Label>
							<div className="space-y-2 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-mi"
										checked={cardiacHistory.previousMI}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											previousMI: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-mi">Previous MI</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-pci"
										checked={cardiacHistory.previousPCI}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											previousPCI: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-pci">Previous PCI</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-cabg"
										checked={cardiacHistory.previousCABG}
										onChange={(e) => setCardiacHistory(prev => ({
											...prev,
											previousCABG: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-cabg">Previous CABG</Label>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Physical Examination */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Stethoscope className="h-5 w-5 mr-2" />
						Physical Examination
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
							<Input
								id="heart-rate"
								value={cardiacExamination.heartRate}
								onChange={(e) => setCardiacExamination(prev => ({
									...prev,
									heartRate: e.target.value,
								}))}
								placeholder="e.g., 72"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="blood-pressure">Blood Pressure (mmHg)</Label>
							<Input
								id="blood-pressure"
								value={cardiacExamination.bloodPressure}
								onChange={(e) => setCardiacExamination(prev => ({
									...prev,
									bloodPressure: e.target.value,
								}))}
								placeholder="e.g., 130/80"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="heart-sounds">Heart Sounds</Label>
							<Select
								value={cardiacExamination.heartSounds}
								onValueChange={(value) => setCardiacExamination(prev => ({
									...prev,
									heartSounds: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select heart sounds" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="normal">Normal S1, S2</SelectItem>
									<SelectItem value="s3-gallop">S3 Gallop</SelectItem>
									<SelectItem value="s4-gallop">S4 Gallop</SelectItem>
									<SelectItem value="irregular">Irregular</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="murmurs">Murmurs</Label>
							<Input
								id="murmurs"
								value={cardiacExamination.murmurs}
								onChange={(e) => setCardiacExamination(prev => ({
									...prev,
									murmurs: e.target.value,
								}))}
								placeholder="e.g., 2/6 systolic murmur"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="peripheral-pulses">Peripheral Pulses</Label>
							<Select
								value={cardiacExamination.peripheralPulses}
								onValueChange={(value) => setCardiacExamination(prev => ({
									...prev,
									peripheralPulses: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select pulse status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="normal">Normal</SelectItem>
									<SelectItem value="diminished">Diminished</SelectItem>
									<SelectItem value="absent">Absent</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="jvp">JVP (cm)</Label>
							<Input
								id="jvp"
								value={cardiacExamination.jvp}
								onChange={(e) => setCardiacExamination(prev => ({
									...prev,
									jvp: e.target.value,
								}))}
								placeholder="e.g., 4 cm"
								className="mt-2"
							/>
						</div>

						<div className="flex items-center space-x-2 mt-6">
							<input
								type="checkbox"
								id="hepatomegaly"
								checked={cardiacExamination.hepatomegaly}
								onChange={(e) => setCardiacExamination(prev => ({
									...prev,
									hepatomegaly: e.target.checked,
								}))}
								className="rounded"
							/>
							<Label htmlFor="hepatomegaly">Hepatomegaly</Label>
						</div>

						<div>
							<Label htmlFor="pedal-edema">Pedal Edema</Label>
							<Select
								value={cardiacExamination.pedalEdema}
								onValueChange={(value) => setCardiacExamination(prev => ({
									...prev,
									pedalEdema: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select edema grade" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="grade1">Grade 1+</SelectItem>
									<SelectItem value="grade2">Grade 2+</SelectItem>
									<SelectItem value="grade3">Grade 3+</SelectItem>
									<SelectItem value="grade4">Grade 4+</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="col-span-full">
							<Label htmlFor="examination-notes">Additional Examination Notes</Label>
							<Textarea
								id="examination-notes"
								value={cardiacExamination.personalNotes}
								onChange={(e) => setCardiacExamination(prev => ({
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

			{/* Trend Analysis */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Activity className="h-5 w-5 mr-2" />
						Cardiac Function Trends
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={cardiacTrendData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<ReferenceLine y={55} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "EF Normal: ≥55%", position: "insideTopLeft" }} />
							<Line type="monotone" dataKey="ejectionFraction" stroke="#8884d8" name="Ejection Fraction (%)" strokeWidth={3} />
							<Line type="monotone" dataKey="bnp" stroke="#82ca9d" name="BNP (pg/mL)" strokeWidth={3} />
						</LineChart>
					</ResponsiveContainer>
					<div className="mt-4 text-sm text-gray-600">
						<p><strong>Current Status:</strong> Mild ECG changes - T wave flattening in V5-V6, ECHO EF 60%</p>
						<p><strong>Trend:</strong> Slight decline in ejection fraction, stable BNP levels</p>
					</div>
				</CardContent>
			</Card>

			{/* Management Plan */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Management Plan</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div>
							<Label htmlFor="risk-stratification">Risk Stratification</Label>
							<Select
								value={cardiacManagement.riskStratification}
								onValueChange={(value) => setCardiacManagement(prev => ({
									...prev,
									riskStratification: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select risk level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low Risk</SelectItem>
									<SelectItem value="intermediate">Intermediate Risk</SelectItem>
									<SelectItem value="high">High Risk</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Lifestyle Modifications</Label>
							<Textarea
								value={cardiacManagement.lifestyle}
								onChange={(e) => setCardiacManagement(prev => ({
									...prev,
									lifestyle: e.target.value,
								}))}
								placeholder="Diet modifications, exercise recommendations, smoking cessation..."
								className="mt-2"
								rows={3}
							/>
						</div>

						<div>
							<Label htmlFor="follow-up">Follow-up Plan</Label>
							<Input
								id="follow-up"
								value={cardiacManagement.followUp}
								onChange={(e) => setCardiacManagement(prev => ({
									...prev,
									followUp: e.target.value,
								}))}
								placeholder="e.g., 3 months, 6 months"
								className="mt-2"
							/>
						</div>

						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="specialist-referral"
								checked={cardiacManagement.specialistReferral}
								onChange={(e) => setCardiacManagement(prev => ({
									...prev,
									specialistReferral: e.target.checked,
								}))}
								className="rounded"
							/>
							<Label htmlFor="specialist-referral">Specialist Referral Required</Label>
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

export default CardiacAssessment;