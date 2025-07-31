"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

export default function LifestyleEnhanced() {
	const [isEditing, setIsEditing] = useState(false);
	const [dietChecklist, setDietChecklist] = useState({
		highFiber: true,
		complexGrains: false,
		portionControl: true,
		fruitsVegetables: false,
		mealTiming: true,
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

	const handleDietChange = (key: string, checked: boolean) => {
		setDietChecklist((prev) => ({ ...prev, [key]: checked }));
	};

	const handleActivityChange = (key: string, value: string) => {
		setPhysicalActivity((prev) => ({ ...prev, [key]: value }));
	};

	const getDietComplianceScore = () => {
		const checkedItems =
			Object.values(dietChecklist).filter(Boolean).length;
		return Math.round(
			(checkedItems / Object.keys(dietChecklist).length) * 100
		);
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
		<div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold text-navy-600">
					Lifestyle Overview
				</h1>
				<Button
					onClick={() => setIsEditing(!isEditing)}
					variant={isEditing ? "default" : "outline"}
					className="flex items-center gap-2"
				>
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
							{
								Object.values(dietChecklist).filter(Boolean)
									.length
							}{" "}
							of {Object.keys(dietChecklist).length} goals met
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
									}
								>
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
									}
								>
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
							value={Number.parseInt(stressManagement.level) * 10}
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
							Diet Assessment & Issues
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-4 text-red-600">
									Diet Issues Identified:
								</h4>
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<Checkbox
											id="highFiber"
											checked={dietChecklist.highFiber}
											onCheckedChange={(checked) =>
												handleDietChange(
													"highFiber",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label
											htmlFor="highFiber"
											className="flex items-center"
										>
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
											onCheckedChange={(checked) =>
												handleDietChange(
													"complexGrains",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label
											htmlFor="complexGrains"
											className="flex items-center"
										>
											Complex grains (brown rice, whole
											wheat)
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
											onCheckedChange={(checked) =>
												handleDietChange(
													"portionControl",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label
											htmlFor="portionControl"
											className="flex items-center"
										>
											Portion size as food plate principle
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
											onCheckedChange={(checked) =>
												handleDietChange(
													"fruitsVegetables",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label
											htmlFor="fruitsVegetables"
											className="flex items-center"
										>
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
											checked={dietChecklist.mealTiming}
											onCheckedChange={(checked) =>
												handleDietChange(
													"mealTiming",
													checked as boolean
												)
											}
											disabled={!isEditing}
										/>
										<Label
											htmlFor="mealTiming"
											className="flex items-center"
										>
											Appropriate timing of meals and
											snacks
											{dietChecklist.mealTiming && (
												<CheckCircle className="ml-2 h-4 w-4 text-green-500" />
											)}
										</Label>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-semibold mb-4">
									Current Diet Summary:
								</h4>
								<div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
									<p>
										<strong>Carbohydrates:</strong> Mainly
										refined grains, needs complex carbs
									</p>
									<p>
										<strong>Fiber intake:</strong> ~15g/day
										(Target: 25-30g/day)
									</p>
									<p>
										<strong>Fruits & Vegetables:</strong>{" "}
										2-3 servings/day (Target: 4-5)
									</p>
									<p>
										<strong>Meal timing:</strong> Regular 3
										meals + 2 snacks
									</p>
									<p>
										<strong>Portion control:</strong>{" "}
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
											value={physicalActivity.stepCount}
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
											value={physicalActivity.yoga}
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
											value={physicalActivity.meditation}
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
										<strong>Overall Activity Level:</strong>{" "}
										Moderate
									</p>
									<p>
										<strong>Primary Activities:</strong>{" "}
										Walking, light aerobics
									</p>
									<p>
										<strong>Strength Training:</strong>{" "}
										Needs improvement
									</p>
									<p>
										<strong>Flexibility:</strong> Occasional
										yoga
									</p>
									<p>
										<strong>Mindfulness:</strong> Regular
										meditation practice
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
												}
											>
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
												}
											>
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
												}
											>
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
											className="w-full mt-1 p-2 border rounded"
											value={habits.smoking}
											onChange={(e) =>
												setHabits((prev) => ({
													...prev,
													smoking: e.target.value,
												}))
											}
										>
											<option value="never">Never</option>
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
											className="w-full mt-1 p-2 border rounded"
											value={habits.alcohol}
											onChange={(e) =>
												setHabits((prev) => ({
													...prev,
													alcohol: e.target.value,
												}))
											}
										>
											<option value="none">None</option>
											<option value="occasional">
												Occasional
											</option>
											<option value="regular">
												Regular
											</option>
											<option value="heavy">Heavy</option>
										</select>
									</div>
									<div>
										<Label>Substance Abuse:</Label>
										<select
											className="w-full mt-1 p-2 border rounded"
											value={habits.substanceAbuse}
											onChange={(e) =>
												setHabits((prev) => ({
													...prev,
													substanceAbuse:
														e.target.value,
												}))
											}
										>
											<option value="none">None</option>
											<option value="marijuana">
												Marijuana
											</option>
											<option value="opioids">
												Opioids
											</option>
											<option value="other">Other</option>
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
												{stressManagement.level}/10
											</span>
											<Badge
												variant={
													Number.parseInt(
														stressManagement.level
													) <= 4
														? "default"
														: "destructive"
												}
											>
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
											Stress Management Techniques:
										</h4>
										<div className="flex flex-wrap gap-2">
											{stressManagement.techniques.map(
												(technique, index) => (
													<Badge
														key={index}
														variant="outline"
														className="capitalize"
													>
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
											<Label>Stress Level (1-10):</Label>
											<Input
												type="number"
												min="1"
												max="10"
												value={stressManagement.level}
												onChange={(e) =>
													setStressManagement(
														(prev) => ({
															...prev,
															level: e.target
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
												value={stressManagement.notes}
												onChange={(e) =>
													setStressManagement(
														(prev) => ({
															...prev,
															notes: e.target
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
			</div>
		</div>
	);
}
