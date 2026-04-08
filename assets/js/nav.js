document.addEventListener("DOMContentLoaded", function() {
    const footerNav = document.querySelector(".footer-nav");
    
    if (footerNav) {
        footerNav.innerHTML = `
            <a href="/index.html">Home</a>
            <a href="/public/about.html">About Me</a>
            <a href="/public/projects.html">Projects</a>
            <a href="/public/contact.html">Contact</a>
            <a href="https://www.linkedin.com/in/orzilberberg/" target="_blank">LinkedIn</a>
        `;
    }
});