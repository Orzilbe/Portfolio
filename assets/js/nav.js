document.addEventListener("DOMContentLoaded", function() {
    const footerNav = document.querySelector(".footer-nav");
    if (!footerNav) return;

    // Derive root path from the nav.js script src (always at assets/js/nav.js from root)
    const scriptTag = document.querySelector('script[src*="nav.js"]');
    const root = scriptTag.getAttribute("src").replace("assets/js/nav.js", "");

    footerNav.innerHTML = `
        <a href="${root}index.html">Home</a>
        <a href="${root}public/about.html">About Me</a>
        <a href="${root}public/projects.html">Projects</a>
        <a href="${root}public/contact.html">Contact</a>
        <a href="https://www.linkedin.com/in/orzilberberg/" target="_blank">LinkedIn</a>
    `;
});
