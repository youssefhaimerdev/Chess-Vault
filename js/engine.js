/* ChessVault Engine — from original trainer */
/* eslint-disable */

const GLYPHS={wK:'&#9812;',wQ:'&#9813;',wR:'&#9814;',wB:'&#9815;',wN:'&#9816;',wP:'&#9817;',
              bK:'&#9818;',bQ:'&#9819;',bR:'&#9820;',bB:'&#9821;',bN:'&#9822;',bP:'&#9823;'};
const GC={wK:'\u2654',wQ:'\u2655',wR:'\u2656',wB:'\u2657',wN:'\u2658',wP:'\u2659',
          bK:'\u265a',bQ:'\u265b',bR:'\u265c',bB:'\u265d',bN:'\u265e',bP:'\u265f'};
const INIT=[['bR','bN','bB','bQ','bK','bB','bN','bR'],
            ['bP','bP','bP','bP','bP','bP','bP','bP'],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            ['wP','wP','wP','wP','wP','wP','wP','wP'],
            ['wR','wN','wB','wQ','wK','wB','wN','wR']];

/* ════════════════════════════════════════════════════════
   VERIFIED OPENINGS DATABASE
   All lines verified against chess databases.
════════════════════════════════════════════════════════ */

let GAME_IDX=0;
// For backward compatibility, alias to current game
function FAMOUS_GAME(){return FAMOUS_GAMES[GAME_IDX];}

function selectGame(idx){
  GAME_IDX=idx;
  gameReset();
}



/* ════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════ */
const PIECE_VALUES={P:1,N:3,B:3,R:5,Q:9,K:0};
const PIECE_SYMBOLS={Q:'\u265b',R:'\u265c',B:'\u265d',N:'\u265e',P:'\u265f'};

let S={
  view:'drill', opening:'scotch', lineIdx:0,
  board:null, moveIdx:0,
  selected:null, lastFrom:null, lastTo:null,
  hinting:false, blocked:false,
  mode:'drill',
  showNotation:false,
  pendingOpp:false,
  stats:{correct:0,wrong:0,done:0},
  gameFlipped:false,
  drillFlipped:false,
  gameMoveIdx:0,
  gameBoard:null,
};

/* Annotation state — declared here so all functions can reference them */
let userArrows=[];
let userHighlights={};
let rcDragFrom=null;
let dragSourceEl=null;

/* ════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════ */
function copy(b){return b.map(r=>[...r]);}
function n2c(n){return[8-parseInt(n[1]),'abcdefgh'.indexOf(n[0])];}
function c2sq(r,c){return 'abcdefgh'[c]+(8-r);}

function applyMove(board,from,to){
  const b=copy(board),p=b[from[0]][from[1]];
  b[to[0]][to[1]]=p;b[from[0]][from[1]]=null;
  if(p==='wK'&&from[1]===4){if(to[1]===6){b[7][5]='wR';b[7][7]=null;}if(to[1]===2){b[7][3]='wR';b[7][0]=null;}}
  if(p==='bK'&&from[1]===4){if(to[1]===6){b[0][5]='bR';b[0][7]=null;}if(to[1]===2){b[0][3]='bR';b[0][0]=null;}}
  if(p==='wP'&&to[0]===0)b[to[0]][to[1]]='wQ';
  if(p==='bP'&&to[0]===7)b[to[0]][to[1]]='bQ';
  return b;
}

function boardAt(line,upTo){
  let b=INIT.map(r=>[...r]);
  for(let i=0;i<upTo;i++){const m=line.moves[i];b=applyMove(b,n2c(m.slice(0,2)),n2c(m.slice(2,4)));}
  return b;
}

function boardAtGame(upTo){
  let b=INIT.map(r=>[...r]);
  for(let i=0;i<upTo;i++){const m=FAMOUS_GAME().moves[i];b=applyMove(b,n2c(m.slice(0,2)),n2c(m.slice(2,4)));}
  return b;
}

function isCastle(p,from,to){
  return(p==='wK'&&from[1]===4&&(to[1]===6||to[1]===2))||(p==='bK'&&from[1]===4&&(to[1]===6||to[1]===2));
}

function isMyTurn(){
  const op=OPENINGS[S.opening];
  return op.myColor==='w'?S.moveIdx%2===0:S.moveIdx%2===1;
}

function flipped(){
  const base=OPENINGS[S.opening].flipped;
  return S.drillFlipped ? !base : base;
}

function scr2brd(sr,sc){
  let f;
  if(S.view==='game')f=S.gameFlipped;
  else if(S.view==='chaos')f=CS.challenge?CS.challenge.flipped:false;
  else f=flipped();
  return f?[7-sr,7-sc]:[sr,sc];
}

/* ════════════════════════════════════════════════════════
   NOTATION WITH CAPTURES + CHECK
════════════════════════════════════════════════════════ */
function isInCheck(board,color){
  // Find the king
  let kr=-1,kc=-1;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(board[r][c]===(color==='w'?'wK':'bK')){kr=r;kc=c;}
  if(kr<0)return false;
  const opp=color==='w'?'b':'w';
  // Check all opponent pieces
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const p=board[r][c];
      if(!p||!p.startsWith(opp))continue;
      if(canAttack(board,r,c,kr,kc,p))return true;
    }
  }
  return false;
}
function canAttack(board,fr,fc,tr,tc,piece){
  const dr=tr-fr,dc=tc-fc;
  const t=piece[1];
  if(t==='P'){
    const dir=piece[0]==='w'?-1:1;
    return dr===dir&&Math.abs(dc)===1;
  }
  if(t==='N')return(Math.abs(dr)===2&&Math.abs(dc)===1)||(Math.abs(dr)===1&&Math.abs(dc)===2);
  if(t==='K')return Math.abs(dr)<=1&&Math.abs(dc)<=1;
  // Sliding pieces
  if(t==='R'||t==='Q'){
    if(dr===0||dc===0){
      const sr=dr===0?0:dr>0?1:-1,sc=dc===0?0:dc>0?1:-1;
      let r=fr+sr,c=fc+sc;
      while(r!==tr||c!==tc){if(board[r][c])return false;r+=sr;c+=sc;}
      return true;
    }
  }
  if(t==='B'||t==='Q'){
    if(Math.abs(dr)===Math.abs(dc)){
      const sr=dr>0?1:-1,sc=dc>0?1:-1;
      let r=fr+sr,c=fc+sc;
      while(r!==tr||c!==tc){if(board[r][c])return false;r+=sr;c+=sc;}
      return true;
    }
  }
  return false;
}
function buildNotation(line,idx){
  const uci=line.moves[idx];
  const from=n2c(uci.slice(0,2)),to=n2c(uci.slice(2,4));
  const bBefore=boardAt(line,idx);
  const piece=bBefore[from[0]][from[1]];
  const captured=bBefore[to[0]][to[1]];
  if(isCastle(piece,from,to)){
    const bAfter=applyMove(bBefore,from,to);
    const oppColor=piece[0]==='w'?'b':'w';
    const chk=isInCheck(bAfter,oppColor)?'+':'';
    return (to[1]===6?'O-O':'O-O-O')+chk;
  }
  let sym='';
  if(piece&&piece[1]!=='P')sym=GC[piece];
  const cap=captured?'x':'';
  const dest=uci.slice(2,4);
  let not;
  if(piece&&piece[1]==='P'&&captured)not=uci[0]+'x'+dest;
  else not=sym+cap+dest;
  // Check if move gives check
  const bAfter=applyMove(bBefore,from,to);
  const oppColor=piece&&piece[0]==='w'?'b':'w';
  if(isInCheck(bAfter,oppColor))not+='+';
  return not;
}

/* ════════════════════════════════════════════════════════
   SOUND
════════════════════════════════════════════════════════ */
const AC=new(window.AudioContext||window.webkitAudioContext)();
function rAC(){if(AC.state==='suspended')AC.resume();}
function playWood(castle){
  rAC();
  function knock(freq,vol,delay){
    setTimeout(()=>{
      const buf=AC.createBuffer(1,AC.sampleRate*.12,AC.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
      const src=AC.createBufferSource();src.buffer=buf;
      const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=freq;bp.Q.value=1.2;
      const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;
      const g=AC.createGain();g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.12);
      src.connect(bp);bp.connect(lp);lp.connect(g);g.connect(AC.destination);src.start();src.stop(AC.currentTime+.12);
    },delay);
  }
  knock(900,.45,0);if(castle)knock(800,.35,95);
}
function playErr(){
  rAC();
  const osc=AC.createOscillator(),g=AC.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(300,AC.currentTime);osc.frequency.exponentialRampToValueAtTime(170,AC.currentTime+.2);
  g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.22);
  osc.connect(g);g.connect(AC.destination);osc.start();osc.stop(AC.currentTime+.22);
}
function playCapture(){
  rAC();
  // Two quick knocks — louder, sharper
  function ck(freq,vol,delay){
    setTimeout(()=>{
      const buf=AC.createBuffer(1,AC.sampleRate*.08,AC.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5);
      const src=AC.createBufferSource();src.buffer=buf;
      const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1200;bp.Q.value=1.5;
      const g=AC.createGain();g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.09);
      src.connect(bp);bp.connect(g);g.connect(AC.destination);src.start();src.stop(AC.currentTime+.09);
    },delay);
  }
  ck(1200,.6,0);ck(900,.35,55);
}
function playCheck(){
  rAC();
  // Chess.com style: two sharp, bright high-pitched beeps in quick succession
  [0,110].forEach(delay=>{
    setTimeout(()=>{
      const osc1=AC.createOscillator(),osc2=AC.createOscillator();
      const gain=AC.createGain();
      osc1.type='square'; osc1.frequency.value=1400;
      osc2.type='sine';   osc2.frequency.value=1400;
      gain.gain.setValueAtTime(0.22,AC.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.09);
      osc1.connect(gain); osc2.connect(gain); gain.connect(AC.destination);
      osc1.start(); osc2.start();
      osc1.stop(AC.currentTime+0.09); osc2.stop(AC.currentTime+0.09);
    },delay);
  });
}

/* ════════════════════════════════════════════════════════
   CHAOS MODE ENGINE — Ultimate + Single Opening
════════════════════════════════════════════════════════ */
const CS={
  active:false,
  mode:'all',          // 'all' = ultimate chaos, 'single' = one opening
  openingKey:'scotch', // selected opening for single mode
  pts:0,lives:5,streak:0,best:0,correct:0,wrong:0,
  challenge:null,
};

// Best score storage keys
function _chaosKey(){return CS.mode==='all'?'chaos_best':'chaos_best_'+CS.openingKey;}

function setChaosMode(mode){
  if(CS.active)return; // don't switch mid-game
  CS.mode=mode;
  const tabAll=document.getElementById('chaos-tab-all');
  const tabSingle=document.getElementById('chaos-tab-single');
  const pick=document.getElementById('chaos-opening-pick');
  if(mode==='all'){
    if(tabAll){tabAll.style.background='var(--accent)';tabAll.style.color='#fff';}
    if(tabSingle){tabSingle.style.background='transparent';tabSingle.style.color='var(--text2)';}
    if(pick)pick.style.display='none';
    _chaosSetStatus('info','All openings — Press Start or Enter!');
  } else {
    if(tabSingle){tabSingle.style.background='var(--accent)';tabSingle.style.color='#fff';}
    if(tabAll){tabAll.style.background='transparent';tabAll.style.color='var(--text2)';}
    if(pick)pick.style.display='block';
    _chaosSetStatus('info','Select an opening then press Start!');
  }
  CS.best=parseInt(localStorage.getItem(_chaosKey())||'0');
  _chaosRenderUI();
}

function onChaosOpeningChange(){
  const sel=document.getElementById('chaos-opening-sel');
  if(sel)CS.openingKey=sel.value;
  CS.best=parseInt(localStorage.getItem(_chaosKey())||'0');
  _chaosRenderUI();
}

function chaosInit(){
  CS.active=false;CS.pts=0;CS.lives=5;CS.streak=0;CS.correct=0;CS.wrong=0;CS.mode='all';
  CS.best=parseInt(localStorage.getItem(_chaosKey())||'0');
  requestAnimationFrame(()=>{
    const sb=document.getElementById('chaos-start-btn');
    const gow=document.getElementById('chaos-gameover-wrap');
    const ctx=document.getElementById('chaos-ctx');
    if(sb)sb.style.display='block';
    if(gow)gow.style.display='none';
    if(ctx)ctx.style.display='none';
    _chaosSetStatus('info','Choose a mode and press Start!');
    _chaosRenderUI();
    // Sync tab state
    setChaosMode('all');
  });
}

function chaosStart(){
  CS.active=true;CS.pts=0;CS.lives=5;CS.streak=0;CS.correct=0;CS.wrong=0;
  CS.best=parseInt(localStorage.getItem(_chaosKey())||'0');
  const gow=document.getElementById('chaos-gameover-wrap');
  const sb=document.getElementById('chaos-start-btn');
  if(gow)gow.style.display='none';
  if(sb)sb.style.display='none';
  _chaosRenderUI();
  _chaosLoadChallenge();
}

function _chaosAllPositions(){
  const positions=[];
  const keys=CS.mode==='single'?[CS.openingKey]:Object.keys(OPENINGS);
  for(const oKey of keys){
    const op=OPENINGS[oKey];
    if(!op)continue;
    const myColor=op.myColor;
    op.lines.forEach((line,lIdx)=>{
      for(let m=0;m<line.moves.length;m++){
        const isMyMove=myColor==='w'?m%2===0:m%2===1;
        if(isMyMove&&m>0) positions.push({oKey,lIdx,moveIdx:m});
      }
    });
  }
  return positions;
}

function _chaosLoadChallenge(){
  if(!CS.active)return;
  const positions=_chaosAllPositions();
  const pick=positions[Math.floor(Math.random()*positions.length)];
  const op=OPENINGS[pick.oKey];
  const line=op.lines[pick.lIdx];
  const board=boardAt(line,pick.moveIdx);
  const lastUci=line.moves[pick.moveIdx-1];
  const lastFrom=n2c(lastUci.slice(0,2));
  const lastTo=n2c(lastUci.slice(2,4));

  CS.challenge={
    oKey:pick.oKey,lIdx:pick.lIdx,moveIdx:pick.moveIdx,
    board,flipped:op.flipped,
    lastFrom,lastTo,
    expectedUci:line.moves[pick.moveIdx]
  };

  S.lastFrom=lastFrom;S.lastTo=lastTo;S.selected=null;

  const moveNum=Math.floor(pick.moveIdx/2)+1;
  const side=op.myColor==='w'?'White':'Black';
  const ctxEl=document.getElementById('chaos-ctx');
  const lblEl=document.getElementById('chaos-opening-lbl');
  const movEl=document.getElementById('chaos-movectx');
  if(ctxEl)ctxEl.style.display='block';
  if(lblEl)lblEl.textContent=line.name;
  if(movEl)movEl.textContent=`Move ${moveNum} — You play ${side}`;
  _chaosSetStatus('info','Your turn — make the correct move!');
  _chaosRenderUI();
  _renderChaosBoard();
}

function _renderChaosBoard(){
  if(!CS.challenge)return;
  const ch=CS.challenge;
  const container=document.getElementById('board');
  const svg=document.getElementById('arrow-svg');
  container.innerHTML='';container.appendChild(svg);
  const f=ch.flipped;

  for(let sr=0;sr<8;sr++){
    for(let sc=0;sc<8;sc++){
      const[br,bc]=f?[7-sr,7-sc]:[sr,sc];
      const isLight=(br+bc)%2===0;
      const sq=document.createElement('div');
      sq.className='sq '+(isLight?'light':'dark');
      if(S.selected&&S.selected[0]===br&&S.selected[1]===bc)sq.classList.add('selected');
      if(ch.lastFrom&&ch.lastFrom[0]===br&&ch.lastFrom[1]===bc)sq.classList.add('last-from');
      if(ch.lastTo&&ch.lastTo[0]===br&&ch.lastTo[1]===bc)sq.classList.add('last-to');
      const p=ch.board[br][bc];
      if(p){
        const span=document.createElement('span');
        span.className='piece '+(p.startsWith('w')?'white':'black');
        span.innerHTML=GLYPHS[p];
        span.addEventListener('mousedown',e=>startDrag(e,br,bc));
        span.addEventListener('touchstart',e=>startDrag(e,br,bc),{passive:false});
        sq.appendChild(span);
      }
      sq.addEventListener('click',()=>handleChaosClick(br,bc));
      container.appendChild(sq);
    }
  }
  const ranksEl=document.getElementById('ranks');ranksEl.innerHTML='';
  for(let sr=0;sr<8;sr++){const s=document.createElement('span');s.textContent=f?sr+1:8-sr;ranksEl.appendChild(s);}
  const filesEl=document.getElementById('files');filesEl.innerHTML='';
  const fl_l=f?'hgfedcba':'abcdefgh';
  for(let sc=0;sc<8;sc++){const s=document.createElement('span');s.textContent=fl_l[sc];filesEl.appendChild(s);}
  drawArrows([]);
}

function handleChaosClick(br,bc){
  if(!CS.active||!CS.challenge)return;
  const ch=CS.challenge;
  const op=OPENINGS[ch.oKey];
  const myColor=op.myColor;
  if(!S.selected){
    const p=ch.board[br][bc];
    if(!p||!p.startsWith(myColor))return;
    S.selected=[br,bc];_renderChaosBoard();
  } else {
    const from=S.selected,to=[br,bc],p=ch.board[br][bc];
    if(p&&p.startsWith(myColor)&&!(from[0]===br&&from[1]===bc)){S.selected=[br,bc];_renderChaosBoard();return;}
    if(from[0]===br&&from[1]===bc){S.selected=null;_renderChaosBoard();return;}
    _chaosTryMove(from,to);
  }
}

function _chaosTryMove(from,to){
  if(!CS.challenge)return;
  const ch=CS.challenge;
  const exp=ch.expectedUci;
  const ef=n2c(exp.slice(0,2)),et=n2c(exp.slice(2,4));
  S.selected=null;

  if(from[0]===ef[0]&&from[1]===ef[1]&&to[0]===et[0]&&to[1]===et[1]){
    // CORRECT
    const piece=ch.board[from[0]][from[1]];
    const captured=ch.board[to[0]][to[1]];
    const castle=isCastle(piece,from,to);
    if(captured)playCapture();else playWood(castle);
    // Check if gives check
    const bAfter=applyMove(ch.board,from,to);
    const oppColor=piece[0]==='w'?'b':'w';
    if(isInCheck(bAfter,oppColor))playCheck();

    CS.streak++;CS.correct=(CS.correct||0)+1;
    CS.pts+=10+(CS.streak>2?CS.streak*2:0);
    recordCorrect(ch.oKey,ch.lIdx);
    _chaosSetStatus('ok',`✓ Correct! +${10+(CS.streak>2?CS.streak*2:0)} pts`+( CS.streak>=3?` 🔥${CS.streak}`:''));
    if(CS.pts>CS.best){CS.best=CS.pts;localStorage.setItem(_chaosKey(),CS.best);}
    _chaosRenderUI();
    // Show the move on board briefly then load next
    ch.board=bAfter;S.lastFrom=from;S.lastTo=to;_renderChaosBoard();
    setTimeout(()=>_chaosLoadChallenge(),700);
  } else {
    // WRONG
    playErr();
    CS.streak=0;CS.wrong=(CS.wrong||0)+1;CS.lives--;
    recordMistake(ch.oKey,ch.lIdx);
    // Flash wrong square
    const f=ch.flipped,sr=f?7-to[0]:to[0],sc=f?7-to[1]:to[1];
    const el=document.querySelectorAll('.sq')[sr*8+sc];
    if(el){el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),600);}
    if(CS.lives<=0){
      CS.active=false;
      _chaosGameOver();
    } else {
      _chaosSetStatus('err',`\u2717 Wrong! ${CS.lives} ${CS.lives===1?'life':'lives'} left`);
      _chaosRenderUI();
      _renderChaosBoard();
    }
  }
}

function _chaosGameOver(){
  _chaosRenderUI();
  _chaosSetStatus('err','Game Over! Well fought.');
  const gow=document.getElementById('chaos-gameover-wrap');
  if(gow){
    gow.style.display='block';
    document.getElementById('go-score').textContent=CS.pts;
    const modeTxt=CS.mode==='single'?openingDisplayName(CS.openingKey):'All Openings';
    document.getElementById('go-sub').textContent=`pts \u00b7 ${CS.correct||0} correct \u00b7 Best: ${CS.best} \u00b7 ${modeTxt}`;
  }
  const sb=document.getElementById('chaos-start-btn');
  if(sb){sb.style.display='block';}
}

function _chaosSetStatus(type,msg){
  const el=document.getElementById('chaos-status');
  if(!el)return;
  el.className='chaos-status '+type;el.textContent=msg;
}

function _chaosRenderUI(){
  const g=id=>document.getElementById(id);
  const pts=g('chaos-pts');
  const hearts=g('chaos-hearts');
  const streak=g('chaos-streak');
  const correct=g('chaos-correct');
  const wrongCt=g('chaos-wrong-ct');
  const bestDisp=g('chaos-best-disp');
  if(pts)pts.textContent=CS.pts;
  if(hearts){
    const full=Math.max(0,CS.lives);
    const empty=Math.max(0,5-CS.lives);
    hearts.textContent='\u2665'.repeat(full)+'\u2661'.repeat(empty);
    hearts.style.color=CS.lives<=1?'var(--red)':CS.lives<=2?'var(--orange)':'var(--text)';
  }
  if(streak){
    if(CS.streak>=3)streak.textContent='\uD83D\uDD25'+CS.streak;
    else if(CS.streak>0)streak.textContent=CS.streak;
    else streak.textContent='—';
  }
  if(correct)correct.textContent=CS.correct||0;
  if(wrongCt)wrongCt.textContent=CS.wrong||0;
  if(bestDisp)bestDisp.textContent=CS.best;
}


/* ════════════════════════════════════════════════════════
   ARROWS
════════════════════════════════════════════════════════ */
function sqCenter(sq,f){
  const[r,c]=n2c(sq);
  const sqPx=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq'))||56;
  const sr=f?7-r:r,sc=f?7-c:c;
  return[(sc+.5)*sqPx,(sr+.5)*sqPx];
}

function drawArrows(arrows,forceFlip){
  const svg=document.getElementById('arrow-svg');
  Array.from(svg.querySelectorAll('.arr')).forEach(e=>e.remove());
  if(!arrows||!arrows.length)return;
  const sqPx=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq'))||56;
  const sz=sqPx*8;
  svg.setAttribute('viewBox',`0 0 ${sz} ${sz}`);
  const f=forceFlip!==undefined?forceFlip:(S.view==='game'?S.gameFlipped:flipped());
  arrows.forEach(a=>{
    const[x1,y1]=sqCenter(a.f,f);
    const[x2,y2]=sqCenter(a.t,f);
    const markerId=a.c==='r'?'mr':a.c==='g'?'mh':'mo';
    const color=a.c==='r'?'rgba(192,57,43,.85)':a.c==='g'?'rgba(29,158,117,.9)':'rgba(232,200,112,.88)';
    const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('class','arr');
    ln.setAttribute('x1',x1);ln.setAttribute('y1',y1);ln.setAttribute('x2',x2);ln.setAttribute('y2',y2);
    ln.setAttribute('stroke',color);ln.setAttribute('stroke-width',sqPx*.17);
    ln.setAttribute('stroke-linecap','round');ln.setAttribute('marker-end',`url(#${markerId})`);
    ln.setAttribute('opacity','0.85');
    svg.appendChild(ln);
  });
}

/* ════════════════════════════════════════════════════════
   VIEW MANAGEMENT
════════════════════════════════════════════════════════ */
/* ── Mobile bottom nav ── */
function mobNavSelect(view){
  ['drill','learn','chaos','report'].forEach(v=>{
    const el=document.getElementById('mob-'+v);
    if(el)el.classList.toggle('active',v===view);
  });
  const moreBtn=document.getElementById('mob-more');
  if(moreBtn)moreBtn.classList.toggle('active',['game','blindfold','stopcheck'].includes(view));
}
function mobMoreOpen(){
  const o=document.getElementById('mob-overlay');
  const d=document.getElementById('mob-drawer');
  if(o)o.style.display='block';
  if(d)d.style.display='block';
}
function mobMoreClose(){
  const o=document.getElementById('mob-overlay');
  const d=document.getElementById('mob-drawer');
  if(o)o.style.display='none';
  if(d)d.style.display='none';
}

function setView(v){
  S.view=v;
  mobNavSelect(v);
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  document.getElementById('nav-'+v).classList.add('active');
  const titles={drill:'Drill Mode',learn:'Learn Mode',game:'Game Mode',chaos:'🔥 Chaos Mode',report:'📊 My Chess Report',blindfold:'👁 Blindfold & Visualise',stopcheck:'🛑 Stop & Check'};
  document.getElementById('topbar-title').textContent=titles[v]||'';

  const dp=document.getElementById('drill-panel');
  const gp=document.getElementById('game-panel');
  const pb1=document.getElementById('picker-white');
  const pb2=document.getElementById('picker-black');
  const gtb=document.getElementById('game-topbar');
  const hb=document.getElementById('hint-btn');
  const ob=document.getElementById('opp-btn-wrap');
  const lp=document.getElementById('learn-panel');
  const rp=document.getElementById('right-panel');

  // Remove injected panels when switching away
  const existChaos=document.getElementById('chaos-panel');
  if(existChaos&&v!=='chaos')existChaos.remove();
  const existReport=document.getElementById('report-panel');
  if(existReport&&v!=='report')existReport.remove();
  const existBV=document.getElementById('bv-panel');
  if(existBV&&v!=='blindfold'){if(BV.countdownTimer)clearInterval(BV.countdownTimer);existBV.remove();}
  const existSC=document.getElementById('sc-panel');
  if(existSC&&v!=='stopcheck')existSC.remove();

  // Reset user drawn arrows when changing view
  userArrows=[];userHighlights={};
  drawUserArrows();

  if(v==='blindfold'){
    document.getElementById('board-panel').style.display='';
    dp.style.display='none';gp.classList.remove('vis');
    pb1.style.display='none';pb2.style.display='none';gtb.style.display='none';
    if(hb)hb.style.display='none';if(ob)ob.style.display='none';if(lp)lp.classList.remove('vis');
    if(!document.getElementById('bv-panel')){
      bvBuildPanel(rp);
    }
    bvInit();
  } else if(v==='stopcheck'){
    document.getElementById('board-panel').style.display='';
    dp.style.display='none';gp.classList.remove('vis');
    pb1.style.display='none';pb2.style.display='none';gtb.style.display='none';
    if(hb)hb.style.display='none';if(ob)ob.style.display='none';if(lp)lp.classList.remove('vis');
    if(!document.getElementById('sc-panel')){scBuildPanel(rp);}
    scInit();
  } else if(v==='game'){
    document.getElementById('board-panel').style.display='';
    dp.style.display='none';gp.classList.add('vis');
    pb1.style.display='none';pb2.style.display='none';gtb.style.display='flex';
    gameReset();
  } else if(v==='chaos'){
    document.getElementById('board-panel').style.display='';
    dp.style.display='none';gp.classList.remove('vis');
    pb1.style.display='none';pb2.style.display='none';gtb.style.display='none';
    if(!document.getElementById('chaos-panel')){
      const tpl=document.getElementById('chaos-tpl');
      rp.appendChild(tpl.content.cloneNode(true));
    }
    chaosInit();
  } else if(v==='report'){
    dp.style.display='none';gp.classList.remove('vis');
    pb1.style.display='none';pb2.style.display='none';gtb.style.display='none';
    document.getElementById('board-panel').style.display='none';
    if(!document.getElementById('report-panel')){
      const tpl=document.getElementById('report-tpl');
      // Inject at main level so it gets full width
      document.getElementById('main').appendChild(tpl.content.cloneNode(true));
    }
    renderReport();
  } else {
    document.getElementById('board-panel').style.display='';
    dp.style.display='';gp.classList.remove('vis');
    pb1.style.display='flex';pb2.style.display='flex';gtb.style.display='none';
    S.mode=v;
    if(v==='learn'){
      hb.style.display='none';ob.style.display='block';lp.classList.add('vis');
    } else {
      hb.style.display='';ob.style.display='none';lp.classList.remove('vis');
    }
    drawArrows([]);S.drillFlipped=false;restartLine();
  }
}

/* ════════════════════════════════════════════════════════
   OPENING / LINE MANAGEMENT
════════════════════════════════════════════════════════ */
function pickOpening(side,key){
  S.opening=key;S.lineIdx=0;S.stats={correct:0,wrong:0,done:0};S.drillFlipped=false;
  updateStats();populateSelect();restartLine();
}

function populateSelect(){
  const sel=document.getElementById('line-select');sel.innerHTML='';
  OPENINGS[S.opening].lines.forEach((l,i)=>{
    const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+l.name;sel.appendChild(o);
  });sel.value=S.lineIdx;
}

function selectLine(i){S.lineIdx=i;restartLine();}

function nextLine(){
  S.lineIdx=(S.lineIdx+1)%OPENINGS[S.opening].lines.length;
  document.getElementById('line-select').value=S.lineIdx;restartLine();
}

function restartLine(){
  S.board=INIT.map(r=>[...r]);S.moveIdx=0;S.selected=null;
  S.lastFrom=null;S.lastTo=null;S.hinting=false;S.blocked=false;S.pendingOpp=false;
  setStatus('info','Your turn \u2014 make a move.');
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  document.getElementById('line-name').textContent=line.name;
  drawArrows([]);renderBoard();updateMoveList();updateProgress();
  if(S.mode==='learn'){updateLearnPanel(-1);}
  if(!isMyTurn()){
    if(S.mode==='learn'){
      // show opponent move button
      setOppBtnReady();
    } else {
      setTimeout(playOpponent,380);
    }
  }
}

/* ════════════════════════════════════════════════════════
   GAME LOGIC (drill & learn)
════════════════════════════════════════════════════════ */
function setOppBtnReady(){
  const ob=document.getElementById('opp-btn');
  ob.disabled=false;ob.style.opacity='1';
  setStatus('warn','Click "Opponent move" to continue.');
  S.pendingOpp=true;
}

function doOpponentMove(){
  if(!S.pendingOpp)return;
  S.pendingOpp=false;
  const ob=document.getElementById('opp-btn');
  ob.disabled=true;ob.style.opacity='.5';
  playOpponent();
}

function playOpponent(){
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  if(S.moveIdx>=line.moves.length)return;
  S.blocked=true;
  const m=line.moves[S.moveIdx],from=n2c(m.slice(0,2)),to=n2c(m.slice(2,4));
  const mp=S.board[from[0]][from[1]];
  const captured=S.board[to[0]][to[1]];
  S.lastFrom=from;S.lastTo=to;
  S.board=applyMove(S.board,from,to);S.moveIdx++;
  if(captured)playCapture();else playWood(isCastle(mp,from,to));
  const oppColor=mp&&mp[0]==='w'?'b':'w';
  if(isInCheck(S.board,oppColor))setTimeout(playCheck,80);
  renderBoard();updateMoveList();updateProgress();
  if(S.mode==='learn')updateLearnPanel(S.moveIdx-1);
  S.blocked=false;
  if(!checkDone()){
    setStatus('info','Your turn \u2014 make a move.');
  }
}

function tryMove(from,to){
  if(S.view==='game'){tryGameMove(from,to);return;}
  if(S.view==='chaos'){_chaosTryMove(from,to);return;}
  if(S.blocked||S.pendingOpp||!isMyTurn())return;
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  if(S.moveIdx>=line.moves.length)return;
  const myColor=OPENINGS[S.opening].myColor;
  const piece=S.board[from[0]][from[1]];
  if(!piece||!piece.startsWith(myColor))return;
  const exp=line.moves[S.moveIdx],ef=n2c(exp.slice(0,2)),et=n2c(exp.slice(2,4));

  if(from[0]===ef[0]&&from[1]===ef[1]&&to[0]===et[0]&&to[1]===et[1]){
    const castle=isCastle(piece,from,to);
    const captured=S.board[to[0]][to[1]];
    S.lastFrom=from;S.lastTo=to;
    S.board=applyMove(S.board,from,to);S.moveIdx++;
    if(captured)playCapture();else playWood(castle);
    const oppColor=piece[0]==='w'?'b':'w';
    if(isInCheck(S.board,oppColor))setTimeout(playCheck,80);
    S.selected=null;S.stats.correct++;updateStats();
    recordCorrect(S.opening,S.lineIdx);
    setStatus('ok','\u2713 Correct!');
    renderBoard();updateMoveList();updateProgress();
    if(S.mode==='learn')updateLearnPanel(S.moveIdx-1);
    if(!checkDone()){
      if(S.mode==='learn'){
        setOppBtnReady();
      } else {
        setTimeout(()=>{setStatus('info','Your turn \u2014 make a move.');playOpponent();},500);
      }
    }
  } else {
    S.stats.wrong++;updateStats();playErr();
    recordMistake(S.opening,S.lineIdx);
    setStatus('err','\u2717 Wrong \u2014 restarting!');
    S.selected=null;
    const f=flipped(),sr=f?7-to[0]:to[0],sc=f?7-to[1]:to[1];
    const el=document.querySelectorAll('.sq')[sr*8+sc];
    if(el){el.classList.add('wrong');setTimeout(()=>{el.classList.remove('wrong');restartLine();},650);}
    else restartLine();
  }
}

function checkDone(){
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  if(S.moveIdx>=line.moves.length){
    setStatus('ok','\u2713 Line complete!');
    S.stats.done++;updateStats();drawArrows([]);
    setTimeout(()=>{
      S.lineIdx=(S.lineIdx+1)%OPENINGS[S.opening].lines.length;
      document.getElementById('line-select').value=S.lineIdx;restartLine();
    },1800);return true;
  }return false;
}

function showHint(){
  if(S.mode==='learn')return;
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  if(S.moveIdx>=line.moves.length)return;
  const exp=line.moves[S.moveIdx];
  const from=n2c(exp.slice(0,2)),to=n2c(exp.slice(2,4));
  const fsq=c2sq(from[0],from[1]),tsq=c2sq(to[0],to[1]);
  drawArrows([{f:fsq,t:tsq,c:'g'}]);
  S.hinting=to;renderBoard();
  setTimeout(()=>{S.hinting=false;drawArrows([]);renderBoard();},1800);
}

/* ════════════════════════════════════════════════════════
   LEARN MODE
════════════════════════════════════════════════════════ */
function updateLearnPanel(moveIdx){
  if(S.mode!=='learn')return;
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  const idx=moveIdx>=0?moveIdx:0;
  const ex=line.explain&&line.explain[idx];
  const lbl=document.getElementById('learn-lbl');
  const txt=document.getElementById('learn-text');
  const tags=document.getElementById('learn-tags');
  const mn=Math.floor(idx/2)+1;
  const side=idx%2===0?'White':'Black';
  lbl.textContent='Move '+mn+' \u2014 '+side;
  if(!ex||!ex.t){txt.textContent='Make the next move to see explanation.';tags.innerHTML='';drawArrows([]);return;}
  txt.textContent=ex.t;
  tags.innerHTML='';
  if(ex.tags)ex.tags.forEach(tg=>{const sp=document.createElement('span');sp.className='tag';sp.textContent=tg;tags.appendChild(sp);});
  drawArrows(ex.ar||[]);
}

/* ════════════════════════════════════════════════════════
   CLICK
════════════════════════════════════════════════════════ */
function handleSqClick(br,bc){
  if(S.view==='game'){handleGameClick(br,bc);return;}
  if(S.view==='chaos'){handleChaosClick(br,bc);return;}
  if(S.blocked||S.pendingOpp||!isMyTurn())return;
  const myColor=OPENINGS[S.opening].myColor;
  if(!S.selected){
    const p=S.board[br][bc];if(!p||!p.startsWith(myColor))return;
    S.selected=[br,bc];renderBoard();
  } else {
    const from=S.selected,to=[br,bc],p=S.board[br][bc];
    if(p&&p.startsWith(myColor)&&!(from[0]===br&&from[1]===bc)){S.selected=[br,bc];renderBoard();return;}
    if(from[0]===br&&from[1]===bc){S.selected=null;renderBoard();return;}
    tryMove(from,to);
  }
}

/* ════════════════════════════════════════════════════════
   DRAG
════════════════════════════════════════════════════════ */
let drag={active:false,from:null,piece:null};
const ghost=document.getElementById('drag-ghost');

function startDrag(e,br,bc){
  if(e.button===2)return; // right-click is for arrows, not drag
  const isChaos=S.view==='chaos';
  const isGame=S.view==='game';
  let board,myColor;
  if(isGame){board=S.gameBoard;myColor=null;}
  else if(isChaos){board=CS.challenge?CS.challenge.board:null;myColor=CS.challenge?OPENINGS[CS.challenge.oKey].myColor:null;}
  else{board=S.board;myColor=OPENINGS[S.opening].myColor;}
  if(!board)return;
  const p=board[br][bc];
  if(!p)return;
  if(!isGame&&!isChaos&&(!p.startsWith(myColor)||S.blocked||S.pendingOpp||!isMyTurn()))return;
  if(isChaos&&(!CS.active||!CS.challenge||!p.startsWith(myColor)))return;
  e.preventDefault();
  drag.active=true;drag.from=[br,bc];drag.piece=p;
  ghost.innerHTML=GC[p];ghost.className=p.startsWith('w')?'white':'black';
  ghost.style.display='block';moveGhost(e);
  S.selected=[br,bc];
  if(isChaos)_renderChaosBoard();else renderBoard();
}
function moveGhost(e){
  const cx=e.touches?e.touches[0].clientX:e.clientX;
  const cy=e.touches?e.touches[0].clientY:e.clientY;
  ghost.style.left=cx+'px';ghost.style.top=cy+'px';
}
function endDrag(e){
  if(!drag.active)return;
  ghost.style.display='none';drag.active=false;
  const cx=e.changedTouches?e.changedTouches[0].clientX:e.clientX;
  const cy=e.changedTouches?e.changedTouches[0].clientY:e.clientY;
  const target=document.elementFromPoint(cx,cy);
  const sqEl=target&&(target.classList.contains('sq')?target:target.closest('.sq'));
  if(sqEl){
    const idx=Array.from(document.querySelectorAll('.sq')).indexOf(sqEl);
    if(idx>=0){
      const sr=Math.floor(idx/8),sc=idx%8,[br,bc]=scr2brd(sr,sc);
      if(!(br===drag.from[0]&&bc===drag.from[1]))tryMove(drag.from,[br,bc]);
    }
  }
  drag.from=null;drag.piece=null;S.selected=null;
  if(dragSourceEl){dragSourceEl.classList.remove('dragging-source');dragSourceEl=null;}
  if(S.view==='chaos')_renderChaosBoard();else renderBoard();
}
document.addEventListener('mousemove',e=>{if(drag.active)moveGhost(e);});
document.addEventListener('mouseup',e=>{if(drag.active)endDrag(e);});
document.addEventListener('touchmove',e=>{if(drag.active){e.preventDefault();moveGhost(e);}},{passive:false});
document.addEventListener('touchend',e=>{if(drag.active)endDrag(e);});

/* ════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════ */
function renderBoard(){
  const container=document.getElementById('board');
  const svg=document.getElementById('arrow-svg');
  container.innerHTML='';container.appendChild(svg);
  const board=S.view==='game'?S.gameBoard:S.board;
  const f=S.view==='game'?S.gameFlipped:flipped();

  for(let sr=0;sr<8;sr++){
    for(let sc=0;sc<8;sc++){
      const[br,bc]=f?[7-sr,7-sc]:[sr,sc];
      const isLight=(br+bc)%2===0;
      const sq=document.createElement('div');
      sq.className='sq '+(isLight?'light':'dark');
      if(S.selected&&S.selected[0]===br&&S.selected[1]===bc)sq.classList.add('selected');
      if(S.lastFrom&&S.lastFrom[0]===br&&S.lastFrom[1]===bc)sq.classList.add('last-from');
      if(S.lastTo&&S.lastTo[0]===br&&S.lastTo[1]===bc)sq.classList.add('last-to');
      if(S.hinting&&S.hinting[0]===br&&S.hinting[1]===bc)sq.classList.add('hint-sq');
      const p=board&&board[br][bc];
      if(p){
        const span=document.createElement('span');
        span.className='piece '+(p.startsWith('w')?'white':'black');
        span.innerHTML=GLYPHS[p];
        span.addEventListener('mousedown',e=>startDrag(e,br,bc));
        span.addEventListener('touchstart',e=>startDrag(e,br,bc),{passive:false});
        sq.appendChild(span);
      }
      sq.addEventListener('click',()=>handleSqClick(br,bc));
      container.appendChild(sq);
    }
  }
  // Coords
  const ranksEl=document.getElementById('ranks');ranksEl.innerHTML='';
  for(let sr=0;sr<8;sr++){const s=document.createElement('span');s.textContent=f?sr+1:8-sr;ranksEl.appendChild(s);}
  const filesEl=document.getElementById('files');filesEl.innerHTML='';
  const fl_l=f?'hgfedcba':'abcdefgh';
  for(let sc=0;sc<8;sc++){const s=document.createElement('span');s.textContent=fl_l[sc];filesEl.appendChild(s);}
  // Redraw user annotations on top
  if(typeof drawUserArrows==='function')drawUserArrows();
  // Piece count
  if(S.view!=='chaos')renderPieceCount(board,f);
}

/* ════════════════════════════════════════════════════════
   UI UPDATES
════════════════════════════════════════════════════════ */
function updateMoveList(){
  const line=OPENINGS[S.opening].lines[S.lineIdx];let html='';
  for(let i=0;i<line.moves.length;i+=2){
    const mn=Math.floor(i/2)+1;
    const w=fmtMove(line,i);
    const b=line.moves[i+1]?fmtMove(line,i+1):'';
    html+=mn+'. '+w+' '+b+'&nbsp; ';
  }
  document.getElementById('move-list').innerHTML=html;
}
function fmtMove(line,idx){
  const not=buildNotation(line,idx);
  const cls=idx<S.moveIdx?'done':idx===S.moveIdx?'cur':'';
  return'<span class="'+cls+'">'+not+'</span>';
}
function updateProgress(){
  const line=OPENINGS[S.opening].lines[S.lineIdx];
  document.getElementById('progress').style.width=(line.moves.length?Math.round(S.moveIdx/line.moves.length*100):0)+'%';
}
function updateStats(){
  document.getElementById('s-correct').textContent=S.stats.correct;
  document.getElementById('s-wrong').textContent=S.stats.wrong;
  document.getElementById('s-done').textContent=S.stats.done;
}
function resetStats(){S.stats={correct:0,wrong:0,done:0};updateStats();}
function setStatus(type,msg){const el=document.getElementById('status');el.className='status '+type;el.textContent=msg;}
function toggleNotation(){
  S.showNotation=!S.showNotation;
  document.getElementById('notation-wrap').style.display=S.showNotation?'block':'none';
  const btn=document.getElementById('notation-btn');
  btn.textContent=S.showNotation?'\u25BC Notation':'\u25BA Notation';
  btn.classList.toggle('active-toggle',S.showNotation);
}

/* ════════════════════════════════════════════════════════
   GAME MODE
════════════════════════════════════════════════════════ */
function gameReset(){
  const g=FAMOUS_GAME();
  S.gameMoveIdx=0;S.gameBoard=INIT.map(r=>[...r]);
  S.lastFrom=null;S.lastTo=null;S.selected=null;
  document.getElementById('game-status').className='status info';
  document.getElementById('game-status').textContent='Make the next move on the board, or use ▶';
  document.getElementById('game-counter').textContent='0 / '+g.moves.length;
  // Update title and subtitle
  const titleEl=document.getElementById('game-info-title');
  const subEl=document.getElementById('game-info-sub');
  if(titleEl)titleEl.textContent=g.title;
  if(subEl)subEl.textContent=g.subtitle||'';
  buildGamePGN();renderBoard();
  document.getElementById('game-note-lbl').textContent='Start';
  document.getElementById('game-note').textContent=g.notes[0]||'Make the first move!';
}

function flipBoard(){S.gameFlipped=!S.gameFlipped;renderBoard();}
function flipDrillBoard(){
  S.drillFlipped=!S.drillFlipped;
  // Restart the line so moves still play correctly from the new perspective
  restartLine();
  // Update the flip button label to show current orientation
  const btn=document.querySelector('[onclick="flipDrillBoard()"]');
  if(btn)btn.style.background=S.drillFlipped?'rgba(232,200,112,.15)':'';
}

function applyGameMove(idx){
  const m=FAMOUS_GAME().moves[idx];
  const from=n2c(m.slice(0,2)),to=n2c(m.slice(2,4));
  const mp=S.gameBoard[from[0]][from[1]];
  S.lastFrom=from;S.lastTo=to;
  S.gameBoard=applyMove(S.gameBoard,from,to);
  playWood(isCastle(mp,from,to));
}

function gameNext(){
  if(S.gameMoveIdx>=FAMOUS_GAME().moves.length)return;
  applyGameMove(S.gameMoveIdx);
  S.gameMoveIdx++;
  document.getElementById('game-counter').textContent=S.gameMoveIdx+' / '+FAMOUS_GAME().moves.length;
  buildGamePGN();renderBoard();
  updateGameNote(S.gameMoveIdx-1);
  if(S.gameMoveIdx>=FAMOUS_GAME().moves.length){
    document.getElementById('game-status').className='status ok';
    document.getElementById('game-status').textContent='Game complete! Holmes wins by discovered check and mate.';
  }
}

function gamePrev(){
  if(S.gameMoveIdx<=0)return;
  S.gameMoveIdx--;
  S.gameBoard=boardAtGame(S.gameMoveIdx);
  if(S.gameMoveIdx>0){
    const pm=FAMOUS_GAME().moves[S.gameMoveIdx-1];
    S.lastFrom=n2c(pm.slice(0,2));S.lastTo=n2c(pm.slice(2,4));
  } else {S.lastFrom=null;S.lastTo=null;}
  document.getElementById('game-counter').textContent=S.gameMoveIdx+' / '+FAMOUS_GAME().moves.length;
  buildGamePGN();renderBoard();
  updateGameNote(S.gameMoveIdx-1);
  document.getElementById('game-status').className='status info';
  document.getElementById('game-status').textContent='Make the next move on the board, or use ▶';
}

function updateGameNote(idx){
  if(idx<0)return;
  const note=FAMOUS_GAME().notes[idx]||'';
  const mn=Math.floor(idx/2)+1;
  const side=idx%2===0?'White':'Black';
  document.getElementById('game-note-lbl').textContent='Move '+mn+' ('+side+')';
  document.getElementById('game-note').textContent=note;
}

function buildGamePGN(){
  let html='';
  for(let i=0;i<FAMOUS_GAME().moves.length;i+=2){
    const mn=Math.floor(i/2)+1;
    const w=fmtGameMove(i),b=FAMOUS_GAME().moves[i+1]?fmtGameMove(i+1):'';
    html+=mn+'. '+w+' '+b+'&nbsp; ';
  }
  document.getElementById('game-pgn').innerHTML=html;
}

function fmtGameMove(idx){
  const uci=FAMOUS_GAME().moves[idx];
  const from=n2c(uci.slice(0,2)),to=n2c(uci.slice(2,4));
  const bBefore=boardAtGame(idx);
  const piece=bBefore[from[0]][from[1]];
  const captured=bBefore[to[0]][to[1]];
  if(isCastle(piece,from,to))return(idx<S.gameMoveIdx?'<span class="done">':'<span>')+(to[1]===6?'O-O':'O-O-O')+'</span>';
  let sym='';if(piece&&piece[1]!=='P')sym=GC[piece];
  const cap=captured?'x':'';
  const dest=uci.slice(2,4);
  let not=(piece&&piece[1]==='P'&&captured)?uci[0]+'x'+dest:sym+cap+dest;
  const cls=idx<S.gameMoveIdx?'done':idx===S.gameMoveIdx?'cur':'';
  return'<span class="'+cls+'">'+not+'</span>';
}

function handleGameClick(br,bc){
  if(S.gameMoveIdx>=FAMOUS_GAME().moves.length)return;
  const p=S.gameBoard[br][bc];
  // Determine whose turn based on move index
  const isW=S.gameMoveIdx%2===0;
  const expectedColor=isW?'w':'b';
  if(!S.selected){
    if(!p||!p.startsWith(expectedColor))return;
    S.selected=[br,bc];renderBoard();
  } else {
    const from=S.selected,to=[br,bc];
    if(p&&p.startsWith(expectedColor)&&!(from[0]===br&&from[1]===bc)){S.selected=[br,bc];renderBoard();return;}
    if(from[0]===br&&from[1]===bc){S.selected=null;renderBoard();return;}
    tryGameMove(from,to);
  }
}

function tryGameMove(from,to){
  if(S.gameMoveIdx>=FAMOUS_GAME().moves.length)return;
  const exp=FAMOUS_GAME().moves[S.gameMoveIdx];
  const ef=n2c(exp.slice(0,2)),et=n2c(exp.slice(2,4));
  if(from[0]===ef[0]&&from[1]===ef[1]&&to[0]===et[0]&&to[1]===et[1]){
    S.selected=null;gameNext();
  } else {
    playErr();
    S.selected=null;
    const f=S.gameFlipped,sr=f?7-to[0]:to[0],sc=f?7-to[1]:to[1];
    const el=document.querySelectorAll('.sq')[sr*8+sc];
    if(el){el.classList.add('wrong');setTimeout(()=>el.classList.remove('wrong'),600);}
    document.getElementById('game-status').className='status err';
    document.getElementById('game-status').textContent='Wrong move! Try again.';
    setTimeout(()=>{
      document.getElementById('game-status').className='status info';
      document.getElementById('game-status').textContent='Make the next move on the board, or use \u25BA';
    },1000);
    renderBoard();
  }
}

/* ════════════════════════════════════════════════════════
   FULLSCREEN
════════════════════════════════════════════════════════ */
let fsOn=false;
function toggleFS(){
  fsOn=!fsOn;
  document.body.classList.toggle('fs',fsOn);
  document.getElementById('nav-fs').querySelector('.icon').textContent=fsOn?'✕':'⛶';
  // Re-draw arrows after layout change
  if(S.view!=='game'&&S.mode==='learn'){setTimeout(()=>updateLearnPanel(S.moveIdx-1),60);}
}

/* ════════════════════════════════════════════════════════
   RIGHT-CLICK ARROWS & SQUARE HIGHLIGHTS
════════════════════════════════════════════════════════ */
/* RIGHT-CLICK ARROWS & SQUARE HIGHLIGHTS */

function sqKey(r,c){return r+','+c;}

// Convert screen pixel to board square
function pixToBrd(x,y){
  const boardEl=document.getElementById('board');
  const rect=boardEl.getBoundingClientRect();
  const sqPx=rect.width/8;
  const sr=Math.floor((y-rect.top)/sqPx);
  const sc=Math.floor((x-rect.left)/sqPx);
  if(sr<0||sr>7||sc<0||sc>7)return null;
  return scr2brd(sr,sc);
}

function c2sqStr(r,c){'abcdefgh'[c]+(8-r);return 'abcdefgh'[c]+(8-r);}

// Draw user arrows on the SVG overlay
function drawUserArrows(){
  const svg=document.getElementById('arrow-svg');
  Array.from(svg.querySelectorAll('.user-arrow')).forEach(e=>e.remove());
  if(!userArrows.length&&!Object.keys(userHighlights).length)return;

  const f=S.view==='game'?S.gameFlipped:S.view==='chaos'?(CS.challenge?CS.challenge.flipped:false):flipped();
  const sqPx=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sq'))||56;
  const sz=sqPx*8;
  svg.setAttribute('viewBox',`0 0 ${sz} ${sz}`);

  // Draw highlights as SVG rects
  for(const[key,color] of Object.entries(userHighlights)){
    const[br,bc]=key.split(',').map(Number);
    const sr=f?7-br:br, sc2=f?7-bc:bc;
    const x=sc2*sqPx, y=sr*sqPx;
    const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('class','user-arrow');
    rect.setAttribute('x',x);rect.setAttribute('y',y);
    rect.setAttribute('width',sqPx);rect.setAttribute('height',sqPx);
    rect.setAttribute('fill',color==='green'?'rgba(100,210,100,.5)':'rgba(240,130,0,.5)');
    svg.appendChild(rect);
  }

  // Draw arrows
  userArrows.forEach(a=>{
    const [fr,fc]=a.f; const [tr,tc]=a.t;
    const srF=f?7-fr:fr, scF=f?7-fc:fc;
    const srT=f?7-tr:tr, scT=f?7-tc:tc;
    const x1=(scF+.5)*sqPx, y1=(srF+.5)*sqPx;
    const x2=(scT+.5)*sqPx, y2=(srT+.5)*sqPx;
    const col=a.color==='orange'?'rgba(240,130,0,.88)':'rgba(100,210,100,.88)';
    const markId=a.color==='orange'?'mu-o':'mu-g';
    // Ensure marker exists
    if(!svg.querySelector('#'+markId)){
      const defs=svg.querySelector('defs')||svg.insertBefore(document.createElementNS('http://www.w3.org/2000/svg','defs'),svg.firstChild);
      const m=document.createElementNS('http://www.w3.org/2000/svg','marker');
      m.setAttribute('id',markId);m.setAttribute('markerWidth','5');m.setAttribute('markerHeight','5');
      m.setAttribute('refX','2.5');m.setAttribute('refY','2.5');m.setAttribute('orient','auto');
      const mp=document.createElementNS('http://www.w3.org/2000/svg','path');
      mp.setAttribute('d','M0,0 L5,2.5 L0,5 Z');mp.setAttribute('fill',col);
      m.appendChild(mp);defs.appendChild(m);
    }
    const ln=document.createElementNS('http://www.w3.org/2000/svg','line');
    ln.setAttribute('class','user-arrow');
    ln.setAttribute('x1',x1);ln.setAttribute('y1',y1);ln.setAttribute('x2',x2);ln.setAttribute('y2',y2);
    ln.setAttribute('stroke',col);ln.setAttribute('stroke-width',sqPx*.18);
    ln.setAttribute('stroke-linecap','round');ln.setAttribute('marker-end',`url(#${markId})`);
    svg.appendChild(ln);
  });
}

// Right-click events on board
document.addEventListener('contextmenu',e=>{e.preventDefault();});

document.addEventListener('mousedown',e=>{
  if(e.button!==2)return;
  const brd=document.getElementById('board');
  if(!brd.contains(e.target))return;
  e.preventDefault();
  const sq=pixToBrd(e.clientX,e.clientY);
  if(!sq)return;
  rcDragFrom=sq;
});

document.addEventListener('mouseup',e=>{
  if(e.button!==2)return;
  if(!rcDragFrom)return;
  const sq=pixToBrd(e.clientX,e.clientY);
  if(!sq){rcDragFrom=null;return;}
  const [fr,fc]=rcDragFrom;
  const [tr,tc]=sq;

  if(fr===tr&&fc===tc){
    // Same square — toggle highlight
    const k=sqKey(fr,fc);
    if(userHighlights[k]==='green')userHighlights[k]='orange';
    else if(userHighlights[k]==='orange')delete userHighlights[k];
    else userHighlights[k]='green';
  } else {
    // Different square — draw/toggle arrow
    const idx=userArrows.findIndex(a=>a.f[0]===fr&&a.f[1]===fc&&a.t[0]===tr&&a.t[1]===tc);
    if(idx>=0){
      if(userArrows[idx].color==='green')userArrows[idx].color='orange';
      else userArrows.splice(idx,1);
    } else {
      userArrows.push({f:[fr,fc],t:[tr,tc],color:'green'});
    }
  }
  rcDragFrom=null;
  drawUserArrows();
});

// Left click on board clears user arrows/highlights (only when not picking/dragging a piece)
document.getElementById('board').addEventListener('click',e=>{
  if(e.button===0&&!drag.active&&!S.selected){
    if(userArrows.length||Object.keys(userHighlights).length){
      userArrows=[];userHighlights={};
      drawUserArrows();
    }
  }
});

/* DRAG — HIDE SOURCE PIECE WHILE DRAGGING */

// Mark the source square as dragging-source right after startDrag fires
// (board is re-rendered inside startDrag, so we use rAF to catch the fresh DOM)
document.getElementById('board').addEventListener('mousedown',e=>{
  if(e.button===0){
    requestAnimationFrame(()=>{
      if(!drag.active||!drag.from)return;
      const f=S.view==='game'?S.gameFlipped:S.view==='chaos'?(CS.challenge?CS.challenge.flipped:false):flipped();
      const[br,bc]=drag.from;
      const sr=f?7-br:br, sc=f?7-bc:bc;
      const sqs=document.querySelectorAll('.sq');
      dragSourceEl=sqs[sr*8+sc]||null;
      if(dragSourceEl)dragSourceEl.classList.add('dragging-source');
    });
  }
});

/* ════════════════════════════════════════════════════════
   MISTAKE TRACKING & CHESS REPORT
════════════════════════════════════════════════════════ */
// Data structure: {openingKey_lineIdx: {opening, line, wrong, correct, attempts}}
function _reportKey(oKey,lIdx){return oKey+'|'+lIdx;}

function _loadReport(){
  try{return JSON.parse(localStorage.getItem('chess_report')||'{}');}
  catch(e){return {};}
}

function _saveReport(data){
  try{localStorage.setItem('chess_report',JSON.stringify(data));}
  catch(e){}
}

function recordMistake(oKey,lIdx){
  const data=_loadReport();
  const k=_reportKey(oKey,lIdx);
  if(!data[k]){
    const op=OPENINGS[oKey];
    const line=op&&op.lines[lIdx];
    data[k]={opening:oKey,lIdx,openingName:openingDisplayName(oKey),lineName:line?line.name:'?',wrong:0,correct:0};
  }
  data[k].wrong++;
  _saveReport(data);
}

function recordCorrect(oKey,lIdx){
  const data=_loadReport();
  const k=_reportKey(oKey,lIdx);
  if(!data[k]){
    const op=OPENINGS[oKey];
    const line=op&&op.lines[lIdx];
    data[k]={opening:oKey,lIdx,openingName:openingDisplayName(oKey),lineName:line?line.name:'?',wrong:0,correct:0};
  }
  data[k].correct++;
  _saveReport(data);
}

function openingDisplayName(oKey){
  const map={
    scotch:'Scotch Game',
    sicilian_white:'Sicilian (White)',
    caro_white:'Caro-Kann (White)',
    french_white:'French (White)',
    caro:'Caro-Kann',
    nimzo:'Nimzo-Indian',
    french:'French Defence'
  };
  return map[oKey]||oKey;
}

/* ════════════════════════════════════════════════════════
   PIECE COUNT (chess.com style)
════════════════════════════════════════════════════════ */

function computeMaterial(board){
  let w=0,b=0;
  const wCaps={Q:0,R:0,B:0,N:0,P:0};
  const bCaps={Q:0,R:0,B:0,N:0,P:0};
  // Count pieces on board
  const wHas={Q:0,R:0,B:0,N:0,P:0};
  const bHas={Q:0,R:0,B:0,N:0,P:0};
  const initW={Q:1,R:2,B:2,N:2,P:8};
  const initB={Q:1,R:2,B:2,N:2,P:8};
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p)continue;
    const t=p[1];
    if(t==='K')continue;
    if(p[0]==='w')wHas[t]=(wHas[t]||0)+1;
    else bHas[t]=(bHas[t]||0)+1;
  }
  // Captures = initial - current
  for(const t of['Q','R','B','N','P']){
    wCaps[t]=Math.max(0,initW[t]-(wHas[t]||0));
    bCaps[t]=Math.max(0,initB[t]-(bHas[t]||0));
  }
  // Material score
  for(const t of['Q','R','B','N','P']){
    w+=wCaps[t]*PIECE_VALUES[t]; // White lost this much
    b+=bCaps[t]*PIECE_VALUES[t]; // Black lost this much
  }
  return{wLost:w,bLost:b,wCaps,bCaps};
}

function renderPieceCount(board,flippedBoard){
  if(S.view==='report'){
    const top=document.getElementById('pc-top');
    const bot=document.getElementById('pc-bottom');
    if(top)top.innerHTML='';if(bot)bot.innerHTML='';
    return;
  }
  const top=document.getElementById('pc-top');
  const bot=document.getElementById('pc-bottom');
  if(!top||!bot||!board)return;

  const{wLost,bLost,wCaps,bCaps}=computeMaterial(board);
  const diff=bLost-wLost; // positive = White ahead, negative = Black ahead

  // Top row = opponent (flipped=false means top=black, flipped=true means top=white)
  const topIsBlack=!flippedBoard;
  const topCaps=topIsBlack?bCaps:wCaps; // pieces captured FROM the top player
  const botCaps=topIsBlack?wCaps:bCaps;
  const topAdv=topIsBlack?(bLost-wLost):(wLost-bLost); // positive=top player is down
  const botAdv=-topAdv;

  function buildRow(caps,adv){
    let html='<span class="pc-pieces">';
    for(const t of['Q','R','B','N','P']){
      if(caps[t]>0)html+=PIECE_SYMBOLS[t].repeat(caps[t]);
    }
    html+='</span>';
    if(adv>0)html+=`<span class="pc-adv">+${adv}</span>`;
    return html;
  }

  top.innerHTML=buildRow(topCaps,topAdv<0?-topAdv:0);
  bot.innerHTML=buildRow(botCaps,botAdv>0?botAdv:0);
}

/* ════════════════════════════════════════════════════════
   REPORT — full renderReport with dashboards
════════════════════════════════════════════════════════ */
function resetReport(){
  if(!confirm('Reset all report data? This cannot be undone.'))return;
  localStorage.removeItem('chess_report');
  renderReport();
}

function renderReport(){
  const tbody=document.getElementById('report-tbody');
  if(!tbody)return;
  const data=_loadReport();
  const rows=Object.values(data)
    .filter(r=>r.wrong>0||r.correct>0)
    .sort((a,b)=>b.wrong-a.wrong||(a.correct+a.wrong)-(b.correct+b.wrong));

  if(!rows.length){
    tbody.innerHTML='<tr><td colspan="6" class="report-empty">No data yet — practice in Drill or Chaos mode.</td></tr>';
    _renderDashboards([]);
    return;
  }

  tbody.innerHTML=rows.map((r,i)=>{
    const total=r.wrong+r.correct;
    const acc=total?Math.round(r.correct/total*100):0;
    const isTop=i===0?'top-row':'';
    const medal=i===0?'🔴 ':i===1?'🟠 ':i===2?'🟡 ':'';
    return `<tr class="${isTop}">
      <td class="td-rank">${medal}${i+1}</td>
      <td style="font-size:11px;color:var(--text2)">${r.openingName}</td>
      <td style="font-size:11px">${r.lineName}</td>
      <td class="td-mistakes">${r.wrong}</td>
      <td class="td-correct">${r.correct}</td>
      <td class="td-pct" style="color:${acc>=80?'var(--green)':acc>=50?'var(--gold)':'var(--red)'}">${acc}%</td>
    </tr>`;
  }).join('');

  _renderDashboards(rows);
}

function _renderDashboards(rows){
  // Overview dashboard
  const ob=document.getElementById('dash-overview-body');
  if(ob){
    const total=rows.reduce((a,r)=>a+r.wrong+r.correct,0);
    const totalW=rows.reduce((a,r)=>a+r.wrong,0);
    const totalC=rows.reduce((a,r)=>a+r.correct,0);
    const acc=total?Math.round(totalC/total*100):0;
    const accColor=acc>=80?'var(--green)':acc>=60?'var(--gold)':'var(--red)';
    ob.innerHTML=`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
        <div class="stat"><div class="val" style="color:var(--green)">${totalC}</div><div class="lbl">correct</div></div>
        <div class="stat"><div class="val" style="color:var(--red)">${totalW}</div><div class="lbl">wrong</div></div>
      </div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:4px">Overall accuracy</div>
      <div style="font-size:22px;font-weight:700;color:${accColor}">${acc}%</div>
      <div class="dash-meter"><div class="dash-meter-fill" style="width:${acc}%;background:${accColor}"></div></div>
      <div style="font-size:10px;color:var(--text3);margin-top:8px">${rows.length} lines practiced</div>
    `;
  }
  // Worst lines
  const wb=document.getElementById('dash-worst-body');
  if(wb){
    if(!rows.length){wb.innerHTML='<div style="color:var(--text3);font-size:12px">Practice to see data.</div>';return;}
    const worst=rows.slice(0,3);
    wb.innerHTML=worst.map(r=>{
      const total=r.wrong+r.correct;
      const acc=total?Math.round(r.correct/total*100):0;
      return `<div style="margin-bottom:9px">
        <div style="font-size:11px;font-weight:500;color:var(--text);line-height:1.3">${r.lineName}</div>
        <div style="font-size:10px;color:var(--text3);margin-bottom:3px">${r.openingName}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="dash-meter" style="flex:1"><div class="dash-meter-fill" style="width:${acc}%;background:${acc>=80?'var(--green)':acc>=50?'var(--gold)':'var(--red)'}"></div></div>
          <span style="font-size:10px;color:var(--text2)">${acc}%</span>
          <span style="font-size:10px;color:var(--red)">✗${r.wrong}</span>
        </div>
      </div>`;
    }).join('');
  }
  // Best lines
  const bb=document.getElementById('dash-best-body');
  if(bb){
    const withData=rows.filter(r=>r.correct+r.wrong>=3);
    if(!withData.length){bb.innerHTML='<div style="color:var(--text3);font-size:12px">Need ≥3 attempts per line.</div>';return;}
    const best=[...withData].sort((a,b)=>{
      const at=(a.correct+a.wrong),bt=(b.correct+b.wrong);
      return (b.correct/bt)-(a.correct/at);
    }).slice(0,3);
    bb.innerHTML=best.map(r=>{
      const total=r.wrong+r.correct;
      const acc=total?Math.round(r.correct/total*100):0;
      return `<div style="margin-bottom:9px">
        <div style="font-size:11px;font-weight:500;color:var(--text);line-height:1.3">${r.lineName}</div>
        <div style="font-size:10px;color:var(--text3);margin-bottom:3px">${r.openingName}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="dash-meter" style="flex:1"><div class="dash-meter-fill" style="width:${acc}%;background:var(--green)"></div></div>
          <span style="font-size:10px;color:var(--text2)">${acc}%</span>
          <span style="font-size:10px;color:var(--green)">✓${r.correct}</span>
        </div>
      </div>`;
    }).join('');
  }
}

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
populateSelect();
S.board=INIT.map(r=>[...r]);
restartLine();

/* ── Keyboard shortcuts ── */
document.addEventListener('keydown',e=>{
  const tag=document.activeElement.tagName;
  if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA')return;
  const k=e.key.toLowerCase();
  if(k==='n'||k==='arrowright'){
    if(S.view==='learn'&&S.pendingOpp){e.preventDefault();doOpponentMove();}
    else if(S.view==='game'){e.preventDefault();gameNext();}
  }
  if(k==='arrowleft'&&S.view==='game'){e.preventDefault();gamePrev();}
  if(k==='h'&&S.view==='drill'){e.preventDefault();showHint();}
  if(k==='r'){e.preventDefault();if(S.view==='game')gameReset();else if(S.view==='chaos')chaosStart();else restartLine();}
  if(k==='f'){e.preventDefault();toggleFS();}
  if(k==='enter'&&S.view==='chaos'&&!CS.active){e.preventDefault();chaosStart();}
  if(k==='enter'&&S.view==='blindfold'&&!BV.active){e.preventDefault();bvStart();}
  if(k==='enter'&&S.view==='blindfold'&&BV.active&&BV.phase==='feedback'){e.preventDefault();bvNext();}
});

/* ════════════════════════════════════════════════════════
   BLINDFOLD & BOARD VISUALISATION ENGINE
════════════════════════════════════════════════════════ */
const BV={
  active:false,pts:0,lives:5,streak:0,best:0,correct:0,wrong:0,
  board:null,asWhite:true,challenge:null,
  phase:'idle',  // idle | countdown | question | feedback
  countdownTimer:null,autoTimer:null,awaitingClick:false,
};

const BV_FILES='abcdefgh';
function bvUci(r,c){return BV_FILES[c]+String(8-r);}
function bvRc(sq){return[8-parseInt(sq[1]),BV_FILES.indexOf(sq[0])];}
function bvAdj(r1,c1,r2,c2){return Math.abs(r1-r2)<=1&&Math.abs(c1-c2)<=1;}
function bvShuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;}
function bvRand(a){return a[0|Math.random()*a.length];}
const BV_PNAME={K:'King',Q:'Queen',R:'Rook',B:'Bishop',N:'Knight',P:'Pawn'};
const BV_POOL=['wQ','wR','wR','wB','wB','wN','wN','wP','wP','wP','wP',
               'bQ','bR','bR','bB','bB','bN','bN','bP','bP','bP','bP'];

/* ── Position generator ── */
function bvGenPosition(){
  const b=Array.from({length:8},()=>Array(8).fill(null));
  // White king — not on rank 0/7 for variety
  const wr=1+0|Math.random()*6, wc=0|Math.random()*8;
  b[wr][wc]='wK';
  // Black king — not adjacent to white
  let br,bc,t=0;
  do{br=1+0|Math.random()*6;bc=0|Math.random()*8;t++;}
  while(t<300&&(bvAdj(wr,wc,br,bc)||(br===wr&&bc===wc)));
  b[br][bc]='bK';
  // Add 4-9 random pieces
  const pool=bvShuffle([...BV_POOL]);
  const n=4+0|Math.random()*6;
  let placed=0;
  for(const p of pool){
    if(placed>=n)break;
    let pr,pc,t2=0;
    do{pr=0|Math.random()*8;pc=0|Math.random()*8;t2++;}
    while(t2<80&&(b[pr][pc]!==null||(p[1]==='P'&&(pr===0||pr===7))));
    if(b[pr][pc]===null&&!(p[1]==='P'&&(pr===0||pr===7))){b[pr][pc]=p;placed++;}
  }
  return b;
}

/* ── Piece helpers ── */
function bvPieces(board,color){
  const out=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(board[r][c]&&board[r][c][0]===color)out.push({r,c,p:board[r][c]});
  return out;
}
function bvAll(board){
  const out=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(board[r][c])out.push({r,c,p:board[r][c]});
  return out;
}
function bvLabel(p){return(p[0]==='w'?'White ':'Black ')+BV_PNAME[p[1]];}

/* ── Check finder ── */
function bvCheckMoves(board,myColor,oppColor){
  let kR=-1,kC=-1;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(board[r][c]===oppColor+'K'){kR=r;kC=c;}
  if(kR<0)return[];
  const moves=[];
  const DIRS={Q:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]],
              R:[[1,0],[-1,0],[0,1],[0,-1]],
              B:[[1,1],[1,-1],[-1,1],[-1,-1]],
              N:[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]};
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p||p[0]!==myColor||p[1]==='K'||p[1]==='P')continue;
    const pt=p[1];
    if(pt==='N'){
      for(const[dr,dc]of DIRS.N){
        const nr=r+dr,nc=c+dc;
        if(nr<0||nr>7||nc<0||nc>7||board[nr][nc]&&board[nr][nc][0]===myColor)continue;
        if(nr===kR&&nc===kC)moves.push({p,toR:nr,toC:nc});
      }
    } else {
      const ds=pt==='Q'?DIRS.Q:pt==='R'?DIRS.R:DIRS.B;
      for(const[dr,dc]of ds){
        let nr=r+dr,nc=c+dc;
        while(nr>=0&&nr<=7&&nc>=0&&nc<=7){
          if(board[nr][nc]){
            if(board[nr][nc][0]!==myColor&&nr===kR&&nc===kC)moves.push({p,toR:nr,toC:nc});
            break;
          }
          if(nr===kR&&nc===kC){moves.push({p,toR:nr,toC:nc});break;}
          nr+=dr;nc+=dc;
        }
      }
    }
  }
  return moves;
}

/* ── Question generator ── */
function bvGenQuestion(board,asWhite){
  const mc=asWhite?'w':'b', oc=asWhite?'b':'w';
  const ms=asWhite?'White':'Black', os=asWhite?'Black':'White';
  const myP=bvPieces(board,mc), oppP=bvPieces(board,oc), all=bvAll(board);
  const bank=[];

  // 1. Click on one of YOUR pieces
  const myNonK=myP.filter(x=>x.p[1]!=='K');
  if(myNonK.length>0){
    const t=bvRand(myNonK);
    bank.push({type:'click',cat:'Piece Location',
      text:`Click on your ${BV_PNAME[t.p[1]]} (${ms})`,
      hint:'Tap the square where that piece was.',
      answer:{r:t.r,c:t.c},clickType:'square'});
  }
  // 2. Click on opponent's piece
  if(oppP.length>0){
    const t=bvRand(oppP);
    bank.push({type:'click',cat:'Piece Location',
      text:`Click on ${os}'s ${BV_PNAME[t.p[1]]}`,
      hint:'Tap the square where that piece was.',
      answer:{r:t.r,c:t.c},clickType:'square'});
  }
  // 3. Where was a king?
  ['w','b'].forEach(col=>{
    const lbl=col===mc?'your':'your opponent\'s';
    const kp=bvPieces(board,col).find(x=>x.p[1]==='K');
    if(kp)bank.push({type:'click',cat:'King Location',
      text:`Click where ${lbl} King was`,
      hint:'Tap the square.',answer:{r:kp.r,c:kp.c},clickType:'square'});
  });
  // 4. How many pieces? (choice)
  ['w','b'].forEach(col=>{
    const lbl=col===mc?ms:os;
    const cnt=bvPieces(board,col).length;
    const opts=bvShuffle([...new Set([cnt,Math.max(1,cnt-1),cnt+1,cnt+2])]).slice(0,4).map(String);
    if(opts.includes(String(cnt)))
      bank.push({type:'choice',cat:'Piece Count',
        text:`How many ${lbl} pieces (including King)?`,
        hint:'Count carefully from memory.',
        choices:opts,answer:String(cnt)});
  });
  // 5. What piece was on square X?
  if(all.length>=2){
    const t=bvRand(all);
    const sq=bvUci(t.r,t.c);
    const correct=bvLabel(t.p);
    const others=bvShuffle(all.filter(x=>!(x.r===t.r&&x.c===t.c))).slice(0,3).map(x=>bvLabel(x.p));
    const opts=bvShuffle([correct,...others]).slice(0,4);
    if(opts.includes(correct))
      bank.push({type:'choice',cat:'Board Memory',
        text:`What piece was on ${sq}?`,
        hint:'Choose from the options.',
        choices:opts,answer:correct});
  }
  // 6. Was square X occupied? (yes/no)
  {
    const sq=bvRand(['d4','d5','e4','e5','c3','f3','c6','f6','b2','g7','a1','h1','h8','a8']);
    const[r,c]=bvRc(sq);
    const occ=board[r][c]!==null;
    bank.push({type:'choice',cat:'Board Awareness',
      text:`Was the square ${sq} occupied?`,
      hint:'Yes or No.',choices:['Yes','No'],answer:occ?'Yes':'No'});
  }
  // 7. Which side had more pieces?
  {
    const wn=bvPieces(board,'w').length, bn=bvPieces(board,'b').length;
    const correct=wn>bn?'White':bn>wn?'Black':'Equal';
    bank.push({type:'choice',cat:'Material Count',
      text:'Which side had more pieces on the board?',
      hint:'Count both sides from memory.',
      choices:['White','Black','Equal'],answer:correct});
  }
  // 8. What was on square X? (including Empty)
  {
    const r=0|Math.random()*8, c=0|Math.random()*8;
    const sq=bvUci(r,c);
    const p=board[r][c];
    const correct=p?bvLabel(p):'Empty';
    const others=bvShuffle(all.filter(x=>!(x.r===r&&x.c===c))).slice(0,2).map(x=>bvLabel(x.p));
    const opts=bvShuffle([correct,...others,'Empty']).slice(0,4);
    if(opts.includes(correct))
      bank.push({type:'choice',cat:'Board Memory',
        text:`What was on square ${sq}?`,
        hint:`'Empty' if nothing was there.`,
        choices:opts,answer:correct});
  }
  // 9. Deliver check — click the destination square
  {
    const chkMoves=bvCheckMoves(board,mc,oc);
    if(chkMoves.length>0){
      const mv=bvRand(chkMoves);
      bank.push({type:'click',cat:'Tactics — Give Check!',
        text:`Move your ${BV_PNAME[mv.p[1]]} to give check — click the destination square`,
        hint:'Find the checking square from memory.',
        answer:{r:mv.toR,c:mv.toC},clickType:'square'});
    }
  }
  // 10. Which piece was NOT on the board?
  {
    const present=new Set(all.map(x=>bvLabel(x.p)));
    const pool=['White Queen','White Rook','White Bishop','White Knight','White Pawn',
                'Black Queen','Black Rook','Black Bishop','Black Knight','Black Pawn'];
    const absent=bvShuffle(pool.filter(n=>!present.has(n)));
    if(absent.length>0){
      const correct=absent[0];
      const wrong=bvShuffle([...present]).slice(0,3);
      const opts=bvShuffle([correct,...wrong]).slice(0,4);
      if(opts.includes(correct))
        bank.push({type:'choice',cat:'Board Memory',
          text:'Which piece type was NOT on the board?',
          hint:'Pick the one you did NOT see.',
          choices:opts,answer:correct});
    }
  }
  return bank.length>0?bvRand(bank):null;
}

/* ── Board rendering for BV ── */
function bvRenderBoard(board,hidden,highlight,clickable){
  const boardEl=document.getElementById('board');
  if(!boardEl)return;
  // Preserve arrow-svg so regular renderBoard still works when leaving BV mode
  const svg=document.getElementById('arrow-svg');
  boardEl.innerHTML='';
  if(svg)boardEl.appendChild(svg);
  for(let vr=0;vr<8;vr++){
    for(let vc=0;vc<8;vc++){
      const r=BV.asWhite?vr:7-vr, c=BV.asWhite?vc:7-vc;
      const sq=document.createElement('div');
      sq.className='sq '+((r+c)%2===0?'light':'dark');
      if(highlight&&highlight.r===r&&highlight.c===c)sq.classList.add('hint-sq');
      if(!hidden&&board[r][c]){
        const span=document.createElement('span');
        span.className='piece '+(board[r][c][0]==='w'?'white':'black');
        span.innerHTML=GLYPHS[board[r][c]];
        sq.appendChild(span);
      }
      if(clickable){
        sq.style.cursor='pointer';
        sq.addEventListener('click',()=>bvHandleClick(r,c));
      }
      boardEl.appendChild(sq);
    }
  }
  // Update coords
  const ranksEl=document.getElementById('ranks');
  if(ranksEl){ranksEl.innerHTML='';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=BV.asWhite?8-i:i+1;ranksEl.appendChild(s);}}
  const filesEl=document.getElementById('files');
  if(filesEl){filesEl.innerHTML='';const fl=BV.asWhite?'abcdefgh':'hgfedcba';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=fl[i];filesEl.appendChild(s);}}
}

/* ── UI helpers ── */
function bvEl(id){return document.getElementById(id);}
function bvUpdateStats(){
  const set=(id,v)=>{const e=bvEl(id);if(e)e.textContent=v;};
  set('bv-pts',BV.pts);
  set('bv-hearts','♥'.repeat(BV.lives)+'♡'.repeat(5-BV.lives));
  set('bv-streak',BV.streak>=3?BV.streak+'🔥':BV.streak>0?String(BV.streak):'');
  set('bv-correct',BV.correct);
  set('bv-wrong',BV.wrong);
  set('bv-best',BV.best);
}

/* ── State machine ── */
function bvBuildPanel(container){
  const p=document.createElement('div');
  p.id='bv-panel';
  p.style.cssText='display:flex;flex-direction:column;gap:10px;padding:0';
  p.innerHTML=`
    <div class="chaos-score">
      <div><div class="chaos-pts" id="bv-pts">0</div><div class="chaos-pts-lbl">points</div></div>
      <div style="text-align:center"><div class="chaos-hearts" id="bv-hearts">♥♥♥♥♥</div><div style="font-size:10px;color:var(--text3);margin-top:2px">lives</div></div>
      <div style="text-align:right"><div id="bv-streak" style="font-size:18px;min-height:24px"></div><div style="font-size:10px;color:var(--text3)">streak</div></div>
    </div>
    <div style="display:flex;gap:6px">
      <div class="stat" style="flex:1"><div class="val" id="bv-correct" style="font-size:18px;font-weight:600;color:var(--green)">0</div><div class="lbl">correct</div></div>
      <div class="stat" style="flex:1"><div class="val" id="bv-wrong" style="font-size:18px;font-weight:600;color:var(--red)">0</div><div class="lbl">wrong</div></div>
      <div class="stat" style="flex:1"><div class="val" id="bv-best" style="font-size:18px;font-weight:600;color:var(--gold)">0</div><div class="lbl">best</div></div>
    </div>
    <div id="bv-countdown-wrap" style="display:none;text-align:center;padding:8px 0">
      <div id="bv-countdown" style="font-size:72px;font-weight:900;color:var(--accent);line-height:1">5</div>
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Memorise the position!</div>
    </div>
    <div id="bv-question-wrap" style="display:none;background:var(--bg3);border-radius:var(--radius);padding:12px">
      <div id="bv-q-category" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin-bottom:4px"></div>
      <div id="bv-q-text" style="font-size:14px;font-weight:600;color:var(--text);line-height:1.45;margin-bottom:4px"></div>
      <div id="bv-q-hint" style="font-size:11px;color:var(--text3)"></div>
    </div>
    <div id="bv-choices" style="display:none;flex-direction:column;gap:5px"></div>
    <div id="bv-board-instruction" style="display:none;background:var(--bg3);border-radius:var(--radius);padding:9px 12px;font-size:12px;color:var(--accent);text-align:center;font-weight:700">👆 Tap the correct square on the board</div>
    <div id="bv-feedback" style="display:none;padding:10px;border-radius:var(--radius);font-size:13px;font-weight:600"></div>
    <div id="bv-gameover" style="display:none"><div class="chaos-gameover"><div class="go-title">GAME OVER</div><div class="go-score" id="bv-go-score">0</div><div class="go-sub" id="bv-go-sub">pts</div></div></div>
    <div style="font-size:10px;color:var(--text3);text-align:center;margin-top:4px">Memorise the position in 5 seconds, then answer from memory.</div>
  `;
  // Create buttons with proper JS event listeners — no onclick attributes
  const startBtn=document.createElement('button');
  startBtn.id='bv-start-btn';startBtn.className='chaos-start';
  startBtn.textContent='👁 Start (or Enter)';
  startBtn.addEventListener('click',bvStart);
  p.appendChild(startBtn);

  const nextBtn=document.createElement('button');
  nextBtn.id='bv-next-btn';nextBtn.className='chaos-start';
  nextBtn.textContent='Next →';
  nextBtn.style.cssText='display:none;position:sticky;bottom:0;z-index:10;margin-top:8px';
  nextBtn.addEventListener('click',bvNext);
  p.appendChild(nextBtn);

  container.appendChild(p);
}

function bvInit(){
  BV.active=false;BV.pts=0;BV.lives=5;BV.streak=0;BV.correct=0;BV.wrong=0;
  BV.best=parseInt(localStorage.getItem('bv_best')||'0');
  BV.phase='idle';BV.awaitingClick=false;
  if(BV.countdownTimer){clearInterval(BV.countdownTimer);BV.countdownTimer=null;}
  if(BV.autoTimer){clearTimeout(BV.autoTimer);BV.autoTimer=null;}
  requestAnimationFrame(()=>{
    // Wire buttons after clone - onclick attributes don't survive cloneNode in all browsers
    const nb=document.getElementById('bv-next-btn');
    const sb=document.getElementById('bv-start-btn');
    if(nb){nb.onclick=null;nb.addEventListener('click',bvNext);}
    if(sb){sb.onclick=null;sb.addEventListener('click',bvStart);}
    bvUpdateStats();
    bvRenderBoard(bvGenPosition(),false,null,false);
  });
}

function bvStart(){
  if(BV.countdownTimer){clearInterval(BV.countdownTimer);BV.countdownTimer=null;}
  BV.active=true;BV.pts=0;BV.lives=5;BV.streak=0;BV.correct=0;BV.wrong=0;
  BV.best=parseInt(localStorage.getItem('bv_best')||'0');
  const go=bvEl('bv-gameover'),sb=bvEl('bv-start-btn'),nb=bvEl('bv-next-btn');
  if(go)go.style.display='none';
  if(sb)sb.style.display='none';
  if(nb)nb.style.display='none';
  bvUpdateStats();
  bvNextRound();
}

function bvNextRound(){
  if(!BV.active)return;
  if(BV.countdownTimer){clearInterval(BV.countdownTimer);BV.countdownTimer=null;}
  // Remove injected next button from previous round
  const ob=document.getElementById('bv-injected-next');if(ob)ob.remove();
  BV.awaitingClick=false;
  // Generate fresh position + question (retry if no question)
  let tries=0;
  do{
    BV.board=bvGenPosition();
    BV.asWhite=Math.random()<0.5;
    BV.challenge=bvGenQuestion(BV.board,BV.asWhite);
    tries++;
  }while(!BV.challenge&&tries<10);
  if(!BV.challenge){bvGameOver();return;}
  BV.phase='countdown';
  // Hide all question UI
  ['bv-question-wrap','bv-choices','bv-board-instruction','bv-feedback','bv-next-btn']
    .forEach(id=>{const e=bvEl(id);if(e)e.style.display='none';});
  const cw=bvEl('bv-countdown-wrap');if(cw)cw.style.display='block';
  bvRenderBoard(BV.board,false,null,false);
  // 5-second countdown
  let secs=5;
  const cdEl=bvEl('bv-countdown');if(cdEl)cdEl.textContent=secs;
  BV.countdownTimer=setInterval(()=>{
    secs--;
    if(cdEl)cdEl.textContent=secs;
    if(secs<=0){clearInterval(BV.countdownTimer);BV.countdownTimer=null;bvShowQuestion();}
  },1000);
}

function bvShowQuestion(){
  BV.phase='question';
  bvRenderBoard(BV.board,true,null,false);
  const cw=bvEl('bv-countdown-wrap');if(cw)cw.style.display='none';
  // Use block not flex — simpler, no direction needed
  const qw=bvEl('bv-question-wrap');if(qw)qw.style.display='block';
  const ch=BV.challenge;
  const cat=bvEl('bv-q-category'),txt=bvEl('bv-q-text'),hint=bvEl('bv-q-hint');
  if(cat)cat.textContent=ch.cat||'';
  if(txt)txt.textContent=ch.text||'';
  if(hint)hint.textContent=ch.hint||'';
  if(ch.choices){
    const choicesEl=bvEl('bv-choices');
    const bi=bvEl('bv-board-instruction');
    if(bi)bi.style.display='none';
    if(choicesEl){
      choicesEl.style.display='flex';
      choicesEl.style.flexDirection='column';
      choicesEl.innerHTML='';
      ch.choices.forEach(opt=>{
        const btn=document.createElement('button');
        btn.className='btn';
        btn.style.cssText='text-align:left;padding:10px 14px;font-size:13px;width:100%;border-radius:var(--radius);cursor:pointer;transition:background .1s';
        btn.textContent=opt;
        btn.onclick=()=>bvAnswerChoice(opt,btn,choicesEl);
        choicesEl.appendChild(btn);
      });
    }
  } else if(ch.clickType==='square'){
    const choicesEl=bvEl('bv-choices');if(choicesEl)choicesEl.style.display='none';
    const bi=bvEl('bv-board-instruction');if(bi)bi.style.display='block';
    BV.awaitingClick=true;
    bvRenderBoard(BV.board,true,null,true);
  }
}

function bvAnswerChoice(choice,btn,choicesEl){
  choicesEl.querySelectorAll('button').forEach(b=>{
    b.disabled=true;
    if(b.textContent===BV.challenge.answer)
      b.style.background='rgba(98,196,98,.4)';
    else if(b===btn&&choice!==BV.challenge.answer)
      b.style.background='rgba(220,60,60,.4)';
  });
  // Reveal board so they see where things were
  bvRenderBoard(BV.board,false,null,false);
  bvResolve(choice===BV.challenge.answer,BV.challenge.answer);
}

function bvHandleClick(r,c){
  if(!BV.awaitingClick||BV.phase!=='question')return;
  BV.awaitingClick=false;
  const ch=BV.challenge;
  const correct=(ch.answer.r===r&&ch.answer.c===c);
  // Reveal board: green=correct square, red=wrong click
  bvRenderBoardWithMarks(BV.board,ch.answer.r,ch.answer.c,correct?-1:r,correct?-1:c);
  const bi=bvEl('bv-board-instruction');if(bi)bi.style.display='none';
  bvResolve(correct,bvUci(ch.answer.r,ch.answer.c));
}

function bvRenderBoardWithMarks(board,greenR,greenC,redR,redC){
  const boardEl=document.getElementById('board');
  if(!boardEl)return;
  const svg=document.getElementById('arrow-svg');
  boardEl.innerHTML='';
  if(svg)boardEl.appendChild(svg);
  for(let vr=0;vr<8;vr++){
    for(let vc=0;vc<8;vc++){
      const r=BV.asWhite?vr:7-vr, c=BV.asWhite?vc:7-vc;
      const sq=document.createElement('div');
      sq.className='sq '+((r+c)%2===0?'light':'dark');
      if(r===greenR&&c===greenC)sq.classList.add('hint-sq');
      else if(r===redR&&c===redC)sq.classList.add('wrong');
      if(board[r][c]){
        const span=document.createElement('span');
        span.className='piece '+(board[r][c][0]==='w'?'white':'black');
        span.innerHTML=GLYPHS[board[r][c]];
        sq.appendChild(span);
      }
      boardEl.appendChild(sq);
    }
  }
  const ranksEl=document.getElementById('ranks');
  if(ranksEl){ranksEl.innerHTML='';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=BV.asWhite?8-i:i+1;ranksEl.appendChild(s);}}
  const filesEl=document.getElementById('files');
  if(filesEl){filesEl.innerHTML='';const fl=BV.asWhite?'abcdefgh':'hgfedcba';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=fl[i];filesEl.appendChild(s);}}
}

function bvResolve(correct,answerText){
  BV.phase='feedback';
  const fb=document.getElementById('bv-feedback');
  if(correct){
    const bonus=Math.max(0,BV.streak*2);
    BV.pts+=10+bonus;BV.streak++;BV.correct++;
    if(BV.pts>BV.best){BV.best=BV.pts;localStorage.setItem('bv_best',BV.best);}
    playWood(false);
    if(fb){fb.style.display='block';fb.className='chaos-status ok';
      fb.textContent='✓ Correct! +'+(10+bonus)+' pts'+(bonus>0?' 🔥':'');}
  } else {
    BV.streak=0;BV.lives--;BV.wrong++;
    playErr();
    if(fb){fb.style.display='block';fb.className='chaos-status err';
      fb.textContent='✗ Wrong. Answer: '+answerText;}
  }
  bvUpdateStats();
  if(BV.lives<=0){bvGameOver();return;}
  // Remove any old injected next button and inject a fresh one after feedback
  const nb=document.getElementById('bv-next-btn');
  if(nb)nb.style.display='block';
}

function bvNext(){
  const nb=document.getElementById('bv-next-btn');
  if(nb)nb.style.display='none';
  bvNextRound();
}

function bvGameOver(){
  if(BV.countdownTimer){clearInterval(BV.countdownTimer);BV.countdownTimer=null;}
  if(BV.autoTimer){clearTimeout(BV.autoTimer);BV.autoTimer=null;}
  BV.active=false;BV.phase='idle';
  ['bv-question-wrap','bv-choices','bv-board-instruction',
   'bv-feedback','bv-next-btn','bv-countdown-wrap'].forEach(id=>{
    const e=bvEl(id);if(e)e.style.display='none';
  });
  const go=bvEl('bv-gameover'),sb=bvEl('bv-start-btn');
  if(go){go.style.display='block';
    const gs=bvEl('bv-go-score'),gsub=bvEl('bv-go-sub');
    if(gs)gs.textContent=BV.pts;
    if(gsub)gsub.textContent='pts · '+BV.correct+' correct · Best: '+BV.best;}
  if(sb)sb.style.display='block';
  bvUpdateStats();
  bvRenderBoard(bvGenPosition(),false,null,false);
}


/* ════════════════════════════════════════════════════════
   STOP & CHECK — Blunder Prevention Training Mode
   Board stays VISIBLE. Questions train threat-detection habits.
════════════════════════════════════════════════════════ */
const SC={
  active:false,pts:0,lives:5,streak:0,best:0,correct:0,wrong:0,
  board:null,asWhite:true,challenge:null,phase:'idle',
  awaitingClick:false,
};

function scEl(id){return document.getElementById(id);}

/* ── Attack engine ── */
function scAttackedBy(board,r,c,byColor){
  // Returns true if square (r,c) is attacked by byColor
  const opp=byColor;
  const NDIRS=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  const RDIRS=[[1,0],[-1,0],[0,1],[0,-1]];
  const BDIRS=[[1,1],[1,-1],[-1,1],[-1,-1]];
  const QDIRS=[...RDIRS,...BDIRS];
  for(let nr=0;nr<8;nr++)for(let nc=0;nc<8;nc++){
    const p=board[nr][nc];
    if(!p||p[0]!==opp)continue;
    const pt=p[1];
    if(pt==='N'){for(const[dr,dc]of NDIRS)if(nr+dr===r&&nc+dc===c)return true;}
    else if(pt==='P'){
      const dir=opp==='w'?-1:1;
      if(nr+dir===r&&(nc+1===c||nc-1===c))return true;
    }
    else if(pt==='K'){if(Math.abs(nr-r)<=1&&Math.abs(nc-c)<=1)return true;}
    else{
      const dirs=pt==='Q'?QDIRS:pt==='R'?RDIRS:BDIRS;
      for(const[dr,dc]of dirs){
        let cr=nr+dr,cc=nc+dc;
        while(cr>=0&&cr<8&&cc>=0&&cc<8){
          if(cr===r&&cc===c){return true;}
          if(board[cr][cc])break;
          cr+=dr;cc+=dc;
        }
      }
    }
  }
  return false;
}

function scIsDefended(board,r,c,byColor){return scAttackedBy(board,r,c,byColor);}

function scHangingPieces(board,color){
  // Pieces of 'color' that are attacked by opponent and not defended by own color
  const opp=color==='w'?'b':'w';
  const hanging=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p||p[0]!==color||p[1]==='K')continue;
    if(scAttackedBy(board,r,c,opp)&&!scIsDefended(board,r,c,color))
      hanging.push({r,c,p});
  }
  return hanging;
}

function scFreeCapturesFor(board,color){
  // Pieces of opposite color that 'color' can capture for free (undefended + attacked)
  const opp=color==='w'?'b':'w';
  const targets=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p||p[0]!==opp||p[1]==='K')continue;
    if(scAttackedBy(board,r,c,color)&&!scIsDefended(board,r,c,opp))
      targets.push({r,c,p});
  }
  return targets;
}

function scChecksFor(board,color){
  // Legal squares where 'color' can move to give check
  const opp=color==='w'?'b':'w';
  return bvCheckMoves(board,color,opp);
}

function scAttackedPieces(board,color){
  const opp=color==='w'?'b':'w';
  const attacked=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p||p[0]!==color)continue;
    if(scAttackedBy(board,r,c,opp))attacked.push({r,c,p});
  }
  return attacked;
}

/* ── Question generator ── */
function scGenQuestion(board,asWhite){
  const mc=asWhite?'w':'b', oc=asWhite?'b':'w';
  const ms=asWhite?'White':'Black', os=asWhite?'Black':'White';
  const bank=[];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
  const rand=a=>a[0|Math.random()*a.length];
  const pname={K:'King',Q:'Queen',R:'Rook',B:'Bishop',N:'Knight',P:'Pawn'};
  const plabel=p=>(p[0]==='w'?'White ':'Black ')+pname[p[1]];

  const myHanging=scHangingPieces(board,mc);
  const oppHanging=scHangingPieces(board,oc);
  const myFree=scFreeCapturesFor(board,mc);
  const myChecks=scChecksFor(board,board,mc,oc);
  const myAttacked=scAttackedPieces(board,mc);
  const oppAttacked=scAttackedPieces(board,oc);

  // Q1: Is any of YOUR pieces hanging? Click it or say None
  {
    if(myHanging.length>0){
      const t=rand(myHanging);
      bank.push({type:'click',cat:'⚠️ Your Hanging Pieces',
        text:`One of your pieces is hanging (attacked & undefended). Click it!`,
        hint:'A hanging piece can be taken for free.',
        answer:{r:t.r,c:t.c},explanation:`Your ${pname[t.p[1]]} on ${bvUci(t.r,t.c)} is hanging!`});
    } else {
      bank.push({type:'choice',cat:'⚠️ Your Hanging Pieces',
        text:`Are any of your pieces hanging right now?`,
        hint:'A hanging piece is attacked but not defended.',
        choices:['Yes — I have a hanging piece','No — all my pieces are safe'],
        answer:'No — all my pieces are safe',
        explanation:'Good — no hanging pieces. Always check this before moving!'});
    }
  }

  // Q2: Can your opponent take anything for free?
  {
    if(oppHanging.length>0){
      const t=rand(oppHanging);
      bank.push({type:'click',cat:'🎯 Free Captures',
        text:`Your opponent has a piece you can take for free! Click it.`,
        hint:'It\'s undefended and you attack it.',
        answer:{r:t.r,c:t.c},explanation:`${pname[t.p[1]]} on ${bvUci(t.r,t.c)} is free!`});
    } else {
      bank.push({type:'choice',cat:'🎯 Free Captures',
        text:`Do you have a free capture available right now?`,
        hint:'An undefended enemy piece you attack.',
        choices:['Yes — I can take something for free','No — no free captures'],
        answer:'No — no free captures',
        explanation:'Correct — no free captures. Always check before moving!'});
    }
  }

  // Q3: Which of YOUR pieces is under attack?
  if(myAttacked.length>0){
    const t=rand(myAttacked);
    bank.push({type:'click',cat:'👁 Threat Detection',
      text:`One of your pieces is under attack. Click it.`,
      hint:'Your opponent can capture it. Find it!',
      answer:{r:t.r,c:t.c},explanation:`Your ${pname[t.p[1]]} on ${bvUci(t.r,t.c)} is under attack!`});
  }

  // Q4: Is there a check available?
  {
    const chks=bvCheckMoves(board,mc,oc);
    if(chks.length>0){
      const mv=rand(chks);
      bank.push({type:'click',cat:'♟ Check Available!',
        text:`You can give check! Click the square to move your ${pname[mv.p[1]]} to.`,
        hint:'Giving check forces your opponent to react.',
        answer:{r:mv.toR,c:mv.toC},explanation:`Moving your ${pname[mv.p[1]]} to ${bvUci(mv.toR,mv.toC)} gives check!`});
    } else {
      bank.push({type:'choice',cat:'♟ Check Available?',
        text:`Can you give check right now?`,
        hint:'Look for a move that attacks the enemy king.',
        choices:['Yes — I can give check','No — no check available'],
        answer:'No — no check available',
        explanation:'No checks available. Good awareness!'});
    }
  }

  // Q5: How many of your pieces are attacked?
  {
    const cnt=myAttacked.length;
    const opts=shuffle([...new Set([cnt,Math.max(0,cnt-1),cnt+1,cnt+2])]).slice(0,4).map(String);
    if(opts.includes(String(cnt))){
      bank.push({type:'choice',cat:'👁 Count Threats',
        text:`How many of YOUR pieces are currently under attack by ${os}?`,
        hint:'Count every piece your opponent attacks, including defended ones.',
        choices:opts,answer:String(cnt),
        explanation:`${cnt} of your pieces are under attack. Always count!`});
    }
  }

  // Q6: Is this piece safe? (pick a random attacked piece and ask)
  if(myAttacked.length>0){
    const t=rand(myAttacked);
    const defended=scIsDefended(board,t.r,t.c,mc);
    const correct=defended?'It is defended — safe for now':'It is hanging — DANGER!';
    bank.push({type:'choice',cat:'🔍 Is It Safe?',
      text:`Your ${pname[t.p[1]]} on ${bvUci(t.r,t.c)} is attacked. Is it safe?`,
      hint:'Check if it is defended by another piece.',
      choices:['It is defended — safe for now','It is hanging — DANGER!','It cannot be taken','Ignore it'],
      answer:correct,
      explanation:defended?`Yes — it\'s defended. But watch for exchanges!`:`No — it\'s hanging! Move it or defend it.`});
  }

  // Q7: Does your opponent have any pieces attacked by YOU?
  if(oppAttacked.length>0){
    const t=rand(oppAttacked);
    bank.push({type:'click',cat:'⚔️ Opponent\'s Attacked Pieces',
      text:`You are attacking one of ${os}'s pieces. Click which one.`,
      hint:'You might be able to capture it profitably.',
      answer:{r:t.r,c:t.c},explanation:`${os}'s ${pname[t.p[1]]} on ${bvUci(t.r,t.c)} is under your attack!`});
  }

  // Q8: True/False — is a specific piece hanging?
  {
    const allPieces=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(board[r][c])allPieces.push({r,c,p:board[r][c]});
    if(allPieces.length>0){
      const t=rand(allPieces);
      const col=t.p[0];const opp2=col==='w'?'b':'w';
      const isHanging=scAttackedBy(board,t.r,t.c,opp2)&&!scIsDefended(board,t.r,t.c,col)&&t.p[1]!=='K';
      const correct=isHanging?'Yes — it is hanging':'No — it is safe';
      bank.push({type:'choice',cat:'🔍 Hanging Check',
        text:`Is the ${plabel(t.p)} on ${bvUci(t.r,t.c)} hanging?`,
        hint:'Hanging = attacked and not defended.',
        choices:['Yes — it is hanging','No — it is safe'],
        answer:correct,
        explanation:isHanging?`Yes! ${plabel(t.p)} is undefended.`:`No — it is defended or not attacked.`});
    }
  }

  return bank.length>0?rand(bank):null;
}

/* ── Board rendering (pieces always visible) ── */
function scRenderBoard(board,asWhite,highlight,clickable,wrongSq){
  const boardEl=document.getElementById('board');
  if(!boardEl)return;
  const svg=document.getElementById('arrow-svg');
  boardEl.innerHTML='';
  if(svg)boardEl.appendChild(svg);
  for(let vr=0;vr<8;vr++){
    for(let vc=0;vc<8;vc++){
      const r=asWhite?vr:7-vr, c=asWhite?vc:7-vc;
      const sq=document.createElement('div');
      sq.className='sq '+((r+c)%2===0?'light':'dark');
      if(highlight&&highlight.r===r&&highlight.c===c)sq.classList.add('hint-sq');
      if(wrongSq&&wrongSq.r===r&&wrongSq.c===c)sq.classList.add('wrong');
      if(board[r][c]){
        const span=document.createElement('span');
        span.className='piece '+(board[r][c][0]==='w'?'white':'black');
        span.innerHTML=GLYPHS[board[r][c]];
        sq.appendChild(span);
      }
      if(clickable){
        sq.style.cursor='pointer';
        sq.addEventListener('click',()=>scHandleClick(r,c));
      }
      boardEl.appendChild(sq);
    }
  }
  const re=document.getElementById('ranks');
  if(re){re.innerHTML='';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=asWhite?8-i:i+1;re.appendChild(s);}}
  const fe=document.getElementById('files');
  if(fe){fe.innerHTML='';const fl=asWhite?'abcdefgh':'hgfedcba';for(let i=0;i<8;i++){const s=document.createElement('span');s.textContent=fl[i];fe.appendChild(s);}}
}

/* ── Panel builder ── */
function scBuildPanel(container){
  const p=document.createElement('div');
  p.id='sc-panel';
  p.style.cssText='display:flex;flex-direction:column;gap:10px;padding:0';
  p.innerHTML=`
    <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;font-size:12px;color:var(--text2);line-height:1.5;border-left:3px solid var(--accent)">
      <strong style="color:var(--accent)">🛑 Stop &amp; Check</strong><br>
      Before every move in real games, scan for: hanging pieces, free captures, checks, and threats.
      This mode trains that habit with real positions.
    </div>
    <div class="chaos-score">
      <div><div class="chaos-pts" id="sc-pts">0</div><div class="chaos-pts-lbl">points</div></div>
      <div style="text-align:center"><div class="chaos-hearts" id="sc-hearts">♥♥♥♥♥</div><div style="font-size:10px;color:var(--text3);margin-top:2px">lives</div></div>
      <div style="text-align:right"><div id="sc-streak" style="font-size:18px;min-height:24px"></div><div style="font-size:10px;color:var(--text3)">streak</div></div>
    </div>
    <div style="display:flex;gap:6px">
      <div class="stat" style="flex:1"><div class="val" id="sc-correct" style="font-size:18px;font-weight:600;color:var(--green)">0</div><div class="lbl">correct</div></div>
      <div class="stat" style="flex:1"><div class="val" id="sc-wrong" style="font-size:18px;font-weight:600;color:var(--red)">0</div><div class="lbl">wrong</div></div>
      <div class="stat" style="flex:1"><div class="val" id="sc-best" style="font-size:18px;font-weight:600;color:var(--gold)">0</div><div class="lbl">best</div></div>
    </div>
    <div id="sc-side-badge" style="display:none;text-align:center;font-size:11px;font-weight:700;padding:4px 8px;border-radius:20px;letter-spacing:.04em"></div>
    <div id="sc-question-wrap" style="display:none;background:var(--bg3);border-radius:var(--radius);padding:12px">
      <div id="sc-q-cat" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin-bottom:4px"></div>
      <div id="sc-q-text" style="font-size:14px;font-weight:600;color:var(--text);line-height:1.45;margin-bottom:4px"></div>
      <div id="sc-q-hint" style="font-size:11px;color:var(--text3)"></div>
    </div>
    <div id="sc-choices" style="display:none;flex-direction:column;gap:5px"></div>
    <div id="sc-board-instr" style="display:none;background:var(--bg3);border-radius:var(--radius);padding:9px 12px;font-size:12px;color:var(--accent);text-align:center;font-weight:700">👆 Click the piece on the board</div>
    <div id="sc-explanation" style="display:none;background:var(--bg3);border-radius:var(--radius);padding:10px 12px;font-size:12px;color:var(--text2);line-height:1.5"></div>
    <div id="sc-feedback" style="display:none;padding:10px;border-radius:var(--radius);font-size:13px;font-weight:600"></div>
    <div id="sc-gameover" style="display:none"><div class="chaos-gameover"><div class="go-title">GAME OVER</div><div class="go-score" id="sc-go-score">0</div><div class="go-sub" id="sc-go-sub">pts</div></div></div>
  `;
  const startBtn=document.createElement('button');
  startBtn.id='sc-start-btn';startBtn.className='chaos-start';
  startBtn.textContent='🛑 Start Stop & Check';
  startBtn.addEventListener('click',scStart);
  p.appendChild(startBtn);
  const nextBtn=document.createElement('button');
  nextBtn.id='sc-next-btn';nextBtn.className='chaos-start';
  nextBtn.textContent='Next →';
  nextBtn.style.display='none';
  nextBtn.addEventListener('click',scNext);
  p.appendChild(nextBtn);
  container.appendChild(p);
}

/* ── State machine ── */
function scUpdateStats(){
  const set=(id,v)=>{const e=scEl(id);if(e)e.textContent=v;};
  set('sc-pts',SC.pts);
  set('sc-hearts','♥'.repeat(SC.lives)+'♡'.repeat(5-SC.lives));
  set('sc-streak',SC.streak>=3?SC.streak+'🔥':SC.streak>0?String(SC.streak):'');
  set('sc-correct',SC.correct);set('sc-wrong',SC.wrong);set('sc-best',SC.best);
}

function scInit(){
  SC.active=false;SC.pts=0;SC.lives=5;SC.streak=0;SC.correct=0;SC.wrong=0;
  SC.best=parseInt(localStorage.getItem('sc_best')||'0');
  SC.phase='idle';SC.awaitingClick=false;
  scUpdateStats();
  scRenderBoard(bvGenPosition(),true,null,false,null);
}

function scStart(){
  SC.active=true;SC.pts=0;SC.lives=5;SC.streak=0;SC.correct=0;SC.wrong=0;
  SC.best=parseInt(localStorage.getItem('sc_best')||'0');
  scEl('sc-gameover').style.display='none';
  scEl('sc-start-btn').style.display='none';
  scUpdateStats();
  scNextRound();
}

function scNextRound(){
  if(!SC.active)return;
  SC.awaitingClick=false;
  // Hide UI
  ['sc-question-wrap','sc-choices','sc-board-instr','sc-feedback','sc-explanation','sc-next-btn','sc-side-badge']
    .forEach(id=>{const e=scEl(id);if(e)e.style.display='none';});
  // Generate position + question (retry until we get a good question)
  let tries=0,q=null;
  do{
    SC.board=bvGenPosition();
    SC.asWhite=Math.random()<0.5;
    q=scGenQuestion(SC.board,SC.asWhite);
    tries++;
  }while(!q&&tries<15);
  if(!q){scNextRound();return;}
  SC.challenge=q;
  SC.phase='question';
  // Show side badge
  const badge=scEl('sc-side-badge');
  if(badge){
    badge.style.display='block';
    badge.style.background=SC.asWhite?'rgba(255,255,255,.15)':'rgba(0,0,0,.25)';
    badge.textContent='You play as '+(SC.asWhite?'White ♔':'Black ♚');
  }
  // Render board WITH pieces visible
  scRenderBoard(SC.board,SC.asWhite,null,q.type==='click',null);
  // Show question
  const qw=scEl('sc-question-wrap');if(qw)qw.style.display='block';
  scEl('sc-q-cat').textContent=q.cat||'';
  scEl('sc-q-text').textContent=q.text||'';
  scEl('sc-q-hint').textContent=q.hint||'';
  if(q.type==='choice'){
    const ce=scEl('sc-choices');
    ce.style.display='flex';ce.style.flexDirection='column';ce.innerHTML='';
    q.choices.forEach(opt=>{
      const btn=document.createElement('button');
      btn.className='btn';
      btn.style.cssText='text-align:left;padding:10px 14px;font-size:13px;width:100%;border-radius:var(--radius);cursor:pointer';
      btn.textContent=opt;
      btn.addEventListener('click',()=>scAnswerChoice(opt,btn,ce));
      ce.appendChild(btn);
    });
  } else {
    const bi=scEl('sc-board-instr');if(bi)bi.style.display='block';
    SC.awaitingClick=true;
  }
}

function scAnswerChoice(choice,btn,ce){
  if(SC.phase!=='question')return;
  SC.phase='feedback';
  ce.querySelectorAll('button').forEach(b=>{
    b.disabled=true;
    if(b.textContent===SC.challenge.answer)b.style.background='rgba(98,196,98,.4)';
    else if(b===btn&&choice!==SC.challenge.answer)b.style.background='rgba(220,60,60,.4)';
  });
  scResolve(choice===SC.challenge.answer);
}

function scHandleClick(r,c){
  if(!SC.awaitingClick||SC.phase!=='question')return;
  SC.awaitingClick=false;
  SC.phase='feedback';
  const ch=SC.challenge;
  const correct=(ch.answer.r===r&&ch.answer.c===c);
  scRenderBoard(SC.board,SC.asWhite,{r:ch.answer.r,c:ch.answer.c},false,correct?null:{r,c});
  scEl('sc-board-instr').style.display='none';
  scResolve(correct);
}

function scResolve(correct){
  const fb=scEl('sc-feedback'),ex=scEl('sc-explanation'),nb=scEl('sc-next-btn');
  if(correct){
    const bonus=Math.max(0,SC.streak*2);
    SC.pts+=10+bonus;SC.streak++;SC.correct++;
    if(SC.pts>SC.best){SC.best=SC.pts;localStorage.setItem('sc_best',SC.best);}
    playWood(false);
    if(fb){fb.style.display='block';fb.style.background='rgba(98,196,98,.2)';fb.style.color='var(--green)';
      fb.textContent='✓ Correct!'+(bonus>0?' +'+(10+bonus)+' pts 🔥':' +10 pts');}
  } else {
    SC.streak=0;SC.lives--;SC.wrong++;
    playErr();
    if(fb){fb.style.display='block';fb.style.background='rgba(220,60,60,.2)';fb.style.color='var(--red)';
      fb.textContent='✗ Wrong! Study the position carefully.';}
  }
  // Always show the explanation after answering
  if(ex&&SC.challenge.explanation){
    ex.style.display='block';
    ex.textContent='💡 '+SC.challenge.explanation;
  }
  scUpdateStats();
  if(SC.lives<=0){scGameOver();return;}
  if(nb)nb.style.display='block';
}

function scNext(){
  const nb=scEl('sc-next-btn');if(nb)nb.style.display='none';
  scNextRound();
}

function scGameOver(){
  SC.active=false;SC.phase='idle';
  ['sc-question-wrap','sc-choices','sc-board-instr','sc-feedback','sc-explanation','sc-next-btn','sc-side-badge']
    .forEach(id=>{const e=scEl(id);if(e)e.style.display='none';});
  const go=scEl('sc-gameover'),sb=scEl('sc-start-btn');
  if(go){go.style.display='block';
    scEl('sc-go-score').textContent=SC.pts;
    scEl('sc-go-sub').textContent=`pts · ${SC.correct} correct · Best: ${SC.best}`;}
  if(sb)sb.style.display='block';
  scUpdateStats();
  scRenderBoard(bvGenPosition(),true,null,false,null);
}
