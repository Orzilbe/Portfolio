/*  Uniform page entrance effect
    - Fades in the body
    - Slides up the top-bar, main content, and footer nav in sequence
    - Applies to every page that includes this script
*/
(function() {
  // Hide body immediately to prevent flash
  document.documentElement.style.opacity = '0';

  // Inject keyframes and transition styles
  var style = document.createElement('style');
  style.textContent =
    '@keyframes ptFadeSlideUp {' +
      'from { opacity: 0; transform: translateY(30px); }' +
      'to   { opacity: 1; transform: translateY(0); }' +
    '}' +
    '.pt-animate {' +
      'opacity: 0;' +
      'animation: ptFadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;' +
    '}';
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function() {
    // Reveal the page
    document.documentElement.style.opacity = '1';

    // Select the elements to animate in order
    var targets = [];
    var topBar = document.querySelector('.top-bar');
    var main = document.querySelector('main');
    var footerNav = document.querySelector('.footer-nav');

    if (topBar) targets.push(topBar);
    if (main) targets.push(main);
    if (footerNav) targets.push(footerNav);

    targets.forEach(function(el, i) {
      el.classList.add('pt-animate');
      el.style.animationDelay = (i * 0.15) + 's';
    });
  });
})();
