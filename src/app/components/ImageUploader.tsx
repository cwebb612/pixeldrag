"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
	onImageUpload: (image: string | null) => void;
	direction: string;
	dragDirection?: string;
	dragPosition?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, direction, dragDirection, dragPosition }) => {
	const [image, setImage] = useState<string | null>(null);

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
				onImageUpload(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setImage(null);
			onImageUpload('');
		}
	};

	const drawLine = () => {
		const canvas = document.getElementById('canvas') as HTMLCanvasElement;
		if (!canvas || !image) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.src = image;
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = 'red';
			ctx.lineWidth = 10;
			ctx.fillStyle = 'red';

			const verticalArrowOffset = canvas.height * 0.05
			const horizontalArrowOffset = canvas.height * 0.05

			if (direction === 'horizontal') {
				const y = canvas.height / 100 * (dragPosition || 50);
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
				ctx.stroke();

				if (dragDirection === 'up') {
					drawVerticalArrow(ctx, canvas.width / 2, y - verticalArrowOffset, horizontalArrowOffset, -verticalArrowOffset);
				} else if (dragDirection === 'down') {
					drawVerticalArrow(ctx, canvas.width / 2, y + verticalArrowOffset, horizontalArrowOffset, verticalArrowOffset);
				}
			} else if (direction === 'vertical') {
				const x = canvas.width / 100 * (dragPosition || 50);
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvas.height);
				ctx.stroke();

				if (dragDirection === 'right') {
					drawHorizontalArrow(ctx, x + verticalArrowOffset, canvas.height / 2, verticalArrowOffset, -horizontalArrowOffset);
				} else if (dragDirection === 'left') {
					drawHorizontalArrow(ctx, x - verticalArrowOffset, canvas.height / 2, -verticalArrowOffset, horizontalArrowOffset);
				}

			} else if (direction === 'y=x') {
				ctx.beginPath();
				ctx.moveTo(0, canvas.height);
				ctx.lineTo(canvas.width, 0);
				ctx.stroke();
			}
		};
	};

	const drawVerticalArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) => {
		ctx.beginPath();
		ctx.lineTo(x, y + dy);
		ctx.lineTo(x - dx / 2, y + dy / 2);
		ctx.lineTo(x + dx / 2, y + dy / 2);
		ctx.lineTo(x, y + dy);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.lineTo(x, y);
		ctx.lineTo(x, y + dy);
		ctx.stroke()
	};

	const drawHorizontalArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, dx: number, dy: number) => {
		ctx.beginPath();
		ctx.lineTo(x + dx, y);
		ctx.lineTo(x + dx / 2, y - dy / 2);
		ctx.lineTo(x + dx / 2, y + dy / 2);
		ctx.lineTo(x + dx, y);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.lineTo(x, y);
		ctx.lineTo(x + dx, y);
		ctx.stroke()
	};


	useEffect(() => {
		drawLine();
	}, [image, direction, dragDirection, dragPosition]);

	return (
		<div className={styles.imageUploader}>
			{image ? <canvas id="canvas" className={styles.canvas} /> : <div className={styles.placeholder}>Insert Image</div>}
			<input type="file" accept="image/*" onChange={handleImageChange} className={styles.input} />
		</div>
	);
};

export default ImageUploader;
