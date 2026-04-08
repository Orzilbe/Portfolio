document.addEventListener("DOMContentLoaded", function() {
    const footerNav = document.querySelector(".footer-nav");
    
    if (footerNav) {
        footerNav.innerHTML = `
            <a href="https://orzilbe.github.io/Portfolio">Home</a>
            <a href="https://orzilbe.github.io/Portfolio/public/about.html">About Me</a>
            <a href="https://orzilbe.github.io/Portfolio/public/projects.html">Projects</a>
            <a href="https://orzilbe.github.io/Portfolio/public/contact.html">Contact</a>
            <a href="https://www.linkedin.com/in/orzilberberg/" target="_blank">LinkedIn</a>
        `;
    }
});
