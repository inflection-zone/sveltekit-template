<script lang="ts">
	import { onMount } from 'svelte';

	let { errorMessage = $bindable(), fileInput, previewImage, save, cancel } = $props();

	let croppedImage = null;
	let canvasElement: HTMLCanvasElement;
	let image = new Image();
	let isDrawing = false;
	let startPoint = { x: 0, y: 0 };
	let croppingArea = { x: 0, y: 0, width: 0, height: 0 };

	onMount(() => {
		if (previewImage) {
			image.src = previewImage;
			image.onload = redrawCanvas;
		}
	});

	function saveEvent(croppedImage) {
		save(croppedImage);
	}

	const cancelCrop = () => {
		cancel(false);
	};

	const redrawCanvas = () => {
		if (!canvasElement || !image.src) return;

		const ctx = canvasElement.getContext('2d');
		canvasElement.width = 900;
		canvasElement.height = 600; 

		ctx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);

		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

		if (croppingArea.width === 0 && croppingArea.height === 0) {
			croppingArea = {
				x: canvasElement.width / 4,
				y: canvasElement.height / 4,
				width: canvasElement.width / 2,
				height: canvasElement.height / 2
			};
		}

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(croppingArea.x, croppingArea.y, croppingArea.width, croppingArea.height);

		ctx.setLineDash([]);
		ctx.drawImage(
			image,
			croppingArea.x * (image.width / canvasElement.width),
			croppingArea.y * (image.height / canvasElement.height),
			croppingArea.width * (image.width / canvasElement.width),
			croppingArea.height * (image.height / canvasElement.height),
			croppingArea.x,
			croppingArea.y,
			croppingArea.width,
			croppingArea.height
		);
	};


	const startDrawing = (event) => {
		const rect = canvasElement.getBoundingClientRect();
		startPoint = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
		isDrawing = true;

		// Initialize cropping area directly at the mouse pointer
		croppingArea = { x: startPoint.x, y: startPoint.y, width: 0, height: 0 };
	};

	const drawRectangle = (event) => {
		if (!isDrawing) return;

		const rect = canvasElement.getBoundingClientRect();
		const currentPoint = {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};

		// Update cropping area based on the current mouse position
		croppingArea = {
			x: Math.min(startPoint.x, currentPoint.x),
			y: Math.min(startPoint.y, currentPoint.y),
			width: Math.abs(currentPoint.x - startPoint.x),
			height: Math.abs(currentPoint.y - startPoint.y)
		};

		// Redraw the canvas to show the cropping area
		redrawCanvas();
	};

	const stopDrawing = () => {
		isDrawing = false;
	};

	const handleCrop = () => {
		const ctx = canvasElement.getContext('2d');
		const croppedCanvas = document.createElement('canvas');
		croppedCanvas.width = croppingArea.width;
		croppedCanvas.height = croppingArea.height;

		const croppedCtx = croppedCanvas.getContext('2d');
		croppedCtx.drawImage(
			image,
			croppingArea.x * (image.width / canvasElement.width),
			croppingArea.y * (image.height / canvasElement.height),
			croppingArea.width * (image.width / canvasElement.width),
			croppingArea.height * (image.height / canvasElement.height),
			0,
			0,
			croppingArea.width,
			croppingArea.height
		);
		croppedImage = croppedCanvas.toDataURL('image/jpeg');
		saveEvent(croppedImage); 
		cancelCrop();
	};

	const MAX_FILE_SIZE = 1024 * 150;

	const onFileSelected = async (e) => {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		console.log(file, 'this is file');

		if (file && file.size > MAX_FILE_SIZE) {
			errorMessage.Text = 'File should be less than 150 KB';
			errorMessage.Colour = 'error-text';
			fileInput.value = '';
			cancelCrop();
			return;
		}

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				previewImage = reader.result;
				image.src = previewImage;
				image.onload = () => {
					redrawCanvas(); 
				};
			};
			reader.readAsDataURL(file);
		}
	};
</script>

<div
	class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
	role="dialog"
	aria-labelledby="cropModalTitle"
>
	<div class="bg-white rounded-lg shadow-lg h-[700px] w-[900px] relative p-4 flex flex-col">
		<h3 class="text-lg font-bold mb-4" id="cropModalTitle">Crop Image</h3>
		<canvas
			bind:this={canvasElement}
			class="flex-grow border border-gray-300"
			onmousedown={startDrawing}
			onmousemove={drawRectangle}
			onmouseup={stopDrawing}
			onmouseleave={stopDrawing}
			tabindex="0"
		></canvas>
		<div class="flex justify-between items-center mt-4">
			<label for="fileinput" class="text-blue-500 hover:underline cursor-pointer">
				Select Image
			</label>
			<input
				name="file"
				id="fileinput"
				type="file"
				class="hidden"
				accept="image/*"
				onchange={onFileSelected}
				bind:this={fileInput}
			/>
			<div class="flex gap-2">
				<button
					class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					onclick={handleCrop}
					tabindex="0"
				>
					Save
				</button>
				<button
					class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
					onclick={cancelCrop}
					tabindex="0"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	canvas {
		cursor: crosshair;
	}
</style>
