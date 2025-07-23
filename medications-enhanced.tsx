"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import {
	Edit,
	Trash2,
	Calendar,
	Clock,
	AlertTriangle,
	CheckCircle,
	BarChart3,
	Table,
	Plus,
	Play,
	Pause,
	Save,
	Activity,
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
} from "recharts";

export default function MedicationsEnhanced() {
	const [viewMode, setViewMode] = useState({
		adherence: "chart",
		effectiveness: "chart",
		sideEffects: "chart",
	});

	const [selectedMedication, setSelectedMedication] = useState("");
	const [newMedication, setNewMedication] = useState({
		name: "",
		dosage: "",
		frequency: "",
		duration: "",
		indication: "",
	});

	const [editingMedication, setEditingMedication] =
		useState<Medication | null>(null);
	const [medications, setMedications] = useState([]);
	const [showAddForm, setShowAddForm] = useState(false);
	const [managementMedications, setManagementMedications] = useState<any>([]);

	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};

	// Medication adherence data with threshold zones
	const adherenceData = [
		{ date: "2024-01", adherence: 85, target: 90 },
		{ date: "2024-02", adherence: 92, target: 90 },
		{ date: "2024-03", adherence: 88, target: 90 },
		{ date: "2024-04", adherence: 95, target: 90 },
		{ date: "2024-05", adherence: 87, target: 90 },
		{ date: "2024-06", adherence: 93, target: 90 },
		{ date: "2024-07", adherence: 91, target: 90 },
	];

	// Medication effectiveness data (HbA1c response)
	const effectivenessData = [
		{ date: "2024-01", hba1c: 8.3, bpSystolic: 135, bpDiastolic: 85 },
		{ date: "2024-02", hba1c: 8.2, bpSystolic: 132, bpDiastolic: 84 },
		{ date: "2024-03", hba1c: 8.1, bpSystolic: 130, bpDiastolic: 82 },
		{ date: "2024-04", hba1c: 8.2, bpSystolic: 128, bpDiastolic: 80 },
		{ date: "2024-05", hba1c: 8.1, bpSystolic: 130, bpDiastolic: 84 },
		{ date: "2024-06", hba1c: 8.2, bpSystolic: 132, bpDiastolic: 86 },
		{ date: "2024-07", hba1c: 8.2, bpSystolic: 130, bpDiastolic: 84 },
	];

	// Medication timeline data for Gantt chart
	const medicationTimeline = [
		{
			id: 1,
			name: "Novomix Penfill",
			type: "Insulin",
			periods: [
				{
					startDate: "2020-01-15",
					endDate: "2021-06-30",
					status: "active",
					reason: "Initial therapy",
				},
				{
					startDate: "2021-07-01",
					endDate: "2021-12-31",
					status: "stopped",
					reason: "Side effects",
				},
				{
					startDate: "2022-01-01",
					endDate: null,
					status: "active",
					reason: "Resumed with dose adjustment",
				},
			],
			currentDosage: "20-22 units morning, 16-18 units evening",
		},
		{
			id: 2,
			name: "Metformin + Glimepiride",
			type: "Oral Antidiabetic",
			periods: [
				{
					startDate: "2018-03-10",
					endDate: null,
					status: "active",
					reason: "Continuous therapy",
				},
			],
			currentDosage: "500mg/2mg twice daily",
		},
		{
			id: 3,
			name: "Sitagliptin + Dapagliflozin",
			type: "Oral Antidiabetic",
			periods: [
				{
					startDate: "2024-01-10",
					endDate: null,
					status: "active",
					reason: "Added for better control",
				},
			],
			currentDosage: "100mg/10mg once daily",
		},
		{
			id: 4,
			name: "Losartan + Amlodipine",
			type: "Antihypertensive",
			periods: [
				{
					startDate: "2019-06-20",
					endDate: "2020-03-15",
					status: "active",
					reason: "Initial therapy",
				},
				{
					startDate: "2020-03-16",
					endDate: "2020-08-30",
					status: "stopped",
					reason: "Dose optimization",
				},
				{
					startDate: "2020-09-01",
					endDate: null,
					status: "active",
					reason: "Resumed with lower dose",
				},
			],
			currentDosage: "50mg/5mg once daily",
		},
		{
			id: 5,
			name: "Aspirin + Atorvastatin",
			type: "Cardioprotective",
			periods: [
				{
					startDate: "2019-06-20",
					endDate: null,
					status: "active",
					reason: "Cardioprotection",
				},
			],
			currentDosage: "75mg/10mg once daily",
		},
		{
			id: 6,
			name: "Apremilast",
			type: "Immunomodulator",
			periods: [
				{
					startDate: "2023-01-15",
					endDate: "2024-01-15",
					status: "discontinued",
					reason: "Ineffective",
				},
			],
			currentDosage: "10mg once daily (discontinued)",
		},
	];

	const currentMedications = [
		{
			id: 1,
			name: "Novomix Penfill",
			type: "Insulin",
			dosage: "20-22 units morning, 16-18 units evening",
			frequency: "Twice daily",
			timing: "10 minutes before meals",
			indication: "Diabetes control",
			startDate: "2020-01-15",
			status: "Active",
			adherence: 91,
			effectiveness: "Good",
			sideEffects: "None reported",
			cost: "₹1,200/month",
			nextReview: "2024-08-15",
		},
		{
			id: 2,
			name: "Metformin + Glimepiride",
			type: "Oral Antidiabetic",
			dosage: "500mg/2mg",
			frequency: "Twice daily",
			timing: "With meals",
			indication: "Diabetes control",
			startDate: "2018-03-10",
			status: "Active",
			adherence: 95,
			effectiveness: "Good",
			sideEffects: "Mild GI upset occasionally",
			cost: "₹150/month",
			nextReview: "2024-08-15",
		},
		{
			id: 3,
			name: "Sitagliptin + Dapagliflozin",
			type: "Oral Antidiabetic",
			dosage: "100mg/10mg",
			frequency: "Once daily",
			timing: "Morning",
			indication: "Diabetes control",
			startDate: "2024-01-10",
			status: "Active",
			adherence: 88,
			effectiveness: "Moderate",
			sideEffects: "None reported",
			cost: "₹800/month",
			nextReview: "2024-08-15",
		},
		{
			id: 4,
			name: "Losartan + Amlodipine",
			type: "Antihypertensive",
			dosage: "50mg/5mg",
			frequency: "Once daily",
			timing: "Evening",
			indication: "Hypertension",
			startDate: "2019-06-20",
			status: "Active",
			adherence: 93,
			effectiveness: "Good",
			sideEffects: "Mild ankle swelling",
			cost: "₹200/month",
			nextReview: "2024-08-15",
		},
		{
			id: 5,
			name: "Aspirin + Atorvastatin",
			type: "Cardioprotective",
			dosage: "75mg/10mg",
			frequency: "Once daily",
			timing: "After dinner",
			indication: "Cardiovascular protection",
			startDate: "2019-06-20",
			status: "Active",
			adherence: 89,
			effectiveness: "Good",
			sideEffects: "None reported",
			cost: "₹180/month",
			nextReview: "2024-08-15",
		},
		{
			id: 6,
			name: "Apremilast",
			type: "Immunomodulator",
			dosage: "10mg",
			frequency: "Once daily",
			timing: "Evening",
			indication: "Granuloma annulare",
			startDate: "2023-01-15",
			status: "Discontinued",
			adherence: 75,
			effectiveness: "Poor",
			sideEffects: "GI upset, no improvement",
			cost: "₹2,500/month",
			nextReview: "Discontinued 2024-01-15",
		},
	];

	// Initialize management medications after currentMedications is defined
	useEffect(() => {
		if (managementMedications.length === 0) {
			setManagementMedications(
				currentMedications.map((med) => ({
					...med,
					remarks: "",
					prescribedBy: "Dr. Smith",
					lastModified: "2024-07-15",
				}))
			);
		}
	}, []);

	const renderAdherenceChart = () => {
		const isChart = viewMode.adherence === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Medication Adherence Trends
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
							className="sm:h-[300px]">
							<LineChart data={adherenceData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[70, 100]} />
								<Tooltip
									formatter={(value, name) => [
										`${value}%`,
										name === "adherence"
											? "Adherence"
											: "Target",
									]}
									labelFormatter={(label) => `Date: ${label}`}
								/>

								{/* Adherence Threshold Zones */}
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
										value: "Target: ≥90%",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									y={80}
									stroke="#eab308"
									strokeDasharray="5 5"
									label={{
										value: "Caution: <80%",
										position: "insideBottomRight",
									}}
								/>

								<Line
									type="monotone"
									dataKey="adherence"
									stroke="#8884d8"
									strokeWidth={3}
									dot={(props) => {
										const { cx, cy, payload } = props;
										const color =
											payload.adherence >= 90
												? "#22c55e"
												: payload.adherence >= 80
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
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
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
								<span>Poor (&lt;80%)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left">
										Date
									</th>
									<th className="p-2 sm:p-3 text-left">
										Adherence (%)
									</th>
									<th className="p-2 sm:p-3 text-left hidden sm:table-cell">
										Target Range
									</th>
									<th className="p-2 sm:p-3 text-left">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{adherenceData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-2 sm:p-3">
											{item.date}
										</td>
										<td className="p-2 sm:p-3 font-semibold">
											<span
												style={{
													color:
														item.adherence >= 90
															? "#22c55e"
															: item.adherence >=
															  80
															? "#eab308"
															: "#ef4444",
												}}>
												{item.adherence}%
											</span>
										</td>
										<td className="p-2 sm:p-3 text-gray-600 hidden sm:table-cell text-xs">
											Excellent: ≥90% | Good: 80-89% |
											Poor: &lt;80%
										</td>
										<td className="p-2 sm:p-3">
											<Badge
												variant={
													item.adherence >= 90
														? "default"
														: item.adherence >= 80
														? "secondary"
														: "destructive"
												}
												className="text-xs">
												{item.adherence >= 90
													? "Excellent"
													: item.adherence >= 80
													? "Good"
													: "Poor"}
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

	const renderEffectivenessChart = () => {
		const isChart = viewMode.effectiveness === "chart";

		return (
			<div>
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">
						Medication Effectiveness (HbA1c Response)
					</h3>
					<Toggle
						pressed={!isChart}
						onPressedChange={() => toggleViewMode("effectiveness")}
						aria-label="Toggle effectiveness view">
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
							<LineChart data={effectivenessData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[6.5, 9]} />
								<Tooltip
									formatter={(value, name) => [
										`${value}%`,
										"HbA1c",
									]}
									labelFormatter={(label) => `Date: ${label}`}
								/>

								{/* HbA1c Threshold Zones */}
								<ReferenceArea
									y1={6.5}
									y2={7.5}
									fill="#22c55e"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={7.5}
									y2={8.5}
									fill="#eab308"
									fillOpacity={0.1}
								/>
								<ReferenceArea
									y1={8.5}
									y2={9}
									fill="#ef4444"
									fillOpacity={0.1}
								/>

								<ReferenceLine
									y={7.5}
									stroke="#22c55e"
									strokeDasharray="5 5"
									label={{
										value: "Target: ≤7.5%",
										position: "insideTopRight",
									}}
								/>
								<ReferenceLine
									y={8.5}
									stroke="#ef4444"
									strokeDasharray="5 5"
									label={{
										value: "High Risk: >8.5%",
										position: "insideTopRight",
									}}
								/>

								<Line
									type="monotone"
									dataKey="hba1c"
									stroke="#8884d8"
									strokeWidth={3}
									dot={(props) => {
										const { cx, cy, payload } = props;
										const color =
											payload.hba1c <= 7.5
												? "#22c55e"
												: payload.hba1c <= 8.5
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
							</LineChart>
						</ResponsiveContainer>
						<div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 rounded"></div>
								<span>Optimal (≤7.5%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 rounded"></div>
								<span>Caution (7.5-8.5%)</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-200 rounded"></div>
								<span>High Risk (&gt;8.5%)</span>
							</div>
						</div>
					</>
				) : (
					<div className="border rounded-lg overflow-x-auto">
						<table className="w-full text-xs sm:text-sm min-w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 sm:p-3 text-left">
										Date
									</th>
									<th className="p-2 sm:p-3 text-left">
										HbA1c (%)
									</th>
									<th className="p-2 sm:p-3 text-left hidden sm:table-cell">
										Target Zone
									</th>
									<th className="p-2 sm:p-3 text-left">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{effectivenessData.map((item, index) => (
									<tr
										key={index}
										className="border-t">
										<td className="p-2 sm:p-3">
											{item.date}
										</td>
										<td className="p-2 sm:p-3 font-semibold">
											<span
												style={{
													color:
														item.hba1c <= 7.5
															? "#22c55e"
															: item.hba1c <= 8.5
															? "#eab308"
															: "#ef4444",
												}}>
												{item.hba1c}%
											</span>
										</td>
										<td className="p-2 sm:p-3 text-gray-600 hidden sm:table-cell text-xs">
											Optimal: ≤7.5% | Caution: 7.5-8.5% |
											High Risk: &gt;8.5%
										</td>
										<td className="p-2 sm:p-3">
											<Badge
												variant={
													item.hba1c <= 7.5
														? "default"
														: item.hba1c <= 8.5
														? "secondary"
														: "destructive"
												}
												className="text-xs">
												{item.hba1c <= 7.5
													? "Excellent"
													: item.hba1c <= 8.5
													? "Moderate"
													: "Poor"}
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

	// Helper function to calculate position for Gantt chart
	interface GanttPosition {
		left: string;
		width: string;
	}

	interface MedicationPeriod {
		startDate: string;
		endDate: string | null;
		status: "active" | "stopped" | "discontinued";
		reason: string;
	}

	const calculateGanttPosition = (
		startDate: string,
		endDate: string | null = null
	): GanttPosition => {
		const start = new Date(startDate);
		const end = endDate ? new Date(endDate) : new Date();
		const chartStart = new Date("2018-01-01");
		const chartEnd = new Date("2024-12-31");

		const totalDuration = chartEnd.getTime() - chartStart.getTime();
		const startOffset =
			((start.getTime() - chartStart.getTime()) / totalDuration) * 100;
		const width = ((end.getTime() - start.getTime()) / totalDuration) * 100;

		return {
			left: `${Math.max(0, startOffset)}%`,
			width: `${Math.max(1, width)}%`,
		};
	};

	const renderGanttChart = () => {
		return (
			<div className="space-y-4">
				{/* Timeline header */}
				<div className="relative bg-gray-50 p-4 rounded-lg overflow-x-auto">
					<div className="flex justify-between text-xs text-gray-600 mb-2">
						<span>2018</span>
						<span>2019</span>
						<span>2020</span>
						<span>2021</span>
						<span>2022</span>
						<span>2023</span>
						<span>2024</span>
					</div>
					<div className="h-2 bg-gray-200 rounded relative">
						{/* Year markers */}
						{[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(
							(year, index) => (
								<div
									key={year}
									className="absolute top-0 bottom-0 w-px bg-gray-400"
									style={{ left: `${(index / 6) * 100}%` }}
								/>
							)
						)}
					</div>
				</div>

				{/* Medication timeline rows */}
				<div className="space-y-3">
					{medicationTimeline.map((medication) => (
						<div
							key={medication.id}
							className="border rounded-lg p-4 bg-white">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
								<div className="mb-2 sm:mb-0">
									<h4 className="font-semibold text-sm sm:text-base">
										{medication.name}
									</h4>
									<p className="text-xs text-gray-600">
										{medication.type}
									</p>
									<p className="text-xs text-gray-600">
										{medication.currentDosage}
									</p>
								</div>
								<Badge
									variant={
										medication.periods.some(
											(p) => p.status === "active"
										)
											? "default"
											: "secondary"
									}>
									{medication.periods.some(
										(p) => p.status === "active"
									)
										? "Active"
										: "Discontinued"}
								</Badge>
							</div>

							{/* Timeline bars */}
							<div className="relative h-8 bg-gray-100 rounded overflow-hidden">
								{medication.periods.map((period, index) => {
									const position = calculateGanttPosition(
										period.startDate,
										period.endDate
									);
									const colorClass =
										period.status === "active"
											? "bg-green-500"
											: period.status === "stopped"
											? "bg-red-500"
											: "bg-gray-400";

									return (
										<div
											key={index}
											className={`absolute top-1 bottom-1 ${colorClass} rounded-sm opacity-80 hover:opacity-100 transition-opacity`}
											style={position}
											title={`${period.status}: ${
												period.startDate
											} ${
												period.endDate
													? "- " + period.endDate
													: "- ongoing"
											}\nReason: ${period.reason}`}
										/>
									);
								})}
							</div>

							{/* Period details */}
							<div className="mt-2 space-y-1">
								{medication.periods.map((period, index) => (
									<div
										key={index}
										className="flex flex-wrap items-center text-xs text-gray-600 gap-2">
										<div
											className={`w-3 h-3 rounded-sm ${
												period.status === "active"
													? "bg-green-500"
													: period.status ===
													  "stopped"
													? "bg-red-500"
													: "bg-gray-400"
											}`}
										/>
										<span className="font-medium capitalize">
											{period.status}:
										</span>
										<span>{period.startDate}</span>
										{period.endDate && (
											<>
												<span>-</span>
												<span>{period.endDate}</span>
											</>
										)}
										{!period.endDate && (
											<span>- ongoing</span>
										)}
										<span className="text-gray-500">
											({period.reason})
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Legend */}
				<div className="flex flex-wrap gap-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-green-500 rounded-sm" />
						<span>Active</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-red-500 rounded-sm" />
						<span>Stopped</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-gray-400 rounded-sm" />
						<span>Discontinued</span>
					</div>
				</div>
			</div>
		);
	};

	interface Medication {
		id: number;
		status: "Active" | "Stopped";
		// Other properties of medication
	}

	const handleStatusChange = (
		id: number,
		newStatus: "Active" | "Stopped"
	) => {
		setManagementMedications((prev: Medication[]) =>
			prev.map((med: Medication) =>
				med.id === id
					? {
							...med,
							status: newStatus,
							lastModified: new Date()
								.toISOString()
								.split("T")[0],
					  }
					: med
			)
		);
	};

	interface Medication {
		id: number;
		status: "Active" | "Stopped";
		dosage: string;
		frequency: string;
		remarks?: string;
		// Other properties of medication
	}

	const handleEditMedication = (medication: Medication) => {
		setEditingMedication(medication);
	};

	interface UpdatedMedicationData {
		dosage?: string;
		frequency?: string;
		remarks?: string;
	}

	const handleSaveMedication = (
		id: number,
		updatedData: UpdatedMedicationData
	) => {
		setManagementMedications((prev: ManagementMedication[]) =>
			prev.map((med: ManagementMedication) =>
				med.id === id
					? {
							...med,
							...updatedData,
							lastModified: new Date()
								.toISOString()
								.split("T")[0],
					  }
					: med
			)
		);
		setEditingMedication(null);
	};

	interface NewMedication {
		name: string;
		dosage: string;
		frequency: string;
		duration: string;
		indication: string;
	}

	interface ManagementMedication extends Omit<Medication, "status"> {
		name: string;
		type: string;
		frequency: string;
		dosage: string;
		remarks: string;
		prescribedBy: string;
		lastModified: string;
		status: "Active" | "Stopped";
	}

	const handleAddMedication = (newMed: NewMedication) => {
		const newId =
			Math.max(
				...managementMedications.map((m: ManagementMedication) => m.id)
			) + 1;
		setManagementMedications((prev: ManagementMedication[]) => [
			...prev,
			{
				...newMed,
				id: newId,
				status: "Active",
				adherence: 100,
				effectiveness: "Good",
				sideEffects: "None reported",
				cost: "₹0/month",
				nextReview: "2024-12-31",
				prescribedBy: "Dr. Smith",
				lastModified: new Date().toISOString().split("T")[0],
				remarks: "",
			},
		]);
		setShowAddForm(false);
		setNewMedication({
			name: "",
			dosage: "",
			frequency: "",
			duration: "",
			indication: "",
		});
	};

	const renderManagementTable = () => {
		return (
			<div className="space-y-4">
				{/* Add new medication form */}
				{showAddForm && (
					<Card className="border-blue-200 bg-blue-50">
						<CardHeader>
							<CardTitle className="text-lg text-blue-800">
								Add New Medication
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="new-med-name">
										Medication Name
									</Label>
									<Input
										id="new-med-name"
										value={newMedication.name}
										onChange={(e) =>
											setNewMedication({
												...newMedication,
												name: e.target.value,
											})
										}
										placeholder="Enter medication name"
									/>
								</div>
								<div>
									<Label htmlFor="new-med-dosage">
										Dosage
									</Label>
									<Input
										id="new-med-dosage"
										value={newMedication.dosage}
										onChange={(e) =>
											setNewMedication({
												...newMedication,
												dosage: e.target.value,
											})
										}
										placeholder="e.g., 500mg"
									/>
								</div>
								<div>
									<Label htmlFor="new-med-frequency">
										Frequency
									</Label>
									<Select
										value={newMedication.frequency}
										onValueChange={(value) =>
											setNewMedication({
												...newMedication,
												frequency: value,
											})
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select frequency" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="once-daily">
												Once daily
											</SelectItem>
											<SelectItem value="twice-daily">
												Twice daily
											</SelectItem>
											<SelectItem value="three-times-daily">
												Three times daily
											</SelectItem>
											<SelectItem value="as-needed">
												As needed
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="new-med-indication">
										Indication
									</Label>
									<Input
										id="new-med-indication"
										value={newMedication.indication}
										onChange={(e) =>
											setNewMedication({
												...newMedication,
												indication: e.target.value,
											})
										}
										placeholder="Indication for medication"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-2 mt-4">
								<Button
									variant="outline"
									onClick={() => setShowAddForm(false)}>
									Cancel
								</Button>
								<Button
									onClick={() =>
										handleAddMedication(newMedication)
									}>
									<Save className="mr-2 h-4 w-4" />
									Add Medication
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Management table */}
				<div className="border rounded-lg overflow-x-auto">
					<table className="w-full text-xs sm:text-sm min-w-[800px]">
						<thead className="bg-gray-50">
							<tr>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Medication
								</th>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Dosage
								</th>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Frequency
								</th>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Status
								</th>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Remarks
								</th>
								<th className="p-2 sm:p-3 text-left font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{managementMedications.map(
								(medication: ManagementMedication) => (
									<tr
										key={medication.id}
										className="border-t hover:bg-gray-50">
										<td className="p-2 sm:p-3">
											<div>
												<div className="font-medium">
													{medication?.name}
												</div>
												<div className="text-xs text-gray-600">
													{medication.type}
												</div>
											</div>
										</td>
										<td className="p-2 sm:p-3">
											{editingMedication?.id ===
											medication.id ? (
												<Input
													defaultValue={
														medication.dosage
													}
													className="w-full text-xs"
													onBlur={(e) =>
														handleSaveMedication(
															medication.id,
															{
																dosage: e.target
																	.value,
															}
														)
													}
												/>
											) : (
												<span className="text-xs">
													{medication.dosage}
												</span>
											)}
										</td>
										<td className="p-2 sm:p-3">
											{editingMedication?.id ===
											medication.id ? (
												<Select
													defaultValue={
														medication.frequency
													}
													onValueChange={(value) =>
														handleSaveMedication(
															medication.id,
															{ frequency: value }
														)
													}>
													<SelectTrigger className="w-full text-xs">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="once-daily">
															Once daily
														</SelectItem>
														<SelectItem value="twice-daily">
															Twice daily
														</SelectItem>
														<SelectItem value="three-times-daily">
															Three times daily
														</SelectItem>
														<SelectItem value="as-needed">
															As needed
														</SelectItem>
													</SelectContent>
												</Select>
											) : (
												<span className="text-xs">
													{medication.frequency}
												</span>
											)}
										</td>
										<td className="p-2 sm:p-3">
											<div className="flex items-center space-x-2">
												<Badge
													variant={
														medication.status ===
														"Active"
															? "default"
															: "secondary"
													}
													className="text-xs">
													{medication.status}
												</Badge>
												<div className="flex space-x-1">
													{medication.status ===
													"Active" ? (
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handleStatusChange(
																	medication.id,
																	"Stopped"
																)
															}
															className="p-1 h-6 w-6"
															title="Stop medication">
															<Pause className="h-3 w-3" />
														</Button>
													) : (
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																handleStatusChange(
																	medication.id,
																	"Active"
																)
															}
															className="p-1 h-6 w-6"
															title="Start medication">
															<Play className="h-3 w-3" />
														</Button>
													)}
												</div>
											</div>
										</td>
										<td className="p-2 sm:p-3">
											{editingMedication?.id ===
											medication.id ? (
												<Textarea
													defaultValue={
														medication.remarks || ""
													}
													className="w-full text-xs h-16"
													onBlur={(e) =>
														handleSaveMedication(
															medication.id,
															{
																remarks:
																	e.target
																		.value,
															}
														)
													}
													placeholder="Add remarks..."
												/>
											) : (
												<span className="text-xs text-gray-600">
													{medication.remarks ||
														"No remarks"}
												</span>
											)}
										</td>
										<td className="p-2 sm:p-3">
											<div className="flex space-x-1">
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleEditMedication(
															medication
														)
													}
													className="p-1 h-6 w-6"
													title="Edit medication">
													<Edit className="h-3 w-3" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() => {
														if (
															confirm(
																"Are you sure you want to delete this medication?"
															)
														) {
															setManagementMedications(
																(
																	prev: ManagementMedication[]
																) =>
																	prev.filter(
																		(
																			m: ManagementMedication
																		) =>
																			m.id !==
																			medication.id
																	)
															);
														}
													}}
													className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
													title="Delete medication">
													<Trash2 className="h-3 w-3" />
												</Button>
											</div>
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>

				{/* Table summary */}
				<div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
					<p>
						Total medications: {managementMedications.length} |
						Active:{" "}
						{
							managementMedications.filter(
								(m: ManagementMedication) =>
									m.status === "Active"
							).length
						}{" "}
						| Stopped:{" "}
						{
							managementMedications.filter(
								(m: ManagementMedication) =>
									m.status === "Stopped"
							).length
						}
					</p>
				</div>
			</div>
		);
	};

	return (
		<div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-2xl sm:text-3xl font-bold text-navy-600 mb-4 sm:mb-6">
				Medication Management
			</h1>

			<Tabs
				defaultValue="current"
				className="w-full space-y-2 sm:space-y-0">
				<TabsList className="mb-4 w-full flex-wrap h-auto gap-1 p-1">
					<TabsTrigger
						value="current"
						className="flex-1 text-xs sm:text-sm">
						Current
					</TabsTrigger>
					<TabsTrigger
						value="timeline"
						className="flex-1 text-xs sm:text-sm">
						Timeline
					</TabsTrigger>
					<TabsTrigger
						value="table-management"
						className="flex-1 text-xs sm:text-sm">
						Management
					</TabsTrigger>
					<TabsTrigger
						value="adherence"
						className="flex-1 text-xs sm:text-sm">
						Adherence
					</TabsTrigger>
					<TabsTrigger
						value="effectiveness"
						className="flex-1 text-xs sm:text-sm">
						Effectiveness
					</TabsTrigger>
				</TabsList>

				<TabsContent value="current">
					<div className="space-y-6">
						{currentMedications.map((medication) => (
							<Card
								key={medication.id}
								className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-lg flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<span
												className={
													medication.status ===
													"Active"
														? "text-green-600"
														: "text-red-600"
												}>
												{medication.name}
											</span>
											<Badge
												variant={
													medication.status ===
													"Active"
														? "default"
														: "destructive"
												}>
												{medication.status}
											</Badge>
										</div>
										<div className="flex items-center space-x-2">
											<Button
												size="sm"
												variant="outline">
												<Edit className="h-4 w-4" />
											</Button>
											{medication.status === "Active" && (
												<Button
													size="sm"
													variant="outline">
													<Trash2 className="h-4 w-4" />
												</Button>
											)}
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
										<div className="lg:col-span-1">
											<h4 className="font-semibold mb-2 text-blue-600 text-sm sm:text-base">
												Prescription Details
											</h4>
											<div className="space-y-1 text-xs sm:text-sm">
												<p className="break-words">
													<strong>Type:</strong>{" "}
													{medication.type}
												</p>
												<p className="break-words">
													<strong>Dosage:</strong>{" "}
													{medication.dosage}
												</p>
												<p>
													<strong>Frequency:</strong>{" "}
													{medication.frequency}
												</p>
												<p>
													<strong>Timing:</strong>{" "}
													{medication.timing}
												</p>
												<p className="break-words">
													<strong>Indication:</strong>{" "}
													{medication.indication}
												</p>
												<p>
													<strong>Started:</strong>{" "}
													{medication.startDate}
												</p>
											</div>
										</div>
										<div className="lg:col-span-1">
											<h4 className="font-semibold mb-2 text-green-600 text-sm sm:text-base">
												Monitoring
											</h4>
											<div className="space-y-2">
												<div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-1 xs:space-y-0">
													<span className="text-xs sm:text-sm font-medium">
														Adherence:
													</span>
													<div className="flex items-center space-x-2">
														<div className="w-12 xs:w-16 bg-gray-200 rounded-full h-2">
															<div
																className={`h-2 rounded-full ${
																	medication.adherence >=
																	90
																		? "bg-green-500"
																		: medication.adherence >=
																		  80
																		? "bg-yellow-500"
																		: "bg-red-500"
																}`}
																style={{
																	width: `${medication.adherence}%`,
																}}></div>
														</div>
														<span className="text-xs sm:text-sm font-semibold">
															{
																medication.adherence
															}
															%
														</span>
													</div>
												</div>
												<p className="text-xs sm:text-sm">
													<strong>
														Effectiveness:
													</strong>{" "}
													{medication.effectiveness}
												</p>
												<p className="text-xs sm:text-sm break-words">
													<strong>
														Side Effects:
													</strong>{" "}
													{medication.sideEffects}
												</p>
												<p className="text-xs sm:text-sm">
													<strong>Cost:</strong>{" "}
													{medication.cost}
												</p>
												<p className="text-xs sm:text-sm">
													<strong>
														Next Review:
													</strong>{" "}
													{medication.nextReview}
												</p>
											</div>
										</div>
										<div className="lg:col-span-1">
											<h4 className="font-semibold mb-2 text-purple-600 text-sm sm:text-base">
												Actions
											</h4>
											<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
												<Button
													size="sm"
													variant="outline"
													className="w-full bg-transparent text-xs sm:text-sm">
													<Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
													<span className="hidden xs:inline">
														Schedule Review
													</span>
													<span className="xs:hidden">
														Review
													</span>
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="w-full bg-transparent text-xs sm:text-sm">
													<Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
													<span className="hidden xs:inline">
														Set Reminder
													</span>
													<span className="xs:hidden">
														Remind
													</span>
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="w-full bg-transparent text-xs sm:text-sm">
													<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
													<span className="hidden xs:inline">
														Mark Taken
													</span>
													<span className="xs:hidden">
														Taken
													</span>
												</Button>
												{medication.status ===
													"Active" && (
													<Button
														size="sm"
														variant="outline"
														className="w-full bg-transparent text-red-600 text-xs sm:text-sm">
														<AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
														<span className="hidden xs:inline">
															Report Side Effect
														</span>
														<span className="xs:hidden">
															Report
														</span>
													</Button>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="timeline">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center">
								<Activity className="mr-2 h-5 w-5" />
								Medication Timeline (Gantt Chart)
							</CardTitle>
						</CardHeader>
						<CardContent>{renderGanttChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="table-management">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
								<div className="flex items-center">
									<Table className="mr-2 h-5 w-5" />
									Medication Management Table
								</div>
								<Button
									onClick={() => setShowAddForm(true)}
									className="text-xs sm:text-sm">
									<Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
									Add Medication
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>{renderManagementTable()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="adherence">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Medication Adherence Tracking
							</CardTitle>
						</CardHeader>
						<CardContent>{renderAdherenceChart()}</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="effectiveness">
					<Card className="bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Medication Effectiveness Monitoring
							</CardTitle>
						</CardHeader>
						<CardContent>{renderEffectivenessChart()}</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
