(function() {
  var card = document.getElementById('about-card');
  var canvas = document.getElementById('about-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: -999, y: -999 };

  function resize() {
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnParticle(x, y) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      radius: Math.random() * 5 + 2,
      alpha: 0.7,
      hue: Math.floor(Math.random() * 60) + 120
    });
    if (particles.length > 120) particles.shift();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.018;
      p.radius *= 0.97;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 60%, ' + p.alpha + ')';
      ctx.fill();
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  var lastSpawn = 0;
  card.addEventListener('mousemove', function(e) {
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    mouse.x = x; mouse.y = y;

    card.style.setProperty('--mx', (x / rect.width * 100) + '%');
    card.style.setProperty('--my', (y / rect.height * 100) + '%');

    var cx = rect.width / 2, cy = rect.height / 2;
    var tiltY = ((x - cx) / cx) * 6;
    var tiltX = ((cy - y) / cy) * 6;
    card.style.transform = 'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';

    var now = Date.now();
    if (now - lastSpawn > 30) {
      spawnParticle(x, y);
      lastSpawn = now;
    }
  });

  card.addEventListener('mouseleave', function() {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    mouse.x = -999; mouse.y = -999;
  });

  var paras = document.querySelectorAll('.bio-text p');
  var paraObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = Array.prototype.indexOf.call(paras, entry.target);
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, idx * 120);
        paraObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  paras.forEach(function(p) { paraObserver.observe(p); });

  var tags = document.querySelectorAll('.tag');
  var tagObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = Array.prototype.indexOf.call(tags, entry.target);
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, idx * 80);
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  tags.forEach(function(t) { tagObserver.observe(t); });
})();
