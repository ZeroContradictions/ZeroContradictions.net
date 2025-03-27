/* Zero Contradictions Org-Mode Essays Javascript (https://zerocontradictions.net/programming/script.js) © 2025 by Zero Contradictions is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) */
document.addEventListener("DOMContentLoaded", function () {
	// NAVIGATION BAR
	let topPanel = document.getElementById("org-div-home-and-up");
	const originalTOC = document.getElementById("table-of-contents");
	const TOC_button = document.getElementById("TOC-link");
	let lastScrollY = window.scrollY;

	// Clone originalTOC
	if (originalTOC) {
		var floatingTOC = originalTOC.cloneNode(true);
		floatingTOC.id = "floating-toc";
		floatingTOC.style.display = "none";

		// Add floating TOC to body
		document.body.appendChild(floatingTOC);
	}

	// Clicking "CONTENTS" button toggles showing or hiding floatingTOC.
	TOC_button.addEventListener("click", function (event) {
		event.preventDefault(); // Prevents default link behavior
		floatingTOC.style.display = floatingTOC.style.display === "none" ? "block" : "none";
	});

	// Hide floatingTOC when clicking any link inside it
	floatingTOC.addEventListener("click", function (event) {
		if (event.target.tagName === "A") {
			floatingTOC.style.display = "none";
		}
	});

	// Hide floatingTOC when clicking outside of it (but not on navigation bar)
	document.addEventListener("click", function (event) {
		if (floatingTOC.style.display === "block" &&
			!floatingTOC.contains(event.target) &&
			event.target !== TOC_button) {
			floatingTOC.style.display = "none";
		}
	});

	window.addEventListener("scroll", function () {
		const currentScrollY = window.scrollY;

		if (currentScrollY > lastScrollY) {
			// Hide topPanel when scrolling down
			topPanel.style.top = "-10rem";
			// floatingTOC.style.display = "none"; // Hide TOC
		} else {
			// Show topPanel when scrolling up
			topPanel.style.top = "0";
		}

		lastScrollY = currentScrollY;
	});


	// FOOTNOTE TOOLTIPS
	// Create tooltip element
	const tooltip = document.createElement('div');
	tooltip.id = 'footnote-tooltip';
	tooltip.style.cssText = `
	position: absolute;
	background-color: #f4f5f6;
	padding: 0.625rem;
	border-radius: 0.3125rem;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	display: none;
	z-index: 1000;
	max-width: 24rem;
	font-size: 100%;
	line-height: 1.5;
  `;
	// border: 1px solid #ccc;
	document.body.appendChild(tooltip);

	// Select footnote references
	const footrefs = document.querySelectorAll('a.footref');
	console.log('Footnote references found:', footrefs.length);

	// Find footnote container within footnotes section
	const footnoteSection = document.getElementById('footnotes');
	console.log('Footnote section found:', !!footnoteSection);

	if (footnoteSection) {
		footrefs.forEach(footref => {
			// Extract footnote ID from href
			const footnoteId = footref.getAttribute('href').substring(1);
			console.log('Processing footnote ID:', footnoteId);

			// Look for specific footnote container using more compatible selector
			const correspondingFootnoteContainer = Array.from(
				footnoteSection.querySelectorAll('div.footdef')
			).find(container => {
				const footnoteLink = container.querySelector(`a.footnum[id="${footnoteId}"]`);
				return footnoteLink !== null;
			});

			console.log('Corresponding footnote container:', correspondingFootnoteContainer);

			// Find footnote paragraph
			const footnoteParaElement = correspondingFootnoteContainer
				  ? correspondingFootnoteContainer.closest('.footdef').querySelector('p.footpara')
				  : null;

			console.log('Footnote paragraph element:', footnoteParaElement);

			if (correspondingFootnoteContainer) {
				// Find footnote paragraph
				const footnoteParaElement = correspondingFootnoteContainer.querySelector('p.footpara');

				if (footnoteParaElement) {
					footref.addEventListener('mouseover', (event) => {
						console.log('Mouseover triggered');
						// Calculate tooltip position
						const rect = event.target.getBoundingClientRect();

						// Position and show tooltip
						tooltip.innerHTML = footnoteParaElement.innerHTML;
						tooltip.style.left = `${rect.right + 10}px`;
						tooltip.style.top = `${window.scrollY + rect.top}px`;
						tooltip.style.display = 'block';
					});

					footref.addEventListener('mouseout', () => {
						tooltip.style.display = 'none';
					});
				}
			}
		});
	}

	// Hide tooltip on scroll and resize
	['scroll', 'resize'].forEach(evt => {
		window.addEventListener(evt, () => {
			tooltip.style.display = 'none';
		});
	});


	// LIGHT/DARK THEME TOGGLE
	const themeButton = document.getElementById("theme-link");
	const htmlElement = document.documentElement;
	let currentMode = localStorage.getItem("theme") || "auto";

	function applyTheme(mode) {
		htmlElement.classList.remove("light-mode", "dark-mode");

		if (mode === "dark") {
			htmlElement.classList.add("dark-mode");
			themeButton.textContent = "LIGHT";
			localStorage.setItem("theme", "dark");

			tooltip.style.backgroundColor = '#222222';
			tooltip.style.color = '#F4F5F6';
		} else if (mode === "light") {
			htmlElement.classList.add("light-mode");
			themeButton.textContent = "DARK";
			localStorage.setItem("theme", "light");

			tooltip.style.backgroundColor = '#f9f9f9';
			tooltip.style.color = 'black';
		} else {
			themeButton.textContent = "DARK"; // Default when following system preference
			localStorage.removeItem("theme"); // Remove manual selection

			tooltip.style.backgroundColor = '#222222';
			tooltip.style.color = '#F4F5F6';
		}
	}

	themeButton.addEventListener("click", (e) => {
		e.preventDefault(); // Prevents default link behavior
		currentMode = currentMode === "dark" ? "light" : "dark";
		applyTheme(currentMode);
	});

	// Apply saved mode or let system decide
	applyTheme(currentMode);


	// KEYBOARD SHORTCUTS
	document.addEventListener("keydown", function (event) {
		if (event.ctrlKey || event.altKey || event.metaKey) {
			return; // Exit if Ctrl, Alt, or Meta keys are held down
		}
		if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.tagName === "SELECT") {
			return; // Exit if typing text in fields.
		}
		if (event.key.toLowerCase() === "c") {
			// Toggle floatingTOC visibility
			if (floatingTOC) {
				floatingTOC.style.display = floatingTOC.style.display === "none" ? "block" : "none";
			}
		} else if (event.key.toLowerCase() === "d") {
			// Toggle dark mode based on current state
			currentMode = currentMode === "dark" ? "light" : "dark";
			applyTheme(currentMode);
		}
	});


	// IMAGE GALLERY VIEWER WITH HOVER EFFECTS
	// Create overlay elements
	const overlay = document.createElement('div');
	overlay.className = 'image-overlay';
	overlay.style.cssText = `
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6); /* Less dark background */
	display: none;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	overflow: hidden;
  `;

	const imgContainer = document.createElement('div');
	imgContainer.className = 'overlay-img-container';
	imgContainer.style.cssText = `
	position: relative;
	max-width: 90%;
	max-height: 90%;
	overflow: visible;
  `;

	const overlayImg = document.createElement('img');
	overlayImg.className = 'overlay-img';
	overlayImg.style.cssText = `
	max-width: 100%;
	max-height: 80vh; /* Reduced to leave room for caption */
	cursor: grab;
	transition: transform 0.2s ease;
  `;

	// Image caption container
	const captionContainer = document.createElement('div');
	captionContainer.className = 'caption-container';
	captionContainer.style.cssText = `
	position: absolute;
	top: 100%; // Display captions directly below images
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 10px;
	text-align: center;
	font-size: 36px;
  `;

	// Image counter display
	const imageCounter = document.createElement('div');
	imageCounter.className = 'image-counter';
	imageCounter.style.cssText = `
	position: fixed;
	top: 20px;
	left: 20px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	padding: 5px 10px;
	border-radius: 3px;
	font-size: 36px;
	z-index: 1010;
  `;

	// Close button
	const closeButton = document.createElement('div');
	closeButton.className = 'close-button';
	closeButton.innerHTML = '&#10005;'; // X symbol
	closeButton.style.cssText = `
	position: fixed;
	top: 20px;
	right: 20px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 36px;
	z-index: 1010;
	transition: background-color 0.3s;
  `;
	closeButton.onmouseover = () => closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	closeButton.onmouseout = () => closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

	// Help button
	const helpButton = document.createElement('div');
	helpButton.className = 'help-button';
	helpButton.innerHTML = '?'; // Question mark
	helpButton.style.cssText = `
	position: fixed;
	bottom: 20px;
	right: 20px;
	background-color: rgba(0, 0, 0, 0.6);
	color: white;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: 36px;
	z-index: 1010;
	transition: background-color 0.3s;
  `;

	// Help tooltip
	const helpTooltip = document.createElement('div');
	helpTooltip.className = 'help-tooltip';
	helpTooltip.style.cssText = `
	position: absolute;
	bottom: 40px;
	right: 0;
	background-color: rgba(0, 0, 0, 0.8);
	color: white;
	padding: 10px;
	border-radius: 5px;
	width: 500px;
	font-size: 30px;
	line-height: 1.5;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s, visibility 0.3s;
	text-align: left;
  `;
	helpTooltip.innerHTML = `
	<strong>Keyboard Shortcuts:</strong><br>
	← / → : Previous/Next image<br>
	Space : Reset image size/position<br>
	ESC : Close viewer<br>
	c : Show Table of Contents<br>
	d : Dark/Light Mode
  `;
	// Double-click : Reset size/position<br>
	// Mouse wheel : Zoom in/out<br>
	// Drag : Pan image when zoomed

	// Navigation arrows
	const prevArrow = document.createElement('div');
	prevArrow.className = 'nav-arrow prev';
	prevArrow.innerHTML = '&#10094;';
	prevArrow.style.cssText = `
	position: absolute;
	top: 50%;
	left: 20px;
	font-size: 40px;
	color: white;
	cursor: pointer;
	user-select: none;
	opacity: 0.7;
	transition: opacity 0.2s;
	z-index: 1010;
  `;
	prevArrow.onmouseover = () => prevArrow.style.opacity = '1';
	prevArrow.onmouseout = () => prevArrow.style.opacity = '0.7';

	const nextArrow = document.createElement('div');
	nextArrow.className = 'nav-arrow next';
	nextArrow.innerHTML = '&#10095;';
	nextArrow.style.cssText = `
	position: absolute;
	top: 50%;
	right: 20px;
	font-size: 40px;
	color: white;
	cursor: pointer;
	user-select: none;
	opacity: 0.7;
	transition: opacity 0.2s;
	z-index: 1010;
  `;
	nextArrow.onmouseover = () => nextArrow.style.opacity = '1';
	nextArrow.onmouseout = () => nextArrow.style.opacity = '0.7';

	// Help button hover effect
	helpButton.addEventListener('mouseenter', function() {
		helpTooltip.style.opacity = '1';
		helpTooltip.style.visibility = 'visible';
		helpButton.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	});

	helpButton.addEventListener('mouseleave', function() {
		helpTooltip.style.opacity = '0';
		helpTooltip.style.visibility = 'hidden';
		helpButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
	});

	// Append all elements
	helpButton.appendChild(helpTooltip);
	imgContainer.appendChild(overlayImg);
	imgContainer.appendChild(captionContainer);
	overlay.appendChild(imgContainer);
	overlay.appendChild(prevArrow);
	overlay.appendChild(nextArrow);
	overlay.appendChild(imageCounter);
	overlay.appendChild(closeButton);
	overlay.appendChild(helpButton);
	document.body.appendChild(overlay);

	// Create custom cursor
	const cursorCSS = document.createElement('style');
	cursorCSS.innerHTML = `
	.zoom-cursor {
	  cursor: zoom-in;
	}
  `;
	document.head.appendChild(cursorCSS);

	// Variables for image handling
	let images = [];
	let currentIndex = 0;
	let scale = 1;
	let translateX = 0;
	let translateY = 0;
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let lastX = 0;
	let lastY = 0;

	// Function to check if file is an SVG
	function isSVG(img) {
		// Check file extension in src
		if (img.src && img.src.toLowerCase().endsWith('.svg')) {
			return true;
		}
		// Also check for SVG MIME type or content type if available
		return img.getAttribute('type') === 'image/svg+xml';
	}

	// Find all images on page
	function collectImages() {
		images = Array.from(document.querySelectorAll('img:not(.overlay-img)'));

		// Add events to each image
		images.forEach((img, index) => {
			if (!img.dataset.galleryInitialized) {
				// Get computed styles of original image
				const computedStyle = window.getComputedStyle(img);
				const displayStyle = computedStyle.display;
				const marginLeft = computedStyle.marginLeft;
				const marginRight = computedStyle.marginRight;
				const float = computedStyle.float;
				const textAlign = window.getComputedStyle(img.parentNode).textAlign;

				// Skip SVG initialization if we can't display it properly in the overlay
				if (isSVG(img)) {
					// Just add a click event to open the SVG in overlay without wrapper modification
					img.addEventListener('click', function() {
						openOverlay(index);
					});
					img.dataset.galleryInitialized = 'true';
					return;
				}

				// Create wrapper to contain the image and the tooltip
				const wrapper = document.createElement('div');
				wrapper.className = 'gallery-img-wrapper';

				// Apply styles that preserve alignment including float
				const wrapperStyles = [
					'position: relative',
					'overflow: visible',
					'vertical-align: middle'
				];

				// Handle display style
				wrapperStyles.push(`display: ${displayStyle === 'inline' ? 'inline-block' : displayStyle}`);

				// Handle margins
				if (marginLeft === marginRight && marginLeft !== '0px') {
					wrapperStyles.push(`margin-left: ${marginLeft}; margin-right: ${marginRight};`);
				} else {
					wrapperStyles.push(`margin-left: ${marginLeft}; margin-right: ${marginRight};`);
				}

				// Handle center alignment cases
				if (marginLeft === 'auto' && marginRight === 'auto') {
					wrapperStyles.push('margin-left: auto; margin-right: auto; display: block;');
				}

				// Handle floating images - this preserves float alignment
				if (float && float !== 'none') {
					wrapperStyles.push(`float: ${float};`);
				}

				// Handle text alignment
				if (textAlign === 'center') {
					wrapperStyles.push('text-align: center;');
				}

				// Width handling
				if (img.style.width) {
					wrapperStyles.push(`width: ${img.style.width};`);
				}

				wrapper.style.cssText = wrapperStyles.join(';');

				// Create tooltip
				const tooltip = document.createElement('div');
				tooltip.className = 'gallery-tooltip';
				tooltip.textContent = 'Click to enlarge';
				tooltip.style.cssText = `
					position: absolute;
					bottom: 10px;
					left: 50%;
					transform: translateX(-50%);
					background-color: rgba(0, 0, 0, 0.7);
					color: white;
					padding: 5px 10px;
					border-radius: 3px;
					font-size: 12px;
					opacity: 0;
					transition: opacity 0.3s ease;
					pointer-events: none;
					z-index: 10;
				`;

				// Clone original image to preserve all attributes and properties
				const imgClone = img.cloneNode(true);

				// Copy any inline styles from original image
				if (img.getAttribute('style')) {
					// Remove any position styles that might conflict with our gallery
					const inlineStyles = img.getAttribute('style')
						.split(';')
						.filter(style => !style.trim().startsWith('position:'))
						.join(';');
					imgClone.setAttribute('style', inlineStyles);
				}

				// Preserve class names for any CSS styling
				imgClone.className = img.className;

				// Replace image with wrapper and use the clone
				const parent = img.parentNode;
				parent.replaceChild(wrapper, img);
				wrapper.appendChild(imgClone);
				wrapper.appendChild(tooltip);

				// Update images array to reference new cloned image
				images[index] = imgClone;

				// Add hover effects
				wrapper.addEventListener('mouseenter', function() {
					tooltip.style.opacity = '1';
					imgClone.classList.add('zoom-cursor');
				});

				wrapper.addEventListener('mouseleave', function() {
					tooltip.style.opacity = '0';
					imgClone.classList.remove('zoom-cursor');
				});

				// Add click event
				wrapper.addEventListener('click', function() {
					openOverlay(index);
				});

				imgClone.dataset.galleryInitialized = 'true';
			}
		});
	}

	// Get caption for an image
	function getImageCaption(imgElement) {
		// First check if the image is inside a figure with a figcaption
		const figure = findAncestor(imgElement, 'figure');
		if (figure) {
			const figcaption = figure.querySelector('figcaption');
			if (figcaption) {
				return figcaption.innerHTML;
			}
		}

		// Fallback to alt text
		return imgElement.alt || '';
	}

	// Helper to find ancestor element
	function findAncestor(element, tagName) {
		while (element && element.tagName !== tagName.toUpperCase()) {
			element = element.parentElement;
		}
		return element;
	}

	// Open overlay with selected image
	function openOverlay(index) {
		currentIndex = index;
		showImage(currentIndex);
		overlay.style.display = 'flex';
		resetImagePosition();
	}

	// Special handling for SVG display
	function handleSVGinOverlay(img) {
		// For SVGs, we need special handling
		// Option 1: Use the SVG directly if it's an embedded SVG
		if (img.src && img.src.toLowerCase().endsWith('.svg')) {
			// Preserve aspect ratio for SVGs
			overlayImg.style.objectFit = 'contain';
			return true;
		}
		return false;
	}

	// Display current image
	function showImage(index) {
		if (images.length === 0) return;

		// Ensure index is within bounds
		currentIndex = (index + images.length) % images.length;

		const img = images[currentIndex];
		overlayImg.src = img.src;
		overlayImg.alt = img.alt;

		// Special handling for SVGs
		const isSvgImage = isSVG(img);
		if (isSvgImage) {
			handleSVGinOverlay(img);
		} else {
			// Reset to default styles for regular images
			overlayImg.style.objectFit = '';
		}

		// Update caption
		const caption = getImageCaption(img);
		captionContainer.innerHTML = caption;
		captionContainer.style.display = caption ? 'block' : 'none';

		// Update counter
		imageCounter.textContent = `${currentIndex + 1} of ${images.length}`;

		// Hide arrows if only one image
		if (images.length <= 1) {
			prevArrow.style.display = 'none';
			nextArrow.style.display = 'none';
		} else {
			prevArrow.style.display = 'block';
			nextArrow.style.display = 'block';
		}
	}

	// Reset image position and scale
	function resetImagePosition() {
		scale = 1;
		translateX = 0;
		translateY = 0;
		updateImageTransform();
	}

	// Update image transform based on scale and position
	function updateImageTransform() {
		overlayImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
	}

	// Navigation functions
	function prevImage() {
		showImage(currentIndex - 1);
		resetImagePosition();
	}

	function nextImage() {
		showImage(currentIndex + 1);
		resetImagePosition();
	}

	// Close the overlay
	function closeOverlay() {
		overlay.style.display = 'none';
	}

	// Event listeners
	prevArrow.addEventListener('click', prevImage);
	nextArrow.addEventListener('click', nextImage);
	closeButton.addEventListener('click', closeOverlay);

	overlay.addEventListener('click', function(e) {
		if (e.target === overlay) {
			closeOverlay();
		}
	});

	// Keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (overlay.style.display === 'none') return;

		switch (e.key) {
		case 'ArrowLeft':
			prevImage();
			break;
		case 'ArrowRight':
			nextImage();
			break;
		case 'Escape':
			closeOverlay();
			break;
		case ' ': // Space bar
			e.preventDefault();
			resetImagePosition();
			break;
		}
	});

	// Initialize by collecting all images
	collectImages();

	// Re-collect images if DOM changes (for dynamically added images)
	const observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList') {
				collectImages();
			}
		});
	});

	observer.observe(document.body, { childList: true, subtree: true });
});
