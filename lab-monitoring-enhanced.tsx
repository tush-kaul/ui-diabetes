"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { Upload, TrendingUp, TrendingDown, Minus, BarChart3, Table } from "lucide-react"
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

export default function LabMonitoringEnhanced() {
  const [viewMode, setViewMode] = useState({
    fbs: "chart",
    ppbs: "chart",
    bp: "chart",
    hba1c: "chart",
    lipids: "chart",
    ascvd: "chart",
  })

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

  const toggleViewMode = (metric: string) => {
    setViewMode((prev) => ({
      ...prev,
      [metric]: prev[metric] === "chart" ? "table" : "chart",
    }))
  }

  const renderDataView = (data: any[], metric: string, title: string, thresholds?: any) => {
    const isChart = viewMode[metric] === "chart"

    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold flex items-center">
            {title} {getTrendIcon(data, Object.keys(data[0]).find((key) => key !== "date") || "value")}
          </h4>
          <Toggle pressed={!isChart} onPressedChange={() => toggleViewMode(metric)} aria-label={`Toggle ${title} view`}>
            {isChart ? <Table className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
          </Toggle>
        </div>

        {isChart ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [`${value}${thresholds?.unit || ""}`, name]}
                labelFormatter={(label) => `Date: ${label}`}
              />

              {/* Threshold zones based on metric */}
              {metric === "fbs" && (
                <>
                  <ReferenceArea y1={70} y2={100} fill="#22c55e" fillOpacity={0.1} />
                  <ReferenceArea y1={100} y2={140} fill="#eab308" fillOpacity={0.1} />
                  <ReferenceArea y1={140} y2={200} fill="#ef4444" fillOpacity={0.1} />
                  <ReferenceLine
                    y={100}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Normal: ≤100 mg/dl", position: "topRight" }}
                  />
                </>
              )}
              {metric === "ppbs" && (
                <>
                  <ReferenceArea y1={70} y2={140} fill="#22c55e" fillOpacity={0.1} />
                  <ReferenceArea y1={140} y2={200} fill="#eab308" fillOpacity={0.1} />
                  <ReferenceArea y1={200} y2={300} fill="#ef4444" fillOpacity={0.1} />
                  <ReferenceLine
                    y={140}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Normal: ≤140 mg/dl", position: "topRight" }}
                  />
                </>
              )}
              {metric === "hba1c" && (
                <>
                  <ReferenceArea y1={4} y2={7.5} fill="#22c55e" fillOpacity={0.1} />
                  <ReferenceArea y1={7.5} y2={8.5} fill="#eab308" fillOpacity={0.1} />
                  <ReferenceArea y1={8.5} y2={12} fill="#ef4444" fillOpacity={0.1} />
                  <ReferenceLine
                    y={7.5}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    label={{ value: "Target: ≤7.5%", position: "topRight" }}
                  />
                </>
              )}
              {metric === "bp" && (
                <>
                  <ReferenceLine
                    y={130}
                    stroke="#eab308"
                    strokeDasharray="5 5"
                    label={{ value: "Systolic Target: ≤130", position: "topRight" }}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="#eab308"
                    strokeDasharray="5 5"
                    label={{ value: "Diastolic Target: ≤80", position: "bottomRight" }}
                  />
                </>
              )}

              <Line
                type="monotone"
                dataKey={Object.keys(data[0]).find((key) => key !== "date") || "value"}
                stroke="#8884d8"
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const value = payload[Object.keys(payload).find((key) => key !== "date") || "value"]
                  let color = "#8884d8"

                  if (metric === "fbs") {
                    color = value <= 100 ? "#22c55e" : value <= 140 ? "#eab308" : "#ef4444"
                  } else if (metric === "ppbs") {
                    color = value <= 140 ? "#22c55e" : value <= 200 ? "#eab308" : "#ef4444"
                  } else if (metric === "hba1c") {
                    color = value <= 7.5 ? "#22c55e" : value <= 8.5 ? "#eab308" : "#ef4444"
                  }

                  return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
                }}
              />

              {/* Additional lines for BP */}
              {metric === "bp" && (
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#387908"
                  dot={(props) => {
                    const { cx, cy, payload } = props
                    const color = payload.diastolic <= 80 ? "#22c55e" : payload.diastolic <= 90 ? "#eab308" : "#ef4444"
                    return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} strokeWidth={2} />
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Optimal Range</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const value = item.value || item[Object.keys(item).find((key) => key !== "date") || "value"]
                  let optimalRange = ""
                  let status = ""
                  let statusColor = "default"

                  if (metric === "fbs") {
                    optimalRange = "70-100 mg/dl"
                    status = value <= 100 ? "Normal" : value <= 140 ? "Elevated" : "High"
                    statusColor = value <= 100 ? "default" : value <= 140 ? "secondary" : "destructive"
                  } else if (metric === "ppbs") {
                    optimalRange = "70-140 mg/dl"
                    status = value <= 140 ? "Normal" : value <= 200 ? "Elevated" : "High"
                    statusColor = value <= 140 ? "default" : value <= 200 ? "secondary" : "destructive"
                  } else if (metric === "hba1c") {
                    optimalRange = "≤7.5%"
                    status = value <= 7.5 ? "Target" : value <= 8.5 ? "Above Target" : "Poor Control"
                    statusColor = value <= 7.5 ? "default" : value <= 8.5 ? "secondary" : "destructive"
                  }

                  return (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.date}</td>
                      <td className="p-2 font-semibold">
                        {value}
                        {thresholds?.unit || ""}
                      </td>
                      <td className="p-2 text-gray-600">{optimalRange}</td>
                      <td className="p-2">
                        <Badge variant={statusColor}>{status}</Badge>
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
      <h1 className="text-3xl font-bold text-navy-600 mb-6">Lab Results/Monitoring Components</h1>

      <Tabs defaultValue="longitudinal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="longitudinal">Longitudinal Tracker</TabsTrigger>
          <TabsTrigger value="lab-reports">Lab Reports</TabsTrigger>
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
                    {renderDataView(monthlyMonitoring.FBS, "fbs", "FBS (mg/dl)", { unit: " mg/dl", optimal: "70-100" })}
                  </div>
                  <div>
                    {renderDataView(monthlyMonitoring.PPBS, "ppbs", "PPBS (mg/dl)", {
                      unit: " mg/dl",
                      optimal: "70-140",
                    })}
                  </div>
                  <div>
                    {renderDataView(monthlyMonitoring.BP, "bp", "Blood Pressure", {
                      unit: " mmHg",
                      optimal: "≤130/80",
                    })}
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
                {renderDataView(quarterlyMonitoring.HbA1c, "hba1c", "HbA1c (%)", { unit: "%", optimal: "≤7.5" })}
              </CardContent>
            </Card>

            {/* Yearly Monitoring */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-navy-600">Yearly Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>{renderDataView(yearlyMonitoring.Lipids, "lipids", "Lipid Profile")}</div>
                  <div>{renderDataView(yearlyMonitoring.ASCVD, "ascvd", "ASCVD Risk Score (%)")}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lab-reports">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-navy-600">Lab Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sample Lab Report Format */}
              <div className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-red-600">Dr. PathLabs</h3>
                    <p className="text-sm text-gray-600">National Reference Lab</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>
                      <strong>Collected:</strong> 21/7/2024 12:05:00PM
                    </p>
                    <p>
                      <strong>Received:</strong> 21/7/2024 12:09:48PM
                    </p>
                    <p>
                      <strong>Reported:</strong> 21/7/2024 6:24:32PM
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p>
                      <strong>Name:</strong> Mr X
                    </p>
                    <p>
                      <strong>Lab No:</strong> 13859518
                    </p>
                    <p>
                      <strong>A/c Status:</strong> P
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Age:</strong> 70 Years
                    </p>
                    <p>
                      <strong>Gender:</strong> Male
                    </p>
                    <p>
                      <strong>Ref By:</strong> Dr. [Name]
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left font-semibold">Test Name</th>
                        <th className="p-3 text-left font-semibold">Results</th>
                        <th className="p-3 text-left font-semibold">Units</th>
                        <th className="p-3 text-left font-semibold">Bio. Ref. Interval</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td colSpan={4} className="p-3 font-semibold bg-gray-50">
                          LIPID PROFILE, BASIC, SERUM
                          <br />
                          <span className="text-sm text-gray-600">(Spectrophotometry, Calculated)</span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Cholesterol, Total</td>
                        <td className="p-3 font-semibold">193.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&lt;200.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Triglycerides</td>
                        <td className="p-3 font-semibold">100.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&lt;150.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">HDL Cholesterol</td>
                        <td className="p-3 font-semibold">45.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&gt;40.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">LDL Cholesterol</td>
                        <td className="p-3 font-semibold text-red-600">146.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&lt;100.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">VLDL Cholesterol</td>
                        <td className="p-3 font-semibold">&lt;0.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&lt;30.00</td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">Non-HDL Cholesterol</td>
                        <td className="p-3 font-semibold text-red-600">148.00</td>
                        <td className="p-3">mg/dL</td>
                        <td className="p-3">&lt;130.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-sm">
                  <h4 className="font-semibold mb-2">Interpretation</h4>
                  <div className="border rounded p-3 bg-gray-50">
                    <p className="mb-2">
                      <strong>NATIONAL LIPID ASSOCIATION:</strong>
                    </p>
                    <p className="text-xs">
                      Measurements in the same patient can show physiological & analytical variations. Three serial
                      samples 1 week apart are recommended for Total Cholesterol, Triglycerides, HDL & LDL Cholesterol.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="mt-4">Upload New Report</Button>
            </CardContent>
          </Card>
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
