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
	TrendingUp,
	TrendingDown,
	ArrowUp,
	ArrowDown,
	Shield,
	Bug,
	Target,
	Search,
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
	const [newMedication, setNewMedication] = useState({
		name: "",
		dosage: "",
		frequency: "",
		duration: "",
		indication: "",
	});

	const [editingMedication, setEditingMedication] =
		useState<Medication | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [managementMedications, setManagementMedications] = useState<any>([]);
	
	// Infection and Antibiotics state
	const [selectedInfection, setSelectedInfection] = useState("");
	const [selectedOrganisms, setSelectedOrganisms] = useState<string[]>([]);
	const [recommendedAntibiotics, setRecommendedAntibiotics] = useState<any[]>([]);
	const [showInfectionForm, setShowInfectionForm] = useState(false);

	// Antibiotic Spectrum Chart Data Structure
	const antibioticSpectrum = {
		// Organism categories based on the reference chart
		organisms: {
			"gram-positive-cocci": {
				name: "Gram Positive Cocci",
				color: "bg-blue-500",
				bacteria: ["MRSA", "MSSA", "Streptococcus", "Enterococcus"]
			},
			"gram-negative-bacilli": {
				name: "Gram Negative Bacilli", 
				color: "bg-red-500",
				bacteria: ["E. coli", "P. mirabilis", "Klebsiella", "Pseudomonas", "ESCAPPM"]
			},
			"gram-negative-cocci": {
				name: "Gram Negative Cocci",
				color: "bg-purple-500", 
				bacteria: ["N. gonorrhoeae", "N. meningitidis"]
			},
			"anaerobes": {
				name: "Anaerobes",
				color: "bg-amber-600",
				bacteria: ["Bacteroides", "Clostridium", "Peptostreptococcus"]
			},
			"atypicals": {
				name: "Atypicals",
				color: "bg-yellow-500",
				bacteria: ["Mycoplasma", "Legionella", "Chlamydia"]
			}
		},
		
		// Antibiotic classes and their spectrum coverage
		antibiotics: [
			{
				class: "Penicillins",
				drugs: [
					{
						name: "Penicillin G",
						coverage: ["gram-positive-cocci"],
						route: ["IV", "IM"],
						notes: "Narrow spectrum, MSSA/Strep"
					},
					{
						name: "Nafcillin/Oxacillin", 
						coverage: ["gram-positive-cocci"],
						route: ["IV", "PO"],
						notes: "Anti-staphylococcal"
					},
					{
						name: "Ampicillin/Amoxicillin",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli"],
						route: ["IV", "PO"], 
						notes: "Broad spectrum"
					}
				]
			},
			{
				class: "Cephalosporins",
				drugs: [
					{
						name: "Cefazolin, Cephalexin",
						generation: "1st",
						coverage: ["gram-positive-cocci"],
						route: ["IV", "PO"],
						notes: "1st generation"
					},
					{
						name: "Cefoxitin",
						generation: "2nd", 
						coverage: ["gram-positive-cocci", "gram-negative-bacilli", "anaerobes"],
						route: ["IV"],
						notes: "2nd generation"
					},
					{
						name: "Ceftriaxone",
						generation: "3rd",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli"],
						route: ["IV", "IM"],
						notes: "3rd generation"
					},
					{
						name: "Cefepime",
						generation: "4th",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli"],
						route: ["IV"],
						notes: "4th generation, Pseudomonas"
					}
				]
			},
			{
				class: "Carbapenems", 
				drugs: [
					{
						name: "Ertapenem",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli", "anaerobes"],
						route: ["IV"],
						notes: "No Pseudomonas coverage"
					},
					{
						name: "Imipenem, Meropenem",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli", "anaerobes"],
						route: ["IV"],
						notes: "Broad spectrum including Pseudomonas"
					}
				]
			},
			{
				class: "Quinolones",
				drugs: [
					{
						name: "Ciprofloxacin",
						coverage: ["gram-negative-bacilli"],
						route: ["IV", "PO"],
						notes: "Excellent gram-negative coverage"
					},
					{
						name: "Levofloxacin", 
						coverage: ["gram-positive-cocci", "gram-negative-bacilli", "atypicals"],
						route: ["IV", "PO"],
						notes: "Respiratory quinolone"
					},
					{
						name: "Moxifloxacin",
						coverage: ["gram-positive-cocci", "gram-negative-bacilli", "anaerobes", "atypicals"],
						route: ["IV", "PO"],
						notes: "Broad spectrum including anaerobes"
					}
				]
			},
			{
				class: "Macrolides",
				drugs: [
					{
						name: "Azithromycin",
						coverage: ["gram-positive-cocci", "atypicals"],
						route: ["IV", "PO"],
						notes: "Atypical coverage"
					}
				]
			},
			{
				class: "Tetracyclines",
				drugs: [
					{
						name: "Doxycycline",
						coverage: ["gram-positive-cocci", "atypicals"],
						route: ["IV", "PO"],
						notes: "Atypical and MRSA coverage"
					}
				]
			},
			{
				class: "Aminoglycosides",
				drugs: [
					{
						name: "Gentamicin/Tobra/Amikacin",
						coverage: ["gram-negative-bacilli"],
						route: ["IV"],
						notes: "Synergy with cell wall agents"
					}
				]
			},
			{
				class: "Others",
				drugs: [
					{
						name: "Vancomycin",
						coverage: ["gram-positive-cocci"],
						route: ["IV", "PO"],
						notes: "MRSA coverage"
					},
					{
						name: "Linezolid",
						coverage: ["gram-positive-cocci"],
						route: ["IV", "PO"],
						notes: "MRSA, VRE coverage"
					},
					{
						name: "Metronidazole",
						coverage: ["anaerobes"],
						route: ["IV", "PO"],
						notes: "Anaerobic coverage only"
					}
				]
			}
		]
	};

	// Common infection types and their likely organisms
	const infectionTypes = {
		"UTI": ["gram-negative-bacilli"],
		"Pneumonia": ["gram-positive-cocci", "gram-negative-bacilli", "atypicals"],
		"Skin/Soft Tissue": ["gram-positive-cocci"],
		"Intra-abdominal": ["gram-negative-bacilli", "anaerobes"],
		"Sepsis": ["gram-positive-cocci", "gram-negative-bacilli"],
		"Respiratory": ["gram-positive-cocci", "gram-negative-bacilli", "atypicals"],
		"Post-operative": ["gram-positive-cocci", "gram-negative-bacilli", "anaerobes"]
	};

	// Enhanced medication timeline data with dose changes and color coding
	const medicationTimeline = [
		{
			id: 1,
			name: "Novomix Penfill",
			type: "Diabetes",
			periods: [
				{
					startDate: "15/01/2020",
					endDate: "30/06/2021",
					status: "active",
					reason: "Initial therapy",
					dosage: "16-14 units morning/evening",
					timing: "10 minutes before meals",
				},
				{
					startDate: "01/07/2021",
					endDate: "31/12/2021",
					status: "stopped",
					reason: "Side effects",
					dosage: "16-14 units",
					timing: "10 minutes before meals",
				},
				{
					startDate: "01/01/2022",
					endDate: "01/06/2022",
					status: "active",
					reason: "Resumed with dose adjustment",
					dosage: "18-16 units morning/evening",
					changeType: "increase",
					timing: "10 minutes before meals",
				},
				{
					startDate: "01/06/2022",
					endDate: null,
					status: "active",
					reason: "Dose increased for better control",
					dosage: "20-22/16-18 units morning/evening",
					changeType: "increase",
					timing: "10 minutes before meals",
				},
			],
			currentDosage: "20-22 units morning, 16-18 units evening",
		},
		{
			id: 2,
			name: "Metformin + Glimepiride",
			type: "Diabetes",
			periods: [
				{
					startDate: "10/03/2018",
					endDate: "01/06/2021",
					status: "active",
					reason: "Initial therapy",
					dosage: "500mg/1mg twice daily",
					timing: "After food",
				},
				{
					startDate: "01/06/2021",
					endDate: null,
					status: "active",
					reason: "Dose increased",
					dosage: "500mg/2mg twice daily",
					changeType: "increase",
					timing: "After food",
				},
			],
			currentDosage: "500mg/2mg twice daily",
		},
		{
			id: 3,
			name: "Sitagliptin + Dapagliflozin",
			type: "Diabetes",
			periods: [
				{
					startDate: "10/01/2024",
					endDate: null,
					status: "active",
					reason: "Added for better control",
					dosage: "100mg/10mg once daily",
					changeType: "new",
					timing: "Before food, 30 minutes",
				},
			],
			currentDosage: "100mg/10mg once daily",
		},
		{
			id: 4,
			name: "Losartan + Amlodipine",
			type: "Hypertension",
			periods: [
				{
					startDate: "20/06/2019",
					endDate: "15/03/2020",
					status: "active",
					reason: "Initial therapy",
					dosage: "50mg/10mg once daily",
					timing: "After food",
				},
				{
					startDate: "16/03/2020",
					endDate: "30/08/2020",
					status: "stopped",
					reason: "Dose optimization",
					dosage: "50mg/10mg once daily",
					timing: "After food",
				},
				{
					startDate: "01/09/2020",
					endDate: null,
					status: "active",
					reason: "Resumed with lower dose",
					dosage: "50mg/5mg once daily",
					changeType: "decrease",
					timing: "After food",
				},
			],
			currentDosage: "50mg/5mg once daily",
		},
		{
			id: 5,
			name: "Aspirin + Atorvastatin",
			type: "Cardiovascular Protection",
			periods: [
				{
					startDate: "20/06/2019",
					endDate: null,
					status: "active",
					reason: "Cardioprotection",
					dosage: "75mg/10mg once daily",
					timing: "After food",
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
					startDate: "15/01/2023",
					endDate: "15/01/2024",
					status: "discontinued",
					reason: "Ineffective",
					dosage: "10mg once daily",
					changeType: "discontinue",
					timing: "After food, 30 minutes",
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
			type: "Diabetes",
			dosage: "500mg/2mg",
			frequency: "Twice daily",
			timing: "After food",
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
			type: "Diabetes",
			dosage: "100mg/10mg",
			frequency: "Once daily",
			timing: "Before food, 30 minutes",
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
			type: "Hypertension",
			dosage: "50mg/5mg",
			frequency: "Once daily",
			timing: "After food",
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
			type: "Cardiovascular Protection",
			dosage: "75mg/10mg",
			frequency: "Once daily",
			timing: "After food",
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

	// Antibiotic Recommendation Engine
	const getAntibioticRecommendations = (targetOrganisms: string[]) => {
		const recommendations: any[] = [];
		
		antibioticSpectrum.antibiotics.forEach(antibioticClass => {
			antibioticClass.drugs.forEach(drug => {
				const matchedOrganisms = targetOrganisms.filter(organism => 
					drug.coverage.includes(organism)
				);
				
				if (matchedOrganisms.length > 0) {
					recommendations.push({
						...drug,
						class: antibioticClass.class,
						coverageScore: matchedOrganisms.length / targetOrganisms.length,
						matchedOrganisms
					});
				}
			});
		});
		
		// Sort by coverage score (highest first) and then by spectrum breadth
		return recommendations.sort((a, b) => {
			if (b.coverageScore !== a.coverageScore) {
				return b.coverageScore - a.coverageScore;
			}
			return b.coverage.length - a.coverage.length;
		});
	};

	// Handle infection selection
	const handleInfectionSelection = (infection: string) => {
		setSelectedInfection(infection);
		const organisms = infectionTypes[infection as keyof typeof infectionTypes] || [];
		setSelectedOrganisms(organisms);
		
		if (organisms.length > 0) {
			const recommendations = getAntibioticRecommendations(organisms);
			setRecommendedAntibiotics(recommendations);
		}
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
		changeType?: string;
		dosage?: string;
		timing?: string;
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

	// Helper function to get change color based on type
	const getChangeColor = (changeType: string) => {
		switch (changeType) {
			case "increase":
				return "bg-red-100 border-l-4 border-red-500 text-red-800";
			case "decrease":
				return "bg-green-100 border-l-4 border-green-500 text-green-800";
			case "new":
				return "bg-blue-100 border-l-4 border-blue-500 text-blue-800";
			case "discontinue":
				return "bg-gray-100 border-l-4 border-gray-500 text-gray-800";
			default:
				return "bg-gray-100 border-l-4 border-gray-400 text-gray-700";
		}
	};

	// Helper function to get category color
	const getCategoryColor = (type: string) => {
		switch (type) {
			case "Diabetes":
				return "bg-blue-500";
			case "Hypertension":
				return "bg-purple-500";
			case "Cardiovascular Protection":
				return "bg-orange-500";
			case "Blood Thinner":
				return "bg-red-500";
			case "Cholesterol":
				return "bg-yellow-500";
			case "Immunomodulator":
				return "bg-pink-500";
			default:
				return "bg-gray-500";
		}
	};

	const renderGanttChart = () => {
		return (
			<div className="space-y-6">
				{/* Medication Timeline in Table Format */}
				<div className="bg-white border rounded-lg overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-100">
								<tr>
									<th className="p-3 text-left font-semibold text-gray-700 min-w-[200px]">
										Medication Name
									</th>
									<th className="p-3 text-center font-semibold text-gray-700 min-w-[600px] max-w-[600px]">
										<div className="mb-2">Timeline (2018-2024)</div>
										{/* Timeline Scale constrained to this column only */}
										<div className="flex justify-between text-xs text-gray-600 border-b pb-2 mx-2">
											<span>01/01/2018</span>
											<span>01/01/2019</span>
											<span>01/01/2020</span>
											<span>01/01/2021</span>
											<span>01/01/2022</span>
											<span>01/01/2023</span>
											<span>01/01/2024</span>
											<span>31/12/2024</span>
										</div>
									</th>
									<th className="p-3 text-left font-semibold text-gray-700 min-w-[150px]">
										Current Dosage
									</th>
								</tr>
							</thead>
							<tbody>
								{medicationTimeline.map((medication: any) => (
									<tr
										key={medication.id}
										className="border-t hover:bg-gray-50">
										{/* Medication Name Column */}
										<td className="p-3 align-top">
											<div className="space-y-2">
												<div className="font-semibold text-sm">
													{medication.name}
												</div>
												<Badge
													className={`${getCategoryColor(
														medication.type
													)} text-white text-xs`}>
													{medication.type}
												</Badge>
											</div>
										</td>

										{/* Timeline Column */}
										<td className="p-3 max-w-[600px]">
											<div className="relative h-12 bg-gray-50 rounded border overflow-hidden">
												{/* Timeline periods as horizontal bars */}
												{medication.periods.map(
													(
														period: MedicationPeriod,
														index: number
													) => {
														const position =
															calculateGanttPosition(
																period.startDate
																	.replace(
																		/\//g,
																		"-"
																	)
																	.split("-")
																	.reverse()
																	.join("-"),
																period.endDate
																	? period.endDate
																			.replace(
																				/\//g,
																				"-"
																			)
																			.split(
																				"-"
																			)
																			.reverse()
																			.join(
																				"-"
																			)
																	: null
															);

														return (
															<div
																key={index}
																className={`absolute top-1 bottom-1 rounded flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:opacity-80 ${
																	period.changeType
																		? period.changeType ===
																		  "increase"
																			? "bg-red-500"
																			: period.changeType ===
																			  "decrease"
																			? "bg-green-500"
																			: period.changeType ===
																			  "new"
																			? "bg-blue-500"
																			: period.changeType ===
																			  "discontinue"
																			? "bg-gray-500"
																			: getCategoryColor(
																					medication.type
																			  )
																		: getCategoryColor(
																				medication.type
																		  )
																}`}
																style={{
																	left: position.left,
																	width: position.width,
																	minWidth: "20px",
																	maxWidth: "calc(100% - 4px)",
																}}
																title={`${
																	period.startDate
																} - ${
																	period.endDate ||
																	"Present"
																}: ${
																	period.dosage
																} (${
																	period.reason
																})`}>
																{/* Change indicator icons */}
																{period.changeType ===
																	"increase" &&
																	"↑"}
																{period.changeType ===
																	"decrease" &&
																	"↓"}
																{period.changeType ===
																	"new" &&
																	"+"}
																{period.changeType ===
																	"discontinue" &&
																	"×"}
																{!period.changeType &&
																	"●"}
															</div>
														);
													}
												)}
											</div>

											{/* Detailed periods below timeline */}
											<div className="mt-2 space-y-1">
												{medication.periods.map(
													(
														period: MedicationPeriod,
														index: number
													) => (
														<div
															key={index}
															className="text-xs text-gray-600 flex items-center space-x-2">
															<span className="font-medium">
																{
																	period.startDate
																}
															</span>
															{period.endDate && (
																<span>
																	→{" "}
																	{
																		period.endDate
																	}
																</span>
															)}
															<span className="text-gray-500">
																|
															</span>
															<span className="font-semibold">
																{period.dosage}
															</span>
															<span className="text-gray-500">
																|
															</span>
															<span>
																{period.timing}
															</span>
															{period.changeType && (
																<>
																	<span className="text-gray-500">
																		|
																	</span>
																	<span
																		className={`font-medium ${
																			period.changeType ===
																			"increase"
																				? "text-red-600"
																				: period.changeType ===
																				  "decrease"
																				? "text-green-600"
																				: period.changeType ===
																				  "new"
																				? "text-blue-600"
																				: "text-gray-600"
																		}`}>
																		{period.changeType ===
																			"increase" &&
																			"↑ Increased"}
																		{period.changeType ===
																			"decrease" &&
																			"↓ Decreased"}
																		{period.changeType ===
																			"new" &&
																			"+ New"}
																		{period.changeType ===
																			"discontinue" &&
																			"× Discontinued"}
																	</span>
																</>
															)}
														</div>
													)
												)}
											</div>
										</td>

										{/* Current Dosage Column */}
										<td className="p-3 align-top">
											<div className="text-sm font-medium">
												{medication.currentDosage}
											</div>
											<Badge
												variant={
													medication.periods.some(
														(p: MedicationPeriod) =>
															p.status ===
															"active"
													)
														? "default"
														: "secondary"
												}
												className="mt-1 text-xs">
												{medication.periods.some(
													(p: MedicationPeriod) =>
														p.status === "active"
												)
													? "Active"
													: "Discontinued"}
											</Badge>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Enhanced Legend */}
				<div className="bg-gray-50 p-4 rounded-lg space-y-4">
					{/* Category Legend */}
					<div>
						<h4 className="font-semibold mb-2">
							Medication Categories:
						</h4>
						<div className="flex flex-wrap gap-3">
							{[
								"Diabetes",
								"Hypertension",
								"Cardiovascular Protection",
								"Blood Thinner",
								"Cholesterol",
								"Immunomodulator",
							].map((category) => (
								<div
									key={category}
									className="flex items-center gap-2">
									<div
										className={`w-3 h-3 rounded-sm ${getCategoryColor(
											category
										)}`}
									/>
									<span className="text-xs">{category}</span>
								</div>
							))}
						</div>
					</div>

					{/* Change Indicators */}
					<div>
						<h4 className="font-semibold mb-2">
							Dose Change Indicators:
						</h4>
						<div className="flex flex-wrap gap-4 text-xs">
							<div className="flex items-center gap-2">
								<span className="text-red-600 font-bold text-sm">
									↑
								</span>
								<span className="px-2 py-1 bg-red-100 border-l-2 border-red-500 rounded text-red-800">
									Dose Increase
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-green-600 font-bold text-sm">
									↓
								</span>
								<span className="px-2 py-1 bg-green-100 border-l-2 border-green-500 rounded text-green-800">
									Dose Decrease
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-blue-600 font-bold text-sm">
									+
								</span>
								<span className="px-2 py-1 bg-blue-100 border-l-2 border-blue-500 rounded text-blue-800">
									New Medication
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-gray-600 font-bold text-sm">
									×
								</span>
								<span className="px-2 py-1 bg-gray-100 border-l-2 border-gray-500 rounded text-gray-800">
									Discontinued
								</span>
							</div>
						</div>
					</div>

					{/* Status Indicators */}
					<div>
						<h4 className="font-semibold mb-2">
							Status Indicators:
						</h4>
						<div className="flex flex-wrap gap-3">
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
									Active
								</span>
								<span className="text-xs">
									Currently taking
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
									Stopped
								</span>
								<span className="text-xs">
									Temporarily stopped
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
									Discontinued
								</span>
								<span className="text-xs">
									Permanently discontinued
								</span>
							</div>
						</div>
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
		timing?: string;
		adherence: number;
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
		// Group medications by category
		const medicationsByCategory = managementMedications.reduce(
			(acc: any, med: ManagementMedication) => {
				const category = med.type;
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(med);
				return acc;
			},
			{}
		);

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

				{/* Post-Consultation Changes */}
				<Card className="border-green-200 bg-green-50">
					<CardHeader>
						<CardTitle className="text-lg text-green-800 flex items-center">
							<TrendingUp className="mr-2 h-5 w-5" />
							Post-Consultation Medication Changes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="p-3 border-l-4 border-red-500 bg-red-100 rounded-r-lg">
								<div className="flex items-center space-x-2 mb-2">
									<ArrowUp className="h-4 w-4 text-red-600" />
									<span className="font-semibold text-red-700">
										Dose Increased
									</span>
								</div>
								<p className="text-sm text-red-700">
									<strong>Novomix Penfill:</strong> 18-16
									units → 20-22/16-18 units (Morning/Evening)
								</p>
							</div>

							<div className="p-3 border-l-4 border-blue-500 bg-blue-100 rounded-r-lg">
								<div className="flex items-center space-x-2 mb-2">
									<Plus className="h-4 w-4 text-blue-600" />
									<span className="font-semibold text-blue-700">
										New Medication Added
									</span>
								</div>
								<p className="text-sm text-blue-700">
									<strong>
										Sitagliptin + Dapagliflozin:
									</strong>{" "}
									100mg/10mg once daily - Before food, 30
									minutes
								</p>
							</div>

							<div className="p-3 border-l-4 border-green-500 bg-green-100 rounded-r-lg">
								<div className="flex items-center space-x-2 mb-2">
									<ArrowDown className="h-4 w-4 text-green-600" />
									<span className="font-semibold text-green-700">
										Dose Reduced
									</span>
								</div>
								<p className="text-sm text-green-700">
									<strong>Losartan + Amlodipine:</strong>{" "}
									50mg/10mg → 50mg/5mg once daily
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Medications by Category */}
				{Object.entries(medicationsByCategory).map(
					([category, medications]) => (
						<Card
							key={category}
							className="border rounded-lg">
							<CardHeader
								className={`${getCategoryColor(
									category
								)} text-white`}>
								<CardTitle className="text-lg flex items-center justify-between">
									<span>{category} Medications</span>
									<Badge
										variant="secondary"
										className="bg-white text-gray-800">
										{
											(
												medications as ManagementMedication[]
											).length
										}{" "}
										medications
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full text-xs sm:text-sm">
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
													Detailed Timing
												</th>
												<th className="p-2 sm:p-3 text-left font-semibold">
													Status
												</th>
												<th className="p-2 sm:p-3 text-left font-semibold">
													Actions
												</th>
											</tr>
										</thead>
										<tbody>
											{(
												medications as ManagementMedication[]
											).map(
												(
													medication: ManagementMedication
												) => (
													<tr
														key={medication.id}
														className="border-t hover:bg-gray-50">
														<td className="p-2 sm:p-3">
															<div className="font-medium">
																{
																	medication.name
																}
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
																	onBlur={(
																		e
																	) =>
																		handleSaveMedication(
																			medication.id,
																			{
																				dosage: e
																					.target
																					.value,
																			}
																		)
																	}
																/>
															) : (
																<span className="text-xs">
																	{
																		medication.dosage
																	}
																</span>
															)}
														</td>
														<td className="p-2 sm:p-3">
															<span className="text-xs">
																{
																	medication.frequency
																}
															</span>
														</td>
														<td className="p-2 sm:p-3">
															<div className="text-xs">
																<div className="font-medium text-blue-600">
																	{medication.timing ||
																		"Not specified"}
																</div>
																{medication.name ===
																	"Novomix Penfill" && (
																	<div className="text-gray-600 text-xs mt-1">
																		10
																		minutes
																		before
																		meals
																	</div>
																)}
																{medication.name ===
																	"Metformin + Glimepiride" && (
																	<div className="text-gray-600 text-xs mt-1">
																		After
																		food
																	</div>
																)}
																{medication.name ===
																	"Sitagliptin + Dapagliflozin" && (
																	<div className="text-gray-600 text-xs mt-1">
																		Before
																		food, 30
																		minutes
																	</div>
																)}
																{medication.name ===
																	"Losartan + Amlodipine" && (
																	<div className="text-gray-600 text-xs mt-1">
																		After
																		food
																	</div>
																)}
																{medication.name ===
																	"Aspirin + Atorvastatin" && (
																	<div className="text-gray-600 text-xs mt-1">
																		After
																		food
																	</div>
																)}
															</div>
														</td>
														<td className="p-2 sm:p-3">
															<Badge
																variant={
																	medication.status ===
																	"Active"
																		? "default"
																		: "secondary"
																}
																className="text-xs">
																{
																	medication.status
																}
															</Badge>
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
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)
				)}

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
				defaultValue="timeline"
				className="w-full space-y-2 sm:space-y-0">
				<TabsList className="mb-4 w-full flex-wrap h-auto gap-1 p-1">
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
						value="infections-antibiotics"
						className="flex-1 text-xs sm:text-sm">
						Infections & Antibiotics
					</TabsTrigger>
				</TabsList>

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
					<div className="space-y-6">
						{/* Medication Management Table */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
									<div className="flex items-center">
										<Table className="mr-2 h-5 w-5" />
										Medication Management
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

						{/* Adherence and Adverse Effects Section */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Activity className="mr-2 h-5 w-5" />
									Adherence & Self-Reported Adverse Effects
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Adherence Section */}
									<div>
										<h4 className="font-semibold text-blue-600 mb-4">
											Medication Adherence
										</h4>
										<div className="space-y-3">
											{managementMedications
												.filter(
													(
														med: ManagementMedication
													) => med.status === "Active"
												)
												.map(
													(
														medication: ManagementMedication
													) => (
														<div
															key={medication.id}
															className="p-3 border rounded-lg">
															<div className="flex items-center justify-between mb-2">
																<span className="font-medium text-sm">
																	{
																		medication.name
																	}
																</span>
																<Badge
																	className={`${getCategoryColor(
																		medication.type
																	)} text-white text-xs`}>
																	{
																		medication.type
																	}
																</Badge>
															</div>
															<div className="flex items-center space-x-3">
																<div className="flex-1">
																	<div className="w-full bg-gray-200 rounded-full h-2">
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
																</div>
																<span className="text-sm font-semibold">
																	{
																		medication.adherence
																	}
																	%
																</span>
															</div>
														</div>
													)
												)}
										</div>
									</div>

									{/* Self-Reported Adverse Effects */}
									<div>
										<h4 className="font-semibold text-red-600 mb-4">
											Self-Reported Adverse Effects
										</h4>
										<div className="space-y-3">
											<div className="p-3 border rounded-lg bg-red-50 border-red-200">
												<div className="flex items-center justify-between mb-2">
													<span className="font-medium text-sm">
														Metformin + Glimepiride
													</span>
													<Badge
														variant="destructive"
														className="text-xs">
														GI Effects
													</Badge>
												</div>
												<p className="text-xs text-gray-600 mb-2">
													<strong>Reported:</strong>{" "}
													15/07/2024
												</p>
												<p className="text-sm">
													Mild nausea and stomach
													upset after meals. Occurs
													2-3 times per week.
												</p>
											</div>

											<div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
												<div className="flex items-center justify-between mb-2">
													<span className="font-medium text-sm">
														Losartan + Amlodipine
													</span>
													<Badge
														variant="secondary"
														className="text-xs">
														Mild
													</Badge>
												</div>
												<p className="text-xs text-gray-600 mb-2">
													<strong>Reported:</strong>{" "}
													22/06/2024
												</p>
												<p className="text-sm">
													Occasional ankle swelling,
													especially in the evening.
												</p>
											</div>

											<div className="p-3 border rounded-lg bg-green-50 border-green-200">
												<div className="flex items-center justify-between mb-2">
													<span className="font-medium text-sm">
														Novomix Penfill
													</span>
													<Badge className="bg-green-500 text-white text-xs">
														No Issues
													</Badge>
												</div>
												<p className="text-xs text-gray-600 mb-2">
													<strong>
														Last Checked:
													</strong>{" "}
													30/07/2024
												</p>
												<p className="text-sm">
													No adverse effects reported.
													Good tolerance.
												</p>
											</div>
										</div>

										{/* Add New Adverse Effect Report */}
										<div className="mt-4">
											<Button
												variant="outline"
												className="w-full text-sm">
												<AlertTriangle className="mr-2 h-4 w-4" />
												Report New Adverse Effect
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="infections-antibiotics">
					<div className="space-y-6">
						{/* Infection Selection Card */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center">
									<Bug className="mr-2 h-5 w-5" />
									Infection Type & Organism Selection
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Infection Type Selection */}
									<div>
										<h4 className="font-semibold text-gray-700 mb-3">Select Infection Type:</h4>
										<div className="grid grid-cols-1 gap-2">
											{Object.keys(infectionTypes).map((infection) => (
												<Button
													key={infection}
													variant={selectedInfection === infection ? "default" : "outline"}
													className="justify-start text-sm"
													onClick={() => handleInfectionSelection(infection)}>
													<Target className="mr-2 h-4 w-4" />
													{infection}
												</Button>
											))}
										</div>
									</div>

									{/* Target Organisms Display */}
									<div>
										<h4 className="font-semibold text-gray-700 mb-3">Target Organisms:</h4>
										{selectedOrganisms.length > 0 ? (
											<div className="space-y-3">
												{selectedOrganisms.map((organismType) => {
													const organism = antibioticSpectrum.organisms[organismType as keyof typeof antibioticSpectrum.organisms];
													return (
														<div key={organismType} className="p-3 border rounded-lg">
															<div className="flex items-center space-x-2 mb-2">
																<div className={`w-4 h-4 rounded ${organism.color}`}></div>
																<span className="font-medium">{organism.name}</span>
															</div>
															<div className="flex flex-wrap gap-1">
																{organism.bacteria.map((bacterium) => (
																	<Badge key={bacterium} variant="secondary" className="text-xs">
																		{bacterium}
																	</Badge>
																))}
															</div>
														</div>
													);
												})}
											</div>
										) : (
											<div className="text-gray-500 italic">Select an infection type to see target organisms</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Antibiotic Spectrum Chart */}
						{selectedInfection && (
							<Card className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl text-navy-600 flex items-center">
										<Shield className="mr-2 h-5 w-5" />
										Antibiotic Spectrum Chart - {selectedInfection}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{/* Spectrum Chart Table */}
										<div className="overflow-x-auto">
											<table className="w-full border-collapse">
												<thead>
													<tr>
														<th className="p-3 text-left font-semibold text-sm border-b min-w-[160px]">Antibiotic</th>
														{Object.entries(antibioticSpectrum.organisms).map(([key, organism]) => (
															<th key={key} className="p-2 text-center border-b min-w-[80px]">
																<div className={`w-full h-8 rounded flex items-center justify-center text-white text-xs font-medium ${organism.color}`}>
																	{organism.name.split(' ').map(word => word[0]).join('')}
																</div>
																<div className="text-xs text-gray-600 mt-1 font-normal">
																	{organism.name}
																</div>
															</th>
														))}
														<th className="p-3 text-left font-semibold text-sm border-b min-w-[100px]">Route</th>
													</tr>
												</thead>
												<tbody>
													{recommendedAntibiotics.slice(0, 10).map((antibiotic, index) => (
														<tr key={index} className="border-b hover:bg-gray-50">
															<td className="p-3">
																<div className="text-sm font-medium">{antibiotic.name}</div>
																<div className="text-xs text-gray-500">{antibiotic.class}</div>
															</td>
															{Object.keys(antibioticSpectrum.organisms).map((organismType) => (
																<td key={organismType} className="p-2 text-center">
																	<div className="h-8 bg-gray-100 rounded flex items-center justify-center">
																		{antibiotic.coverage.includes(organismType) ? (
																			<div className={`w-full h-6 rounded flex items-center justify-center text-white text-xs font-bold ${antibioticSpectrum.organisms[organismType as keyof typeof antibioticSpectrum.organisms].color}`}>
																				●
																			</div>
																		) : (
																			<div className="w-full h-6 bg-gray-200 rounded"></div>
																		)}
																	</div>
																</td>
															))}
															<td className="p-3">
																<div className="text-xs">
																	{antibiotic.route.map((route: string, idx: number) => (
																		<Badge key={idx} variant="outline" className="mr-1 text-xs">
																			{route}
																		</Badge>
																	))}
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>

										{/* Legend */}
										<div className="bg-gray-50 p-3 rounded-lg">
											<h6 className="font-semibold text-sm mb-2">Legend:</h6>
											<div className="flex flex-wrap gap-3 text-xs">
												{Object.entries(antibioticSpectrum.organisms).map(([key, organism]) => (
													<div key={key} className="flex items-center gap-2">
														<div className={`w-3 h-3 rounded ${organism.color}`}></div>
														<span>{organism.name}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Antibiotic Recommendations */}
						{recommendedAntibiotics.length > 0 && (
							<Card className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-xl text-navy-600 flex items-center">
										<Search className="mr-2 h-5 w-5" />
										Recommended Antibiotics for {selectedInfection}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{/* Top 5 Recommendations */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{recommendedAntibiotics.slice(0, 6).map((antibiotic, index) => (
												<div key={index} className={`p-4 border rounded-lg ${index === 0 ? 'border-green-500 bg-green-50' : index === 1 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
													<div className="flex items-center justify-between mb-2">
														<h5 className="font-semibold text-sm">{antibiotic.name}</h5>
														<Badge className={index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-500'}>
															{index === 0 ? '1st Choice' : index === 1 ? '2nd Choice' : `${index + 1}rd Choice`}
														</Badge>
													</div>
													<div className="text-xs text-gray-600 space-y-1">
														<div><strong>Class:</strong> {antibiotic.class}</div>
														<div><strong>Route:</strong> {antibiotic.route.join(', ')}</div>
														<div><strong>Coverage:</strong> {Math.round(antibiotic.coverageScore * 100)}% match</div>
														<div><strong>Notes:</strong> {antibiotic.notes}</div>
													</div>
													
													{/* Add to Timeline Button */}
													<Button 
														size="sm" 
														className="w-full mt-3 text-xs"
														onClick={() => {
															// This would add the antibiotic to the medication timeline
															console.log('Adding to timeline:', antibiotic.name);
														}}>
														<Plus className="mr-1 h-3 w-3" />
														Add to Treatment Plan
													</Button>
												</div>
											))}
										</div>

										{/* Coverage Summary */}
										<div className="bg-gray-50 p-4 rounded-lg">
											<h5 className="font-semibold mb-2">Coverage Analysis:</h5>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<h6 className="font-medium text-sm mb-1">Broad Spectrum Options:</h6>
													<div className="text-xs text-gray-600">
														{recommendedAntibiotics
															.filter(ab => ab.coverage.length >= 3)
															.slice(0, 3)
															.map(ab => ab.name)
															.join(', ') || 'None available'}
													</div>
												</div>
												<div>
													<h6 className="font-medium text-sm mb-1">Narrow Spectrum Options:</h6>
													<div className="text-xs text-gray-600">
														{recommendedAntibiotics
															.filter(ab => ab.coverage.length <= 2)
															.slice(0, 3)
															.map(ab => ab.name)
															.join(', ') || 'None available'}
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Quick Reference Legend */}
						<Card className="bg-gray-50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg text-gray-700">Quick Reference</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* Organism Categories */}
									<div>
										<h5 className="font-semibold mb-2">Organism Categories:</h5>
										<div className="space-y-1">
											{Object.entries(antibioticSpectrum.organisms).map(([key, organism]) => (
												<div key={key} className="flex items-center space-x-2 text-sm">
													<div className={`w-3 h-3 rounded ${organism.color}`}></div>
													<span>{organism.name}</span>
												</div>
											))}
										</div>
									</div>

									{/* Common Infections */}
									<div>
										<h5 className="font-semibold mb-2">Common Infections:</h5>
										<div className="space-y-1 text-sm">
											{Object.entries(infectionTypes).map(([infection, organisms]) => (
												<div key={infection} className="text-gray-600">
													<span className="font-medium">{infection}:</span> {organisms.length} organism type(s)
												</div>
											))}
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
