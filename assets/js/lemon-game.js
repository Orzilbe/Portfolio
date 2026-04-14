(function() {
  var card     = document.getElementById('gameCard');
  var canvas   = document.getElementById('gameCanvas');
  var ctx      = canvas.getContext('2d');
  var scoreEl  = document.getElementById('gameScore');

  var score     = 0;
  var items     = [];
  var basket    = { x: 0, w: 80, h: 50 };
  var lastTime  = 0;
  var spawnTimer = 0;
  var W, H;

  function resize() {
    W = card.offsetWidth;
    H = card.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    basket.x = W / 2 - basket.w / 2;
  }

  function spawnItem() {
    var isLemon = Math.random() > 0.3;
    items.push({
      x:        Math.random() * (W - 40),
      y:        -40,
      size:     30 + Math.random() * 10,
      speed:    90 + Math.random() * 80,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.5,
      type:     isLemon ? 'lemon' : 'leaf',
      emoji:    isLemon ? '\u{1F34B}' : '\u{1F343}'
    });
  }

  function showCatchEffect(x, y, isPlus) {
    var el = document.createElement('div');
    el.className  = 'catch-effect ' + (isPlus ? 'plus' : 'minus');
    el.textContent = isPlus ? '+1' : '-1';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    card.appendChild(el);
    el.addEventListener('animationend', function() { el.remove(); });
  }

  function update(dt) {
    spawnTimer += dt;
    if (spawnTimer > 1.0) {
      spawnItem();
      spawnTimer = 0;
    }

    var basketTop   = H - basket.h - 12;
    var basketLeft  = basket.x;
    var basketRight = basket.x + basket.w;

    for (var i = items.length - 1; i >= 0; i--) {
      var item = items[i];
      item.y        += item.speed * dt;
      item.rotation += item.rotSpeed * dt;

      var cx = item.x + item.size / 2;
      var cy = item.y + item.size / 2;

      if (cy > basketTop && cy < basketTop + basket.h &&
          cx > basketLeft && cx < basketRight) {
        if (item.type === 'lemon') {
          score++;
          showCatchEffect(cx, basketTop - 10, true);
        } else {
          score--;
          showCatchEffect(cx, basketTop - 10, false);
        }
        scoreEl.textContent = score;
        items.splice(i, 1);
        continue;
      }

      if (item.y > H + 50) items.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      ctx.save();
      ctx.translate(item.x + item.size / 2, item.y + item.size / 2);
      ctx.rotate(item.rotation);
      ctx.font = item.size + 'px serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, 0, 0);
      ctx.restore();
    }

    var bx = basket.x;
    var by = H - basket.h - 12;
    var bw = basket.w;
    var bh = basket.h;

    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 8);
    ctx.lineTo(bx + bw - 6, by + 8);
    ctx.lineTo(bx + bw - 14, by + bh);
    ctx.lineTo(bx + 14, by + bh);
    ctx.closePath();
    ctx.fillStyle   = '#c8883a';
    ctx.fill();
    ctx.strokeStyle = '#8b5e20';
    ctx.lineWidth   = 2;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139, 94, 32, 0.3)';
    ctx.lineWidth   = 1;
    for (var row = 1; row <= 3; row++) {
      var t     = row / 4;
      var ly    = by + 8 + t * (bh - 8);
      var inset = 6 + t * 8;
      ctx.beginPath();
      ctx.moveTo(bx + inset, ly);
      ctx.lineTo(bx + bw - inset, ly);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.ellipse(bx + bw / 2, by + 8, bw / 2 - 2, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle   = '#a06e2a';
    ctx.fill();
    ctx.strokeStyle = '#8b5e20';
    ctx.lineWidth   = 2.5;
    ctx.stroke();
  }

  function loop(timestamp) {
    var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function moveBasket(clientX) {
    var rect = card.getBoundingClientRect();
    var mx   = clientX - rect.left;
    basket.x = Math.max(0, Math.min(W - basket.w, mx - basket.w / 2));
  }

  card.addEventListener('mousemove', function(e) { moveBasket(e.clientX); });
  card.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) moveBasket(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  lastTime = performance.now();
  requestAnimationFrame(loop);
})();
