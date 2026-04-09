// Inject shared mobile footer styles
(function() {
    var s = document.createElement("style");
    s.textContent = "@media (max-width: 600px) { .footer-nav { gap: 14px !important; flex-wrap: wrap !important; justify-content: center !important; padding: 16px 10px !important; } .footer-nav a { font-size: 12px !important; } }";
    document.head.appendChild(s);
})();

document.addEventListener("DOMContentLoaded", function() {
    var scriptTag = document.querySelector('script[src*="nav.js"]');
    var root = scriptTag.getAttribute("src").replace("assets/js/nav.js", "");

    // Make logo a clickable link to Home
    var logo = document.querySelector(".logo");
    if (logo && logo.tagName !== "A") {
        var link = document.createElement("a");
        link.href = root + "index.html";
        link.className = logo.className;
        link.textContent = logo.textContent;
        link.style.textDecoration = "none";
        link.style.color = "inherit";
        logo.parentNode.replaceChild(link, logo);
    }

    // Footer nav — hide link to current page
    var footerNav = document.querySelector(".footer-nav");
    if (!footerNav) return;

    var pages = [
        { href: root + "index.html", label: "Home", match: ["index.html", "/Portfolio", "/Portfolio/"] },
        { href: root + "public/about.html", label: "About Me", match: ["about.html"] },
        { href: root + "public/projects.html", label: "Projects", match: ["projects.html"] },
        { href: root + "public/contact.html", label: "Contact", match: ["contact.html"] },
    ];

    var path = window.location.pathname;
    var html = "";

    for (var i = 0; i < pages.length; i++) {
        var isCurrent = false;
        for (var j = 0; j < pages[i].match.length; j++) {
            if (path.endsWith(pages[i].match[j])) { isCurrent = true; break; }
        }
        // Also hide Projects link on individual project pages
        if (pages[i].label === "Projects" && path.indexOf("/projects/") !== -1) isCurrent = true;
        if (!isCurrent) {
            html += '<a href="' + pages[i].href + '">' + pages[i].label + '</a>';
        }
    }
    html += '<a href="https://www.linkedin.com/in/orzilberberg/" target="_blank">LinkedIn</a>';
    footerNav.innerHTML = html;
});
