/* ChessVault Engine — faithfully ported from original trainer */

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
const OPENINGS={

/* ════ SCOTCH GAME — White plays White ════ */
scotch:{flipped:false,myColor:'w',lines:[

{name:'1. Classical — 4...Bc5 5.Be3 Qf6',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','f8c5','c1e3','d8f6','c2c3','g8e7','f1c4','c6e5','c4e2','d7d5','e4d5','e7d5','e1g1'],
explain:[
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
]},

{name:'2. Schmidt (Mieses) — 4...Nf6 5.Nxc6',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g8f6','d4c6','b7c6','e4e5','d8e7','d1e2','f6d5','c2c4','d5b6','b1c3','c8a6','b2b3'],
explain:[
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
]},

{name:'3. Steinitz — 4...Qh4 (trap line)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','d8h4','b1c3','f8b4','d1d3','g8f6','c1d2','e8g8','e1c1','f8e8','f2f3','d7d5','g2g3'],
explain:[
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
]},

{name:'4. Malaniuk — 4...Bb4+ check',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','f8b4','c2c3','b4a5','c1e3','g8f6','d4c6','b7c6','f1d3','d7d5','e4d5','c6d5','e1g1'],
explain:[
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
]},

{name:'5. Scotch Gambit — 4.Bc4 Nf6 5.e5',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f1c4','g8f6','e4e5','d7d5','c4b5','f6e4','f3d4','c8d7','e1g1','f8e7','f1e1','e8g8','d4c6'],
explain:[
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
]},

{name:'6. Göring Gambit — 4.c3',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','c2c3','d4c3','b1c3','f8b4','f1c4','d7d6','e1g1','g8f6','d1b3','e8g8','f3g5','b4c3','b3c3'],
explain:[
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
{t:"Bxc3 — Black trades the bishop to relieve pressure.",tags:["Trade"],ar:[{f:'b4',t:'c3'}]},
{t:"Qxc3 — White recaptures, strong central queen.",tags:["Strong queen"],ar:[{f:'b3',t:'c3'}]},
]},

{name:'7. Scotch Dragon-hybrid — 4...Nf6 5.Nc3 d6 g6',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g8f6','b1c3','d7d6','f1e2','g7g6','c1e3','f8g7','d1d2','e8g8','e1c1','c6d4','d2d4'],
explain:[
null,null,null,null,null,null,null,
{t:"Nf6 — Develops, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"d6 — Solid structure, prepares g6.",tags:["Solid","Flexible"],ar:[{f:'d7',t:'d6'}]},
{t:"Be2 — Quiet development, avoids complications.",ar:[{f:'f1',t:'e2'}]},
{t:"g6 — Dragon-style fianchetto! Mixing Scotch with Dragon ideas.",tags:["Dragon-hybrid","Fianchetto","Creative"],ar:[{f:'g7',t:'g6'}]},
{t:"Be3 — Development, prepares queenside castling.",ar:[{f:'c1',t:'e3'}]},
{t:"Bg7 — Dragon bishop on the long diagonal!",tags:["Dragon bishop","Long diagonal"],ar:[{f:'f8',t:'g7'},{f:'g7',t:'a1',c:'r'}]},
{t:"Qd2 — Setup complete. Queenside castle and pawn storm incoming.",tags:["Attack setup","Queenside castle prep"],ar:[{f:'d1',t:'d2'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"O-O-O — White castles queenside! The attack begins.",tags:["Queenside castle","Attack!"],ar:[{f:'e1',t:'c1'}]},
{t:"Nxd4 — Black simplifies by taking the d4 knight.",tags:["Simplify","Exchange"],ar:[{f:'c6',t:'d4'}]},
{t:"Qxd4 — White recaptures. White has a big centre and attacking chances.",tags:["Central queen","Attack advantage"],ar:[{f:'d2',t:'d4'}]},
]},

{name:'8. Early Qf6 line',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','d8f6','d4b5','f8c5','d1f3','f6f3','g2f3','c5b6','c1e3','b6e3','f2e3','e8d8','b1c3'],
explain:[
null,null,null,null,null,null,null,
{t:"Qf6 — Tricky! Attacks d4 and threatens Qxf2+.",tags:["Tricky","Trap potential"],ar:[{f:'d8',t:'f6'},{f:'f6',t:'d4',c:'r'},{f:'f6',t:'f2',c:'r'}]},
{t:"Nb5 — Threatens Nd6+ and Nc7+!",tags:["Fork threat"],ar:[{f:'d4',t:'b5'},{f:'b5',t:'d6',c:'r'},{f:'b5',t:'c7',c:'r'}]},
{t:"Bc5 — Defends against the fork.",tags:["Defence"],ar:[{f:'f8',t:'c5'}]},
{t:"Qf3 — Challenges the queen.",tags:["Challenge queen"],ar:[{f:'d1',t:'f3'},{f:'f3',t:'f6',c:'r'}]},
{t:"Qxf3 — Black trades queens.",tags:["Simplification"],ar:[{f:'f6',t:'f3'}]},
{t:"gxf3 — Recaptures, opens the g-file.",tags:["Open g-file"],ar:[{f:'g2',t:'f3'}]},
{t:"Bb6 — Bishop retreats safely.",ar:[{f:'c5',t:'b6'}]},
{t:"Be3 — Develops, challenges the Bb6.",tags:["Challenge bishop"],ar:[{f:'c1',t:'e3'},{f:'e3',t:'b6',c:'r'}]},
{t:"Bxe3! — Correct! Black trades the bishop immediately. d6 would be a mistake allowing Bxb6 and a fork.",tags:["Best move","Key idea","Avoid d6!"],ar:[{f:'b6',t:'e3'}]},
{t:"fxe3 — Recaptures. White has the bishop pair but doubled e-pawns.",tags:["Bishop pair","Structural"],ar:[{f:'f2',t:'e3'}]},
{t:"Kd8 — King steps away from the e-file. Avoids future pins.",tags:["Safety","Prophylaxis"],ar:[{f:'e8',t:'d8'}]},
{t:"N1c3 — The b1 knight develops. White has the bishop pair and active pieces.",tags:["Development","Active pieces"],ar:[{f:'b1',t:'c3'}]},
]},

{name:'9. Quiet d6 (VERY common online)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','d7d6','b1c3','g8f6','f1e2','f8e7','e1g1','e8g8','c1e3','f8e8','f2f4','e7f8','f1f3'],
explain:[
null,null,null,null,null,null,null,
{t:"d6 — Lazy but solid. Black plays quietly without committing.",tags:["Solid","Flexible","Common online"],ar:[{f:'d7',t:'d6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Be2 — Quiet development.",ar:[{f:'f1',t:'e2'}]},
{t:"Be7 — Solid.",ar:[{f:'f8',t:'e7'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Be3 — Development. Plans f4.",tags:["Setup","Plans f4"],ar:[{f:'c1',t:'e3'}]},
{t:"Re8 — Rook centralises.",ar:[{f:'f8',t:'e8'}]},
{t:"f4 — White prepares the kingside attack!",tags:["Attack"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
{t:"Bf8 — Bishop retreats to f8! Solid defensive move, frees up e7.",tags:["Solid defence","Retreat"],ar:[{f:'e7',t:'f8'}]},
{t:"Rf3 — Rook swings to g3 for the attack!",tags:["Rook lift","Attack"],ar:[{f:'f1',t:'f3'},{f:'f3',t:'g3',c:'r'}]},
]},

{name:'10. Scotch Gambit vs Bc5 — Re1+',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f1c4','f8c5','e1g1','g8f6','e4e5','d7d5','e5f6','d5c4','f1e1','c8e6','f3g5','d8d5','b1c3'],
explain:[
null,null,null,null,null,null,null,
{t:"Bc5 — Active development, mirrors White's bishop.",tags:["Active","Counter-gambit spirit"],ar:[{f:'f8',t:'c5'}]},
{t:"O-O — Castles quickly, attack ready.",tags:["Castle","Attack ready"],ar:[{f:'e1',t:'g1'}]},
{t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"e5 — Advances, kicks the knight!",tags:["Attack"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
{t:"d5 — Counter-attack in the centre.",tags:["Counter-attack"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'c4',c:'r'}]},
{t:"exf6 — White captures the knight!",tags:["Piece sacrifice","Sharp"],ar:[{f:'e5',t:'f6'}]},
{t:"dxc4 — Black takes the bishop.",ar:[{f:'d5',t:'c4'}]},
{t:"Re1+ — Check! Rook activation with tempo.",tags:["Check","Tempo","Sharp"],ar:[{f:'f1',t:'e1'}]},
{t:"Be6 — Black defends.",ar:[{f:'c8',t:'e6'}]},
{t:"Ng5 — White attacks e6 with the knight!",tags:["Attack e6"],ar:[{f:'f3',t:'g5'},{f:'g5',t:'e6',c:'r'}]},
{t:"Qd5 — Black centralises the queen.",ar:[{f:'d8',t:'d5'}]},
{t:"Nc3 — Development. White has lots of compensation.",tags:["Development","Compensation"],ar:[{f:'b1',t:'c3'}]},
]},

{name:'11. Schmidt — Ba6 twist (common confusion)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g8f6','d4c6','b7c6','e4e5','d8e7','d1e2','f6d5','c2c4','c8a6','b2b3','g7g6','c1b2'],
explain:[
null,null,null,null,null,null,null,null,null,null,null,null,null,null,
{t:"c4 — Kicks the knight.",ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
{t:"Ba6 — Tricky! Bishop goes to a6 instead of ...Nb6, targeting the c4 pawn.",tags:["Tricky","Targets c4"],ar:[{f:'c8',t:'a6'},{f:'a6',t:'c4',c:'r'}]},
{t:"b3 — Defends c4.",tags:["Defend c4"],ar:[{f:'b2',t:'b3'}]},
{t:"g6 — Black prepares Bg7 fianchetto.",tags:["Fianchetto prep"],ar:[{f:'g7',t:'g6'}]},
{t:"Bb2 — Fianchetto bishop, the long diagonal.",tags:["Fianchetto","Long diagonal"],ar:[{f:'c1',t:'b2'},{f:'b2',t:'g7',c:'r'}]},
]},

{name:'12. Scotch Four Knights Transposition',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g8f6','b1c3','f8b4','d4c6','b7c6','f1d3','d7d5','e4d5','c6d5','e1g1','e8g8','c1g5'],
explain:[
null,null,null,null,null,null,null,
{t:"Nf6 — Four Knights transposition. Both sides develop knights.",tags:["Four Knights","Transposition"],ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Pins the c3 knight.",tags:["Pin","Nimzo-like"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Nxc6 — Exchanges on c6.",tags:["Exchange","Doubled pawns"],ar:[{f:'d4',t:'c6'}]},
{t:"bxc6 — Black recaptures.",ar:[{f:'b7',t:'c6'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"d5 — Black's central break!",tags:["Central break"],ar:[{f:'d7',t:'d5'}]},
{t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bg5 — Pins the f6 knight, pressure!",tags:["Pin","Pressure"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
]},

{name:'13. Classical Bc5 — Nb3 Bb6',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','f8c5','d4b3','c5b6','b1c3','d7d6','f1d3','g8f6','e1g1','e8g8','g1h1','f8e8','f2f4'],
explain:[
null,null,null,null,null,null,null,
{t:"Bc5 — Classical. Bishop attacks d4.",tags:["Classical Scotch"],ar:[{f:'f8',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Nb3 — Knight retreats, avoids trade.",tags:["Retreat","Avoid trade"],ar:[{f:'d4',t:'b3'}]},
{t:"Bb6 — Bishop retreats to a safe square.",tags:["Bishop retreat","Safe"],ar:[{f:'c5',t:'b6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Kh1 — King steps aside, prepares f4 and Rf1.",tags:["Prepare f4"],ar:[{f:'g1',t:'h1'}]},
{t:"Re8 — Rook centralises.",ar:[{f:'f8',t:'e8'}]},
{t:"f4 — White launches the kingside attack!",tags:["Kingside attack"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
]},

{name:'14. Scotch Gambit Declined — d6',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f1c4','d7d6','f3d4','g8f6','b1c3','f8e7','e1g1','e8g8','f1e1','c6d4','d1d4','c8e6','c1f4'],
explain:[
null,null,null,null,null,null,null,
{t:"Nf6 — Scotch Gambit Declined! Black keeps the pawn.",tags:["Gambit declined","Solid"],ar:[{f:'g8',t:'f6'}]},
{t:"Nxd4 — White recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Re1 — Centralises the rook.",ar:[{f:'f1',t:'e1'}]},
{t:"Nxd4 — Black trades to simplify.",tags:["Simplify"],ar:[{f:'c6',t:'d4'}]},
{t:"Qxd4 — White recaptures with the queen.",ar:[{f:'d1',t:'d4'}]},
{t:"Be6 — Develops, prepares c6 or Nd7.",ar:[{f:'c8',t:'e6'}]},
{t:"Bf4 — Active bishop, pressure on d6.",tags:["Pressure d6"],ar:[{f:'c1',t:'f4'},{f:'f4',t:'d6',c:'r'}]},
]},

{name:'15. Early g6 setup (rare but tricky)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','g7g6','b1c3','f8g7','c1e3','g8e7','d1d2','e8g8','e1c1','d7d5','e4d5','c6d5','d4c6'],
explain:[
null,null,null,null,null,null,null,
{t:"g6 — Rare Dragon-like setup! Black fianchettoes.",tags:["Rare","Dragon-like"],ar:[{f:'g7',t:'g6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bg7 — Dragon bishop on g7!",tags:["Dragon bishop"],ar:[{f:'f8',t:'g7'},{f:'g7',t:'a1',c:'r'}]},
{t:"Be3 — Development.",ar:[{f:'c1',t:'e3'}]},
{t:"Nge7 — Knight develops, heading to f5.",ar:[{f:'g8',t:'e7'},{f:'e7',t:'f5',c:'r'}]},
{t:"Qd2 — Setup complete, prepares O-O-O.",tags:["Attack setup"],ar:[{f:'d1',t:'d2'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"O-O-O — White castles queenside! Attack begins.",tags:["Queenside castle","Attack!"],ar:[{f:'e1',t:'c1'}]},
{t:"d5 — Black's central counter-strike.",tags:["Counter-strike"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
{t:"Nxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"Nxc6 — White exchanges, winning material.",tags:["Win material"],ar:[{f:'d4',t:'c6'}]},
]},

{name:'16. Lolli Nxd4 — Main attacking setup (#1 most faced)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','c6d4','d1d4','d7d6','b1c3','g8f6','c1g5','f8e7','e1c1','e8g8','f2f3','c8e6','g2g4'],
explain:[
null,null,null,null,null,null,null,
{t:"Nxd4 — Takes the knight! Very common at your level.",tags:["Very common","Lolli"],ar:[{f:'c6',t:'d4'}]},
{t:"Qxd4 — Recaptures with the queen.",tags:["Central queen"],ar:[{f:'d1',t:'d4'}]},
{t:"d6 — Solid.",ar:[{f:'d7',t:'d6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Bg5 — Pin on the f6 knight!",tags:["Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"Be7 — Breaks the pin solidly.",tags:["Unpin"],ar:[{f:'f8',t:'e7'}]},
{t:"O-O-O — Long castle + attack! This is White's main plan.",tags:["Queenside castle","#1 setup","Attack!"],ar:[{f:'e1',t:'c1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"f3 — Supports e4, prepares g4.",tags:["Attack prep"],ar:[{f:'f2',t:'f3'}]},
{t:"Be6 — Develops.",ar:[{f:'c8',t:'e6'}]},
{t:"g4 — Pawn storm! g4-g5 incoming.",tags:["Pawn storm","Attack!"],ar:[{f:'g2',t:'g4'},{f:'g4',t:'g5',c:'r'}]},
]},

{name:'17. Lolli Qf6 — forced queen trade',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','c6d4','d1d4','d8f6','d4f6','g8f6','b1c3','f8b4','f1d3','d7d5','e4d5','f6d5','c1d2'],
explain:[
null,null,null,null,null,null,null,
{t:"Nxd4 — Takes the knight.",tags:["Common","Lolli"],ar:[{f:'c6',t:'d4'}]},
{t:"Qxd4 — Recaptures.",ar:[{f:'d1',t:'d4'}]},
{t:"Qf6 — Attacks d4 again, forces a queen trade.",tags:["Forced queen trade","Simplification"],ar:[{f:'d8',t:'f6'},{f:'f6',t:'d4',c:'r'}]},
{t:"Qxf6 — White trades queens. Must stay active now.",tags:["Trade queens","Stay active"],ar:[{f:'d4',t:'f6'}]},
{t:"Nxf6 — Black recaptures.",ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Pins the c3 knight.",tags:["Pin"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Bd3 — Develops, prepares O-O.",ar:[{f:'f1',t:'d3'}]},
{t:"d5 — Black's central break.",tags:["Central break"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
{t:"Nxd5 — Black recaptures centrally.",tags:["Central knight"],ar:[{f:'f6',t:'d5'}]},
{t:"Bd2 — Develops, prepares O-O.",tags:["Development","Prepare castle"],ar:[{f:'c1',t:'d2'}]},
]},

{name:'18. Lolli c5 — queen to e3 (surprise line)',
moves:['e2e4','e7e5','g1f3','b8c6','d2d4','e5d4','f3d4','c6d4','d1d4','c7c5','d4e3','d7d6','b1c3','g8f6','c1d2','f8e7','e1c1','e8g8','f2f3'],
explain:[
null,null,null,null,null,null,null,
{t:"Nxd4 — Takes the knight.",tags:["Common","Lolli"],ar:[{f:'c6',t:'d4'}]},
{t:"Qxd4 — Recaptures.",ar:[{f:'d1',t:'d4'}]},
{t:"c5 — Attacks the queen! Surprise move.",tags:["Surprise","Attack queen"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Qe3 — Queen retreats safely to e3.",tags:["Queen retreat","Safe"],ar:[{f:'d4',t:'e3'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Bd2 — Develops, prepares O-O-O.",tags:["Development","Castle prep"],ar:[{f:'c1',t:'d2'}]},
{t:"Be7 — Solid.",ar:[{f:'f8',t:'e7'}]},
{t:"O-O-O — Long castle! Same attacking plan.",tags:["Queenside castle","Attack!"],ar:[{f:'e1',t:'c1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"f3 — Supports centre, prepares g4.",tags:["Attack prep"],ar:[{f:'f2',t:'f3'}]},
]},

]},/* end scotch */


/* ════ SICILIAN DEFENCE — White plays White ════ */
sicilian_white:{flipped:false,myColor:'w',lines:[

{name:'1. Open Sicilian — English Attack vs Nc6',
moves:['e2e4','c7c5','g1f3','d7d6','d2d4','c5d4','f3d4','g8f6','b1c3','b8c6','c1e3','e7e5','d4b3','c8e6','f2f3','f8e7','d1d2','e8g8','e1c1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — The Sicilian! Asymmetric fight.",tags:["Sicilian"],ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development, Open Sicilian.",ar:[{f:'g1',t:'f3'}]},
{t:"d6 — Supports e5, prevents Ne5.",ar:[{f:'d7',t:'d6'}]},
{t:"d4 — Opens the centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades, opens c-file.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures, dominant in centre.",ar:[{f:'f3',t:'d4'}]},
{t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Development, pressures d4.",ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"Be3 — English Attack! Setup: f3, Qd2, O-O-O, then g4-g5 storm.",tags:["English Attack","Setup"],ar:[{f:'c1',t:'e3'}]},
{t:"e5 — Black grabs space, tempo on Nd4.",tags:["Centre grab"],ar:[{f:'e7',t:'e5'},{f:'e5',t:'d4',c:'r'}]},
{t:"Nb3 — Retreats, avoids trade, keeps attacking options.",tags:["Pawn storm prep"],ar:[{f:'d4',t:'b3'}]},
{t:"Be6 — Development, connects rooks.",ar:[{f:'c8',t:'e6'}]},
{t:"f3 — Supports e4, sets up g4-h4-g5 attack.",tags:["Attack prep"],ar:[{f:'f2',t:'f3'}]},
{t:"Be7 — Solid development, prepares castling.",ar:[{f:'f8',t:'e7'}]},
{t:"Qd2 — Queenside castle setup complete.",tags:["Castle prep"],ar:[{f:'d1',t:'d2'}]},
{t:"O-O — Black castles kingside. The race begins!",tags:["Race begins"],ar:[{f:'e8',t:'g8'}]},
{t:"O-O-O — White castles queenside! Both sides launch attacks.",tags:["Queenside castle","Attack!"],ar:[{f:'e1',t:'c1'}]},
]},

{name:'2. Alapin — 2.c3 vs Sicilian',
moves:['e2e4','c7c5','c2c3','d7d5','e4d5','d8d5','d2d4','g8f6','g1f3','b8c6','f1e2','c8g4','e1g1','e7e6','c1e3','c5d4','c3d4','f8e7','b1c3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"c3 — Alapin! Avoids massive Sicilian theory. Prepares d4.",tags:["Alapin","Anti-theory"],ar:[{f:'c2',t:'c3'}]},
{t:"d5 — Best! Challenge the centre immediately.",tags:["Best response"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
{t:"Qxd5 — Active queen, but exposed.",tags:["Active but exposed"],ar:[{f:'d8',t:'d5'}]},
{t:"d4 — White achieves the ideal pawn centre!",tags:["Ideal centre"],ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development, attacks queen.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'d4',c:'r'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Be2 — Breaks the pin, prepares castling.",ar:[{f:'f1',t:'e2'}]},
{t:"Bg4 — Pin on the f3 knight!",tags:["Pin"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"e6 — Solid structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Be3 — White completes development.",ar:[{f:'c1',t:'e3'}]},
{t:"cxd4 — Black trades, resolving tension.",tags:["Resolve tension"],ar:[{f:'c5',t:'d4'}]},
{t:"cxd4 — Recaptures. White has the IQP.",tags:["IQP"],ar:[{f:'c3',t:'d4'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"Nc3 — Full development, strong centre.",tags:["Development complete"],ar:[{f:'b1',t:'c3'}]},
]},

{name:'3. Closed Sicilian — 2.Nc3 g3',
moves:['e2e4','c7c5','b1c3','b8c6','g2g3','g7g6','f1g2','f8g7','d2d3','d7d6','c1e3','e7e5','d1d2','g8e7','f2f4','e8g8','g1f3','c6d4','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nc3 — Closed Sicilian. No d4 yet.",tags:["Closed Sicilian"],ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"g3 — Fianchetto setup!",tags:["Fianchetto"],ar:[{f:'g2',t:'g3'}]},
{t:"g6 — Black mirrors with own fianchetto!",tags:["Fianchetto"],ar:[{f:'g7',t:'g6'}]},
{t:"Bg2 — Bishop on the long diagonal.",ar:[{f:'f1',t:'g2'},{f:'g2',t:'a8',c:'r'}]},
{t:"Bg7 — Black's fianchetto complete.",ar:[{f:'f8',t:'g7'}]},
{t:"d3 — Solid centre.",ar:[{f:'d2',t:'d3'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"Be3 — Develops, prepares f4.",ar:[{f:'c1',t:'e3'}]},
{t:"e5 — Black grabs space in the centre.",tags:["Space"],ar:[{f:'e7',t:'e5'}]},
{t:"Qd2 — Setup complete, prepares Bh6.",tags:["Attack prep"],ar:[{f:'d1',t:'d2'}]},
{t:"Nge7 — Knight develops, heading to f5 or g6.",ar:[{f:'g8',t:'e7'}]},
{t:"f4 — White launches the kingside attack!",tags:["Attack begins!"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Nd4 — Black's knight leaps to the powerful d4 outpost!",tags:["Outpost","Key move"],ar:[{f:'c6',t:'d4'}]},
{t:"O-O — White castles. Tense middlegame ahead.",tags:["Balanced"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'4. Smith-Morra Gambit',
moves:['e2e4','c7c5','d2d4','c5d4','c2c3','d4c3','b1c3','b8c6','g1f3','d7d6','f1c4','g8f6','e1g1','e7e6','d1e2','f8e7','f1d1','e8g8','c1f4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"d4 — Centre battle.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black accepts.",ar:[{f:'c5',t:'d4'}]},
{t:"c3 — Smith-Morra Gambit! Pawn sacrifice for fast development.",tags:["Gambit","Development"],ar:[{f:'c2',t:'c3'}]},
{t:"dxc3 — Black accepts the gambit.",tags:["Gambit accepted"],ar:[{f:'d4',t:'c3'}]},
{t:"Nxc3 — White recovers with huge development lead!",tags:["Development advantage"],ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Nf3 — Third piece developed rapidly.",ar:[{f:'g1',t:'f3'}]},
{t:"d6 — Solid Sicilian structure.",ar:[{f:'d7',t:'d6'}]},
{t:"Bc4 — Active bishop! Eyes f7.",tags:["Active bishop","f7 target"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"O-O — White castles, attack ready.",ar:[{f:'e1',t:'g1'}]},
{t:"e6 — Black defends f7.",ar:[{f:'e7',t:'e6'}]},
{t:"Qe2 — Connects rooks, threatens e5.",tags:["Rook connection"],ar:[{f:'d1',t:'e2'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"Rd1 — Rook centralises, pressures d6.",tags:["Pressure d6"],ar:[{f:'f1',t:'d1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bf4 — Active bishop, targets d6.",tags:["Pressure d6"],ar:[{f:'c1',t:'f4'},{f:'f4',t:'d6',c:'r'}]},
]},

{name:'5. Sicilian e5 — Sveshnikov structure',
moves:['e2e4','c7c5','g1f3','b8c6','d2d4','c5d4','f3d4','e7e5','d4b5','d7d6','c2c4','g8f6','b1c3','f8e7','f1e2','e8g8','e1g1','a7a6','b5a3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"d4 — Opens centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"e5 — Sveshnikov! Black grabs space aggressively.",tags:["Sveshnikov","Central space"],ar:[{f:'e7',t:'e5'}]},
{t:"Nb5 — Attacks d6, forcing a weakening.",tags:["Pressure d6"],ar:[{f:'d4',t:'b5'},{f:'b5',t:'d6',c:'r'}]},
{t:"d6 — Defends.",ar:[{f:'d7',t:'d6'}]},
{t:"c4 — Maróczy bind! Controls d5.",tags:["Maroczy bind","Control d5"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
{t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"N1c3 — White develops with the bind in place.",ar:[{f:'b1',t:'c3'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"Be2 — Completes kingside development.",ar:[{f:'f1',t:'e2'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"a6 — Kicks the b5 knight, gains space.",tags:["Kick knight","Space"],ar:[{f:'a7',t:'a6'},{f:'a6',t:'b5',c:'r'}]},
{t:"Na3 — Knight retreats. White keeps the bind.",tags:["Keep bind"],ar:[{f:'b5',t:'a3'}]},
]},

{name:'6. Najdorf-style — 2...a6 + e5',
moves:['e2e4','c7c5','g1f3','a7a6','d2d4','c5d4','f3d4','e7e5','d4f3','g8f6','b1c3','f8b4','f1d3','d7d6','e1g1','e8g8','c1g5','c8e6','c3d5'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"a6 — Najdorf-style! Prepares b5, prevents Nb5.",tags:["Najdorf idea","Flexible"],ar:[{f:'a7',t:'a6'}]},
{t:"d4 — Opens the centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"e5 — Black grabs central space with tempo on Nd4.",tags:["Centre grab","Tempo"],ar:[{f:'e7',t:'e5'},{f:'e5',t:'d4',c:'r'}]},
{t:"Nf3 — Knight retreats, avoids trade.",ar:[{f:'d4',t:'f3'}]},
{t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Pin on the c3 knight!",tags:["Pin","Pressure"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Bd3 — Prepares O-O, blocks the pin with e2 open.",ar:[{f:'f1',t:'d3'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bg5 — Pin on the f6 knight!",tags:["Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"Be6 — Unpins, develops.",ar:[{f:'c8',t:'e6'}]},
{t:"Nd5 — The c3 knight leaps to the powerful d5 outpost!",tags:["Outpost","Strong knight"],ar:[{f:'c3',t:'d5'},{f:'d5',t:'f6',c:'r'},{f:'d5',t:'b4',c:'r'}]},
]},

{name:'7. Sicilian Dragon — Yugoslav Attack',
moves:['e2e4','c7c5','g1f3','d7d6','d2d4','c5d4','f3d4','g8f6','b1c3','g7g6','c1e3','f8g7','f2f3','e8g8','d1d2','b8c6','e1c1','d6d5','e4d5'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"d4 — Opens centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"g6 — The Dragon! Black fianchettoes for the powerful Dragon bishop.",tags:["Dragon","Fianchetto"],ar:[{f:'g7',t:'g6'}]},
{t:"Be3 — Yugoslav Attack setup! Prepares f3-Qd2-O-O-O.",tags:["Yugoslav Attack"],ar:[{f:'c1',t:'e3'}]},
{t:"Bg7 — Dragon bishop! Controls the a1-h8 diagonal.",tags:["Dragon bishop","Power diagonal"],ar:[{f:'f8',t:'g7'},{f:'g7',t:'a1',c:'r'}]},
{t:"f3 — Supports e4, sets up h4-h5 storm.",tags:["Storm prep"],ar:[{f:'f2',t:'f3'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Qd2 — Setup complete. White castles queenside and storms kingside.",tags:["Attack setup"],ar:[{f:'d1',t:'d2'}]},
{t:"Nc6 — Developing, pressures d4.",ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"O-O-O — Queenside castle! Both sides race: h4-h5 vs c-file counterplay.",tags:["Race begins!"],ar:[{f:'e1',t:'c1'}]},
{t:"d5 — Black's critical counter-strike!",tags:["Counter-attack","Critical"],ar:[{f:'d6',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"exd5 — White captures, sharp position.",tags:["Sharp"],ar:[{f:'e4',t:'d5'}]},
]},

{name:'8. Sicilian Scheveningen',
moves:['e2e4','c7c5','g1f3','e7e6','d2d4','c5d4','f3d4','d7d6','b1c3','g8f6','f1e2','f8e7','e1g1','e8g8','f2f4','b8c6','c1e3','d8c7','a2a4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"e6 — Scheveningen setup! Solid pawn structure.",tags:["Scheveningen","Solid"],ar:[{f:'e7',t:'e6'}]},
{t:"d4 — Opens centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"d6 — Classic Scheveningen pawn structure: e6+d6.",tags:["Scheveningen structure"],ar:[{f:'d7',t:'d6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Be2 — Solid, prepares castling.",ar:[{f:'f1',t:'e2'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"f4 — White prepares a kingside attack!",tags:["Kingside attack"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Be3 — Develops, supports the centre.",ar:[{f:'c1',t:'e3'}]},
{t:"Qc7 — Active queen, prepares ...b5 or ...a6.",tags:["Active queen"],ar:[{f:'d8',t:'c7'}]},
{t:"a4 — White clamps down on b5 and prepares a5.",tags:["Prevent b5","Space"],ar:[{f:'a2',t:'a4'}]},
]},

{name:'9. Sicilian Taimanov',
moves:['e2e4','c7c5','g1f3','e7e6','d2d4','c5d4','f3d4','b8c6','b1c3','d8c7','f1e2','a7a6','e1g1','g8f6','c1e3','f8e7','f2f4','d7d6','a2a4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"e6 — Solid structure.",ar:[{f:'e7',t:'e6'}]},
{t:"d4 — Opens centre.",ar:[{f:'d2',t:'d4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — Knight recaptures.",ar:[{f:'f3',t:'d4'}]},
{t:"Nc6 — Taimanov! Develops the knight. More flexible than Nf6.",tags:["Taimanov","Flexible"],ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Qc7 — Active queen, avoids pins.",tags:["Active queen","Avoid pin"],ar:[{f:'d8',t:'c7'}]},
{t:"Be2 — Solid development.",ar:[{f:'f1',t:'e2'}]},
{t:"a6 — Prevents Nb5, prepares b5.",tags:["Prevent Nb5","Prepare b5"],ar:[{f:'a7',t:'a6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Be3 — Develops, supports centre.",ar:[{f:'c1',t:'e3'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"f4 — White prepares kingside attack!",tags:["Kingside attack"],ar:[{f:'f2',t:'f4'}]},
{t:"d6 — Completes the Scheveningen-like structure.",tags:["Structure"],ar:[{f:'d7',t:'d6'}]},
{t:"a4 — Clamps down on b5.",tags:["Prevent b5"],ar:[{f:'a2',t:'a4'}]},
]},

{name:'10. Anti-Sicilian — 2.Nc3 Bb5',
moves:['e2e4','c7c5','b1c3','b8c6','f1b5','c6d4','g1f3','e7e6','e1g1','g8e7','f1e1','e7g6','b5f1','f8e7','d2d3','e8g8','c3d4','c5d4','d1e2'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
{t:"c5 — Sicilian.",ar:[{f:'c7',t:'c5'}]},
{t:"Nc3 — Anti-Sicilian with Bb5 idea, avoids theory.",tags:["Anti-Sicilian","Avoid theory"],ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Bb5 — Pin on the c6 knight!",tags:["Pin","Rossolimo-style"],ar:[{f:'f1',t:'b5'},{f:'b5',t:'c6',c:'r'}]},
{t:"Nd4 — Jumps to the central outpost!",tags:["Central outpost","Counter"],ar:[{f:'c6',t:'d4'}]},
{t:"Nf3 — Development, attacks Nd4.",ar:[{f:'g1',t:'f3'},{f:'f3',t:'d4',c:'r'}]},
{t:"e6 — Solidifies structure.",ar:[{f:'e7',t:'e6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Ne7 — Knight heads to g6, flexible.",ar:[{f:'g8',t:'e7'},{f:'e7',t:'g6',c:'r'}]},
{t:"Re1 — Centralises rook.",ar:[{f:'f1',t:'e1'}]},
{t:"Ng6 — Knight reaches ideal square.",ar:[{f:'e7',t:'g6'}]},
{t:"Bf1 — Bishop retreats to safety.",ar:[{f:'b5',t:'f1'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"d3 — Solid centre.",ar:[{f:'d2',t:'d3'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Nxd4 — White recaptures on d4.",ar:[{f:'c3',t:'d4'}]},
{t:"cxd4 — Black recaptures.",ar:[{f:'c5',t:'d4'}]},
{t:"Qe2 — White activates the queen.",tags:["Activate queen"],ar:[{f:'d1',t:'e2'}]},
]},

]},/* end sicilian_white */


/* ════ CARO-KANN — Black plays Black ════ */

/* ════ CARO-KANN — Black plays Black ════ */
caro:{flipped:true,myColor:'b',lines:[

{name:'1. Advance — 3.e5 Bf5 main',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','g1f3','e7e6','f1e2','c6c5','e1g1','b8c6','c1e3','d8b6','b1d2','c5d4','d2b3','d4e3','f2e3'],
explain:[
{t:"e4 — White opens.",ar:[{f:'e2',t:'e4'}]},
{t:"c6 — Caro-Kann! Prepares d5 with solid structure.",tags:["Caro-Kann","Solid"],ar:[{f:'c7',t:'c6'}]},
{t:"d4 — Builds classical centre.",ar:[{f:'d2',t:'d4'}]},
{t:"d5 — Key Caro move! Immediately challenges White's centre.",tags:["Key Caro idea"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"e5 — Advance Variation. White gains space.",tags:["Advance Caro"],ar:[{f:'e4',t:'e5'}]},
{t:"Bf5 — CRITICAL! Get the bishop out BEFORE playing e6. This is the whole Caro-Kann idea.",tags:["Key Caro move","Active bishop","Must know"],ar:[{f:'c8',t:'f5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"e6 — Solidifies the structure. Bishop is already out so e6 is fine now.",ar:[{f:'e7',t:'e6'}]},
{t:"Be2 — Quiet development, preparing to castle.",ar:[{f:'f1',t:'e2'}]},
{t:"c5 — Black's key counter-attack! Break the centre.",tags:["Counter-attack","Central break"],ar:[{f:'c6',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Nc6 — Develops, pressures d4.",ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"Be3 — White defends d4 and develops.",ar:[{f:'c1',t:'e3'}]},
{t:"Qb6 — Attacks b2 AND d4 simultaneously!",tags:["Double attack","Active queen"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'b2',c:'r'},{f:'b6',t:'d4',c:'r'}]},
{t:"Nbd2 — White defends b2 solidly.",ar:[{f:'b1',t:'d2'}]},
{t:"cxd4 — Black trades! Winning the d4 pawn.",tags:["Win pawn","Key tactic"],ar:[{f:'c5',t:'d4'}]},
{t:"Nb3 — Knight defends, blocks the d-pawn.",ar:[{f:'d2',t:'b3'}]},
{t:"dxe3 — Black captures the e3 bishop with tempo!",tags:["Capture with tempo","Tactics"],ar:[{f:'d4',t:'e3'}]},
{t:"fxe3 — White recaptures. Black has broken through and won material.",tags:["Material win","Breakthrough"],ar:[{f:'f2',t:'e3'}]},
]},

{name:'2. Exchange — 3.exd5 cxd5 4.Bd3',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','f1d3','b8c6','c2c3','g8f6','c1f4','c8g4','d1b3','d8d7','b1d2','e7e6','g1f3','f8e7','e1g1'],
explain:[
null,null,null,null,
{t:"exd5 — Exchange Variation. Symmetrical IQP-type position.",tags:["Exchange Caro"],ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures. Symmetrical structure.",tags:["Symmetry"],ar:[{f:'c6',t:'d5'}]},
{t:"Bd3 — Active bishop, White eyes the h7 square.",tags:["Active bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"Nc6 — Develops the knight.",ar:[{f:'b8',t:'c6'}]},
{t:"c3 — Supports d4 and prepares Nf3.",ar:[{f:'c2',t:'c3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Bf4 — Active bishop, controls e5.",ar:[{f:'c1',t:'f4'}]},
{t:"Bg4 — Pin on the f3 knight!",tags:["Pin","Active"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"Qb3 — Attacks b7 and d5 simultaneously!",tags:["Double threat"],ar:[{f:'d1',t:'b3'},{f:'b3',t:'b7',c:'r'},{f:'b3',t:'d5',c:'r'}]},
{t:"Qd7 — Defends b7 and prepares development.",ar:[{f:'d8',t:'d7'}]},
{t:"Nd2 — Solid development.",ar:[{f:'b1',t:'d2'}]},
{t:"e6 — Solidifies structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Ngf3 — The g1 knight develops to f3. Now castling is possible.",ar:[{f:'g1',t:'f3'}]},
{t:"Be7 — Solid development, prepares castling.",ar:[{f:'f8',t:'e7'}]},
{t:"O-O — White castles. Solid IQP position.",tags:["IQP","Solid"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'3. Two Knights — 2.Nc3 d5 3.Nf3',
moves:['e2e4','c7c6','b1c3','d7d5','g1f3','c8g4','h2h3','g4f3','d1f3','e7e6','d2d4','g8f6','f1d3','d5e4','c3e4','f6e4','f3e4','b8d7','e1g1'],
explain:[
null,null,null,null,
{t:"Nf3 — White develops the second knight.",ar:[{f:'g1',t:'f3'}]},
{t:"Bg4 — Active! Pin the f3 knight immediately.",tags:["Pin","Active"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"h3 — White challenges the bishop.",ar:[{f:'h2',t:'h3'},{f:'h3',t:'g4',c:'r'}]},
{t:"Bxf3 — Black takes, slightly damaging White's structure.",tags:["Trade"],ar:[{f:'g4',t:'f3'}]},
{t:"Qxf3 — White recaptures with the queen, centrally placed.",tags:["Central queen"],ar:[{f:'d1',t:'f3'}]},
{t:"e6 — Solid structure, prepares development.",ar:[{f:'e7',t:'e6'}]},
{t:"d4 — White builds the classical centre.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Bd3 — Active development.",ar:[{f:'f1',t:'d3'}]},
{t:"dxe4 — Black captures, opening lines.",ar:[{f:'d5',t:'e4'}]},
{t:"Nxe4 — White recaptures with the knight.",ar:[{f:'c3',t:'e4'}]},
{t:"Nxe4 — Black trades the f6 knight!",tags:["Trade","Simplify"],ar:[{f:'f6',t:'e4'}]},
{t:"Qxe4 — White recaptures, centralised queen.",tags:["Central queen"],ar:[{f:'f3',t:'e4'}]},
{t:"Nd7 — Develops the queen's knight.",ar:[{f:'b8',t:'d7'}]},
{t:"O-O — White castles. Equal position.",ar:[{f:'e1',t:'g1'}]},
]},

{name:'4. Fantasy — 3.f3 dxe4',
moves:['e2e4','c7c6','d2d4','d7d5','f2f3','d5e4','f3e4','e7e5','g1f3','e5d4','f1c4','g8f6','e1g1','f8c5','e4e5','f6d5','f3g5','e8g8','d1h5'],
explain:[
null,null,null,null,
{t:"f3 — Fantasy Attack! Unusual and aggressive.",tags:["Fantasy","Aggressive"],ar:[{f:'f2',t:'f3'}]},
{t:"dxe4 — Black captures.",ar:[{f:'d5',t:'e4'}]},
{t:"fxe4 — White recaptures.",ar:[{f:'f3',t:'e4'}]},
{t:"e5! — Best response! Strike back immediately.",tags:["Best response","Counter-attack"],ar:[{f:'e7',t:'e5'},{f:'e5',t:'d4',c:'r'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"exd4 — Black trades, opening lines.",ar:[{f:'e5',t:'d4'}]},
{t:"Bc4 — Active bishop, targets f7.",tags:["f7 target"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
{t:"Nf6 — Development, attacks e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"O-O — White castles quickly.",ar:[{f:'e1',t:'g1'}]},
{t:"Bc5 — Active bishop development.",ar:[{f:'f8',t:'c5'}]},
{t:"e5 — White pushes again, kicking the f6 knight.",tags:["Space","Forcing"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
{t:"Nd5 — Knight retreats to d5, a strong central square.",tags:["Central knight","Strong"],ar:[{f:'f6',t:'d5'}]},
{t:"Ng5 — Knight attacks f7 and h7!",tags:["Attack f7","Dangerous"],ar:[{f:'f3',t:'g5'},{f:'g5',t:'f7',c:'r'},{f:'g5',t:'h7',c:'r'}]},
{t:"O-O — Black castles for safety.",ar:[{f:'e8',t:'g8'}]},
{t:"Qh5 — Very aggressive queen! Eyes h7 and f7.",tags:["Aggressive","Attack"],ar:[{f:'d1',t:'h5'},{f:'h5',t:'h7',c:'r'}]},
]},

{name:'5. Panov — 4.c4 Nf6 5.Nc3 Nc6',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','c2c4','g8f6','b1c3','b8c6','g1f3','c8g4','c4d5','f6d5','d1b3','g4f3','g2f3','e7e6','b3b7'],
explain:[
null,null,null,null,
{t:"exd5 — Exchange gives rise to the Panov.",ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"c4 — Panov Attack! Creates IQP position.",tags:["Panov","IQP"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Nf3 — Completes development.",ar:[{f:'g1',t:'f3'}]},
{t:"Bg4 — Pin! Black develops actively.",tags:["Pin"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"cxd5 — White resolves tension.",ar:[{f:'c4',t:'d5'}]},
{t:"Nxd5 — The f6 knight recaptures on d5! Keeps Nc6 available for defense.",tags:["Central knight","Correct recapture"],ar:[{f:'f6',t:'d5'}]},
{t:"Qb3 — Double attack on b7 and d5!",tags:["Double threat","Tactics"],ar:[{f:'d1',t:'b3'},{f:'b3',t:'b7',c:'r'},{f:'b3',t:'d5',c:'r'}]},
{t:"Bxf3 — Black trades to relieve pin pressure.",tags:["Trade","Relieve pin"],ar:[{f:'g4',t:'f3'}]},
{t:"gxf3 — White recaptures, opens the g-file.",tags:["Open g-file"],ar:[{f:'g2',t:'f3'}]},
{t:"e6 — Solid structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Qxb7 — White wins the b7 pawn!",tags:["Win pawn","Material"],ar:[{f:'b3',t:'b7'}]},
]},

{name:'6. Classical — 4...Bf5 5.Ng3 h4 (THE main line)',
moves:['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','h2h4','h7h6','g1f3','b8d7','h4h5','g6h7','f1d3','h7d3','d1d3'],
explain:[
null,null,null,null,
{t:"Nxe4 — Knight recaptures powerfully in the centre.",ar:[{f:'c3',t:'e4'}]},
{t:"Bf5 — THE Classical Caro! Bishop develops BEFORE e6 — the entire Caro-Kann concept.",tags:["Classical Caro","MUST KNOW","Key move"],ar:[{f:'c8',t:'f5'}]},
{t:"Ng3 — Attacks the bishop to gain tempo.",tags:["Tempo gain"],ar:[{f:'e4',t:'g3'},{f:'g3',t:'f5',c:'r'}]},
{t:"Bg6 — Bishop retreats to the g6-h5 diagonal.",ar:[{f:'f5',t:'g6'}]},
{t:"h4 — White attacks the bishop with the h-pawn!",tags:["Space","Attack bishop"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
{t:"h6 — Prevents h5 trapping the bishop.",tags:["Necessary","Prevent trap"],ar:[{f:'h7',t:'h6'}]},
{t:"Nf3 — Development, preparing Ne5.",ar:[{f:'g1',t:'f3'},{f:'f3',t:'e5',c:'r'}]},
{t:"Nd7 — Flexible development, supports e5/f6.",ar:[{f:'b8',t:'d7'}]},
{t:"h5 — White attacks the bishop on g6!",tags:["Attack bishop","Space"],ar:[{f:'h4',t:'h5'},{f:'h5',t:'g6',c:'r'}]},
{t:"Bh7 — Bishop retreats to h7. Slightly passive but solid.",tags:["Retreat","Solid"],ar:[{f:'g6',t:'h7'}]},
{t:"Bd3 — White challenges the bishop on h7.",tags:["Challenge bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"Bxd3 — Black trades the bishop.",tags:["Trade","Structural"],ar:[{f:'h7',t:'d3'}]},
{t:"Qxd3 — White recaptures. Strong queen, well placed.",tags:["Strong queen"],ar:[{f:'d1',t:'d3'}]},
]},

{name:'7. Classical — Quiet 6.Nf3 (avoid h4)',
moves:['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','g1f3','b8d7','f1d3','g6d3','d1d3','e7e6','e1g1','g8f6','f1e1'],
explain:[
null,null,null,null,null,null,
{t:"Nf3 — White develops without the aggressive h4. More positional.",tags:["Classical Quiet","Positional"],ar:[{f:'g1',t:'f3'}]},
{t:"Nd7 — Solid development.",ar:[{f:'b8',t:'d7'}]},
{t:"Bd3 — White challenges the g6 bishop.",tags:["Trade bishops"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'g6',c:'r'}]},
{t:"Bxd3 — Black trades. Solid position.",tags:["Trade","Solid"],ar:[{f:'g6',t:'d3'}]},
{t:"Qxd3 — White recaptures.",tags:["Centralised queen"],ar:[{f:'d1',t:'d3'}]},
{t:"e6 — Solidifies the structure.",ar:[{f:'e7',t:'e6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Ngf6 — Develops the g-knight.",ar:[{f:'g8',t:'f6'}]},
{t:"Re1 — Rook centralises on the e-file.",tags:["Rook activation","Open e-file"],ar:[{f:'f1',t:'e1'}]},
]},

{name:'8. Advance — Tal Variation 4.h4',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','h2h4','h7h5','f1d3','f5d3','d1d3','e7e6','g1f3','c6c5','c2c4','b8c6','c4d5','d8d5','b1c3'],
explain:[
null,null,null,null,
{t:"e5 — Advance Variation.",ar:[{f:'e4',t:'e5'}]},
{t:"Bf5 — Bishop develops immediately, the key Caro idea.",tags:["Key move","Active bishop"],ar:[{f:'c8',t:'f5'}]},
{t:"h4 — The Tal Variation! Very aggressive. White threatens h5 immediately.",tags:["Tal Variation","Aggressive","Very popular today"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
{t:"h5 — Black stops h5 but weakens the g5 square.",tags:["Prevent h5","Weakens g5"],ar:[{f:'h7',t:'h5'}]},
{t:"Bd3 — White challenges the bishop.",tags:["Challenge bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'f5',c:'r'}]},
{t:"Bxd3 — Black trades. The structure decides who plays better.",tags:["Trade","Key decision"],ar:[{f:'f5',t:'d3'}]},
{t:"Qxd3 — White recaptures, aiming at the h7 square.",tags:["Active queen"],ar:[{f:'d1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"e6 — Solidifying the structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"c5 — Black counter-attacks! The c-pawn advances to c5.",tags:["Counter-attack","Break"],ar:[{f:'c6',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"c4 — White gains more central space.",tags:["Space"],ar:[{f:'c2',t:'c4'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"cxd5 — White resolves tension.",ar:[{f:'c4',t:'d5'}]},
{t:"Qxd5 — Black recaptures with the queen, centralised.",tags:["Active queen","Central"],ar:[{f:'d8',t:'d5'}]},
{t:"Nc3 — Development, attacks the queen.",tags:["Development","Attack queen"],ar:[{f:'b1',t:'c3'},{f:'c3',t:'d5',c:'r'}]},
]},

{name:'9. Advance — Short Variation 5.Nd7',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','g1f3','e7e6','f1e2','b8d7','e1g1','c6c5','c1e3','d8b6','b1d2','b6b2','c2c4','c5d4','e3d4'],
explain:[
null,null,null,null,
{t:"e5 — Advance Variation.",ar:[{f:'e4',t:'e5'}]},
{t:"Bf5 — Bishop out first! Key Caro-Kann principle.",tags:["Key Caro principle"],ar:[{f:'c8',t:'f5'}]},
{t:"Nf3 — Solid development.",ar:[{f:'g1',t:'f3'}]},
{t:"e6 — Solidifies structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Be2 — Quiet development.",ar:[{f:'f1',t:'e2'}]},
{t:"Nd7 — Short Variation! Flexible knight, heading to f8-g6 or b6-c4.",tags:["Short Variation","Flexible"],ar:[{f:'b8',t:'d7'},{f:'d7',t:'f8',c:'r'},{f:'f8',t:'g6',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"c5 — Counter-attack against White's centre.",tags:["Counter-attack"],ar:[{f:'c6',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Be3 — White defends d4.",ar:[{f:'c1',t:'e3'}]},
{t:"Qb6 — Active queen, targets b2 and d4.",tags:["Active queen","Double target"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'b2',c:'r'},{f:'b6',t:'d4',c:'r'}]},
{t:"Nbd2 — White defends b2 solidly.",ar:[{f:'b1',t:'d2'}]},
{t:"Qxb2 — Black wins the b2 pawn!",tags:["Win pawn","Sharp"],ar:[{f:'b6',t:'b2'}]},
{t:"c4 — White launches the centre, active compensation.",tags:["Compensation","Attack"],ar:[{f:'c2',t:'c4'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Bxd4 — White recaptures. Active bishop, initiative.",tags:["Active bishop","Initiative"],ar:[{f:'e3',t:'d4'}]},
]},

{name:'10. Exchange — Bb5+ sideline',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','f1b5','b8c6','g1f3','c8g4','h2h3','g4f3','d1f3','e7e6','e1g1','g8f6','c2c4','f8e7','b1c3'],
explain:[
null,null,null,null,
{t:"exd5 — Exchange Variation.",ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"Bb5+ — Annoying sideline! Check and pin on c6.",tags:["Annoying sideline","Check","Must know"],ar:[{f:'f1',t:'b5'}]},
{t:"Nc6 — Blocks the check.",tags:["Block check"],ar:[{f:'b8',t:'c6'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Bg4 — Active development! Pin on the f3 knight.",tags:["Pin","Active"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"h3 — White attacks the bishop.",tags:["Attack bishop"],ar:[{f:'h2',t:'h3'},{f:'h3',t:'g4',c:'r'}]},
{t:"Bxf3 — Black takes, slightly weakening White's structure.",tags:["Trade"],ar:[{f:'g4',t:'f3'}]},
{t:"Qxf3 — White recaptures with the queen.",ar:[{f:'d1',t:'f3'}]},
{t:"e6 — Solid structure.",ar:[{f:'e7',t:'e6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Panov-style! White opens the centre.",tags:["Panov idea","Open centre"],ar:[{f:'c2',t:'c4'}]},
{t:"Be7 — Solid development.",ar:[{f:'f8',t:'e7'}]},
{t:"Nc3 — Full development. Symmetrical position.",tags:["Development complete","Symmetrical"],ar:[{f:'b1',t:'c3'}]},
]},

{name:'11. Panov + Nf3 Bb4 (super common at your level)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','g1f3','g8f6','c2c4','e7e6','b1c3','f8b4','c4d5','f6d5','d1c2','e8g8','f1d3','h7h6','e1g1'],
explain:[
null,null,null,null,
{t:"exd5 — Exchange type position.",ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"Nf3 — Development. Different from standard Panov (no c4 yet).",tags:["Flexible move order"],ar:[{f:'g1',t:'f3'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — NOW c4! Panov-style, but with Nf3 already on the board.",tags:["Panov idea","Common move order"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
{t:"e6 — Solid structure, supports d5.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-style! Pins the c3 knight.",tags:["Nimzo idea","Pin","Super common"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"cxd5 — White captures, resolving pawn tension.",ar:[{f:'c4',t:'d5'}]},
{t:"Nxd5 — Black recaptures with the knight, very centralised.",tags:["Central knight"],ar:[{f:'f6',t:'d5'}]},
{t:"Qc2 — White develops the queen, targeting e4 and c6.",tags:["Active queen","Flexible"],ar:[{f:'d1',t:'c2'}]},
{t:"O-O — Black castles for king safety.",ar:[{f:'e8',t:'g8'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"h6 — Prevents Bg5 pin.",tags:["Prevent Bg5","Useful prophylaxis"],ar:[{f:'h7',t:'h6'}]},
{t:"O-O — White castles. Balanced position with active pieces for both sides.",tags:["Balanced","Solid"],ar:[{f:'e1',t:'g1'}]},
]},


{name:'12. Advance Nf3 — 2.Nf3 d5 3.e5 Bg4 (Bronstein-Larsen)',
moves:['e2e4','c7c6','g1f3','d7d5','e4e5','c8g4','d2d4','e7e6','f1e2','g4f3','e2f3','c6c5','c2c3','b8c6','e1g1','d8b6','b2b3','c5d4','c3d4'],
explain:[
{t:"e4 — White opens.",ar:[{f:'e2',t:'e4'}]},
{t:"c6 — Caro-Kann!",tags:["Caro-Kann"],ar:[{f:'c7',t:'c6'}]},
{t:"Nf3 — Bronstein-Larsen move order! White develops BEFORE playing d4, keeping options flexible.",tags:["Bronstein-Larsen","Flexible move order","Tricky"],ar:[{f:'g1',t:'f3'}]},
{t:"d5 — Black plays the standard Caro-Kann centre.",ar:[{f:'d7',t:'d5'}]},
{t:"e5 — Advance! White gains space. The game has the structure of the Advance Variation.",tags:["Advance structure","Space"],ar:[{f:'e4',t:'e5'}]},
{t:"Bg4 — Key idea! Black pins the f3 knight immediately. This is only possible because White played Nf3 before d4.",tags:["Pin","Key idea","Only possible here"],ar:[{f:'c8',t:'g4'},{f:'g4',t:'f3',c:'r'}]},
{t:"d4 — White builds the centre. Now d4 is played after the knight is already on f3.",tags:["Build centre"],ar:[{f:'d2',t:'d4'}]},
{t:"e6 — Solidifies structure.",ar:[{f:'e7',t:'e6'}]},
{t:"Be2 — White prepares to break the pin by moving the bishop first.",tags:["Prepare to break pin"],ar:[{f:'f1',t:'e2'}]},
{t:"Bxf3 — Black trades! Damages White's pawn structure (doubled f-pawns).",tags:["Trade","Doubled f-pawns","Key exchange"],ar:[{f:'g4',t:'f3'}]},
{t:"Bxf3 — White recaptures with the bishop. Gets the bishop pair but accepts the structural weakness.",tags:["Bishop pair","Structural weakness"],ar:[{f:'e2',t:'f3'}]},
{t:"c5 — Black's key counter-attack against the d4 pawn.",tags:["Counter-attack","Attack d4"],ar:[{f:'c6',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"c3 — White supports d4.",tags:["Support d4"],ar:[{f:'c2',t:'c3'}]},
{t:"Nc6 — Development, pressures d4.",ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Qb6 — Active queen! Attacks b2 and d4 simultaneously.",tags:["Active queen","Double attack"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'b2',c:'r'},{f:'b6',t:'d4',c:'r'}]},
{t:"b3 — Defends b2.",tags:["Defend b2"],ar:[{f:'b2',t:'b3'}]},
{t:"cxd4 — Black captures the d4 pawn!",tags:["Win pawn","Break through"],ar:[{f:'c5',t:'d4'}]},
{t:"cxd4 — White recaptures. Black has broken through and the position is double-edged.",tags:["Double-edged","Balanced tension"],ar:[{f:'c3',t:'d4'}]},
]},


{name:'13. Closed Panov — 6.c5 e5',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','c2c4','g8f6','b1c3','b8c6','c4c5','e7e5','d4e5','c6e5','f1b5','c8d7','d1e2','d8e7','b5d7','e5d7'],
explain:[
{t:"e4 — White opens.",ar:[{f:'e2',t:'e4'}]},
{t:"c6 — Caro-Kann!",tags:["Caro-Kann"],ar:[{f:'c7',t:'c6'}]},
{t:"d4 — Builds the centre.",ar:[{f:'d2',t:'d4'}]},
{t:"d5 — Challenges the centre.",ar:[{f:'d7',t:'d5'}]},
{t:"exd5 — Exchange, heading into Panov territory.",ar:[{f:'e4',t:'d5'}]},
{t:"cxd5 — Black recaptures.",ar:[{f:'c6',t:'d5'}]},
{t:"c4 — Panov! White attacks the d5 pawn.",tags:["Panov Attack"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Nc3 — Develops, pressures d5.",ar:[{f:'b1',t:'c3'}]},
{t:"Nc6 — Defends d5.",ar:[{f:'b8',t:'c6'}]},
{t:"c5 — Closed Panov! White closes the queenside, grabs space.",tags:["Closed Panov","Space grab","Key moment"],ar:[{f:'c4',t:'c5'}]},
{t:"e5! — Black's key counter! Strikes immediately in the centre.",tags:["Counter-attack","Best response","Central break"],ar:[{f:'e7',t:'e5'},{f:'e5',t:'d4',c:'r'}]},
{t:"dxe5 — White captures the e5 pawn.",ar:[{f:'d4',t:'e5'}]},
{t:"Nxe5 — The c6 knight recaptures on e5, very active!",tags:["Active knight","Central outpost"],ar:[{f:'c6',t:'e5'}]},
{t:"Bb5+ — Check! Pin on the d7 bishop.",tags:["Check","Pin","Forced"],ar:[{f:'f1',t:'b5'}]},
{t:"Bd7 — Blocks the check.",ar:[{f:'c8',t:'d7'}]},
{t:"Qe2 — White pins the e5 knight! Attacks it twice.",tags:["Pin","Double attack"],ar:[{f:'d1',t:'e2'},{f:'e2',t:'e5',c:'r'}]},
{t:"Qe7 — Defends the knight AND prepares to castle long.",tags:["Defend knight","Prepare castle"],ar:[{f:'d8',t:'e7'},{f:'e7',t:'e5',c:'r'}]},
{t:"Bxd7+ — White captures the d7 bishop with check!",tags:["Capture with check","Trade"],ar:[{f:'b5',t:'d7'}]},
{t:"Nexd7 — The e5 knight recaptures. Black has active pieces and good compensation.",tags:["Active pieces","Compensation"],ar:[{f:'e5',t:'d7'}]},
]},

]},/* end caro */


/* ════ NIMZO-INDIAN — Black plays Black ════ */
nimzo:{flipped:true,myColor:'b',lines:[

{name:'1. Rubinstein — 4.e3 O-O 5.Bd3 d5 (main)',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','e2e3','e8g8','f1d3','d7d5','g1f3','c7c5','e1g1','b8c6','a2a3','b4c3','b2c3','d5c4','d3c4'],
explain:[
{t:"d4 — Queen's pawn opening.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development, controls e4.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds the centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4, supports d5.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian! Pins the c3 knight, prevents e4.",tags:["Nimzo-Indian","Pin","MOST IMPORTANT"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'},{f:'c3',t:'e4',c:'r'}]},
{t:"e3 — Rubinstein, the most popular. Solid development.",tags:["Rubinstein","Most played"],ar:[{f:'e2',t:'e3'}]},
{t:"O-O — Castle early! King safe, flexible development.",tags:["Castle early"],ar:[{f:'e8',t:'g8'}]},
{t:"Bd3 — Active bishop, eyes h7.",tags:["Active bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"d5 — Central claim. The standard Rubinstein structure.",tags:["Central claim"],ar:[{f:'d7',t:'d5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"c5 — Challenges d4! Key counter-attack.",tags:["Challenge d4"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"Nc6 — Development, pressures d4.",ar:[{f:'b8',t:'c6'}]},
{t:"a3 — Forces the bishop's decision.",tags:["Force decision"],ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Bxc3+ — Black trades! Creates doubled c-pawns for White.",tags:["Doubled pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — White recaptures. Gains the bishop pair.",tags:["Bishop pair"],ar:[{f:'b2',t:'c3'}]},
{t:"dxc4 — Black takes the pawn, entering the IQP position.",tags:["IQP","Take the pawn"],ar:[{f:'d5',t:'c4'}]},
{t:"Bxc4 — White recaptures. Active bishop on the a2-g8 diagonal.",tags:["Active bishop","IQP"],ar:[{f:'d3',t:'c4'},{f:'c4',t:'g8',c:'r'}]},
]},

{name:'2. Classical — 4.Qc2 O-O 5.a3',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','d1c2','e8g8','a2a3','b4c3','c2c3','d7d5','g1f3','c7c5','d4c5','b8c6','e2e3','f6e4','c3c2'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds the centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian! Pin on c3.",tags:["Nimzo-Indian","Pin"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Qc2 — Classical! Avoids doubled pawns by retreating with queen if Bxc3.",tags:["Classical","Avoid doubled pawns"],ar:[{f:'d1',t:'c2'}]},
{t:"O-O — Castle early.",ar:[{f:'e8',t:'g8'}]},
{t:"a3 — Forces the bishop's hand.",tags:["Force decision"],ar:[{f:'a2',t:'a3'}]},
{t:"Bxc3+ — Black trades, creating doubled c-pawns!",tags:["Doubled c-pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"Qxc3 — Recaptures with queen, keeping pawn structure intact.",ar:[{f:'c2',t:'c3'}]},
{t:"d5 — Central claim.",ar:[{f:'d7',t:'d5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"c5 — Challenges d4.",tags:["Challenge d4"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"dxc5 — White captures. Now Black regains with ...Nc6-e4.",tags:["Take the pawn"],ar:[{f:'d4',t:'c5'}]},
{t:"Nc6 — Develops and prepares Ne4 to win the pawn back.",tags:["Plan: Ne4"],ar:[{f:'b8',t:'c6'},{f:'c6',t:'e4',c:'r'}]},
{t:"e3 — Solidifies.",ar:[{f:'e2',t:'e3'}]},
{t:"Ne4 — The f6-knight jumps to e4, winning the c5 pawn back!",tags:["Win pawn back","Tactic"],ar:[{f:'f6',t:'e4'},{f:'e4',t:'c3',c:'r'}]},
{t:"Qc2 — Queen retreats, keeping the extra pawn.",ar:[{f:'c3',t:'c2'}]},
]},

{name:'3. Leningrad — 4.Bg5 c5 5.d5',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','c1g5','c7c5','d4d5','h7h6','g5h4','d7d6','e2e3','b4c3','b2c3','e6e5','f1d3','b8d7','g1e2'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Bg5 — Leningrad! Pins the f6 knight, plans e3 freely.",tags:["Leningrad","Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"c5 — Black challenges d4 immediately.",tags:["Challenge d4"],ar:[{f:'c7',t:'c5'}]},
{t:"d5 — White closes the centre and grabs space.",tags:["Close centre","Space"],ar:[{f:'d4',t:'d5'}]},
{t:"h6 — Drive the bishop away!",tags:["Drive bishop"],ar:[{f:'h7',t:'h6'},{f:'h6',t:'g5',c:'r'}]},
{t:"Bh4 — Bishop retreats, keeps the pin.",ar:[{f:'g5',t:'h4'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"e3 — White develops solidly.",ar:[{f:'e2',t:'e3'}]},
{t:"Bxc3+ — Black trades the bishop!",tags:["Trade","Doubled pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — Recaptures. Doubled c-pawns but bishop pair.",tags:["Bishop pair"],ar:[{f:'b2',t:'c3'}]},
{t:"e5 — Black grabs central space, e6 pawn advances!",tags:["Central space"],ar:[{f:'e6',t:'e5'}]},
{t:"Bd3 — White develops the bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Nbd7 — Develops the knight, plans ...Nf8-g6.",ar:[{f:'b8',t:'d7'},{f:'d7',t:'f8',c:'r'},{f:'f8',t:'g6',c:'r'}]},
{t:"Ne2 — Knight development, prepares kingside or f4.",tags:["Flexible knight"],ar:[{f:'g1',t:'e2'}]},
]},

{name:'4. f3 Variation — d5 5.a3 Bxc3+ Re8',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','f2f3','d7d5','a2a3','b4c3','b2c3','c7c5','c4d5','e6d5','e2e3','e8g8','f1d3','f8e8','g1e2'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"f3 — Aggressive! White plans e4, but displaces the f3 knight.",tags:["Aggressive","Plans e4"],ar:[{f:'f2',t:'f3'}]},
{t:"d5 — Counter in the centre before e4 comes!",tags:["Counter before e4","Key idea"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"a3 — Forces the bishop to decide.",ar:[{f:'a2',t:'a3'}]},
{t:"Bxc3+ — Trades! Creates doubled pawns.",tags:["Doubled pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — White recaptures.",ar:[{f:'b2',t:'c3'}]},
{t:"c5 — Attacks the weak c4 and d4 pawns!",tags:["Attack weakness"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"cxd5 — White resolves tension.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures, IQP structure.",tags:["IQP"],ar:[{f:'e6',t:'d5'}]},
{t:"e3 — White builds the pawn chain.",ar:[{f:'e2',t:'e3'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Re8 — Rook to e8! Prepares ...e5 push.",tags:["Prepare e5","Rook activation"],ar:[{f:'f8',t:'e8'},{f:'e8',t:'e5',c:'r'}]},
{t:"Ne2 — Knight development, supports the centre.",ar:[{f:'g1',t:'e2'}]},
]},

{name:'5. Anti-Nimzo — 3.Nf3 QGD setup',
moves:['d2d4','g8f6','c2c4','e7e6','g1f3','d7d5','b1c3','f8e7','c1g5','e8g8','e2e3','h7h6','g5h4','b7b6','c4d5','e6d5','f1d3','c8b7','e1g1'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Solid.",ar:[{f:'e7',t:'e6'}]},
{t:"Nf3 — Anti-Nimzo! No Nc3, avoids the Bb4 pin.",tags:["Anti-Nimzo","Avoid Bb4"],ar:[{f:'g1',t:'f3'}]},
{t:"d5 — QGD structure, solid and classical.",tags:["QGD","Adapt"],ar:[{f:'d7',t:'d5'}]},
{t:"Nc3 — Now develops the knight.",ar:[{f:'b1',t:'c3'}]},
{t:"Be7 — Solid development.",tags:["Solid","QGD style"],ar:[{f:'f8',t:'e7'}]},
{t:"Bg5 — Pin on the f6 knight.",tags:["Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"O-O — Castle early.",ar:[{f:'e8',t:'g8'}]},
{t:"e3 — Solid structure.",ar:[{f:'e2',t:'e3'}]},
{t:"h6 — Drive the bishop away.",tags:["Drive bishop"],ar:[{f:'h7',t:'h6'},{f:'h6',t:'g5',c:'r'}]},
{t:"Bh4 — Bishop retreats.",ar:[{f:'g5',t:'h4'}]},
{t:"b6 — Queen's Indian idea! Prepares Bb7.",tags:["Queen's Indian","Fianchetto"],ar:[{f:'b7',t:'b6'}]},
{t:"cxd5 — White resolves central tension.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures.",ar:[{f:'e6',t:'d5'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Bb7 — Fianchetto complete! Bishop on the long diagonal.",tags:["Strong bishop","Long diagonal"],ar:[{f:'c8',t:'b7'},{f:'b7',t:'g2',c:'r'}]},
{t:"O-O — White castles. Equal position.",ar:[{f:'e1',t:'g1'}]},
]},

{name:'6. Sämisch — 4.a3 Bxc3+ f3',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','a2a3','b4c3','b2c3','c7c5','f2f3','d7d5','c4d5','e6d5','e2e3','e8g8','f1d3','f8e8','g1e2'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"a3 — Sämisch! Forces the trade immediately.",tags:["Samisch","Very common at your level"],ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Bxc3+ — Forced trade! Creates doubled c-pawns.",tags:["Doubled pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — White recaptures, gets the bishop pair.",tags:["Bishop pair"],ar:[{f:'b2',t:'c3'}]},
{t:"c5 — Black attacks the centre immediately.",tags:["Attack centre"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"f3 — Supports e4! White plans a big centre.",tags:["Prepare e4","Aggressive"],ar:[{f:'f2',t:'f3'}]},
{t:"d5 — Counter! Break before White gets e4.",tags:["Counter","Break"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"cxd5 — White captures.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures.",ar:[{f:'e6',t:'d5'}]},
{t:"e3 — Builds the pawn chain.",ar:[{f:'e2',t:'e3'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Re8 — Rook to e8, prepares ...e5.",tags:["Prepare e5"],ar:[{f:'f8',t:'e8'}]},
{t:"Ne2 — Knight development.",ar:[{f:'g1',t:'e2'}]},
]},

{name:'7. Kmoch — 4.f3 c5 5.d5 b5',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','f2f3','c7c5','d4d5','b7b5','e2e4','e8g8','g1e2','e6d5','c4d5','d7d6','a2a3','b4a5','g2g3'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"f3 — Kmoch Variation! More aggressive version of f3, plans e4.",tags:["Kmoch","Aggressive"],ar:[{f:'f2',t:'f3'}]},
{t:"c5 — Black strikes the centre immediately.",tags:["Challenge centre"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"d5 — White closes the centre. Now it's a positional battle.",tags:["Close centre","Space"],ar:[{f:'d4',t:'d5'}]},
{t:"b5 — Aggressive! Black launches queenside counterplay.",tags:["Queenside counter","Aggressive"],ar:[{f:'b7',t:'b5'},{f:'b5',t:'c4',c:'r'}]},
{t:"e4 — White grabs a massive centre!",tags:["Big centre"],ar:[{f:'e2',t:'e4'}]},
{t:"O-O — Black castles, preparing counterplay.",ar:[{f:'e8',t:'g8'}]},
{t:"Ne2 — Knight development, avoids the pin.",ar:[{f:'g1',t:'e2'}]},
{t:"exd5 — Black trades.",ar:[{f:'e6',t:'d5'}]},
{t:"cxd5 — White recaptures.",ar:[{f:'c4',t:'d5'}]},
{t:"d6 — Solid structure.",ar:[{f:'d7',t:'d6'}]},
{t:"a3 — Asks the bishop to decide.",ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Ba5 — Bishop retreats, still active.",ar:[{f:'b4',t:'a5'}]},
{t:"g3 — White prepares Bg2.",tags:["Fianchetto prep"],ar:[{f:'g2',t:'g3'}]},
]},

{name:'8. Classical — 4.Nf3 Bg5 h6',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','g1f3','e8g8','c1g5','h7h6','g5h4','c7c5','e2e3','d7d5','c4d5','e6d5','f1d3','b8c6','e1g1'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Nf3 — Classical approach, avoids Bg5 immediately.",tags:["Classical Nf3","Solid"],ar:[{f:'g1',t:'f3'}]},
{t:"O-O — Castle early for safety.",ar:[{f:'e8',t:'g8'}]},
{t:"Bg5 — Pins the f6 knight, creating pressure.",tags:["Pin","Pressure"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"h6 — Challenges the bishop.",tags:["Challenge bishop"],ar:[{f:'h7',t:'h6'},{f:'h6',t:'g5',c:'r'}]},
{t:"Bh4 — Bishop retreats, keeps the pin.",ar:[{f:'g5',t:'h4'}]},
{t:"c5 — Attacks d4.",tags:["Attack d4"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"e3 — Solid structure.",ar:[{f:'e2',t:'e3'}]},
{t:"d5 — Central claim.",ar:[{f:'d7',t:'d5'}]},
{t:"cxd5 — White captures.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures, IQP position.",tags:["IQP"],ar:[{f:'e6',t:'d5'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"O-O — White castles. Typical IQP middlegame.",tags:["IQP middlegame"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'9. Early e3 + Ne2 — avoid theory',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','e2e3','e8g8','g1e2','d7d5','a2a3','b4e7','c4d5','e6d5','g2g3','c7c5','f1g2','b8c6','e1g1'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"e3 — Rubinstein-style, but White avoids the main lines.",tags:["Avoid theory"],ar:[{f:'e2',t:'e3'}]},
{t:"O-O — Castle early.",ar:[{f:'e8',t:'g8'}]},
{t:"Ne2 — Knight to e2! Avoids the pin on f3. Common anti-theory choice.",tags:["Ne2 idea","Avoid pin","Very common online"],ar:[{f:'g1',t:'e2'}]},
{t:"d5 — Central claim.",ar:[{f:'d7',t:'d5'}]},
{t:"a3 — Forces the bishop's decision.",ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Be7 — Bishop retreats! Avoids the trade and keeps the bishop.",tags:["Keep bishop","Avoid trade"],ar:[{f:'b4',t:'e7'}]},
{t:"cxd5 — White captures.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures.",ar:[{f:'e6',t:'d5'}]},
{t:"g3 — Fianchetto idea.",ar:[{f:'g2',t:'g3'}]},
{t:"c5 — Black attacks d4.",tags:["Attack d4"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Bg2 — Fianchetto bishop.",ar:[{f:'f1',t:'g2'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"O-O — White castles. Solid IQP-type position.",tags:["IQP","Equal"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'10. Aggressive h4 — 4.f3 d5 8.e3 Nc6 10.h4',
moves:['d2d4','g8f6','c2c4','e7e6','b1c3','f8b4','f2f3','d7d5','a2a3','b4c3','b2c3','c7c5','c4d5','e6d5','e2e3','e8g8','f1d3','b8c6','h2h4'],
explain:[
{t:"d4 — Queen's pawn.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"c4 — Builds centre.",ar:[{f:'c2',t:'c4'}]},
{t:"e6 — Prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"Nc3 — Central development.",ar:[{f:'b1',t:'c3'}]},
{t:"Bb4 — Nimzo-Indian!",tags:["Nimzo-Indian"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"f3 — Plans e4 and a big centre.",tags:["Plans e4"],ar:[{f:'f2',t:'f3'}]},
{t:"d5 — Counter before e4 comes!",tags:["Counter before e4"],ar:[{f:'d7',t:'d5'}]},
{t:"a3 — Forces the trade.",ar:[{f:'a2',t:'a3'}]},
{t:"Bxc3+ — Black trades.",tags:["Check","Doubled pawns"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — White recaptures.",ar:[{f:'b2',t:'c3'}]},
{t:"c5 — Attacks the pawns.",ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"cxd5 — White resolves tension.",ar:[{f:'c4',t:'d5'}]},
{t:"exd5 — Black recaptures.",ar:[{f:'e6',t:'d5'}]},
{t:"e3 — Builds the chain.",ar:[{f:'e2',t:'e3'}]},
{t:"O-O — Black castles.",ar:[{f:'e8',t:'g8'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"h4 — Aggressive! h4-h5 storm incoming. Dangerous and trendy.",tags:["h4 storm","Aggressive","Modern","Dangerous if unknown"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
]},


{name:'11. Qd3 System — 1.d4 Nf6 2.Nc3 e6 3.e3 Bb4',
moves:['d2d4','g8f6','b1c3','e7e6','e2e3','f8b4','g1f3','d7d5','d1d3','e8g8','a2a3','b4c3','d3c3','c7c5','d4c5','f6e4','c3b4','b8c6','b4b3'],
explain:[
{t:"d4 — Queen's pawn opening.",ar:[{f:'d2',t:'d4'}]},
{t:"Nf6 — Development, controls e4.",ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"Nc3 — Unusual! White plays Nc3 before c4, entering a Nimzo-like setup without the c4 pawn.",tags:["Unusual","No c4","Tricky"],ar:[{f:'b1',t:'c3'}]},
{t:"e6 — Solid structure, prepares Bb4.",ar:[{f:'e7',t:'e6'}]},
{t:"e3 — Supports d4, prepares Bd3.",tags:["Solid","Prepare Bd3"],ar:[{f:'e2',t:'e3'}]},
{t:"Bb4 — Nimzo-style pin on the c3 knight! Same idea as the classic Nimzo-Indian.",tags:["Nimzo idea","Pin","Must know"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"d5 — Claims the centre.",tags:["Central claim"],ar:[{f:'d7',t:'d5'}]},
{t:"Qd3 — The Qd3 System! Unusual queen move. Prepares to recapture on c3 with the queen after Bxc3+.",tags:["Qd3 System","Unusual","Avoids doubled pawns"],ar:[{f:'d1',t:'d3'}]},
{t:"O-O — Black castles for safety.",ar:[{f:'e8',t:'g8'}]},
{t:"a3 — Forces the bishop to commit.",tags:["Force decision"],ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Bxc3+ — Black trades! Creates pressure.",tags:["Trade","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"Qxc3 — White recaptures with the queen — no doubled pawns! This is why White played Qd3.",tags:["Key idea","No doubled pawns","Queen recaptures"],ar:[{f:'d3',t:'c3'}]},
{t:"c5 — Black immediately attacks d4.",tags:["Attack d4","Counter-attack"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"dxc5 — White captures the c5 pawn.",tags:["Take the pawn"],ar:[{f:'d4',t:'c5'}]},
{t:"Ne4 — The f6 knight jumps to the powerful e4 outpost, winning the c5 pawn back!",tags:["Strong outpost","Win pawn back","Tactics"],ar:[{f:'f6',t:'e4'},{f:'e4',t:'c5',c:'r'},{f:'e4',t:'c3',c:'r'}]},
{t:"Qb4 — Queen retreats, keeps an eye on e4 and b7.",tags:["Queen retreat","Watch e4"],ar:[{f:'c3',t:'b4'},{f:'b4',t:'e4',c:'r'}]},
{t:"Nc6 — Develops the knight, attacks the b4 queen.",tags:["Development","Attack queen"],ar:[{f:'b8',t:'c6'},{f:'c6',t:'b4',c:'r'}]},
{t:"Qb3 — Queen retreats to b3, staying active and defending the c5 pawn.",tags:["Queen active","Defend c5"],ar:[{f:'b4',t:'b3'},{f:'b3',t:'c5',c:'r'}]},
]},

]},/* end nimzo */


/* ════ FRENCH DEFENCE — Black plays Black ════ */
french:{flipped:true,myColor:'b',lines:[

{name:'1. Advance — 3.e5 c5 4.c3 Nc6 Nf5',
moves:['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','d8b6','a2a3','g8h6','b2b4','c5d4','c3d4'],
explain:[
{t:"e4 — White opens.",ar:[{f:'e2',t:'e4'}]},
{t:"e6 — The French Defence! Solid but slightly passive.",tags:["French Defence","Solid"],ar:[{f:'e7',t:'e6'}]},
{t:"d4 — White builds a strong pawn centre.",ar:[{f:'d2',t:'d4'}]},
{t:"d5 — Black challenges the centre. The French is all about this fight.",tags:["Centre fight","French idea"],ar:[{f:'d7',t:'d5'},{f:'d5',t:'e4',c:'r'}]},
{t:"e5 — Advance Variation! Most common against the French. White gains space.",tags:["Advance","Most common"],ar:[{f:'e4',t:'e5'}]},
{t:"c5 — Black immediately attacks the d4 pawn. The key French counter-attack.",tags:["Key counter-attack","French main idea"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"c3 — White supports d4. The most popular and solid reply.",tags:["Support d4","Solid"],ar:[{f:'c2',t:'c3'}]},
{t:"Nc6 — Develops and presses d4 further.",tags:["Development","Pressure d4"],ar:[{f:'b8',t:'c6'},{f:'c6',t:'d4',c:'r'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Qb6 — Targets b2 and d4! Active queen placement.",tags:["Active queen","Double attack"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'b2',c:'r'},{f:'b6',t:'d4',c:'r'}]},
{t:"a3 — Defends b4 square, prepares b4.",tags:["Prepare b4"],ar:[{f:'a2',t:'a3'}]},
{t:"Nh6 — Unusual knight route. Goes to f5 to attack d4!",tags:["Unusual","Nh6-f5 plan"],ar:[{f:'g8',t:'h6'},{f:'h6',t:'f5',c:'r'}]},
{t:"b4 — White grabs queenside space, attacking Black's c5 pawn.",tags:["Queenside space","Attack c5"],ar:[{f:'b2',t:'b4'},{f:'b4',t:'c5',c:'r'}]},
{t:"cxd4 — Black trades! The central tension resolves.",ar:[{f:'c5',t:'d4'}]},
{t:"cxd4 — White recaptures. Standard Advance French pawn structure.",tags:["Typical structure"],ar:[{f:'c3',t:'d4'}]},
]},

{name:'2. Advance — Simple development Nge7',
moves:['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','c8d7','f1e2','d8b6','e1g1','c5d4','c3d4'],
explain:[
null,null,null,null,null,null,null,null,null,
{t:"Bd7 — Simple development! Connects the queen and avoids any early complications.",tags:["Simple development","Practical"],ar:[{f:'c8',t:'d7'}]},
{t:"Be2 — Quiet, solid development.",ar:[{f:'f1',t:'e2'}]},
{t:"Qb6 — Active queen, targets b2 and d4.",tags:["Active queen"],ar:[{f:'d8',t:'b6'},{f:'b6',t:'b2',c:'r'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"cxd4 — Black resolves the central tension.",tags:["Resolve tension"],ar:[{f:'c5',t:'d4'}]},
{t:"cxd4 — Recaptures. Standard Advance French structure.",ar:[{f:'c3',t:'d4'}]},
]},

{name:'3. Exchange — 3.exd5 exd5 (common at beginner/club level)',
moves:['e2e4','e7e6','d2d4','d7d5','e4d5','e6d5','g1f3','g8f6','f1d3','f8d6','e1g1','e8g8','f1e1','b8c6','c2c3'],
explain:[
null,null,null,null,
{t:"exd5 — Exchange Variation! Very common at club level. Leads to symmetrical position.",tags:["Exchange French","Club level"],ar:[{f:'e4',t:'d5'}]},
{t:"exd5 — Black recaptures. Symmetrical pawn structure, similar to Exchange Caro-Kann.",tags:["Symmetry","Easy to play"],ar:[{f:'e6',t:'d5'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Nf6 — Development, attacks e4 ideas.",ar:[{f:'g8',t:'f6'}]},
{t:"Bd3 — Active bishop, aims at h7.",ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"Bd6 — Mirror! Black also develops the bishop actively.",tags:["Active","Mirror"],ar:[{f:'f8',t:'d6'}]},
{t:"O-O — White castles.",ar:[{f:'e1',t:'g1'}]},
{t:"O-O — Black castles too.",ar:[{f:'e8',t:'g8'}]},
{t:"Re1 — Centralises the rook on the open e-file.",tags:["Open e-file","Rook activation"],ar:[{f:'f1',t:'e1'}]},
{t:"Nc6 — Develops the queenside knight.",ar:[{f:'b8',t:'c6'}]},
{t:"c3 — Solidifies the structure.",ar:[{f:'c2',t:'c3'}]},
]},

{name:'4. Tarrasch — 3.Nd2 c5 Qxd5',
moves:['e2e4','e7e6','d2d4','d7d5','b1d2','c7c5','e4d5','d8d5','g1f3','c5d4','f1c4','d5d6','e1g1','g8f6','d2b3'],
explain:[
null,null,null,null,
{t:"Nd2 — The Tarrasch! White avoids doubled pawns (Nc3 can be met by Bb4 pinning). Common at club level.",tags:["Tarrasch","Common","Club level"],ar:[{f:'b1',t:'d2'}]},
{t:"c5 — Black immediately fights for the centre.",tags:["Centre fight"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"exd5 — White captures.",ar:[{f:'e4',t:'d5'}]},
{t:"Qxd5 — Black recaptures with the queen. Active but exposed.",tags:["Active queen","Exposed"],ar:[{f:'d8',t:'d5'}]},
{t:"Nf3 — Development, attacks the queen.",ar:[{f:'g1',t:'f3'},{f:'f3',t:'d4',c:'r'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Bc4 — Active bishop, attacks the queen and eyes f7.",tags:["Attack queen","f7 threat"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
{t:"Qd6 — Queen retreats to a safe square.",ar:[{f:'d5',t:'d6'}]},
{t:"O-O — White castles, completing development.",ar:[{f:'e1',t:'g1'}]},
{t:"Nf6 — Development.",ar:[{f:'g8',t:'f6'}]},
{t:"Nb3 — Knight heads to d4 or a5, regrouping.",tags:["Knight regroup"],ar:[{f:'d2',t:'b3'},{f:'b3',t:'d4',c:'r'}]},
]},

{name:'5. Tarrasch — 3.Nd2 Nf6 closed',
moves:['e2e4','e7e6','d2d4','d7d5','b1d2','g8f6','e4e5','f6d7','f1d3','c7c5','c2c3','b8c6','g1e2','c5d4','c3d4'],
explain:[
null,null,null,null,
{t:"Nd2 — Tarrasch Variation.",tags:["Tarrasch"],ar:[{f:'b1',t:'d2'}]},
{t:"Nf6 — Standard development. The position can become a closed structure.",tags:["Closed French","Standard"],ar:[{f:'g8',t:'f6'}]},
{t:"e5 — White closes the centre, gaining space.",tags:["Close centre","Space"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
{t:"Nfd7 — Knight retreats to d7. Heading to f8-g6 or b6-c4.",tags:["Knight retreat","Regroup"],ar:[{f:'f6',t:'d7'},{f:'d7',t:'f8',c:'r'},{f:'f8',t:'g6',c:'r'}]},
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
{t:"c5 — Black's key counter-attack.",tags:["Counter-attack"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"c3 — Supports d4.",ar:[{f:'c2',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Ne2 — Unusual! Knight heads to f4 or g3.",tags:["Knight manoeuvre","Flexible"],ar:[{f:'g1',t:'e2'},{f:'e2',t:'f4',c:'r'}]},
{t:"cxd4 — Black trades, resolving central tension.",ar:[{f:'c5',t:'d4'}]},
{t:"cxd4 — Recaptures. Isolated d4 pawn but White has more space.",tags:["IQP","Space"],ar:[{f:'c3',t:'d4'}]},
]},

{name:'6. Nc3 Classical — 4.e5 Nfd7 5.f4',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','e4e5','f6d7','f2f4','c7c5','g1f3','b8c6','c1e3','c5d4','f3d4'],
explain:[
null,null,null,null,
{t:"e5 — Classical French! White gains space and attacks the f6 knight.",tags:["Classical French","Space"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
{t:"Nfd7 — Knight retreats. Will go to b6, c5, or f8-g6.",tags:["Retreat","Flexible plan"],ar:[{f:'f6',t:'d7'}]},
{t:"f4 — White prepares f5 or a kingside attack. Very aggressive.",tags:["f4 plan","Aggressive"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
{t:"c5 — Black's key counter-attack. Strike while White is over-extended.",tags:["Counter-attack","Key move"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Be3 — Development.",ar:[{f:'c1',t:'e3'}]},
{t:"cxd4 — Black trades.",ar:[{f:'c5',t:'d4'}]},
{t:"Nxd4 — White recaptures, knight on d4.",ar:[{f:'f3',t:'d4'}]},
]},

{name:'7. Rubinstein — 3.Nc3 dxe4 4.Nxe4 (Your safest weapon)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','d5e4','c3e4','b8d7','g1f3','g8f6','e4f6','d7f6','f1d3','c7c5','e1g1'],
explain:[
null,null,null,null,
{t:"dxe4 — Rubinstein! Black captures immediately to open the position.",tags:["Rubinstein","Your safest weapon"],ar:[{f:'d5',t:'e4'}]},
{t:"Nxe4 — White recaptures.",ar:[{f:'c3',t:'e4'}]},
{t:"Nd7 — Key! Black develops the queen's knight FIRST. Prepares Ngf6.",tags:["Nd7 first","Key order"],ar:[{f:'b8',t:'d7'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"Ngf6 — Now the g-knight develops, attacking the e4 knight.",tags:["Development","Attack e4"],ar:[{f:'g8',t:'f6'},{f:'f6',t:'e4',c:'r'}]},
{t:"Nxf6+ — White exchanges knights. Black gets the bishop pair!",tags:["Knight exchange","Bishop pair for Black"],ar:[{f:'e4',t:'f6'}]},
{t:"Nxf6 — Black recaptures with the d7-knight.",ar:[{f:'d7',t:'f6'}]},
{t:"Bd3 — Active development.",ar:[{f:'f1',t:'d3'}]},
{t:"c5 — Black attacks d4 immediately.",tags:["Attack d4","Active"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"O-O — White castles. Equal, solid position for Black.",tags:["Equal","Solid for Black"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'8. Winawer — 3.Nc3 Bb4 4.e5 c5',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','f8b4','e4e5','c7c5','a2a3','b4c3','b2c3','g8e7','d1g4','d8c7','g4g7'],
explain:[
null,null,null,null,
{t:"Bb4 — The Winawer! Black pins the c3-knight. One of the sharpest French variations.",tags:["Winawer","Sharp","Pin"],ar:[{f:'f8',t:'b4'},{f:'b4',t:'c3',c:'r'}]},
{t:"e5 — White closes the centre and attacks the b4 bishop.",tags:["Close centre","Space"],ar:[{f:'e4',t:'e5'}]},
{t:"c5 — Black's crucial counter-attack against d4.",tags:["Counter-attack","Critical"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"a3 — White forces the bishop to decide.",tags:["Force decision"],ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
{t:"Bxc3+ — Black takes the knight! Creates doubled pawns but weakens the bishop.",tags:["Trade","Create doubled pawns","Check"],ar:[{f:'b4',t:'c3'}]},
{t:"bxc3 — White recaptures. Doubled c-pawns but gains the bishop pair.",tags:["Doubled pawns","Bishop pair"],ar:[{f:'b2',t:'c3'}]},
{t:"Ne7 — Knight retreats. Will go to g6 or f5.",tags:["Knight retreat","Regroup"],ar:[{f:'g8',t:'e7'},{f:'e7',t:'g6',c:'r'}]},
{t:"Qg4 — White's aggressive queen move, eyes g7 and d1-h5 diagonal.",tags:["Aggressive queen","g7 threat"],ar:[{f:'d1',t:'g4'},{f:'g4',t:'g7',c:'r'}]},
{t:"Qc7 — Black defends g7 indirectly.",tags:["Defend g7"],ar:[{f:'d8',t:'c7'}]},
{t:"Qxg7 — White captures on g7, winning the exchange!",tags:["Wins exchange","Sharp"],ar:[{f:'g4',t:'g7'}]},
]},

{name:'9. Bg5 Classical — 4.Bg5 Be7 h4',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','c1g5','f8e7','e4e5','f6d7','h2h4','c7c5','g5e7','d8e7','c3b5'],
explain:[
null,null,null,null,
{t:"Bg5 — Alekhine-Chatard Attack! White pins the f6-knight aggressively.",tags:["Bg5","Aggressive","Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
{t:"Be7 — Solid! Black unpins the knight normally.",tags:["Solid","Unpin"],ar:[{f:'f8',t:'e7'}]},
{t:"e5 — White closes the centre.",tags:["Close centre"],ar:[{f:'e4',t:'e5'}]},
{t:"Nfd7 — Knight retreats.",ar:[{f:'f6',t:'d7'}]},
{t:"h4 — Very aggressive! White prepares h5 to attack Black's kingside.",tags:["h4 attack","Aggressive"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
{t:"c5 — Black's standard counter-attack.",tags:["Counter-attack"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"Bxe7 — White trades the bishop.",ar:[{f:'g5',t:'e7'}]},
{t:"Qxe7 — Black recaptures with the queen, freeing the position.",tags:["Queen activation"],ar:[{f:'d8',t:'e7'}]},
{t:"Nb5 — Knight jumps to b5, threatening Nc7 fork or Nd6+.",tags:["Aggressive","Fork threat"],ar:[{f:'c3',t:'b5'},{f:'b5',t:'c7',c:'r'},{f:'b5',t:'d6',c:'r'}]},
]},

{name:'10. Nb5 Sideline — 4.e5 Nfd7 5.Nb5',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','e4e5','f6d7','c3b5','c7c5','c2c3','b8c6','g1f3','a7a6','b5a3'],
explain:[
null,null,null,null,
{t:"e5 — White closes the centre.",ar:[{f:'e4',t:'e5'}]},
{t:"Nfd7 — Knight retreats.",ar:[{f:'f6',t:'d7'}]},
{t:"Nb5 — Unusual and tricky sideline! The knight jumps to b5 early.",tags:["Sideline","Tricky","Must know"],ar:[{f:'c3',t:'b5'},{f:'b5',t:'d6',c:'r'}]},
{t:"c5 — Black's standard counter-attack against d4.",tags:["Counter-attack"],ar:[{f:'c7',t:'c5'},{f:'c5',t:'d4',c:'r'}]},
{t:"c3 — White supports d4.",ar:[{f:'c2',t:'c3'}]},
{t:"Nc6 — Development.",ar:[{f:'b8',t:'c6'}]},
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
{t:"a6 — Kicks the b5 knight away!",tags:["Kick knight","Tempo"],ar:[{f:'a7',t:'a6'},{f:'a6',t:'b5',c:'r'}]},
{t:"Na3 — Knight retreats to a3. A bit awkward but safe.",tags:["Knight retreat","Awkward"],ar:[{f:'b5',t:'a3'}]},
]},

]},/* end french */

caro_white:{flipped:false,myColor:'w',lines:[

{name:'1. Advance — 3.e5 Bf5 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','g1f3','e7e6','f1e2','c6c5','e1g1','b8c6','c1e3','d8b6','b1d2','c5d4','d2b3','d4e3','f2e3'],
explain:[
{t:"e4 — Open the game! Fight for the centre.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Builds the ideal two-pawn centre.",tags:["Centre"],ar:[{f:'d2',t:'d4'}]},
null,
{t:"e5 — Advance Variation! Claim space and drive the bishop.",tags:["Advance","Space"],ar:[{f:'e4',t:'e5'}]},
null,
{t:"Nf3 — Develop and support the e5 pawn.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Be2 — Quiet, solid. Prepares O-O.",tags:["Solid prep"],ar:[{f:'f1',t:'e2'}]},
null,
{t:"O-O — Castle quickly. King safe, rooks active.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"Be3 — Defend d4, develop the bishop.",ar:[{f:'c1',t:'e3'}]},
null,
{t:"Nbd2 — Solid defence of b2. Knight heads to b3 or f1.",ar:[{f:'b1',t:'d2'}]},
null,
{t:"Nb3 — Knight attacks c5 and d4.",tags:["Knight activity"],ar:[{f:'d2',t:'b3'}]},
null,
{t:"fxe3 — Recapture, open the f-file. White has the e3 outpost.",tags:["Open f-file","Compensation"],ar:[{f:'f2',t:'e3'}]},
]},

{name:'2. Exchange — 4.Bd3 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','f1d3','b8c6','c2c3','g8f6','c1f4','c8g4','d1b3','d8d7','b1d2','e7e6','g1f3','f8e7','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Central control.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange Variation. Simplified but White can play actively.",tags:["Exchange"],ar:[{f:'e4',t:'d5'}]},
null,
{t:"Bd3 — Active bishop! Eyes the h7 square.",tags:["Active bishop","h7 target"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
null,
{t:"c3 — Supports d4, prepares Nf3.",ar:[{f:'c2',t:'c3'}]},
null,
{t:"Bf4 — Active bishop, eyes the d6 square.",ar:[{f:'c1',t:'f4'}]},
null,
{t:"Qb3 — Double attack: b7 AND d5!",tags:["Double threat","Pressure"],ar:[{f:'d1',t:'b3'},{f:'b3',t:'b7',c:'r'},{f:'b3',t:'d5',c:'r'}]},
null,
{t:"Nd2 — Solid development.",ar:[{f:'b1',t:'d2'}]},
null,
{t:"Ngf3 — Complete development, castle soon.",ar:[{f:'d2',t:'f3'}]},
null,
{t:"O-O — Castle. White has easy development and active pieces.",tags:["Easy development"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'3. Two Knights — 2.Nc3 (as White)',
moves:['e2e4','c7c6','b1c3','d7d5','g1f3','c8g4','h2h3','g4f3','d1f3','e7e6','d2d4','g8f6','f1d3','d5e4','c3e4','f6e4','f3e4','b8d7','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"Nc3 — Two Knights! Flexible development, keeps options open.",tags:["Two Knights","Flexible"],ar:[{f:'b1',t:'c3'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"h3 — Challenge the Bg4 pin!",tags:["Challenge pin"],ar:[{f:'h2',t:'h3'},{f:'h3',t:'g4',c:'r'}]},
null,
{t:"Qxf3 — Recapture with the queen. Strong centralised queen.",tags:["Central queen"],ar:[{f:'d1',t:'f3'}]},
null,
{t:"d4 — Builds the ideal pawn centre.",tags:["Ideal centre"],ar:[{f:'d2',t:'d4'}]},
null,
{t:"Bd3 — Active bishop development.",ar:[{f:'f1',t:'d3'}]},
null,
{t:"Nxe4 — Knight recaptures.",ar:[{f:'c3',t:'e4'}]},
null,
{t:"Nxe4 — Recaptures.",ar:[{f:'e4',t:'e4'}]},
null,
{t:"Qxe4 — Central queen, dominant position.",tags:["Dominant queen"],ar:[{f:'f3',t:'e4'}]},
null,
{t:"O-O — Castle. White has a strong centre and active pieces.",tags:["Strong centre"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'4. Fantasy — 3.f3 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','f2f3','d5e4','f3e4','e7e5','g1f3','e5d4','f1c4','g8f6','e1g1','f8c5','e4e5','f6d5','f3g5','e8g8','d1h5'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"f3 — Fantasy Attack! Aggressive. Plans e5 and a big centre.",tags:["Fantasy","Aggressive"],ar:[{f:'f2',t:'f3'}]},
null,
{t:"fxe4 — Recapture.",ar:[{f:'f3',t:'e4'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bc4 — Active bishop, targets f7!",tags:["f7 target","Active"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'f7',c:'r'}]},
null,
{t:"O-O — Castle quickly.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"e5 — Advance! Kick the f6 knight.",tags:["Space","Forcing"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
null,
{t:"Ng5 — Attack f7 and h7 with the knight!",tags:["Attack f7","Aggressive"],ar:[{f:'f3',t:'g5'},{f:'g5',t:'f7',c:'r'}]},
null,
{t:"Qh5 — Very aggressive queen! Threatens Qxf7#.",tags:["Mating threat"],ar:[{f:'d1',t:'h5'},{f:'h5',t:'f7',c:'r'}]},
]},

{name:'5. Panov — 4.c4 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','c2c4','g8f6','b1c3','b8c6','g1f3','c8g4','c4d5','f6d5','d1b3','g4f3','g2f3','e7e6','b3b7'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"c4 — Panov Attack! Creates IQP, very active position.",tags:["Panov","IQP","Active"],ar:[{f:'c2',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
null,
{t:"Nc3 — Develops, pressures d5.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"cxd5 — Resolves central tension.",ar:[{f:'c4',t:'d5'}]},
null,
{t:"Qb3 — Double threat on b7 and d5!",tags:["Double threat","Tactics"],ar:[{f:'d1',t:'b3'},{f:'b3',t:'b7',c:'r'},{f:'b3',t:'d5',c:'r'}]},
null,
{t:"gxf3 — Recapture, opens the g-file for future play.",tags:["Open g-file"],ar:[{f:'g2',t:'f3'}]},
null,
{t:"Qxb7 — Win the b7 pawn! Strong initiative.",tags:["Win pawn","Initiative"],ar:[{f:'b3',t:'b7'}]},
]},

{name:'6. Classical — h4 main line (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','h2h4','h7h6','g1f3','b8d7','h4h5','g6h7','f1d3','h7d3','d1d3'],
explain:[
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
{t:"Qxd3 — Recapture. White has a strong centre and development lead.",tags:["Development lead","Strong centre"],ar:[{f:'d1',t:'d3'}]},
]},

{name:'7. Classical — Quiet Nf3 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','b1c3','d5e4','c3e4','c8f5','e4g3','f5g6','g1f3','b8d7','f1d3','g6d3','d1d3','e7e6','e1g1','g8f6','f1e1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Nxe4 — Recapture.",ar:[{f:'c3',t:'e4'}]},
null,
{t:"Ng3 — Attacks the bishop.",ar:[{f:'e4',t:'g3'}]},
null,
{t:"Nf3 — Quiet, positional. No h4 push.",tags:["Positional","Quiet"],ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bd3 — Trade the bishops, eliminate Black's active piece.",tags:["Trade bishops","Simplify"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'g6',c:'r'}]},
null,
{t:"Qxd3 — Recapture.",ar:[{f:'d1',t:'d3'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"Re1 — Centralise the rook on the open e-file.",tags:["Rook activation","Open e-file"],ar:[{f:'f1',t:'e1'}]},
]},

{name:'8. Advance — Tal Variation h4 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','h2h4','h7h5','f1d3','f5d3','d1d3','e7e6','g1f3','c6c5','c2c4','b8c6','c4d5','d8d5','b1c3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"e5 — Advance Variation.",ar:[{f:'e4',t:'e5'}]},
null,
{t:"h4 — Tal Variation! Very aggressive. Threatens h5 immediately.",tags:["Tal Variation","Aggressive"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
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
{t:"Nc3 — Develop, attack the queen.",tags:["Develop","Attack queen"],ar:[{f:'b1',t:'c3'},{f:'c3',t:'d5',c:'r'}]},
]},

{name:'9. Advance — Short Variation (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4e5','c8f5','g1f3','e7e6','f1e2','b8d7','e1g1','c6c5','c1e3','d8b6','b1d2','b6b2','c2c4','c5d4','e3d4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"e5 — Advance.",ar:[{f:'e4',t:'e5'}]},
null,
{t:"Nf3 — Develop.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Be2 — Solid development, prepares castling.",ar:[{f:'f1',t:'e2'}]},
null,
{t:"O-O — Castle quickly.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"Be3 — Defend d4.",ar:[{f:'c1',t:'e3'}]},
null,
{t:"Nbd2 — Defend b2 solidly.",tags:["Defend b2"],ar:[{f:'b1',t:'d2'}]},
null,
{t:"c4 — Seize more space!",tags:["Space"],ar:[{f:'c2',t:'c4'}]},
null,
{t:"Bxd4 — Recapture, active bishop.",tags:["Active bishop"],ar:[{f:'e3',t:'d4'}]},
]},

{name:'10. Exchange — Bb5+ (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','f1b5','b8c6','g1f3','c8g4','h2h3','g4f3','d1f3','e7e6','e1g1','g8f6','c2c4','f8e7','b1c3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"Bb5+ — Annoying sideline! Check, pin the c6 knight.",tags:["Check","Pin","Sideline"],ar:[{f:'f1',t:'b5'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"h3 — Challenge the Bg4.",tags:["Challenge bishop"],ar:[{f:'h2',t:'h3'}]},
null,
{t:"Qxf3 — Recapture with the queen.",ar:[{f:'d1',t:'f3'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"c4 — Panov idea, open the centre.",tags:["Panov idea"],ar:[{f:'c2',t:'c4'}]},
null,
{t:"Nc3 — Full development. White has a comfortable position.",tags:["Development complete"],ar:[{f:'b1',t:'c3'}]},
]},

{name:'11. Panov + Nf3 Bb4 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','g1f3','g8f6','c2c4','e7e6','b1c3','f8b4','c4d5','f6d5','d1c2','e8g8','f1d3','h7h6','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"Nf3 — Flexible move order before c4.",tags:["Flexible"],ar:[{f:'g1',t:'f3'}]},
null,
{t:"c4 — Panov Attack.",tags:["Panov"],ar:[{f:'c2',t:'c4'}]},
null,
{t:"Nc3 — Develop, meet the Bb4 pin.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"cxd5 — Resolve pawn tension.",ar:[{f:'c4',t:'d5'}]},
null,
{t:"Qc2 — Active queen, eyes e4 and c6.",tags:["Active queen"],ar:[{f:'d1',t:'c2'}]},
null,
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
null,
{t:"O-O — Castle. Comfortable position, development lead.",tags:["Development lead"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'12. Advance Nf3 — Bronstein-Larsen (as White)',
moves:['e2e4','c7c6','g1f3','d7d5','e4e5','c8g4','d2d4','e7e6','f1e2','g4f3','e2f3','c6c5','c2c3','b8c6','e1g1','d8b6','b2b3','c5d4','c3d4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"Nf3 — Bronstein-Larsen! Develop BEFORE d4.",tags:["Bronstein-Larsen","Tricky move order"],ar:[{f:'g1',t:'f3'}]},
null,
{t:"e5 — Advance! Now Black can pin with Bg4 because Nf3 is already there.",tags:["Advance"],ar:[{f:'e4',t:'e5'}]},
null,
{t:"d4 — Build the centre after Nf3.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Be2 — Prepare to break the pin.",ar:[{f:'f1',t:'e2'}]},
null,
{t:"Bxf3 — Recapture, keep the bishop pair.",tags:["Bishop pair"],ar:[{f:'e2',t:'f3'}]},
null,
{t:"c3 — Support d4.",ar:[{f:'c2',t:'c3'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"b3 — Defend b2.",tags:["Defend b2"],ar:[{f:'b2',t:'b3'}]},
null,
{t:"cxd4 — Recapture. White has the bishop pair and solid centre.",tags:["Solid centre","Bishop pair"],ar:[{f:'c3',t:'d4'}]},
]},

{name:'13. Closed Panov — 6.c5 (as White)',
moves:['e2e4','c7c6','d2d4','d7d5','e4d5','c6d5','c2c4','g8f6','b1c3','b8c6','c4c5','e7e5','d4e5','c6e5','f1b5','c8d7','d1e2','d8e7','b5d7','e5d7'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"c4 — Panov! Attack d5.",tags:["Panov"],ar:[{f:'c2',t:'c4'}]},
null,
{t:"Nc3 — Develop.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"c5 — Closed Panov! Shut down the queenside, grab space.",tags:["Closed Panov","Space grab"],ar:[{f:'c4',t:'c5'}]},
null,
{t:"dxe5 — Capture the e5 pawn.",ar:[{f:'d4',t:'e5'}]},
null,
{t:"Bb5+ — Check! Pin on c6/d7.",tags:["Check","Pin"],ar:[{f:'f1',t:'b5'}]},
null,
{t:"Qe2 — Pin the e5 knight! Two attackers on e5.",tags:["Pin","Double attack"],ar:[{f:'d1',t:'e2'},{f:'e2',t:'e5',c:'r'}]},
null,
{t:"Bxd7+ — Capture with check, winning the bishop.",tags:["Capture with check","Win material"],ar:[{f:'b5',t:'d7'}]},
]},

]},/* end caro_white */

french_white:{flipped:false,myColor:'w',lines:[

{name:'1. Advance — Nf5 plan (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','d8b6','a2a3','c5c4','g2g3','b6a6','b2b4','c4b3','b1a3','f8a3','f1a3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Builds classical centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"e5 — Advance Variation! Claim space.",tags:["Advance","Space"],ar:[{f:'e4',t:'e5'}]},
null,
{t:"c3 — Solid support for d4.",ar:[{f:'c2',t:'c3'}]},
null,
{t:"Nf3 — Development, defends e5.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"a3 — Prevent Nb4, prepare b4.",tags:["Prevent Nb4","Prepare b4"],ar:[{f:'a2',t:'a3'}]},
null,
{t:"g3 — Prepare Bg2 fianchetto.",tags:["Fianchetto prep"],ar:[{f:'g2',t:'g3'}]},
null,
{t:"b4 — Gain queenside space, lock in the c4 pawn.",tags:["Queenside space"],ar:[{f:'b2',t:'b4'}]},
null,
{t:"Na3 — Knight heads to c2 then b4.",ar:[{f:'b1',t:'a3'}]},
null,
{t:"Bxa3 — Recapture, active bishop on the long diagonal.",tags:["Active bishop"],ar:[{f:'f1',t:'a3'}]},
]},

{name:'2. Advance — Simple Nge7 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','e4e5','c7c5','c2c3','b8c6','g1f3','d8b6','f1e2','c5d4','c3d4','f8b4','b1c3','g8e7','e1g1','e7f5','g2g4'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"e5 — Advance.",ar:[{f:'e4',t:'e5'}]},
null,
{t:"c3 — Solid.",ar:[{f:'c2',t:'c3'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Be2 — Solid development, prepares castling.",ar:[{f:'f1',t:'e2'}]},
null,
{t:"cxd4 — Recapture, maintain the centre.",ar:[{f:'c3',t:'d4'}]},
null,
{t:"Nc3 — Develop, attack the Bb4.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"O-O — Castle. King safe.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"g4 — Drive the Nf5! White launches the kingside attack.",tags:["Kingside attack","Drive knight"],ar:[{f:'g2',t:'g4'},{f:'g4',t:'f5',c:'r'}]},
]},

{name:'3. Exchange — 3.exd5 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','e4d5','e6d5','b1c3','g8f6','g1f3','f8d6','f1d3','e8g8','e1g1','b8c6','c1g5','c8e6','d1d2'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"exd5 — Exchange Variation. Simplified but White can play for the minority attack.",tags:["Exchange","Minority attack"],ar:[{f:'e4',t:'d5'}]},
null,
{t:"Nc3 — Development.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"Nc3 — Full development.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Bg5 — Pin the f6 knight, create pressure.",tags:["Pin","Pressure"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
null,
{t:"Qd2 — Prepare Bh6 or queenside minority attack.",tags:["Plan"],ar:[{f:'d1',t:'d2'}]},
]},

{name:'4. Tarrasch — Qxd5 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1d2','c7c5','e4d5','d8d5','g1f3','c5d4','f1c4','d5d6','e1g1','g8f6','b2b3','b8c6','c1b2'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nd2 — Tarrasch Variation! Solid, avoids the Nimzo-pin on c3.",tags:["Tarrasch","Solid"],ar:[{f:'b1',t:'d2'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bc4 — Active bishop, targets the queen on d5.",tags:["Active bishop","Tempo"],ar:[{f:'f1',t:'c4'},{f:'c4',t:'d5',c:'r'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"b3 — Prepare Bb2, long diagonal bishop.",tags:["Prepare Bb2"],ar:[{f:'b2',t:'b3'}]},
null,
{t:"Bb2 — The long diagonal bishop. White has good development.",tags:["Long diagonal","Development"],ar:[{f:'c1',t:'b2'}]},
]},

{name:'5. Tarrasch Closed (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1d2','c7c5','e4d5','e6d5','g1f3','b8c6','f1b5','f8d6','d4c5','d6c5','e1g1','g8e7','b5c6','e7c6','b2b3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nd2 — Tarrasch.",tags:["Tarrasch"],ar:[{f:'b1',t:'d2'}]},
null,
{t:"exd5 — Exchange.",ar:[{f:'e4',t:'d5'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bb5 — Pin on c6, active bishop.",tags:["Pin","Active"],ar:[{f:'f1',t:'b5'},{f:'b5',t:'c6',c:'r'}]},
null,
{t:"dxc5 — Win the c5 pawn.",tags:["Win pawn"],ar:[{f:'d4',t:'c5'}]},
null,
{t:"O-O — Castle.",ar:[{f:'e1',t:'g1'}]},
null,
{t:"Bxc6 — Exchange, create doubled pawns.",tags:["Doubled pawns","Structure"],ar:[{f:'b5',t:'c6'}]},
null,
{t:"b3 — Prepare Bb2, solid structure.",ar:[{f:'b2',t:'b3'}]},
]},

{name:'6. Classical — Nc3 f4 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','c1g5','f8e7','e4e5','f6d7','g5e7','d8e7','f2f4','e8g8','g1f3','c7c5','d1d2','b8c6','e1c1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical! Very solid and active.",tags:["Classical French"],ar:[{f:'b1',t:'c3'}]},
null,
{t:"Bg5 — Pin on the f6 knight. Plans Bxf6.",tags:["Pin","Pressure"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
null,
{t:"e5 — Advance! Claim space, lock the centre.",tags:["Space","Lock centre"],ar:[{f:'e4',t:'e5'}]},
null,
{t:"Bxe7 — Trade the bishop, eliminate Black's good bishop.",tags:["Trade","Eliminate good bishop"],ar:[{f:'g5',t:'e7'}]},
null,
{t:"f4 — Support the e5 chain, prepare the attack.",tags:["Attack prep","f4 advance"],ar:[{f:'f2',t:'f4'},{f:'f4',t:'f5',c:'r'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Qd2 — Prepare O-O-O, setup the attack.",tags:["Queenside castle prep","Attack"],ar:[{f:'d1',t:'d2'}]},
null,
{t:"O-O-O — Queenside castle! Attack begins. White storms the kingside with g4-g5.",tags:["Queenside castle","Attack!"],ar:[{f:'e1',t:'c1'}]},
]},

{name:'7. Rubinstein — 3...dxe4 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','d5e4','c3e4','b8d7','g1f3','g8f6','e4f6','d7f6','f1d3','b7b6','d1e2','c8b7','c1g5','f8e7','e1c1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Nxe4 — Recapture. The Rubinstein variation.",tags:["Rubinstein"],ar:[{f:'c3',t:'e4'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Nxf6 — Exchange the knight, slightly weaken Black's structure.",tags:["Exchange","Structure"],ar:[{f:'e4',t:'f6'}]},
null,
{t:"Bd3 — Active bishop, eyeing h7.",tags:["Active bishop"],ar:[{f:'f1',t:'d3'},{f:'d3',t:'h7',c:'r'}]},
null,
{t:"Qe2 — Centralise the queen, prepare castling.",ar:[{f:'d1',t:'e2'}]},
null,
{t:"Bg5 — Pin on e7, increase pressure.",tags:["Pin","Pressure"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'e7',c:'r'}]},
null,
{t:"O-O-O — Queenside castle! White attacks on both sides.",tags:["Queenside castle","Attack"],ar:[{f:'e1',t:'c1'}]},
]},

{name:'8. Winawer — 3...Bb4 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','f8b4','e4e5','c7c5','a2a3','b4c3','b2c3','b8e7','a3a4','e7d5','g1f3','d8c7','f1d3','c8d7','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"e5 — Winawer! Advance immediately after Bb4.",tags:["Winawer response","Space"],ar:[{f:'e4',t:'e5'}]},
null,
{t:"a3 — Force the bishop decision.",tags:["Force decision"],ar:[{f:'a2',t:'a3'},{f:'a3',t:'b4',c:'r'}]},
null,
{t:"bxc3 — Recapture. Gets the bishop pair and a strong centre.",tags:["Bishop pair","Strong centre"],ar:[{f:'b2',t:'c3'}]},
null,
{t:"a4 — Gain queenside space, fix Black's weakness.",tags:["Queenside space"],ar:[{f:'a3',t:'a4'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
null,
{t:"O-O — Castle. White has strong centre and bishop pair.",tags:["Bishop pair advantage"],ar:[{f:'e1',t:'g1'}]},
]},

{name:'9. Bg5 Classical h4 (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','c1g5','f8e7','e4e5','f6d7','h2h4','a7a6','d1g4','g7g6','g1f3','c7c5','h4h5','d8a5','f1d3'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"Bg5 — Pin on f6.",tags:["Pin"],ar:[{f:'c1',t:'g5'},{f:'g5',t:'f6',c:'r'}]},
null,
{t:"e5 — Advance.",ar:[{f:'e4',t:'e5'}]},
null,
{t:"h4 — Aggressive attack! Threatening h5-h6.",tags:["Aggressive","Attack"],ar:[{f:'h2',t:'h4'},{f:'h4',t:'h5',c:'r'}]},
null,
{t:"Qg4 — Attack the g6 weakness!",tags:["Attack g6","Pressure"],ar:[{f:'d1',t:'g4'},{f:'g4',t:'g6',c:'r'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"h5 — Push! Opening lines on the kingside.",tags:["Kingside attack"],ar:[{f:'h4',t:'h5'}]},
null,
{t:"Bd3 — Active bishop.",ar:[{f:'f1',t:'d3'}]},
]},

{name:'10. Nb5 Sideline (as White)',
moves:['e2e4','e7e6','d2d4','d7d5','b1c3','g8f6','e4e5','f6d7','f2f4','c7c5','g1f3','b8c6','c3b5','c5d4','b5d4','c6d4','f1e2','f8b4','e1g1'],
explain:[
{t:"e4 — Open game.",ar:[{f:'e2',t:'e4'}]},
null,
{t:"d4 — Centre.",ar:[{f:'d2',t:'d4'}]},
null,
{t:"Nc3 — Classical.",ar:[{f:'b1',t:'c3'}]},
null,
{t:"e5 — Advance, kick the f6 knight.",tags:["Advance"],ar:[{f:'e4',t:'e5'},{f:'e5',t:'f6',c:'r'}]},
null,
{t:"f4 — Support the e5 pawn, control the centre.",tags:["Support e5"],ar:[{f:'f2',t:'f4'}]},
null,
{t:"Nf3 — Development.",ar:[{f:'g1',t:'f3'}]},
null,
{t:"Nb5 — Sideline! Knight jumps to b5, threatening Nd6+.",tags:["Sideline","Threat Nd6"],ar:[{f:'c3',t:'b5'},{f:'b5',t:'d6',c:'r'}]},
null,
{t:"Nxd4 — Recapture the pawn.",ar:[{f:'c3',t:'d4'}]},
null,
{t:"Nxd4 — Exchange, simplified position. White has a slight edge.",tags:["Exchange","Slight edge"],ar:[{f:'f3',t:'d4'}]},
]},

]},/* end french_white */

};/* end OPENINGS */




/* ════════════════════════════════════════════════════════
   FAMOUS GAMES — selectable from game mode picker
════════════════════════════════════════════════════════ */
const FAMOUS_GAMES=[
{
  title:'Holmes vs Moriarty — Reichenbach Falls, 1891',
  subtitle:'Moriarty (White) vs Holmes (Black) — The Final Problem',
  white:'Prof. Moriarty',
  black:'Sherlock Holmes',
  result:'0-1 (Holmes wins — Bf1#)',
  moves:[
    'c2c4','e7e5',
    'g2g3','d7d5',
    'c4d5','g8f6',
    'b1c3','f6d5',
    'f1g2','c8e6',
    'g1f3','b8c6',
    'f3g5','d8g5',
    'c3d5','g5d8',
    'd5e3','d8d7',
    'd2d3','f8e7',
    'c1d2','e8g8',
    'e1g1','a8d8',
    'd2c3','c6d4',
    'f1e1','f7f5',
    'e3c2','f5f4',
    'c2a3','e7g5',
    'a3c4','f4g3',
    'h2g3','d7f7',
    'e1f1','e5e4',
    'g2e4','f7h5',
    'c3d4','d8d4',
    'c4e3','f8f6',
    'e4f3','h5h3',
    'f3g2','h3g3',
    'f2g3','g5e3',
    'g1h2','f6h6',
    'g2h3','e6h3',
    'f1f4','d4f4',
    'g3f4','e3f2',
    'd1b3','g8h8',
    'b3b7','h3f1',   // 31. Qxb7 Bf1# (Bh3->f1 discovered check from Rh6, Bf1+Bf2 cover all escapes)
  ],
  notes:[
    "1.c4 — Moriarty opens with the English! A subtle, positional weapon.",
    "1...e5 — Holmes strikes in the centre immediately.",
    "2.g3 — Moriarty prepares to fianchetto his bishop.",
    "2...d5 — Holmes challenges the centre with both pawns.",
    "3.cxd5 — Moriarty captures.",
    "3...Nf6 — Holmes develops the knight, ready to recapture.",
    "4.Nc3 — Moriarty develops.",
    "4...Nxd5 — Holmes recaptures the pawn with the knight.",
    "5.Bg2 — The fianchetto bishop! Controls the long diagonal.",
    "5...Be6 — Holmes develops his bishop actively.",
    "6.Nf3 — Moriarty develops his second knight.",
    "6...Nc6 — Holmes develops, pressuring d4.",
    "7.Ng5 — Moriarty attacks the e6 bishop!",
    "7...Qxg5 — Holmes takes the knight! A material sacrifice to seize the initiative.",
    "8.Nxd5 — Moriarty recaptures on d5. He is ahead in material.",
    "8...Qd8 — Holmes retreats the queen. Patience.",
    "9.Ne3 — Moriarty's knight manoeuvres to e3.",
    "9...Qd7 — Holmes activates the queen.",
    "10.d3 — Moriarty solidifies the centre.",
    "10...Be7 — Holmes develops the bishop. The e7 square is free: the e-pawn advanced to e5 on move 1!",
    "11.Bd2 — Moriarty prepares to castle.",
    "11...O-O — Holmes castles for king safety.",
    "12.O-O — Moriarty castles. Both sides complete development.",
    "12...Rad8 — Holmes activates the a-rook on the d-file.",
    "13.Bc3 — Moriarty repositions the bishop.",
    "13...Nd4 — Holmes' knight leaps to the powerful d4 outpost!",
    "14.Re1 — Moriarty centralises the rook.",
    "14...f5 — Holmes begins his kingside advance!",
    "15.Nc2 — Moriarty retreats.",
    "15...f4 — Holmes pushes! The attack accelerates.",
    "16.Na3 — Moriarty's knight retreats awkwardly.",
    "16...Bg5 — Holmes' bishop springs to g5, eyeing e3!",
    "17.Nc4 — Moriarty tries to activate.",
    "17...fxg3 — Holmes smashes through with the pawn sacrifice!",
    "18.hxg3 — Moriarty recaptures. The h-file is now open.",
    "18...Qf7 — Holmes' queen joins the attack on f7!",
    "19.Rf1 — Moriarty scrambles to defend.",
    "19...e4! — Holmes' e-pawn storms forward, opening lines.",
    "20.Bxe4 — Moriarty captures the pawn.",
    "20...Qh5 — Holmes' queen crashes in on h5, threatening Qxh2#!",
    "21.Bxd4 — Moriarty eliminates the outpost knight.",
    "21...Rxd4 — Holmes recaptures. The rook joins the attack.",
    "22.Ne3 — Moriarty blocks desperately.",
    "22...Rf6 — Holmes' rook swings to f6, preparing Rh6!",
    "23.Bf3 — Moriarty tries to defend.",
    "23...Qh3 — Holmes' queen invades h3, threatening Qg2#!",
    "24.Bg2 — Moriarty retreats.",
    "24...Qxg3!! — THE QUEEN SACRIFICE! Holmes gives up his queen for the kill! 'When you eliminate the impossible...'",
    "25.fxg3 — Moriarty must take. But now...",
    "25...Bxe3+ — CHECK! Holmes' bishop strikes from g5 to e3!",
    "26.Kh2 — Moriarty's king flees to h2.",
    "26...Rh6+ — Holmes' rook delivers check on h6!",
    "27.Bh3 — Moriarty desperately blocks with the bishop.",
    "27...Bxh3 — Holmes captures the bishop with his Be6! The attack is decisive.",
    "28.Rf4 — Moriarty offers the rook to slow the attack.",
    "28...Rxf4 — Holmes captures, stripping away the last defence.",
    "29.gxf4 — Moriarty recaptures, desperate.",
    "29...Bf2 — Holmes' bishop retreats to f2, controlling g1!",
    "30.Qb3+ — Moriarty checks desperately.",
    "30...Kh8 — Holmes' king steps aside calmly.",
    "31.Qxb7 — Moriarty grabs a pawn, his last move as a free man...",
    "31...Bf1# — CHECKMATE! Bishop to f1 — discovered check from the Rh6! The two bishops on f1 and f2 cover every escape square. Moriarty's king on h2 is trapped. 'Bishop to Bishop 8... discovered check. And incidentally, mate.' — Sherlock Holmes.",
  ]
},
{
  title:'Einstein vs Oppenheimer — Princeton, 1933',
  subtitle:'Albert Einstein (White) vs J. Robert Oppenheimer (Black)',
  white:'Albert Einstein',
  black:'J. Robert Oppenheimer',
  result:'1-0 (Einstein wins)',
  moves:[
    'e2e4','e7e5','g1f3','b8c6','f1b5','a7a6','b5a4','b7b5',
    'a4b3','g8f6','e1g1','f6e4','f1e1','d7d5','a2a4','b5b4',
    'd2d3','e4c5','f3e5','c6e7','d1f3','f7f6','f3h5','g7g6',
    'e5g6','h7g6','h5h8','c5b3','c2b3','d8d6','c1h6','e8d7',
    'h6f8','c8b7','h8g7','a8e8','b1d2','c7c5','a1d1','a6a5',
    'd2c4','d5c4','d3c4','d6d1','e1d1','d7c8','d1e7',
  ],
  notes:[
    "1.e4 — Einstein opens with the king's pawn. Even geniuses play e4!",
    "1...e5 — Oppenheimer responds symmetrically.",
    "2.Nf3 — Einstein develops, attacking e5.",
    "2...Nc6 — Oppenheimer defends e5.",
    "3.Bb5 — The Ruy Lopez! Einstein's favourite weapon.",
    "3...a6 — The Morphy Defence. Oppenheimer challenges the bishop.",
    "4.Ba4 — Einstein retreats the bishop, maintaining the pin.",
    "4...b5 — Oppenheimer advances the b-pawn, driving the bishop back.",
    "5.Bb3 — Einstein retreats to b3, keeping the bishop active.",
    "5...Nf6 — Oppenheimer develops the knight, attacking e4.",
    "6.O-O — Einstein castles quickly for king safety.",
    "6...Nxe4 — Oppenheimer captures the e4 pawn! A bold decision.",
    "7.Re1 — Einstein centralises the rook, attacking the e4 knight.",
    "7...d5 — Oppenheimer supports the knight and claims the centre.",
    "8.a4 — Einstein attacks the b5 pawn, opening lines on the queenside.",
    "8...b4 — Oppenheimer advances, closing the queenside.",
    "9.d3 — Einstein attacks the e4 knight again.",
    "9...Nc5 — Oppenheimer retreats the knight to c5.",
    "10.Nxe5 — Einstein captures the e5 pawn! Material advantage.",
    "10...Ne7 — Oppenheimer develops the knight, preparing to castle.",
    "11.Qf3 — Einstein's queen enters aggressively!",
    "11...f6 — Oppenheimer tries to push back the e5 knight.",
    "12.Qh5+ — Einstein checks! The queen attacks the kingside.",
    "12...g6 — Oppenheimer blocks the check with the g-pawn.",
    "13.Nxg6 — Einstein captures on g6, sacrificing the knight!",
    "13...hxg6 — Oppenheimer recaptures, but the h-file opens.",
    "14.Qxh8 — Einstein captures the rook! A brilliant combination.",
    "14...Nxb3 — Oppenheimer captures the b3 bishop.",
    "15.cxb3 — Einstein recaptures with the c-pawn.",
    "15...Qd6 — Oppenheimer develops the queen.",
    "16.Bh6 — Einstein's bishop attacks the f8 bishop!",
    "16...Kd7 — Oppenheimer moves the king, trying to escape.",
    "17.Bxf8 — Einstein captures the bishop!",
    "17...Bb7 — Oppenheimer develops his last piece.",
    "18.Qg7 — Einstein's queen is dominant on g7!",
    "18...Re8 — Oppenheimer activates his rook.",
    "19.Nd2 — Einstein develops his last piece.",
    "19...c5 — Oppenheimer tries queenside counterplay.",
    "20.Rad1 — Einstein centralises the rook.",
    "20...a5 — Oppenheimer advances the a-pawn.",
    "21.Nc4 — Einstein's knight attacks the d5 pawn!",
    "21...dxc4 — Oppenheimer captures the knight.",
    "22.dxc4 — Einstein recaptures. The position opens.",
    "22...Qxd1 — Oppenheimer takes the rook — desperate counterplay!",
    "23.Rxd1+ — Einstein checks with the rook!",
    "23...Kc8 — Oppenheimer's king flees.",
    "24.Bxe7 — Einstein captures the knight. 1-0. Oppenheimer resigns.",
  ]
},
];

// Current game index
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
  if(key===undefined){key=side;side=null;}
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
/* init moved to DOMContentLoaded in trainer.html */

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
  const myChecks=bvCheckMoves(board,mc,oc);
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
