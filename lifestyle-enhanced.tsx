"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Progress } from "@/components/ui/progress";
import {
	Activity,
	Apple,
	Cigarette,
	Wine,
	Moon,
	Heart,
	BarChart3,
	Table,
} from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
	ReferenceArea,
	BarChart,
	Bar,
	Cell,
} from "recharts";

export default function LifestyleEnhanced() {
	const [viewMode, setViewMode] = useState({
		weight: "chart",
		exercise: "chart",
		diet: "chart",
		sleep: "chart",
		stress: "chart",
	});

	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};

	// Weight management data with BMI zones
	const weightData = [
		{ date: "2024-01", weight: 70, bmi: 27.8 },
		{ date: "2024-02", weight: 69.5, bmi: 27.6 },
		{ date: "2024-03", weight: 69, bmi: 27.4 },
		{ date: "2024-04", weight: 68.8, bmi: 27.3 },
		{ date: "2024-05", weight: 68.5, bmi: 27.2 },
		{ date: "2024-06", weight: 68.2, bmi: 27.1 },
		{ date: "2024-07", weight: 68, bmi: 27.0 },
	];

	// Exercise data with target zones
	const exerciseData = [
		{ date: "2024-01", minutes: 120, target: 150 },
		{ date: "2024-02", minutes: 135, target: 150 },
		{ date: "2024-03", minutes: 140, target: 150 },
		{ date: "2024-04", minutes: 155, target: 150 },
		{ date: "2024-05", minutes: 145, target: 150 },
		{ date: "2024-06", minutes: 160, target: 150 },
		{ date: "2024-07", minutes: 150, target: 150 },
	];

	// Diet quality score data
	const dietData = [
		{ date: "2024-01", score: 65, target: 80 },
		{ date: "2024-02", score: 70, target: 80 },
		{ date: "2024-03", score: 72, target: 80 },
		{ date: "2024-04", score: 75, target: 80 },
		{ date: "2024-05", score: 73, target: 80 },
		{ date: "2024-06", score: 78, target: 80 },
		{ date: "2024-07", score: 76, target: 80 },
	];

	// Sleep quality data
	const sleepData = [
		{ date: "2024-01", hours: 6.5, quality: 6 },
		{ date: "2024-02", hours: 7, quality: 7 },
		{ date: "2024-03", hours: 6.8, quality: 6.5 },
		{ date: "2024-04", hours: 7.2, quality: 7.5 },
		{ date: "2024-05", hours: 6.9, quality: 7 },
		{ date: "2024-06", hours: 7.1, quality: 7.2 },
		{ date: "2024-07", hours: 7, quality: 7 },
	];

	// Stress level data
	const stressData = [
		{ date: "2024-01", level: 6, target: 4 },
		{ date: "2024-02", level: 5, target: 4 },
		{ date: "2024-03", level: 4, target: 4 },
		{ date: "2024-04", level: 5, target: 4 },
		{ date: "2024-05", level: 4, target: 4 },
		{ date: "2024-06", level: 4, target: 4 },
		{ date: "2024-07", level: 3, target: 4 },
	];

	const renderWeightChart = () => {
		const isChart = viewMode.weight === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Weight & BMI Trends
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("weight")}
						aria-label="Toggle weight view">
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
							className="sm:h-[300px]">
							<LineChart data={weightData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis
									yAxisId="weight"
									orientation="left"
									domain={[65, 75]}
								/>
								<YAxis
									yAxisId="bmi"
									orientation="right"
									domain={[25, 30]}
								/>
								<Tooltip
									formatter={(value, name) => [
										`${value}${
											name === "weight" ? " kg" : ""
										}`,
										name === "weight" ? "Weight" : "BMI",
									]}
									labelFormatter={(label) => `Date: ${label}`}
								/>

								{/* BMI Threshold Zones */}
								<ReferenceArea
									yAxisId="bmi"
									y1={18.5}
									y2={24.9}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									yAxisId="bmi"
									y1={25}
									y2={29.9}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									yAxisId="bmi"
									y1={30}
									y2={35}
									fill="#ef4444"
									fillOpacity={0.1}
								/>

								<ReferenceLine
									yAxisId="bmi"
									y={25}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Overweight: BMI ≥25",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									yAxisId="bmi"
									y={30}
									stroke="#ef4444"
									strokeDasharray="5 5"
									label={{
										value: "Obese: BMI ≥30",
										position: "insideTopRight",
									}}
								/>

								<Line
									yAxisId="weight"
									type="monotone"
									dataKey="weight"
									stroke="#8884d8"
									strokeWidth={3}
									name="Weight"
								/>
								<Line
									yAxisId="bmi"
									type="monotone"
									dataKey="bmi"
									stroke="#82ca9d"
									strokeWidth={3}
									name="BMI"
									dot={(props) => {
										const { cx, cy, payload, index } =
											props;
										const color =
											payload.bmi < 25
												? "#22c55e"
												: payload.bmi < 30
												? "#eab308"
												: "#ef4444";
										return (
											<circle
												key={`dot-${index}`}
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
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
								<span>Normal BMI (18.5-24.9)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded"></div>
								<span>Overweight (25-29.9)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded"></div>
								<span>Obese (≥30)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left">Date</th>
									<th className="p-2 sm:p-3 text-left">
										Weight (kg)
									</th>
									<th className="p-2 sm:p-3 text-left">BMI</th>
									<th className="p-2 sm:p-3 text-left">
										BMI Category
									</th>
									<th className="p-2 sm:p-3 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								{weightData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-2 sm:p-3">{item.date}</td>
										<td className="p-3 font-semibold">
											{item.weight} kg
										</td>
										<td className="p-3 font-semibold">
											<span
												style={{
													color:
														item.bmi < 25
															? "#22c55e"
															: item.bmi < 30
															? "#eab308"
															: "#ef4444",
												}}>
												{item.bmi}
											</span>
										</td>
										<td className="p-3 text-gray-600">
											Normal: 18.5-24.9 | Overweight:
											25-29.9 | Obese: ≥30
										</td>
										<td className="p-2 sm:p-3">
											<Badge
												variant={
													item.bmi < 25
														? "default"
														: item.bmi < 30
														? "secondary"
														: "destructive"
												}>
												{item.bmi < 25
													? "Normal"
													: item.bmi < 30
													? "Overweight"
													: "Obese"}
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

	const renderExerciseChart = () => {
		const isChart = viewMode.exercise === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Exercise Activity (Weekly Minutes)
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("exercise")}
						aria-label="Toggle exercise view">
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
							className="sm:h-[300px]">
							<BarChart data={exerciseData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[0, 200]} />
								<Tooltip
									formatter={(value, name) => [
										`${value} min/week`,
										name === "minutes"
											? "Exercise"
											: "Target",
									]}
									labelFormatter={(label) => `Date: ${label}`}
								/>

								{/* Exercise Target Zones */}
								<ReferenceArea
									y1={150}
									y2={200}
									fill="#22c55e"
									fillOpacity={0.2}
								/>
								<ReferenceArea
									y1={100}
									y2={150}
									fill="#eab308"
									fillOpacity={0.2}
								/>
								<ReferenceArea
									y1={0}
									y2={100}
									fill="#ef4444"
									fillOpacity={0.2}
								/>

								<ReferenceLine
									y={150}
									stroke="#22c55e"
									strokeDasharray="5 5"
									label={{
										value: "Target: ≥150 min/week",
										position: "centerTop",
										fontWeight: "bold",
									}}

									// fillOpacity={0.1}
								/>
								<ReferenceLine
									y={100}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Minimum: 100 min/week",
										position: "centerBottom",
										fontWeight: "bold",
									}}
								/>

								<Bar dataKey="minutes">
									{exerciseData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												entry.minutes >= 150
													? "#22c55e"
													: entry.minutes >= 100
													? "#eab308"
													: "#ef4444"
											}
											fillOpacity={0.8}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
								<span>Excellent (≥150 min/week)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded"></div>
								<span>Moderate (100-149 min/week)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded"></div>
								<span>Insufficient (&lt;100 min/week)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left">Date</th>
									<th className="p-2 sm:p-3 text-left">
										Exercise (min/week)
									</th>
									<th className="p-2 sm:p-3 text-left">
										Target Range
									</th>
									<th className="p-2 sm:p-3 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								{exerciseData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-2 sm:p-3">{item.date}</td>
										<td className="p-3 font-semibold">
											<span
												style={{
													color:
														item.minutes >= 150
															? "#22c55e"
															: item.minutes >=
															  100
															? "#eab308"
															: "#ef4444",
												}}>
												{item.minutes} min
											</span>
										</td>
										<td className="p-3 text-gray-600">
											Excellent: ≥150 | Moderate: 100-149
											| Insufficient: &lt;100
										</td>
										<td className="p-2 sm:p-3">
											<Badge
												variant={
													item.minutes >= 150
														? "default"
														: item.minutes >= 100
														? "secondary"
														: "destructive"
												}>
												{item.minutes >= 150
													? "Excellent"
													: item.minutes >= 100
													? "Moderate"
													: "Insufficient"}
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

	const renderDietChart = () => {
		const isChart = viewMode.diet === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Diet Quality Score
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("diet")}
						aria-label="Toggle diet view">
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
							className="sm:h-[300px]">
							<LineChart data={dietData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[50, 100]} />
								<Tooltip
									formatter={(value, name) => [
										`${value}/100`,
										name === "score"
											? "Diet Score"
											: "Target",
									]}
									labelFormatter={(label) => `Date: ${label}`}
								/>

								{/* Diet Quality Zones */}
								<ReferenceArea
									y1={80}
									y2={100}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={65}
									y2={80}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={50}
									y2={65}
									fill="#ef4444"
									fillOpacity={0.1}
								/>

								<ReferenceLine
									y={80}
									stroke="#22c55e"
									strokeDasharray="5 5"
									label={{
										value: "Excellent: ≥80",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									y={65}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Good: ≥65",
										position: "insideBottomRight",
									}}
								/>

								<Line
									type="monotone"
									dataKey="score"
									stroke="#8884d8"
									strokeWidth={3}
									dot={(props) => {
										const { cx, cy, payload, index } =
											props;
										const color =
											payload.score >= 80
												? "#22c55e"
												: payload.score >= 65
												? "#eab308"
												: "#ef4444";
										return (
											<circle
												key={`dot-${index}`}
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
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
								<span>Excellent (≥80)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded"></div>
								<span>Good (65-79)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded"></div>
								<span>Needs Improvement (&lt;65)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left">Date</th>
									<th className="p-2 sm:p-3 text-left">
										Diet Score
									</th>
									<th className="p-2 sm:p-3 text-left">
										Quality Range
									</th>
									<th className="p-2 sm:p-3 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								{dietData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-2 sm:p-3">{item.date}</td>
										<td className="p-3 font-semibold">
											<span
												style={{
													color:
														item.score >= 80
															? "#22c55e"
															: item.score >= 65
															? "#eab308"
															: "#ef4444",
												}}>
												{item.score}/100
											</span>
										</td>
										<td className="p-3 text-gray-600">
											Excellent: ≥80 | Good: 65-79 | Needs
											Improvement: &lt;65
										</td>
										<td className="p-2 sm:p-3">
											<Badge
												variant={
													item.score >= 80
														? "default"
														: item.score >= 65
														? "secondary"
														: "destructive"
												}>
												{item.score >= 80
													? "Excellent"
													: item.score >= 65
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

	return (
		<div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-2xl sm:text-3xl font-bold text-navy-600 mb-4 sm:mb-6">
				Lifestyle Factors
			</h1>

			<Tabs
				defaultValue="overview"
				className="w-full space-y-2 sm:space-y-0">
				<TabsList className="mb-4 w-full flex-wrap h-auto gap-1 p-1">
					<TabsTrigger value="overview" className="flex-1 text-xs sm:text-sm">Overview</TabsTrigger>
					<TabsTrigger value="weight" className="flex-1 text-xs sm:text-sm">Weight</TabsTrigger>
					<TabsTrigger value="exercise" className="flex-1 text-xs sm:text-sm">
						Exercise
					</TabsTrigger>
					<TabsTrigger value="diet" className="flex-1 text-xs sm:text-sm">Diet</TabsTrigger>
					<TabsTrigger value="habits" className="flex-1 text-xs sm:text-sm">Habits</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Activity className="mr-2 h-5 w-5 text-blue-500" />
									Weight Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									68 kg
								</div>
								<div className="text-sm text-gray-600 mb-2">
									BMI: 27.0 (Overweight)
								</div>
								<Progress
									value={75}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-gray-500">
									Target: 65 kg (BMI 25)
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Heart className="mr-2 h-5 w-5 text-red-500" />
									Exercise
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									150 min
								</div>
								<div className="text-sm text-gray-600 mb-2">
									Weekly activity
								</div>
								<Progress
									value={100}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-green-600">
									Target achieved!
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Apple className="mr-2 h-5 w-5 text-green-500" />
									Diet Quality
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									76/100
								</div>
								<div className="text-sm text-gray-600 mb-2">
									Diet score
								</div>
								<Progress
									value={76}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-yellow-600">
									Good, can improve
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center">
									<Moon className="mr-2 h-5 w-5 text-purple-500" />
									Sleep Quality
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold mb-2">
									7.0 hrs
								</div>
								<div className="text-sm text-gray-600 mb-2">
									Average sleep
								</div>
								<Progress
									value={87}
									className="h-2 mb-2"
								/>
								<div className="text-xs text-green-600">
									Good quality
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="weight">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Weight Management Tracking
							</CardTitle>
						</CardHeader>
						<CardContent>{renderWeightChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="exercise">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Exercise Activity Monitoring
							</CardTitle>
						</CardHeader>
						<CardContent>{renderExerciseChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="diet">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Diet Quality Assessment
							</CardTitle>
						</CardHeader>
						<CardContent>{renderDietChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="habits">
					<div className="space-y-6">
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Sleep Patterns
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold mb-3">
											Current Sleep Status
										</h4>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span>
													Average Sleep Duration:
												</span>
												<span className="font-semibold">
													7.0 hours
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span>
													Sleep Quality Score:
												</span>
												<span className="font-semibold">
													7.0/10
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span>Sleep Efficiency:</span>
												<span className="font-semibold">
													87%
												</span>
											</div>
										</div>
									</div>
									<div>
										<h4 className="font-semibold mb-3">
											Sleep Issues
										</h4>
										<div className="space-y-2">
											<Badge variant="outline">
												Occasional use of Alprazolam
											</Badge>
											<Badge variant="outline">
												Occasional use of Zolpidem
											</Badge>
											<Badge variant="outline">
												Disturbed sleep patterns
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Substance Use
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="flex items-center space-x-4 p-4 border rounded-lg">
										<Cigarette className="h-8 w-8 text-gray-400" />
										<div>
											<h4 className="font-semibold">
												Smoking Status
											</h4>
											<p className="text-green-600">
												Non-smoker
											</p>
											<p className="text-sm text-gray-500">
												Never smoked
											</p>
										</div>
									</div>
									<div className="flex items-center space-x-4 p-4 border rounded-lg">
										<Wine className="h-8 w-8 text-gray-400" />
										<div>
											<h4 className="font-semibold">
												Alcohol Consumption
											</h4>
											<p className="text-green-600">
												Occasional
											</p>
											<p className="text-sm text-gray-500">
												Social drinking only
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Stress Management
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<span>Current Stress Level:</span>
										<div className="flex items-center space-x-2">
											<span className="font-semibold">
												3/10
											</span>
											<Badge variant="default">Low</Badge>
										</div>
									</div>
									<div>
										<h4 className="font-semibold mb-2">
											Stress Management Techniques
										</h4>
										<div className="flex flex-wrap gap-2">
											<Badge variant="outline">
												Regular walking
											</Badge>
											<Badge variant="outline">
												Reading
											</Badge>
											<Badge variant="outline">
												Family time
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
