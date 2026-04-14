(function() {
  var cards = document.querySelectorAll('.project-card');

  cards.forEach(function(card, i) {
    setTimeout(function() {
      card.classList.add('visible');
    }, 200 + i * 180);
  });

  cards.forEach(function(card) {
    var glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateY = ((x - centerX) / centerX) * 12;
      var rotateX = ((centerY - y) / centerY) * 12;

      card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.05)';
      glow.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.35) 0%, transparent 60%)';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
})();
