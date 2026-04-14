(function() {
  var canvas = document.getElementById('rhythm-canvas');
  var card   = document.getElementById('rhythm-card');
  var ctx    = canvas.getContext('2d');

  var BAR_COUNT = 24;
  var BPM       = 128;
  var BEAT_MS   = 60000 / BPM;
  var bars      = [];
  var pulses    = [];
  var lastBeat  = 0;
  var beatPhase = 0;

  function initBars() {
    bars = [];
    for (var i = 0; i < BAR_COUNT; i++) {
      bars.push({
        height: Math.random() * 0.3 + 0.05,
        target: Math.random() * 0.6 + 0.1,
        speed:  Math.random() * 0.04 + 0.02,
        phase:  Math.random() * Math.PI * 2
      });
    }
  }

  function resize() {
    canvas.width  = card.offsetWidth;
    canvas.height = card.offsetHeight;
  }
  resize();
  window.addEventListener('resize', function() { resize(); initBars(); });
  initBars();

  function spawnPulse() {
    pulses.push({
      x:      canvas.width / 2,
      y:      canvas.height,
      radius: 0,
      maxR:   Math.max(canvas.width, canvas.height) * 0.6,
      alpha:  0.2
    });
  }

  var lastTime = 0;
  function loop(ts) {
    var dt = ts - lastTime;
    lastTime = ts;

    var elapsed = ts - lastBeat;
    beatPhase   = elapsed / BEAT_MS;
    if (elapsed >= BEAT_MS) {
      lastBeat  = ts;
      beatPhase = 0;
      spawnPulse();
    }

    var beatEnv = Math.max(0, 1 - beatPhase * 3.5);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var p = pulses.length - 1; p >= 0; p--) {
      var pulse = pulses[p];
      pulse.radius += (pulse.maxR / (BEAT_MS * 1.2)) * dt;
      pulse.alpha  -= dt / (BEAT_MS * 1.8);
      if (pulse.alpha <= 0) { pulses.splice(p, 1); continue; }
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 90, 90, ' + pulse.alpha.toFixed(3) + ')';
      ctx.lineWidth   = 1;
      ctx.stroke();
    }

    var eqHeight = Math.min(canvas.height * 0.22, 130);
    var barW     = canvas.width / BAR_COUNT;
    var gap      = barW * 0.22;

    for (var i = 0; i < bars.length; i++) {
      var b = bars[i];

      b.phase  += dt * 0.0015;
      var sway  = (Math.sin(b.phase) * 0.5 + 0.5);
      var kick  = beatEnv * (0.2 + (i % 3 === 0 ? 0.2 : 0));
      b.target  = Math.min(1, sway * 0.35 + 0.05 + kick);
      b.height += (b.target - b.height) * Math.min(1, b.speed * dt * 0.3);

      var bH = b.height * eqHeight;
      var bX = i * barW + gap / 2;
      var bY = canvas.height - bH;
      var bW = barW - gap;

      var ratio = b.height;
      var r  = 255;
      var g  = Math.round(90 + (1 - ratio) * 100);
      var bl = Math.round(90 + (1 - ratio) * 100);

      var grad = ctx.createLinearGradient(0, bY, 0, canvas.height);
      grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + bl + ', 0.9)');
      grad.addColorStop(1, 'rgba(255, 180, 180, 0.3)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bX, bY, bW, bH, [3, 3, 0, 0]);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
