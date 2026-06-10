/**
 * ChessVault — Core Openings Database
 * Modular design: drop new opening files in /openings/ and register them here.
 * Each file exports an object compatible with the OPENINGS registry.
 */

window.OPENINGS = {};

/* ═══════════════════════════════════════════════
   OPENING REGISTRY — add new packs here
═══════════════════════════════════════════════ */
window.OPENING_PACKS = [
  { key: 'core', label: 'Core Repertoire', file: null }, // loaded inline below
];

/* ═══════════════════════════════════════════════
   SCOTCH GAME
═══════════════════════════════════════════════ */
window.OPENINGS.scotch = {
  flipped: false, myColor: 'w',
  label: 'Scotch Game', category: 'Open Games', emoji: '⚔️',
  lines: [
    {
      name: '1. Classical — 4...Bc5 5.Be3 Qf6',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','f8c5','c1e3','d8f6','c2c3','g8e7','f1c4','c6e5','c4e2','d7d5','e4d5','e7d5','e1g1'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        {t:"e5 — Symmetrical centre.",ar:[{f:'e7',t:'e5'}]},
        {t:"Nf3 — Development, attacks e5.",ar:[{f:'g1',t:'f3'}]},
        {t:"Nc6 — Defends e5, develops.",ar:[{f:'b8',t:'c6'}]},
        {t:"d4 — The Scotch! Strike in the centre.",tags:["Scotch"],ar:[{f:'d2',t:'d4'}]},
        {t:"exd4 — Black accepts.",ar:[{f:'e5',t:'d4'}]},
        {t:"Nxd4 — Knight recaptures, dominant on d4.",ar:[{f:'f3',t:'d4'}]},
        {t:"Bc5 — Classical! Attacks d4 and eyes f2.",tags:["Classical Scotch","Pressure on d4"],ar:[{f:'f8',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
        {t:"Be3 — Challenges the c5 bishop.",tags:["Challenge bishop"],ar:[{f:'c1',t:'e3'}]},
        {t:"Qf6 — Attacks d4 AND f2 simultaneously!",tags:["Double attack","Aggressive"],ar:[{f:'d8',t:'f6'},{f:'f6',t:'d4',c:'r'},{f:'f6',t:'f2',c:'r'}]},
        {t:"c3 — Defends d4, prepares Bc4.",tags:["Solid defence"],ar:[{f:'c2',t:'c3'}]},
        {t:"Nge7 — Knight develops, heading to g6 or f5.",tags:["Flexible knight"],ar:[{f:'g8',t:'e7'},{f:'e7',t:'g6',c:'r'}]},
        {t:"Bc4 — Active bishop, threatens Nd5.",tags:["Active bishop"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
        {t:"Ne5 — The c6 knight jumps to the powerful e5 outpost!",tags:["Strong outpost"],ar:[{f:'c6',t:'e5'},{f:'e5',t:'f3',c:'r'}]},
        {t:"Be2 — Bishop retreats to safety.",tags:["Consolidate"],ar:[{f:'c4',t:'e2'}]},
        {t:"d5 — Black's central break! Liberates the position.",tags:["Central break","Key move"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
        {t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
        {t:"Nxd5 — The e7 knight recaptures on d5, perfectly centralised!",tags:["Central knight","Key recapture"],ar:[{f:'e7',t:'d5'}]},
        {t:"O-O — White castles. Well-coordinated position.",tags:["Castle","Development complete"],ar:[{f:'e1',t:'g1'}]},
      ]
    },
    {
      name: '2. Schmidt (Mieses) — 4...Nf6 5.Nxc6',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g8f6','d4c6','b7c6','e4e5','d8e7','d1e2','f6d5','c2c4','d5b6','b1c3','c8a6','b2b3'],
      explain: [
        null,null,null,null,null,null,null,
        {t:"Nf6 — Mieses/Schmidt! Attacks e4 immediately.",tags:["Mieses/Schmidt","Active"],ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
        {t:"Nxc6 — White exchanges, creating doubled c-pawns.",tags:["Doubled pawns"],ar:[{f:'d4',t:'c6'}]},
        {t:"bxc6 — Black recaptures. Gets the open b-file and bishop pair.",tags:["Open b-file","Bishop pair"],ar:[{f:'b7',t:'c6'}]},
        {t:"e5 — Gains space, kicks the f6 knight.",tags:["Space","Forcing"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
        {t:"Qe7 — Pins the e5 pawn, defends knight.",tags:["Pin","Dual purpose"],ar:[{f:'d8',t:'e7'},{f:'e7',t:'e5',c:'r'}]},
        {t:"Qe2 — Supports e5, prepares to exchange queens.",tags:["Support e5"],ar:[{f:'d1',t:'e2'}]},
        {t:"Nd5 — Knight leaps to the ideal central square!",tags:["Ideal outpost"],ar:[{f:'f6',t:'d5'}]},
        {t:"c4 — Kicks the knight.",tags:["Kick knight","Space"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
        {t:"Nb6 — Knight retreats to b6.",ar:[{f:'d5',t:'b6'}]},
        {t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
        {t:"Ba6 — Active bishop, targets c4 and e2.",tags:["Active bishop","Target c4"],ar:[{f:'c8',t:'a6'},{f:'a6',t:'c4',c:'r'}]},
        {t:"b3 — Defends c4 and prepares Bb2.",tags:["Defend c4","Prepare Bb2"],ar:[{f:'b2',t:'b3'}]},
      ]
    },
    {
      name: '3. Steinitz — 4...Qh4 trap line',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','d8h4','b1c3','f8b4','d1d3','g8f6','c1d2','e8g8','e1c1','f8e8','f2f3','d7d5','g2g3'],
      explain: [
        null,null,null,null,null,null,null,
        {t:"Qh4?! — Steinitz trap! Attacks e4 and threatens Qxe4+.",tags:["Trap","Aggressive queen","Watch out"],ar:[{f:'d8',t:'h4'},{f:'h4',t:'e4',c:'r'}]},
        {t:"Nc3 — White develops, ignoring the queen.",tags:["Ignore queen","Development"],ar:[{f:'b1',t:'c3'}]},
        {t:"Bb4 — Pinning the c3 knight.",tags:["Pin"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
        {t:"Qd3 — Multi-purpose! Defends e4, prepares Nc3-d5.",tags:["Defend e4","Multi-purpose"],ar:[{f:'d1',t:'d3'}]},
        {t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
        {t:"Bd2 — Develops, prepares O-O-O.",tags:["Development","Castle prep"],ar:[{f:'c1',t:'d2'}]},
        {t:"O-O — Black castles for safety.",ar:[{f:'e8',t:'g8'}]},
        {t:"O-O-O — White castles queenside! Sharp position.",tags:["Sharp","Queenside castle"],ar:[{f:'e1',t:'c1'}]},
        {t:"Re8 — Rook centralises.",ar:[{f:'f8',t:'e8'}]},
        {t:"f3 — Supports e4, prepares g4.",tags:["Pawn storm prep"],ar:[{f:'f2',t:'f3'}]},
        {t:"d5 — Black's counter-attack in the centre.",tags:["Counter-attack"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
        {t:"g3 — White attacks the queen.",tags:["Attack queen"],ar:[{f:'g2',t:'g3'},{f:'g3',t:'h4',c:'r'}]},
      ]
    },
    {
      name: '4. Malaniuk — 4...Bb4+ check',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','f8b4','c2c3','b4a5','c1e3','g8f6','d4c6','b7c6','f1d3','d7d5','e4d5','c6d5','e1g1'],
      explain: [
        null,null,null,null,null,null,null,
        {t:"Bb4+ — Malaniuk! Check disrupts White's development.",tags:["Check","Disruption"],ar:[{f:'f8',t:'b4'}]},
        {t:"c3 — Blocks the check, challenges bishop.",tags:["Block check"],ar:[{f:'c2',t:'c3'},{f:'c3',t:'b4',c:'r'}]},
        {t:"Ba5 — Bishop retreats to a5, eyes c3 and e1.",tags:["Active bishop","Lateral pressure"],ar:[{f:'b4',t:'a5'},{f:'a5',t:'e1',c:'r'}]},
        {t:"Be3 — Develops, prepares Nxc6.",ar:[{f:'c1',t:'e3'}]},
        {t:"Nf6 — Development, attacks d4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'d4',c:'r'}]},
        {t:"Nxc6 — White exchanges, creating doubled c-pawns.",tags:["Exchange","Doubled pawns"],ar:[{f:'d4',t:'c6'}]},
        {t:"bxc6 — Black recaptures. Open b-file and bishop pair.",tags:["Open b-file","Bishop pair"],ar:[{f:'b7',t:'c6'}]},
        {t:"Bd3 — Active bishop, eyes h7.",tags:["Active bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
        {t:"d5 — Black's central break!",tags:["Central break"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
        {t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
        {t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
        {t:"O-O — White castles. Good position with the bishop pair.",tags:["Castle","Slight advantage"],ar:[{f:'e1',t:'g1'}]},
      ]
    },
    {
      name: '5. Scotch Gambit — 4.Bc4 Nf6 5.e5',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f1c4','g8f6','e4e5','d7d5','c4b5','f6e4','f3d4','c8d7','e1g1','f8e7','f1e1','e8g8','d4c6'],
      explain: [
        null,null,null,null,null,null,null,
        {t:"Nf6 — Solid response, attacks e4.",tags:["Best response"],ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
        {t:"e5 — White advances, kicking the knight.",tags:["Gambit play","Space"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
        {t:"d5 — Best! Black counters in the centre.",tags:["Best response","Counter-attack"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
        {t:"Bb5 — Pins the c6 knight.",tags:["Pin"],ar:[{f:'c4',t:'b5'},{f:'b5',t:'c6',c:'r'}]},
        {t:"Ne4 — Knight to the powerful e4 outpost!",tags:["Outpost"],ar:[{f:'f6',t:'e4'}]},
        {t:"Nxd4 — White recaptures with the knight.",ar:[{f:'f3',t:'d4'}]},
        {t:"Bd7 — Develops, unpins c6.",tags:["Development","Unpin"],ar:[{f:'c8',t:'d7'}]},
        {t:"O-O — White castles quickly.",tags:["Castle"],ar:[{f:'e1',t:'g1'}]},
        {t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
        {t:"Re1 — Rook centralises on the e-file.",tags:["Rook activation"],ar:[{f:'f1',t:'e1'}]},
        {t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
        {t:"Nxc6 — White exchanges, winning material.",tags:["Win material","Tactics"],ar:[{f:'d4',t:'c6'}]},
      ]
    },
    {
      name: '6. Göring Gambit — 4.c3',
      moves: ['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','c2c3','d4c3','b1c3','f8b4','f1c4','d7d6','e1g1','g8f6','d1b3','e8g8','f3g5','b4c3','b3c3'],
      explain: [
        null,null,null,null,null,null,null,
        {t:"dxc3 — Black accepts the gambit.",tags:["Gambit accepted"],ar:[{f:'d4',t:'c3'}]},
        {t:"Nxc3 — White recovers with huge development lead!",tags:["Development advantage"],ar:[{f:'b1',t:'c3'}]},
        {t:"Bb4 — Pins the c3 knight.",tags:["Pin"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
        {t:"Bc4 — Active bishop, eyes f7.",tags:["Active bishop","f7 target"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
        {t:"d6 — Solidifies.",ar:[{f:'d7',t:'d6'}]},
        {t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
        {t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
        {t:"Qb3 — Attacks f7 AND b4 simultaneously!",tags:["Double threat","Dangerous"],ar:[{f:'d1',t:'b3'},{f:'b3',t:'f7',c:'r'},{f:'b3',t:'b4',c:'r'}]},
        {t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
        {t:"Ng5 — The f3 knight attacks f7 with the knight!",tags:["Attack f7"],ar:[{f:'f3',t:'g5'},{f:'g5',t:'f7',c:'r'}]},
        {t:"Bxc3 — Black trades the bishop.",tags:["Trade"],ar:[{f:'b4',t:'c3'}]},
        {t:"Qxc3 — White recaptures. Strong position.",tags:["Strong position"],ar:[{f:'b3',t:'c3'}]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   SICILIAN (as White)
═══════════════════════════════════════════════ */
window.OPENINGS.sicilian_white = {
  flipped: false, myColor: 'w',
  label: 'Sicilian Defence (as White)', category: 'Semi-Open', emoji: '🏰',
  lines: [
    {
      name: '1. Open Sicilian — 2.Nf3 d6 3.d4 — Najdorf',
      moves: ['e2e4','c7c5','g1f3','d7d6','d2d4','c5d4','f3d4','g8f6','b1c3','a7a6','c1g5','e7e6','f2f4','d8b6','d4b3','b6b2','d1d3','b2b3','a2b3'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        {t:"c5 — The Sicilian! Fight for d4 without symmetry.",tags:["Sicilian"],ar:[{f:'c7',t:'c5'}]},
        {t:"Nf3 — Development, prepares d4.",ar:[{f:'g1',t:'f3'}]},
        {t:"d6 — Supports e5, prepares Nf6.",ar:[{f:'d7',t:'d6'}]},
        {t:"d4 — The Open Sicilian! Strike in the centre.",tags:["Open Sicilian"],ar:[{f:'d2',t:'d4'}]},
        {t:"cxd4 — Black captures, releasing the tension.",ar:[{f:'c5',t:'d4'}]},
        {t:"Nxd4 — Knight dominates d4.",ar:[{f:'f3',t:'d4'}]},
        {t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
        {t:"Nc3 — The main line! Central development.",ar:[{f:'b1',t:'c3'}]},
        {t:"a6 — The Najdorf! Prevents Nb5.",tags:["Najdorf","Key move"],ar:[{f:'a7',t:'a6'}]},
        {t:"Bg5 — The English Attack setup begins.",tags:["English Attack"],ar:[{f:'c1',t:'g5'}]},
        {t:"e6 — Solidifies the structure.",ar:[{f:'e7',t:'e6'}]},
        {t:"f4 — Attack! White prepares f5 and kingside storm.",tags:["Kingside attack"],ar:[{f:'f2',t:'f4'}]},
        {t:"Qb6 — Attacks d4 AND b2 simultaneously!",tags:["Double attack","Danger"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'d4',c:'r'},{f:'b6',t:'b2',c:'r'}]},
        {t:"Nb3 — Knight retreats, defends b2.",tags:["Defend"],ar:[{f:'d4',t:'b3'}]},
        {t:"Qxb2 — Black wins the b2 pawn.",tags:["Win pawn"],ar:[{f:'b6',t:'b2'}]},
        {t:"Qd3 — White defends with the queen.",ar:[{f:'d1',t:'d3'}]},
        {t:"Qb3 — Trades queens, simplifies.",tags:["Simplify","Trade queens"],ar:[{f:'b2',t:'b3'}]},
        {t:"axb3 — White recaptures. Slight structural plus.",ar:[{f:'a2',t:'b3'}]},
      ]
    },
    {
      name: '2. Alapin Variation — 2.c3',
      moves: ['e2e4','c7c5','c2c3','g8f6','e4e5','f6d5','d2d4','c5d4','g1f3','e7e6','c3d4','d7d5','f1d3','b8c6','e1g1','f8e7','b1c3','d5c3','b2c3'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        {t:"c5 — The Sicilian.",ar:[{f:'c7',t:'c5'}]},
        {t:"c3 — The Alapin! Prepares d4 without allowing ...d4.",tags:["Alapin","Anti-Sicilian"],ar:[{f:'c2',t:'c3'}]},
        {t:"Nf6 — Best response, attacks e4.",tags:["Best response"],ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
        {t:"e5 — Gains space, kicks the knight.",tags:["Space"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
        {t:"Nd5 — Knight retreats to d5, good central square.",tags:["Central knight"],ar:[{f:'f6',t:'d5'}]},
        {t:"d4 — White builds the centre.",ar:[{f:'d2',t:'d4'}]},
        {t:"cxd4 — Black captures.",ar:[{f:'c5',t:'d4'}]},
        {t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
        {t:"e6 — Solidifies.",ar:[{f:'e7',t:'e6'}]},
        {t:"cxd4 — White recaptures.",ar:[{f:'c3',t:'d4'}]},
        {t:"d5 — Black's central break!",tags:["Central break"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
        {t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
        {t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
        {t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
        {t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
        {t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
        {t:"dxc3 — Black trades.",ar:[{f:'d5',t:'c3'}]},
        {t:"bxc3 — Recapture. White has the bishop pair and space.",tags:["Bishop pair","Space advantage"],ar:[{f:'b2',t:'c3'}]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   CARO-KANN (as White)
═══════════════════════════════════════════════ */
window.OPENINGS.caro_white = {
  flipped: false, myColor: 'w',
  label: 'Caro-Kann (as White)', category: 'Semi-Open', emoji: '🛡️',
  lines: [
    {
      name: '1. Classical Main Line — h4',
      moves: ['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','h2h4','h7h6','g1f3','b8d7','h4h5','g6h7','f1d3','h7d3','d1d3'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        null,
        {t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
        null,
        {t:"Nc3 — Classical main line!",tags:["Classical Caro"],ar:[{f:'b1',t:'c3'}]},
        null,
        {t:"Nxe4 — Recapture powerfully in the centre.",ar:[{f:'c3',t:'e4'}]},
        null,
        {t:"Ng3 — Attacks the Bf5, gains tempo.",tags:["Tempo gain"],ar:[{f:'e4',t:'g3'},{f:'g3',t:'f5',c:'r'}]},
        null,
        {t:"h4 — Attack the bishop! Threatening h5.",tags:["Attack bishop","Space"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
        null,
        {t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
        null,
        {t:"h5 — Drive the bishop back!",tags:["Drive bishop"],ar:[{f:'h4',t:'h5'},{f:'h5',t:'g6',c:'r'}]},
        null,
        {t:"Bd3 — Challenge the bishop, trade it off.",tags:["Trade bishops"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
        null,
        {t:"Qxd3 — Recapture. Strong centre and development lead.",tags:["Development lead"],ar:[{f:'d1',t:'d3'}]},
      ]
    },
    {
      name: '2. Advance Variation — Tal h4',
      moves: ['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','h2h4','h7h5','f1d3','f5d3','d1d3','e7e6','g1f3','c6c5','c2c4','b8c6','c4d5','d8d5','b1c3'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        null,
        {t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
        null,
        {t:"e5 — Advance Variation.",ar:[{f:'e4',t:'e5'}]},
        null,
        {t:"h4 — Tal Variation! Very aggressive, threatens h5.",tags:["Tal Variation","Aggressive"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
        null,
        {t:"Bd3 — Challenge the bishop.",ar:[{f:'f1',t:'d3'},{f:'d3',t:'f5',c:'r'}]},
        null,
        {t:"Qxd3 — Recapture, queen eyes h7.",tags:["Active queen"],ar:[{f:'d1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
        null,
        {t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
        null,
        {t:"c4 — Gain central space.",tags:["Space"],ar:[{f:'c2',t:'c4'}]},
        null,
        {t:"cxd5 — Resolve tension.",ar:[{f:'c4',t:'d5'}]},
        null,
        {t:"Nc3 — Develop, attack the queen.",tags:["Development","Attack queen"],ar:[{f:'b1',t:'c3'},{f:'c3',t:'d5',c:'r'}]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   CARO-KANN (as Black)
═══════════════════════════════════════════════ */
window.OPENINGS.caro = {
  flipped: true, myColor: 'b',
  label: 'Caro-Kann (as Black)', category: 'Semi-Open', emoji: '♟️',
  lines: [
    {
      name: '1. Classical — 4...Bf5 5.Ng3 Bg6 h4',
      moves: ['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','h2h4','h7h6','g1f3','b8d7','h4h5','g6h7','f1d3','h7d3','d1d3'],
      explain: [
        null,
        {t:"c6 — The Caro-Kann! Solid and flexible.",tags:["Caro-Kann"],ar:[{f:'c7',t:'c6'}]},
        null,
        {t:"d5 — Claims the centre.",tags:["Centre"],ar:[{f:'d7',t:'d5'}]},
        null,
        {t:"dxe4 — Trade the centre pawn!",tags:["Trade"],ar:[{f:'d5',t:'e4'}]},
        null,
        {t:"Bf5 — The key Caro move! Bishop develops BEFORE e6.",tags:["Key Caro move","Active bishop"],ar:[{f:'c8',t:'f5'}]},
        null,
        {t:"Bg6 — Retreat to g6. The bishop is still active.",tags:["Retreat","Still active"],ar:[{f:'f5',t:'g6'}]},
        null,
        {t:"h6 — Stops h5 from winning the bishop.",tags:["Prevent h5","Necessary"],ar:[{f:'h7',t:'h6'}]},
        null,
        {t:"Nd7 — Solid development, prepares Ngf6.",tags:["Solid"],ar:[{f:'b8',t:'d7'}]},
        null,
        {t:"Bh7 — Bishop retreats, slightly passive but safe.",tags:["Retreat","Safe"],ar:[{f:'g6',t:'h7'}]},
        null,
        {t:"Bxd3 — Trade the bishop for the queen!",tags:["Trade","Simplify"],ar:[{f:'h7',t:'d3'}]},
        null,
        {t:"Position after Qxd3 — Solid position, good structure.",tags:["Solid","Good structure"],ar:[]},
      ]
    },
    {
      name: '2. Advance — 3.e5 Bf5',
      moves: ['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','g1f3','e7e6','f1e2','b8d7','e1g1','c6c5','c1e3','d8b6','b1d2','b6b2','c2c4','c5d4','e3d4'],
      explain: [
        null,
        {t:"c6 — The Caro-Kann.",ar:[{f:'c7',t:'c6'}]},
        null,
        {t:"d5 — Claims the centre.",ar:[{f:'d7',t:'d5'}]},
        null,
        {t:"Bf5 — Bishop out FIRST! Key Caro-Kann principle.",tags:["Key Caro principle","Active bishop"],ar:[{f:'c8',t:'f5'}]},
        null,
        {t:"e6 — Solidifies the structure after Advance.",tags:["Solid"],ar:[{f:'e7',t:'e6'}]},
        null,
        {t:"Nd7 — Flexible development.",tags:["Flexible"],ar:[{f:'b8',t:'d7'}]},
        null,
        {t:"c5 — Counter-attack! Strike White's centre.",tags:["Counter-attack","Key move"],ar:[{f:'c6',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
        null,
        {t:"Qb6 — Active queen, attacks d4 and b2.",tags:["Active queen","Double threat"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'d4',c:'r'},{f:'b6',t:'b2',c:'r'}]},
        null,
        {t:"Qxb2 — Black wins the b2 pawn!",tags:["Win pawn","Aggressive"],ar:[{f:'b6',t:'b2'}]},
        null,
        {t:"cxd4 — Black captures.",ar:[{f:'c5',t:'d4'}]},
        null,
        {t:"Position: active play for Black.",tags:["Active play"],ar:[]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   FRENCH DEFENCE (as White)
═══════════════════════════════════════════════ */
window.OPENINGS.french_white = {
  flipped: false, myColor: 'w',
  label: 'French Defence (as White)', category: 'Semi-Open', emoji: '🇫🇷',
  lines: [
    {
      name: '1. Advance — 3.e5 c5 4.c3',
      moves: ['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','d8b6','a2a3','c5d4','c3d4','f8b4','b1c3','c8d7','f1d3','b4c3','b2c3'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        null,
        {t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
        null,
        {t:"e5 — Advance Variation! Space advantage.",tags:["Advance"],ar:[{f:'e4',t:'e5'}]},
        null,
        {t:"c3 — Supports d4 after ...c5.",tags:["Support d4"],ar:[{f:'c2',t:'c3'}]},
        null,
        {t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
        null,
        {t:"a3 — Prevents ...Bb4+!",tags:["Prophylaxis"],ar:[{f:'a2',t:'a3'}]},
        null,
        {t:"cxd4 — Recapture, maintain the structure.",ar:[{f:'c3',t:'d4'}]},
        null,
        {t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
        null,
        {t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
        null,
        {t:"bxc3 — Recapture. White has the bishop pair and strong centre.",tags:["Bishop pair","Strong centre"],ar:[{f:'b2',t:'c3'}]},
      ]
    },
    {
      name: '2. Tarrasch — 3.Nd2',
      moves: ['e2e4','e7e6','d2d4','d7d5','b1d2','c7c5','e4d5','e6d5','g1f3','b8c6','f1b5','f8d6','e1g1','g8e7','d4c5','d6c5','b1d4','c6d4','f3d4'],
      explain: [
        {t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
        null,
        {t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
        null,
        {t:"Nd2 — The Tarrasch! Avoids the pin ...Bb4.",tags:["Tarrasch"],ar:[{f:'b1',t:'d2'}]},
        null,
        {t:"exd5 — Resolves the tension.",ar:[{f:'e4',t:'d5'}]},
        null,
        {t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
        null,
        {t:"Bb5 — Pin the Nc6!",tags:["Pin"],ar:[{f:'f1',t:'b5'},{f:'b5',t:'c6',c:'r'}]},
        null,
        {t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
        null,
        {t:"dxc5 — Pawn off, isolate Black's d-pawn.",tags:["Isolated d-pawn","Strategy"],ar:[{f:'d4',t:'c5'}]},
        null,
        {t:"Nd4 — Knight dominates d4.",tags:["Dominant knight"],ar:[{f:'b1',t:'d4'}]},
        null,
        {t:"Nxd4 — Recapture. White has the better structure.",tags:["Better structure"],ar:[{f:'f3',t:'d4'}]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   FRENCH DEFENCE (as Black)
═══════════════════════════════════════════════ */
window.OPENINGS.french = {
  flipped: true, myColor: 'b',
  label: 'French Defence (as Black)', category: 'Semi-Open', emoji: '♞',
  lines: [
    {
      name: '1. Advance — 3.e5 Counter-attack',
      moves: ['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','d8b6','a2a3','c5d4','c3d4','f8b4','b1c3','c8d7','f1d3','b4c3','b2c3'],
      explain: [
        null,
        {t:"e6 — The French! Solid structure, fight for d5.",tags:["French"],ar:[{f:'e7',t:'e6'}]},
        null,
        {t:"d5 — Claims the centre.",tags:["Centre"],ar:[{f:'d7',t:'d5'}]},
        null,
        {t:"c5 — Counter-attack immediately! Hit d4.",tags:["Counter-attack","Key move"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
        null,
        {t:"Nc6 — Development, supports c5.",ar:[{f:'b8',t:'c6'}]},
        null,
        {t:"Qb6 — Attacks d4 AND b2!",tags:["Double threat"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'d4',c:'r'},{f:'b6',t:'b2',c:'r'}]},
        null,
        {t:"cxd4 — Capture the pawn.",ar:[{f:'c5',t:'d4'}]},
        null,
        {t:"Bb4 — Pin the Nc3!",tags:["Pin","Pressure"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
        null,
        {t:"Bd7 — Develop, prepare to castle.",ar:[{f:'c8',t:'d7'}]},
        null,
        {t:"Bxc3 — Trade the bishop, weaken White's pawns.",tags:["Trade","Weaken pawns"],ar:[{f:'b4',t:'c3'}]},
        null,
        {t:"bxc3 recapture — White has doubled isolated c-pawns. Black has good counterplay.",tags:["Doubled pawns","Good counterplay"],ar:[]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   NIMZO-INDIAN
═══════════════════════════════════════════════ */
window.OPENINGS.nimzo = {
  flipped: true, myColor: 'b',
  label: 'Nimzo-Indian Defence', category: 'Indian Defences', emoji: '♛',
  lines: [
    {
      name: '1. Classical — 4...c5 5.a3 Bxc3+',
      moves: ['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','d1c2','d7d5','a2a3','b4c3','c2c3','c7c5','c4d5','e6d5','g1f3','b8c6','c1g5','c5d4','f3d4'],
      explain: [
        null,
        {t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
        null,
        {t:"e6 — Supports d5.",ar:[{f:'e7',t:'e6'}]},
        null,
        {t:"Bb4 — The Nimzo! Pin the c3 knight.",tags:["Nimzo","Pin","Key move"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
        null,
        {t:"d5 — Claims the centre.",tags:["Centre"],ar:[{f:'d7',t:'d5'}]},
        null,
        {t:"Bxc3+ — Give up the bishop for doubled c-pawns!",tags:["Double pawns","Structural damage"],ar:[{f:'b4',t:'c3'}]},
        null,
        {t:"c5 — Counter-attack d4!",tags:["Counter-attack"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
        null,
        {t:"dxe5 — Capture.",ar:[{f:'c4',t:'d5'}]},
        null,
        {t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
        null,
        {t:"cxd4 — Capture.",ar:[{f:'c5',t:'d4'}]},
        null,
        {t:"Nxd4 — Knight dominates the centre. Black has the bishop pair.",tags:["Bishop pair","Central knight"],ar:[{f:'f3',t:'d4'}]},
      ]
    },
  ]
};

/* ═══════════════════════════════════════════════
   FAMOUS GAMES DATA
═══════════════════════════════════════════════ */
window.FAMOUS_GAMES = [
  {
    title: 'The Opera Game',
    subtitle: 'Paul Morphy (White) vs Duke of Brunswick & Count Isouard (Black) — Paris, 1858',
    white: 'Paul Morphy', black: 'Duke of Brunswick & Count Isouard',
    result: '1-0 (Morphy wins)',
    moves: ['e2e4','e7e5','g1f3','d7d6','d2d4','c8g4','d4e5','g4f3','d1f3','d6e5','f1c4','g8f6','f3b3','d8e7','b1c3','c7c6','c1g5','b7b5','c3b5','c6b5','c4b5','b8d7','e1c1','a8d8','d1d7','d8d7','h1d1','e7e6','b5d7','f6d7','b3b8','d7b8','d1d8'],
    notes: [
      "1.e4 — Morphy opens with the king's pawn, his favourite weapon.",
      "1...e5 — The symmetrical reply.",
      "2.Nf3 — Development, attacks e5.",
      "2...d6 — The Philidor Defence, passive but solid.",
      "3.d4 — Strikes immediately in the centre!",
      "3...Bg4? — Black pins the knight, but this is premature.",
      "4.dxe5 — Morphy snaps the pawn! dxe5 wins material.",
      "4...Bxf3 — Black takes the knight.",
      "5.Qxf3 — White recaptures, gaining the bishop pair and open position.",
      "5...dxe5 — Black takes back.",
      "6.Bc4 — Development! Eyes the vulnerable f7 pawn.",
      "6...Nf6 — Black develops.",
      "7.Qb3 — DOUBLE THREAT! Attacks f7 and b7 simultaneously.",
      "7...Qe7 — Defending f7.",
      "8.Nc3 — Development with tempo. Every move develops a piece!",
      "8...c6 — Defends b5.",
      "9.Bg5 — Another piece developed with tempo, pins the knight.",
      "9...b5? — Black attacks the bishop, but opens up the position.",
      "10.Nxb5!! — THE SACRIFICE! Morphy gives up the knight for a crushing attack.",
      "10...cxb5 — Black accepts.",
      "11.Bxb5+ — Check! The bishop swoops in.",
      "11...Nbd7 — Black blocks the check.",
      "12.O-O-O — CASTLES QUEENSIDE! The rooks connect for the attack.",
      "12...Rd8 — Black defends d7.",
      "13.Rxd7!! — EXCHANGE SACRIFICE! Brilliant. The rook tears through.",
      "13...Rxd7 — Black must take.",
      "14.Rd1 — The second rook joins the attack with decisive effect.",
      "14...Qe6 — Black tries to defend.",
      "15.Bxd7+ — Bishop takes with check!",
      "15...Nxd7 — Black captures.",
      "16.Qb8+!! — THE QUEEN SACRIFICE! Morphy gives his queen away.",
      "16...Nxb8 — Black must accept.",
      "17.Rd8# — CHECKMATE! The rook delivers the final blow. A masterpiece of development and sacrifice.",
    ]
  },
  {
    title: 'Immortal Game',
    subtitle: 'Adolf Anderssen (White) vs Lionel Kieseritzky (Black) — London, 1851',
    white: 'Adolf Anderssen', black: 'Lionel Kieseritzky',
    result: '1-0 (Anderssen wins)',
    moves: ['e2e4','e7e5','f2f4','e5f4','f1c4','d8h4','e1f1','b7b5','c4b5','g8f6','g1f3','h4h6','d2d3','f6h5','f3h4','h6g5','h4f5','c7c6','g2g4','h5f6','h1g1','c6b5','h2h4','g5g6','h4h5','g6g5','d1f3','f6g8','c1f4','g5f6','b1c3','f8c5','c3d5','f6b2','f4d6','c5g1','e4e5','b2a1','f1e2','b8a6','f5g7','e8d8','f3f6','g8f6','d6e7'],
    notes: [
      "1.e4 — Anderssen's aggressive approach.",
      "1...e5 — Symmetrical reply.",
      "2.f4 — The King's Gambit! A wild sacrifice of the f-pawn.",
      "2...exf4 — Black accepts the gambit.",
      "3.Bc4 — The King's Bishop Gambit, eyeing f7.",
      "3...Qh4+ — Kieseritzky checks immediately!",
      "4.Kf1 — The king moves, giving up castling rights.",
      "4...b5? — An ambitious pawn sacrifice.",
      "5.Bxb5 — Anderssen accepts the pawn.",
      "5...Nf6 — Development, attacks the bishop.",
      "6.Nf3 — The queen is attacked!",
      "6...Qh6 — The queen retreats.",
      "7.d3 — Solid development.",
      "7...Nh5 — The knight attacks f4.",
      "8.Nh4 — The knight drives the queen.",
      "8...Qg5 — Queen retreats again.",
      "9.Nf5 — The knight springs to f5!",
      "9...c6 — Black challenges the bishop.",
      "10.g4 — ATTACKING the knight on h5!",
      "10...Nf6 — Knight retreats.",
      "11.Rg1 — The rook prepares g5!",
      "11...cxb5 — Black wins the bishop.",
      "12.h4 — White attacks the queen!",
      "12...Qg6 — Queen moves.",
      "13.h5 — The queen is chased again.",
      "13...Qg5 — Queen stubbornly holds.",
      "14.Qf3 — The queen joins the attack.",
      "14...Ng8 — Black retreats.",
      "15.Bxf4 — White wins back material.",
      "15...Qf6 — Black defends.",
      "16.Nc3 — Development.",
      "16...Bc5 — Black develops.",
      "17.Nd5 — Knight leaps to d5!",
      "17...Qxb2 — Black wins the b-pawn.",
      "18.Bd6!! — THE KEY SACRIFICE! White gives up the bishop.",
      "18...Bxg1 — Black takes the rook!",
      "19.e5 — White advances the pawn.",
      "19...Qxa1+ — Black takes the rook with check.",
      "20.Ke2 — King moves.",
      "20...Na6 — Black develops.",
      "21.Nxg7+ — Knight check!",
      "21...Kd8 — King moves.",
      "22.Qf6+! — Queen sacrifice!",
      "22...Nxf6 — Black must take.",
      "23.Be7# — CHECKMATE! A legendary finish. White mated while down two rooks and a bishop.",
    ]
  },
];
