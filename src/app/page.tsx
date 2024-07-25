"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import ImageUploader from './components/ImageUploader';
import DownloadButton from './components/DownloadButton';


export default function Index() {
	const [image, setImage] = useState<string>('');
	const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
	const [direction, setDirection] = useState<string>('');
	const [horizontalDirection, setHorizontalDirection] = useState<string>('');
	const [verticalDirection, setVerticalDirection] = useState<string>('');
	const [horizontalSliderValue, setHorizontalSliderValue] = useState(50);
	const [verticalSliderValue, setVerticalSliderValue] = useState(50);
	const [processedImage, setProcessedImage] = useState('');

	const handleImageUpload = (image: string | null) => {
		if (image) {
			setImage(image)
			setIsImageUploaded(true)
		}
		else {
			setIsImageUploaded(false)
		}
	};

	const handleDirectionChange = (button: string) => {
		setDirection(button);
	};

	const handleHorizontalDirectionChange = (button: string) => {
		setHorizontalDirection(button)
	}

	const handleVerticalDirectionChange = (button: string) => {
		setVerticalDirection(button)
	}

	const handleHorizontalSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHorizontalSliderValue(Number(event.target.value));
	};

	const handleVerticalSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setVerticalSliderValue(Number(event.target.value));
	};

	const getDragDirection = () => {
		if (direction === "vertical") {
			return verticalDirection;
		}
		else if (direction === "horizontal") {
			return horizontalDirection;
		}
	}

	const getSliderValue = () => {
		if (direction === "vertical") {
			return verticalSliderValue;
		}
		else if (direction === "horizontal") {
			return horizontalSliderValue;
		}
		else {
			return 50
		}
	}

	const handleRunClick = async () => {
		try {
			const response = await fetch('/api', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					image,
					direction,
					dragDirection: getDragDirection(),
					dragPosition: getSliderValue(),
				}),
			});
			const data = await response.json();
			setProcessedImage(data.processed_image);
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred');
		}
	};


	return (
		<div className={styles.page}>
			<div className="wrapper">
				<div className="container">
					<div id="welcome">
						<h1>
							<span> Hello there, welcome to Pixel Drag</span>
						</h1>
					</div>
					<div id="commands" className="rounded shadow">
						<ImageUploader onImageUpload={handleImageUpload} direction={direction} dragDirection={getDragDirection()} dragPosition={getSliderValue()} />
						{isImageUploaded && (
							<>
								<h1>Line Direction</h1>
								<div id="row">
									<button className={direction === "horizontal" ? "selected" : "unselected"} onClick={() => handleDirectionChange('horizontal')}>
										horizontal
									</button>
									<button className={direction === "vertical" ? "selected" : "unselected"} onClick={() => handleDirectionChange('vertical')}>
										vertical
									</button>
									<button className={direction === "y=x" ? "selected" : "unselected"} onClick={() => handleDirectionChange('y=x')}>
										on y=x
									</button>
								</div>
								{(direction === "vertical" || direction === "horizontal") && <h1>Drag Direction</h1>}
								{direction === "horizontal" && <div id="row">
									<button className={horizontalDirection === "up" ? "selected" : "unselected"} onClick={() => handleHorizontalDirectionChange('up')}>
										up
									</button>
									<button className={horizontalDirection === "down" ? "selected" : "unselected"} onClick={() => handleHorizontalDirectionChange('down')}>
										down
									</button>
								</div>}
								{direction === "vertical" && <div id="row">
									<button className={verticalDirection === "left" ? "selected" : "unselected"} onClick={() => handleVerticalDirectionChange('left')}>
										left
									</button>
									<button className={verticalDirection === "right" ? "selected" : "unselected"} onClick={() => handleVerticalDirectionChange('right')}>
										right
									</button>
								</div>}
								{(direction === "vertical" || direction === "horizontal") && <h1>Drag Position</h1>}
								{direction === "horizontal" && <div id="slider">
									<div>higher</div>
									<input
										type="range"
										min="20"
										max="80"
										value={horizontalSliderValue}
										onChange={handleHorizontalSliderChange}
									/>
									<div>lower</div>
								</div>}
								{direction === "vertical" && <div id="slider">
									<div>more left</div>
									<input
										type="range"
										min="20"
										max="80"
										value={verticalSliderValue}
										onChange={handleVerticalSliderChange}
									/>
									<div>more right</div>
								</div>}
								{direction && <div id="row">
									<button className="unselected" onClick={handleRunClick}>Run</button>
								</div>}
							</>
						)
						}
						{processedImage && (
							<div>
								<h2>Processed Image</h2>
								<DownloadButton image={processedImage} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
