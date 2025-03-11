/* Zero Contradictions Org-Mode Essays Javascript (https://zerocontradictions.net/programming/script.js) © 2025 by Zero Contradictions is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) */

document.addEventListener("DOMContentLoaded", function () {
	var TOC = document.getElementById("table-of-contents");
	var TOC_button = document.getElementById("TOC-link");

	const themeButton = document.getElementById("theme-link");
	const htmlElement = document.documentElement;
	let currentMode = localStorage.getItem("theme") || "auto";

	// Clicking the "CONTENTS" button toggles showing or hiding TOC.
	TOC_button.addEventListener("click", function (event) {
		event.preventDefault(); // Prevents default link behavior

		// Use computed style to check actual visibility
		if (getComputedStyle(TOC).display === "none") {
			TOC.style.display = "block";
		} else {
			TOC.style.display = "none";
		}
	});

	// Hide TOC when clicking a link inside it
	TOC.addEventListener("click", function (event) {
		if (event.target.tagName === "A") {
			TOC.style.display = "none";
		}
	});

	// Hide TOC when clicking outside of it (but not on navigation bar)
	document.addEventListener("click", function (event) {
		if (TOC.style.display === "block" &&
			!TOC.contains(event.target) &&
			event.target !== TOC_button) {
			TOC.style.display = "none";
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key.toLowerCase() === "c") {
			// Toggle TOC visibility
			if (TOC) {
				TOC.style.display = TOC.style.display === "none" || TOC.style.display === "" ? "block" : "none";
			}
		} else if (event.key.toLowerCase() === "d") {
			// Toggle dark mode based on current state
			currentMode = currentMode === "dark" ? "light" : "dark";
			applyTheme(currentMode);
		}
	});

	function applyTheme(mode) {
		htmlElement.classList.remove("light-mode", "dark-mode");

		if (mode === "dark") {
			htmlElement.classList.add("dark-mode");
			themeButton.textContent = "LIGHT";
			localStorage.setItem("theme", "dark");
		} else if (mode === "light") {
			htmlElement.classList.add("light-mode");
			themeButton.textContent = "DARK";
			localStorage.setItem("theme", "light");
		} else {
			themeButton.textContent = "DARK"; // Default when following system preference
			localStorage.removeItem("theme"); // Remove manual selection
		}
	}

	themeButton.addEventListener("click", (e) => {
		e.preventDefault(); // Prevents default link behavior
		currentMode = currentMode === "dark" ? "light" : "dark";
		applyTheme(currentMode);
	});

	// Apply saved mode or let the system decide
	applyTheme(currentMode);
});
