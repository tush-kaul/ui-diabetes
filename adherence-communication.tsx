"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Phone, Calendar, BarChart3, Table, Send } from "lucide-react"
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

export default function AdherenceCommunication() {
  const [viewMode, setViewMode] = useState({
    adherence: "chart",
    goals: "chart",
    communication: "chart",
  })

  const [newMessage, setNewMessage] = useState("")
  const [selectedGoal, setSelectedGoal] = useState("")

  const toggleViewMode = (metric: string) => {
    setViewMode((prev) => ({
      ...prev,
      [metric]: prev[metric] === "chart" ? "table" : "chart",
    }))
  }

  // Overall adherence data with target zones
  const adherenceData = [
    { date: "2024-01", overall: 85, medication: 88, lifestyle: 82, appointments: 85 },
    { date: "2024-02", overall: 89, medication: 92, lifestyle: 86, appointments: 90 },
    { date: "2024-03", overall: 87, medication: 90, lifestyle: 84, appointments: 87 },
    { date: "2024-04", overall: 92, medication: 95, lifestyle: 89, appointments: 92 },
    { date: "2024-05", overall: 88, medication: 91, lifestyle: 85, appointments: 88 },
    { date: "2024-06", overall: 91, medication: 94, lifestyle: 88, appointments: 91 },
    { date: "2024-07", overall: 90, medication: 93, lifestyle: 87, appointments: 90 },
  ]

  // Goal achievement data
  const goalData = [
    { date: "2024-01", hba1c: 91, ldl: 91, bp: 100, weight: 75 },
    { date: "2024-02", hba1c: 91, ldl: 91, bp: 100, weight: 78 },
    { date: "2024-03", hba1c: 91, ldl: 91, bp: 100, weight: 80 },
    { date: "2024-04", hba1c: 91, ldl: 91, bp: 100, weight: 82 },
    { date: "2024-05", hba1c: 91, ldl: 91, bp: 95, weight: 85 },
    { date: "2024-06", hba1c: 91, ldl: 91, bp: 95, weight: 87 },
    { date: "2024-07", hba1c: 91, ldl: 91, bp: 100, weight: 90 },
  ]

  // Communication frequency data
  const communicationData = [
    { date: "2024-01", messages: 12, calls: 2, visits: 1 },
    { date: "2024-02", messages: 15, calls: 3, visits: 1 },
    { date: "2024-03", messages: 18, calls: 2, visits: 1 },
    { date: "2024-04", messages: 14, calls: 1, visits: 1 },
    { date: "2024-05", messages: 16, calls: 2, visits: 1 },
    { date: "2024-06", messages: 20, calls: 3, visits: 1 },
    { date: "2024-07", messages: 17, calls: 2, visits: 1 },
  ]

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
  ]

  const renderAdherenceChart = () => {
    const isChart = viewMode.adherence === "chart"

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Adherence Trends</h3>
          <Toggle
            pressed={!isChart}
            onPressedChange={() => toggleViewMode("adherence")}
            aria-label="Toggle adherence view"
          >
            {isChart ? <Table className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
          </Toggle>
        </div>

        {isChart ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[70, 100]} />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={(label) => `Date: ${label}`}
                />

                {/* Adherence Threshold Zones */}
                <ReferenceArea y1={90} y2={100} fill="#22c55e" fillOpacity={0.1} />
                <ReferenceArea y1={80} y2={90} fill="#eab308" fillOpacity={0.1} />
                <ReferenceArea y1={70} y2={80} fill="#ef4444" fillOpacity={0.1} />

                <ReferenceLine
                  y={90}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  label={{ value: "Excellent: ≥90%", position: "topRight" }}
                />
                <ReferenceLine
                  y={80}
                  stroke="#eab308"
                  strokeDasharray="5 5"
                  label={{ value: "Good: ≥80%", position: "bottomRight" }}
                />

                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke="#8884d8"
                  strokeWidth={3}
                  name="Overall"
                  dot={(props) => {
                    const { cx, cy, payload } = props
                    const color = payload.overall >= 90 ? "#22c55e" : payload.overall >= 80 ? "#eab308" : "#ef4444"
                    return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
                  }}
                />
                <Line type="monotone" dataKey="medication" stroke="#82ca9d" strokeWidth={2} name="Medication" />
                <Line type="monotone" dataKey="lifestyle" stroke="#ffc658" strokeWidth={2} name="Lifestyle" />
                <Line type="monotone" dataKey="appointments" stroke="#ff7300" strokeWidth={2} name="Appointments" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>Excellent (≥90%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                <span>Good (80-89%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <span>Needs Improvement (&lt;80%)</span>
              </div>
            </div>
          </>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Overall (%)</th>
                  <th className="p-3 text-left">Medication (%)</th>
                  <th className="p-3 text-left">Lifestyle (%)</th>
                  <th className="p-3 text-left">Appointments (%)</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {adherenceData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 font-semibold">
                      <span
                        style={{
                          color: item.overall >= 90 ? "#22c55e" : item.overall >= 80 ? "#eab308" : "#ef4444",
                        }}
                      >
                        {item.overall}%
                      </span>
                    </td>
                    <td className="p-3">{item.medication}%</td>
                    <td className="p-3">{item.lifestyle}%</td>
                    <td className="p-3">{item.appointments}%</td>
                    <td className="p-3">
                      <Badge
                        variant={item.overall >= 90 ? "default" : item.overall >= 80 ? "secondary" : "destructive"}
                      >
                        {item.overall >= 90 ? "Excellent" : item.overall >= 80 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderGoalsChart = () => {
    const isChart = viewMode.goals === "chart"

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Goal Achievement Progress</h3>
          <Toggle pressed={!isChart} onPressedChange={() => toggleViewMode("goals")} aria-label="Toggle goals view">
            {isChart ? <Table className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
          </Toggle>
        </div>

        {isChart ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={goalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[70, 105]} />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, `${name} Achievement`]}
                  labelFormatter={(label) => `Date: ${label}`}
                />

                {/* Goal Achievement Zones */}
                <ReferenceArea y1={95} y2={105} fill="#22c55e" fillOpacity={0.1} />
                <ReferenceArea y1={85} y2={95} fill="#eab308" fillOpacity={0.1} />
                <ReferenceArea y1={70} y2={85} fill="#ef4444" fillOpacity={0.1} />

                <ReferenceLine
                  y={95}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  label={{ value: "Target: ≥95%", position: "topRight" }}
                />
                <ReferenceLine
                  y={85}
                  stroke="#eab308"
                  strokeDasharray="5 5"
                  label={{ value: "Acceptable: ≥85%", position: "bottomRight" }}
                />

                <Line type="monotone" dataKey="hba1c" stroke="#8884d8" strokeWidth={2} name="HbA1c" />
                <Line type="monotone" dataKey="ldl" stroke="#82ca9d" strokeWidth={2} name="LDL" />
                <Line type="monotone" dataKey="bp" stroke="#ffc658" strokeWidth={2} name="Blood Pressure" />
                <Line type="monotone" dataKey="weight" stroke="#ff7300" strokeWidth={2} name="Weight" />
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
                  <th className="p-3 text-left">Weight (%)</th>
                  <th className="p-3 text-left">Overall Status</th>
                </tr>
              </thead>
              <tbody>
                {goalData.map((item, index) => {
                  const average = Math.round((item.hba1c + item.ldl + item.bp + item.weight) / 4)
                  return (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.date}</td>
                      <td className="p-3">{item.hba1c}%</td>
                      <td className="p-3">{item.ldl}%</td>
                      <td className="p-3">{item.bp}%</td>
                      <td className="p-3">{item.weight}%</td>
                      <td className="p-3">
                        <Badge variant={average >= 95 ? "default" : average >= 85 ? "secondary" : "destructive"}>
                          {average >= 95 ? "Target Achieved" : average >= 85 ? "Acceptable" : "Needs Attention"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-navy-600 mb-6">Adherence & Communication</h1>

      <Tabs defaultValue="adherence" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="adherence">Adherence Tracking</TabsTrigger>
          <TabsTrigger value="goals">Goal Achievement</TabsTrigger>
          <TabsTrigger value="communication">Communication Hub</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="adherence">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">Adherence Monitoring</CardTitle>
            </CardHeader>
            <CardContent>{renderAdherenceChart()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Target Goals Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {targetGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{goal.metric}</span>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                goal.priority === "high"
                                  ? "destructive"
                                  : goal.priority === "medium"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {goal.priority.toUpperCase()}
                            </Badge>
                            <span className={goal.achieved ? "text-green-600" : "text-red-600"}>
                              {goal.achieved ? "Achieved" : "Not Achieved"}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Target: {goal.target}
                          {goal.unit} | Current: {goal.current}
                          {goal.unit}
                        </div>
                        <div className="flex items-center space-x-4">
                          <Progress value={goal.percentage} className="h-2 flex-1" />
                          <span className="text-lg font-semibold">{goal.percentage}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Last updated: {goal.lastUpdated}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Goal Achievement Trends</CardTitle>
              </CardHeader>
              <CardContent>{renderGoalsChart()}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">17</div>
                  <div className="text-sm text-gray-600">This month</div>
                  <Button size="sm" className="mt-3 w-full">
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
                  <div className="text-2xl font-bold mb-2">2</div>
                  <div className="text-sm text-gray-600">This month</div>
                  <Button size="sm" className="mt-3 w-full">
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
                  <div className="text-2xl font-bold mb-2">1</div>
                  <div className="text-sm text-gray-600">This month</div>
                  <Button size="sm" className="mt-3 w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Quick Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message-type">Message Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Medication Reminder</SelectItem>
                        <SelectItem value="appointment">Appointment Reminder</SelectItem>
                        <SelectItem value="lab">Lab Results</SelectItem>
                        <SelectItem value="education">Health Education</SelectItem>
                        <SelectItem value="general">General Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message-content">Message</Label>
                    <Textarea
                      id="message-content"
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="h-24"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send WhatsApp
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
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
                <CardTitle className="text-xl text-navy-600">AI-Generated Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-red-800">High Priority: HbA1c Control</h4>
                      <Badge variant="destructive">AI Generated</Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      Patient's HbA1c remains at 8.2% despite multiple interventions. Consider adding GLP-1 agonist or
                      intensifying insulin therapy. Current adherence is good (93%), suggesting need for medication
                      adjustment.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Modify
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-yellow-800">Medium Priority: Weight Management</h4>
                      <Badge variant="secondary">AI Generated</Badge>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Patient has maintained weight at 68kg (BMI 27). Consider referral to dietitian for structured
                      weight loss program. Target weight reduction of 3-5kg would improve diabetes control.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Modify
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-blue-800">Low Priority: Exercise Enhancement</h4>
                      <Badge variant="outline">AI Generated</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Patient is meeting exercise targets (150 min/week). Consider adding resistance training 2x/week to
                      improve insulin sensitivity and muscle mass.
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline">
                        Modify
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Education Prescriptions</CardTitle>
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
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{education}</span>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send to WhatsApp
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
