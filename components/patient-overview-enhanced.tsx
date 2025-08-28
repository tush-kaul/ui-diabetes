"use client";

import { useEffect, useState } from "react";
import {
	AlertTriangle,
	Calendar,
	FileText,
	PlusCircle,
	Stethoscope,
	User,
	Eye,
	BabyIcon as Kidney,
	Heart,
	Brain,
	Activity,
	ArrowRight,
	Edit,
	Plus,
	X,
	Table,
	BarChart3,
	TrendingUp,
	TrendingDown,
	Minus,
	Pill,
	FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";

interface PatientOverviewEnhancedProps {
	onNavigate: (tabId: string, subTabId?: string) => void;
}

export default function PatientOverviewEnhanced({
	onNavigate,
}: PatientOverviewEnhancedProps) {
	// Basic patient context for calculations and links
	const patient = { age: 70, sex: "male" as "male" | "female" };

	// CKD-EPI 2021 (race-free) eGFR calculator
	const computeEgfr = (
		scrMgDl: number,
		age: number,
		sex: "male" | "female"
	) => {
		const kappa = sex === "female" ? 0.7 : 0.9;
		const alpha = sex === "female" ? -0.241 : -0.302;
		const scrByK = scrMgDl / kappa;
		const minTerm = Math.min(scrByK, 1) ** alpha;
		const maxTerm = Math.max(scrByK, 1) ** -1.2;
		const ageTerm = 0.9938 ** age;
		const sexTerm = sex === "female" ? 1.012 : 1;
		return 142 * minTerm * maxTerm * ageTerm * sexTerm;
	};

	const getAssessmentSubtab = (name: string) => {
		const n = name.toLowerCase();
		if (n.includes("retin")) return "retinopathy";
		if (n.includes("neph")) return "nephropathy";
		if (n.includes("ihd") || n.includes("card") || n.includes("hf"))
			return "cardiac";
		if (n.includes("cva") || n.includes("stroke") || n.includes("neuro"))
			return "neuro";
		if (n.includes("masld") || n.includes("liver")) return "liver";
		if (n.includes("foot")) return "foot";
		if (n.includes("diabetes")) return "overview";
		if (n.includes("hypertension")) return "cardiac";
		return undefined;
	};

	const [newComplaint, setNewComplaint] = useState("");
	const [complaintDuration, setComplaintDuration] = useState("");
	const [complaintLocation, setComplaintLocation] = useState("");
	const [complaintIntensity, setComplaintIntensity] = useState("");
	const [editingDiagnosis, setEditingDiagnosis] = useState(false);
	const [draftDiagnoses, setDraftDiagnoses] = useState<any[]>([]);

	const startEditDiagnoses = () => {
		setDraftDiagnoses(
			diagnoses.map((d) => ({
				...d,
				medicationsString: (d.medications || []).join(", "),
			}))
		);
		setEditingDiagnosis(true);
	};

	const saveDiagnoses = () => {
		const cleaned = draftDiagnoses.map((d) => ({
			id: d.id,
			name: String(d.name || "").trim(),
			diagnosisYear: Number(d.diagnosisYear) || new Date().getFullYear(),
			get duration() {
				const years = calculateYearsSince(this.diagnosisYear);
				const currentYear = new Date().getFullYear();
				return `since ${years} years as on ${currentYear}`;
			},
			severity: String(d.severity || "").trim() || "Under evaluation",
			medications: String(d.medicationsString || "")
				.split(",")
				.map((m: string) => m.trim())
				.filter((m: string) => m.length > 0),
			color: d.color || "text-gray-600",
		}));
		setDiagnoses(cleaned as any);
		setEditingDiagnosis(false);
	};

	const cancelDiagnoses = () => {
		setEditingDiagnosis(false);
		setDraftDiagnoses([]);
	};
	const [showDrugDetails, setShowDrugDetails] = useState(false);
	const [complaints, setComplaints] = useState([
		{
			id: 1,
			complaint: "Occasional fatigue",
			duration: "2 weeks",
			location: "General",
			intensity: "Mild",
		},
		{
			id: 2,
			complaint: "Mild numbness in feet",
			duration: "3 months",
			location: "Both feet",
			intensity: "Mild",
		},
	]);
	// Helper function to calculate years since diagnosis
	const calculateYearsSince = (diagnosisYear: number) => {
		const currentYear = new Date().getFullYear();
		return currentYear - diagnosisYear;
	};

	const [diagnoses, setDiagnoses] = useState([
		{
			id: 1,
			name: "Diabetes",
			diagnosisYear: 1994, // Diagnosed in 1994
			get duration() {
				const years = calculateYearsSince(this.diagnosisYear);
				const currentYear = new Date().getFullYear();
				return `since ${years} years as on ${currentYear}`;
			},
			severity: "Poor control",
			medications: ["Oral drugs (3 groups)", "Insulin therapy"],
			color: "text-red-600",
		},
		{
			id: 2,
			name: "Hypertension",
			diagnosisYear: 1989, // Diagnosed in 1989
			get duration() {
				const years = calculateYearsSince(this.diagnosisYear);
				const currentYear = new Date().getFullYear();
				return `since ${years} years as on ${currentYear}`;
			},
			severity: "Moderate control",
			medications: ["2 drug groups"],
			color: "text-yellow-600",
		},
		{
			id: 3,
			name: "Granuloma annulare",
			diagnosisYear: 2022, // Diagnosed in 2022
			get duration() {
				const years = calculateYearsSince(this.diagnosisYear);
				const currentYear = new Date().getFullYear();
				return `since ${years} years as on ${currentYear}`;
			},
			severity: "Stable",
			medications: ["Topical treatments"],
			color: "text-blue-600",
		},
	]);

	const [viewMode, setViewMode] = useState({
		hba1c: "chart",
	});

	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};

	const hba1cData = [
		{ date: "2023-01", value: 7.8 },
		{ date: "2023-04", value: 8.0 },
		{ date: "2023-07", value: 8.2 },
		{ date: "2023-10", value: 8.1 },
		{ date: "2024-01", value: 8.3 },
		{ date: "2024-04", value: 8.2 },
		{ date: "2024-07", value: 8.2 },
	];

	const targetGoals = [
		{
			metric: "HbA1c",
			target: 7.5,
			current: 8.2,
			achieved: false,
			percentage: 91,
			unit: "%",
		},
		{
			metric: "LDL",
			target: 70,
			current: 77,
			achieved: false,
			percentage: 91,
			unit: "mg/dl",
		},
		{
			metric: "BP Systolic",
			target: 130,
			current: 130,
			achieved: true,
			percentage: 100,
			unit: "mmHg",
		},
		{
			metric: "BP Diastolic",
			target: 80,
			current: 84,
			achieved: false,
			percentage: 95,
			unit: "mmHg",
		},
		{
			metric: "ASCVD Risk",
			target: 10,
			current: 15.2,
			achieved: false,
			percentage: 66,
			unit: "%",
		},
	];

	const organAssessment = [
		{
			organ: "Retinopathy",
			icon: Eye,
			status: "done-positive",
			color: "text-red-500",
			finding: "Moderate NPDR detected",
			value: "Requires laser therapy",
			lastDone: "October 2023",
			nextDue: "January 2025",
			recommendations:
				"Continue diabetes control, ophthalmology follow-up",
			tests: ["Fundus Photography", "OCT", "Fluorescein Angiography"],
			medications: ["Eye drops as prescribed"],
			referrals: ["Ophthalmology"],
		},
		{
			organ: "Nephropathy",
			icon: Kidney,
			status: "done-assessed",
			color: "text-green-500",
			finding: `eGFR ${Math.round(
				computeEgfr(1.2, patient.age, patient.sex)
			)} ml/min/1.73m²`,
			value: "Mild CKD Stage 2-3a",
			lastDone: "July 2024",
			nextDue: "January 2025",
			recommendations:
				"Monitor kidney function, ACE inhibitor optimization",
			tests: ["Serum Creatinine", "Urine ACR", "Potassium"],
			medications: ["Continue ACE inhibitor", "Monitor potassium"],
			referrals: ["Nephrology if progression"],
		},
		{
			organ: "IHD/HF",
			icon: Heart,
			status: "not-done",
			color: "text-orange-500",
			finding: "Pending assessment",
			value: "ECG, ECHO, stress test needed",
			lastDone: "Not assessed",
			nextDue: "Overdue - Schedule ASAP",
			recommendations:
				"⚠️ Assess for HF: BMI >30, obesity patients could have stage 1 HF without symptoms",
			tests: [
				"ECG",
				"ECHO",
				"NT Pro BNP",
				"Trop I",
				"TMT",
				"Angiogram",
				"CT calcium scores",
				"Lipid profile",
			],
			medications: [
				"Single/dual anti-platelet therapy",
				"Statin",
				"Beta blocker",
				"ACE i/ARBS/ARNI",
				"SGLT2 i",
				"MRA",
				"GLP-1 agonist",
			],
			referrals: ["Cardiology"],
			previousHistory: {
				nstemi: false,
				stemi: false,
				hfref: false,
				hfief: false,
				hfpef: false,
				pci: false,
				cabg: false,
			},
		},
		{
			organ: "CVA/Stroke",
			icon: Brain,
			status: "not-done",
			color: "text-orange-500",
			finding: "Status unknown",
			value: "Clinical assessment pending",
			lastDone: "Not assessed",
			nextDue: "February 2025",
			recommendations: "Screen for TIA symptoms, carotid assessment",
			tests: ["Carotid/vertebral Doppler"],
			medications: ["Statin", "SAPT/DAPT"],
			referrals: ["Neurology", "Physiotherapy", "PMR"],
		},
		{
			organ: "MASLD",
			icon: Activity,
			status: "not-done",
			color: "text-red-500",
			finding: "⚠️ BMI >30: FIB-4 assessment required",
			value: "Liver function test and ultrasound needed",
			lastDone: "Not assessed",
			nextDue: "Critical - Schedule ASAP",
			recommendations:
				"⚠️ If BMI >30, FIB 4 score must be assessed. Critical alert for LFT and CBC/platelet count",
			tests: [
				"FIB-4 Score (Age, AST, ALT, Platelet count)",
				"LFT",
				"CBC/Platelet count",
				"Ultrasound abdomen yearly",
			],
			medications: ["DAPA", "GLP-1 agonist (to be considered)"],
			referrals: ["Hepatology", "Dietician"],
			fibScore: {
				calculated: false,
				components: {
					age: 70,
					ast: null,
					alt: null,
					platelets: null,
				},
			},
		},
		{
			organ: "Diabetic Foot & Peripheral Assessment",
			icon: Activity,
			status: "done-assessed",
			color: "text-green-500",
			finding: "No ulcers, intact sensation, normal ABI",
			value: "Good foot care, no neuropathy/PVD",
			lastDone: "July 2024",
			nextDue: "July 2025",
			recommendations: "Continue foot care education, annual screening",
			pvd: {
				symptoms: "No intermittent claudication",
				tests: ["ABI Doppler - normal"],
				medications: ["Aspirin", "Statin"],
			},
			neuropathy: {
				domain: "None affected",
				tests: [
					"Vibration - normal",
					"Touch - normal",
					"Deep tendon reflex - normal",
				],
				painfulOrPainless: "No neuropathy",
				medications: [],
			},
			footSpecific: {
				symptoms: "No symptoms",
				footware: "Appropriate",
				tests: ["Vitamin B12"],
			},
			referrals: ["Annual podiatry check"],
		},
	];

	// View mode state for categorized health metrics
	const [healthMetricsView, setHealthMetricsView] = useState("summary"); // 'summary' or 'detailed'

	// Overview subtab state
	const [overviewSubTab, setOverviewSubTab] = useState("compact"); // 'detailed' or 'compact'

	// Ensure metrics show detailed info when in Detailed view
	useEffect(() => {
		if (overviewSubTab === "detailed") {
			setHealthMetricsView("detailed");
		}
	}, [overviewSubTab]);

	// Categorized Health Metrics as per MD specifications
	const serumCreatinineMgDl = 1.2; // latest creatinine
	const egfrValue = Math.round(
		computeEgfr(serumCreatinineMgDl, patient.age, patient.sex)
	);

	const healthMetricsCategories = {
		abc: {
			name: "ABC Metrics (Primary Targets)",
			color: "text-blue-700",
			metrics: [
				{
					name: "HbA1c",
					value: "8.2%",
					target: "<7.5%",
					status: "high", // high, medium, good
					color: "#ef4444", // red
					lastUpdate: "08/07/2024",
					lastVisitValue: "8.1%",
					lastVisitDate: "05/05/2024",
					trend: "up",
					prevValue: "8.1%",
				},
				{
					name: "BP Systolic",
					value: "130 mmHg",
					target: "<130 mmHg",
					status: "good",
					color: "#22c55e", // green
					lastUpdate: "10/07/2024",
					lastVisitValue: "140 mmHg",
					lastVisitDate: "01/06/2024",
					trend: "down",
					prevValue: "140 mmHg",
				},
				{
					name: "BP Diastolic",
					value: "84 mmHg",
					target: "<80 mmHg",
					status: "medium",
					color: "#eab308", // orange
					lastUpdate: "10/07/2024",
					lastVisitValue: "90 mmHg",
					lastVisitDate: "01/06/2024",
					trend: "down",
					prevValue: "90 mmHg",
				},
				{
					name: "LDL Cholesterol",
					value: "77 mg/dl",
					target: "<70 mg/dl",
					status: "medium",
					color: "#eab308", // orange
					lastUpdate: "03/05/2024",
					lastVisitValue: "82 mg/dl",
					lastVisitDate: "12/02/2024",
					trend: "stable",
					prevValue: "77 mg/dl",
				},
			],
		},
		others: {
			name: "Other Key Metrics",
			color: "text-purple-700",
			metrics: [
				{
					name: "Weight",
					value: "68 kg",
					target: "Target range",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Current",
					lastVisitValue: "66 kg",
					lastVisitDate: "02/06/2024",
					trend: "up",
					prevValue: "66 kg",
				},
				{
					name: "BMI",
					value: "27 (pre-obese)",
					target: "18.5-24.9",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Current",
					lastVisitValue: "25.8",
					lastVisitDate: "02/06/2024",
					trend: "up",
					prevValue: "25.8",
				},
				{
					name: "eGFR",
					value: `${egfrValue} ml/min/1.73m²`,
					target: ">90 ml/min/1.73m²",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Calculated",
					lastVisitValue: "72 ml/min/1.73m²",
					lastVisitDate: "20/03/2024",
					trend: "down",
					prevValue: "72 ml/min/1.73m²",
				},
				{
					name: "Serum Creatinine",
					value: `${serumCreatinineMgDl} mg/dl`,
					target: "<1.1 mg/dl",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Recent",
					lastVisitValue: "1.0 mg/dl",
					lastVisitDate: "20/03/2024",
					trend: "up",
					prevValue: "1.0 mg/dl",
				},
				{
					name: "Urine ACR",
					value: "45 mg/g",
					target: "<30 mg/g",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Recent",
					lastVisitValue: "32 mg/g",
					lastVisitDate: "20/03/2024",
					trend: "up",
					prevValue: "32 mg/g",
				},
				{
					name: "Hemoglobin",
					value: "11.2 g/dl",
					target: ">12 g/dl",
					status: "high",
					color: "#ef4444",
					lastUpdate: "Recent",
					lastVisitValue: "12.1 g/dl",
					lastVisitDate: "20/03/2024",
					trend: "down",
					prevValue: "12.1 g/dl",
				},
				{
					name: "Potassium (K⁺)",
					value: "4.8 mmol/L",
					target: "3.5–5.1 mmol/L",
					status: "good",
					color: "#22c55e",
					lastUpdate: "Recent",
					lastVisitValue: "4.7 mmol/L",
					lastVisitDate: "20/03/2024",
					trend: "stable",
					prevValue: "4.7 mmol/L",
				},
			],
		},
		scores: {
			name: "Clinical Scores & Risk Assessment",
			color: "text-orange-700",
			metrics: [
				{
					name: "ASCVD Risk",
					value: "15.2%",
					target: "<10%",
					status: "high",
					color: "#ef4444",
					lastUpdate: "Calculated",
					trend: "up",
					prevValue: "12.8%",
				},
				{
					name: "PHQ-9 (Depression)",
					value: "8 (Mild)",
					target: "<5",
					status: "high",
					color: "#ef4444",
					lastUpdate: "Recent",
					trend: "up",
					prevValue: "5",
				},
				{
					name: "GAD-7 (Anxiety)",
					value: "6 (Mild)",
					target: "<5",
					status: "medium",
					color: "#eab308",
					lastUpdate: "Recent",
					trend: "stable",
					prevValue: "6",
				},
			],
		},
	};

	// Get status color based on standardized system
	const getStatusColor = (status: string) => {
		switch (status) {
			case "good":
				return "#22c55e"; // Green
			case "medium":
				return "#eab308"; // Orange/Yellow
			case "high":
				return "#ef4444"; // Red
			default:
				return "#6b7280"; // Gray
		}
	};

	// Get trend icon
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case "up":
				return TrendingUp;
			case "down":
				return TrendingDown;
			case "stable":
				return Minus;
			default:
				return Minus;
		}
	};

	// Card color classes for metric risk status
	const getMetricCardClasses = (status: string) => {
		switch (status) {
			case "high":
				return "bg-red-50 text-red-900 border-red-200";
			case "medium":
				return "bg-amber-50 text-amber-900 border-amber-200";
			case "good":
				return "bg-green-50 text-green-900 border-green-200";
			default:
				return "bg-gray-50 text-gray-900 border-gray-200";
		}
	};

	// Map metric names to Lab Monitoring graph/subsection ids
	const getMetricSubtab = (metricName: string): string | undefined => {
		const n = metricName.toLowerCase();
		if (n.includes("hba1c")) return "hba1c";
		if (
			n.includes("bp") ||
			n.includes("systolic") ||
			n.includes("diastolic")
		)
			return "bp";
		if (n.includes("ldl") || n.includes("lipid")) return "lipids";
		if (n.includes("ascvd")) return "ascvd";
		if (n.includes("egfr")) return "egfr";
		if (n.includes("creatinine")) return "creatinine";
		if (n.includes("acr")) return "acr";
		if (n.includes("potassium") || n.includes("k⁺") || n.includes("k+"))
			return "potassium";
		if (n.includes("hemoglobin")) return "hemoglobin";
		if (n.includes("fbs")) return "fbs";
		if (n.includes("ppbs")) return "ppbs";
		// fallback to top of longitudinal tracker
		return "longitudinal";
	};

	// Medication data with dosing frequency
	const medicationCategories = [
		{
			condition: "Diabetes",
			color: "text-blue-600",
			medications: [
				{
					name: "Inj Novomix Penfill",
					dose: "20-22/16-18 units",
					frequency: "Twice daily",
					timing: "10 min before meals",
					status: "Active",
					trend: "up",
				},
				{
					name: "Tab Metformin + Glimepiride",
					dose: "500mg/2mg",
					frequency: "Twice daily",
					timing: "After food",
					status: "Active",
					trend: "up",
				},
				{
					name: "Tab Sitagliptin + Dapagliflozin",
					dose: "100mg/10mg",
					frequency: "Once daily",
					timing: "Before food, 30 min",
					status: "New",
					trend: "new",
				},
				{
					name: "Tab Voglibose",
					dose: "0.2mg",
					frequency: "Thrice daily",
					timing: "With food",
					status: "Active",
					trend: "stable",
				},
			],
		},
		{
			condition: "Hypertension",
			color: "text-purple-600",
			medications: [
				{
					name: "Tab Losartan + Amlodipine",
					dose: "50mg/5mg",
					frequency: "Once daily",
					timing: "After food",
					status: "Active",
					trend: "down",
				},
			],
		},
		{
			condition: "Cardioprotective",
			color: "text-orange-600",
			medications: [
				{
					name: "Tab Aspirin + Atorvastatin",
					dose: "75mg/10mg",
					frequency: "Once daily",
					timing: "After food",
					status: "Active",
					trend: "stable",
				},
			],
		},
		{
			condition: "Others",
			color: "text-gray-600",
			medications: [
				{
					name: "Tab Apremilast",
					dose: "10mg",
					frequency: "Previously twice daily",
					timing: "(ineffective)",
					status: "Stopped",
					trend: "stopped",
				},
				{
					name: "Cap Becosules (B-complex)",
					dose: "1 cap",
					frequency: "Once daily",
					timing: "After food",
					status: "Active",
					trend: "stable",
				},
				{
					name: "Oint Tacrolimus",
					dose: "0.1%",
					frequency: "Alternate days",
					timing: "Topical application",
					status: "Active",
					trend: "stable",
				},
				{
					name: "Oint Mometasone furoate",
					dose: "1mg",
					frequency: "Alternate days",
					timing: "Topical application",
					status: "Active",
					trend: "stable",
				},
			],
		},
	];

	const addDiagnosis = () => {
		const newDiagnosis = {
			id: diagnoses.length + 1,
			name: "New Diagnosis",
			diagnosisYear: new Date().getFullYear(),
			duration: "Recent",
			severity: "Under evaluation",
			medications: [],
			color: "text-gray-600",
		};
		setDiagnoses([...diagnoses, newDiagnosis]);
	};

	const removeDiagnosis = (id: number) => {
		setDiagnoses(diagnoses.filter((d) => d.id !== id));
	};

	const getValueColor = (
		value: number,
		target: number,
		isHigherBetter = false
	) => {
		if (isHigherBetter) {
			return value >= target
				? "#22c55e"
				: value >= target * 0.8
				? "#eab308"
				: "#ef4444";
		} else {
			return value <= target
				? "#22c55e"
				: value <= target * 1.2
				? "#eab308"
				: "#ef4444";
		}
	};

	// Helper function to get medication category colors
	const getMedicationCategoryColor = (medicationType: string) => {
		switch (medicationType) {
			case "diabetes":
				return "bg-blue-500 text-white";
			case "hypertension":
				return "bg-purple-500 text-white";
			case "cardioprotective":
				return "bg-orange-500 text-white";
			case "blood-thinner":
				return "bg-red-500 text-white";
			case "cholesterol":
				return "bg-yellow-500 text-white";
			case "topical":
				return "bg-pink-500 text-white";
			case "vitamin":
				return "bg-green-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	// Frequency symbol builder for Integrated Prescription (e.g., 1-0-1↑)
	const getFrequencySymbol = (frequency: string, trend: string) => {
		const base = (() => {
			const f = frequency.toLowerCase();
			if (f.includes("thrice")) return "1-1-1";
			if (f.includes("twice")) return "1-0-1";
			if (f.includes("once")) return "1-0-0";
			if (f.includes("alternate")) return "alt";
			if (f.includes("previously")) return "1-0-1";
			return "—";
		})();
		const suffix = (() => {
			switch (trend) {
				case "up":
					return "↑";
				case "down":
					return "↓";
				case "stable":
					return "";
				case "new":
					return "↑";
				case "stopped":
					return "×";
				default:
					return "";
			}
		})();
		return `${base}${suffix}`;
	};

	// Compact View Render Function
	const renderCompactView = () => (
		<div className="space-y-4">
			{/* Patient Info Card */}
			<Card className="bg-white shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl flex items-center">
						<User className="mr-2 h-6 w-6 text-navy-600" />
						Mr X
					</CardTitle>
					<CardDescription className="text-lg">
						70 years old | Male | OP: 12345, IP: 23456 | HbA1c
						poorly controlled, on insulin
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Complaints & Vitals - Compact (before Critical Alerts) */}
			<Card className="bg-white shadow-md">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<Stethoscope className="mr-2 h-4 w-4" /> Complaints &
						Vitals
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<div className="text-sm font-semibold text-gray-700 mb-1">
								Complaints
							</div>
							<ul className="text-sm space-y-1 list-disc list-inside">
								{complaints.slice(0, 3).map((c) => (
									<li key={c.id}>
										{c.complaint} ({c.duration})
									</li>
								))}
							</ul>
						</div>
						<div>
							<div className="text-sm font-semibold text-gray-700 mb-1">
								Vitals
							</div>
							<div className="grid grid-cols-2 gap-2 text-sm">
								<div className="p-2 border rounded">
									BP:{" "}
									<span className="font-semibold text-green-600">
										130/84
									</span>
								</div>
								<div className="p-2 border rounded">
									Weight:{" "}
									<span className="font-semibold">68 kg</span>
								</div>
								<div className="p-2 border rounded">
									BMI:{" "}
									<span className="font-semibold">27</span>
								</div>
								<div className="p-2 border rounded">
									Creatinine:{" "}
									<span className="font-semibold text-orange-600">
										{serumCreatinineMgDl} mg/dl
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Critical Alerts - Compact */}
			<Card className="bg-red-50 shadow-md">
				<CardHeader>
					<CardTitle className="text-xl text-red-700 flex items-center">
						<AlertTriangle className="mr-2 h-5 w-5" />
						Critical Alerts (6)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
						<button
							onClick={() =>
								onNavigate("lab-monitoring", "hba1c")
							}
							className="flex items-center justify-between text-red-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<AlertTriangle className="h-3 w-3 mr-1" />{" "}
								HbA1c: 8.2% (target &lt;7.5%)
							</span>
							<Badge className="bg-red-100 text-red-800 text-[10px]">
								Critical
							</Badge>
						</button>
						<button
							onClick={() =>
								onNavigate("lab-monitoring", "ascvd")
							}
							className="flex items-center justify-between text-red-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<AlertTriangle className="h-3 w-3 mr-1" /> ASCVD
								risk: 15.2% (target &lt;10%)
							</span>
							<Badge className="bg-amber-100 text-amber-800 text-[10px]">
								High
							</Badge>
						</button>
						<button
							onClick={() =>
								onNavigate("lab-monitoring", "creatinine")
							}
							className="flex items-center justify-between text-orange-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<AlertTriangle className="h-3 w-3 mr-1" />{" "}
								Creatinine: {serumCreatinineMgDl} mg/dl
							</span>
							<Badge className="bg-yellow-100 text-yellow-800 text-[10px]">
								Moderate
							</Badge>
						</button>
						<button
							onClick={() => onNavigate("lab-monitoring", "acr")}
							className="flex items-center justify-between text-orange-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<AlertTriangle className="h-3 w-3 mr-1" /> Urine
								ACR: 45 mg/g
							</span>
							<Badge className="bg-yellow-100 text-yellow-800 text-[10px]">
								Moderate
							</Badge>
						</button>
						<button
							onClick={() =>
								onNavigate("assessment", "retinopathy")
							}
							className="flex items-center justify-between text-red-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<Eye className="h-3 w-3 mr-1" /> Ophthalmology
								overdue
							</span>
							<Badge className="bg-amber-100 text-amber-800 text-[10px]">
								High
							</Badge>
						</button>
						<button
							onClick={() => onNavigate("lab-monitoring")}
							className="flex items-center justify-between text-yellow-600 text-left border rounded px-2 py-1 bg-white/40 hover:bg-white">
							<span className="flex items-center">
								<Activity className="h-3 w-3 mr-1" />{" "}
								Hemoglobin: 11.2 g/dl
							</span>
							<Badge className="bg-green-100 text-green-800 text-[10px]">
								Low
							</Badge>
						</button>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* ABC Metrics (clickable to Lab Monitoring graphs) */}
				<Card className="bg-white shadow-md">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg text-blue-600 flex items-center">
							<Heart className="mr-2 h-4 w-4" />
							ABC Metrics
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("lab-monitoring", "hba1c")
								}>
								<span className="text-sm">HbA1c:</span>
								<span className="font-semibold text-red-600">
									8.2%
								</span>
							</div>
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("lab-monitoring", "bp")
								}>
								<span className="text-sm">BP:</span>
								<span className="font-semibold text-green-600">
									130/84
								</span>
							</div>
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("lab-monitoring", "ldl")
								}>
								<span className="text-sm">LDL:</span>
								<span className="font-semibold text-orange-600">
									77 mg/dl
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Key Organ Status (clickable) */}
				<Card className="bg-white shadow-md">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg text-purple-600 flex items-center">
							<Stethoscope className="mr-2 h-4 w-4" />
							Organ Assessment
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("assessment", "retinopathy")
								}>
								<span className="text-sm">Retinopathy:</span>
								<Badge className="bg-red-100 text-red-800 text-xs">
									Moderate NPDR
								</Badge>
							</div>
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("assessment", "nephropathy")
								}>
								<span className="text-sm">Nephropathy:</span>
								<Badge className="bg-green-100 text-green-800 text-xs">
									Stage 2-3a CKD
								</Badge>
							</div>
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() =>
									onNavigate("assessment", "cardiac")
								}>
								<span className="text-sm">Cardiac:</span>
								<Badge className="bg-orange-100 text-orange-800 text-xs">
									Pending
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Current Medications Summary */}
				<Card className="bg-white shadow-md">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg text-green-600 flex items-center">
							<Pill className="mr-2 h-4 w-4" />
							Active Medications
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1 text-sm">
							<div>• Insulin (Novomix) - twice daily</div>
							<div>• Metformin + Glimepiride</div>
							<div>• Sitagliptin + Dapagliflozin (NEW)</div>
							<div>• Losartan + Amlodipine</div>
							<div>• Aspirin + Atorvastatin</div>
							<div className="text-xs text-gray-500 mt-2">
								+ 4 others
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Action Items */}
			<Card className="bg-yellow-50 border-yellow-200 shadow-md">
				<CardHeader>
					<CardTitle className="text-lg text-yellow-700 flex items-center">
						<AlertTriangle className="mr-2 h-4 w-4" />
						Immediate Action Items
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="space-y-2">
							<h5 className="font-semibold text-yellow-700">
								Clinical Priority:
							</h5>
							<ul className="space-y-1 text-sm">
								<li>
									• Schedule ophthalmology review (URGENT)
								</li>
								<li>
									• Consider diabetes medication
									intensification
								</li>
								<li>• Monitor kidney function closely</li>
							</ul>
						</div>
						<div className="space-y-2">
							<h5 className="font-semibold text-yellow-700">
								Treatment Education (from Active Medications):
							</h5>
							<ul className="space-y-1 text-sm">
								<li>• Improve SMBG adherence (2-3x daily)</li>
								<li>• Continue BP home monitoring</li>
								<li>
									• Lifestyle counseling for HbA1c control
								</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Provisional Diagnoses (summarized + linked to Assessment subtabs) */}
			<Card className="bg-white shadow-md">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg text-navy-600 flex items-center">
						<FileText className="mr-2 h-4 w-4" /> Provisional
						Diagnoses
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{/* Core comorbidities from diagnosis list */}
						{diagnoses
							.filter((d) =>
								["diabetes", "hypertension"].includes(
									d.name.toLowerCase()
								)
							)
							.map((d) => (
								<button
									key={d.id}
									onClick={() =>
										onNavigate(
											"assessment",
											getAssessmentSubtab(d.name)
										)
									}
									className="text-left p-3 border rounded hover:bg-gray-50 transition-all">
									<div className="font-semibold">
										{d.name}
									</div>
									<div className="text-xs text-gray-600">
										{d.duration}
									</div>
									<div className="text-xs text-gray-500">
										Control: {d.severity}
									</div>
								</button>
							))}

						{/* Complications from organ assessment summary */}
						{organAssessment.map((o, idx) => {
							const IconC = o.icon as any;
							return (
								<button
									key={`org-${idx}`}
									onClick={() =>
										onNavigate(
											"assessment",
											getAssessmentSubtab(o.organ)
										)
									}
									className="flex items-start space-x-2 p-3 border rounded hover:bg-gray-50 transition-all text-left">
									<IconC
										className={`h-5 w-5 ${o.color} mt-0.5`}
									/>
									<div className="flex-1">
										<div className="font-medium">
											{o.organ}
										</div>
										<div className="text-xs text-gray-700 truncate">
											{o.finding}
										</div>
										{o.value && (
											<div className="text-[11px] text-blue-700">
												{o.value}
											</div>
										)}
										{o.nextDue && (
											<div className="text-[11px] text-gray-500">
												Next: {o.nextDue}
											</div>
										)}
									</div>
								</button>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Quick Navigation */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<Button
					onClick={() => onNavigate("medications")}
					variant="outline"
					className="h-16 flex flex-col space-y-1">
					<Pill className="h-5 w-5" />
					<span className="text-xs">Medications</span>
				</Button>
				<Button
					onClick={() => onNavigate("lab-monitoring")}
					variant="outline"
					className="h-16 flex flex-col space-y-1">
					<FlaskConical className="h-5 w-5" />
					<span className="text-xs">Lab Results</span>
				</Button>
				<Button
					onClick={() => onNavigate("assessment", "complications")}
					variant="outline"
					className="h-16 flex flex-col space-y-1">
					<Stethoscope className="h-5 w-5" />
					<span className="text-xs">Assessments</span>
				</Button>
				<Button
					onClick={() => onNavigate("lifestyle")}
					variant="outline"
					className="h-16 flex flex-col space-y-1">
					<Activity className="h-5 w-5" />
					<span className="text-xs">Lifestyle</span>
				</Button>
			</div>
		</div>
	);

	return (
		<div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
				<h1 className="text-2xl sm:text-3xl font-bold text-navy-600">
					Patient Overview
				</h1>
			</div>

			{/* Overview Subtab Navigation */}
			<div className="mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						<button
							onClick={() => setOverviewSubTab("compact")}
							className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
								overviewSubTab === "compact"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							Compact View
						</button>
						<button
							onClick={() => setOverviewSubTab("detailed")}
							className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
								overviewSubTab === "detailed"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							Detailed View
						</button>
					</nav>
				</div>
			</div>

			{/* Conditional Content Rendering */}
			{overviewSubTab === "compact" ? (
				renderCompactView()
			) : (
				<>
					<Card className="mb-6 bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-2xl flex items-center">
								<User className="mr-2 h-6 w-6 text-navy-600" />
								Mr X
							</CardTitle>
							<CardDescription className="text-lg">
								70 years old | Male | OP: 12345, IP: 23456 |
								HbA1c poorly controlled, on insulin
							</CardDescription>
						</CardHeader>
					</Card>

					{/* Chief Complaints Section */}
					<Card className="mb-6 bg-white shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Chief Complaints
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
									<Select>
										<SelectTrigger className="w-full sm:w-64">
											<SelectValue placeholder="Select from WhatsApp complaints" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="fatigue">
												Fatigue
											</SelectItem>
											<SelectItem value="thirst">
												Increased thirst
											</SelectItem>
											<SelectItem value="urination">
												Frequent urination
											</SelectItem>
											<SelectItem value="vision">
												Blurred vision
											</SelectItem>
											<SelectItem value="numbness">
												Numbness in feet
											</SelectItem>
										</SelectContent>
									</Select>
									<Button>Add Complaint</Button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											Complaint
										</Label>
										<Input
											placeholder="Enter complaint"
											value={newComplaint}
											onChange={(e) =>
												setNewComplaint(e.target.value)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											Duration
										</Label>
										<Select
											value={complaintDuration}
											onValueChange={
												setComplaintDuration
											}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select duration" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="few-days">
													Few days
												</SelectItem>
												<SelectItem value="1-week">
													1 week
												</SelectItem>
												<SelectItem value="2-weeks">
													2 weeks
												</SelectItem>
												<SelectItem value="1-month">
													1 month
												</SelectItem>
												<SelectItem value="3-months">
													3 months
												</SelectItem>
												<SelectItem value="6-months">
													6+ months
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											Location
										</Label>
										<Input
											placeholder="Enter location"
											value={complaintLocation}
											onChange={(e) =>
												setComplaintLocation(
													e.target.value
												)
											}
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium">
											Intensity
										</Label>
										<Select
											value={complaintIntensity}
											onValueChange={
												setComplaintIntensity
											}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select intensity" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="mild">
													Mild (1-3)
												</SelectItem>
												<SelectItem value="moderate">
													Moderate (4-6)
												</SelectItem>
												<SelectItem value="severe">
													Severe (7-10)
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="flex justify-end mt-4">
									<Button
										onClick={() => {
											if (newComplaint.trim()) {
												const newComplaintObj = {
													id: complaints.length + 1,
													complaint: newComplaint,
													duration:
														complaintDuration ||
														"Not specified",
													location:
														complaintLocation ||
														"Not specified",
													intensity:
														complaintIntensity ||
														"Not specified",
												};
												setComplaints([
													...complaints,
													newComplaintObj,
												]);
												setNewComplaint("");
												setComplaintDuration("");
												setComplaintLocation("");
												setComplaintIntensity("");
											}
										}}
										disabled={!newComplaint.trim()}>
										Add Complaint
									</Button>
								</div>
								<div className="mt-6">
									<h4 className="text-sm font-semibold text-gray-700 mb-3">
										Current Complaints:
									</h4>
									<div className="space-y-3">
										{complaints.map((item) => (
											<div
												key={item.id}
												className="border rounded-lg p-3 bg-gray-50">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="font-medium text-gray-900">
															{item.complaint}
														</div>
														<div className="grid grid-cols-3 gap-4 mt-2 text-xs text-gray-600">
															<div>
																<span className="font-medium">
																	Duration:
																</span>{" "}
																{item.duration}
															</div>
															<div>
																<span className="font-medium">
																	Location:
																</span>{" "}
																{item.location}
															</div>
															<div>
																<span className="font-medium">
																	Intensity:
																</span>{" "}
																{item.intensity}
															</div>
														</div>
													</div>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															setComplaints(
																complaints.filter(
																	(c) =>
																		c.id !==
																		item.id
																)
															)
														}>
														<X className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
						<Card className="bg-red-50 shadow-md">
							<CardHeader>
								<CardTitle className="text-xl text-red-700 flex items-center">
									<AlertTriangle className="mr-2 h-5 w-5" />
									Critical Alerts
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-red-700">
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate("assessment", "overview")
										}>
										<span className="flex items-start">
											<AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												HbA1c critically elevated (8.2%
												vs target &lt;7.5%) - Consider
												intensifying diabetes management
											</span>
										</span>
										<Badge className="bg-red-100 text-red-800 text-[10px]">
											Critical
										</Badge>
									</li>
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate("assessment", "cardiac")
										}>
										<span className="flex items-start">
											<AlertTriangle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												ASCVD risk high (15.2% vs target
												&lt;10%) - Review cardiovascular
												protection strategy
											</span>
										</span>
										<Badge className="bg-amber-100 text-amber-800 text-[10px]">
											High
										</Badge>
									</li>
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate(
												"assessment",
												"nephropathy"
											)
										}>
										<span className="flex items-start">
											<AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Serum creatinine elevated (
												{serumCreatinineMgDl} mg/dl) -
												Monitor kidney function closely
											</span>
										</span>
										<Badge className="bg-yellow-100 text-yellow-800 text-[10px]">
											Moderate
										</Badge>
									</li>
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate(
												"assessment",
												"nephropathy"
											)
										}>
										<span className="flex items-start">
											<AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Urine ACR elevated (45 mg/g) -
												Assess for diabetic nephropathy
												progression
											</span>
										</span>
										<Badge className="bg-yellow-100 text-yellow-800 text-[10px]">
											Moderate
										</Badge>
									</li>
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate(
												"assessment",
												"retinopathy"
											)
										}>
										<span className="flex items-start">
											<Eye className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Ophthalmology review overdue
												(last check: October 2023) -
												Schedule urgent review
											</span>
										</span>
										<Badge className="bg-amber-100 text-amber-800 text-[10px]">
											High
										</Badge>
									</li>
									<li
										className="flex items-start justify-between cursor-pointer p-2 rounded hover:bg-white/50"
										onClick={() =>
											onNavigate("lab-monitoring")
										}>
										<span className="flex items-start">
											<Activity className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
											<span>
												Hemoglobin low (11.2 g/dl) -
												Investigate anemia cause and
												treat
											</span>
										</span>
										<Badge className="bg-green-100 text-green-800 text-[10px]">
											Low
										</Badge>
									</li>
									<li className="flex items-start">
										<Stethoscope className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
										<span>
											Vaccinations due: Pneumococcal and
											Influenza - Schedule immunizations
										</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						{/* Drug Allergies/Intolerance - Moved beside Critical Alerts */}
						<Card className="bg-orange-50 border-orange-200 shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-orange-700 flex items-center">
									<AlertTriangle className="mr-2 h-5 w-5" />
									Drug Allergies/Intolerance
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<p className="text-green-600">
										No known drug allergies
									</p>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline">
												Add Allergy/Intolerance
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Add Drug Allergy/Intolerance
												</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label>Drug Name</Label>
													<Input placeholder="Enter drug name" />
												</div>
												<div>
													<Label>Reaction Type</Label>
													<Select>
														<SelectTrigger>
															<SelectValue placeholder="Select reaction type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="allergy">
																Allergy
															</SelectItem>
															<SelectItem value="intolerance">
																Intolerance
															</SelectItem>
															<SelectItem value="adverse-reaction">
																Adverse Reaction
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div>
													<Label>Description</Label>
													<Textarea placeholder="Describe the reaction..." />
												</div>
												<Button className="w-full">
													Add Allergy
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="flex flex-col gap-6 mb-6 w-full">
						{/* Enhanced Diagnosis Section */}
						<Card className="bg-white shadow-md">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
									Diagnosis Summary
									<div className="space-x-2">
										{!editingDiagnosis ? (
											<Button
												size="sm"
												variant="outline"
												onClick={startEditDiagnoses}>
												<Edit className="h-4 w-4" />
											</Button>
										) : (
											<>
												<Button
													size="sm"
													variant="default"
													onClick={saveDiagnoses}>
													Save
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={cancelDiagnoses}>
													Cancel
												</Button>
											</>
										)}
									</div>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{!editingDiagnosis &&
										diagnoses.map((diagnosis) => (
											<div
												key={diagnosis.id}
												className="p-3 border rounded-lg">
												<div className="flex items-center justify-between mb-2">
													<span
														onClick={() => {
															const name =
																diagnosis.name.toLowerCase();
															if (
																name.includes(
																	"diabetes"
																)
															)
																return onNavigate(
																	"assessment",
																	"overview"
																);
															if (
																name.includes(
																	"hypertension"
																)
															)
																return onNavigate(
																	"assessment",
																	"cardiac"
																);
															if (
																name.includes(
																	"neph"
																)
															)
																return onNavigate(
																	"assessment",
																	"nephropathy"
																);
															if (
																name.includes(
																	"retin"
																)
															)
																return onNavigate(
																	"assessment",
																	"retinopathy"
																);
															return onNavigate(
																"assessment",
																"complications"
															);
														}}
														className={`${diagnosis.color} font-semibold cursor-pointer underline underline-offset-2`}>
														{diagnosis.name} (
														{diagnosis.duration})
													</span>
												</div>
												<div className="text-sm space-y-1">
													{diagnosis.medications.map(
														(med, idx) => (
															<div
																key={idx}
																className="flex items-center space-x-2">
																<Checkbox
																	checked
																/>
																<span
																	className={
																		med.includes(
																			"3 groups"
																		)
																			? "cursor-pointer underline text-blue-600"
																			: ""
																	}
																	onClick={() =>
																		med.includes(
																			"3 groups"
																		) &&
																		setShowDrugDetails(
																			true
																		)
																	}>
																	{med}
																</span>
															</div>
														)
													)}
													<p className="text-xs text-gray-500">
														Control:{" "}
														{diagnosis.severity}
													</p>
												</div>
											</div>
										))}

									{editingDiagnosis &&
										draftDiagnoses.map((d, idx) => (
											<div
												key={d.id}
												className="p-3 border rounded-lg space-y-2">
												<div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
													<div>
														<Label>Name</Label>
														<Input
															value={d.name}
															onChange={(e) =>
																setDraftDiagnoses(
																	(prev) =>
																		prev.map(
																			(
																				x,
																				i
																			) =>
																				i ===
																				idx
																					? {
																							...x,
																							name: e
																								.target
																								.value,
																					  }
																					: x
																		)
																)
															}
														/>
													</div>
													<div>
														<Label>Year</Label>
														<Input
															type="number"
															value={
																d.diagnosisYear
															}
															onChange={(e) =>
																setDraftDiagnoses(
																	(prev) =>
																		prev.map(
																			(
																				x,
																				i
																			) =>
																				i ===
																				idx
																					? {
																							...x,
																							diagnosisYear:
																								e
																									.target
																									.value,
																					  }
																					: x
																		)
																)
															}
														/>
													</div>
													<div>
														<Label>
															Control/Severity
														</Label>
														<Input
															value={d.severity}
															onChange={(e) =>
																setDraftDiagnoses(
																	(prev) =>
																		prev.map(
																			(
																				x,
																				i
																			) =>
																				i ===
																				idx
																					? {
																							...x,
																							severity:
																								e
																									.target
																									.value,
																					  }
																					: x
																		)
																)
															}
														/>
													</div>
													<div>
														<Label>Color</Label>
														<Select
															onValueChange={(
																val
															) =>
																setDraftDiagnoses(
																	(prev) =>
																		prev.map(
																			(
																				x,
																				i
																			) =>
																				i ===
																				idx
																					? {
																							...x,
																							color: val,
																					  }
																					: x
																		)
																)
															}>
															<SelectTrigger>
																<SelectValue placeholder="Select color" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="text-red-600">
																	Red
																</SelectItem>
																<SelectItem value="text-yellow-600">
																	Yellow
																</SelectItem>
																<SelectItem value="text-blue-600">
																	Blue
																</SelectItem>
																<SelectItem value="text-green-600">
																	Green
																</SelectItem>
																<SelectItem value="text-gray-600">
																	Gray
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
												<div>
													<Label>
														Medications
														(comma-separated)
													</Label>
													<Textarea
														value={
															d.medicationsString
														}
														onChange={(e) =>
															setDraftDiagnoses(
																(prev) =>
																	prev.map(
																		(
																			x,
																			i
																		) =>
																			i ===
																			idx
																				? {
																						...x,
																						medicationsString:
																							e
																								.target
																								.value,
																				  }
																				: x
																	)
															)
														}
													/>
												</div>
												<div className="flex justify-end">
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															setDraftDiagnoses(
																(prev) =>
																	prev.filter(
																		(
																			_,
																			i
																		) =>
																			i !==
																			idx
																	)
															)
														}>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										))}

									{editingDiagnosis && (
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												setDraftDiagnoses((prev) => [
													...prev,
													{
														id:
															(prev[
																prev.length - 1
															]?.id || 0) + 1,
														name: "New Diagnosis",
														diagnosisYear:
															new Date().getFullYear(),
														severity:
															"Under evaluation",
														color: "text-gray-600",
														medicationsString: "",
													},
												])
											}
											className="w-full bg-transparent">
											<Plus className="h-4 w-4 mr-2" />{" "}
											Add Diagnosis
										</Button>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Drug Details Dialog */}
						<Dialog
							open={showDrugDetails}
							onOpenChange={setShowDrugDetails}>
							<DialogContent className="max-w-md">
								<DialogHeader>
									<DialogTitle>
										Diabetes Oral Drug Groups
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-3">
									<div className="p-3 border rounded-lg">
										<h4 className="font-semibold text-blue-600">
											Group 1: Biguanides
										</h4>
										<p className="text-sm text-gray-600">
											Metformin 500mg/2mg - Reduces
											glucose production
										</p>
									</div>
									<div className="p-3 border rounded-lg">
										<h4 className="font-semibold text-green-600">
											Group 2: Sulfonylureas
										</h4>
										<p className="text-sm text-gray-600">
											Glimepiride - Stimulates insulin
											secretion
										</p>
									</div>
									<div className="p-3 border rounded-lg">
										<h4 className="font-semibold text-purple-600">
											Group 3: Alpha-glucosidase
											inhibitors
										</h4>
										<p className="text-sm text-gray-600">
											Voglibose 0.2mg - Delays
											carbohydrate absorption
										</p>
									</div>
									<div className="p-3 border rounded-lg">
										<h4 className="font-semibold text-orange-600">
											Group 4: DPP-4 + SGLT2 (New
											Addition)
										</h4>
										<p className="text-sm text-gray-600">
											Sitagliptin + Dapagliflozin - Dual
											mechanism
										</p>
									</div>
								</div>
								<Button
									onClick={() => setShowDrugDetails(false)}
									className="w-full mt-4">
									Close
								</Button>
							</DialogContent>
						</Dialog>

						{/* Categorized Health Metrics with Summary/Detailed View */}
						<Card className="bg-white shadow-md col-span-2">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
									Categorized Health Metrics
									<div className="flex items-center space-x-2">
										<Toggle
											pressed={
												healthMetricsView === "detailed"
											}
											onPressedChange={() =>
												setHealthMetricsView(
													healthMetricsView ===
														"summary"
														? "detailed"
														: "summary"
												)
											}
											aria-label="Toggle health metrics view"
											size="sm">
											{healthMetricsView === "summary"
												? "Detailed"
												: "Summary"}
										</Toggle>
									</div>
								</CardTitle>
								<CardDescription>
									Color coding:{" "}
									<span className="text-green-600 font-medium">
										Green (Good)
									</span>
									,{" "}
									<span className="text-yellow-600 font-medium">
										Orange (Caution)
									</span>
									,{" "}
									<span className="text-red-600 font-medium">
										Red (Action Needed)
									</span>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{Object.entries(
										healthMetricsCategories
									).map(([categoryKey, category]) => (
										<div
											key={categoryKey}
											className="space-y-3">
											<h4
												className={`font-semibold ${category.color} text-lg flex items-center`}>
												{categoryKey === "abc" && (
													<Heart className="h-5 w-5 mr-2" />
												)}
												{categoryKey === "others" && (
													<Activity className="h-5 w-5 mr-2" />
												)}
												{categoryKey === "scores" && (
													<BarChart3 className="h-5 w-5 mr-2" />
												)}
												{category.name}
											</h4>
											{healthMetricsView === "summary" ? (
												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
													{category.metrics.map(
														(metric, index) => {
															const TrendIcon =
																getTrendIcon(
																	metric.trend
																);
															const subtab =
																getMetricSubtab(
																	metric.name
																);
															return (
																<button
																	type="button"
																	onClick={() =>
																		onNavigate(
																			"lab-monitoring",
																			subtab
																		)
																	}
																	key={index}
																	className={`block w-full h-full text-left flex items-center justify-between p-2 border rounded-lg ${getMetricCardClasses(
																		metric.status
																	)} cursor-pointer hover:shadow-md transition-shadow min-h-[84px]`}>
																	<div className="flex-1">
																		<span className="font-semibold">
																			{
																				metric.name
																			}
																		</span>
																		<div className="text-sm font-bold">
																			{
																				metric.value
																			}
																		</div>
																	</div>
																	<div className="flex items-center space-x-1 text-current">
																		<TrendIcon className="h-3 w-3" />
																	</div>
																</button>
															);
														}
													)}
												</div>
											) : (
												<div className="grid grid-cols-1 gap-2 items-stretch">
													{category.metrics.map(
														(metric, index) => {
															const TrendIcon =
																getTrendIcon(
																	metric.trend
																);
															const subtab =
																getMetricSubtab(
																	metric.name
																);
															return (
																<button
																	type="button"
																	onClick={() =>
																		onNavigate(
																			"lab-monitoring",
																			subtab
																		)
																	}
																	key={index}
																	className={`block w-full h-full text-left flex items-center justify-between p-3 border rounded-lg ${getMetricCardClasses(
																		metric.status
																	)} cursor-pointer hover:shadow-md transition-shadow min-h-[96px]`}>
																	<div className="flex-1">
																		<div className="flex items-center justify-between mb-1">
																			<span className="font-semibold">
																				{
																					metric.name
																				}
																			</span>
																			<div className="flex items-center space-x-2 text-current">
																				<TrendIcon className="h-4 w-4" />
																				<span className="text-xs opacity-80">
																					vs{" "}
																					{
																						metric.prevValue
																					}
																				</span>
																			</div>
																		</div>
																		<div className="text-sm font-bold mb-1">
																			{
																				metric.value
																			}{" "}
																			(
																			{
																				metric.lastUpdate
																			}
																			)
																		</div>
																		{metric.lastVisitValue && (
																			<div className="text-xs opacity-80 mb-1">
																				Last
																				visit:{" "}
																				{
																					metric.lastVisitValue
																				}{" "}
																				(
																				{
																					metric.lastVisitDate
																				}

																				)
																			</div>
																		)}
																		<div className="text-xs opacity-80">
																			Target:{" "}
																			{
																				metric.target
																			}
																		</div>
																	</div>
																</button>
															);
														}
													)}
												</div>
											)}
										</div>
									))}
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											className="mt-4 w-full bg-transparent"
											variant="outline">
											Edit Metrics
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>
												Edit Health Metrics
											</DialogTitle>
										</DialogHeader>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<Label>Weight (kg)</Label>
												<Input defaultValue="68" />
											</div>
											<div>
												<Label>Height (cm)</Label>
												<Input defaultValue="165" />
											</div>
											<div>
												<Label>Systolic BP</Label>
												<Input defaultValue="130" />
											</div>
											<div>
												<Label>Diastolic BP</Label>
												<Input defaultValue="84" />
											</div>
											<div>
												<Label>HbA1c (%)</Label>
												<Input defaultValue="8.2" />
											</div>
											<div>
												<Label>LDL (mg/dl)</Label>
												<Input defaultValue="77" />
											</div>
										</div>
										<Button className="w-full">
											Save Changes
										</Button>
									</DialogContent>
								</Dialog>
							</CardContent>
						</Card>
					</div>

					<div className="w-full border-t border-gray-200 pt-4 gap-[5%]">
						{/* Current Medications - Optimized Layout */}
						<Card
							onClick={() => onNavigate("medications")}
							className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow">
							<CardHeader className="pb-3">
								<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
									Current Medications (Integrated
									Prescription)
									<ArrowRight className="h-4 w-4" />
								</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								{/* Compact Table Layout */}
								<div className="overflow-hidden rounded-lg border border-gray-200">
									<table className="w-full text-sm">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-3 py-2 text-left font-medium text-gray-900 w-1/4">
													Condition
												</th>
												<th className="px-3 py-2 text-left font-medium text-gray-900 w-1/2">
													Medication & Dosage
												</th>
												<th className="px-3 py-2 text-left font-medium text-gray-900 w-1/6">
													Frequency
												</th>
												<th className="px-3 py-2 text-left font-medium text-gray-900 w-1/6">
													Status
												</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{/* Diabetes Medications */}
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2 font-medium text-blue-600">
													Diabetes
												</td>
												<td className="px-3 py-2">
													Inj Novomix Penfill
													20-22/16-18 units - 10 min
													before meals
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Twice daily",
														"up"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<TrendingUp className="h-3 w-3 mr-1" />
														Active (↑)
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Tab Metformin + Glimepiride
													500mg/2mg - After food
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Twice daily",
														"up"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300 ">
														<TrendingUp className="h-3 w-3 mr-1" />
														Active (↑)
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Tab Sitagliptin +
													Dapagliflozin 100mg/10mg -
													Before food, 30 min
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Once daily",
														"new"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-300 transition-all duration-300">
														<Plus className="h-3 w-3 mr-1" />
														NEW
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Tab Voglibose 0.2mg - With
													food
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Thrice daily",
														"stable"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<Minus className="h-3 w-3 mr-1" />
														Active (=)
													</Badge>
												</td>
											</tr>

											{/* Hypertension Medications */}
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2 font-medium text-purple-600">
													Hypertension
												</td>
												<td className="px-3 py-2">
													Tab Losartan + Amlodipine
													50mg/5mg - After food
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Once daily",
														"down"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<TrendingDown className="h-3 w-3 mr-1" />
														Active (↓)
													</Badge>
												</td>
											</tr>

											{/* Cardiovascular Protection */}
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2 font-medium text-orange-600">
													Cardioprotective
												</td>
												<td className="px-3 py-2">
													Tab Aspirin + Atorvastatin
													75mg/10mg - After food
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Once daily",
														"stable"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<Minus className="h-3 w-3 mr-1" />
														Active (=)
													</Badge>
												</td>
											</tr>

											{/* Other/Discontinued Medications */}
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2 font-medium text-gray-600">
													Others
												</td>
												<td className="px-3 py-2 line-through text-red-500">
													Tab Apremilast 10mg
													(ineffective)
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Previously twice daily",
														"stopped"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-300 transition-all duration-300">
														<X className="h-3 w-3 mr-1" />
														STOPPED
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Cap Becosules (B-complex) -
													After food
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Once daily",
														"stable"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<Minus className="h-3 w-3 mr-1" />
														Active (=)
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Oint Tacrolimus 0.1% -
													Alternate days
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Alternate days",
														"stable"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<Minus className="h-3 w-3 mr-1" />
														Active (=)
													</Badge>
												</td>
											</tr>
											<tr className="hover:bg-gray-50">
												<td className="px-3 py-2"></td>
												<td className="px-3 py-2">
													Oint Mometasone furoate 1mg
													- Alternate days
												</td>
												<td className="px-3 py-2">
													{getFrequencySymbol(
														"Alternate days",
														"stable"
													)}
												</td>
												<td className="px-3 py-2">
													<Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-300 transition-all duration-300">
														<Minus className="h-3 w-3 mr-1" />
														Active (=)
													</Badge>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Adherence Section */}
					<Card className="bg-white shadow-lg mb-6">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Adherence Monitoring
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Medication Adherence */}
								<div className="space-y-4">
									<h4 className="font-semibold text-blue-600 flex items-center">
										<Pill className="h-5 w-5 mr-2" />
										Medication Adherence
									</h4>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Insulin (Novomix)
												</span>
												<div className="text-sm text-gray-600">
													Twice daily
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<span className="text-sm text-green-600">
													Good (85%)
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Oral Medications
												</span>
												<div className="text-sm text-gray-600">
													Multiple daily
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
												<span className="text-sm text-yellow-600">
													Fair (70%)
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Follow-up Consultations */}
								<div className="space-y-4">
									<h4 className="font-semibold text-purple-600 flex items-center">
										<Calendar className="h-5 w-5 mr-2" />
										Follow-up Consultations
									</h4>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Endocrinology
												</span>
												<div className="text-sm text-gray-600">
													Quarterly visits
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<span className="text-sm text-green-600">
													On Track
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Ophthalmology
												</span>
												<div className="text-sm text-gray-600">
													Annual screening
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-red-500 rounded-full"></div>
												<span className="text-sm text-red-600">
													Overdue
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Self-Monitoring Blood Sugar */}
								<div className="space-y-4">
									<h4 className="font-semibold text-orange-600 flex items-center">
										<Activity className="h-5 w-5 mr-2" />
										Blood Sugar Monitoring
									</h4>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Frequency
												</span>
												<div className="text-sm text-gray-600">
													2x daily recommended
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
												<span className="text-sm text-yellow-600">
													Irregular
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Last 7 days
												</span>
												<div className="text-sm text-gray-600">
													Average: 180 mg/dl
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-red-500 rounded-full"></div>
												<span className="text-sm text-red-600">
													High
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Blood Pressure Monitoring */}
								<div className="space-y-4">
									<h4 className="font-semibold text-indigo-600 flex items-center">
										<Heart className="h-5 w-5 mr-2" />
										Blood Pressure Monitoring
									</h4>
									<div className="space-y-3">
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Home Monitoring
												</span>
												<div className="text-sm text-gray-600">
													Weekly recommended
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<span className="text-sm text-green-600">
													Regular
												</span>
											</div>
										</div>
										<div className="flex items-center justify-between p-3 border rounded-lg">
											<div>
												<span className="font-medium">
													Last Reading
												</span>
												<div className="text-sm text-gray-600">
													130/84 mmHg
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<div className="w-2 h-2 bg-green-500 rounded-full"></div>
												<span className="text-sm text-green-600">
													Target Range
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Monitoring Recommendations based on HbA1c and Target Goals */}
					<Card className="bg-blue-50 border-blue-200 shadow-lg mb-6">
						<CardHeader>
							<CardTitle className="text-xl text-blue-700 flex items-center">
								<Activity className="mr-2 h-5 w-5" />
								Monitoring Recommendations
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{/* Current Status Assessment */}
								<div className="p-4 bg-white rounded-lg border">
									<h4 className="font-semibold text-gray-800 mb-3">
										Current Control Status
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm font-medium">
													HbA1c Goal Achievement:
												</span>
												<span className="text-red-600 font-semibold">
													Not Achieved (8.2% vs 7.5%)
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm font-medium">
													BP Goal Achievement:
												</span>
												<span className="text-green-600 font-semibold">
													Partially Achieved
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm font-medium">
													LDL Goal Achievement:
												</span>
												<span className="text-orange-600 font-semibold">
													Close to Target
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-sm font-medium">
													Overall Risk:
												</span>
												<span className="text-red-600 font-semibold">
													High (ASCVD 15.2%)
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Recommended Monitoring Frequency */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="p-4 bg-red-50 rounded-lg border border-red-200">
										<h4 className="font-semibold text-red-700 mb-3">
											Intensive Monitoring Required
										</h4>
										<ul className="space-y-2 text-sm">
											<li className="flex items-center">
												<AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
												<span>
													<strong>SMBG:</strong> 2-3
													times daily (on insulin)
												</span>
											</li>
											<li className="flex items-center">
												<Heart className="h-4 w-4 text-red-500 mr-2" />
												<span>
													<strong>
														BP Monitoring:
													</strong>{" "}
													2-3 times weekly
												</span>
											</li>
											<li className="flex items-center">
												<Calendar className="h-4 w-4 text-red-500 mr-2" />
												<span>
													<strong>Follow-up:</strong>{" "}
													Every 2-4 weeks
												</span>
											</li>
											<li className="flex items-center">
												<FlaskConical className="h-4 w-4 text-red-500 mr-2" />
												<span>
													<strong>HbA1c:</strong>{" "}
													Every 3 months
												</span>
											</li>
										</ul>
									</div>

									<div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-300 transition-all duration-300">
										<h4 className="font-semibold text-green-700 mb-3">
											If Goals Achieved
										</h4>
										<ul className="space-y-2 text-sm text-gray-600">
											<li className="flex items-center">
												<Activity className="h-4 w-4 text-green-500 mr-2" />
												<span>
													<strong>SMBG:</strong> 1-2
													times daily would suffice
												</span>
											</li>
											<li className="flex items-center">
												<Heart className="h-4 w-4 text-green-500 mr-2" />
												<span>
													<strong>
														BP Monitoring:
													</strong>{" "}
													Weekly would be adequate
												</span>
											</li>
											<li className="flex items-center">
												<Calendar className="h-4 w-4 text-green-500 mr-2" />
												<span>
													<strong>Follow-up:</strong>{" "}
													Every 3-6 months
												</span>
											</li>
											<li className="flex items-center">
												<FlaskConical className="h-4 w-4 text-green-500 mr-2" />
												<span>
													<strong>HbA1c:</strong>{" "}
													Every 6 months
												</span>
											</li>
										</ul>
									</div>
								</div>

								{/* eGFR-based Medication Alerts */}
								<div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
									<h4 className="font-semibold text-orange-700 mb-3 flex items-center">
										<AlertTriangle className="h-5 w-5 mr-2" />
										Medication Safety Alert - eGFR Based
									</h4>
									<div className="space-y-2 text-sm">
										<div className="p-3 bg-white rounded border-l-4 border-orange-400">
											<div className="font-medium text-orange-800">
												eGFR: 65 ml/min/1.73m² (Stage 2
												CKD)
											</div>
											<div className="text-orange-700 mt-1">
												⚠️ Review medications dose and
												necessity
											</div>
											<ul className="mt-2 text-orange-600 space-y-1">
												<li>
													• Metformin: Safe to
													continue (eGFR &gt; 30)
												</li>
												<li>
													• Monitor kidney function
													every 3-6 months
												</li>
												<li>
													• Consider ACE inhibitor
													optimization
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Key Metrics Trend Analysis */}
					<Card
						onClick={() => onNavigate("lab-monitoring")}
						className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
								Key Metrics Trend Analysis
								<ArrowRight className="h-4 w-4" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* HbA1c Trend */}
								<div className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-gray-800">
											HbA1c Trend (6 months)
										</h4>
										<span className="text-red-600 font-medium">
											8.2%
										</span>
									</div>
									<div className="text-xs text-gray-600 mb-2">
										Target: &lt;7.5% | Trend: ↗ Worsening
									</div>
									<div className="flex items-center space-x-2 text-xs">
										<span className="bg-red-100 text-red-700 px-2 py-1 rounded">
											Jan: 8.3%
										</span>
										<span>→</span>
										<span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
											Apr: 8.2%
										</span>
										<span>→</span>
										<span className="bg-red-100 text-red-700 px-2 py-1 rounded">
											Jul: 8.2%
										</span>
									</div>
									<Progress
										value={91}
										className="h-2 mt-3"
									/>
									<div className="text-xs text-gray-500 mt-1">
										91% to target
									</div>
								</div>

								{/* Blood Pressure Trend */}
								<div className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-gray-800">
											BP Trend (30 days)
										</h4>
										<span className="text-green-600 font-medium">
											130/84
										</span>
									</div>
									<div className="text-xs text-gray-600 mb-2">
										Target: &lt;130/80 mmHg | Trend: ↘
										Improving
									</div>
									<div className="flex items-center space-x-2 text-xs">
										<span className="bg-red-100 text-red-700 px-2 py-1 rounded">
											140/90
										</span>
										<span>→</span>
										<span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
											135/88
										</span>
										<span>→</span>
										<span className="bg-green-100 text-green-700 px-2 py-1 rounded">
											130/84
										</span>
									</div>
									<Progress
										value={65}
										className="h-2 mt-3"
									/>
									<div className="text-xs text-gray-500 mt-1">
										65% time in range
									</div>
								</div>

								{/* Glucose Trend (SMBG) */}
								<div className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-gray-800">
											SMBG Trend (14 days)
										</h4>
										<span className="text-orange-600 font-medium">
											180 mg/dl
										</span>
									</div>
									<div className="text-xs text-gray-600 mb-2">
										Target: 70-180 mg/dl | Average:
										High-normal
									</div>
									<div className="space-y-1">
										<div className="flex justify-between text-xs">
											<span>Time in Range (70-180):</span>
											<span className="font-medium">
												45%
											</span>
										</div>
										<Progress
											value={45}
											className="h-1"
										/>
									</div>
								</div>

								{/* eGFR Trend */}
								<div className="p-4 border rounded-lg">
									<div className="flex items-center justify-between mb-3">
										<h4 className="font-semibold text-gray-800">
											eGFR Trend (1 year)
										</h4>
										<span className="text-orange-600 font-medium">
											65
										</span>
									</div>
									<div className="text-xs text-gray-600 mb-2">
										Normal: &gt;90 ml/min/1.73m² | Trend: ↘
										Declining
									</div>
									<div className="flex items-center space-x-2 text-xs">
										<span className="bg-green-100 text-green-700 px-2 py-1 rounded">
											72
										</span>
										<span>→</span>
										<span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
											68
										</span>
										<span>→</span>
										<span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
											65
										</span>
									</div>
									<div className="text-xs text-orange-600 mt-2 font-medium">
										⚠️ Monitor closely - Stage 2 CKD
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Target Organ Assessment */}
					<Card
						onClick={() =>
							onNavigate("assessment", "complications")
						}
						className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
								Target Organ Assessment and Status
								<ArrowRight className="h-4 w-4" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{organAssessment.map((organ, index) => {
									const IconComponent = organ.icon;
									const getSubTabId = (organName: string) => {
										switch (organName) {
											case "Retinopathy":
												return "retinopathy";
											case "Nephropathy":
												return "nephropathy";
											case "IHD/HF":
												return "cardiac";
											case "CVA/Stroke":
												return "neuro";
											case "MASLD":
												return "liver";
											case "Diabetic Foot & Peripheral Assessment":
												return "foot";
											default:
												return undefined;
										}
									};

									return (
										<div
											key={index}
											onClick={(e) => {
												e.stopPropagation(); // Prevent card-level click
												const subTabId = getSubTabId(
													organ.organ
												);
												onNavigate(
													"assessment",
													subTabId
												);
											}}
											className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-200">
											<IconComponent
												className={`h-6 w-6 ${organ.color}`}
											/>
											<div className="flex-1">
												<div className="font-medium flex items-center">
													{organ.organ}
													<ArrowRight className="h-3 w-3 ml-1 text-gray-400" />
												</div>
												<div className="text-sm font-semibold">
													{organ.finding}
												</div>
												<div className="text-xs text-blue-600">
													{organ.value}
												</div>
												{organ.recommendations && (
													<div className="text-xs text-purple-600 mt-1 font-medium">
														💡{" "}
														{organ.recommendations}
													</div>
												)}
												<div className="text-xs text-gray-500 mt-1">
													Last done: {organ.lastDone}
												</div>
												<div
													className={`text-xs font-medium ${
														organ.nextDue?.includes(
															"Overdue"
														) ||
														organ.nextDue?.includes(
															"Critical"
														)
															? "text-red-600"
															: "text-green-600"
													}`}>
													Next due: {organ.nextDue}
												</div>
												{organ.tests &&
													organ.tests.length > 0 && (
														<div className="text-xs text-gray-600 mt-1">
															<span className="font-medium">
																Tests needed:
															</span>{" "}
															{organ.tests
																.slice(0, 2)
																.join(", ")}
															{organ.tests
																.length > 2 &&
																"..."}
														</div>
													)}
											</div>
											<Checkbox
												checked={
													organ.status !== "not-done"
												}
												className={
													organ.status ===
													"done-positive"
														? "border-red-500"
														: organ.status ===
														  "done-assessed"
														? "border-green-500"
														: "border-orange-500"
												}
											/>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>

					{/* HbA1c Trend with Threshold Zones and Toggle */}
					<Card
						onClick={() => onNavigate("lab-monitoring")}
						className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600 flex items-center justify-between">
								HbA1c Trend with Target Zones
								<div className="flex items-center space-x-2">
									<Toggle
										pressed={viewMode.hba1c === "table"}
										onPressedChange={() =>
											toggleViewMode("hba1c")
										}
										onClick={(e) => e.stopPropagation()}
										aria-label="Toggle HbA1c view"
										size="sm">
										{viewMode.hba1c === "chart" ? (
											<Table className="h-4 w-4" />
										) : (
											<BarChart3 className="h-4 w-4" />
										)}
									</Toggle>
									<ArrowRight className="h-4 w-4" />
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{viewMode.hba1c === "chart" ? (
								<>
									<ResponsiveContainer
										width="100%"
										height={300}>
										<LineChart data={hba1cData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis domain={[6.5, 9]} />
											<Tooltip
												formatter={(value) => [
													`${value}%`,
													"HbA1c",
												]}
												labelFormatter={(label) =>
													`Date: ${label}`
												}
											/>

											{/* Threshold Zones with Clear Labels */}
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

											{/* Target Lines with Values */}
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
												dataKey="value"
												stroke="#8884d8"
												strokeWidth={3}
												dot={(props) => {
													const {
														cx,
														cy,
														payload,
														index,
													} = props;
													const color = getValueColor(
														payload.value,
														7.5,
														false
													);
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
									<div className="mt-4 flex justify-center space-x-6 text-sm">
										<div className="flex items-center space-x-2">
											<div className="w-4 h-4 bg-green-200 rounded"></div>
											<span>Optimal Zone (≤7.5%)</span>
										</div>
										<div className="flex items-center space-x-2">
											<div className="w-4 h-4 bg-yellow-200 rounded"></div>
											<span>Caution Zone (7.5-8.5%)</span>
										</div>
										<div className="flex items-center space-x-2">
											<div className="w-4 h-4 bg-red-200 rounded"></div>
											<span>
												High Risk Zone (&gt;8.5%)
											</span>
										</div>
									</div>
								</>
							) : (
								<div className="border rounded-lg overflow-hidden">
									<table className="w-full text-sm">
										<thead className="bg-gray-50">
											<tr>
												<th className="p-3 text-left">
													Date
												</th>
												<th className="p-3 text-left">
													HbA1c (%)
												</th>
												<th className="p-3 text-left">
													Target Zone
												</th>
												<th className="p-3 text-left">
													Status
												</th>
											</tr>
										</thead>
										<tbody>
											{hba1cData.map((item, index) => (
												<tr
													key={index}
													className="border-t">
													<td className="p-3">
														{item.date}
													</td>
													<td
														className="p-3 font-semibold"
														style={{
															color: getValueColor(
																item.value,
																7.5,
																false
															),
														}}>
														{item.value}%
													</td>
													<td className="p-3 text-sm text-gray-600">
														Optimal: ≤7.5% |
														Caution: 7.5-8.5% | High
														Risk: &gt;8.5%
													</td>
													<td className="p-3">
														<Badge
															variant={
																item.value <=
																7.5
																	? "default"
																	: item.value <=
																	  8.5
																	? "secondary"
																	: "destructive"
															}>
															{item.value <= 7.5
																? "Optimal"
																: item.value <=
																  8.5
																? "Caution"
																: "High Risk"}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="bg-white shadow-md">
						<CardHeader>
							<CardTitle className="text-xl text-navy-600">
								Recent Changes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{/* Medication Changes */}
								<div>
									<h4 className="font-semibold text-blue-600 mb-2">
										Medication Changes:
									</h4>
									<ul className="space-y-2 text-sm">
										<li className="flex items-start">
											<TrendingUp className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-green-600">
												Added Sitagliptin +
												Dapagliflozin 100mg/10mg (Jan
												2024)
											</span>
										</li>
										<li className="flex items-start">
											<TrendingUp className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-blue-600">
												Increased Novomix insulin from
												18-16 to 20-22/16-18 units (Jun
												2022)
											</span>
										</li>
										<li className="flex items-start">
											<X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-red-600">
												Discontinued Apremilast due to
												lack of improvement (Jan 2024)
											</span>
										</li>
									</ul>
								</div>

								{/* Health Status Changes */}
								<div>
									<h4 className="font-semibold text-orange-600 mb-2">
										Health Status:
									</h4>
									<ul className="space-y-2 text-sm">
										<li className="flex items-start">
											<AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-orange-600">
												HbA1c increased from 7.5% to
												8.2% (Jul 2024)
											</span>
										</li>
										<li className="flex items-start">
											<TrendingUp className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-yellow-600">
												Serum creatinine increased from
												1.0 to 1.2 mg/dl
											</span>
										</li>
										<li className="flex items-start">
											<Eye className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-red-600">
												Ophthalmology review overdue
												(last: Oct 2023)
											</span>
										</li>
									</ul>
								</div>

								{/* Family/Social Changes */}
								<div>
									<h4 className="font-semibold text-purple-600 mb-2">
										Family/Social Dynamics:
									</h4>
									<ul className="space-y-2 text-sm">
										<li className="flex items-start">
											<User className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-purple-600">
												Primary caregiver: Spouse
												(stable support system)
											</span>
										</li>
										<li className="flex items-start">
											<Heart className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
											<span className="text-green-600">
												No recent changes in family
												dynamics
											</span>
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
