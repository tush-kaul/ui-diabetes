"use client";

import { Suspense } from "react";
import PatientDashboardMain from "../components/patient-dashboard-main";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PatientDashboardMain />
		</Suspense>
	);
}
