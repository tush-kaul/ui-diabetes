"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"

export default function AdvicePrintable() {
  const currentDate = new Date().toLocaleDateString("en-GB")

  return (
    <div className="p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header with Print/Download buttons */}
        <div className="flex justify-between items-center mb-6 no-print">
          <h1 className="text-3xl font-bold text-navy-600">Patient Advice Sheet</h1>
          <div className="flex space-x-2">
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="printable-content">
          {/* Patient Information */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">PATIENT ADVICE SHEET</CardTitle>
              <p className="text-sm text-gray-600">Date: {currentDate}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> Mr X
                  </p>
                  <p>
                    <strong>Age:</strong> 70 years
                  </p>
                  <p>
                    <strong>Sex:</strong> Male
                  </p>
                </div>
                <div>
                  <p>
                    <strong>OP Number:</strong> 12345
                  </p>
                  <p>
                    <strong>IP Number:</strong> 23456
                  </p>
                  <p>
                    <strong>Address:</strong> [Patient Address]
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li>• Type 2 Diabetes Mellitus (30 years duration) - Poorly controlled</li>
                <li>• Essential Hypertension (35 years duration)</li>
                <li>• Granuloma Annulare</li>
                <li>• Diabetic Retinopathy (Moderate NPDR)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Key Health Metrics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Current Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Weight:</strong> 68 kg
                  </p>
                  <p>
                    <strong>BMI:</strong> 27 (pre-obese)
                  </p>
                  <p>
                    <strong>Blood Pressure:</strong> 130/84 mmHg
                  </p>
                  <p>
                    <strong>HbA1c:</strong> 8.2% (Target: &lt;7.5%)
                  </p>
                </div>
                <div>
                  <p>
                    <strong>LDL Cholesterol:</strong> 77 mg/dl
                  </p>
                  <p>
                    <strong>HDL Cholesterol:</strong> 36 mg/dl
                  </p>
                  <p>
                    <strong>Triglycerides:</strong> 126 mg/dl
                  </p>
                  <p>
                    <strong>ASCVD Risk:</strong> 15.2%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Assessment Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Complication Assessment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Eye Examination:</strong> Moderate NPDR (Due for review)
                  </p>
                  <p>
                    <strong>Kidney Function:</strong> Normal
                  </p>
                  <p>
                    <strong>Nerve Function:</strong> No symptoms
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Heart Function:</strong> ECG changes noted
                  </p>
                  <p>
                    <strong>Foot Examination:</strong> Low risk
                  </p>
                  <p>
                    <strong>Dental Health:</strong> Due for check-up
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>For Diabetes:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>1. Insulin Novomix Penfill: 20-22 units before breakfast, 16-18 units before dinner</li>
                  <li>2. Metformin + Glimepiride (AMARYL M2): 1 tablet twice daily before meals</li>
                  <li>3. Sitagliptin + Dapagliflozin (DAPLA-S): 1 tablet once daily after breakfast</li>
                  <li>4. Voglibose (VOGS 0.2): 1 tablet with each meal</li>
                </ul>

                <p>
                  <strong>For Blood Pressure & Heart:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>5. Losartan + Amlodipine (ALSARTAN AM): 1 tablet twice daily after meals</li>
                  <li>6. Aspirin + Atorvastatin (ECOSIRIN AV): 1 tablet after dinner</li>
                </ul>

                <p>
                  <strong>Others:</strong>
                </p>
                <ul className="ml-4 space-y-1">
                  <li>7. Becosules: 1 capsule after lunch</li>
                  <li>8. Tacrolimus ointment: Apply on affected areas alternate days</li>
                  <li>9. Mometasone ointment: Apply on affected areas alternate days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Follow-up Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p>
                    <strong>Next Appointment:</strong> 3 months (Schedule by [Date])
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Specialist Referrals Required:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• Ophthalmologist - Within 1 month (Overdue)</li>
                    <li>• Dietitian - Within 2 weeks</li>
                    <li>• Sleep Specialist - Within 1 month</li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Lab Investigations for Next Visit:</strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• HbA1c (3 months)</li>
                    <li>• Fasting & Post-meal blood sugar (Monthly)</li>
                    <li>• Blood pressure monitoring (Weekly)</li>
                    <li>• Kidney function tests (6 months)</li>
                    <li>• Lipid profile (1 year)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Instructions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Important Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p>
                    <strong>Medication Instructions:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Take insulin exactly 10 minutes before meals</li>
                    <li>• Never skip insulin doses</li>
                    <li>• Keep glucose tablets/candy for low blood sugar</li>
                    <li>• Take blood pressure medicines regularly</li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Diet & Lifestyle:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Reduce mango intake to 2 slices per day</li>
                    <li>• Continue daily walks, aim for 6000 steps</li>
                    <li>• Follow portion control using plate method</li>
                    <li>• Maintain regular meal timings</li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Monitoring at Home:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Check blood sugar: Fasting and 2 hours after meals (3 times/week)</li>
                    <li>• Check blood pressure: Twice weekly</li>
                    <li>• Daily foot examination</li>
                    <li>• Record all readings in diary</li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>When to Contact Doctor Immediately:</strong>
                  </p>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Blood sugar below 70 mg/dl or above 300 mg/dl</li>
                    <li>• Severe headache or vision changes</li>
                    <li>• Chest pain or breathing difficulty</li>
                    <li>• Foot injury or infection</li>
                    <li>• Persistent vomiting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vaccinations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Vaccinations Due</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                <li>• Pneumococcal vaccine - Due now</li>
                <li>• Influenza vaccine - Annual (Due now)</li>
                <li>• COVID-19 booster - As per guidelines</li>
              </ul>
            </CardContent>
          </Card>

          {/* Doctor's Signature */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600">Patient/Attendant Signature</p>
                <div className="mt-8 border-b border-gray-400 w-48"></div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Doctor's Signature</p>
                <div className="mt-8 border-b border-gray-400 w-48"></div>
                <p className="text-sm mt-2">Dr. [Doctor Name]</p>
                <p className="text-xs text-gray-500">Consultant Endocrinologist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .printable-content {
            font-size: 12px;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}
