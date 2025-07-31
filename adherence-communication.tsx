"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	MessageSquare,
	Phone,
	Calendar,
	BarChart3,
	Table,
	Send,
	FileText,
	Download,
	Copy,
	Check,
	X,
	Edit,
	Eye,
	Printer,
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

interface AdherenceCommunicationProps {
	initialSubTab?: string;
}

interface EducationTemplate {
	title: string;
	content: string;
	whatsapp: string;
}

type EducationTemplatesType = Record<string, EducationTemplate>;

export default function AdherenceCommunication({
	initialSubTab,
}: AdherenceCommunicationProps) {
	const [viewMode, setViewMode] = useState({
		adherence: "chart",
		goals: "chart",
		communication: "chart",
	});

	const [newMessage, setNewMessage] = useState("");
	const [selectedGoal, setSelectedGoal] = useState("");

	// Recommendations state
	const [recommendationStatus, setRecommendationStatus] = useState<
		Record<string, "pending" | "accepted" | "rejected" | "modified">
	>({
		"hba1c-control": "pending",
		"weight-management": "pending",
		"exercise-enhancement": "pending",
	});

	const [showReferralDialog, setShowReferralDialog] = useState(false);
	const [showDietDialog, setShowDietDialog] = useState(false);
	const [showEducationDialog, setShowEducationDialog] = useState(false);
	const [selectedEducation, setSelectedEducation] = useState("");
	const [copiedText, setCopiedText] = useState("");

	const toggleViewMode = (metric: keyof typeof viewMode) => {
		setViewMode((prev) => ({
			...prev,
			[metric]: prev[metric] === "chart" ? "table" : "chart",
		}));
	};

	// Recommendations helper functions
	const handleRecommendationAction = (
		id: string,
		action: "accepted" | "rejected" | "modified"
	) => {
		setRecommendationStatus((prev) => ({
			...prev,
			[id]: action,
		}));
	};

	const copyToClipboard = async (text: string, type: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedText(type);
			setTimeout(() => setCopiedText(""), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const getStatusBadge = (
		status: "pending" | "accepted" | "rejected" | "modified"
	) => {
		switch (status) {
			case "accepted":
				return (
					<Badge
						variant="default"
						className="bg-green-100 text-green-800"
					>
						Accepted
					</Badge>
				);
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>;
			case "modified":
				return <Badge variant="secondary">Modified</Badge>;
			default:
				return <Badge variant="outline">Pending</Badge>;
		}
	};

	// Sample templates and data
	const referralTemplate = `REFERRAL LETTER

To: Dr. Sarah Johnson, Ophthalmologist
From: Dr. Michael Chen, Primary Care Physician
Date: ${new Date().toLocaleDateString()}
Patient: Sarah Ahmed (DOB: 15/03/1985)

REASON FOR REFERRAL:
Patient presents with Type 2 Diabetes Mellitus and requires ophthalmological evaluation for diabetic retinopathy screening.

CLINICAL SUMMARY:
- Diagnosis: Type 2 Diabetes Mellitus (diagnosed 2018)
- Current HbA1c: 8.2% (target <7.0%)
- Blood Pressure: 145/92 mmHg
- BMI: 27 kg/m²
- Current medications: Metformin 1000mg BD, Gliclazide 80mg BD

FINDINGS:
- Last eye examination: 6 months ago
- Visual acuity: 6/9 both eyes
- Fundoscopy: Moderate NPDR in both eyes
- No macular edema detected

INVESTIGATIONS REQUESTED:
- Comprehensive diabetic eye examination
- Fundus photography
- Optical coherence tomography (OCT) if indicated
- Fluorescein angiography if required

URGENCY: Routine (within 4 weeks)

Please provide detailed report and management recommendations.

Thank you for your assistance.

Dr. Michael Chen
Primary Care Physician
Phone: (555) 123-4567`;

	const dietChartTemplate = `PERSONALIZED DIABETES DIET PLAN

Patient: Sarah Ahmed
Date: ${new Date().toLocaleDateString()}
Target HbA1c: <7.0%
Current Weight: 68kg | Target Weight: 63-65kg

DAILY CALORIE TARGET: 1,600 calories
Carbohydrates: 45% (180g)
Protein: 25% (100g)
Fat: 30% (53g)

MEAL PLAN:

BREAKFAST (7:00 AM) - 400 calories
- 1 cup steel-cut oats with 1/2 cup berries
- 1 tbsp chopped nuts (almonds/walnuts)
- 1 cup skim milk or unsweetened almond milk
- 1 boiled egg
- 1 slice whole grain bread

MID-MORNING SNACK (10:00 AM) - 150 calories
- 1 small apple with 1 tbsp peanut butter
- 1 cup green tea

LUNCH (1:00 PM) - 450 calories
- 1 cup brown rice or quinoa
- 3 oz grilled chicken breast
- 1 cup mixed vegetables (broccoli, carrots, bell peppers)
- 1 tbsp olive oil for cooking
- 1 small orange

AFTERNOON SNACK (4:00 PM) - 150 calories
- 1/2 cup Greek yogurt with 1/4 cup berries
- 10 almonds

DINNER (7:00 PM) - 400 calories
- 3 oz grilled fish (salmon/tuna)
- 1 cup steamed vegetables
- 1/2 cup sweet potato
- 1 tbsp olive oil
- Mixed green salad

EVENING SNACK (9:00 PM) - 50 calories
- 1 cup herbal tea
- 5 almonds (if needed)

FLUID INTAKE:
- Water: 8-10 glasses daily
- Avoid sugary drinks and fruit juices
- Limit coffee to 2 cups daily

EXERCISE RECOMMENDATIONS:
- 30 minutes walking daily
- Resistance training 2-3 times/week
- Monitor blood glucose before and after exercise

BLOOD GLUCOSE MONITORING:
- Fasting: Target 80-130 mg/dL
- Post-meal (2 hours): Target <180 mg/dL
- Record readings in diabetes diary

FOODS TO AVOID:
- White bread, white rice, pasta
- Sugary drinks, desserts
- Processed foods
- Fried foods
- High-sodium foods

FOODS TO INCLUDE:
- Whole grains, legumes
- Lean proteins
- Healthy fats (nuts, olive oil)
- Non-starchy vegetables
- Low-GI fruits

WEEKLY WEIGHT CHECK: Every Monday morning
FOLLOW-UP: 4 weeks for diet review`;

	const educationTemplates: EducationTemplatesType = {
		"Medication adherence and hypoglycemia prevention": {
			title: "Medication Adherence & Hypoglycemia Prevention",
			content: `MEDICATION ADHERENCE GUIDE

Dear Sarah,

Your diabetes medications are crucial for maintaining good blood sugar control. Here's what you need to know:

YOUR CURRENT MEDICATIONS:
1. Metformin 1000mg - Take twice daily with meals
2. Gliclazide 80mg - Take twice daily with meals

IMPORTANT REMINDERS:
- Take medications at the same time each day
- Never skip doses without consulting your doctor
- Keep medications in a visible, consistent location
- Set phone reminders if needed
- Refill prescriptions before running out

HYPOGLYCEMIA PREVENTION:
Signs of low blood sugar (hypoglycemia):
- Shakiness, sweating, dizziness
- Hunger, confusion, irritability
- Fast heartbeat, headache

If blood sugar <70 mg/dL:
1. Eat 15g fast-acting carbohydrate:
   - 3 glucose tablets
   - 1/2 cup fruit juice
   - 1 tbsp honey
2. Wait 15 minutes, check blood sugar again
3. If still low, repeat step 1
4. Eat a meal or snack with protein

PREVENTION TIPS:
- Eat regular meals and snacks
- Don't skip meals when taking diabetes medications
- Monitor blood sugar regularly
- Carry fast-acting carbohydrates
- Inform family/friends about your condition

EMERGENCY CONTACTS:
- Doctor: (555) 123-4567
- Emergency: 911
- Diabetes Helpline: 1-800-DIABETES

Remember: Your health is our priority. Don't hesitate to call if you have concerns.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"📱 MEDICATION REMINDER: Take your diabetes medications regularly to maintain good blood sugar control. Set reminders and never skip doses. If you experience symptoms of low blood sugar, eat fast-acting carbohydrates immediately. Stay healthy! 💊",
		},
		"Importance of recording self-monitoring values": {
			title: "Self-Monitoring Blood Glucose Guide",
			content: `BLOOD GLUCOSE MONITORING GUIDE

Dear Sarah,

Regular blood glucose monitoring helps you and your healthcare team make informed decisions about your diabetes management.

WHEN TO TEST:
- Fasting (before breakfast)
- Before each meal
- 2 hours after meals
- Before bedtime
- Before and after exercise
- When feeling unwell

TARGET RANGES:
- Fasting: 80-130 mg/dL
- Before meals: 80-130 mg/dL
- 2 hours after meals: <180 mg/dL
- Bedtime: 90-150 mg/dL

RECORDING YOUR VALUES:
Use your diabetes diary or mobile app to record:
- Date and time
- Blood glucose reading
- What you ate
- Physical activity
- Medications taken
- How you felt

WHAT TO BRING TO APPOINTMENTS:
- Blood glucose meter
- Diabetes diary/app records
- List of questions/concerns
- Current medications list

PATTERNS TO WATCH FOR:
- Consistently high readings
- Frequent low readings
- Wide variations in readings
- Readings that don't match how you feel

TROUBLESHOOTING:
- If readings are consistently high: Review diet and medication
- If readings are frequently low: May need medication adjustment
- If meter shows error: Check strips and battery

Remember: Knowledge is power. Your readings help us personalize your care.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"📊 BLOOD SUGAR MONITORING: Test your blood glucose regularly and record all values. Target ranges: Fasting 80-130, After meals <180. Bring your records to every appointment. Your readings help us provide better care! 📈",
		},
		"Sleep hygiene and diabetes management": {
			title: "Sleep Hygiene & Diabetes Management",
			content: `SLEEP HYGIENE FOR DIABETES MANAGEMENT

Dear Sarah,

Quality sleep is essential for diabetes management. Poor sleep can affect blood sugar control and overall health.

SLEEP AND DIABETES:
- Poor sleep can increase blood sugar levels
- Sleep apnea is common in diabetes
- Regular sleep patterns help hormone regulation
- Quality sleep improves insulin sensitivity

SLEEP HYGIENE TIPS:
1. Maintain regular sleep schedule
2. Create a relaxing bedtime routine
3. Keep bedroom cool, dark, and quiet
4. Avoid screens 1 hour before bed
5. Limit caffeine after 2 PM
6. Avoid large meals before bedtime
7. Exercise regularly, but not close to bedtime

DIABETES-SPECIFIC CONSIDERATIONS:
- Check blood sugar before bedtime
- Keep fast-acting carbohydrates nearby
- Monitor for sleep apnea symptoms
- Adjust insulin timing if needed

SIGNS OF SLEEP PROBLEMS:
- Snoring loudly
- Gasping for breath during sleep
- Excessive daytime sleepiness
- Difficulty falling/staying asleep
- Frequent nighttime urination

WHEN TO SEEK HELP:
- Persistent sleep problems
- Loud snoring with pauses in breathing
- Excessive daytime sleepiness
- Uncontrolled blood sugar despite good adherence

SLEEP MONITORING:
- Track sleep duration and quality
- Note any sleep disturbances
- Monitor blood sugar patterns
- Record energy levels during day

Remember: Good sleep is part of your diabetes management plan.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"😴 SLEEP & DIABETES: Quality sleep helps control blood sugar. Maintain regular sleep schedule, avoid screens before bed, keep bedroom cool and dark. Poor sleep can affect your diabetes control. Sweet dreams! 🌙",
		},
		"Complication screening importance": {
			title: "Diabetes Complication Screening",
			content: `DIABETES COMPLICATION SCREENING GUIDE

Dear Sarah,

Regular screening for diabetes complications is crucial for early detection and prevention of serious health problems.

ANNUAL SCREENING SCHEDULE:

EYE EXAMINATION (Ophthalmologist):
- Frequency: Every 6-12 months
- Tests: Dilated eye exam, fundus photography
- Purpose: Detect diabetic retinopathy
- Signs to watch: Blurred vision, floaters, dark spots

FOOT EXAMINATION:
- Frequency: Every 3-6 months
- Tests: Monofilament test, vibration testing
- Purpose: Detect diabetic neuropathy
- Signs to watch: Numbness, tingling, foot ulcers

KIDNEY FUNCTION:
- Frequency: Every 3-6 months
- Tests: Urine albumin, eGFR, creatinine
- Purpose: Detect diabetic nephropathy
- Signs to watch: Swelling, foamy urine

HEART HEALTH:
- Frequency: Annual
- Tests: ECG, lipid profile, blood pressure
- Purpose: Detect cardiovascular disease
- Signs to watch: Chest pain, shortness of breath

DENTAL EXAMINATION:
- Frequency: Every 6 months
- Purpose: Prevent gum disease
- Signs to watch: Bleeding gums, loose teeth

WHY SCREENING MATTERS:
- Early detection saves vision
- Prevents kidney damage
- Reduces heart disease risk
- Maintains quality of life
- Reduces healthcare costs

PREPARATION FOR APPOINTMENTS:
- Bring current medication list
- Note any new symptoms
- Bring recent blood test results
- Prepare questions for your doctor

Remember: Prevention is better than cure. Regular screening is your best defense.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"🔍 COMPLICATION SCREENING: Regular screening prevents serious diabetes complications. Schedule your annual eye, foot, kidney, and heart exams. Early detection saves lives! Don't skip your checkups! 🏥",
		},
		"Dietary modifications for diabetes": {
			title: "Diabetes Dietary Guidelines",
			content: `DIABETES DIETARY GUIDELINES

Dear Sarah,

A healthy diet is fundamental to diabetes management. Here are evidence-based dietary recommendations:

CARBOHYDRATE MANAGEMENT:
- Choose complex carbohydrates over simple sugars
- Monitor portion sizes
- Spread carbohydrates throughout the day
- Use the plate method: 1/4 protein, 1/4 carbs, 1/2 vegetables

RECOMMENDED FOODS:
- Non-starchy vegetables (broccoli, spinach, carrots)
- Whole grains (brown rice, quinoa, whole wheat)
- Lean proteins (chicken, fish, legumes)
- Healthy fats (nuts, olive oil, avocado)
- Low-GI fruits (berries, apples, pears)

FOODS TO LIMIT:
- Refined carbohydrates (white bread, pasta)
- Sugary drinks and desserts
- Processed foods
- High-sodium foods
- Saturated and trans fats

MEAL TIMING:
- Eat at regular intervals
- Don't skip meals
- Have small, frequent meals if needed
- Monitor blood sugar 2 hours after meals

PORTION CONTROL:
- Use smaller plates
- Measure portions initially
- Read food labels
- Be mindful of restaurant portions

HYDRATION:
- Drink 8-10 glasses of water daily
- Avoid sugary beverages
- Limit alcohol consumption
- Monitor for dehydration signs

SPECIAL CONSIDERATIONS:
- Plan meals around physical activity
- Adjust insulin timing with meals
- Consider glycemic index of foods
- Monitor blood sugar response to foods

Remember: Small changes lead to big improvements in diabetes control.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"🥗 DIABETES DIET: Choose complex carbs, lean proteins, and healthy fats. Use the plate method: 1/4 protein, 1/4 carbs, 1/2 vegetables. Monitor portions and eat regularly. Your diet is your medicine! 🍎",
		},
		"Exercise guidelines for diabetic patients": {
			title: "Exercise Guidelines for Diabetes",
			content: `EXERCISE GUIDELINES FOR DIABETES

Dear Sarah,

Regular physical activity is essential for diabetes management and overall health.

EXERCISE BENEFITS:
- Improves insulin sensitivity
- Helps control blood sugar
- Aids weight management
- Reduces cardiovascular risk
- Improves mood and energy

RECOMMENDED EXERCISE:
- Aerobic exercise: 150 minutes/week
- Strength training: 2-3 times/week
- Flexibility exercises: Daily
- Balance exercises: 2-3 times/week

EXERCISE TYPES:
1. Walking, swimming, cycling
2. Resistance training with weights
3. Yoga, tai chi, stretching
4. Dancing, gardening, household chores

BLOOD SUGAR MONITORING:
- Check before exercise
- Check during exercise if >1 hour
- Check after exercise
- Carry fast-acting carbohydrates
- Know your target ranges

EXERCISE SAFETY:
- Start slowly and gradually increase
- Stay hydrated
- Wear proper footwear
- Exercise with a partner if possible
- Stop if you feel unwell

WHEN TO AVOID EXERCISE:
- Blood sugar >250 mg/dL with ketones
- Blood sugar <100 mg/dL
- Feeling unwell or feverish
- Severe complications present

EXERCISE TIMING:
- Best time: 1-3 hours after meals
- Avoid exercise at peak insulin action
- Consider medication timing
- Monitor blood sugar response

Remember: Movement is medicine. Find activities you enjoy and make them part of your routine.

Best regards,
Dr. Michael Chen`,
			whatsapp:
				"🏃‍♀️ EXERCISE & DIABETES: Aim for 150 min/week of aerobic exercise plus strength training 2-3 times/week. Check blood sugar before, during, and after exercise. Stay active, stay healthy! 💪",
		},
	};

	// Overall adherence data with target zones
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

	// Goal achievement data
	const goalData = [
		{ date: "2024-01", hba1c: 91, ldl: 91, bp: 100, weight: 75 },
		{ date: "2024-02", hba1c: 91, ldl: 91, bp: 100, weight: 78 },
		{ date: "2024-03", hba1c: 91, ldl: 91, bp: 100, weight: 80 },
		{ date: "2024-04", hba1c: 91, ldl: 91, bp: 100, weight: 82 },
		{ date: "2024-05", hba1c: 91, ldl: 91, bp: 95, weight: 85 },
		{ date: "2024-06", hba1c: 91, ldl: 91, bp: 95, weight: 87 },
		{ date: "2024-07", hba1c: 91, ldl: 91, bp: 100, weight: 90 },
	];

	// Communication frequency data
	const communicationData = [
		{ date: "2024-01", messages: 12, calls: 2, visits: 1 },
		{ date: "2024-02", messages: 15, calls: 3, visits: 1 },
		{ date: "2024-03", messages: 18, calls: 2, visits: 1 },
		{ date: "2024-04", messages: 14, calls: 1, visits: 1 },
		{ date: "2024-05", messages: 16, calls: 2, visits: 1 },
		{ date: "2024-06", messages: 20, calls: 3, visits: 1 },
		{ date: "2024-07", messages: 17, calls: 2, visits: 1 },
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
						aria-label="Toggle adherence view"
					>
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
							className="mt-4 -ml-4 sm:ml-0"
						>
							<LineChart
								data={adherenceData}
								margin={{
									top: 5,
									right: 5,
									left: -20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[70, 100]} />
								<Tooltip
									formatter={(value, name) => [
										`${value}%`,
										name,
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
									dot={(props) => {
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
										className="border-t"
									>
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
												}}
											>
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
												}
											>
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
						aria-label="Toggle goals view"
					>
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
							height={300}
						>
							<LineChart data={goalData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis domain={[70, 105]} />
								<Tooltip
									formatter={(value, name) => [
										`${value}%`,
										`${name} Achievement`,
									]}
									labelFormatter={(label) => `Date: ${label}`}
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
											className="border-t"
										>
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
													}
												>
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

	return (
		<div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<h1 className="text-2xl sm:text-3xl font-bold text-navy-600 mb-4 sm:mb-6">
				Adherence & Communication
			</h1>

			<Tabs
				defaultValue={initialSubTab || "adherence"}
				className="w-full space-y-2 sm:space-y-0"
			>
				<TabsList className="mb-4 flex flex-wrap gap-2">
					<TabsTrigger
						value="adherence"
						className="text-xs sm:text-sm"
					>
						Adherence
					</TabsTrigger>
					<TabsTrigger
						value="goals"
						className="text-xs sm:text-sm"
					>
						Goals
					</TabsTrigger>
					<TabsTrigger
						value="communication"
						className="text-xs sm:text-sm"
					>
						Communication
					</TabsTrigger>
					<TabsTrigger
						value="recommendations"
						className="text-xs sm:text-sm"
					>
						AI Insights
					</TabsTrigger>
				</TabsList>

				<TabsContent value="adherence">
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
											className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg"
										>
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
															}
														>
															{goal.priority.toUpperCase()}
														</Badge>
														<span
															className={
																goal.achieved
																	? "text-green-600"
																	: "text-red-600"
															}
														>
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

				<TabsContent value="communication">
					<div className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							<Card className="bg-white shadow-lg">
								<CardHeader className="pb-2 sm:pb-4">
									<CardTitle className="text-base sm:text-lg flex items-center">
										<MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
										Messages
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold mb-2">
										17
									</div>
									<div className="text-sm text-gray-600">
										This month
									</div>
									<Button
										size="sm"
										className="mt-3 w-full"
									>
										<MessageSquare className="h-4 w-4 mr-2" />
										Send Message
									</Button>
								</CardContent>
							</Card>

							<Card className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-lg flex items-center">
										<Phone className="mr-2 h-5 w-5 text-green-500" />
										Phone Calls
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold mb-2">
										2
									</div>
									<div className="text-sm text-gray-600">
										This month
									</div>
									<Button
										size="sm"
										className="mt-3 w-full"
									>
										<Phone className="h-4 w-4 mr-2" />
										Schedule Call
									</Button>
								</CardContent>
							</Card>

							<Card className="bg-white shadow-lg">
								<CardHeader>
									<CardTitle className="text-lg flex items-center">
										<Calendar className="mr-2 h-5 w-5 text-purple-500" />
										Appointments
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold mb-2">
										1
									</div>
									<div className="text-sm text-gray-600">
										This month
									</div>
									<Button
										size="sm"
										className="mt-3 w-full"
									>
										<Calendar className="h-4 w-4 mr-2" />
										Book Appointment
									</Button>
								</CardContent>
							</Card>
						</div>

						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Quick Communication
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<Label htmlFor="message-type">
											Message Type
										</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Select message type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="reminder">
													Medication Reminder
												</SelectItem>
												<SelectItem value="appointment">
													Appointment Reminder
												</SelectItem>
												<SelectItem value="lab">
													Lab Results
												</SelectItem>
												<SelectItem value="education">
													Health Education
												</SelectItem>
												<SelectItem value="general">
													General Message
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="message-content">
											Message
										</Label>
										<Textarea
											id="message-content"
											placeholder="Type your message here..."
											value={newMessage}
											onChange={(e) =>
												setNewMessage(e.target.value)
											}
											className="h-24"
										/>
									</div>
									<div className="flex space-x-2">
										<Button className="flex-1">
											<Send className="h-4 w-4 mr-2" />
											Send WhatsApp
										</Button>
										<Button
											variant="outline"
											className="flex-1 bg-transparent"
										>
											<MessageSquare className="h-4 w-4 mr-2" />
											Send SMS
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="recommendations">
					<div className="space-y-6">
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									AI-Generated Recommendations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="p-4 border rounded-lg bg-red-50 border-red-200">
										<div className="flex items-start justify-between mb-2">
											<h4 className="font-semibold text-red-800">
												High Priority: HbA1c Control
											</h4>
											<div className="flex items-center space-x-2">
												<Badge variant="destructive">
													AI Generated
												</Badge>
												{getStatusBadge(
													recommendationStatus[
														"hba1c-control"
													]
												)}
											</div>
										</div>
										<p className="text-sm text-red-700 mb-3">
											Patient's HbA1c remains at 8.2%
											despite multiple interventions.
											Consider adding GLP-1 agonist or
											intensifying insulin therapy.
											Current adherence is good (93%),
											suggesting need for medication
											adjustment.
										</p>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"hba1c-control",
														"accepted"
													)
												}
												disabled={
													recommendationStatus[
														"hba1c-control"
													] !== "pending"
												}
											>
												<Check className="h-4 w-4 mr-1" />
												Accept
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"hba1c-control",
														"modified"
													)
												}
												disabled={
													recommendationStatus[
														"hba1c-control"
													] !== "pending"
												}
											>
												<Edit className="h-4 w-4 mr-1" />
												Modify
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"hba1c-control",
														"rejected"
													)
												}
												disabled={
													recommendationStatus[
														"hba1c-control"
													] !== "pending"
												}
											>
												<X className="h-4 w-4 mr-1" />
												Reject
											</Button>
										</div>
									</div>

									<div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
										<div className="flex items-start justify-between mb-2">
											<h4 className="font-semibold text-yellow-800">
												Medium Priority: Weight
												Management
											</h4>
											<div className="flex items-center space-x-2">
												<Badge variant="secondary">
													AI Generated
												</Badge>
												{getStatusBadge(
													recommendationStatus[
														"weight-management"
													]
												)}
											</div>
										</div>
										<p className="text-sm text-yellow-700 mb-3">
											Patient has maintained weight at
											68kg (BMI 27). Consider referral to
											dietitian for structured weight loss
											program. Target weight reduction of
											3-5kg would improve diabetes
											control.
										</p>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"weight-management",
														"accepted"
													)
												}
												disabled={
													recommendationStatus[
														"weight-management"
													] !== "pending"
												}
											>
												<Check className="h-4 w-4 mr-1" />
												Accept
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"weight-management",
														"modified"
													)
												}
												disabled={
													recommendationStatus[
														"weight-management"
													] !== "pending"
												}
											>
												<Edit className="h-4 w-4 mr-1" />
												Modify
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"weight-management",
														"rejected"
													)
												}
												disabled={
													recommendationStatus[
														"weight-management"
													] !== "pending"
												}
											>
												<X className="h-4 w-4 mr-1" />
												Reject
											</Button>
										</div>
									</div>

									<div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
										<div className="flex items-start justify-between mb-2">
											<h4 className="font-semibold text-blue-800">
												Low Priority: Exercise
												Enhancement
											</h4>
											<div className="flex items-center space-x-2">
												<Badge variant="outline">
													AI Generated
												</Badge>
												{getStatusBadge(
													recommendationStatus[
														"exercise-enhancement"
													]
												)}
											</div>
										</div>
										<p className="text-sm text-blue-700 mb-3">
											Patient is meeting exercise targets
											(150 min/week). Consider adding
											resistance training 2x/week to
											improve insulin sensitivity and
											muscle mass.
										</p>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"exercise-enhancement",
														"accepted"
													)
												}
												disabled={
													recommendationStatus[
														"exercise-enhancement"
													] !== "pending"
												}
											>
												<Check className="h-4 w-4 mr-1" />
												Accept
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"exercise-enhancement",
														"modified"
													)
												}
												disabled={
													recommendationStatus[
														"exercise-enhancement"
													] !== "pending"
												}
											>
												<Edit className="h-4 w-4 mr-1" />
												Modify
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleRecommendationAction(
														"exercise-enhancement",
														"rejected"
													)
												}
												disabled={
													recommendationStatus[
														"exercise-enhancement"
													] !== "pending"
												}
											>
												<X className="h-4 w-4 mr-1" />
												Reject
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Education Prescriptions
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{[
										"Medication adherence and hypoglycemia prevention",
										"Importance of recording self-monitoring values",
										"Sleep hygiene and diabetes management",
										"Complication screening importance",
										"Dietary modifications for diabetes",
										"Exercise guidelines for diabetic patients",
									].map((education, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<span className="text-sm">
												{education}
											</span>
											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => {
														setSelectedEducation(
															education
														);
														setShowEducationDialog(
															true
														);
													}}
												>
													<Eye className="h-4 w-4 mr-2" />
													View
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														copyToClipboard(
															educationTemplates[
																education as keyof EducationTemplatesType
															].whatsapp,
															`whatsapp-${index}`
														)
													}
												>
													{copiedText ===
													`whatsapp-${index}` ? (
														<Check className="h-4 w-4 mr-2" />
													) : (
														<MessageSquare className="h-4 w-4 mr-2" />
													)}
													{copiedText ===
													`whatsapp-${index}`
														? "Copied!"
														: "WhatsApp"}
												</Button>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Smart Assist Section - Enhanced */}
						<Card className="bg-white shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl text-navy-600">
									Smart Assist: Doctor Companion
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-700 italic">
									What else would you like me to do?
								</p>

								<div className="border p-4 rounded-lg bg-gray-50 space-y-2">
									<p className="font-medium text-gray-800">
										Referral Draft
									</p>
									<p className="text-sm text-gray-600">
										Ophthalmology referral ready for patient
										with moderate NPDR. Includes last exam,
										current vision, HbA1c, BP.
									</p>
									<div className="flex space-x-2">
										<Button
											size="sm"
											className="mt-1"
											onClick={() =>
												setShowReferralDialog(true)
											}
										>
											<Eye className="h-4 w-4 mr-2" />
											View Referral
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="mt-1"
											onClick={() =>
												copyToClipboard(
													referralTemplate,
													"referral"
												)
											}
										>
											{copiedText === "referral" ? (
												<Check className="h-4 w-4 mr-2" />
											) : (
												<Copy className="h-4 w-4 mr-2" />
											)}
											{copiedText === "referral"
												? "Copied!"
												: "Copy"}
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="mt-1"
										>
											<Download className="h-4 w-4 mr-2" />
											Download
										</Button>
									</div>
								</div>

								<div className="border p-4 rounded-lg bg-gray-50 space-y-2">
									<p className="font-medium text-gray-800">
										Diet Plan
									</p>
									<p className="text-sm text-gray-600">
										Personalized low-GI diet chart based on
										current medications, weight, and HbA1c.
									</p>
									<div className="flex space-x-2">
										<Button
											size="sm"
											className="mt-1"
											onClick={() =>
												setShowDietDialog(true)
											}
										>
											<Eye className="h-4 w-4 mr-2" />
											View Diet Plan
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="mt-1"
											onClick={() =>
												copyToClipboard(
													dietChartTemplate,
													"diet"
												)
											}
										>
											{copiedText === "diet" ? (
												<Check className="h-4 w-4 mr-2" />
											) : (
												<Copy className="h-4 w-4 mr-2" />
											)}
											{copiedText === "diet"
												? "Copied!"
												: "Copy"}
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="mt-1"
										>
											<Printer className="h-4 w-4 mr-2" />
											Print
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Referral Dialog */}
					<Dialog
						open={showReferralDialog}
						onOpenChange={setShowReferralDialog}
					>
						<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									Ophthalmology Referral Letter
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="bg-gray-50 p-4 rounded-lg">
									<pre className="whitespace-pre-wrap text-sm font-mono">
										{referralTemplate}
									</pre>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() =>
											copyToClipboard(
												referralTemplate,
												"referral-dialog"
											)
										}
									>
										{copiedText === "referral-dialog" ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<Copy className="h-4 w-4 mr-2" />
										)}
										{copiedText === "referral-dialog"
											? "Copied!"
											: "Copy to Clipboard"}
									</Button>
									<Button>
										<Download className="h-4 w-4 mr-2" />
										Download PDF
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					{/* Diet Plan Dialog */}
					<Dialog
						open={showDietDialog}
						onOpenChange={setShowDietDialog}
					>
						<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									Personalized Diabetes Diet Plan
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="bg-gray-50 p-4 rounded-lg">
									<pre className="whitespace-pre-wrap text-sm font-mono">
										{dietChartTemplate}
									</pre>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() =>
											copyToClipboard(
												dietChartTemplate,
												"diet-dialog"
											)
										}
									>
										{copiedText === "diet-dialog" ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<Copy className="h-4 w-4 mr-2" />
										)}
										{copiedText === "diet-dialog"
											? "Copied!"
											: "Copy to Clipboard"}
									</Button>
									<Button>
										<Printer className="h-4 w-4 mr-2" />
										Print Plan
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					{/* Education Dialog */}
					<Dialog
						open={showEducationDialog}
						onOpenChange={setShowEducationDialog}
					>
						<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									{selectedEducation &&
										educationTemplates[
											selectedEducation as keyof EducationTemplatesType
										]?.title}
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="bg-gray-50 p-4 rounded-lg">
									<pre className="whitespace-pre-wrap text-sm font-mono">
										{selectedEducation &&
											educationTemplates[
												selectedEducation as keyof EducationTemplatesType
											]?.content}
									</pre>
								</div>
								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										onClick={() =>
											copyToClipboard(
												(selectedEducation &&
													educationTemplates[
														selectedEducation as keyof EducationTemplatesType
													]?.content) ||
													"",
												"education"
											)
										}
									>
										{copiedText === "education" ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<Copy className="h-4 w-4 mr-2" />
										)}
										{copiedText === "education"
											? "Copied!"
											: "Copy Content"}
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											copyToClipboard(
												(selectedEducation &&
													educationTemplates[
														selectedEducation as keyof EducationTemplatesType
													]?.whatsapp) ||
													"",
												"education-whatsapp"
											)
										}
									>
										{copiedText === "education-whatsapp" ? (
											<Check className="h-4 w-4 mr-2" />
										) : (
											<MessageSquare className="h-4 w-4 mr-2" />
										)}
										{copiedText === "education-whatsapp"
											? "Copied!"
											: "Copy WhatsApp"}
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</TabsContent>
			</Tabs>
		</div>
	);
}
