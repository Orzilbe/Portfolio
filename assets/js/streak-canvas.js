(function() {
  var canvas  = document.getElementById('streak-canvas');
  var ctx     = canvas.getContext('2d');
  var card    = document.getElementById('rh-card');
  var streaks = [];

  function resize() {
    canvas.width  = card.offsetWidth;
    canvas.height = card.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomStreak() {
    return {
      x:      -Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      speed:  Math.random() * 6 + 3,
      length: Math.random() * 180 + 60,
      width:  Math.random() * 1.5 + 0.3,
      alpha:  Math.random() * 0.18 + 0.04,
      hue:    Math.random() < 0.6 ? 0 : 210
    };
  }

  for (var i = 0; i < 22; i++) {
    var s = randomStreak();
    s.x = Math.random() * canvas.width;
    streaks.push(s);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < streaks.length; i++) {
      var s = streaks[i];
      s.x += s.speed;

      if (s.x > canvas.width + s.length) {
        streaks[i] = randomStreak();
        continue;
      }

      var grad = ctx.createLinearGradient(s.x - s.length, s.y, s.x, s.y);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'hsla(' + s.hue + ', 90%, 65%, ' + s.alpha + ')');

      ctx.beginPath();
      ctx.moveTo(s.x - s.length, s.y);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = s.width;
      ctx.stroke();
    }

    requestAnimationFrame(loop);
  }
  loop();
})();
