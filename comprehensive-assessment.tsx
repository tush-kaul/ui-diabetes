"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, BabyIcon as Kidney, Brain, Heart, Activity, Zap, User } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function ComprehensiveAssessment() {
  const [selectedAssessment, setSelectedAssessment] = useState("")

  const assessmentItems = [
    {
      name: "Retinopathy",
      icon: Eye,
      status: "Moderate NPDR",
      lastAssessed: "2023-10-15",
      riskLevel: "high",
      investigations: ["Fundus Photography", "OCT", "Fluorescein Angiography"],
      consultations: ["Ophthalmology"],
      followUp: "6 months",
      trendData: [
        { date: "2021", severity: 1 },
        { date: "2022", severity: 2 },
        { date: "2023", severity: 3 },
      ],
    },
    {
      name: "Nephropathy",
      icon: Kidney,
      status: "Normal",
      lastAssessed: "2024-07-01",
      riskLevel: "low",
      investigations: ["Serum Creatinine", "Urine ACR", "eGFR"],
      consultations: ["Nephrology"],
      followUp: "1 year",
      trendData: [
        { date: "2022", creatinine: 0.9 },
        { date: "2023", creatinine: 1.0 },
        { date: "2024", creatinine: 1.1 },
      ],
    },
    {
      name: "Neuropathy",
      icon: Brain,
      status: "Asymptomatic",
      lastAssessed: "2023-10-15",
      riskLevel: "moderate",
      investigations: ["Monofilament Test", "Vibration Sense", "NCV Study"],
      consultations: ["Neurology", "Podiatry"],
      followUp: "1 year",
      trendData: [
        { date: "2022", score: 0 },
        { date: "2023", score: 1 },
      ],
    },
    {
      name: "Autonomic Neuropathy",
      icon: Zap,
      status: "Not Assessed",
      lastAssessed: "Never",
      riskLevel: "unknown",
      investigations: ["Heart Rate Variability", "Orthostatic BP", "Gastroparesis Assessment"],
      consultations: ["Cardiology", "Gastroenterology"],
      followUp: "As needed",
      trendData: [],
    },
    {
      name: "IHD",
      icon: Heart,
      status: "ECG Changes",
      lastAssessed: "2023-10-15",
      riskLevel: "moderate",
      investigations: ["ECG", "ECHO", "Stress Test", "Coronary Angiography"],
      consultations: ["Cardiology"],
      followUp: "6 months",
      trendData: [
        { date: "2022", ejectionFraction: 62 },
        { date: "2023", ejectionFraction: 60 },
      ],
    },
    {
      name: "CVA/Stroke",
      icon: Brain,
      status: "No History",
      lastAssessed: "2023-10-15",
      riskLevel: "moderate",
      investigations: ["Carotid Doppler", "MRI Brain", "CT Angiography"],
      consultations: ["Neurology", "Vascular Surgery"],
      followUp: "2 years",
      trendData: [],
    },
    {
      name: "PVD",
      icon: Activity,
      status: "Not Assessed",
      lastAssessed: "Never",
      riskLevel: "unknown",
      investigations: ["ABI", "Doppler Studies", "CT Angiography"],
      consultations: ["Vascular Surgery"],
      followUp: "1 year",
      trendData: [],
    },
    {
      name: "MASLD",
      icon: Activity,
      status: "Not Assessed",
      lastAssessed: "Never",
      riskLevel: "unknown",
      investigations: ["Liver Function Tests", "Ultrasound Abdomen", "FibroScan"],
      consultations: ["Hepatology"],
      followUp: "1 year",
      trendData: [],
    },
    {
      name: "Diabetic Foot",
      icon: Activity,
      status: "Low Risk",
      lastAssessed: "2023-10-15",
      riskLevel: "low",
      investigations: ["Foot Examination", "Doppler Studies", "X-ray Foot"],
      consultations: ["Podiatry", "Vascular Surgery"],
      followUp: "1 year",
      trendData: [
        { date: "2022", riskScore: 1 },
        { date: "2023", riskScore: 1 },
      ],
    },
    {
      name: "Skin Changes",
      icon: User,
      status: "Granuloma Annulare",
      lastAssessed: "2024-01-15",
      riskLevel: "low",
      investigations: ["Skin Biopsy", "Dermoscopy"],
      consultations: ["Dermatology"],
      followUp: "6 months",
      trendData: [],
    },
    {
      name: "Sexual Health",
      icon: User,
      status: "Not Assessed",
      lastAssessed: "Never",
      riskLevel: "unknown",
      investigations: ["Testosterone Levels", "IIEF Questionnaire"],
      consultations: ["Urology", "Endocrinology"],
      followUp: "As needed",
      trendData: [],
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-500 bg-red-50"
      case "moderate":
        return "text-yellow-500 bg-yellow-50"
      case "low":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-navy-600 mb-6">
        Comprehensive Assessment of Complications and Comorbidities
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card key={index} className="bg-white shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={getRiskColor(item.riskLevel)}>{item.riskLevel}</Badge>
                  </div>
                  <p className="text-sm">{item.status}</p>
                  <p className="text-xs text-gray-500">Last assessed: {item.lastAssessed}</p>
                </div>

                {/* Trend Chart (if data available) */}
                {item.trendData.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Trend Analysis</h4>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={item.trendData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={Object.keys(item.trendData[0]).find((key) => key !== "date")}
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Action Plan */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Action Plan:</h4>

                  {/* Investigations */}
                  <div>
                    <label className="text-xs text-gray-600">Investigations:</label>
                    <Select>
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select investigation" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.investigations.map((inv, idx) => (
                          <SelectItem key={idx} value={inv}>
                            {inv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Consultations */}
                  <div>
                    <label className="text-xs text-gray-600">Consultations:</label>
                    <Select>
                      <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="Select consultation" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.consultations.map((cons, idx) => (
                          <SelectItem key={idx} value={cons}>
                            {cons}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Follow-up */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Follow-up:</span>
                    <span className="text-xs font-medium">{item.followUp}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Order Tests
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Refer
                  </Button>
                </div>

                {/* Link to detailed reports */}
                <Button size="sm" variant="ghost" className="w-full text-xs">
                  View Detailed Reports & Trends
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Card */}
      <Card className="mt-6 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-navy-600">Assessment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-600">High Risk</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-yellow-600">Moderate Risk</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-600">Low Risk</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">4</div>
              <div className="text-sm text-gray-600">Not Assessed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
