/* Zero Contradictions Org-Mode Essays Javascript (https://zerocontradictions.net/programming/script.js) © 2025 by Zero Contradictions is licensed under CC0 1.0 Universal (https://creativecommons.org/publicdomain/zero/1.0/) */
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

		// Changing id of <div> in floatingTOC to avoid HTML validation duplicate id error.
		// Assuming floatingTOC is a DOM element
		const firstDiv = floatingTOC.querySelector('div');
		firstDiv.id = 'text-floating-TOC';

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

	// Ensure main content has enough top margin to avoid being covered by topPanel
	function adjustContentMargin() {
		if (topPanel) {
			const topPanelHeight = topPanel.offsetHeight;
			const mainContent = document.querySelector('main, #content, .content, body > div:first-child');

			if (mainContent) {
				const currentMarginTop = parseInt(window.getComputedStyle(mainContent).marginTop) || 0;
				const requiredMargin = Math.max(currentMarginTop, topPanelHeight + 10); // 10px buffer
				mainContent.style.marginTop = requiredMargin + 'px';
			} else {
				// Fallback: add margin to body if no main content container found
				const currentBodyMarginTop = parseInt(window.getComputedStyle(document.body).marginTop) || 0;
				const requiredMargin = Math.max(currentBodyMarginTop, topPanelHeight + 10);
				document.body.style.marginTop = requiredMargin + 'px';
			}
		}
	}

	// Apply margin adjustment after page loads
	setTimeout(adjustContentMargin, 100);

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

	// Re-adjust margin on window resize (important for mobile orientation changes)
	window.addEventListener("resize", function() {
		setTimeout(adjustContentMargin, 100);
	});


	// FOOTNOTE TOOLTIPS
	// Create tooltip element
	const tooltip = document.createElement('div');
	// tooltip.id = 'footnote-tooltip'; // This was never used.
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
	// console.log('Footnote references found:', footrefs.length);

	// Find footnote container within footnotes section
	const footnoteSection = document.getElementById('footnotes');
	// console.log('Footnote section found:', !!footnoteSection);

	if (footnoteSection) {
		footrefs.forEach(footref => {
			// Extract footnote ID from href
			const footnoteId = footref.getAttribute('href').substring(1);
			// console.log('Processing footnote ID:', footnoteId);

			// Look for specific footnote container using more compatible selector
			const correspondingFootnoteContainer = Array.from(
				footnoteSection.querySelectorAll('div.footdef')
			).find(container => {
				const footnoteLink = container.querySelector(`a.footnum[id="${footnoteId}"]`);
				return footnoteLink !== null;
			});

			// console.log('Corresponding footnote container:', correspondingFootnoteContainer);

			// Find footnote paragraph
			const footnoteParaElement = correspondingFootnoteContainer
				  ? correspondingFootnoteContainer.closest('.footdef').querySelector('p.footpara')
				  : null;

			// console.log('Footnote paragraph element:', footnoteParaElement);

			if (correspondingFootnoteContainer) {
				// Find footnote paragraph
				const footnoteParaElement = correspondingFootnoteContainer.querySelector('p.footpara');

				if (footnoteParaElement) {
					footref.addEventListener('mouseover', (event) => {
						// console.log('Mouseover triggered');
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
	overlayImg.src = '/images/1x1-transparent-pixel.png';
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
	left: 20px;
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
	bottom: 60px;
	left: 0;
	background-color: rgba(0, 0, 0, 0.8);
	color: white;
	padding: 10px;
	border-radius: 5px;
	width: 400px;
	font-size: 30px;
	line-height: 1.5;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s, visibility 0.3s;
	text-align: left;
  `;
	helpTooltip.innerHTML = `
	<strong>Keyboard Shortcuts:</strong><br>
	← / → : Prev/Next image<br>
	Space : Reset size/position<br>
	ESC : Close viewer<br>
	c : Show TOC<br>
	d : Dark/Light Mode<br>
	<strong>Tip:</strong> On narrow screens, rotate device for better image viewing.
  `;
	// Double-click : Reset size/position<br>
	// Mouse wheel : Zoom in/out<br>
	// Drag : Pan image when zoomed

	// Navigation arrows - positioned at bottom right
	const prevArrow = document.createElement('div');
	prevArrow.className = 'nav-arrow prev';
	prevArrow.innerHTML = '&#10094;';
	prevArrow.style.cssText = `
	position: fixed;
	bottom: 20px;
	left: 90px;
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
	user-select: none;
  `;
	prevArrow.onmouseover = () => prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	prevArrow.onmouseout = () => prevArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

	const nextArrow = document.createElement('div');
	nextArrow.className = 'nav-arrow next';
	nextArrow.innerHTML = '&#10095;';
	nextArrow.style.cssText = `
	position: fixed;
	bottom: 20px;
	left: 150px;
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
	user-select: none;
  `;
	nextArrow.onmouseover = () => nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	nextArrow.onmouseout = () => nextArrow.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';

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
		const allImages = Array.from(document.querySelectorAll('img:not(.overlay-img)'));

		// Process only new images that haven't been initialized
		allImages.forEach((img, index) => {
			if (!img.dataset.galleryInitialized) {
				// For ALL images (including SVGs), use minimal approach
				// Don't create wrappers that can interfere with layout

				// Add click event directly to the image
				img.addEventListener('click', function() {
					const currentImages = Array.from(document.querySelectorAll('img:not(.overlay-img)'))
						.filter(i => i.dataset.galleryInitialized === 'true');
					const imgIndex = currentImages.indexOf(img);
					openOverlay(imgIndex);
				});

				// Add hover effects directly to image
				img.addEventListener('mouseenter', function() {
					img.style.cursor = 'zoom-in';
					// Create temporary tooltip
					if (!img.galleryTooltip) {
						const tooltip = document.createElement('div');
						tooltip.className = 'gallery-tooltip-temp';
						tooltip.textContent = 'Click to enlarge';
						tooltip.style.cssText = `
							position: absolute;
							background-color: rgba(0, 0, 0, 0.7);
							color: white;
							padding: 5px 10px;
							border-radius: 3px;
							font-size: 12px;
							pointer-events: none;
							z-index: 1000;
							opacity: 0;
							transition: opacity 0.3s ease;
						`;
						document.body.appendChild(tooltip);
						img.galleryTooltip = tooltip;
					}

					// Position tooltip and show it
					const rect = img.getBoundingClientRect();
					const tooltip = img.galleryTooltip;
					tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
					tooltip.style.top = (rect.bottom - 30) + 'px';
					tooltip.style.opacity = '1';
				});

				img.addEventListener('mouseleave', function() {
					img.style.cursor = '';
					if (img.galleryTooltip) {
						img.galleryTooltip.style.opacity = '0';
					}
				});

				// Clean up tooltip when image is removed
				img.addEventListener('DOMNodeRemoved', function() {
					if (img.galleryTooltip) {
						img.galleryTooltip.remove();
					}
				});

				img.dataset.galleryInitialized = 'true';
			}
		});

		// Update images array to include all initialized images
		images = allImages.filter(img => img.dataset.galleryInitialized === 'true');
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
			prevArrow.style.display = 'flex';
			nextArrow.style.display = 'flex';
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
