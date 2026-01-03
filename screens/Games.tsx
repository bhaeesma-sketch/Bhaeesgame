
import React, { useState, useEffect, useRef } from 'react';
import { UserState } from '../types';
import { gsap } from 'gsap';
import DarkVeil from '../components/DarkVeil';
import FuzzyText from '../components/FuzzyText';

interface GamesProps {
  user: UserState;
  onUpdateBalance: (amount: number) => void;
}

type ActiveGame = 'lobby' | 'dice' | 'slots' | 'mines' | 'plinko';

const playSound = (type: 'win' | 'loss' | 'roll' | 'click' | 'plink' | 'jackpot' | 'init') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    } else if (type === 'loss') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    } else if (type === 'plink') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    } else if (type === 'jackpot') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.8);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    } else if (type === 'init') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else {
      osc.frequency.setValueAtTime(200, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    }
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 1.0);
  } catch (e) {}
};

const Games: React.FC<GamesProps> = ({ user, onUpdateBalance }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('lobby');
  const [isInitializing, setIsInitializing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleSelectGame = (game: ActiveGame) => {
    setIsInitializing(true);
    setLoadingProgress(0);
    playSound('init');
    
    // Simulate high-fidelity loading
    const duration = 2000;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveGame(game);
          setIsInitializing(false);
        }, 300);
      }
    }, 50);
  };

  const handleBet = (gameName: string, bet: number, profit: number) => {
    if (profit > (bet * 50)) playSound('jackpot');
    else if (profit > 0) playSound('win');
    else playSound('loss');
  };

  return (
    <div className="relative w-full min-h-[85vh] overflow-hidden bg-[#0b0514]">
      {/* 4K Environmental Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <DarkVeil hueShift={260} noiseIntensity={0.04} scanlineIntensity={0.15} speed={0.2} scanlineFrequency={450} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-4 lg:px-8 py-10">
        {isInitializing ? (
          <GameLoader game={activeGame === 'lobby' ? 'dice' : activeGame} progress={loadingProgress} />
        ) : activeGame === 'lobby' ? (
          <GameLobby onSelect={handleSelectGame} />
        ) : (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveGame('lobby')}
                className="flex items-center gap-3 text-gray-500 hover:text-primary transition-all font-display font-black uppercase text-xs tracking-[0.3em] cursor-target group"
              >
                <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </div>
                Return to Hub
              </button>
              <div className="flex items-center gap-4 bg-primary/10 border border-primary/30 px-6 py-2 rounded-xl">
                 <span className="size-2 bg-primary rounded-full animate-ping shadow-neon"></span>
                 <span className="text-[10px] font-display font-black text-white uppercase tracking-widest">4K Quantum Synthesis Enabled</span>
              </div>
            </div>
            
            <div className="h-full">
              {activeGame === 'dice' && <QuantumDice4K user={user} onUpdateBalance={onUpdateBalance} onBet={handleBet} />}
              {activeGame === 'slots' && <CyberWheel4K user={user} onUpdateBalance={onUpdateBalance} onBet={handleBet} />}
              {activeGame === 'mines' && <CryptoMines4K user={user} onUpdateBalance={onUpdateBalance} onBet={handleBet} />}
              {activeGame === 'plinko' && <CyberPlinko4K user={user} onUpdateBalance={onUpdateBalance} onBet={handleBet} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GameLoader = ({ game, progress }: { game: ActiveGame; progress: number }) => {
  const themedContent = {
    dice: { color: 'text-primary', label: 'Entropy Synthesis', icon: 'casino', sub: 'Initializing VRF Handshake...' },
    slots: { color: 'text-secondary', label: 'Segment Calibration', icon: 'cyclone', sub: 'Linking RNG Nodes...' },
    mines: { color: 'text-gold', label: 'Hazard Mapping', icon: 'grid_view', sub: 'Scanning Cryptographic Grid...' },
    plinko: { color: 'text-accent-pink', label: 'Trajectory Simulation', icon: 'blur_on', sub: 'Calibrating Gravity Field...' },
    lobby: { color: 'text-white', label: 'System Loading', icon: 'hub', sub: 'Accessing Terminal...' }
  }[game] || { color: 'text-white', label: 'Initializing', icon: 'hub', sub: 'Please Wait...' };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-fade-in">
      <div className="relative group">
        <div className={`absolute inset-0 ${themedContent.color.replace('text-', 'bg-')}/20 blur-3xl rounded-full scale-150 animate-pulse`}></div>
        
        {/* Themed Animation Component */}
        <div className="relative z-10 size-48 flex items-center justify-center">
          {game === 'dice' && (
             <div className="preserve-3d animate-spin-slow w-24 h-24 border-2 border-primary/40 relative">
                <div className="absolute inset-0 bg-primary/10 border border-primary/20 transform translateZ(12px)"></div>
                <div className="absolute inset-0 bg-primary/10 border border-primary/20 transform -translateZ(12px)"></div>
             </div>
          )}
          {game === 'slots' && (
            <div className="size-32 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin"></div>
          )}
          {game === 'mines' && (
            <div className="grid grid-cols-3 gap-2">
               {[...Array(9)].map((_, i) => (
                 <div key={i} className="size-6 bg-gold/20 border border-gold/40 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
               ))}
            </div>
          )}
          {game === 'plinko' && (
            <div className="h-32 flex items-end gap-2">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-2 bg-accent-pink/40 animate-[float_2s_infinite]" style={{ height: `${20 + i*15}%`, animationDelay: `${i * 0.2}s` }}></div>
               ))}
            </div>
          )}
          <span className={`material-symbols-outlined absolute text-6xl ${themedContent.color} neon-text`}>{themedContent.icon}</span>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className={`text-4xl font-display font-black uppercase tracking-[0.4em] ${themedContent.color}`}>
          {themedContent.label}
        </h3>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">{themedContent.sub}</p>
      </div>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <span>Module_Status: Syncing</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full transition-all duration-300 ${themedContent.color.replace('text-', 'bg-')} shadow-neon`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-[10px] font-mono text-gray-600 animate-pulse tracking-tighter">
        BITSTREAM_DATA: {Array(16).fill(0).map(() => Math.floor(Math.random() * 2)).join('')}
      </div>
    </div>
  );
};

const GameLobby = ({ onSelect }: { onSelect: (g: ActiveGame) => void }) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Parallax intensity based on screen size
      const multiplier = window.innerWidth > 1024 ? 0.15 : 0.05;
      setScrollOffset(window.scrollY * multiplier);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cards = [
    { id: 'dice', name: 'Quantum Dice', icon: 'casino', desc: 'Real-time 3D simulation using high-entropy VRF synthesis.', color: 'from-primary', tag: '3D ULTRA' },
    { id: 'slots', name: 'Cyber Wheel', icon: 'cyclone', desc: '20-segment high-resolution wheel with volumetric lighting.', color: 'from-secondary', tag: 'HDR READY' },
    { id: 'mines', name: 'Crypto Mines', icon: 'grid_view', desc: 'Interactive holographic grid with real-time hazard detection.', color: 'from-gold', tag: 'HOLO TECH' },
    { id: 'plinko', name: 'Cyber Plinko', icon: 'blur_on', desc: 'Advanced physics-based projectile drop with light trails.', color: 'from-accent-pink', tag: 'PHYSICS X' },
  ];

  return (
    <div className="space-y-16 py-8">
      <div className="text-center space-y-6">
        <h2 className="text-6xl lg:text-9xl font-display font-black text-white uppercase tracking-tighter leading-none">
          Active <span className="text-primary-glow neon-text">Terminals</span>
        </h2>
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500 font-mono text-sm tracking-[0.4em] uppercase opacity-60">Verified Rigged Protocol • Deployment v4.2</p>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <div 
            key={card.id}
            onClick={() => onSelect(card.id as ActiveGame)}
            className="cursor-target group glass-panel rounded-[3rem] p-10 border-white/5 hover:border-primary/40 transition-all duration-700 hover:-translate-y-6 relative overflow-hidden h-[480px] flex flex-col justify-between"
          >
            {/* 4K Background Effects with Parallax */}
            <div 
              style={{ transform: `translateY(${scrollOffset}px)` }}
              className={`absolute -right-20 -top-20 size-80 bg-gradient-to-br ${card.color} to-transparent opacity-5 blur-[100px] group-hover:opacity-20 transition-opacity duration-700 will-change-transform`}>
            </div>
            
            <div className="absolute inset-0 bg-cyber-grid opacity-5 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="size-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl text-white neon-text">{card.icon}</span>
                </div>
                <span className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white group-hover:border-primary/40 transition-all">{card.tag}</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-widest leading-none">{card.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium opacity-80">{card.desc}</p>
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-display font-black uppercase text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl overflow-hidden relative">
               <span className="relative z-10">Initialize Module</span>
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- 4K QUANTUM DICE --- */
const QuantumDice4K = ({ user, onUpdateBalance, onBet }: any) => {
  const [bet, setBet] = useState(10);
  const [rolling, setRolling] = useState(false);
  const [winCount, setWinCount] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const diceRef = useRef<HTMLDivElement>(null);

  const rollDice = () => {
    if (rolling || bet > user.credits) return;
    setRolling(true); setResult(null); onUpdateBalance(-bet);
    
    const isLoss = winCount >= 2 || Math.random() < 0.75;
    const finalNum = !isLoss ? 6 : Math.floor(Math.random() * 5) + 1;
    
    if (diceRef.current) {
      const finalRot = {
        1: { x: 0, y: 0 }, 2: { x: 0, y: 180 }, 3: { x: 0, y: -90 },
        4: { x: 0, y: 90 }, 5: { x: -90, y: 0 }, 6: { x: 90, y: 0 }
      }[finalNum as 1|2|3|4|5|6];

      gsap.to(diceRef.current, {
        rotationX: 2880 + finalRot!.x,
        rotationY: 2880 + finalRot!.y,
        rotationZ: 1440,
        duration: 3,
        ease: "power4.inOut",
        onUpdate: () => playSound('roll'),
        onComplete: () => {
          setRolling(false); setResult(finalNum);
          if (finalNum === 6) { onUpdateBalance(bet * 2.5); setWinCount(v => v + 1); } else setWinCount(0);
          onBet('Dice', bet, (finalNum === 6 ? bet * 1.5 : -bet));
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-[4rem] p-12 lg:p-20 border-primary/20 relative overflow-hidden">
      <div className="absolute top-8 left-8 flex items-center gap-4">
         <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`size-3 rounded-full border border-white/20 ${winCount >= i ? 'bg-primary shadow-neon' : 'bg-black/40'}`}></div>
            ))}
         </div>
         <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Handshake Buffer</span>
      </div>

      <div className="text-center space-y-12">
        <h4 className="text-4xl font-display font-black text-white uppercase tracking-[0.5em] neon-text">Quantum <span className="text-primary">Dice</span></h4>
        
        <div className="perspective-1000 h-80 flex items-center justify-center relative">
          {/* Holographic Projection Floor */}
          <div className="absolute bottom-0 w-[500px] h-[100px] bg-primary/10 rounded-[100%] blur-2xl transform scale-y-50 translate-y-12 animate-pulse"></div>
          <div className="absolute bottom-0 w-[300px] h-[40px] border-2 border-primary/40 rounded-[100%] transform scale-y-50 translate-y-8 flex items-center justify-center">
             <div className="w-full h-full bg-cyber-grid opacity-20"></div>
          </div>

          <div ref={diceRef} className="dice-4k w-32 h-32 lg:w-40 lg:h-40 relative preserve-3d">
            {[1, 2, 3, 4, 5, 6].map(f => (
              <div key={f} className={`face face-${f} absolute inset-0 bg-primary/20 border-2 border-primary/50 backdrop-blur-3xl flex items-center justify-center text-white font-display text-5xl font-black shadow-[inset_0_0_50px_rgba(139,36,255,0.4)] overflow-hidden`}>
                <div className="absolute inset-0 bg-scanline opacity-10 animate-scan"></div>
                <div className="relative z-10 drop-shadow-[0_0_10px_white]">{f}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
           <div className="relative group">
              <input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="w-full bg-black/60 border-2 border-white/10 rounded-3xl p-6 text-white font-display font-black text-3xl text-center outline-none group-hover:border-primary/40 transition-all focus:border-primary shadow-2xl" />
              <span className="absolute top-2 left-6 text-[9px] text-gray-500 font-black uppercase tracking-widest">Protocol Stake</span>
           </div>
           <button onClick={rollDice} disabled={rolling} className="h-full py-6 rounded-3xl bg-primary text-white font-display font-black uppercase text-xl shadow-neon hover:bg-primary-glow active:scale-95 transition-all disabled:opacity-50 overflow-hidden relative group">
              <span className="relative z-10">Execute Synthesis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
           </button>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1500px; }
        .preserve-3d { transform-style: preserve-3d; }
        .face-1 { transform: rotateY(0deg) translateZ(80px); }
        .face-2 { transform: rotateY(180deg) translateZ(80px); }
        .face-3 { transform: rotateY(90deg) translateZ(80px); }
        .face-4 { transform: rotateY(-90deg) translateZ(80px); }
        .face-5 { transform: rotateX(90deg) translateZ(80px); }
        .face-6 { transform: rotateX(-90deg) translateZ(80px); }
        @media (max-width: 1024px) {
          .face-1 { transform: rotateY(0deg) translateZ(64px); }
          .face-2 { transform: rotateY(180deg) translateZ(64px); }
          .face-3 { transform: rotateY(90deg) translateZ(64px); }
          .face-4 { transform: rotateY(-90deg) translateZ(64px); }
          .face-5 { transform: rotateX(90deg) translateZ(64px); }
          .face-6 { transform: rotateX(-90deg) translateZ(64px); }
        }
      `}</style>
    </div>
  );
};

/* --- 4K CYBER WHEEL --- */
const CyberWheel4K = ({ user, onUpdateBalance, onBet }: any) => {
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const wheelRef = useRef<SVGSVGElement>(null);

  const segments = [{ label: "GRAND 10X", value: 10, color: "url(#gradJackpot)", isJackpot: true }, ...Array(18).fill({ label: "ZERO", value: 0, color: "url(#gradEmpty)" }), { label: "BOOST 2X", value: 2, color: "url(#gradBoost)" }];

  const spin = () => {
    if (spinning || bet > user.credits) return;
    setSpinning(true); onUpdateBalance(-bet); playSound('roll');
    const roll = Math.random();
    let targetIdx = roll > 0.003 ? 1 + Math.floor(Math.random() * 19) : 0;
    const rot = 15 * 360 + (360 - (targetIdx * 18 + 9));
    if (wheelRef.current) {
      gsap.to(wheelRef.current, {
        rotation: rot, duration: 6, ease: "power4.inOut",
        onUpdate: function() { if (wheelRef.current) wheelRef.current.style.filter = `blur(${Math.sin(this.progress() * Math.PI) * 12}px)`; },
        onComplete: () => {
          setSpinning(false); const p = segments[targetIdx];
          if (p.value > 0) onUpdateBalance(bet * p.value);
          onBet('Wheel', bet, (p.value > 0 ? bet * (p.value - 1) : -bet));
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-[4rem] p-12 lg:p-20 border-secondary/20 text-center space-y-12">
      <h4 className="text-4xl font-display font-black text-white uppercase tracking-[0.4em] neon-text-accent">Cyber <span className="text-secondary">Wheel</span></h4>
      
      <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px] mx-auto group">
        <div className="absolute inset-0 bg-secondary/10 rounded-full blur-[100px] animate-pulse"></div>
        {/* Pointer */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-secondary filter drop-shadow-[0_0_15px_#00f0ff] animate-bounce"></div>
        
        <svg ref={wheelRef} viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10">
          <defs>
            <radialGradient id="gradJackpot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" /><stop offset="100%" stopColor="#b8860b" />
            </radialGradient>
            <linearGradient id="gradBoost" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" /><stop offset="100%" stopColor="#0055ff" />
            </linearGradient>
            <linearGradient id="gradEmpty" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2d1f42" /><stop offset="100%" stopColor="#0b0514" />
            </linearGradient>
          </defs>
          {segments.map((s, i) => {
            const angle = 18; const r = i * angle;
            const x1 = 50 + 50 * Math.cos((Math.PI * (r - 90)) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * (r - 90)) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (r + angle - 90)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (r + angle - 90)) / 180);
            return <path key={i} d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} fill={s.color} stroke="#000" strokeWidth="0.2" />;
          })}
          {/* Center Singularity */}
          <circle cx="50" cy="50" r="8" fill="#0b0514" stroke="#00f0ff" strokeWidth="1" />
          <circle cx="50" cy="50" r="4" fill="#00f0ff" className="animate-pulse shadow-neon" />
        </svg>
      </div>

      <div className="flex gap-6 max-w-2xl mx-auto">
        <input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="flex-1 bg-black/60 border-2 border-white/10 rounded-2xl p-5 text-white font-display font-black text-2xl text-center outline-none focus:border-secondary shadow-2xl" />
        <button onClick={spin} disabled={spinning} className="px-14 rounded-2xl bg-secondary text-black font-display font-black uppercase text-xl shadow-neon-cyan hover:bg-cyan-400 active:scale-95 transition-all">Spin Synthesis</button>
      </div>
    </div>
  );
};

/* --- 4K HOLOGRAPHIC MINES --- */
const CryptoMines4K = ({ user, onUpdateBalance, onBet }: any) => {
  const [bet, setBet] = useState(10);
  const [grid, setGrid] = useState<any[]>(Array(25).fill({ status: 'hidden' }));
  const [clickCount, setClickCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [activeSession, setActiveSession] = useState(false);

  const startSession = () => { if (bet > user.credits) return; onUpdateBalance(-bet); setGrid(Array(25).fill({ status: 'hidden' })); setClickCount(0); setGameOver(false); setActiveSession(true); };

  const reveal = (idx: number) => {
    if (!activeSession || gameOver || grid[idx].status !== 'hidden') return;
    const isMine = clickCount >= 2 ? Math.random() < 0.85 : Math.random() < 0.20;
    const nextGrid = [...grid];
    if (isMine) { nextGrid[idx] = { status: 'mine' }; setGameOver(true); setActiveSession(false); onBet('Mines', bet, -bet); playSound('loss'); }
    else { nextGrid[idx] = { status: 'safe' }; setClickCount(c => c + 1); onUpdateBalance(bet * 0.25); playSound('click'); }
    setGrid(nextGrid);
  };

  return (
    <div className="max-w-5xl mx-auto glass-panel rounded-[4rem] p-12 lg:p-20 border-gold/20 text-center space-y-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex flex-col items-start">
           <h4 className="text-4xl font-display font-black text-white uppercase tracking-[0.4em] neon-text">Holo <span className="text-gold">Mines</span></h4>
           <span className="text-[10px] text-gray-500 font-mono font-black uppercase tracking-[0.5em] mt-2">Hazard Level: Critical</span>
        </div>
        <div className="bg-gold/10 border border-gold/40 px-8 py-3 rounded-2xl shadow-neon-gold">
           <span className="text-gold font-display font-black text-2xl uppercase tracking-widest">Multiplier: {(1 + clickCount * 0.25).toFixed(2)}x</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 lg:gap-6 relative">
        {grid.map((cell, i) => (
          <div 
            key={i} 
            onClick={() => reveal(i)} 
            className={`cursor-target aspect-square rounded-2xl border-2 transition-all duration-500 flex items-center justify-center overflow-hidden relative group shadow-2xl ${
              cell.status === 'hidden' ? 'bg-white/5 border-white/10 hover:border-gold/50 hover:bg-gold/5 scale-100 hover:scale-105' : 
              cell.status === 'safe' ? 'bg-green-500/20 border-green-500 shadow-neon-gold animate-pulse' : 
              'bg-red-500/20 border-red-500 shadow-neon animate-shake'
            }`}
          >
            <div className="absolute inset-0 opacity-20 bg-scanline animate-scan"></div>
            <span className={`material-symbols-outlined text-4xl lg:text-5xl transition-all duration-300 ${cell.status === 'mine' ? 'text-red-500' : cell.status === 'safe' ? 'text-green-500' : 'text-gray-700 group-hover:text-gold'}`}>
              {cell.status === 'hidden' ? 'lock_open' : cell.status === 'safe' ? 'verified' : 'bolt'}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 max-w-2xl mx-auto">
        {!activeSession ? (
          <><input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="flex-1 bg-black/60 border-2 border-white/10 rounded-2xl p-5 text-white font-display font-black text-2xl text-center outline-none focus:border-gold shadow-2xl" /><button onClick={startSession} className="px-14 rounded-2xl bg-gold text-black font-display font-black uppercase text-xl shadow-neon-gold hover:bg-yellow-400 active:scale-95 transition-all">Initialize Grid</button></>
        ) : (
          <button onClick={() => { setActiveSession(false); setGameOver(true); }} className="w-full py-6 rounded-2xl bg-primary text-white font-display font-black uppercase text-xl shadow-neon hover:bg-primary-glow transition-all group overflow-hidden relative">
             <span className="relative z-10">Secure Multiplier Handshake</span>
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        )}
      </div>
    </div>
  );
};

/* --- 4K CYBER PLINKO --- */
const CyberPlinko4K = ({ user, onUpdateBalance, onBet }: any) => {
  const [rows, setRows] = useState(12);
  const [risk, setRisk] = useState<'low' | 'med' | 'high'>('med');
  const [bet, setBet] = useState(10);
  const [balls, setBalls] = useState<any[]>([]);
  const [hitPegs, setHitPegs] = useState<Record<string, number>>({});
  const requestRef = useRef<number>(null);

  const dropBall = () => {
    if (bet > user.credits) return;
    onUpdateBalance(-bet);
    const multis = { high: [1000, 50, 10, 1, 0], med: [100, 10, 2, 0.2], low: [10, 2, 1, 0.5] }[risk];
    const targetIdx = Math.random() < 0.9 ? Math.floor(multis.length / 2 + Math.random() * 2) : Math.floor(Math.random() * multis.length);
    setBalls(prev => [...prev, { id: Math.random(), x: 50, y: 0, vx: 0, vy: 2.5, trail: [], row: 0, targetIndex: targetIdx }]);
  };

  const update = () => {
    const newHits: Record<string, number> = {};
    const now = Date.now();

    setBalls(prev => prev.map(ball => {
      let { x, y, vy, row, trail } = ball;
      const rowHeight = (100 / (rows + 2));
      const nextY = y + vy;
      
      if (Math.floor(nextY / rowHeight) > row) {
        // Calculate which peg was likely hit
        const numPegsInRow = row + 3;
        const s = 6.6; // Estimated horizontal spacing
        const startX = 50 - ((numPegsInRow - 1) * s / 2);
        const pIdx = Math.round((x - startX) / s);
        
        if (pIdx >= 0 && pIdx < numPegsInRow) {
          newHits[`${row}-${pIdx}`] = now;
        }

        row++; 
        playSound('plink'); 
        x += (Math.random() - 0.5) * 4; 
      }
      return { ...ball, x, y: nextY, vy, row, trail: [{x, y: nextY}, ...trail.slice(0, 12)] };
    }).filter(b => {
      if (b.y > 96) { onUpdateBalance(bet * 1.5); return false; }
      return true;
    }));

    if (Object.keys(newHits).length > 0) {
      setHitPegs(prev => ({ ...prev, ...newHits }));
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [rows, risk, bet]);

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-[4rem] p-12 lg:p-16 border-accent-pink/20 space-y-12 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <h4 className="text-4xl font-display font-black text-white uppercase tracking-[0.4em] neon-text">Cyber <span className="text-accent-pink">Plinko</span></h4>
        <div className="flex gap-3">
           {[8, 12, 16].map(r => (
             <button key={r} onClick={() => setRows(r)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${rows === r ? 'bg-accent-pink border-accent-pink text-white shadow-neon' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>{r} Rows</button>
           ))}
        </div>
      </div>

      <div className="relative aspect-[4/5] bg-black/60 rounded-[3rem] border-2 border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
        {/* Pegs with Dynamic 4K Glow Collision */}
        <div className="absolute inset-0 p-10">
           {Array.from({length: rows}).map((_, r) => (
             <div key={r} className="flex justify-center gap-[6%] mb-[4%]" style={{ marginTop: `${100/(rows+3)}%` }}>
               {Array.from({length: r + 3}).map((_, p) => {
                 const hitTime = hitPegs[`${r}-${p}`];
                 const isRecentlyHit = hitTime && (Date.now() - hitTime < 250);
                 
                 return (
                   <div key={p} className={`size-2 rounded-full relative transition-all duration-75 ${isRecentlyHit ? 'scale-[2.2] bg-white shadow-[0_0_25px_#fff]' : 'bg-white/30'}`}>
                      <div className={`absolute inset-0 bg-secondary/20 blur-sm rounded-full ${isRecentlyHit ? 'opacity-100 scale-150' : 'opacity-0'}`}></div>
                      {!isRecentlyHit && <div className="absolute inset-0 bg-secondary/10 blur-[2px] rounded-full"></div>}
                   </div>
                 );
               })}
             </div>
           ))}
        </div>

        {/* High Density Light Trail Balls */}
        <div className="absolute inset-0 pointer-events-none">
          {balls.map(ball => (
            <React.Fragment key={ball.id}>
              {ball.trail.map((t, i) => (
                <div key={i} className="absolute size-3 bg-accent-pink rounded-full blur-[3px]" style={{ left: `${t.x}%`, top: `${t.y}%`, opacity: (1 - i/12) * 0.6, transform: `scale(${1 - i/12}) translate(-50%, -50%)` }} />
              ))}
              <div className="absolute size-5 bg-white rounded-full shadow-neon-gold border-2 border-accent-pink z-10" style={{ left: `${ball.x}%`, top: `${ball.y}%`, transform: 'translate(-50%, -50%)' }} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="flex gap-2">
           {['low', 'med', 'high'].map(rk => (
             <button key={rk} onClick={() => setRisk(rk as any)} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${risk === rk ? 'bg-accent-pink border-accent-pink text-white shadow-neon' : 'bg-white/5 border-white/10 text-gray-500'}`}>{rk}</button>
           ))}
        </div>
        <div className="flex gap-4">
           <input type="number" value={bet} onChange={e => setBet(Math.max(1, Number(e.target.value)))} className="flex-1 bg-black/60 border-2 border-white/10 rounded-2xl p-5 text-white font-display font-black text-2xl text-center outline-none focus:border-accent-pink" />
           <button onClick={dropBall} className="px-14 rounded-2xl bg-accent-pink text-white font-display font-black uppercase text-xl shadow-neon hover:brightness-125 transition-all active:scale-95">Drop</button>
        </div>
      </div>
    </div>
  );
};

export default Games;
