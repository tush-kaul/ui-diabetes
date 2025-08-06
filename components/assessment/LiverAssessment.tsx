"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LeafIcon as Liver, Activity, TestTube, UserCheck, Save, Calculator, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface LiverHistory {
	diabetesDuration: string;
	alcoholConsumption: string;
	bmiValue: string;
	previousHepatitis: boolean;
	familyHistoryLiver: boolean;
	currentMedications: string;
	abdomenPain: boolean;
	nausea: boolean;
	fatigue: boolean;
	jaundice: boolean;
	darkUrine: boolean;
	clayStool: boolean;
	itching: boolean;
	weightLoss: boolean;
}

interface LiverExamination {
	abdomenInspection: string;
	liverPalpable: boolean;
	liverSize: string;
	liverTexture: string;
	splenomegaly: boolean;
	ascites: boolean;
	spiderNevi: boolean;
	palmarErythema: boolean;
	jaundicePresent: boolean;
	peripheralEdema: boolean;
	personalNotes: string;
}

interface FibroScanResults {
	liverStiffness: string;
	stiffnessUnit: string;
	capsValue: string;
	interpretation: string;
	date: string;
}

interface LiverScores {
	fib4Score: number;
	fib4Risk: string;
	nfsScore: number;
	nfsRisk: string;
	apriScore: number;
	apriRisk: string;
}

const LiverAssessment: React.FC = () => {
	const [liverHistory, setLiverHistory] = useState<LiverHistory>({
		diabetesDuration: "",
		alcoholConsumption: "",
		bmiValue: "",
		previousHepatitis: false,
		familyHistoryLiver: false,
		currentMedications: "",
		abdomenPain: false,
		nausea: false,
		fatigue: false,
		jaundice: false,
		darkUrine: false,
		clayStool: false,
		itching: false,
		weightLoss: false,
	});

	const [liverExamination, setLiverExamination] = useState<LiverExamination>({
		abdomenInspection: "",
		liverPalpable: false,
		liverSize: "",
		liverTexture: "",
		splenomegaly: false,
		ascites: false,
		spiderNevi: false,
		palmarErythema: false,
		jaundicePresent: false,
		peripheralEdema: false,
		personalNotes: "",
	});

	const [fibroScanResults, setFibroScanResults] = useState<FibroScanResults>({
		liverStiffness: "",
		stiffnessUnit: "kPa",
		capsValue: "",
		interpretation: "",
		date: "",
	});

	const [liverScores, setLiverScores] = useState<LiverScores>({
		fib4Score: 0,
		fib4Risk: "",
		nfsScore: 0,
		nfsRisk: "",
		apriScore: 0,
		apriRisk: "",
	});

	const [orderedTests, setOrderedTests] = useState<string[]>([]);
	const [referrals, setReferrals] = useState<string[]>([]);

	const liverTrendData = [
		{ date: "Jan 2024", alt: 28, ast: 32, alp: 78, ggt: 45, bilirubin: 1.2 },
		{ date: "Apr 2024", alt: 35, ast: 38, alp: 85, ggt: 52, bilirubin: 1.4 },
		{ date: "Jul 2024", alt: 42, ast: 45, alp: 92, ggt: 58, bilirubin: 1.6 },
	];

	const availableTests = [
		"Liver Function Tests", "Hepatitis B Surface Antigen", "Hepatitis C Antibody",
		"Ultrasound Abdomen", "FibroScan", "CT Abdomen", "MRI Liver",
		"Alpha-fetoprotein", "Ferritin", "Transferrin Saturation",
		"Anti-nuclear Antibody", "Anti-smooth Muscle Antibody", "Ceruloplasmin"
	];

	const availableReferrals = [
		"Hepatology", "Gastroenterology", "Interventional Radiology"
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

	const calculateFibroScanRisk = (stiffness: number) => {
		if (stiffness < 7.0) return { risk: "Low", color: "text-green-600 bg-green-50" };
		if (stiffness < 9.6) return { risk: "Intermediate", color: "text-yellow-600 bg-yellow-50" };
		if (stiffness < 12.5) return { risk: "High", color: "text-orange-600 bg-orange-50" };
		return { risk: "Very High", color: "text-red-600 bg-red-50" };
	};

	const getFIB4Risk = (score: number) => {
		if (score < 1.3) return { risk: "Low", color: "text-green-600 bg-green-50" };
		if (score <= 2.67) return { risk: "Intermediate", color: "text-yellow-600 bg-yellow-50" };
		return { risk: "High", color: "text-red-600 bg-red-50" };
	};

	const getNFSRisk = (score: number) => {
		if (score < -1.455) return { risk: "Low", color: "text-green-600 bg-green-50" };
		if (score <= 0.676) return { risk: "Intermediate", color: "text-yellow-600 bg-yellow-50" };
		return { risk: "High", color: "text-red-600 bg-red-50" };
	};

	const getAPRIRisk = (score: number) => {
		if (score <= 0.5) return { risk: "Low", color: "text-green-600 bg-green-50" };
		if (score <= 1.5) return { risk: "Intermediate", color: "text-yellow-600 bg-yellow-50" };
		return { risk: "High", color: "text-red-600 bg-red-50" };
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<Card className="bg-white shadow-lg border-l-4 border-l-green-500">
				<CardHeader>
					<CardTitle className="text-xl text-navy-600 flex items-center">
						<Liver className="h-6 w-6 mr-2 text-green-500" />
						Liver Assessment (MASLD)
						<Badge className="ml-4 bg-gray-100 text-gray-800">
							Pending Assessment
						</Badge>
					</CardTitle>
				</CardHeader>
			</Card>

			{/* Liver History */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Liver Disease History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="diabetes-duration">Duration of Diabetes</Label>
							<Input
								id="diabetes-duration"
								value={liverHistory.diabetesDuration}
								onChange={(e) => setLiverHistory(prev => ({
									...prev,
									diabetesDuration: e.target.value,
								}))}
								placeholder="e.g., 10 years"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="alcohol-consumption">Alcohol Consumption</Label>
							<Select
								value={liverHistory.alcoholConsumption}
								onValueChange={(value) => setLiverHistory(prev => ({
									...prev,
									alcoholConsumption: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="Select alcohol intake" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="social">Social (1-7 drinks/week)</SelectItem>
									<SelectItem value="moderate">Moderate (8-14 drinks/week)</SelectItem>
									<SelectItem value="heavy">Heavy (>14 drinks/week)</SelectItem>
									<SelectItem value="history">Previous alcohol use</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="bmi-value">Current BMI</Label>
							<Input
								id="bmi-value"
								value={liverHistory.bmiValue}
								onChange={(e) => setLiverHistory(prev => ({
									...prev,
									bmiValue: e.target.value,
								}))}
								placeholder="e.g., 28.5"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="current-medications">Current Medications</Label>
							<Textarea
								id="current-medications"
								value={liverHistory.currentMedications}
								onChange={(e) => setLiverHistory(prev => ({
									...prev,
									currentMedications: e.target.value,
								}))}
								placeholder="List medications that may affect liver..."
								className="mt-2"
								rows={2}
							/>
						</div>

						{/* Risk Factors */}
						<div className="space-y-4">
							<Label>Risk Factors</Label>
							<div className="space-y-2 mt-2">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="previous-hepatitis"
										checked={liverHistory.previousHepatitis}
										onChange={(e) => setLiverHistory(prev => ({
											...prev,
											previousHepatitis: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="previous-hepatitis">Previous Hepatitis</Label>
								</div>
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="family-history-liver"
										checked={liverHistory.familyHistoryLiver}
										onChange={(e) => setLiverHistory(prev => ({
											...prev,
											familyHistoryLiver: e.target.checked,
										}))}
										className="rounded"
									/>
									<Label htmlFor="family-history-liver">Family History of Liver Disease</Label>
								</div>
							</div>
						</div>

						{/* Symptoms */}
						<div className="space-y-4">
							<Label>Current Symptoms</Label>
							<div className="space-y-2 mt-2">
								{Object.entries({
									abdomenPain: "Abdominal Pain",
									nausea: "Nausea/Vomiting",
									fatigue: "Fatigue",
									jaundice: "Jaundice",
									darkUrine: "Dark Urine",
									clayStool: "Clay-colored Stool",
									itching: "Itching",
									weightLoss: "Weight Loss"
								}).map(([key, label]) => (
									<div key={key} className="flex items-center space-x-2">
										<input
											type="checkbox"
											id={key}
											checked={liverHistory[key as keyof LiverHistory] as boolean}
											onChange={(e) => setLiverHistory(prev => ({
												...prev,
												[key]: e.target.checked,
											}))}
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

			{/* Physical Examination */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600">Physical Examination</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div>
							<Label htmlFor="abdomen-inspection">Abdomen Inspection</Label>
							<Input
								id="abdomen-inspection"
								value={liverExamination.abdomenInspection}
								onChange={(e) => setLiverExamination(prev => ({
									...prev,
									abdomenInspection: e.target.value,
								}))}
								placeholder="e.g., Distended, Normal"
								className="mt-2"
							/>
						</div>

						<div className="flex items-center space-x-2 mt-6">
							<input
								type="checkbox"
								id="liver-palpable"
								checked={liverExamination.liverPalpable}
								onChange={(e) => setLiverExamination(prev => ({
									...prev,
									liverPalpable: e.target.checked,
								}))}
								className="rounded"
							/>
							<Label htmlFor="liver-palpable">Liver Palpable</Label>
						</div>

						{liverExamination.liverPalpable && (
							<>
								<div>
									<Label htmlFor="liver-size">Liver Size</Label>
									<Input
										id="liver-size"
										value={liverExamination.liverSize}
										onChange={(e) => setLiverExamination(prev => ({
											...prev,
											liverSize: e.target.value,
										}))}
										placeholder="e.g., 2 cm below costal margin"
										className="mt-2"
									/>
								</div>

								<div>
									<Label htmlFor="liver-texture">Liver Texture</Label>
									<Select
										value={liverExamination.liverTexture}
										onValueChange={(value) => setLiverExamination(prev => ({
											...prev,
											liverTexture: value,
										}))}>
										<SelectTrigger className="mt-2">
											<SelectValue placeholder="Select texture" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="soft">Soft</SelectItem>
											<SelectItem value="firm">Firm</SelectItem>
											<SelectItem value="hard">Hard</SelectItem>
											<SelectItem value="nodular">Nodular</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</>
						)}

						{/* Other Physical Signs */}
						<div className="space-y-4 col-span-2">
							<Label>Additional Physical Signs</Label>
							<div className="grid grid-cols-2 gap-4 mt-2">
								{Object.entries({
									splenomegaly: "Splenomegaly",
									ascites: "Ascites",
									spiderNevi: "Spider Nevi",
									palmarErythema: "Palmar Erythema",
									jaundicePresent: "Jaundice",
									peripheralEdema: "Peripheral Edema"
								}).map(([key, label]) => (
									<div key={key} className="flex items-center space-x-2">
										<input
											type="checkbox"
											id={key}
											checked={liverExamination[key as keyof LiverExamination] as boolean}
											onChange={(e) => setLiverExamination(prev => ({
												...prev,
												[key]: e.target.checked,
											}))}
											className="rounded"
										/>
										<Label htmlFor={key}>{label}</Label>
									</div>
								))}
							</div>
						</div>

						<div className="col-span-full">
							<Label htmlFor="examination-notes">Additional Examination Notes</Label>
							<Textarea
								id="examination-notes"
								value={liverExamination.personalNotes}
								onChange={(e) => setLiverExamination(prev => ({
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

			{/* FibroScan Results */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Calculator className="h-5 w-5 mr-2" />
						FibroScan Results
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div>
							<Label htmlFor="liver-stiffness">Liver Stiffness</Label>
							<Input
								id="liver-stiffness"
								type="number"
								step="0.1"
								value={fibroScanResults.liverStiffness}
								onChange={(e) => setFibroScanResults(prev => ({
									...prev,
									liverStiffness: e.target.value,
								}))}
								placeholder="e.g., 8.5"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="stiffness-unit">Unit</Label>
							<Select
								value={fibroScanResults.stiffnessUnit}
								onValueChange={(value) => setFibroScanResults(prev => ({
									...prev,
									stiffnessUnit: value,
								}))}>
								<SelectTrigger className="mt-2">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="kPa">kPa</SelectItem>
									<SelectItem value="m/s">m/s</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="caps-value">CAP Value</Label>
							<Input
								id="caps-value"
								type="number"
								value={fibroScanResults.capsValue}
								onChange={(e) => setFibroScanResults(prev => ({
									...prev,
									capsValue: e.target.value,
								}))}
								placeholder="e.g., 280"
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="scan-date">Date</Label>
							<Input
								id="scan-date"
								type="date"
								value={fibroScanResults.date}
								onChange={(e) => setFibroScanResults(prev => ({
									...prev,
									date: e.target.value,
								}))}
								className="mt-2"
							/>
						</div>

						{fibroScanResults.liverStiffness && (
							<div className="col-span-full">
								<Label>Interpretation</Label>
								<div className="mt-2">
									<Badge className={calculateFibroScanRisk(parseFloat(fibroScanResults.liverStiffness)).color}>
										{calculateFibroScanRisk(parseFloat(fibroScanResults.liverStiffness)).risk} Risk for Fibrosis
									</Badge>
								</div>
							</div>
						)}

						<div className="col-span-full">
							<Label htmlFor="interpretation">Additional Interpretation</Label>
							<Textarea
								id="interpretation"
								value={fibroScanResults.interpretation}
								onChange={(e) => setFibroScanResults(prev => ({
									...prev,
									interpretation: e.target.value,
								}))}
								placeholder="Clinical interpretation and recommendations..."
								className="mt-2"
								rows={2}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Liver Function Trends */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Activity className="h-5 w-5 mr-2" />
						Liver Function Trends
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={liverTrendData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<ReferenceLine y={40} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "ALT Normal: <40", position: "insideTopLeft" }} />
							<Line type="monotone" dataKey="alt" stroke="#8884d8" name="ALT (U/L)" strokeWidth={2} />
							<Line type="monotone" dataKey="ast" stroke="#82ca9d" name="AST (U/L)" strokeWidth={2} />
							<Line type="monotone" dataKey="alp" stroke="#ffc658" name="ALP (U/L)" strokeWidth={2} />
							<Line type="monotone" dataKey="ggt" stroke="#ff7300" name="GGT (U/L)" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
					<div className="mt-4 text-sm text-gray-600">
						<p><strong>Trend:</strong> Progressive elevation in liver enzymes suggesting ongoing hepatic inflammation</p>
					</div>
				</CardContent>
			</Card>

			{/* Fibrosis Risk Scores */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Calculator className="h-5 w-5 mr-2" />
						Fibrosis Risk Scores
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="p-4 border rounded-lg">
							<h4 className="font-semibold mb-2">FIB-4 Score</h4>
							<div className="text-2xl font-bold mb-2">{liverScores.fib4Score.toFixed(2)}</div>
							<Badge className={getFIB4Risk(liverScores.fib4Score).color}>
								{getFIB4Risk(liverScores.fib4Score).risk} Risk
							</Badge>
							<p className="text-sm text-gray-600 mt-2">
								Normal: &lt;1.3, Intermediate: 1.3-2.67, High: &gt;2.67
							</p>
						</div>

						<div className="p-4 border rounded-lg">
							<h4 className="font-semibold mb-2">NFS Score</h4>
							<div className="text-2xl font-bold mb-2">{liverScores.nfsScore.toFixed(2)}</div>
							<Badge className={getNFSRisk(liverScores.nfsScore).color}>
								{getNFSRisk(liverScores.nfsScore).risk} Risk
							</Badge>
							<p className="text-sm text-gray-600 mt-2">
								Low: &lt;-1.455, Intermediate: -1.455 to 0.676, High: &gt;0.676
							</p>
						</div>

						<div className="p-4 border rounded-lg">
							<h4 className="font-semibold mb-2">APRI Score</h4>
							<div className="text-2xl font-bold mb-2">{liverScores.apriScore.toFixed(2)}</div>
							<Badge className={getAPRIRisk(liverScores.apriScore).color}>
								{getAPRIRisk(liverScores.apriScore).risk} Risk
							</Badge>
							<p className="text-sm text-gray-600 mt-2">
								Low: ≤0.5, Intermediate: 0.5-1.5, High: &gt;1.5
							</p>
						</div>
					</div>
					<div className="mt-4 p-3 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-800">
							<strong>Note:</strong> These scores are calculated based on age, AST, ALT, platelet count, and other parameters. 
							Please ensure lab values are current for accurate assessment.
						</p>
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

export default LiverAssessment;