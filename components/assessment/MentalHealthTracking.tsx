"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { BarChart3, Table, Plus } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	ReferenceArea,
	ReferenceLine,
} from "recharts";
import { MentalHealthData, ViewMode } from "./types";
import { getScoreColor } from "./utils";

interface MentalHealthTrackingProps {
	viewMode?: ViewMode;
	onViewModeChange?: (metric: string) => void;
}

export default function MentalHealthTracking({ 
	viewMode = { mentalHealth: "chart" }, 
	onViewModeChange 
}: MentalHealthTrackingProps) {
	const [newPhq9, setNewPhq9] = useState("");
	const [newGad7, setNewGad7] = useState("");
	const [newStress, setNewStress] = useState("");
	const [mentalHealthData, setMentalHealthData] = useState<MentalHealthData[]>([
		{ date: "Jan 2024", phq9: 3, gad7: 2, stressLevel: 3 },
		{ date: "Apr 2024", phq9: 2, gad7: 3, stressLevel: 4 },
		{ date: "Jul 2024", phq9: 3, gad7: 3, stressLevel: 3 },
	]);

	const toggleViewMode = (metric: string) => {
		if (onViewModeChange) {
			onViewModeChange(metric);
		}
	};

	const addMentalHealthScore = () => {
		if (newPhq9 && newGad7 && newStress) {
			const newEntry = {
				date: new Date().toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				}),
				phq9: Number.parseInt(newPhq9),
				gad7: Number.parseInt(newGad7),
				stressLevel: Number.parseInt(newStress),
			};
			setMentalHealthData((prev) => [...prev, newEntry]);
			setNewPhq9("");
			setNewGad7("");
			setNewStress("");
		}
	};

	const isChart = viewMode.mentalHealth === "chart";

	return (
		<Card className="bg-white shadow-lg">
			<CardHeader>
				<CardTitle className="text-xl text-navy-600">
					Mental Health Assessment & Tracking
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Add New Scores */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="font-semibold text-blue-900 mb-3">Add New Scores</h3>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
						<div>
							<Label htmlFor="phq9-score">PHQ-9 Score (0-27)</Label>
							<Input
								id="phq9-score"
								type="number"
								min="0"
								max="27"
								value={newPhq9}
								onChange={(e) => setNewPhq9(e.target.value)}
								placeholder="Depression score"
								className="mt-1"
							/>
							<div className="text-xs text-gray-600 mt-1">
								0-4: Normal, 5-9: Mild, 10+: Severe
							</div>
						</div>
						<div>
							<Label htmlFor="gad7-score">GAD-7 Score (0-21)</Label>
							<Input
								id="gad7-score"
								type="number"
								min="0"
								max="21"
								value={newGad7}
								onChange={(e) => setNewGad7(e.target.value)}
								placeholder="Anxiety score"
								className="mt-1"
							/>
							<div className="text-xs text-gray-600 mt-1">
								0-4: Normal, 5-9: Mild, 10+: Severe
							</div>
						</div>
						<div>
							<Label htmlFor="stress-level">Stress Level (1-10)</Label>
							<Input
								id="stress-level"
								type="number"
								min="1"
								max="10"
								value={newStress}
								onChange={(e) => setNewStress(e.target.value)}
								placeholder="Stress level"
								className="mt-1"
							/>
							<div className="text-xs text-gray-600 mt-1">
								1: Very Low, 10: Very High
							</div>
						</div>
						<Button
							onClick={addMentalHealthScore}
							disabled={!newPhq9 || !newGad7 || !newStress}
							className="bg-blue-600 hover:bg-blue-700">
							<Plus className="h-4 w-4 mr-2" />
							Add Scores
						</Button>
					</div>
				</div>

				{/* Mental Health Trends */}
				<div>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">
							Mental Health Trends
						</h3>
						<Toggle
							pressed={!isChart}
							onPressedChange={() => toggleViewMode("mentalHealth")}
							aria-label="Toggle mental health view">
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
								<LineChart data={mentalHealthData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip
										formatter={(value, name) => [
											`${value} ${
												name === "phq9"
													? "(PHQ-9)"
													: name === "gad7"
													? "(GAD-7)"
													: "(Stress)"
											}`,
											name === "phq9"
												? "Depression Score"
												: name === "gad7"
												? "Anxiety Score"
												: "Stress Level",
										]}
									/>
									<ReferenceArea
										y1={0}
										y2={4}
										fill="#22c55e"
										fillOpacity={0.1}
									/>
									<ReferenceArea
										y1={5}
										y2={9}
										fill="#eab308"
										fillOpacity={0.1}
									/>
									<ReferenceArea
										y1={10}
										y2={27}
										fill="#ef4444"
										fillOpacity={0.1}
									/>
									<ReferenceLine
										y={4}
										stroke="#22c55e"
										strokeDasharray="3 3"
										label={{
											value: "Normal: ≤4",
											position: "insideTopLeft",
										}}
									/>
									<ReferenceLine
										y={9}
										stroke="#eab308"
										strokeDasharray="3 3"
										label={{
											value: "Mild: 5-9",
											position: "insideTopLeft",
										}}
									/>
									<Line
										type="monotone"
										dataKey="phq9"
										stroke="#8884d8"
										name="PHQ-9 Score"
										dot={(props) => {
											const { cx, cy, payload } = props;
											const color = getScoreColor(
												payload.phq9,
												27
											);
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
										dataKey="gad7"
										stroke="#82ca9d"
										name="GAD-7 Score"
										dot={(props) => {
											const { cx, cy, payload } = props;
											const color = getScoreColor(
												payload.gad7,
												21
											);
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
										dataKey="stressLevel"
										stroke="#ffc658"
										name="Stress Level"
									/>
								</LineChart>
							</ResponsiveContainer>
							<div className="mt-4 flex justify-center space-x-6 text-sm">
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-green-200 rounded"></div>
									<span>Normal (PHQ-9: ≤4, GAD-7: ≤4)</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-yellow-200 rounded"></div>
									<span>Mild (PHQ-9: 5-9, GAD-7: 5-9)</span>
								</div>
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 bg-red-200 rounded"></div>
									<span>Severe (PHQ-9: ≥10, GAD-7: ≥10)</span>
								</div>
							</div>
						</>
					) : (
						<div className="border rounded-lg overflow-hidden">
							<table className="w-full text-sm">
								<thead className="bg-gray-50">
									<tr>
										<th className="p-3 text-left">Date</th>
										<th className="p-3 text-left">PHQ-9</th>
										<th className="p-3 text-left">GAD-7</th>
										<th className="p-3 text-left">Stress</th>
										<th className="p-3 text-left">
											Thresholds
										</th>
										<th className="p-3 text-left">Status</th>
									</tr>
								</thead>
								<tbody>
									{mentalHealthData.map((item, index) => (
										<tr
											key={index}
											className="border-t">
											<td className="p-3">{item.date}</td>
											<td className="p-3">
												<span
													style={{
														color: getScoreColor(
															item.phq9,
															27
														),
													}}>
													{item.phq9}
												</span>
											</td>
											<td className="p-3">
												<span
													style={{
														color: getScoreColor(
															item.gad7,
															21
														),
													}}>
													{item.gad7}
												</span>
											</td>
											<td className="p-3">
												{item.stressLevel}/10
											</td>
											<td className="p-3 text-xs text-gray-600">
												PHQ-9: Normal ≤4, Mild 5-9, Severe
												≥10
												<br />
												GAD-7: Normal ≤4, Mild 5-9, Severe
												≥10
											</td>
											<td className="p-3">
												<Badge
													variant={
														item.phq9 <= 4 &&
														item.gad7 <= 4
															? "default"
															: "destructive"
													}>
													{item.phq9 <= 4 &&
													item.gad7 <= 4
														? "Normal"
														: "Elevated"}
												</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}