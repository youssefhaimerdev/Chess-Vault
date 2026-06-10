/**
 * ChessVault — Chess Engine & Training Core
 * Handles board state, move validation, rendering, sound, and all training modes.
 */

/* ════════════════════════════════════════════════
   PIECES & INITIAL BOARD
════════════════════════════════════════════════ */
const GLYPHS = {
  wK:'&#9812;',wQ:'&#9813;',wR:'&#9814;',wB:'&#9815;',wN:'&#9816;',wP:'&#9817;',
  bK:'&#9818;',bQ:'&#9819;',bR:'&#9820;',bB:'&#9821;',bN:'&#9822;',bP:'&#9823;'
};
const GC = {
  wK:'\u2654',wQ:'\u2655',wR:'\u2656',wB:'\u2657',wN:'\u2658',wP:'\u2659',
  bK:'\u265a',bQ:'\u265b',bR:'\u265c',bB:'\u265d',bN:'\u265e',bP:'\u265f'
};
const INIT = [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR']
];
const PIECE_SYMBOLS = {Q:'\u265b',R:'\u265c',B:'\u265d',N:'\u265e',P:'\u265f'};

/* ════════════════════════════════════════════════
   GLOBAL STATE
════════════════════════════════════════════════ */
let S = {
  view: 'drill',
  opening: null,
  lineIdx: 0,
  board: null,
  moveIdx: 0,
  selected: null,
  lastFrom: null,
  lastTo: null,
  hinting: false,
  blocked: false,
  mode: 'drill',
  showNotation: false,
  pendingOpp: false,
  stats: { correct: 0, wrong: 0, done: 0 },
  drillFlipped: false,
  gameMoveIdx: 0,
  gameBoard: null,
  gameFlipped: false,
};

let userArrows = [];
let userHighlights = {};
let rcDragFrom = null;
let dragSourceEl = null;
let GAME_IDX = 0;

/* ════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════ */
function copy(b) { return b.map(r => [...r]); }
function n2c(n) { return [8 - parseInt(n[1]), 'abcdefgh'.indexOf(n[0])]; }
function c2sq(r, c) { return 'abcdefgh'[c] + (8 - r); }

function applyMove(board, from, to) {
  const b = copy(board), p = b[from[0]][from[1]];
  b[to[0]][to[1]] = p; b[from[0]][from[1]] = null;
  if (p === 'wK' && from[1] === 4) {
    if (to[1] === 6) { b[7][5] = 'wR'; b[7][7] = null; }
    if (to[1] === 2) { b[7][3] = 'wR'; b[7][0] = null; }
  }
  if (p === 'bK' && from[1] === 4) {
    if (to[1] === 6) { b[0][5] = 'bR'; b[0][7] = null; }
    if (to[1] === 2) { b[0][3] = 'bR'; b[0][0] = null; }
  }
  if (p === 'wP' && to[0] === 0) b[to[0]][to[1]] = 'wQ';
  if (p === 'bP' && to[0] === 7) b[to[0]][to[1]] = 'bQ';
  return b;
}

function boardAt(line, upTo) {
  let b = INIT.map(r => [...r]);
  for (let i = 0; i < upTo; i++) {
    const m = line.moves[i];
    b = applyMove(b, n2c(m.slice(0, 2)), n2c(m.slice(2, 4)));
  }
  return b;
}

function boardAtGame(upTo) {
  let b = INIT.map(r => [...r]);
  const g = FAMOUS_GAMES[GAME_IDX];
  for (let i = 0; i < upTo; i++) {
    b = applyMove(b, n2c(g.moves[i].slice(0, 2)), n2c(g.moves[i].slice(2, 4)));
  }
  return b;
}

function isCastle(p, from, to) {
  return (p === 'wK' && from[1] === 4 && (to[1] === 6 || to[1] === 2)) ||
         (p === 'bK' && from[1] === 4 && (to[1] === 6 || to[1] === 2));
}

function isMyTurn() {
  const op = OPENINGS[S.opening];
  return op.myColor === 'w' ? S.moveIdx % 2 === 0 : S.moveIdx % 2 === 1;
}

function flipped() {
  const base = OPENINGS[S.opening].flipped;
  return S.drillFlipped ? !base : base;
}

function scr2brd(sr, sc) {
  let f;
  if (S.view === 'game') f = S.gameFlipped;
  else if (S.view === 'chaos') f = CS.challenge ? CS.challenge.flipped : false;
  else f = flipped();
  return f ? [7 - sr, 7 - sc] : [sr, sc];
}

function openingDisplayName(key) {
  return OPENINGS[key] ? OPENINGS[key].label || key : key;
}

/* ════════════════════════════════════════════════
   CHECK DETECTION
════════════════════════════════════════════════ */
function isInCheck(board, color) {
  let kr = -1, kc = -1;
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === (color === 'w' ? 'wK' : 'bK')) { kr = r; kc = c; }
  if (kr < 0) return false;
  const opp = color === 'w' ? 'b' : 'w';
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || !p.startsWith(opp)) continue;
      if (canAttack(board, r, c, kr, kc, p)) return true;
    }
  return false;
}

function canAttack(board, fr, fc, tr, tc, piece) {
  const dr = tr - fr, dc = tc - fc, t = piece[1];
  if (t === 'P') { const dir = piece[0] === 'w' ? -1 : 1; return dr === dir && Math.abs(dc) === 1; }
  if (t === 'N') return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
  if (t === 'K') return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
  if (t === 'R' || t === 'Q') {
    if (dr === 0 || dc === 0) {
      const sr = dr === 0 ? 0 : dr > 0 ? 1 : -1, sc = dc === 0 ? 0 : dc > 0 ? 1 : -1;
      let r = fr + sr, c = fc + sc;
      while (r !== tr || c !== tc) { if (board[r][c]) return false; r += sr; c += sc; }
      return true;
    }
  }
  if (t === 'B' || t === 'Q') {
    if (Math.abs(dr) === Math.abs(dc)) {
      const sr = dr > 0 ? 1 : -1, sc = dc > 0 ? 1 : -1;
      let r = fr + sr, c = fc + sc;
      while (r !== tr || c !== tc) { if (board[r][c]) return false; r += sr; c += sc; }
      return true;
    }
  }
  return false;
}

function buildNotation(line, idx) {
  const uci = line.moves[idx];
  const from = n2c(uci.slice(0, 2)), to = n2c(uci.slice(2, 4));
  const bBefore = boardAt(line, idx);
  const piece = bBefore[from[0]][from[1]];
  const captured = bBefore[to[0]][to[1]];
  if (isCastle(piece, from, to)) {
    const bAfter = applyMove(bBefore, from, to);
    const oppColor = piece[0] === 'w' ? 'b' : 'w';
    const chk = isInCheck(bAfter, oppColor) ? '+' : '';
    return (to[1] === 6 ? 'O-O' : 'O-O-O') + chk;
  }
  let sym = '';
  if (piece && piece[1] !== 'P') sym = GC[piece];
  const cap = captured ? 'x' : '';
  const dest = uci.slice(2, 4);
  let not;
  if (piece && piece[1] === 'P' && captured) not = uci[0] + 'x' + dest;
  else not = sym + cap + dest;
  const bAfter = applyMove(bBefore, from, to);
  const oppColor = piece && piece[0] === 'w' ? 'b' : 'w';
  if (isInCheck(bAfter, oppColor)) not += '+';
  return not;
}

/* ════════════════════════════════════════════════
   SOUND ENGINE
════════════════════════════════════════════════ */
let AC;
try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}

function rAC() { if (AC && AC.state === 'suspended') AC.resume(); }

function playWood(castle) {
  if (!AC) return; rAC();
  function knock(freq, vol, delay) {
    setTimeout(() => {
      const buf = AC.createBuffer(1, AC.sampleRate * .12, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 1.2;
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      const g = AC.createGain(); g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .12);
      src.connect(bp); bp.connect(lp); lp.connect(g); g.connect(AC.destination); src.start(); src.stop(AC.currentTime + .12);
    }, delay);
  }
  knock(900, .45, 0); if (castle) knock(800, .35, 95);
}

function playErr() {
  if (!AC) return; rAC();
  const osc = AC.createOscillator(), g = AC.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(300, AC.currentTime); osc.frequency.exponentialRampToValueAtTime(170, AC.currentTime + .2);
  g.gain.setValueAtTime(.15, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .22);
  osc.connect(g); g.connect(AC.destination); osc.start(); osc.stop(AC.currentTime + .22);
}

function playCapture() {
  if (!AC) return; rAC();
  function ck(freq, vol, delay) {
    setTimeout(() => {
      const buf = AC.createBuffer(1, AC.sampleRate * .08, AC.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
      const src = AC.createBufferSource(); src.buffer = buf;
      const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 1.5;
      const g = AC.createGain(); g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .09);
      src.connect(bp); bp.connect(g); g.connect(AC.destination); src.start(); src.stop(AC.currentTime + .09);
    }, delay);
  }
  ck(1200, .6, 0); ck(900, .35, 55);
}

function playCheck() {
  if (!AC) return; rAC();
  [0, 110].forEach(delay => {
    setTimeout(() => {
      const osc1 = AC.createOscillator(), osc2 = AC.createOscillator();
      const gain = AC.createGain();
      osc1.type = 'square'; osc1.frequency.value = 1400;
      osc2.type = 'sine'; osc2.frequency.value = 1400;
      gain.gain.setValueAtTime(0.22, AC.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.09);
      osc1.connect(gain); osc2.connect(gain); gain.connect(AC.destination);
      osc1.start(); osc2.start(); osc1.stop(AC.currentTime + 0.09); osc2.stop(AC.currentTime + 0.09);
    }, delay);
  });
}

/* ════════════════════════════════════════════════
   ARROWS
════════════════════════════════════════════════ */
function sqCenter(sq, f) {
  const [r, c] = n2c(sq);
  const sqPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq')) || 64;
  const sr = f ? 7 - r : r, sc = f ? 7 - c : c;
  return [(sc + .5) * sqPx, (sr + .5) * sqPx];
}

function drawArrows(arrows, forceFlip) {
  const svg = document.getElementById('arrow-svg');
  if (!svg) return;
  Array.from(svg.querySelectorAll('.arr')).forEach(e => e.remove());
  if (!arrows || !arrows.length) return;
  const sqPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq')) || 64;
  const sz = sqPx * 8;
  svg.setAttribute('viewBox', `0 0 ${sz} ${sz}`);
  const f = forceFlip !== undefined ? forceFlip : (S.view === 'game' ? S.gameFlipped : flipped());
  arrows.forEach(a => {
    const [x1, y1] = sqCenter(a.f, f);
    const [x2, y2] = sqCenter(a.t, f);
    const markerId = a.c === 'r' ? 'mr' : a.c === 'g' ? 'mh' : 'mo';
    const color = a.c === 'r' ? 'rgba(192,57,43,.85)' : a.c === 'g' ? 'rgba(29,158,117,.9)' : 'rgba(232,200,112,.88)';
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('class', 'arr');
    ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
    ln.setAttribute('stroke', color); ln.setAttribute('stroke-width', sqPx * .17);
    ln.setAttribute('stroke-linecap', 'round'); ln.setAttribute('marker-end', `url(#${markerId})`);
    ln.setAttribute('opacity', '0.85');
    svg.appendChild(ln);
  });
}

function drawUserArrows() {
  const svg = document.getElementById('arrow-svg');
  if (!svg) return;
  Array.from(svg.querySelectorAll('.user-arrow')).forEach(e => e.remove());
  const sqPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq')) || 64;
  const sz = sqPx * 8;
  svg.setAttribute('viewBox', `0 0 ${sz} ${sz}`);
  const f = S.view === 'game' ? S.gameFlipped : flipped();
  userArrows.forEach(a => {
    if (a.f === a.t) return;
    const [x1, y1] = sqCenter(a.f, f);
    const [x2, y2] = sqCenter(a.t, f);
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('class', 'arr user-arrow');
    ln.setAttribute('x1', x1); ln.setAttribute('y1', y1); ln.setAttribute('x2', x2); ln.setAttribute('y2', y2);
    ln.setAttribute('stroke', 'rgba(0,200,100,.8)'); ln.setAttribute('stroke-width', sqPx * .14);
    ln.setAttribute('stroke-linecap', 'round'); ln.setAttribute('marker-end', 'url(#mh)');
    ln.setAttribute('opacity', '0.8');
    svg.appendChild(ln);
  });
}

/* ════════════════════════════════════════════════
   BOARD RENDER
════════════════════════════════════════════════ */
function renderBoard() {
  const container = document.getElementById('board');
  if (!container) return;
  const svg = document.getElementById('arrow-svg');
  container.innerHTML = ''; if (svg) container.appendChild(svg);
  const board = S.view === 'game' ? S.gameBoard : S.board;
  const f = S.view === 'game' ? S.gameFlipped : flipped();
  for (let sr = 0; sr < 8; sr++) {
    for (let sc = 0; sc < 8; sc++) {
      const [br, bc] = f ? [7 - sr, 7 - sc] : [sr, sc];
      const isLight = (br + bc) % 2 === 0;
      const sq = document.createElement('div');
      sq.className = 'sq ' + (isLight ? 'light' : 'dark');
      if (S.selected && S.selected[0] === br && S.selected[1] === bc) sq.classList.add('selected');
      if (S.lastFrom && S.lastFrom[0] === br && S.lastFrom[1] === bc) sq.classList.add('last-from');
      if (S.lastTo && S.lastTo[0] === br && S.lastTo[1] === bc) sq.classList.add('last-to');
      if (S.hinting && S.hinting[0] === br && S.hinting[1] === bc) sq.classList.add('hint-sq');
      // User highlights
      const sqKey = c2sq(br, bc);
      if (userHighlights[sqKey]) sq.classList.add('user-highlight-' + userHighlights[sqKey]);
      const p = board && board[br][bc];
      if (p) {
        const span = document.createElement('span');
        span.className = 'piece ' + (p.startsWith('w') ? 'white' : 'black');
        span.innerHTML = GLYPHS[p];
        span.addEventListener('mousedown', e => startDrag(e, br, bc));
        span.addEventListener('touchstart', e => startDrag(e, br, bc), { passive: false });
        sq.appendChild(span);
      }
      sq.addEventListener('click', () => handleSqClick(br, bc));
      sq.addEventListener('contextmenu', e => { e.preventDefault(); handleRightClick(br, bc, e); });
      sq.addEventListener('mousedown', e => { if (e.button === 2) { e.preventDefault(); rcDragFrom = c2sq(br, bc); } });
      sq.addEventListener('mouseup', e => { if (e.button === 2 && rcDragFrom) { const to = c2sq(br, bc); finishRcDrag(rcDragFrom, to); rcDragFrom = null; } });
      container.appendChild(sq);
    }
  }
  // Coords
  const ranksEl = document.getElementById('ranks');
  if (ranksEl) {
    ranksEl.innerHTML = '';
    for (let sr = 0; sr < 8; sr++) {
      const s = document.createElement('span'); s.textContent = f ? sr + 1 : 8 - sr; ranksEl.appendChild(s);
    }
  }
  const filesEl = document.getElementById('files');
  if (filesEl) {
    filesEl.innerHTML = '';
    const fl = f ? 'hgfedcba' : 'abcdefgh';
    for (let sc = 0; sc < 8; sc++) {
      const s = document.createElement('span'); s.textContent = fl[sc]; filesEl.appendChild(s);
    }
  }
  if (typeof drawUserArrows === 'function') drawUserArrows();
}

function handleRightClick(br, bc, e) {
  const sqKey = c2sq(br, bc);
  const cur = userHighlights[sqKey];
  if (!cur) userHighlights[sqKey] = 'green';
  else if (cur === 'green') userHighlights[sqKey] = 'orange';
  else delete userHighlights[sqKey];
  renderBoard();
}

function finishRcDrag(from, to) {
  if (from === to) return;
  const existing = userArrows.findIndex(a => a.f === from && a.t === to);
  if (existing >= 0) userArrows.splice(existing, 1);
  else userArrows.push({ f: from, t: to });
  drawUserArrows();
}

/* ════════════════════════════════════════════════
   DRAG & DROP
════════════════════════════════════════════════ */
let dragGhost = null;
let isDragging = false;

function startDrag(e, br, bc) {
  if (e.button === 2) return;
  e.preventDefault();
  isDragging = false;
  const board = S.view === 'game' ? S.gameBoard : S.board;
  const p = board && board[br][bc];
  if (!p) return;
  dragSourceEl = e.currentTarget.parentElement;
  dragGhost = document.getElementById('drag-ghost');
  if (dragGhost) {
    dragGhost.innerHTML = GLYPHS[p];
    dragGhost.className = p.startsWith('w') ? 'white' : 'black';
    dragGhost.style.display = 'block';
    dragGhost.style.fontSize = 'calc(var(--sq) * 1.1)';
  }
  const moveHandler = (ev) => {
    isDragging = true;
    const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
    const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
    if (dragGhost) { dragGhost.style.left = x + 'px'; dragGhost.style.top = y + 'px'; }
    if (dragSourceEl) dragSourceEl.classList.add('dragging-source');
  };
  const upHandler = (ev) => {
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('touchmove', moveHandler);
    document.removeEventListener('mouseup', upHandler);
    document.removeEventListener('touchend', upHandler);
    if (dragGhost) dragGhost.style.display = 'none';
    if (dragSourceEl) dragSourceEl.classList.remove('dragging-source');
    if (!isDragging) { handleSqClick(br, bc); return; }
    const x = ev.changedTouches ? ev.changedTouches[0].clientX : ev.clientX;
    const y = ev.changedTouches ? ev.changedTouches[0].clientY : ev.clientY;
    const target = document.elementFromPoint(x, y);
    const sq = target && target.closest('.sq');
    if (sq) {
      const allSqs = Array.from(document.querySelectorAll('.sq'));
      const idx = allSqs.indexOf(sq);
      if (idx >= 0) {
        const f = S.view === 'game' ? S.gameFlipped : (S.view === 'chaos' ? (CS.challenge ? CS.challenge.flipped : false) : flipped());
        const sr = Math.floor(idx / 8), sc = idx % 8;
        const [tbr, tbc] = f ? [7 - sr, 7 - sc] : [sr, sc];
        if (S.selected) { tryMove(S.selected, [tbr, tbc]); S.selected = null; renderBoard(); }
        else if (br !== tbr || bc !== tbc) {
          S.selected = [br, bc];
          tryMove([br, bc], [tbr, tbc]); S.selected = null; renderBoard();
        }
      }
    }
    isDragging = false;
  };
  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('touchmove', moveHandler, { passive: false });
  document.addEventListener('mouseup', upHandler);
  document.addEventListener('touchend', upHandler);
}

/* ════════════════════════════════════════════════
   CLICK HANDLER
════════════════════════════════════════════════ */
function handleSqClick(br, bc) {
  if (S.view === 'game') { handleGameClick(br, bc); return; }
  if (S.view === 'chaos') { handleChaosClick(br, bc); return; }
  if (S.view === 'blindfold') { if (typeof bvHandleClick === 'function') bvHandleClick(br, bc); return; }
  if (S.view === 'stopcheck') { if (typeof scHandleClick === 'function') scHandleClick(br, bc); return; }
  if (S.blocked || S.pendingOpp) return;
  const board = S.board;
  const myColor = OPENINGS[S.opening].myColor;
  if (!S.selected) {
    const p = board[br][bc];
    if (p && p.startsWith(myColor) && isMyTurn()) { S.selected = [br, bc]; renderBoard(); }
  } else {
    const from = S.selected, to = [br, bc];
    const p = board[br][bc];
    if (p && p.startsWith(myColor) && !(from[0] === br && from[1] === bc)) {
      S.selected = [br, bc]; renderBoard(); return;
    }
    if (from[0] === br && from[1] === bc) { S.selected = null; renderBoard(); return; }
    S.selected = null;
    tryMove(from, to);
  }
}

/* ════════════════════════════════════════════════
   OPENING / LINE MANAGEMENT
════════════════════════════════════════════════ */
function getFirstOpeningKey() {
  return Object.keys(OPENINGS)[0];
}

function pickOpening(key) {
  S.opening = key; S.lineIdx = 0;
  S.stats = { correct: 0, wrong: 0, done: 0 };
  S.drillFlipped = false;
  updateStats(); restartLine();
}

function selectLine(i) { S.lineIdx = i; restartLine(); }

function nextLine() {
  S.lineIdx = (S.lineIdx + 1) % OPENINGS[S.opening].lines.length;
  restartLine();
}

function restartLine() {
  if (!S.opening || !OPENINGS[S.opening]) return;
  S.board = INIT.map(r => [...r]); S.moveIdx = 0; S.selected = null;
  S.lastFrom = null; S.lastTo = null; S.hinting = false; S.blocked = false; S.pendingOpp = false;
  userArrows = []; userHighlights = {};
  setStatus('info', 'Your turn — make a move.');
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  const lineNameEl = document.getElementById('line-name');
  if (lineNameEl) lineNameEl.textContent = line.name;
  drawArrows([]); renderBoard(); updateMoveList(); updateProgress();
  if (S.mode === 'learn') { if (typeof updateLearnPanel === 'function') updateLearnPanel(-1); }
  if (!isMyTurn()) {
    if (S.mode === 'learn') setOppBtnReady();
    else setTimeout(playOpponent, 380);
  }
}

/* ════════════════════════════════════════════════
   GAME LOGIC (drill & learn)
════════════════════════════════════════════════ */
function setOppBtnReady() {
  const ob = document.getElementById('opp-btn');
  if (ob) { ob.disabled = false; ob.style.opacity = '1'; }
  setStatus('warn', 'Click "Opponent move" to continue.');
  S.pendingOpp = true;
}

function doOpponentMove() {
  if (!S.pendingOpp) return;
  S.pendingOpp = false;
  const ob = document.getElementById('opp-btn');
  if (ob) { ob.disabled = true; ob.style.opacity = '.5'; }
  playOpponent();
}

function playOpponent() {
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  if (S.moveIdx >= line.moves.length) return;
  S.blocked = true;
  const m = line.moves[S.moveIdx], from = n2c(m.slice(0, 2)), to = n2c(m.slice(2, 4));
  const mp = S.board[from[0]][from[1]];
  const captured = S.board[to[0]][to[1]];
  S.lastFrom = from; S.lastTo = to;
  S.board = applyMove(S.board, from, to); S.moveIdx++;
  if (captured) playCapture(); else playWood(isCastle(mp, from, to));
  const oppColor = mp && mp[0] === 'w' ? 'b' : 'w';
  if (isInCheck(S.board, oppColor)) setTimeout(playCheck, 80);
  renderBoard(); updateMoveList(); updateProgress();
  if (S.mode === 'learn' && typeof updateLearnPanel === 'function') updateLearnPanel(S.moveIdx - 1);
  S.blocked = false;
  if (!checkDone()) setStatus('info', 'Your turn — make a move.');
}

function tryMove(from, to) {
  if (S.view === 'game') { tryGameMove(from, to); return; }
  if (S.view === 'chaos') { _chaosTryMove(from, to); return; }
  if (S.blocked || S.pendingOpp || !isMyTurn()) return;
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  if (S.moveIdx >= line.moves.length) return;
  const myColor = OPENINGS[S.opening].myColor;
  const piece = S.board[from[0]][from[1]];
  if (!piece || !piece.startsWith(myColor)) return;
  const exp = line.moves[S.moveIdx], ef = n2c(exp.slice(0, 2)), et = n2c(exp.slice(2, 4));
  if (from[0] === ef[0] && from[1] === ef[1] && to[0] === et[0] && to[1] === et[1]) {
    const castle = isCastle(piece, from, to);
    const captured = S.board[to[0]][to[1]];
    S.lastFrom = from; S.lastTo = to;
    S.board = applyMove(S.board, from, to); S.moveIdx++;
    if (captured) playCapture(); else playWood(castle);
    const oppColor = piece[0] === 'w' ? 'b' : 'w';
    if (isInCheck(S.board, oppColor)) setTimeout(playCheck, 80);
    S.selected = null; S.stats.correct++; updateStats();
    recordCorrect(S.opening, S.lineIdx);
    setStatus('ok', '✓ Correct!');
    renderBoard(); updateMoveList(); updateProgress();
    if (S.mode === 'learn' && typeof updateLearnPanel === 'function') updateLearnPanel(S.moveIdx - 1);
    if (!checkDone()) {
      if (S.mode === 'learn') setOppBtnReady();
      else setTimeout(() => { setStatus('info', 'Your turn — make a move.'); playOpponent(); }, 500);
    }
  } else {
    S.stats.wrong++; updateStats(); playErr();
    recordMistake(S.opening, S.lineIdx);
    setStatus('err', '✗ Wrong — restarting!');
    S.selected = null;
    const f = flipped(), sr = f ? 7 - to[0] : to[0], sc = f ? 7 - to[1] : to[1];
    const el = document.querySelectorAll('.sq')[sr * 8 + sc];
    if (el) { el.classList.add('wrong'); setTimeout(() => { el.classList.remove('wrong'); restartLine(); }, 650); }
    else restartLine();
  }
}

function checkDone() {
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  if (S.moveIdx >= line.moves.length) {
    setStatus('ok', '✓ Line complete! 🏆');
    S.stats.done++; updateStats(); drawArrows([]);
    setTimeout(() => {
      S.lineIdx = (S.lineIdx + 1) % OPENINGS[S.opening].lines.length;
      restartLine();
    }, 1800);
    return true;
  }
  return false;
}

function showHint() {
  if (S.hinting) { S.hinting = false; drawArrows([]); renderBoard(); return; }
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  if (S.moveIdx >= line.moves.length || !isMyTurn()) return;
  const m = line.moves[S.moveIdx], from = n2c(m.slice(0, 2)), to = n2c(m.slice(2, 4));
  S.hinting = to; S.stats.wrong++; updateStats();
  recordMistake(S.opening, S.lineIdx);
  renderBoard();
  const exp = line.explain && line.explain[S.moveIdx];
  if (exp && exp.ar) drawArrows(exp.ar, flipped());
}

function flipDrillBoard() {
  S.drillFlipped = !S.drillFlipped;
  restartLine();
}

/* ════════════════════════════════════════════════
   UI UPDATES
════════════════════════════════════════════════ */
function updateMoveList() {
  const el = document.getElementById('move-list');
  if (!el || !S.opening) return;
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  let html = '';
  for (let i = 0; i < line.moves.length; i += 2) {
    const mn = Math.floor(i / 2) + 1;
    const w = fmtMove(line, i);
    const b = line.moves[i + 1] ? fmtMove(line, i + 1) : '';
    html += mn + '. ' + w + ' ' + b + '&nbsp; ';
  }
  el.innerHTML = html;
}

function fmtMove(line, idx) {
  const not = buildNotation(line, idx);
  const cls = idx < S.moveIdx ? 'done' : idx === S.moveIdx ? 'cur' : '';
  return '<span class="' + cls + '">' + not + '</span>';
}

function updateProgress() {
  const el = document.getElementById('progress');
  if (!el || !S.opening) return;
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  el.style.width = (line.moves.length ? Math.round(S.moveIdx / line.moves.length * 100) : 0) + '%';
}

function updateStats() {
  const s = document.getElementById('s-correct');
  const w = document.getElementById('s-wrong');
  const d = document.getElementById('s-done');
  if (s) s.textContent = S.stats.correct;
  if (w) w.textContent = S.stats.wrong;
  if (d) d.textContent = S.stats.done;
}

function resetStats() { S.stats = { correct: 0, wrong: 0, done: 0 }; updateStats(); }

function setStatus(type, msg) {
  const el = document.getElementById('status');
  if (!el) return;
  el.className = 'status ' + type;
  el.textContent = msg;
}

function updateLearnPanel(idx) {
  const lp = document.getElementById('learn-panel');
  if (!lp) return;
  if (!S.opening) return;
  const line = OPENINGS[S.opening].lines[S.lineIdx];
  const exp = line.explain && line.explain[idx];
  const lm = document.getElementById('learn-move-lbl');
  const lt = document.getElementById('learn-text');
  const tags = document.getElementById('learn-tags');
  if (!exp) {
    if (lm) lm.textContent = 'Waiting...';
    if (lt) lt.textContent = 'Make a move to see the explanation.';
    if (tags) tags.innerHTML = '';
    drawArrows([]);
    return;
  }
  const mn = Math.floor(idx / 2) + 1;
  const side = idx % 2 === 0 ? 'White' : 'Black';
  if (lm) lm.textContent = 'Move ' + mn + ' (' + side + ')';
  if (lt) lt.textContent = exp.t || '';
  if (tags) {
    tags.innerHTML = (exp.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  }
  if (exp.ar && exp.ar.length) drawArrows(exp.ar, flipped());
  else drawArrows([]);
}

/* ════════════════════════════════════════════════
   PROGRESS TRACKING (localStorage)
════════════════════════════════════════════════ */
function _reportKey() { return 'cv_report_v2'; }

function loadReport() {
  try { return JSON.parse(localStorage.getItem(_reportKey()) || '{}'); }
  catch (e) { return {}; }
}

function saveReport(data) {
  try { localStorage.setItem(_reportKey(), JSON.stringify(data)); } catch (e) {}
}

function recordMistake(oKey, lIdx) {
  const data = loadReport();
  const k = oKey + '|' + lIdx;
  if (!data[k]) data[k] = { oKey, lIdx, wrong: 0, correct: 0 };
  data[k].wrong++;
  saveReport(data);
}

function recordCorrect(oKey, lIdx) {
  const data = loadReport();
  const k = oKey + '|' + lIdx;
  if (!data[k]) data[k] = { oKey, lIdx, wrong: 0, correct: 0 };
  data[k].correct++;
  saveReport(data);
}

function resetReport() {
  if (!confirm('Reset all your progress data? This cannot be undone.')) return;
  localStorage.removeItem(_reportKey()); renderReport();
}

function renderReport() {
  const tbody = document.getElementById('report-tbody');
  const overviewEl = document.getElementById('dash-overview-body');
  const worstEl = document.getElementById('dash-worst-body');
  const bestEl = document.getElementById('dash-best-body');
  const data = loadReport();
  const rows = Object.values(data).filter(r => r.wrong > 0 || r.correct > 0);
  rows.sort((a, b) => b.wrong - a.wrong);
  if (!tbody) return;
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="report-empty">No data yet — start drilling!</td></tr>';
    if (overviewEl) overviewEl.innerHTML = '<div class="dash-stat"><span class="ds-label">Total Moves</span><span class="ds-val">0</span></div>';
    if (worstEl) worstEl.textContent = 'Practice to see data.';
    if (bestEl) bestEl.textContent = 'Practice to see data.';
    return;
  }
  let totalCorrect = 0, totalWrong = 0;
  rows.forEach(r => { totalCorrect += r.correct; totalWrong += r.wrong; });
  const totalMoves = totalCorrect + totalWrong;
  const accuracy = totalMoves ? Math.round(totalCorrect / totalMoves * 100) : 0;
  tbody.innerHTML = rows.map((r, i) => {
    const t = r.wrong + r.correct;
    const pct = t ? Math.round(r.correct / t * 100) : 0;
    const op = OPENINGS[r.oKey];
    const line = op && op.lines[r.lIdx];
    const opName = op ? (op.label || r.oKey) : r.oKey;
    const lineName = line ? line.name : 'Line ' + (r.lIdx + 1);
    const pctColor = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : 'var(--red)';
    return `<tr class="${i === 0 ? 'top-row' : ''}">
      <td class="td-rank">${i + 1}</td>
      <td>${opName}</td>
      <td>${lineName}</td>
      <td class="td-mistakes">${r.wrong}</td>
      <td class="td-correct" style="color:var(--green)">${r.correct}</td>
      <td class="td-pct" style="color:${pctColor}">${pct}%</td>
    </tr>`;
  }).join('');
  if (overviewEl) {
    overviewEl.innerHTML = `
      <div class="dash-stat"><span class="ds-label">Total Moves</span><span class="ds-val">${totalMoves}</span></div>
      <div class="dash-stat"><span class="ds-label">Accuracy</span><span class="ds-val" style="color:${accuracy >= 80 ? 'var(--green)' : accuracy >= 50 ? 'var(--gold)' : 'var(--red)'}">${accuracy}%</span></div>
      <div class="dash-stat"><span class="ds-label">Openings</span><span class="ds-val">${new Set(rows.map(r => r.oKey)).size}</span></div>
      <div class="dash-meter"><div class="dash-meter-fill" style="width:${accuracy}%;background:${accuracy >= 80 ? 'var(--green)' : 'var(--gold)'}"></div></div>
    `;
  }
  const worst = rows.slice(0, 3);
  if (worstEl) {
    worstEl.innerHTML = worst.map(r => {
      const op = OPENINGS[r.oKey];
      const line = op && op.lines[r.lIdx];
      return `<div class="dash-stat"><span class="ds-label">${line ? line.name.slice(0, 22) + '…' : 'Line'}</span><span class="ds-val" style="color:var(--red)">${r.wrong}✗</span></div>`;
    }).join('');
  }
  const best = rows.filter(r => r.correct > 0).sort((a, b) => {
    const pa = a.correct / (a.correct + a.wrong);
    const pb = b.correct / (b.correct + b.wrong);
    return pb - pa;
  }).slice(0, 3);
  if (bestEl) {
    bestEl.innerHTML = best.length ? best.map(r => {
      const op = OPENINGS[r.oKey];
      const line = op && op.lines[r.lIdx];
      const t = r.correct + r.wrong;
      const pct = t ? Math.round(r.correct / t * 100) : 0;
      return `<div class="dash-stat"><span class="ds-label">${line ? line.name.slice(0, 22) + '…' : 'Line'}</span><span class="ds-val" style="color:var(--green)">${pct}%</span></div>`;
    }).join('') : 'Practice to see data.';
  }
}

/* ════════════════════════════════════════════════
   GAME MODE (Famous Games)
════════════════════════════════════════════════ */
function gameReset() {
  const g = FAMOUS_GAMES[GAME_IDX];
  if (!g) return;
  S.gameMoveIdx = 0; S.gameBoard = INIT.map(r => [...r]);
  S.lastFrom = null; S.lastTo = null; S.selected = null;
  const gs = document.getElementById('game-status');
  if (gs) { gs.className = 'status info'; gs.textContent = 'Make the next move on the board, or use ▶'; }
  const gc = document.getElementById('game-counter');
  if (gc) gc.textContent = '0 / ' + g.moves.length;
  const titleEl = document.getElementById('game-info-title');
  const subEl = document.getElementById('game-info-sub');
  if (titleEl) titleEl.textContent = g.title;
  if (subEl) subEl.textContent = g.subtitle || '';
  buildGamePGN(); renderBoard();
  const gnl = document.getElementById('game-note-lbl');
  const gn = document.getElementById('game-note');
  if (gnl) gnl.textContent = 'Start';
  if (gn) gn.textContent = g.notes[0] || 'Make the first move!';
}

function flipBoard() { S.gameFlipped = !S.gameFlipped; renderBoard(); }

function applyGameMove(idx) {
  const g = FAMOUS_GAMES[GAME_IDX];
  const m = g.moves[idx];
  const from = n2c(m.slice(0, 2)), to = n2c(m.slice(2, 4));
  const mp = S.gameBoard[from[0]][from[1]];
  S.lastFrom = from; S.lastTo = to;
  S.gameBoard = applyMove(S.gameBoard, from, to);
  if (S.gameBoard[to[0]][to[1]] !== mp) playCapture(); else playWood(isCastle(mp, from, to));
}

function gameNext() {
  const g = FAMOUS_GAMES[GAME_IDX];
  if (S.gameMoveIdx >= g.moves.length) return;
  applyGameMove(S.gameMoveIdx); S.gameMoveIdx++;
  const gc = document.getElementById('game-counter');
  if (gc) gc.textContent = S.gameMoveIdx + ' / ' + g.moves.length;
  buildGamePGN(); renderBoard(); updateGameNote(S.gameMoveIdx - 1);
  if (S.gameMoveIdx >= g.moves.length) {
    const gs = document.getElementById('game-status');
    if (gs) { gs.className = 'status ok'; gs.textContent = '✓ Game complete! A masterpiece.'; }
  }
}

function gamePrev() {
  const g = FAMOUS_GAMES[GAME_IDX];
  if (S.gameMoveIdx <= 0) return;
  S.gameMoveIdx--; S.gameBoard = boardAtGame(S.gameMoveIdx);
  if (S.gameMoveIdx > 0) {
    const pm = g.moves[S.gameMoveIdx - 1];
    S.lastFrom = n2c(pm.slice(0, 2)); S.lastTo = n2c(pm.slice(2, 4));
  } else { S.lastFrom = null; S.lastTo = null; }
  const gc = document.getElementById('game-counter');
  if (gc) gc.textContent = S.gameMoveIdx + ' / ' + g.moves.length;
  buildGamePGN(); renderBoard(); updateGameNote(S.gameMoveIdx - 1);
}

function updateGameNote(idx) {
  if (idx < 0) return;
  const g = FAMOUS_GAMES[GAME_IDX];
  const note = g.notes[idx] || '';
  const mn = Math.floor(idx / 2) + 1;
  const side = idx % 2 === 0 ? 'White' : 'Black';
  const gnl = document.getElementById('game-note-lbl');
  const gn = document.getElementById('game-note');
  if (gnl) gnl.textContent = 'Move ' + mn + ' (' + side + ')';
  if (gn) gn.textContent = note;
}

function buildGamePGN() {
  const el = document.getElementById('game-pgn');
  if (!el) return;
  const g = FAMOUS_GAMES[GAME_IDX];
  let html = '';
  for (let i = 0; i < g.moves.length; i += 2) {
    const mn = Math.floor(i / 2) + 1;
    const w = fmtGameMove(i), b = g.moves[i + 1] ? fmtGameMove(i + 1) : '';
    html += mn + '. ' + w + ' ' + b + '&nbsp; ';
  }
  el.innerHTML = html;
}

function fmtGameMove(idx) {
  const g = FAMOUS_GAMES[GAME_IDX];
  const uci = g.moves[idx];
  const from = n2c(uci.slice(0, 2)), to = n2c(uci.slice(2, 4));
  const bBefore = boardAtGame(idx);
  const piece = bBefore[from[0]][from[1]];
  const captured = bBefore[to[0]][to[1]];
  if (isCastle(piece, from, to)) {
    const cls = idx < S.gameMoveIdx ? 'done' : idx === S.gameMoveIdx ? 'cur' : '';
    return `<span class="${cls}">${to[1] === 6 ? 'O-O' : 'O-O-O'}</span>`;
  }
  let sym = ''; if (piece && piece[1] !== 'P') sym = GC[piece];
  const cap = captured ? 'x' : '';
  const dest = uci.slice(2, 4);
  let not = (piece && piece[1] === 'P' && captured) ? uci[0] + 'x' + dest : sym + cap + dest;
  const cls = idx < S.gameMoveIdx ? 'done' : idx === S.gameMoveIdx ? 'cur' : '';
  return `<span class="${cls}">${not}</span>`;
}

function handleGameClick(br, bc) {
  const g = FAMOUS_GAMES[GAME_IDX];
  if (S.gameMoveIdx >= g.moves.length) return;
  const p = S.gameBoard[br][bc];
  const isW = S.gameMoveIdx % 2 === 0;
  const expectedColor = isW ? 'w' : 'b';
  if (!S.selected) {
    if (!p || !p.startsWith(expectedColor)) return;
    S.selected = [br, bc]; renderBoard();
  } else {
    const from = S.selected, to = [br, bc];
    if (p && p.startsWith(expectedColor) && !(from[0] === br && from[1] === bc)) {
      S.selected = [br, bc]; renderBoard(); return;
    }
    if (from[0] === br && from[1] === bc) { S.selected = null; renderBoard(); return; }
    tryGameMove(from, to);
  }
}

function tryGameMove(from, to) {
  const g = FAMOUS_GAMES[GAME_IDX];
  if (S.gameMoveIdx >= g.moves.length) return;
  const exp = g.moves[S.gameMoveIdx];
  const ef = n2c(exp.slice(0, 2)), et = n2c(exp.slice(2, 4));
  S.selected = null;
  if (from[0] === ef[0] && from[1] === ef[1] && to[0] === et[0] && to[1] === et[1]) {
    applyGameMove(S.gameMoveIdx); S.gameMoveIdx++;
    const gc = document.getElementById('game-counter');
    if (gc) gc.textContent = S.gameMoveIdx + ' / ' + g.moves.length;
    buildGamePGN(); renderBoard(); updateGameNote(S.gameMoveIdx - 1);
    if (S.gameMoveIdx >= g.moves.length) {
      const gs = document.getElementById('game-status');
      if (gs) { gs.className = 'status ok'; gs.textContent = '✓ Game complete!'; }
    }
  } else {
    playErr();
    const gs = document.getElementById('game-status');
    if (gs) { gs.className = 'status err'; gs.textContent = '✗ Not the historical move — try again!'; }
    setTimeout(() => {
      if (gs && S.gameMoveIdx < g.moves.length) { gs.className = 'status info'; gs.textContent = 'Make the next move on the board, or use ▶'; }
    }, 1000);
    renderBoard();
  }
}

function selectGame(idx) {
  GAME_IDX = idx;
  gameReset();
}

/* ════════════════════════════════════════════════
   CHAOS MODE ENGINE
════════════════════════════════════════════════ */
const CS = {
  active: false, mode: 'all', openingKey: null,
  pts: 0, lives: 5, streak: 0, best: 0, correct: 0, wrong: 0,
  challenge: null,
};

function _chaosKey() { return CS.mode === 'all' ? 'cv_chaos_best' : 'cv_chaos_best_' + CS.openingKey; }

function setChaosMode(mode) {
  if (CS.active) return;
  CS.mode = mode;
  const pick = document.getElementById('chaos-opening-pick');
  const tabAll = document.getElementById('chaos-tab-all');
  const tabSingle = document.getElementById('chaos-tab-single');
  if (mode === 'all') {
    if (tabAll) { tabAll.classList.add('active'); }
    if (tabSingle) { tabSingle.classList.remove('active'); }
    if (pick) pick.style.display = 'none';
    _chaosSetStatus('info', 'All openings — Press Start!');
  } else {
    if (tabSingle) { tabSingle.classList.add('active'); }
    if (tabAll) { tabAll.classList.remove('active'); }
    if (pick) pick.style.display = 'block';
    _chaosSetStatus('info', 'Select an opening then press Start!');
  }
  CS.best = parseInt(localStorage.getItem(_chaosKey()) || '0');
  _chaosRenderUI();
}

function onChaosOpeningChange() {
  const sel = document.getElementById('chaos-opening-sel');
  if (sel) CS.openingKey = sel.value;
  CS.best = parseInt(localStorage.getItem(_chaosKey()) || '0');
  _chaosRenderUI();
}

function chaosInit() {
  CS.active = false; CS.pts = 0; CS.lives = 5; CS.streak = 0; CS.correct = 0; CS.wrong = 0;
  CS.mode = 'all'; CS.openingKey = getFirstOpeningKey();
  CS.best = parseInt(localStorage.getItem(_chaosKey()) || '0');
  const sb = document.getElementById('chaos-start-btn');
  const gow = document.getElementById('chaos-gameover-wrap');
  const ctx = document.getElementById('chaos-ctx');
  if (sb) sb.style.display = 'block';
  if (gow) gow.style.display = 'none';
  if (ctx) ctx.style.display = 'none';
  _chaosSetStatus('info', 'Choose a mode and press Start!');
  _chaosRenderUI();
  // Populate opening select
  const sel = document.getElementById('chaos-opening-sel');
  if (sel) {
    sel.innerHTML = Object.entries(OPENINGS).map(([k, v]) =>
      `<option value="${k}">${v.label || k}</option>`
    ).join('');
    CS.openingKey = sel.value;
  }
}

function chaosStart() {
  CS.active = true; CS.pts = 0; CS.lives = 5; CS.streak = 0; CS.correct = 0; CS.wrong = 0;
  CS.best = parseInt(localStorage.getItem(_chaosKey()) || '0');
  const sb = document.getElementById('chaos-start-btn');
  const gow = document.getElementById('chaos-gameover-wrap');
  if (sb) sb.style.display = 'none';
  if (gow) gow.style.display = 'none';
  _chaosSetStatus('info', 'Go! Find the correct move.');
  _chaosRenderUI();
  _chaosLoadChallenge();
}

function _chaosLoadChallenge() {
  if (!CS.active) return;
  let tries = 0, ch = null;
  const keys = CS.mode === 'all' ? Object.keys(OPENINGS) : [CS.openingKey];
  while (!ch && tries < 30) {
    tries++;
    const oKey = keys[Math.floor(Math.random() * keys.length)];
    const op = OPENINGS[oKey];
    if (!op) continue;
    const lIdx = Math.floor(Math.random() * op.lines.length);
    const line = op.lines[lIdx];
    const myColor = op.myColor;
    // Find a move where it's my turn
    const myMoves = [];
    for (let i = 0; i < line.moves.length; i++) {
      const isMyMove = myColor === 'w' ? i % 2 === 0 : i % 2 === 1;
      if (isMyMove && i > 0) myMoves.push(i);
    }
    if (!myMoves.length) continue;
    const mIdx = myMoves[Math.floor(Math.random() * myMoves.length)];
    const board = boardAt(line, mIdx);
    ch = { oKey, lIdx, line, mIdx, board, flipped: op.flipped, expectedUci: line.moves[mIdx], myColor };
  }
  if (!ch) { _chaosGameOver(); return; }
  CS.challenge = ch;
  S.lastFrom = null; S.lastTo = null; S.selected = null;
  _renderChaosBoard();
  const ctxEl = document.getElementById('chaos-ctx');
  const opLbl = document.getElementById('chaos-opening-lbl');
  const moveLbl = document.getElementById('chaos-movectx');
  if (ctxEl) ctxEl.style.display = 'block';
  if (opLbl) opLbl.textContent = OPENINGS[ch.oKey].label || ch.oKey;
  if (moveLbl) moveLbl.textContent = ch.line.name;
  _chaosSetStatus('info', 'Find the best move!');
}

function _renderChaosBoard() {
  const ch = CS.challenge;
  if (!ch) return;
  const container = document.getElementById('board');
  if (!container) return;
  const svg = document.getElementById('arrow-svg');
  container.innerHTML = ''; if (svg) container.appendChild(svg);
  const f = ch.flipped;
  for (let sr = 0; sr < 8; sr++) {
    for (let sc = 0; sc < 8; sc++) {
      const [br, bc] = f ? [7 - sr, 7 - sc] : [sr, sc];
      const isLight = (br + bc) % 2 === 0;
      const sq = document.createElement('div');
      sq.className = 'sq ' + (isLight ? 'light' : 'dark');
      if (S.selected && S.selected[0] === br && S.selected[1] === bc) sq.classList.add('selected');
      if (S.lastFrom && S.lastFrom[0] === br && S.lastFrom[1] === bc) sq.classList.add('last-from');
      if (S.lastTo && S.lastTo[0] === br && S.lastTo[1] === bc) sq.classList.add('last-to');
      const p = ch.board[br][bc];
      if (p) {
        const span = document.createElement('span');
        span.className = 'piece ' + (p.startsWith('w') ? 'white' : 'black');
        span.innerHTML = GLYPHS[p];
        span.addEventListener('mousedown', e => startDrag(e, br, bc));
        span.addEventListener('touchstart', e => startDrag(e, br, bc), { passive: false });
        sq.appendChild(span);
      }
      sq.addEventListener('click', () => handleChaosClick(br, bc));
      container.appendChild(sq);
    }
  }
  const ranksEl = document.getElementById('ranks');
  if (ranksEl) {
    ranksEl.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span'); s.textContent = f ? i + 1 : 8 - i; ranksEl.appendChild(s);
    }
  }
  const filesEl = document.getElementById('files');
  if (filesEl) {
    filesEl.innerHTML = '';
    const fl = f ? 'hgfedcba' : 'abcdefgh';
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('span'); s.textContent = fl[i]; filesEl.appendChild(s);
    }
  }
  drawArrows([]);
}

function handleChaosClick(br, bc) {
  if (!CS.active || !CS.challenge) return;
  const ch = CS.challenge;
  const myColor = ch.myColor;
  if (!S.selected) {
    const p = ch.board[br][bc];
    if (!p || !p.startsWith(myColor)) return;
    S.selected = [br, bc]; _renderChaosBoard();
  } else {
    const from = S.selected, to = [br, bc], p = ch.board[br][bc];
    if (p && p.startsWith(myColor) && !(from[0] === br && from[1] === bc)) {
      S.selected = [br, bc]; _renderChaosBoard(); return;
    }
    if (from[0] === br && from[1] === bc) { S.selected = null; _renderChaosBoard(); return; }
    _chaosTryMove(from, to);
  }
}

function _chaosTryMove(from, to) {
  if (!CS.challenge) return;
  const ch = CS.challenge;
  const exp = ch.expectedUci;
  const ef = n2c(exp.slice(0, 2)), et = n2c(exp.slice(2, 4));
  S.selected = null;
  if (from[0] === ef[0] && from[1] === ef[1] && to[0] === et[0] && to[1] === et[1]) {
    const piece = ch.board[from[0]][from[1]];
    const captured = ch.board[to[0]][to[1]];
    const castle = isCastle(piece, from, to);
    if (captured) playCapture(); else playWood(castle);
    const bAfter = applyMove(ch.board, from, to);
    const oppColor = piece[0] === 'w' ? 'b' : 'w';
    if (isInCheck(bAfter, oppColor)) playCheck();
    CS.streak++; CS.correct = (CS.correct || 0) + 1;
    const bonus = CS.streak > 2 ? CS.streak * 2 : 0;
    CS.pts += 10 + bonus;
    recordCorrect(ch.oKey, ch.lIdx);
    _chaosSetStatus('ok', `✓ Correct! +${10 + bonus} pts${CS.streak >= 3 ? ` 🔥${CS.streak}` : ''}`);
    if (CS.pts > CS.best) { CS.best = CS.pts; localStorage.setItem(_chaosKey(), CS.best); }
    _chaosRenderUI();
    ch.board = bAfter; S.lastFrom = from; S.lastTo = to; _renderChaosBoard();
    setTimeout(() => _chaosLoadChallenge(), 700);
  } else {
    playErr();
    CS.streak = 0; CS.wrong = (CS.wrong || 0) + 1; CS.lives--;
    recordMistake(ch.oKey, ch.lIdx);
    const f = ch.flipped, sr = f ? 7 - to[0] : to[0], sc = f ? 7 - to[1] : to[1];
    const el = document.querySelectorAll('.sq')[sr * 8 + sc];
    if (el) { el.classList.add('wrong'); setTimeout(() => el.classList.remove('wrong'), 600); }
    if (CS.lives <= 0) {
      CS.active = false; _chaosGameOver();
    } else {
      _chaosSetStatus('err', `✗ Wrong! ${CS.lives} ${CS.lives === 1 ? 'life' : 'lives'} left`);
      _chaosRenderUI(); _renderChaosBoard();
    }
  }
}

function _chaosGameOver() {
  _chaosRenderUI();
  _chaosSetStatus('err', 'Game Over! Keep practicing.');
  const gow = document.getElementById('chaos-gameover-wrap');
  if (gow) {
    gow.style.display = 'block';
    const gs = document.getElementById('go-score');
    const gsub = document.getElementById('go-sub');
    if (gs) gs.textContent = CS.pts;
    const modeTxt = CS.mode === 'single' ? openingDisplayName(CS.openingKey) : 'All Openings';
    if (gsub) gsub.textContent = `pts · ${CS.correct || 0} correct · Best: ${CS.best} · ${modeTxt}`;
  }
  const sb = document.getElementById('chaos-start-btn');
  if (sb) sb.style.display = 'block';
}

function _chaosSetStatus(type, msg) {
  const el = document.getElementById('chaos-status');
  if (!el) return;
  el.className = 'chaos-status ' + type;
  el.textContent = msg;
}

function _chaosRenderUI() {
  const g = id => document.getElementById(id);
  const pts = g('chaos-pts');
  const hearts = g('chaos-hearts');
  const streak = g('chaos-streak');
  const correct = g('chaos-correct');
  const wrongCt = g('chaos-wrong-ct');
  const bestDisp = g('chaos-best-disp');
  if (pts) pts.textContent = CS.pts;
  if (hearts) {
    const full = Math.max(0, CS.lives), empty = Math.max(0, 5 - CS.lives);
    hearts.textContent = '♥'.repeat(full) + '♡'.repeat(empty);
    hearts.style.color = CS.lives <= 1 ? 'var(--red)' : CS.lives <= 2 ? 'var(--orange)' : 'var(--text)';
  }
  if (streak) {
    if (CS.streak >= 3) streak.textContent = '🔥' + CS.streak;
    else if (CS.streak > 0) streak.textContent = CS.streak;
    else streak.textContent = '—';
  }
  if (correct) correct.textContent = CS.correct || 0;
  if (wrongCt) wrongCt.textContent = CS.wrong || 0;
  if (bestDisp) bestDisp.textContent = CS.best;
}

/* ════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (S.view === 'game') {
    if (e.key === 'ArrowRight') { e.preventDefault(); gameNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); gamePrev(); }
  }
  if (S.view === 'chaos' && e.key === 'Enter') {
    const sb = document.getElementById('chaos-start-btn');
    if (sb && sb.style.display !== 'none') chaosStart();
  }
  if ((S.view === 'drill' || S.view === 'learn') && e.key === 'h') showHint();
  if ((S.view === 'drill' || S.view === 'learn') && e.key === 'r') restartLine();
  if ((S.view === 'drill' || S.view === 'learn') && e.key === 'n') nextLine();
  if ((S.view === 'drill' || S.view === 'learn') && e.key === 'f') flipDrillBoard();
});

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  S.opening = getFirstOpeningKey();
  if (typeof buildOpeningMenu === 'function') buildOpeningMenu();
  restartLine();
});
