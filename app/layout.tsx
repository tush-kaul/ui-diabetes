import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
	title: "Diabetes Hypertension Patient Dashboard",
	description:
		"Comprehensive dashboard for managing diabetes and hypertension",
	// generator: "v0.dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
			</head>
			<body className="max-w-[95%] 2xl:max-w-[85%] mx-auto py-[5%]">
				{children}
			</body>
		</html>
	);
}
