/* Zero Contradictions Org-Mode Essays Javascript (https://zerocontradictions.net/programming/script.js) © 2025 by Zero Contradictions is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) */

document.addEventListener("DOMContentLoaded", function () {
	var TOC = document.getElementById("table-of-contents");
	var TOC_button = document.getElementById("org-div-home-and-up").firstElementChild;

	// Clicking the "CONTENTS" button toggles showing or hiding TOC.
	TOC_button.addEventListener("click", function (event) {
		event.preventDefault(); // Prevents default link behavior
		TOC.style.display = TOC.style.display === "none" || TOC.style.display === "" ? "block" : "none";
	});

	// Hide TOC when clicking a link inside it
	TOC.addEventListener("click", function (event) {
		if (event.target.tagName === "A") {
			TOC.style.display = "none";
		}
	});

	// Hide TOC when clicking outside of it (but not on navigation bar; third condition check is necessary so that clicking "CONTENTS" shows TOC)
	document.addEventListener("click", function (event) {
		if (TOC.style.display === "block" && !TOC.contains(event.target) && event.target !== topBar) {
			TOC.style.display = "none";
		}
	});
});

function toggleLightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
