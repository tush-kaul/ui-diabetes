"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PatientOverviewEnhanced from "./patient-overview-enhanced"
import MedicationsManagementComplete from "./medications-management-complete"
import LabMonitoringEnhanced from "./lab-monitoring-enhanced"
import ComprehensiveAssessmentFunctional from "./comprehensive-assessment-functional"
import LifestyleEnhanced from "./lifestyle-enhanced"
import AdherenceCommunication from "./adherence-communication"
import AdvicePrintableFixed from "./advice-printable-fixed"
import { useState, useEffect } from "react"

export default function PatientDashboardMain() {
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const handleNavigateTab = (event) => {
      setActiveTab(event.detail)
    }

    window.addEventListener("navigate-tab", handleNavigateTab)

    return () => {
      window.removeEventListener("navigate-tab", handleNavigateTab)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <TabsList className="grid w-full grid-cols-7 h-12">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="medications" className="text-xs">
                Medications
              </TabsTrigger>
              <TabsTrigger value="lab-monitoring" className="text-xs">
                Lab/Monitoring
              </TabsTrigger>
              <TabsTrigger value="assessment" className="text-xs">
                Assessment
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="text-xs">
                Lifestyle
              </TabsTrigger>
              <TabsTrigger value="communication" className="text-xs">
                Communication
              </TabsTrigger>
              <TabsTrigger value="advice" className="text-xs">
                Advice Sheet
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <PatientOverviewEnhanced />
        </TabsContent>

        <TabsContent value="medications" className="mt-0">
          <MedicationsManagementComplete />
        </TabsContent>

        <TabsContent value="lab-monitoring" className="mt-0">
          <LabMonitoringEnhanced />
        </TabsContent>

        <TabsContent value="assessment" className="mt-0">
          <ComprehensiveAssessmentFunctional />
        </TabsContent>

        <TabsContent value="lifestyle" className="mt-0">
          <LifestyleEnhanced />
        </TabsContent>

        <TabsContent value="communication" className="mt-0">
          <AdherenceCommunication />
        </TabsContent>

        <TabsContent value="advice" className="mt-0">
          <AdvicePrintableFixed />
        </TabsContent>
      </Tabs>
    </div>
  )
}
