document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href]").forEach(link => {
        const url = new URL(link.href, window.location.origin);

        // Check if the link is external
        if (url.origin !== window.location.origin) {
            const faviconUrl = `${url.origin}/favicon.ico`;
            const favicon = document.createElement("img");

            favicon.src = faviconUrl;
            favicon.alt = "🔗"; // Fallback emoji if favicon doesn't load
            favicon.style.width = "16px";
            favicon.style.height = "16px";
            favicon.style.marginLeft = "4px";
            favicon.style.display = "inline-block";
            favicon.style.verticalAlign = "middle";

            link.appendChild(favicon);
        }
    });
});
