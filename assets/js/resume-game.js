(function () {
  'use strict';

  // ── Canvas setup (full-screen overlay) ─────────────────
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:800;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Bubble factory ──────────────────────────────────────
  var bubbles = [];

  function makeBubble() {
    var r = 10 + Math.random() * 22;
    return {
      x:     Math.random() * window.innerWidth,
      y:     window.innerHeight + r + 10,
      r:     r,
      baseR: r,
      speed: 0.4 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.6,
      alpha: 0.25 + Math.random() * 0.35,
      // pop animation
      popping:  false,
      popScale: 1,
      popAlpha: 1,
    };
  }

  // Seed initial bubbles already on-screen
  for (var i = 0; i < 10; i++) {
    var b = makeBubble();
    b.y = Math.random() * window.innerHeight;
    bubbles.push(b);
  }

  // Spawn new bubbles continuously
  setInterval(function () {
    if (bubbles.length < 18) bubbles.push(makeBubble());
  }, 900);

  // ── Mouse position (for pop detection) ─────────────────
  var mx = -999, my = -999;
  window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

  // ── Pop a bubble ────────────────────────────────────────
  function popBubble(b) {
    if (b.popping) return;
    b.popping  = true;
    b.popScale = 1;
    b.popAlpha = 1;
  }

  // ── Draw loop ───────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];

      if (b.popping) {
        // Expand and fade ring
        b.popScale += 0.12;
        b.popAlpha -= 0.07;

        if (b.popAlpha <= 0) {
          bubbles.splice(i, 1);
          continue;
        }

        var pr = b.baseR * b.popScale;
        ctx.beginPath();
        ctx.arc(b.x, b.y, pr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(61,191,110,' + b.popAlpha.toFixed(2) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Second outer ring, slightly delayed
        ctx.beginPath();
        ctx.arc(b.x, b.y, pr * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,' + (b.popAlpha * 0.5).toFixed(2) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
        continue;
      }

      // Float upward
      b.y    -= b.speed;
      b.x    += b.drift;

      // Respawn if off top
      if (b.y < -b.r * 2) {
        bubbles.splice(i, 1);
        continue;
      }

      // Pop check — hover proximity
      var dx = mx - b.x, dy = my - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < b.r + 6) {
        popBubble(b);
        continue;
      }

      // Draw bubble
      var g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1, b.x, b.y, b.r);
      g.addColorStop(0, 'rgba(255,255,255,' + (b.alpha * 0.9).toFixed(2) + ')');
      g.addColorStop(0.5, 'rgba(212,255,217,' + (b.alpha * 0.6).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(61,191,110,' + (b.alpha * 0.3).toFixed(2) + ')');

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Rim
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(61,191,110,' + (b.alpha * 0.8).toFixed(2) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glint
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.28, b.y - b.r * 0.3, b.r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (b.alpha * 1.4 > 1 ? 1 : b.alpha * 1.4).toFixed(2) + ')';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();

  // ── Click sparks (kept — user loved these) ──────────────
  document.addEventListener('click', function (e) {
    var colors = ['#3dbf6e', '#7aff9e', '#d4ffd9', '#ffffff', '#b2ffc8'];
    for (var i = 0; i < 10; i++) {
      var spark = document.createElement('div');
      spark.className = 'click-spark';
      var angle = (i / 10) * Math.PI * 2;
      var dist  = 28 + Math.random() * 32;
      spark.style.cssText =
        'left:'       + e.clientX + 'px;' +
        'top:'        + e.clientY + 'px;' +
        '--dx:'       + (Math.cos(angle) * dist).toFixed(1) + 'px;' +
        '--dy:'       + (Math.sin(angle) * dist).toFixed(1) + 'px;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';';
      document.body.appendChild(spark);
      setTimeout(function (el) { el.remove(); }, 650, spark);
    }
  });

})();
