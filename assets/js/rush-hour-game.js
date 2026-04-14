(function() {

  /* ── Level data ── */
  var LEVELS = [
    { name: "Level 1 — Ambulance Intro", description: "Use the ambulance to jump over blocking cars",
      cars: [
        { id:'red',       type:'red',       x:2, y:2, length:2, direction:'horizontal', color:'#ef4444' },
        { id:'white',     type:'normal',    x:0, y:2, length:2, direction:'horizontal', color:'#e5e7eb' },
        { id:'yellow',    type:'normal',    x:4, y:0, length:3, direction:'vertical',   color:'#fcd34d' },
        { id:'pink',      type:'normal',    x:2, y:4, length:2, direction:'vertical',   color:'#f9a8d4' },
        { id:'ambulance', type:'ambulance', x:3, y:4, length:2, direction:'horizontal', color:'#f97316' },
      ]},
    { name: "Level 2 — Police Intro", description: "Use the police car's free movement ability",
      cars: [
        { id:'red',    type:'red',    x:2, y:2, length:2, direction:'horizontal', color:'#ef4444' },
        { id:'police', type:'police', x:4, y:1, length:2, direction:'vertical',   color:'#1f2937' },
        { id:'carZ',   type:'normal', x:0, y:3, length:3, direction:'horizontal', color:'#06b6d4' },
        { id:'carP',   type:'normal', x:2, y:4, length:2, direction:'vertical',   color:'#ec4899' },
        { id:'carB',   type:'normal', x:4, y:3, length:2, direction:'vertical',   color:'#8b5cf6' },
        { id:'carC',   type:'normal', x:5, y:2, length:3, direction:'vertical',   color:'#14b8a6' },
        { id:'carY',   type:'normal', x:3, y:5, length:3, direction:'horizontal', color:'#fcd34d' },
      ]},
    { name: "Level 3 — Tow Truck", description: "Remove the stuck car to clear the path",
      cars: [
        { id:'red',   type:'red',    x:3, y:2, length:2, direction:'horizontal', color:'#ef4444' },
        { id:'tow',   type:'tow',    x:4, y:4, length:2, direction:'horizontal', color:'#9333ea' },
        { id:'stuck', type:'stuck',  x:1, y:3, length:2, direction:'vertical',   color:'#92400e' },
        { id:'carZ',  type:'normal', x:2, y:0, length:3, direction:'vertical',   color:'#06b6d4' },
        { id:'carB',  type:'normal', x:4, y:0, length:2, direction:'vertical',   color:'#8b5cf6' },
        { id:'carC',  type:'normal', x:5, y:1, length:3, direction:'vertical',   color:'#14b8a6' },
        { id:'carD',  type:'normal', x:3, y:3, length:3, direction:'vertical',   color:'#f59e0b' },
      ]},
    { name: "Level 4 — Police + Stuck Car", description: "Use police car to maneuver around stuck car",
      cars: [
        { id:'red',    type:'red',    x:0, y:2, length:2, direction:'horizontal', color:'#ef4444' },
        { id:'police', type:'police', x:1, y:4, length:2, direction:'horizontal', color:'#1f2937' },
        { id:'stuck',  type:'stuck',  x:0, y:3, length:2, direction:'vertical',   color:'#92400e' },
        { id:'carZ',   type:'normal', x:0, y:0, length:3, direction:'horizontal', color:'#06b6d4' },
        { id:'carB',   type:'normal', x:4, y:0, length:2, direction:'vertical',   color:'#8b5cf6' },
        { id:'carC',   type:'normal', x:5, y:0, length:2, direction:'vertical',   color:'#14b8a6' },
        { id:'carD',   type:'normal', x:2, y:2, length:2, direction:'vertical',   color:'#f59e0b' },
        { id:'carE',   type:'normal', x:4, y:3, length:2, direction:'horizontal', color:'#10b981' },
        { id:'carF',   type:'normal', x:3, y:4, length:3, direction:'horizontal', color:'#6366f1' },
      ]},
    { name: "Level 5 — Ultimate Challenge", description: "Combine tow truck and ambulance abilities",
      cars: [
        { id:'red',       type:'red',       x:2, y:2, length:2, direction:'horizontal', color:'#ef4444' },
        { id:'tow',       type:'tow',       x:0, y:3, length:2, direction:'horizontal', color:'#9333ea' },
        { id:'ambulance', type:'ambulance', x:4, y:5, length:2, direction:'horizontal', color:'#f97316' },
        { id:'stuck',     type:'stuck',     x:5, y:2, length:2, direction:'vertical',   color:'#92400e' },
        { id:'carB',      type:'normal',    x:4, y:2, length:3, direction:'vertical',   color:'#8b5cf6' },
        { id:'carC',      type:'normal',    x:2, y:3, length:3, direction:'vertical',   color:'#14b8a6' },
        { id:'carD',      type:'normal',    x:0, y:4, length:2, direction:'vertical',   color:'#f59e0b' },
      ]},
  ];

  /* ── Constants ── */
  var GRID_SIZE = 6;
  var CELL_SIZE = 74;
  var GAP       = 4;

  /* ── State ── */
  var currentLevelIdx = 0;
  var cars            = [];
  var completedLevels = [];
  var towUsed         = false;
  var towRemoving     = false;
  var moves           = 0;
  var gameWon         = false;
  var draggedId       = null;
  var dragStartX      = 0;
  var dragStartY      = 0;
  var toastTimer      = null;
  var bestScores      = {};

  /* ── DOM refs ── */
  var gridEl       = document.getElementById('grid');
  var movesEl      = document.getElementById('moves-counter');
  var bestEl       = document.getElementById('best-counter');
  var levelBadge   = document.getElementById('level-badge');
  var levelDescEl  = document.getElementById('level-desc');
  var dotsGrid     = document.getElementById('dots-grid');
  var winOverlay   = document.getElementById('win-overlay');
  var winMovesText = document.getElementById('win-moves-text');
  var toastEl      = document.getElementById('message-toast');
  var btnReset     = document.getElementById('btn-reset');
  var btnPrev      = document.getElementById('btn-prev');
  var btnNext      = document.getElementById('btn-next');
  var btnWinNext   = document.getElementById('btn-win-next');

  /* ── Best scores ── */
  try {
    var saved = localStorage.getItem('rushHourBestScores');
    if (saved) bestScores = JSON.parse(saved);
  } catch(e) {}

  function saveBestScore(idx, score) {
    if (!bestScores[idx] || score < bestScores[idx]) {
      bestScores[idx] = score;
      try { localStorage.setItem('rushHourBestScores', JSON.stringify(bestScores)); } catch(e) {}
    }
  }

  /* ── Helpers ── */
  function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

  function isOccupied(x, y, excludeId) {
    for (var i = 0; i < cars.length; i++) {
      var c = cars[i];
      if (c.id === excludeId) continue;
      if (c.direction === 'horizontal') {
        if (y === c.y && x >= c.x && x < c.x + c.length) return true;
      } else {
        if (x === c.x && y >= c.y && y < c.y + c.length) return true;
      }
    }
    return false;
  }

  function canMoveTo(car, nx, ny) {
    if (car.type === 'police') {
      if (ny === car.y) {
        if (car.direction === 'horizontal') {
          if (nx < 0 || nx + car.length > GRID_SIZE) return false;
          var mn = Math.min(car.x, nx), mx = Math.max(car.x + car.length - 1, nx + car.length - 1);
          for (var x = mn; x <= mx; x++) if (isOccupied(x, ny, car.id)) return false;
        } else {
          if (nx < 0 || nx >= GRID_SIZE) return false;
          var mn2 = Math.min(car.x, nx), mx2 = Math.max(car.x, nx);
          for (var x2 = mn2; x2 <= mx2; x2++) for (var i = 0; i < car.length; i++) if (isOccupied(x2, car.y + i, car.id)) return false;
        }
        return true;
      }
      if (nx === car.x) {
        if (car.direction === 'vertical') {
          if (ny < 0 || ny + car.length > GRID_SIZE) return false;
          var mn3 = Math.min(car.y, ny), mx3 = Math.max(car.y + car.length - 1, ny + car.length - 1);
          for (var y = mn3; y <= mx3; y++) if (isOccupied(nx, y, car.id)) return false;
        } else {
          if (ny < 0 || ny >= GRID_SIZE) return false;
          var mn4 = Math.min(car.y, ny), mx4 = Math.max(car.y, ny);
          for (var y2 = mn4; y2 <= mx4; y2++) for (var i2 = 0; i2 < car.length; i2++) if (isOccupied(car.x + i2, y2, car.id)) return false;
        }
        return true;
      }
      return false;
    }

    if (car.direction === 'horizontal') {
      if (nx < 0 || nx + car.length > GRID_SIZE || ny !== car.y) return false;
    } else {
      if (ny < 0 || ny + car.length > GRID_SIZE || nx !== car.x) return false;
    }

    if (car.type === 'ambulance') {
      for (var ai = 0; ai < car.length; ai++) {
        var ax = car.direction === 'horizontal' ? nx + ai : nx;
        var ay = car.direction === 'vertical'   ? ny + ai : ny;
        if (isOccupied(ax, ay, car.id)) return false;
      }
      return true;
    }

    if (car.direction === 'horizontal') {
      var pmn = Math.min(car.x, nx), pmx = Math.max(car.x + car.length - 1, nx + car.length - 1);
      for (var px = pmn; px <= pmx; px++) if (isOccupied(px, car.y, car.id)) return false;
    } else {
      var qmn = Math.min(car.y, ny), qmx = Math.max(car.y + car.length - 1, ny + car.length - 1);
      for (var qy = qmn; qy <= qmx; qy++) if (isOccupied(car.x, qy, car.id)) return false;
    }
    return true;
  }

  function isAdjacent(c1, c2) {
    for (var i = 0; i < c1.length; i++) {
      var x1 = c1.direction === 'horizontal' ? c1.x + i : c1.x;
      var y1 = c1.direction === 'vertical'   ? c1.y + i : c1.y;
      for (var j = 0; j < c2.length; j++) {
        var x2 = c2.direction === 'horizontal' ? c2.x + j : c2.x;
        var y2 = c2.direction === 'vertical'   ? c2.y + j : c2.y;
        if ((Math.abs(x1-x2) === 1 && y1 === y2) || (x1 === x2 && Math.abs(y1-y2) === 1)) return true;
      }
    }
    return false;
  }

  /* ── Toast ── */
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toastEl.classList.remove('visible'); }, 2200);
  }

  /* ── Tow truck removal ── */
  function checkTow() {
    if (towUsed || towRemoving) return;
    var tow = null;
    for (var i = 0; i < cars.length; i++) if (cars[i].type === 'tow') { tow = cars[i]; break; }
    if (!tow) return;
    for (var j = 0; j < cars.length; j++) {
      if (cars[j].type === 'stuck' && isAdjacent(tow, cars[j])) {
        var stuckId = cars[j].id;
        towRemoving = true;
        var stuckEl = document.getElementById('car-' + stuckId);
        if (stuckEl) stuckEl.classList.add('car-removing');
        setTimeout(function() {
          cars        = cars.filter(function(c) { return c.id !== stuckId; });
          towUsed     = true;
          towRemoving = false;
          moves++;
          movesEl.textContent = moves;
          showToast('Tow truck removed the stuck car!');
          renderCars();
          checkWin();
        }, 600);
        break;
      }
    }
  }

  /* ── Win condition ── */
  function checkWin() {
    if (gameWon) return;
    for (var i = 0; i < cars.length; i++) {
      var c = cars[i];
      if (c.id === 'red' && c.x + c.length === GRID_SIZE && c.y === 2) {
        gameWon = true;
        saveBestScore(currentLevelIdx, moves);
        if (completedLevels.indexOf(currentLevelIdx) === -1) completedLevels.push(currentLevelIdx);
        var best = bestScores[currentLevelIdx];
        winMovesText.textContent = 'Solved in ' + moves + ' move' + (moves === 1 ? '' : 's') +
          (best ? ' — Best: ' + best : '');
        btnWinNext.style.display = currentLevelIdx < LEVELS.length - 1 ? '' : 'none';
        winOverlay.classList.add('show');
        updateUI();
        return;
      }
    }
  }

  /* ── Render ── */
  function buildGrid() {
    var size = GRID_SIZE * CELL_SIZE;
    gridEl.style.width  = size + 'px';
    gridEl.style.height = size + 'px';
    var oldCells = gridEl.querySelectorAll('.grid-cell');
    for (var k = 0; k < oldCells.length; k++) oldCells[k].remove();
    for (var row = 0; row < GRID_SIZE; row++) {
      for (var col = 0; col < GRID_SIZE; col++) {
        var cell = document.createElement('div');
        cell.className  = 'grid-cell';
        cell.style.left   = (col * CELL_SIZE) + 'px';
        cell.style.top    = (row * CELL_SIZE) + 'px';
        cell.style.width  = CELL_SIZE + 'px';
        cell.style.height = CELL_SIZE + 'px';
        gridEl.appendChild(cell);
      }
    }
    var exit = document.getElementById('exit-marker');
    exit.style.top    = (2 * CELL_SIZE + 10) + 'px';
    exit.style.height = (CELL_SIZE - 20) + 'px';
    exit.style.width  = '22px';
    exit.textContent  = '\u2192';
  }

  function carEmoji(type) {
    if (type === 'ambulance') return '\uD83D\uDE91';
    if (type === 'police')    return '\uD83D\uDE94';
    if (type === 'tow')       return '\uD83D\uDE9A';
    if (type === 'stuck')     return '\u26A0\uFE0F';
    if (type === 'red')       return '\uD83D\uDE97';
    return '';
  }

  function lighten(hex, pct) {
    var n = parseInt(hex.replace('#',''), 16);
    var r = Math.min(255, (n >> 16) + pct);
    var g = Math.min(255, ((n >> 8) & 0xff) + pct);
    var b = Math.min(255, (n & 0xff) + pct);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function renderCars() {
    var oldCars = gridEl.querySelectorAll('.car');
    for (var k = 0; k < oldCars.length; k++) oldCars[k].remove();
    cars.forEach(function(car) {
      var isH = car.direction === 'horizontal';
      var w   = (isH ? car.length * CELL_SIZE : CELL_SIZE) - GAP * 2;
      var h   = (isH ? CELL_SIZE : car.length * CELL_SIZE) - GAP * 2;
      var div = document.createElement('div');
      div.className        = 'car car-' + car.type;
      div.id               = 'car-' + car.id;
      div.style.left       = (car.x * CELL_SIZE + GAP) + 'px';
      div.style.top        = (car.y * CELL_SIZE + GAP) + 'px';
      div.style.width      = w + 'px';
      div.style.height     = h + 'px';
      div.style.background = 'linear-gradient(160deg, ' + lighten(car.color, 18) + ' 0%, ' + car.color + ' 100%)';
      if (car.type === 'police') div.style.border = '2px solid #4b5563';
      var emoji = carEmoji(car.type);
      if (emoji) {
        var span = document.createElement('span');
        span.textContent  = emoji;
        span.style.cssText = 'pointer-events:none; font-size:20px; line-height:1;';
        div.appendChild(span);
      }
      if (car.type !== 'stuck') {
        (function(id) {
          div.addEventListener('mousedown',  function(e) { onCarMouseDown(e, id); });
          div.addEventListener('touchstart', function(e) { onCarTouchStart(e, id); }, { passive: false });
        })(car.id);
      }
      gridEl.appendChild(div);
    });
  }

  function updateCarEl(car) {
    var el = document.getElementById('car-' + car.id);
    if (!el) return;
    el.style.left = (car.x * CELL_SIZE + GAP) + 'px';
    el.style.top  = (car.y * CELL_SIZE + GAP) + 'px';
  }

  function updateUI() {
    movesEl.textContent     = moves;
    var best = bestScores[currentLevelIdx];
    bestEl.textContent      = best !== undefined ? best : '\u2014';
    levelBadge.textContent  = 'Level ' + (currentLevelIdx + 1) + ' / ' + LEVELS.length;
    levelDescEl.textContent = LEVELS[currentLevelIdx].description;
    btnPrev.disabled        = currentLevelIdx === 0;
    btnPrev.style.opacity   = currentLevelIdx === 0 ? '0.3' : '1';
    btnNext.disabled        = currentLevelIdx === LEVELS.length - 1;
    btnNext.style.opacity   = currentLevelIdx === LEVELS.length - 1 ? '0.3' : '1';
    updateDots();
  }

  function updateDots() {
    var children = dotsGrid.children;
    for (var i = 0; i < children.length; i++) {
      children[i].className = 'dot' +
        (i === currentLevelIdx ? ' active' : '') +
        (completedLevels.indexOf(i) !== -1 && i !== currentLevelIdx ? ' completed' : '');
    }
  }

  function buildDots() {
    dotsGrid.innerHTML = '';
    for (var i = 0; i < LEVELS.length; i++) {
      var d = document.createElement('div');
      d.className   = 'dot';
      d.textContent = String(i + 1);
      (function(idx) { d.addEventListener('click', function() { loadLevel(idx); }); })(i);
      dotsGrid.appendChild(d);
    }
  }

  /* ── Load level ── */
  function loadLevel(idx) {
    currentLevelIdx = idx;
    cars        = deepCopy(LEVELS[idx].cars);
    towUsed     = false;
    towRemoving = false;
    moves       = 0;
    gameWon     = false;
    draggedId   = null;
    winOverlay.classList.remove('show');
    buildGrid();
    renderCars();
    updateUI();
  }

  /* ── Drag helpers ── */
  function gridXY(clientX, clientY) {
    var rect = gridEl.getBoundingClientRect();
    return {
      gx: Math.floor((clientX - rect.left) / CELL_SIZE),
      gy: Math.floor((clientY - rect.top)  / CELL_SIZE)
    };
  }

  function calcNewPos(car, pos) {
    var nx = car.x, ny = car.y;
    if (car.type === 'police') {
      var dx = Math.abs(pos.gx - car.x), dy = Math.abs(pos.gy - car.y);
      if (dx >= dy) {
        nx = Math.max(0, Math.min(GRID_SIZE - (car.direction === 'horizontal' ? car.length : 1), pos.gx));
        ny = car.y;
      } else {
        nx = car.x;
        ny = Math.max(0, Math.min(GRID_SIZE - (car.direction === 'vertical' ? car.length : 1), pos.gy));
      }
    } else if (car.direction === 'horizontal') {
      nx = Math.max(0, Math.min(GRID_SIZE - car.length, pos.gx));
    } else {
      ny = Math.max(0, Math.min(GRID_SIZE - car.length, pos.gy));
    }
    return { nx: nx, ny: ny };
  }

  /* ── Mouse drag ── */
  function onCarMouseDown(e, carId) {
    if (gameWon || towRemoving) return;
    var car = cars.find(function(c) { return c.id === carId; });
    if (!car || car.type === 'stuck') {
      if (car) showToast('This car is stuck! Move the tow truck next to it.');
      return;
    }
    e.preventDefault();
    draggedId  = carId;
    dragStartX = car.x;
    dragStartY = car.y;
    var el = document.getElementById('car-' + carId);
    if (el) el.classList.add('dragging');
  }

  document.addEventListener('mousemove', function(e) {
    if (!draggedId) return;
    var car = cars.find(function(c) { return c.id === draggedId; });
    if (!car) return;
    var p = calcNewPos(car, gridXY(e.clientX, e.clientY));
    if ((p.nx !== car.x || p.ny !== car.y) && canMoveTo(car, p.nx, p.ny)) {
      car.x = p.nx; car.y = p.ny;
      updateCarEl(car);
      checkTow();
      checkWin();
    }
  });

  document.addEventListener('mouseup', function() {
    if (!draggedId) return;
    var car = cars.find(function(c) { return c.id === draggedId; });
    if (car && (car.x !== dragStartX || car.y !== dragStartY)) {
      moves++;
      movesEl.textContent = moves;
    }
    var el = document.getElementById('car-' + draggedId);
    if (el) el.classList.remove('dragging');
    draggedId = null;
  });

  /* ── Touch drag ── */
  function onCarTouchStart(e, carId) {
    if (gameWon || towRemoving) return;
    var car = cars.find(function(c) { return c.id === carId; });
    if (!car || car.type === 'stuck') return;
    e.preventDefault();
    draggedId  = carId;
    dragStartX = car.x;
    dragStartY = car.y;
    var el = document.getElementById('car-' + carId);
    if (el) el.classList.add('dragging');
  }

  document.addEventListener('touchmove', function(e) {
    if (!draggedId) return;
    e.preventDefault();
    var t   = e.touches[0];
    var car = cars.find(function(c) { return c.id === draggedId; });
    if (!car) return;
    var p = calcNewPos(car, gridXY(t.clientX, t.clientY));
    if ((p.nx !== car.x || p.ny !== car.y) && canMoveTo(car, p.nx, p.ny)) {
      car.x = p.nx; car.y = p.ny;
      updateCarEl(car);
      checkTow();
      checkWin();
    }
  }, { passive: false });

  document.addEventListener('touchend', function() {
    if (!draggedId) return;
    var car = cars.find(function(c) { return c.id === draggedId; });
    if (car && (car.x !== dragStartX || car.y !== dragStartY)) {
      moves++;
      movesEl.textContent = moves;
    }
    var el = document.getElementById('car-' + draggedId);
    if (el) el.classList.remove('dragging');
    draggedId = null;
  });

  /* ── Button events ── */
  btnReset.addEventListener('click',   function() { loadLevel(currentLevelIdx); });
  btnPrev.addEventListener('click',    function() { if (currentLevelIdx > 0)               loadLevel(currentLevelIdx - 1); });
  btnNext.addEventListener('click',    function() { if (currentLevelIdx < LEVELS.length-1) loadLevel(currentLevelIdx + 1); });
  btnWinNext.addEventListener('click', function() { if (currentLevelIdx < LEVELS.length-1) loadLevel(currentLevelIdx + 1); });

  /* ── Init ── */
  buildDots();
  loadLevel(0);

})();
