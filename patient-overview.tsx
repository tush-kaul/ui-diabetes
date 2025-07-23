"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function PatientOverview() {
  const [newComplaint, setNewComplaint] = useState("")

  const hba1cData = [
    { date: "2023-01", value: 7.8 },
    { date: "2023-04", value: 8.0 },
    { date: "2023-07", value: 8.2 },
    { date: "2023-10", value: 8.1 },
    { date: "2024-01", value: 8.3 },
    { date: "2024-04", value: 8.2 },
    { date: "2024-07", value: 8.2 },
  ]

  const targetGoals = [
    { metric: "HbA1c", target: 7.5, current: 8.2, achieved: false, percentage: 91 },
    { metric: "LDL", target: 70, current: 77, achieved: false, percentage: 91 },
    { metric: "BP Systolic", target: 130, current: 130, achieved: true, percentage: 100 },
    { metric: "BP Diastolic", target: 80, current: 84, achieved: false, percentage: 95 },
    { metric: "ASCVD Risk", target: 10, current: 15.2, achieved: false, percentage: 66 },
  ]

  const organAssessment = [
    { organ: "Retinopathy", icon: Eye, status: "done-positive", color: "text-red-500" },
    { organ: "Nephropathy", icon: Kidney, status: "done-negative", color: "text-green-500" },
    { organ: "Neuropathy", icon: Brain, status: "done-negative", color: "text-green-500" },
    { organ: "IHD", icon: Heart, status: "not-done", color: "text-orange-500" },
    { organ: "CVA/Stroke", icon: Brain, status: "not-done", color: "text-orange-500" },
    { organ: "PVD", icon: Activity, status: "not-done", color: "text-orange-500" },
  ]

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-navy-600">Patient Overview</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Update Prescription
          </Button>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Order Tests
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up
          </Button>
          <Button variant="outline">
            <Stethoscope className="mr-2 h-4 w-4" /> Refer to Specialist
          </Button>
        </div>
      </div>

      <Card className="mb-6 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <User className="mr-2 h-6 w-6 text-navy-600" />
            Mr X
          </CardTitle>
          <CardDescription className="text-lg">
            70 years old | Male | OP: 12345, IP: 23456 | 3X Follow up case (HbA1c poorly controlled, on insulin)
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chief Complaints Section */}
      <Card className="mb-6 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-navy-600">Chief Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select from WhatsApp complaints" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fatigue">Fatigue</SelectItem>
                  <SelectItem value="thirst">Increased thirst</SelectItem>
                  <SelectItem value="urination">Frequent urination</SelectItem>
                  <SelectItem value="vision">Blurred vision</SelectItem>
                  <SelectItem value="numbness">Numbness in feet</SelectItem>
                </SelectContent>
              </Select>
              <Button>Add Complaint</Button>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Enter new complaint"
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                className="w-64"
              />
              <Button>Add New</Button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Current complaints:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Occasional fatigue</li>
                <li>Mild numbness in feet</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Enhanced Diagnosis Section */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-navy-600">Diagnosis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-600 font-semibold">Diabetes (30 years)</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked /> <span>Oral drugs (3 groups)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked /> <span>Insulin therapy</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Control: Poor (Multiple drug groups + insulin indicates suboptimal control)
                  </p>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-600 font-semibold">Hypertension (35 years)</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked /> <span>2 drug groups</span>
                  </div>
                  <p className="text-xs text-gray-500">Control: Moderate (2 drug groups)</p>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <span>Granuloma annulare</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Key Health Metrics */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-navy-600">Key Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Weight: 68 kg</li>
              <li>BMI: 27 (pre-obese)</li>
              <li>BP: 130/84 mmHg (10/07/2024)</li>
              <li className="text-red-500 font-semibold">HbA1c: 8.2% (08/07/2024)</li>
              <li>LDL: 77 mg/dl (03/05/2024)</li>
              <li>HDL: 36 mg/dl (03/05/2024)</li>
              <li>Triglycerides: 126 mg/dl (03/05/2024)</li>
              <li className="text-orange-500">ASCVD Risk: 15.2%</li>
              <li className="text-yellow-500">Hb: 11.2 g/dl (Low)</li>
              <li className="text-yellow-500">Vit B12: 180 pg/ml (Low)</li>
              <li className="text-yellow-500">Vit D: 18 ng/ml (Deficient)</li>
            </ul>
            <Button className="mt-4 w-full bg-transparent" variant="outline">
              Edit Metrics
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-red-50 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-red-700 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-red-700">
              <li>HbA1c above target (8.2% vs target &lt;7.5%)</li>
              <li>Ophthalmology review due (last check: October 2023)</li>
              <li>Vaccinations needed: Pneumococcal and Influenza</li>
              <li>ASCVD risk elevated (15.2%)</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Current Medications - Integrated Prescription */}
      <Card
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "medications" }))}
        className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
            Current Medications (Integrated Prescription)
            <ArrowRight className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">Diabetes Management:</h4>
              <ul className="space-y-1 text-sm">
                <li>1. Inj Novomix Penfill 20-22/0/16-18 (10 min before meal)</li>
                <li>2. Tab Metformin + Glimepiride 500mg/2mg (AMARYL M2) 1-0-1</li>
                <li>3. Tab Sitagliptin + Dapagliflozin 100mg/10mg (DAPLA-S) 1-0-0</li>
                <li>4. Tab Voglibose 0.2mg (VOGS 0.2) 1-1-1 (with food)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Cardiovascular & Others:</h4>
              <ul className="space-y-1 text-sm">
                <li>5. Tab Losartan + Amlodipine 50mg+5mg (ALSARTAN AM) 1-0-1</li>
                <li>6. Tab Aspirin + Atorvastatin 75mg+10mg (ECOSIRIN AV) 0-1-0</li>
                <li>
                  7. <span className="line-through text-red-500">Tab Apremilast 10mg 0-0-1</span> (Discontinued)
                </li>
                <li>8. Cap Becosules 0-1-0</li>
                <li>9. Oint Tacrolimus 0.1% (TACROZ FORTE) alternate days</li>
                <li>10. Oint Mometasone furoate 1mg (ELCON) alternate days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drug Allergies */}
      <Card className="bg-white shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-navy-600">Drug Allergies/Intolerance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-green-600">No known drug allergies</p>
            <Button variant="outline">Add Allergy/Intolerance</Button>
          </div>
        </CardContent>
      </Card>

      {/* Target Goals Achievement */}
      <Card
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "communication" }))}
        className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
            Target Goals Achievement
            <ArrowRight className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targetGoals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{goal.metric}</span>
                    <span className={goal.achieved ? "text-green-600" : "text-red-600"}>
                      {goal.achieved ? "Achieved" : "Not Achieved"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Target: {goal.target} | Current: {goal.current}
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                </div>
                <div className="ml-4 text-lg font-semibold">{goal.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Organ Assessment */}
      <Card
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "assessment" }))}
        className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
            Target Organ Assessment
            <ArrowRight className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {organAssessment.map((organ, index) => {
              const IconComponent = organ.icon
              return (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <IconComponent className={`h-6 w-6 ${organ.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{organ.organ}</div>
                    <div className="text-sm">
                      {organ.status === "done-positive" && <span className="text-red-500">Done - Positive</span>}
                      {organ.status === "done-negative" && <span className="text-green-500">Done - Negative</span>}
                      {organ.status === "not-done" && <span className="text-orange-500">Not Done</span>}
                    </div>
                  </div>
                  <Checkbox
                    checked={organ.status !== "not-done"}
                    className={
                      organ.status === "done-positive"
                        ? "border-red-500"
                        : organ.status === "done-negative"
                          ? "border-green-500"
                          : "border-orange-500"
                    }
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "lab-monitoring" }))}
        className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
            HbA1c Trend
            <ArrowRight className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hba1cData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[7, 8.5]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-navy-600">Recent Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="text-green-600">
              Medication change: Dapagliflozin 10mg to FDC Sitagliptin + Dapagliflozin 100mg/10mg
            </li>
            <li className="text-yellow-600">Apremilast discontinued due to lack of improvement</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
