"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientOverviewEnhanced from "./patient-overview-enhanced";
import MedicationsManagementComplete from "./medications-management-complete";
import LabMonitoringEnhanced from "./lab-monitoring-enhanced";
import ComprehensiveAssessmentFunctional from "./comprehensive-assessment-functional";
import LifestyleEnhanced from "./lifestyle-enhanced";
import AdherenceCommunication from "./adherence-communication";
import AdvicePrintableFixed from "./advice-printable-fixed";
import { useState, useEffect } from "react";
import {
	Activity,
	ClipboardList,
	FileText,
	FlaskConical,
	Heart,
	MessageSquare,
	Pill,
	User,
} from "lucide-react";
import MedicationsEnhanced from "./medications-enhanced";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./components/ui/tooltip";

export default function PatientDashboardMain() {
	const [activeTab, setActiveTab] = useState("overview");

	const tabs = [
		{
			id: "overview",
			label: "Overview",
			icon: Activity,
			badge: "5 Active",
			badgeColor: "bg-blue-500",
			description: "Patient summary, key metrics, and alerts",
		},
		{
			id: "medications",
			label: "Medications",
			icon: Pill,
			badge: "2 Pending",
			badgeColor: "bg-orange-500",
			description:
				"Current medications, adherence tracking, and management",
		},
		{
			id: "lab-monitoring",
			label: "Lab/Monitoring",
			icon: FlaskConical,
			badge: "1 Due",
			badgeColor: "bg-red-500",
			description: "Lab results, monitoring schedules, and trends",
		},
		{
			id: "assessment",
			label: "Assessment",
			icon: ClipboardList,
			badge: "3 Items",
			badgeColor: "bg-green-500",
			description: "Comprehensive health assessments and screenings",
		},
		{
			id: "lifestyle",
			label: "Lifestyle",
			icon: Heart,
			badge: "Updated",
			badgeColor: "bg-purple-500",
			description: "Diet, exercise, and lifestyle factor tracking",
		},
		{
			id: "communication",
			label: "Communication",
			icon: MessageSquare,
			badge: "2 New",
			badgeColor: "bg-cyan-500",
			description: "Patient communication and care coordination",
		},
		{
			id: "advice-sheet",
			label: "Advice Sheet",
			icon: FileText,
			badge: "Ready",
			badgeColor: "bg-gray-500",
			description: "Printable patient advice and instructions",
		},
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return <PatientOverviewEnhanced />;
			case "medications":
				return <MedicationsEnhanced />;
			case "lab-monitoring":
				return <LabMonitoringEnhanced />;
			case "assessment":
				return <ComprehensiveAssessmentFunctional />;
			case "lifestyle":
				return <LifestyleEnhanced />;
			case "communication":
				return <AdherenceCommunication />;
			case "advice-sheet":
				return <AdvicePrintableFixed />;
			default:
				return <PatientOverviewEnhanced />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Patient Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Avatar className="h-12 w-12">
							<AvatarImage
								src="/placeholder-user.jpg"
								alt="Patient"
							/>
							<AvatarFallback className="bg-blue-100 text-blue-600">
								<User className="h-6 w-6" />
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								Mr X
							</h1>
							<p className="text-sm text-gray-600">
								DOB: March 15, 1954 • ID: #12345 • Type 2
								Diabetes
							</p>
						</div>
					</div>
					<Badge
						variant="default"
						className="bg-green-100 text-green-800 border-green-200">
						Active Patient
					</Badge>
				</div>
			</div>

			{/* Navigation Instructions */}
			<div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-blue-900">
						Navigate Patient Records: Click tabs below to access
						different sections
					</p>
					<p className="text-xs text-blue-700">
						Click tabs below to access different sections
					</p>
				</div>
			</div>

			{/* Enhanced Tab Navigation */}
			<div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
				<div className="px-6">
					<div className="flex space-x-1 overflow-x-auto">
						<TooltipProvider>
							{tabs.map((tab) => {
								const Icon = tab.icon;
								const isActive = activeTab === tab.id;
								return (
									<Tooltip key={tab.id}>
										<TooltipTrigger asChild>
											<button
												onClick={() =>
													setActiveTab(tab.id)
												}
												className={`
                          relative flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200 min-w-fit
                          ${
								isActive
									? "text-blue-700 bg-blue-50 border-b-2 border-blue-600"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}
                        `}>
												<Icon className="h-5 w-5 flex-shrink-0" />
												<span className="whitespace-nowrap">
													{tab.label}
												</span>
												<Badge
													className={`
                            text-xs px-2 py-0.5 text-white border-0 flex-shrink-0
                            ${isActive ? tab.badgeColor : "bg-gray-400"}
                          `}>
													{tab.badge}
												</Badge>
											</button>
										</TooltipTrigger>
										<TooltipContent>
											<p className="font-medium">
												{tab.label}
											</p>
											<p className="text-xs text-gray-600">
												{tab.description}
											</p>
										</TooltipContent>
									</Tooltip>
								);
							})}
						</TooltipProvider>
					</div>
				</div>
			</div>

			{/* Active Tab Indicator */}
			<div className="bg-white border-b border-gray-100 px-6 py-2">
				<div className="flex items-center space-x-2">
					<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
					<span className="text-sm font-medium text-gray-900">
						Currently viewing:{" "}
						{tabs.find((tab) => tab.id === activeTab)?.label}
					</span>
					<span className="text-xs text-gray-500">
						-{" "}
						{tabs.find((tab) => tab.id === activeTab)?.description}
					</span>
				</div>
			</div>

			{/* Tab Content */}
			<div className="flex-1">{renderTabContent()}</div>
		</div>
	);
}
