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
  Edit,
  Plus,
  X,
  Table,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
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
} from "recharts"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"

export default function PatientOverviewEnhanced() {
  const [newComplaint, setNewComplaint] = useState("")
  const [editingDiagnosis, setEditingDiagnosis] = useState(false)
  const [diagnoses, setDiagnoses] = useState([
    {
      id: 1,
      name: "Diabetes",
      duration: "30 years",
      severity: "Poor control",
      medications: ["Oral drugs (3 groups)", "Insulin therapy"],
      color: "text-red-600",
    },
    {
      id: 2,
      name: "Hypertension",
      duration: "35 years",
      severity: "Moderate control",
      medications: ["2 drug groups"],
      color: "text-yellow-600",
    },
    {
      id: 3,
      name: "Granuloma annulare",
      duration: "2 years",
      severity: "Stable",
      medications: ["Topical treatments"],
      color: "text-blue-600",
    },
  ])

  const [followUpDate, setFollowUpDate] = useState("")
  const [followUpNotes, setFollowUpNotes] = useState("")

  const [viewMode, setViewMode] = useState({
    hba1c: "chart",
  })

  const toggleViewMode = (metric: string) => {
    setViewMode((prev) => ({
      ...prev,
      [metric]: prev[metric] === "chart" ? "table" : "chart",
    }))
  }

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
    { metric: "HbA1c", target: 7.5, current: 8.2, achieved: false, percentage: 91, unit: "%" },
    { metric: "LDL", target: 70, current: 77, achieved: false, percentage: 91, unit: "mg/dl" },
    { metric: "BP Systolic", target: 130, current: 130, achieved: true, percentage: 100, unit: "mmHg" },
    { metric: "BP Diastolic", target: 80, current: 84, achieved: false, percentage: 95, unit: "mmHg" },
    { metric: "ASCVD Risk", target: 10, current: 15.2, achieved: false, percentage: 66, unit: "%" },
  ]

  const organAssessment = [
    { organ: "Retinopathy", icon: Eye, status: "done-positive", color: "text-red-500", finding: "Moderate NPDR" },
    { organ: "Nephropathy", icon: Kidney, status: "done-negative", color: "text-green-500", finding: "Normal" },
    { organ: "Neuropathy", icon: Brain, status: "done-negative", color: "text-green-500", finding: "Asymptomatic" },
    { organ: "IHD", icon: Heart, status: "not-done", color: "text-orange-500", finding: "Pending assessment" },
    { organ: "CVA/Stroke", icon: Brain, status: "not-done", color: "text-orange-500", finding: "Pending assessment" },
    { organ: "PVD", icon: Activity, status: "not-done", color: "text-orange-500", finding: "Pending assessment" },
  ]

  // Abnormal metrics for quick access
  const abnormalMetrics = [
    { name: "HbA1c", value: "8.2%", normal: "&lt;7.5%", status: "High", priority: "high" },
    { name: "ASCVD Risk", value: "15.2%", normal: "&lt;10%", status: "High", priority: "high" },
    { name: "Hemoglobin", value: "11.2 g/dl", normal: "&gt;12 g/dl", status: "Low", priority: "medium" },
    { name: "Vitamin B12", value: "180 pg/ml", normal: "&gt;300 pg/ml", status: "Low", priority: "medium" },
    { name: "Vitamin D", value: "18 ng/ml", normal: "&gt;30 ng/ml", status: "Deficient", priority: "medium" },
  ]

  const addDiagnosis = () => {
    const newDiagnosis = {
      id: diagnoses.length + 1,
      name: "New Diagnosis",
      duration: "Recent",
      severity: "Under evaluation",
      medications: [],
      color: "text-gray-600",
    }
    setDiagnoses([...diagnoses, newDiagnosis])
  }

  const removeDiagnosis = (id: number) => {
    setDiagnoses(diagnoses.filter((d) => d.id !== id))
  }

  const getValueColor = (value: number, target: number, isHigherBetter = false) => {
    if (isHigherBetter) {
      return value >= target ? "#22c55e" : value >= target * 0.8 ? "#eab308" : "#ef4444"
    } else {
      return value <= target ? "#22c55e" : value <= target * 1.2 ? "#eab308" : "#ef4444"
    }
  }

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Follow-up Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="followup-date">Follow-up Date</Label>
                  <Input
                    id="followup-date"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="followup-notes">Follow-up Instructions</Label>
                  <Textarea
                    id="followup-notes"
                    placeholder="Enter follow-up instructions..."
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                  />
                </div>
                <Button className="w-full">Schedule Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
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

      {/* Abnormal Metrics Alert */}
      <Card className="mb-6 bg-red-50 border-red-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-red-700 flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Abnormal Metrics - Immediate Attention Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {abnormalMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  metric.priority === "high" ? "bg-red-100 border-red-300" : "bg-yellow-100 border-yellow-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{metric.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      metric.priority === "high" ? "bg-red-200 text-red-800" : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {metric.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-sm text-gray-600">Normal: {metric.normal}</div>
              </div>
            ))}
          </div>
        </CardContent>
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
            <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
              Diagnosis Summary
              <Button size="sm" variant="outline" onClick={() => setEditingDiagnosis(!editingDiagnosis)}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${diagnosis.color} font-semibold`}>
                      {diagnosis.name} ({diagnosis.duration})
                    </span>
                    {editingDiagnosis && (
                      <Button size="sm" variant="ghost" onClick={() => removeDiagnosis(diagnosis.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    {diagnosis.medications.map((med, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Checkbox checked readOnly /> <span>{med}</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500">Control: {diagnosis.severity}</p>
                  </div>
                </div>
              ))}
              {editingDiagnosis && (
                <Button size="sm" variant="outline" onClick={addDiagnosis} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" /> Add Diagnosis
                </Button>
              )}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  Edit Metrics
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Health Metrics</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
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
                <Button className="w-full">Save Changes</Button>
              </DialogContent>
            </Dialog>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Allergy/Intolerance</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Drug Allergy/Intolerance</DialogTitle>
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
                        <SelectItem value="allergy">Allergy</SelectItem>
                        <SelectItem value="intolerance">Intolerance</SelectItem>
                        <SelectItem value="adverse-reaction">Adverse Reaction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the reaction..." />
                  </div>
                  <Button className="w-full">Add Allergy</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                    Target: {goal.target}
                    {goal.unit} | Current: {goal.current}
                    {goal.unit}
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
                    <div className="text-xs text-gray-500">{organ.finding}</div>
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

      {/* HbA1c Trend with Threshold Zones and Toggle */}
      <Card
        onClick={() => window.dispatchEvent(new CustomEvent("navigate-tab", { detail: "lab-monitoring" }))}
        className="bg-white shadow-lg mb-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-xl text-navy-600 flex items-center justify-between">
            HbA1c Trend with Target Zones
            <div className="flex items-center space-x-2">
              <Toggle
                pressed={viewMode.hba1c === "table"}
                onPressedChange={() => toggleViewMode("hba1c")}
                aria-label="Toggle HbA1c view"
                size="sm"
              >
                {viewMode.hba1c === "chart" ? <Table className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
              </Toggle>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode.hba1c === "chart" ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hba1cData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[6.5, 9]} />
                  <Tooltip formatter={(value) => [`${value}%`, "HbA1c"]} labelFormatter={(label) => `Date: ${label}`} />

                  {/* Threshold Zones with Clear Labels */}
                  <ReferenceArea y1={6.5} y2={7.5} fill="#22c55e" fillOpacity={0.1} />
                  <ReferenceArea y1={7.5} y2={8.5} fill="#eab308" fillOpacity={0.1} />
                  <ReferenceArea y1={8.5} y2={9} fill="#ef4444" fillOpacity={0.1} />

                  {/* Target Lines with Values */}
                  <ReferenceLine
                    y={7.5}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Target: ≤7.5%", position: "topRight" }}
                  />
                  <ReferenceLine
                    y={8.5}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: "High Risk: >8.5%", position: "topRight" }}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props
                      const color = getValueColor(payload.value, 7.5, false)
                      return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
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
                  <span>High Risk Zone (&gt;8.5%)</span>
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
                    <th className="p-3 text-left">Target Zone</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hba1cData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.date}</td>
                      <td className="p-3 font-semibold" style={{ color: getValueColor(item.value, 7.5, false) }}>
                        {item.value}%
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        Optimal: ≤7.5% | Caution: 7.5-8.5% | High Risk: &gt;8.5%
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={item.value <= 7.5 ? "default" : item.value <= 8.5 ? "secondary" : "destructive"}
                        >
                          {item.value <= 7.5 ? "Optimal" : item.value <= 8.5 ? "Caution" : "High Risk"}
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
