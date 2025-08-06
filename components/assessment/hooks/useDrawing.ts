import { useState, useRef } from "react";

export const useDrawing = () => {
	const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
	const [isDrawing, setIsDrawing] = useState(false);
	const [drawingData, setDrawingData] = useState<Record<string, any>>({});

	const startDrawing = (
		e: React.MouseEvent<HTMLCanvasElement>,
		assessmentName: string
	) => {
		setIsDrawing(true);
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
				ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
			}
		}
	};

	const draw = (
		e: React.MouseEvent<HTMLCanvasElement>,
		assessmentName: string
	) => {
		if (!isDrawing) return;
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
				ctx.stroke();
			}
		}
	};

	const stopDrawing = () => {
		setIsDrawing(false);
	};

	const clearDrawing = (assessmentName: string) => {
		const canvas = canvasRefs.current[assessmentName];
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
		}
	};

	return {
		canvasRefs,
		isDrawing,
		drawingData,
		setDrawingData,
		startDrawing,
		draw,
		stopDrawing,
		clearDrawing,
	};
};