'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		container.appendChild(canvas);

		const COLS = 30;
		const ROWS = 20;
		const DOT_RADIUS = 1.8;
		// Cap at 24 fps — smooth enough for a background, light on the CPU
		const INTERVAL = 1000 / 24;

		const setSize = () => {
			canvas.width = container.offsetWidth;
			canvas.height = container.offsetHeight;
		};
		setSize();

		let count = 0;
		let animId = 0;
		let lastTime = 0;
		let inView = true;

		const draw = (time: number) => {
			animId = requestAnimationFrame(draw);
			if (time - lastTime < INTERVAL) return;
			lastTime = time;

			const w = canvas.width;
			const h = canvas.height;
			const colGap = w / COLS;
			const rowGap = h / ROWS;

			ctx.clearRect(0, 0, w, h);

			for (let c = 0; c < COLS; c++) {
				for (let r = 0; r < ROWS; r++) {
					const wave = Math.sin((c + count) * 0.35) * 0.5 + Math.sin((r + count) * 0.55) * 0.5;
					const x = c * colGap + colGap / 2;
					const y = r * rowGap + rowGap / 2 + wave * 10;
					const opacity = 0.12 + wave * 0.14;

					ctx.beginPath();
					ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(0,243,141,${Math.max(0.04, opacity)})`;
					ctx.fill();
				}
			}

			count += 0.035;
		};

		const start = () => { lastTime = 0; animId = requestAnimationFrame(draw); };
		const stop = () => cancelAnimationFrame(animId);

		start();

		// Pause when hero scrolls out of view — no point animating off-screen
		const observer = new IntersectionObserver(([entry]) => {
			inView = entry.isIntersecting;
			if (inView) start(); else stop();
		}, { threshold: 0 });
		observer.observe(container);

		const onResize = () => setSize();
		const onVisibility = () => {
			if (document.hidden) stop();
			else if (inView) start();
		};

		window.addEventListener('resize', onResize);
		document.addEventListener('visibilitychange', onVisibility);

		return () => {
			stop();
			observer.disconnect();
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', onVisibility);
			canvas.remove();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
			{...props}
		>
			{/* Fade to page background at the bottom */}
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0A0A0A]" />
		</div>
	);
}
