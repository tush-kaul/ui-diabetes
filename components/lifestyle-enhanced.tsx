"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	ReferenceLine,
	ReferenceArea,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Activity,
	Apple,
	Cigarette,
	Wine,
	Heart,
	Brain,
	Dumbbell,
	Clock,
	AlertTriangle,
	CheckCircle,
	Edit3,
	Save,
	HelpCircle,
	BarChart3,
	Table,
} from "lucide-react";

export default function LifestyleEnhanced() {
	const [isEditing, setIsEditing] = useState(false);

	// View mode for embedded Goals/Adherence (match adherence-communication)
	const [viewMode, setViewMode] = useState({
		goals: "chart",
		adherence: "chart",
	});
	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};
	const [dietChecklist, setDietChecklist] = useState({
		highFiber: true,
		complexGrains: false,
		portionControl: true,
		fruitsVegetables: false,
		mealTiming: true,
		outsideFoodMoreThanWeekly: false,
	});

	const [physicalActivity, setPhysicalActivity] = useState({
		stepCount: "8500",
		walkingMinutes: "45",
		aerobicActivity: "3",
		strengthTraining: "2",
		yoga: "1",
		meditation: "4",
	});

	const [habits, setHabits] = useState({
		smoking: "never",
		alcohol: "occasional",
		substanceAbuse: "none",
	});

	const [stressManagement, setStressManagement] = useState({
		level: "3",
		techniques: ["walking", "reading", "family-time"],
		notes: "Patient reports good stress management through regular walking and family activities",
	});

	const [personalNotes, setPersonalNotes] = useState("");

	// Overall adherence data with target zones (match adherence-communication)
	const adherenceData = [
		{
			date: "2024-01",
			overall: 85,
			medication: 88,
			lifestyle: 82,
			appointments: 85,
		},
		{
			date: "2024-02",
			overall: 89,
			medication: 92,
			lifestyle: 86,
			appointments: 90,
		},
		{
			date: "2024-03",
			overall: 87,
			medication: 90,
			lifestyle: 84,
			appointments: 87,
		},
		{
			date: "2024-04",
			overall: 92,
			medication: 95,
			lifestyle: 89,
			appointments: 92,
		},
		{
			date: "2024-05",
			overall: 88,
			medication: 91,
			lifestyle: 85,
			appointments: 88,
		},
		{
			date: "2024-06",
			overall: 91,
			medication: 94,
			lifestyle: 88,
			appointments: 91,
		},
		{
			date: "2024-07",
			overall: 90,
			medication: 93,
			lifestyle: 87,
			appointments: 90,
		},
	];

	// Goal achievement data (match adherence-communication)
	const goalData = [
		{ date: "2024-01", hba1c: 91, ldl: 91, bp: 100, weight: 75 },
		{ date: "2024-02", hba1c: 91, ldl: 91, bp: 100, weight: 78 },
		{ date: "2024-03", hba1c: 91, ldl: 91, bp: 100, weight: 80 },
		{ date: "2024-04", hba1c: 91, ldl: 91, bp: 100, weight: 82 },
		{ date: "2024-05", hba1c: 91, ldl: 91, bp: 95, weight: 85 },
		{ date: "2024-06", hba1c: 91, ldl: 91, bp: 95, weight: 87 },
		{ date: "2024-07", hba1c: 91, ldl: 91, bp: 100, weight: 90 },
	];

	const targetGoals = [
		{
			metric: "HbA1c",
			target: 7.5,
			current: 8.2,
			achieved: false,
			percentage: 91,
			unit: "%",
			priority: "high",
			lastUpdated: "2024-07-08",
		},
		{
			metric: "LDL Cholesterol",
			target: 70,
			current: 77,
			achieved: false,
			percentage: 91,
			unit: "mg/dl",
			priority: "medium",
			lastUpdated: "2024-05-03",
		},
		{
			metric: "Blood Pressure",
			target: "130/80",
			current: "130/84",
			achieved: false,
			percentage: 95,
			unit: "mmHg",
			priority: "medium",
			lastUpdated: "2024-07-10",
		},
		{
			metric: "Weight",
			target: 65,
			current: 68,
			achieved: false,
			percentage: 90,
			unit: "kg",
			priority: "low",
			lastUpdated: "2024-07-10",
		},
	];

	const renderGoalsChart = () => {
		const isChart = viewMode.goals === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Goal Achievement Progress
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("goals")}
						aria-label="Toggle goals view">
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
							<LineChart data={goalData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[70, 105]} />
								<RechartsTooltip
									formatter={(value: any, name: any) => [
										`${value}%`,
										`${name} Achievement`,
									]}
									labelFormatter={(label: any) =>
										`Date: ${label}`
									}
								/>

								{/* Goal Achievement Zones */}
								<ReferenceArea
									y1={95}
									y2={105}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={85}
									y2={95}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={70}
									y2={85}
									fill="#ef4444"
									fillOpacity={0.1}
								/>

								<ReferenceLine
									y={95}
									stroke="#22c55e"
									strokeDasharray="5 5"
									label={{
										value: "Target: ≥95%",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									y={85}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Acceptable: ≥85%",
										position: "insideBottomRight",
									}}
								/>

								<Line
									type="monotone"
									dataKey="hba1c"
									stroke="#8884d8"
									strokeWidth={2}
									name="HbA1c"
								/>
								<Line
									type="monotone"
									dataKey="ldl"
									stroke="#82ca9d"
									strokeWidth={2}
									name="LDL"
								/>
								<Line
									type="monotone"
									dataKey="bp"
									stroke="#ffc658"
									strokeWidth={2}
									name="Blood Pressure"
								/>
								<Line
									type="monotone"
									dataKey="weight"
									stroke="#ff7300"
									strokeWidth={2}
									name="Weight"
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex justify-center space-x-6 text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-green-200 rounded"></div>
								<span>Target Achieved (≥95%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-yellow-200 rounded"></div>
								<span>Acceptable (85-94%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-red-200 rounded"></div>
								<span>Needs Attention (&lt;85%)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-hidden">
						<table className="w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-3 text-left">Date</th>
									<th className="p-3 text-left">HbA1c (%)</th>
									<th className="p-3 text-left">LDL (%)</th>
									<th className="p-3 text-left">BP (%)</th>
									<th className="p-3 text-left">
										Weight (%)
									</th>
									<th className="p-3 text-left">
										Overall Status
									</th>
								</tr>
							</thead>
							<tbody>
								{goalData.map((item, index) => {
									const average = Math.round(
										(item.hba1c +
											item.ldl +
											item.bp +
											item.weight) /
											4
									);
									return (
										<tr
											key={index}
											className="border-t">
											<td className="p-3">{item.date}</td>
											<td className="p-3">
												{item.hba1c}%
											</td>
											<td className="p-3">{item.ldl}%</td>
											<td className="p-3">{item.bp}%</td>
											<td className="p-3">
												{item.weight}%
											</td>
											<td className="p-3">
												<Badge
													variant={
														average >= 95
															? "default"
															: average >= 85
															? "secondary"
															: "destructive"
													}>
													{average >= 95
														? "Target Achieved"
														: average >= 85
														? "Acceptable"
														: "Needs Attention"}
												</Badge>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		);
	};

	const renderAdherenceChart = () => {
		const isChart = viewMode.adherence === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Overall Adherence Trends
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("adherence")}
						aria-label="Toggle adherence view">
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
							height={250}
							className="mt-4 -ml-4 sm:ml-0">
							<LineChart
								data={adherenceData}
								margin={{
									top: 5,
									right: 5,
									left: -20,
									bottom: 5,
								}}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[70, 100]} />
								<RechartsTooltip
									formatter={(value: any, name: any) => [
										`${value}%`,
										name,
									]}
									labelFormatter={(label: any) =>
										`Date: ${label}`
									}
								/>
								<ReferenceArea
									y1={90}
									y2={100}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={80}
									y2={90}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={70}
									y2={80}
									fill="#ef4444"
									fillOpacity={0.1}
								/>
								<ReferenceLine
									y={90}
									stroke="#22c55e"
									strokeDasharray="5 5"
									label={{
										value: "Excellent: ≥90%",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									y={80}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Good: ≥80%",
										position: "insideBottomRight",
									}}
								/>
								<Line
									type="monotone"
									dataKey="overall"
									stroke="#8884d8"
									strokeWidth={3}
									name="Overall"
									dot={(props: any) => {
										const { cx, cy, payload } = props;
										const color =
											payload.overall >= 90
												? "#22c55e"
												: payload.overall >= 80
												? "#eab308"
												: "#ef4444";
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
									dataKey="medication"
									stroke="#82ca9d"
									strokeWidth={2}
									name="Medication"
								/>
								<Line
									type="monotone"
									dataKey="lifestyle"
									stroke="#ffc658"
									strokeWidth={2}
									name="Lifestyle"
								/>
								<Line
									type="monotone"
									dataKey="appointments"
									stroke="#ff7300"
									strokeWidth={2}
									name="Appointments"
								/>
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-4 text-xs sm:text-sm px-2">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
								<span>Excellent (≥90%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded"></div>
								<span>Good (80-89%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded"></div>
								<span>Needs Improvement (&lt;80%)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-[500px]">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Date
									</th>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Overall (%)
									</th>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Medication (%)
									</th>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Lifestyle (%)
									</th>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Appointments (%)
									</th>
									<th className="p-2 sm:p-3 text-left whitespace-nowrap">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{adherenceData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-3">{item.date}</td>
										<td className="p-3 font-semibold">
											<span
												style={{
													color:
														item.overall >= 90
															? "#22c55e"
															: item.overall >= 80
															? "#eab308"
															: "#ef4444",
												}}>
												{item.overall}%
											</span>
										</td>
										<td className="p-3">
											{item.medication}%
										</td>
										<td className="p-3">
											{item.lifestyle}%
										</td>
										<td className="p-3">
											{item.appointments}%
										</td>
										<td className="p-3">
											<Badge
												variant={
													item.overall >= 90
														? "default"
														: item.overall >= 80
														? "secondary"
														: "destructive"
												}>
												{item.overall >= 90
													? "Excellent"
													: item.overall >= 80
													? "Good"
													: "Needs Improvement"}
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

	const handleDietChange = (key: string, checked: boolean) => {
		setDietChecklist((prev) => ({ ...prev, [key]: checked }));
	};

	const handleActivityChange = (key: string, value: string) => {
		setPhysicalActivity((prev) => ({ ...prev, [key]: value }));
	};

	const getDietComplianceScore = () => {
		const keys = Object.keys(dietChecklist) as Array<
			keyof typeof dietChecklist
		>;
		const adheredCount = keys.reduce((acc, key) => {
			if (key === "outsideFoodMoreThanWeekly") {
				return acc + (!dietChecklist[key] ? 1 : 0);
			}
			return acc + (dietChecklist[key] ? 1 : 0);
		}, 0);
		return Math.round((adheredCount / keys.length) * 100);
	};

	const getDietAdherenceCount = () => {
		const keys = Object.keys(dietChecklist) as Array<
			keyof typeof dietChecklist
		>;
		return keys.reduce((acc, key) => {
			if (key === "outsideFoodMoreThanWeekly") {
				return acc + (!dietChecklist[key] ? 1 : 0);
			}
			return acc + (dietChecklist[key] ? 1 : 0);
		}, 0);
	};

	const getActivityScore = () => {
		const stepScore =
			Number.parseInt(physicalActivity.stepCount) >= 8000 ? 25 : 15;
		const walkScore =
			Number.parseInt(physicalActivity.walkingMinutes) >= 30 ? 25 : 15;
		const aerobicScore =
			Number.parseInt(physicalActivity.aerobicActivity) >= 3 ? 25 : 15;
		const strengthScore =
			Number.parseInt(physicalActivity.strengthTraining) >= 2 ? 25 : 15;
		return stepScore + walkScore + aerobicScore + strengthScore;
	};

	return (
		<div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Lifestyle | Adherence | Goals Tabs */}
			<Tabs
				defaultValue="lifestyle"
				className="w-full">
				<TabsList className="mb-4 flex gap-2 overflow-x-auto whitespace-nowrap">
					<TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
					<TabsTrigger value="adherence">Adherence</TabsTrigger>
					<TabsTrigger value="goals">Goals</TabsTrigger>
				</TabsList>

				<TabsContent value="lifestyle">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-3xl font-bold text-navy-600">
							Lifestyle Overview
						</h1>
						<Button
							onClick={() => setIsEditing(!isEditing)}
							variant={isEditing ? "default" : "outline"}
							className="flex items-center gap-2">
							{isEditing ? (
								<Save className="h-4 w-4" />
							) : (
								<Edit3 className="h-4 w-4" />
							)}
							{isEditing ? "Save Changes" : "Edit Lifestyle"}
						</Button>
					</div>
					{/* Quick Summary Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Apple className="mr-2 h-5 w-5 text-green-500" />
									Diet Compliance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									{getDietComplianceScore()}%
								</div>
								<Progress
									value={getDietComplianceScore()}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-gray-500">
									{getDietAdherenceCount()} of{" "}
									{Object.keys(dietChecklist).length} goals
									met
								</div>
								<div className="text-xs text-gray-600 mt-1">
									Outside food:{" "}
									{dietChecklist.outsideFoodMoreThanWeekly
										? ">1/week"
										: "≤1/week"}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Activity className="mr-2 h-5 w-5 text-blue-500" />
									Activity Score
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									{getActivityScore()}%
								</div>
								<Progress
									value={getActivityScore()}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-gray-500">
									{physicalActivity.stepCount} steps/day avg
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Heart className="mr-2 h-5 w-5 text-red-500" />
									Habits Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-1">
									<div className="flex items-center justify-between text-sm">
										<span>Smoking:</span>
										<Badge
											variant={
												habits.smoking === "never"
													? "default"
													: "destructive"
											}>
											{habits.smoking}
										</Badge>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span>Alcohol:</span>
										<Badge
											variant={
												habits.alcohol === "none"
													? "default"
													: "secondary"
											}>
											{habits.alcohol}
										</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Brain className="mr-2 h-5 w-5 text-purple-500" />
									Stress Level
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									{stressManagement.level}/10
								</div>
								<Progress
									value={
										Number.parseInt(
											stressManagement.level
										) * 10
									}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-green-600">
									Well managed
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Detailed Lifestyle Assessment */}
					<div className="space-y-6">
						{/* Diet Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Apple className="mr-2 h-6 w-6 text-green-500" />
									Diet Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold mb-4 text-red-600">
											Diet:
										</h4>
										<div className="space-y-3">
											<div className="flex items-center space-x-3">
												<Checkbox
													id="highFiber"
													checked={
														dietChecklist.highFiber
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"highFiber",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<Label
													htmlFor="highFiber"
													className="flex items-center">
													High fiber diet (25-30g/day)
													{!dietChecklist.highFiber && (
														<AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
													)}
												</Label>
											</div>

											<div className="flex items-center space-x-3">
												<Checkbox
													id="complexGrains"
													checked={
														dietChecklist.complexGrains
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"complexGrains",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<Label
													htmlFor="complexGrains"
													className="flex items-center">
													Complex grains (brown rice,
													whole wheat)
													{!dietChecklist.complexGrains && (
														<AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
													)}
												</Label>
											</div>

											<div className="flex items-center space-x-3">
												<Checkbox
													id="portionControl"
													checked={
														dietChecklist.portionControl
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"portionControl",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<Label
													htmlFor="portionControl"
													className="flex items-center">
													Portion size as food plate
													principle
													{dietChecklist.portionControl && (
														<CheckCircle className="ml-2 h-4 w-4 text-green-500" />
													)}
												</Label>
											</div>

											<div className="flex items-center space-x-3">
												<Checkbox
													id="fruitsVegetables"
													checked={
														dietChecklist.fruitsVegetables
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"fruitsVegetables",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<Label
													htmlFor="fruitsVegetables"
													className="flex items-center">
													4-5 servings of fruits and
													vegetables daily
													{!dietChecklist.fruitsVegetables && (
														<AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
													)}
												</Label>
											</div>

											<div className="flex items-center space-x-3">
												<Checkbox
													id="mealTiming"
													checked={
														dietChecklist.mealTiming
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"mealTiming",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<Label
													htmlFor="mealTiming"
													className="flex items-center">
													Appropriate timing of meals
													and snacks
													{dietChecklist.mealTiming && (
														<CheckCircle className="ml-2 h-4 w-4 text-green-500" />
													)}
												</Label>
											</div>
											<div className="flex items-start space-x-3">
												<Checkbox
													id="outsideFoodMoreThanWeekly"
													checked={
														dietChecklist.outsideFoodMoreThanWeekly
													}
													onCheckedChange={(
														checked
													) =>
														handleDietChange(
															"outsideFoodMoreThanWeekly",
															checked as boolean
														)
													}
													disabled={!isEditing}
												/>
												<div className="space-y-1">
													<Label
														htmlFor="outsideFoodMoreThanWeekly"
														className="flex items-center gap-2">
														Eating/Ordering outside
														food more than once a
														week.
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger
																	asChild>
																	<HelpCircle className="h-4 w-4 text-gray-400" />
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		Aim for
																		once per
																		week or
																		less.
																	</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</Label>
													<p className="text-xs text-gray-500">
														Restaurant and takeaway
														foods can be high in
														sodium, sugar, and fats.
													</p>
												</div>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-semibold mb-4">
											Current Diet Summary:
										</h4>
										<div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
											<p>
												<strong>Carbohydrates:</strong>{" "}
												Mainly refined grains, needs
												complex carbs
											</p>
											<p>
												<strong>Fiber intake:</strong>{" "}
												~15g/day (Target: 25-30g/day)
											</p>
											<p>
												<strong>
													Fruits & Vegetables:
												</strong>{" "}
												2-3 servings/day (Target: 4-5)
											</p>
											<p>
												<strong>Meal timing:</strong>{" "}
												Regular 3 meals + 2 snacks
											</p>
											<p>
												<strong>
													Portion control:
												</strong>{" "}
												Following plate method partially
											</p>
										</div>

										{isEditing && (
											<div className="mt-4">
												<Label htmlFor="dietNotes">
													Additional Diet Notes:
												</Label>
												<Textarea
													id="dietNotes"
													placeholder="Add specific diet recommendations or patient preferences..."
													className="mt-2"
												/>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Physical Activity Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Activity className="mr-2 h-6 w-6 text-blue-500" />
									Physical Activity Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold mb-4">
											Activity Metrics:
										</h4>
										<div className="space-y-4">
											<div className="flex items-center space-x-3">
												<Activity className="h-4 w-4 text-blue-500" />
												<Label className="w-32">
													Step Count/day:
												</Label>
												<Input
													value={
														physicalActivity.stepCount
													}
													onChange={(e) =>
														handleActivityChange(
															"stepCount",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
												<span className="text-sm text-gray-500">
													(Target: ≥8000)
												</span>
											</div>

											<div className="flex items-center space-x-3">
												<Clock className="h-4 w-4 text-green-500" />
												<Label className="w-32">
													Walking (min/day):
												</Label>
												<Input
													value={
														physicalActivity.walkingMinutes
													}
													onChange={(e) =>
														handleActivityChange(
															"walkingMinutes",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
												<span className="text-sm text-gray-500">
													(Target: ≥30)
												</span>
											</div>

											<div className="flex items-center space-x-3">
												<Heart className="h-4 w-4 text-red-500" />
												<Label className="w-32">
													Aerobic (days/week):
												</Label>
												<Input
													value={
														physicalActivity.aerobicActivity
													}
													onChange={(e) =>
														handleActivityChange(
															"aerobicActivity",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
												<span className="text-sm text-gray-500">
													(Target: ≥3)
												</span>
											</div>

											<div className="flex items-center space-x-3">
												<Dumbbell className="h-4 w-4 text-purple-500" />
												<Label className="w-32">
													Strength (days/week):
												</Label>
												<Input
													value={
														physicalActivity.strengthTraining
													}
													onChange={(e) =>
														handleActivityChange(
															"strengthTraining",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
												<span className="text-sm text-gray-500">
													(Target: ≥2)
												</span>
											</div>

											<div className="flex items-center space-x-3">
												<Brain className="h-4 w-4 text-indigo-500" />
												<Label className="w-32">
													Yoga (days/week):
												</Label>
												<Input
													value={
														physicalActivity.yoga
													}
													onChange={(e) =>
														handleActivityChange(
															"yoga",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
											</div>

											<div className="flex items-center space-x-3">
												<Brain className="h-4 w-4 text-teal-500" />
												<Label className="w-32">
													Meditation (days/week):
												</Label>
												<Input
													value={
														physicalActivity.meditation
													}
													onChange={(e) =>
														handleActivityChange(
															"meditation",
															e.target.value
														)
													}
													disabled={!isEditing}
													className="w-24"
												/>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-semibold mb-4">
											Activity Summary:
										</h4>
										<div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
											<p>
												<strong>
													Overall Activity Level:
												</strong>{" "}
												Moderate
											</p>
											<p>
												<strong>
													Primary Activities:
												</strong>{" "}
												Walking, light aerobics
											</p>
											<p>
												<strong>
													Strength Training:
												</strong>{" "}
												Needs improvement
											</p>
											<p>
												<strong>Flexibility:</strong>{" "}
												Occasional yoga
											</p>
											<p>
												<strong>Mindfulness:</strong>{" "}
												Regular meditation practice
											</p>
										</div>

										<div className="mt-4">
											<h5 className="font-medium mb-2">
												Activity Goals Status:
											</h5>
											<div className="space-y-1">
												<div className="flex justify-between text-sm">
													<span>Steps Goal:</span>
													<Badge
														variant={
															Number.parseInt(
																physicalActivity.stepCount
															) >= 8000
																? "default"
																: "destructive"
														}>
														{Number.parseInt(
															physicalActivity.stepCount
														) >= 8000
															? "Met"
															: "Not Met"}
													</Badge>
												</div>
												<div className="flex justify-between text-sm">
													<span>Aerobic Goal:</span>
													<Badge
														variant={
															Number.parseInt(
																physicalActivity.aerobicActivity
															) >= 3
																? "default"
																: "destructive"
														}>
														{Number.parseInt(
															physicalActivity.aerobicActivity
														) >= 3
															? "Met"
															: "Not Met"}
													</Badge>
												</div>
												<div className="flex justify-between text-sm">
													<span>Strength Goal:</span>
													<Badge
														variant={
															Number.parseInt(
																physicalActivity.strengthTraining
															) >= 2
																? "default"
																: "destructive"
														}>
														{Number.parseInt(
															physicalActivity.strengthTraining
														) >= 2
															? "Met"
															: "Not Met"}
													</Badge>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Habits Assessment */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Heart className="mr-2 h-6 w-6 text-red-500" />
									Habits Assessment
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="flex items-center space-x-4 p-4 border rounded-lg">
										<Cigarette className="h-8 w-8 text-gray-400" />
										<div>
											<h4 className="font-semibold">
												Smoking Status
											</h4>
											<p className="text-green-600 font-medium">
												{habits.smoking}
											</p>
											<p className="text-sm text-gray-500">
												Never smoked tobacco
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-4 p-4 border rounded-lg">
										<Wine className="h-8 w-8 text-gray-400" />
										<div>
											<h4 className="font-semibold">
												Alcohol Consumption
											</h4>
											<p className="text-yellow-600 font-medium">
												{habits.alcohol}
											</p>
											<p className="text-sm text-gray-500">
												Social drinking only
											</p>
										</div>
									</div>

									<div className="flex items-center space-x-4 p-4 border rounded-lg">
										<AlertTriangle className="h-8 w-8 text-gray-400" />
										<div>
											<h4 className="font-semibold">
												Substance Abuse
											</h4>
											<p className="text-green-600 font-medium">
												{habits.substanceAbuse}
											</p>
											<p className="text-sm text-gray-500">
												No substance abuse reported
											</p>
										</div>
									</div>
								</div>

								{isEditing && (
									<div className="mt-6 p-4 bg-gray-50 rounded-lg">
										<h4 className="font-semibold mb-3">
											Update Habits Information:
										</h4>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div>
												<Label>Smoking Status:</Label>
												<select
													aria-label="Smoking Status"
													className="w-full mt-1 p-2 border rounded"
													value={habits.smoking}
													onChange={(e) =>
														setHabits((prev) => ({
															...prev,
															smoking:
																e.target.value,
														}))
													}>
													<option value="never">
														Never
													</option>
													<option value="former">
														Former smoker
													</option>
													<option value="current">
														Current smoker
													</option>
												</select>
											</div>
											<div>
												<Label>Alcohol Use:</Label>
												<select
													aria-label="Alcohol Use"
													className="w-full mt-1 p-2 border rounded"
													value={habits.alcohol}
													onChange={(e) =>
														setHabits((prev) => ({
															...prev,
															alcohol:
																e.target.value,
														}))
													}>
													<option value="none">
														None
													</option>
													<option value="occasional">
														Occasional
													</option>

													<option value="regular">
														Regular
													</option>
													<option value="heavy">
														Heavy
													</option>
												</select>
											</div>
											<div>
												<Label>Substance Abuse:</Label>
												<select
													aria-label="Substance Abuse"
													className="w-full mt-1 p-2 border rounded"
													value={
														habits.substanceAbuse
													}
													onChange={(e) =>
														setHabits((prev) => ({
															...prev,
															substanceAbuse:
																e.target.value,
														}))
													}>
													<option value="none">
														None
													</option>
													<option value="marijuana">
														Marijuana
													</option>
													<option value="opioids">
														Opioids
													</option>
													<option value="other">
														Other
													</option>
												</select>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Stress Management */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Brain className="mr-2 h-6 w-6 text-purple-500" />
									Stress Management
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="font-medium">
													Current Stress Level:
												</span>
												<div className="flex items-center space-x-2">
													<span className="font-semibold text-lg">
														{stressManagement.level}
														/10
													</span>
													<Badge
														variant={
															Number.parseInt(
																stressManagement.level
															) <= 4
																? "default"
																: "destructive"
														}>
														{Number.parseInt(
															stressManagement.level
														) <= 4
															? "Well Managed"
															: "High Stress"}
													</Badge>
												</div>
											</div>

											<div>
												<Progress
													value={
														Number.parseInt(
															stressManagement.level
														) * 10
													}
													className="h-3"
												/>
											</div>

											<div>
												<h4 className="font-semibold mb-2">
													Stress Management
													Techniques:
												</h4>
												<div className="flex flex-wrap gap-2">
													{stressManagement.techniques.map(
														(technique, index) => (
															<Badge
																key={index}
																variant="outline"
																className="capitalize">
																{technique.replace(
																	"-",
																	" "
																)}
															</Badge>
														)
													)}
												</div>
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-semibold mb-3">
											Stress Assessment Notes:
										</h4>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm">
												{stressManagement.notes}
											</p>
										</div>

										{isEditing && (
											<div className="mt-4 space-y-3">
												<div>
													<Label>
														Stress Level (1-10):
													</Label>
													<Input
														type="number"
														min="1"
														max="10"
														value={
															stressManagement.level
														}
														onChange={(e) =>
															setStressManagement(
																(prev) => ({
																	...prev,
																	level: e
																		.target
																		.value,
																})
															)
														}
														className="w-20 mt-1"
													/>
												</div>
												<div>
													<Label>Update Notes:</Label>
													<Textarea
														value={
															stressManagement.notes
														}
														onChange={(e) =>
															setStressManagement(
																(prev) => ({
																	...prev,
																	notes: e
																		.target
																		.value,
																})
															)
														}
														className="mt-1"
														rows={3}
													/>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
					{/* Personal Notes Section */}
					{isEditing && (
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Personal Notes & Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Textarea
									placeholder="Add personal notes, specific recommendations, or patient-specific lifestyle modifications..."
									value={personalNotes}
									onChange={(e) =>
										setPersonalNotes(e.target.value)
									}
									rows={4}
									className="w-full"
								/>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="adherence">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-3xl font-bold text-navy-600">
							Adherence Overview
						</h1>
					</div>
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Adherence Monitoring
							</CardTitle>
						</CardHeader>
						<CardContent>{renderAdherenceChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="goals">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-3xl font-bold text-navy-600">
							Goals Overview
						</h1>
					</div>
					<div className="space-y-6">
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Target Goals Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{targetGoals.map((goal, index) => (
										<div
											key={index}
											className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg">
											<div className="flex-1 w-full">
												<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
													<span className="font-medium text-sm sm:text-base">
														{goal.metric}
													</span>
													<div className="flex items-center space-x-2">
														<Badge
															variant={
																goal.priority ===
																"high"
																	? "destructive"
																	: goal.priority ===
																	  "medium"
																	? "secondary"
																	: "default"
															}>
															{goal.priority.toUpperCase()}
														</Badge>
														<span
															className={
																goal.achieved
																	? "text-green-600"
																	: "text-red-600"
															}>
															{goal.achieved
																? "Achieved"
																: "Not Achieved"}
														</span>
													</div>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													Target: {goal.target}
													{goal.unit} | Current:{" "}
													{goal.current}
													{goal.unit}
												</div>
												<div className="flex items-center space-x-4">
													<Progress
														value={goal.percentage}
														className="h-2 flex-1"
													/>
													<span className="text-lg font-semibold">
														{goal.percentage}%
													</span>
												</div>
												<div className="text-xs text-gray-500 mt-1">
													Last updated:{" "}
													{goal.lastUpdated}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Goal Achievement Trends
								</CardTitle>
							</CardHeader>
							<CardContent>{renderGoalsChart()}</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
