"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

export default function LabMonitoring() {
  const [selectedFrequency, setSelectedFrequency] = useState("monthly")

  const monthlyMonitoring = {
    FBS: [
      { date: "2024-01", value: 145, threshold: { min: 70, max: 100 } },
      { date: "2024-02", value: 138, threshold: { min: 70, max: 100 } },
      { date: "2024-03", value: 142, threshold: { min: 70, max: 100 } },
      { date: "2024-04", value: 135, threshold: { min: 70, max: 100 } },
      { date: "2024-05", value: 140, threshold: { min: 70, max: 100 } },
      { date: "2024-06", value: 138, threshold: { min: 70, max: 100 } },
      { date: "2024-07", value: 142, threshold: { min: 70, max: 100 } },
    ],
    PPBS: [
      { date: "2024-01", value: 220, threshold: { min: 70, max: 140 } },
      { date: "2024-02", value: 215, threshold: { min: 70, max: 140 } },
      { date: "2024-03", value: 225, threshold: { min: 70, max: 140 } },
      { date: "2024-04", value: 210, threshold: { min: 70, max: 140 } },
      { date: "2024-05", value: 218, threshold: { min: 70, max: 140 } },
      { date: "2024-06", value: 212, threshold: { min: 70, max: 140 } },
      { date: "2024-07", value: 220, threshold: { min: 70, max: 140 } },
    ],
    BP: [
      { date: "2024-01", systolic: 135, diastolic: 85 },
      { date: "2024-02", systolic: 132, diastolic: 84 },
      { date: "2024-03", systolic: 130, diastolic: 82 },
      { date: "2024-04", systolic: 128, diastolic: 80 },
      { date: "2024-05", systolic: 130, diastolic: 84 },
      { date: "2024-06", systolic: 132, diastolic: 86 },
      { date: "2024-07", systolic: 130, diastolic: 84 },
    ],
  }

  const quarterlyMonitoring = {
    HbA1c: [
      { date: "2023-01", value: 7.8, threshold: { max: 7.5 } },
      { date: "2023-04", value: 8.0, threshold: { max: 7.5 } },
      { date: "2023-07", value: 8.2, threshold: { max: 7.5 } },
      { date: "2023-10", value: 8.1, threshold: { max: 7.5 } },
      { date: "2024-01", value: 8.3, threshold: { max: 7.5 } },
      { date: "2024-04", value: 8.2, threshold: { max: 7.5 } },
      { date: "2024-07", value: 8.2, threshold: { max: 7.5 } },
    ],
  }

  const yearlyMonitoring = {
    Lipids: [
      { date: "2022", LDL: 85, HDL: 38, Triglycerides: 145 },
      { date: "2023", LDL: 80, HDL: 36, Triglycerides: 135 },
      { date: "2024", LDL: 77, HDL: 36, Triglycerides: 126 },
    ],
    ASCVD: [
      { date: "2022", risk: 12.5 },
      { date: "2023", risk: 14.2 },
      { date: "2024", risk: 15.2 },
    ],
  }

  const otherLabResults = [
    { name: "Urine Microalbuminuria", value: "25 mg/g", date: "2024-07-01", status: "normal", threshold: "<30 mg/g" },
    { name: "Serum Creatinine", value: "1.1 mg/dl", date: "2024-07-01", status: "normal", threshold: "<1.2 mg/dl" },
    { name: "Urine ACR", value: "22 mg/g", date: "2024-07-01", status: "normal", threshold: "<30 mg/g" },
    { name: "Vitamin B12", value: "180 pg/ml", date: "2024-05-03", status: "low", threshold: ">300 pg/ml" },
    { name: "Vitamin D", value: "18 ng/ml", date: "2024-05-03", status: "deficient", threshold: ">30 ng/ml" },
    { name: "Hemoglobin", value: "11.2 g/dl", date: "2024-05-03", status: "low", threshold: ">12 g/dl" },
    { name: "TSH", value: "3.2 mIU/L", date: "2024-05-03", status: "normal", threshold: "0.4-4.0 mIU/L" },
  ]

  const getTrendIcon = (data: any[], key: string) => {
    if (data.length < 2) return <Minus className="h-4 w-4" />
    const latest = data[data.length - 1][key]
    const previous = data[data.length - 2][key]
    if (latest > previous) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (latest < previous) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-navy-600 mb-6">Lab Results/Monitoring Components</h1>

      <Tabs defaultValue="longitudinal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="longitudinal">Longitudinal Tracker</TabsTrigger>
          <TabsTrigger value="other-labs">Other Lab Results</TabsTrigger>
          <TabsTrigger value="reports">Reports & Images</TabsTrigger>
        </TabsList>

        <TabsContent value="longitudinal">
          <div className="space-y-6">
            {/* Monthly Monitoring */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Monthly Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      FBS (mg/dl) {getTrendIcon(monthlyMonitoring.FBS, "value")}
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={monthlyMonitoring.FBS}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[60, 160]} />
                        <Tooltip />
                        <ReferenceLine y={100} stroke="red" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      PPBS (mg/dl) {getTrendIcon(monthlyMonitoring.PPBS, "value")}
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={monthlyMonitoring.PPBS}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[140, 240]} />
                        <Tooltip />
                        <ReferenceLine y={140} stroke="red" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      Blood Pressure {getTrendIcon(monthlyMonitoring.BP, "systolic")}
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={monthlyMonitoring.BP}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[70, 140]} />
                        <Tooltip />
                        <ReferenceLine y={130} stroke="red" strokeDasharray="5 5" />
                        <ReferenceLine y={80} stroke="red" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="systolic" stroke="#ff7300" />
                        <Line type="monotone" dataKey="diastolic" stroke="#387908" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quarterly Monitoring */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Quarterly Monitoring (3 Monthly)</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    HbA1c (%) {getTrendIcon(quarterlyMonitoring.HbA1c, "value")}
                  </h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={quarterlyMonitoring.HbA1c}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[7, 8.5]} />
                      <Tooltip />
                      <ReferenceLine y={7.5} stroke="red" strokeDasharray="5 5" label="Target" />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Yearly Monitoring */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Yearly Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Lipid Profile</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={yearlyMonitoring.Lipids}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="LDL" stroke="#8884d8" name="LDL" />
                        <Line type="monotone" dataKey="HDL" stroke="#82ca9d" name="HDL" />
                        <Line type="monotone" dataKey="Triglycerides" stroke="#ffc658" name="Triglycerides" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      ASCVD Risk Score (%) {getTrendIcon(yearlyMonitoring.ASCVD, "risk")}
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={yearlyMonitoring.ASCVD}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[10, 20]} />
                        <Tooltip />
                        <ReferenceLine y={10} stroke="orange" strokeDasharray="5 5" label="Moderate Risk" />
                        <ReferenceLine y={20} stroke="red" strokeDasharray="5 5" label="High Risk" />
                        <Line type="monotone" dataKey="risk" stroke="#ff7300" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="other-labs">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">Other Important Lab Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherLabResults.map((lab, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{lab.name}</h4>
                      <Badge
                        variant={
                          lab.status === "normal"
                            ? "default"
                            : lab.status === "low" || lab.status === "deficient"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {lab.status}
                      </Badge>
                    </div>
                    <div className="text-lg font-medium mb-1">{lab.value}</div>
                    <div className="text-sm text-gray-600 mb-2">Date: {lab.date}</div>
                    <div className="text-sm text-gray-500">Threshold: {lab.threshold}</div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">Order Additional Tests</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">Reports & Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Upload lab reports, ECG, X-rays, or other medical images</p>
                  <Button>Upload Files</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">ECG Report</h4>
                    <p className="text-sm text-gray-600 mb-2">Date: 2023-10-15</p>
                    <p className="text-sm">ST depression noted</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      View Report
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Fundus Photography</h4>
                    <p className="text-sm text-gray-600 mb-2">Date: 2023-10-15</p>
                    <p className="text-sm">Moderate NPDR</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      View Images
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">ECHO Report</h4>
                    <p className="text-sm text-gray-600 mb-2">Date: 2023-10-15</p>
                    <p className="text-sm">EF: 60%</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
