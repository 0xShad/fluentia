'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		// Always use the full window for sizing
		const getSize = () => ({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		const { width, height } = getSize();

		// Scene setup
		const scene = new THREE.Scene();
		// No fog — pure transparent background so dark page shows through
		scene.background = null;

		const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
		// Position camera high and back so we see the full wave grid
		camera.position.set(0, 600, 1500);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.setClearColor(0x000000, 0); // fully transparent

		const canvas = renderer.domElement;
		// Canvas is fixed; the parent section clips it via overflow-hidden
		canvas.style.position = 'absolute';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		containerRef.current.appendChild(canvas);

		// Geometry
		const positions: number[] = [];
		const colors: number[] = [];
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions.push(
					ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
					0,
					iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
				);
				// Fluentia Neon Green #00F38D
				colors.push(0.0, 0.953, 0.553);
			}
		}

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 6,
			vertexColors: true,
			transparent: true,
			opacity: 0.6,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const posAttr = geometry.attributes.position;
			const pos = posAttr.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					pos[i * 3 + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;
					i++;
				}
			}
			posAttr.needsUpdate = true;
			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			const { width, height } = getSize();
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};

		window.addEventListener('resize', handleResize);
		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationId);
			geometry.dispose();
			material.dispose();
			renderer.dispose();
			if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
			{...props}
		/>
	);
}
