"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function MedicationsGantt() {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2020-01-01",
      endDate: null,
      status: "Active",
      category: "Oral Antidiabetic",
      changes: [],
    },
    {
      id: 2,
      name: "Glimepiride",
      dosage: "2mg",
      frequency: "Once daily",
      startDate: "2021-01-01",
      endDate: null,
      status: "Active",
      category: "Oral Antidiabetic",
      changes: [{ date: "2021-06-01", change: "Dose increased from 1mg to 2mg" }],
    },
    {
      id: 3,
      name: "Novomix Insulin",
      dosage: "20-22/16-18",
      frequency: "Twice daily",
      startDate: "2022-01-01",
      endDate: null,
      status: "Active",
      category: "Insulin",
      changes: [
        { date: "2022-06-01", change: "Dose increased from 16-14" },
        { date: "2023-01-01", change: "Adjusted to 20-22/16-18" },
      ],
    },
    {
      id: 4,
      name: "Apremilast",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2023-06-01",
      endDate: "2024-01-01",
      status: "Discontinued",
      category: "Immunosuppressant",
      changes: [{ date: "2024-01-01", change: "Discontinued due to lack of improvement" }],
    },
  ])

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    category: "",
  })

  const timelineYears = ["2020", "2021", "2022", "2023", "2024", "2025"]
  const monthsInYear = 12

  const getPositionForDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth()
    const yearIndex = timelineYears.indexOf(year.toString())
    if (yearIndex === -1) return null
    return (yearIndex * monthsInYear + month) * (100 / (timelineYears.length * monthsInYear))
  }

  const getMedicationDuration = (startDate: string, endDate: string | null) => {
    const start = getPositionForDate(startDate)
    const end = endDate ? getPositionForDate(endDate) : 100
    if (start === null) return { left: 0, width: 0 }
    return {
      left: start,
      width: (end || 100) - start,
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Oral Antidiabetic": "bg-blue-500",
      Insulin: "bg-green-500",
      Antihypertensive: "bg-purple-500",
      Statin: "bg-orange-500",
      Immunosuppressant: "bg-red-500",
      Vitamin: "bg-yellow-500",
    }
    return colors[category] || "bg-gray-500"
  }

  const addMedication = () => {
    if (newMedication.name && newMedication.startDate) {
      const medication = {
        id: medications.length + 1,
        ...newMedication,
        endDate: null,
        status: "Active",
        changes: [],
      }
      setMedications([...medications, medication])
      setNewMedication({ name: "", dosage: "", frequency: "", startDate: "", category: "" })
    }
  }

  const stopMedication = (id: number) => {
    const today = new Date().toISOString().split("T")[0]
    setMedications(medications.map((med) => (med.id === id ? { ...med, endDate: today, status: "Discontinued" } : med)))
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-navy-600 mb-6">Medication Management</h1>

      <Tabs defaultValue="gantt" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="gantt">Medication Timeline</TabsTrigger>
          <TabsTrigger value="management">Add/Manage Medications</TabsTrigger>
          <TabsTrigger value="table">Tabular View</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">Medication Gantt Chart</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Timeline Header */}
              <div className="mb-4">
                <div className="flex relative h-12 border-b">
                  {timelineYears.map((year, index) => (
                    <div key={year} className="flex-1 border-r border-gray-200 last:border-r-0">
                      <div className="text-center font-semibold text-sm py-2">{year}</div>
                      <div className="flex">
                        {Array.from({ length: monthsInYear }, (_, monthIndex) => (
                          <div key={monthIndex} className="flex-1 border-r border-gray-100 last:border-r-0 h-4"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication Bars */}
              <div className="space-y-4">
                {medications.map((medication) => {
                  const duration = getMedicationDuration(medication.startDate, medication.endDate)
                  return (
                    <div key={medication.id} className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-48 pr-4">
                          <div className="font-semibold text-sm">{medication.name}</div>
                          <div className="text-xs text-gray-600">
                            {medication.dosage} - {medication.frequency}
                          </div>
                          <Badge variant={medication.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {medication.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="relative h-8 border border-gray-200 rounded">
                        <div
                          className={`absolute top-0 bottom-0 rounded ${getCategoryColor(medication.category)} opacity-80`}
                          style={{
                            left: `${duration.left}%`,
                            width: `${duration.width}%`,
                          }}
                        >
                          <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                            {medication.name}
                          </div>
                        </div>

                        {/* Change Markers */}
                        {medication.changes.map((change, changeIndex) => {
                          const changePosition = getPositionForDate(change.date)
                          return changePosition ? (
                            <div
                              key={changeIndex}
                              className="absolute top-0 bottom-0 w-1 bg-red-500"
                              style={{ left: `${changePosition}%` }}
                              title={change.change}
                            />
                          ) : null
                        })}
                      </div>

                      {/* Changes List */}
                      {medication.changes.length > 0 && (
                        <div className="ml-48 mt-2">
                          <div className="text-xs text-gray-600">
                            <strong>Changes:</strong>
                            {medication.changes.map((change, idx) => (
                              <div key={idx} className="ml-2">
                                • {change.date}: {change.change}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold mb-2">Legend:</h4>
                <div className="flex flex-wrap gap-4">
                  {["Oral Antidiabetic", "Insulin", "Antihypertensive", "Statin", "Immunosuppressant", "Vitamin"].map(
                    (category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`}></div>
                        <span className="text-sm">{category}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <div className="space-y-6">
            {/* Add New Medication */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Add New Medication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="med-name">Medication Name</Label>
                    <Input
                      id="med-name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      placeholder="Enter medication name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="med-dosage">Dosage</Label>
                    <Input
                      id="med-dosage"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="med-frequency">Frequency</Label>
                    <Select
                      value={newMedication.frequency}
                      onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="med-category">Category</Label>
                    <Select
                      value={newMedication.category}
                      onValueChange={(value) => setNewMedication({ ...newMedication, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oral Antidiabetic">Oral Antidiabetic</SelectItem>
                        <SelectItem value="Insulin">Insulin</SelectItem>
                        <SelectItem value="Antihypertensive">Antihypertensive</SelectItem>
                        <SelectItem value="Statin">Statin</SelectItem>
                        <SelectItem value="Immunosuppressant">Immunosuppressant</SelectItem>
                        <SelectItem value="Vitamin">Vitamin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="med-start">Start Date</Label>
                    <Input
                      id="med-start"
                      type="date"
                      value={newMedication.startDate}
                      onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addMedication} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </CardContent>
            </Card>

            {/* Current Medications Management */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Current Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications
                    .filter((med) => med.status === "Active")
                    .map((medication) => (
                      <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold">{medication.name}</div>
                          <div className="text-sm text-gray-600">
                            {medication.dosage} - {medication.frequency}
                          </div>
                          <div className="text-xs text-gray-500">Started: {medication.startDate}</div>
                          <Badge variant="outline" className="mt-1">
                            {medication.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => stopMedication(medication.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">All Medications - Tabular View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Medication</th>
                      <th className="text-left p-3">Dosage</th>
                      <th className="text-left p-3">Frequency</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-left p-3">Start Date</th>
                      <th className="text-left p-3">End Date</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((medication) => (
                      <tr key={medication.id} className="border-b">
                        <td className="p-3 font-semibold">{medication.name}</td>
                        <td className="p-3">{medication.dosage}</td>
                        <td className="p-3">{medication.frequency}</td>
                        <td className="p-3">
                          <Badge variant="outline">{medication.category}</Badge>
                        </td>
                        <td className="p-3">{medication.startDate}</td>
                        <td className="p-3">{medication.endDate || "-"}</td>
                        <td className="p-3">
                          <Badge variant={medication.status === "Active" ? "default" : "secondary"}>
                            {medication.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            {medication.status === "Active" && (
                              <Button size="sm" variant="outline" onClick={() => stopMedication(medication.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
