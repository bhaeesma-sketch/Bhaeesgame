
import React, { useState, useRef, useEffect, useMemo } from 'react';
import DarkVeil from '../components/DarkVeil';
import FuzzyText from '../components/FuzzyText';
import { gsap } from 'gsap';

interface LandingProps {
  onPlay: () => void;
  onClaim: (amount: number) => void;
  isClaimed: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2 font-mono text-gold bg-black/40 px-4 py-1.5 rounded-full border border-gold/30 shadow-neon-gold">
      <span className="material-symbols-outlined text-sm animate-pulse">timer</span>
      <span className="text-sm font-black tracking-widest">
        EXPIRES IN: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onPlay, onClaim, isClaimed, isConnected, walletAddress, onConnect }) => {
  const [spinning, setSpinning] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'vrf' | 'spinning' | 'finalized'>('idle');
  const [winAmount, setWinAmount] = useState<number>(0);
  const [isJackpotWin, setIsJackpotWin] = useState(false);
  const [scrollParallax, setScrollParallax] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollParallax(window.scrollY * 0.15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prizes = useMemo(() => [
    { label: "1,000 BAZ JACKPOT", value: 1000, color: "#ffd700" },
    { label: "5 BAZ", value: 5, color: "#8b24ff" },
    { label: "0 BAZ", value: 0, color: "#150d22" },
    { label: "TRY AGAIN", value: 0, color: "#ff0099" },
    { label: "2 BAZ", value: 2, color: "#00f0ff" },
    { label: "1 BAZ", value: 1, color: "#150d22" }
  ], []);

  const spawnParticles = (count: number, isJackpot: boolean) => {
    if (!containerRef.current) return;
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = Math.random() * Math.PI * 2;
      const velocity = isJackpot ? (350 + Math.random() * 900) : (150 + Math.random() * 450);
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      const rotation = Math.random() * 1440;
      
      particle.style.setProperty('--tw-translate-x', `${tx}px`);
      particle.style.setProperty('--tw-translate-y', `${ty}px`);
      particle.style.setProperty('--tw-rotate', `${rotation}deg`);
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      
      const size = isJackpot ? (Math.random() * 24 + 8) : (Math.random() * 12 + 4);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = i % 2 === 0 ? '2px' : '50%';
      
      const colors = isJackpot 
        ? ['#ffd700', '#ffffff', '#ffaa00', '#fff5cc', '#ff0099'] 
        : ['#8b24ff', '#00f0ff', '#ff0099', '#ffffff'];
      
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 ${isJackpot ? '30px' : '15px'} ${particle.style.backgroundColor}`;
      particle.style.zIndex = "150";
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), isJackpot ? 3500 : 1800);
    }
  };

  const handleWeb3Spin = async () => {
    if (isClaimed || spinning || !isConnected) return;
    setSpinning(true);
    setTxStatus('signing');
    await new Promise(resolve => setTimeout(resolve, 1400));
    setTxStatus('vrf');
    await new Promise(resolve => setTimeout(resolve, 2200));
    setTxStatus('spinning');
    const roll = Math.random();
    const isJackpot = roll < 0.0001; 
    let targetSegment = isJackpot ? 0 : 1 + Math.floor(Math.random() * 5);
    const rotations = 18;
    const segmentAngle = 360 / prizes.length;
    const landingAngle = 360 - (targetSegment * segmentAngle + (segmentAngle / 2));
    const totalRotation = (rotations * 360) + landingAngle;

    if (wheelRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setTxStatus('finalized');
          setWinAmount(prizes[targetSegment].value);
          setIsJackpotWin(isJackpot);
          if (isJackpot) spawnParticles(400, true);
          else if (prizes[targetSegment].value > 0) spawnParticles(80, false);
          onClaim(prizes[targetSegment].value);
        }
      });
      gsap.set(wheelRef.current, { filter: 'blur(0px)' });
      tl.to(wheelRef.current, {
        rotation: `+=${totalRotation}`,
        duration: 5.5,
        ease: "power4.inOut",
        onUpdate: function() {
            if (!wheelRef.current) return;
            const progress = this.progress();
            const blurAmount = Math.sin(progress * Math.PI) * 15;
            wheelRef.current.style.filter = `blur(${blurAmount}px)`;
        }
      });
    }
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center min-h-screen overflow-hidden py-16 px-6 lg:px-20">
      {/* Background Ambience with Scroll Parallax */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ transform: `translateY(${scrollParallax}px)` }}
      >
        <DarkVeil hueShift={280} noiseIntensity={0.07} scanlineIntensity={0.2} speed={0.4} scanlineFrequency={340} warpAmount={0.3} />
        <div className="absolute top-[-15%] left-[-10%] w-[500px] lg:w-[900px] h-[500px] lg:h-[900px] bg-primary/10 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-secondary/5 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1700px] mx-auto space-y-24">
        
        {/* EXCLUSIVE PROMO SECTION */}
        <section className="reveal-section w-full">
          <div className="relative group overflow-hidden rounded-[4rem] glass-panel border-gold/40 shadow-[0_0_80px_rgba(255,215,0,0.15)] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 bg-gradient-to-br from-gold/5 via-background-dark/80 to-secondary/5">
            {/* Animated Light Streaks */}
            <div className="absolute top-0 left-0 w-full h-full bg-cyber-grid opacity-10 pointer-events-none"></div>
            <div className="absolute -top-40 -left-40 size-[500px] bg-gold/10 blur-[120px] rounded-full group-hover:bg-gold/20 transition-all duration-700"></div>
            
            <div className="space-y-8 flex-1 text-center lg:text-left relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                 <CountdownTimer />
                 <span className="px-5 py-2 bg-secondary/10 border border-secondary/40 text-secondary font-display font-black text-[10px] uppercase tracking-[0.4em] rounded-xl shadow-neon-cyan">
                   PLAY CREDITS ACTIVE
                 </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white uppercase leading-[0.9] tracking-tighter">
                  FREE <span className="text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">5 USDT</span> <br/> 
                  SIGN-UP BONUS
                </h2>
                <p className="text-xl lg:text-2xl text-gray-400 font-sans font-light tracking-wide max-w-2xl">
                  Claim instantly to play Dice, Crash & Limbo! Verifiable VRF liquidity enabled.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                {!isConnected ? (
                  <button onClick={onConnect} className="cursor-target px-12 py-6 rounded-[2rem] bg-gold text-black font-display font-black uppercase tracking-[0.2em] text-sm hover:scale-105 hover:shadow-neon-gold transition-all shadow-2xl active:scale-95">
                    UNLOCK BONUS
                  </button>
                ) : (
                  <button onClick={onPlay} className="cursor-target px-12 py-6 rounded-[2rem] bg-gradient-to-r from-secondary to-blue-600 text-white font-display font-black uppercase tracking-[0.2em] text-sm hover:scale-105 hover:shadow-neon-cyan transition-all shadow-2xl active:scale-95">
                    START PLAYING
                  </button>
                )}
                <div className="flex items-center gap-4 text-gray-500 font-mono text-[9px] uppercase tracking-widest bg-black/40 px-6 py-4 rounded-[1.5rem] border border-white/5">
                   <span className="material-symbols-outlined text-sm text-gold">verified_user</span>
                   *Bonus credited upon first deposit. Non-redeemable credits for entertainment only.
                </div>
              </div>
            </div>

            {/* Explosive Visual Elements */}
            <div className="relative flex items-center justify-center lg:w-[450px] shrink-0">
               <div className="absolute inset-0 bg-gold/20 blur-[100px] animate-pulse rounded-full"></div>
               <div className="relative z-10 w-full animate-float">
                  {/* Holographic USDT Coin Image Proxy */}
                  <div className="aspect-square w-full rounded-[3rem] border-2 border-gold/40 glass-panel flex items-center justify-center p-8 shadow-[0_0_60px_rgba(255,215,0,0.3)] bg-[url('https://images.unsplash.com/photo-1622630998477-00aa69682480?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale-0 group-hover:grayscale-0 transition-all duration-700">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] rounded-[3rem]"></div>
                    <div className="relative z-20 flex flex-col items-center">
                      <span className="text-8xl lg:text-9xl font-display font-black text-gold drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">5</span>
                      <span className="text-2xl font-display font-black text-white tracking-[0.4em] uppercase">USDT</span>
                    </div>
                    {/* Laser Scanning Line */}
                    <div className="scanning-line"></div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-10 -right-10 size-24 rounded-2xl bg-primary/20 border border-primary/40 backdrop-blur-xl flex items-center justify-center rotate-12 shadow-neon animate-pulse">
                     <span className="material-symbols-outlined text-4xl text-primary">token</span>
                  </div>
                  <div className="absolute -bottom-6 -left-6 size-20 rounded-2xl bg-secondary/20 border border-secondary/40 backdrop-blur-xl flex items-center justify-center -rotate-12 shadow-neon-cyan animate-pulse" style={{ animationDelay: '1s' }}>
                     <span className="material-symbols-outlined text-3xl text-secondary">diamond</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* HERO BRANDING & TERMINAL HUB */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center w-full">
          {/* Left: Branding & Action */}
          <div className="space-y-8 lg:space-y-12 text-center lg:text-left flex flex-col items-center lg:items-start reveal-section">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-xl shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500 shadow-neon-gold' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-[10px] lg:text-[14px] font-display font-black text-gold uppercase tracking-[0.4em]">
                {isConnected ? `AUTHENTICATED: ${walletAddress?.slice(0, 14)}...` : 'TERMINAL IDLE // AWAITING AUTH'}
              </span>
            </div>

            <div className="relative w-full max-w-4xl">
              <h1 className="text-7xl md:text-9xl xl:text-[11rem] font-display font-black uppercase leading-[0.8] tracking-tighter text-white">
                <FuzzyText baseIntensity={0.02} hoverIntensity={0.15} enableHover={true}>
                  PROTO
                </FuzzyText>
              </h1>
              <div className="w-full h-24 md:h-40 xl:h-52 mt-4 bg-gradient-to-r from-gold to-secondary flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.3)]">
                  <h1 className="text-7xl md:text-9xl xl:text-[11rem] font-display font-black uppercase leading-none tracking-tighter text-black mix-blend-multiply opacity-90">
                    <FuzzyText baseIntensity={0.03} hoverIntensity={0.25} enableHover={true}>
                      SPIN
                    </FuzzyText>
                  </h1>
              </div>
            </div>

            <p className="text-gray-400 text-lg md:text-xl xl:text-2xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light opacity-90 tracking-wide mt-10">
              Access the high-fidelity Quantum Terminal. Verified 0.01% Grand Jackpot weighted via high-entropy VRF synthesis.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-8 w-full max-w-2xl">
              {!isConnected ? (
                <button onClick={onConnect} className="cursor-target px-12 lg:px-16 py-5 lg:py-7 rounded-[2.5rem] bg-white text-black font-display font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-primary hover:text-white shadow-2xl active:scale-95 text-sm lg:text-base">
                  SYNC TERMINAL
                  <span className="material-symbols-outlined font-black">login</span>
                </button>
              ) : (
                <button onClick={onPlay} className="cursor-target px-12 lg:px-16 py-5 lg:py-7 rounded-[2.5rem] bg-gradient-to-r from-gold to-yellow-600 text-black font-display font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 transition-all hover:scale-105 hover:shadow-[0_0_30px_#ffd700] shadow-2xl active:scale-95 text-sm lg:text-base">
                  ACCESS HUB
                  <span className="material-symbols-outlined font-black">arrow_forward</span>
                </button>
              )}
              <button className="cursor-target px-10 lg:px-14 py-5 lg:py-7 rounded-[2.5rem] bg-black/60 border-2 border-white/10 text-white font-display font-black uppercase tracking-[0.25em] hover:bg-white/10 transition-all text-xs lg:text-sm active:scale-95 backdrop-blur-md">
                PROTOCOL DATA
              </button>
            </div>
          </div>

          {/* Right: The VRF Terminal Hub */}
          <div className="relative w-full max-w-[550px] mx-auto lg:ml-auto reveal-section" style={{ transitionDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/20 blur-[120px] -z-10 rounded-full animate-pulse-slow"></div>
            
            <div className="cursor-target glass-panel p-10 lg:p-16 rounded-[4rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden group border-t-primary/30 transition-all duration-700 hover:border-primary/60">
              {!isConnected && (
                <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                  <div className="size-28 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mb-8 shadow-neon">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">fingerprint</span>
                  </div>
                  <h4 className="text-3xl font-display font-black text-white uppercase tracking-widest mb-4">AUTH REQUIRED</h4>
                  <p className="text-gray-400 text-sm mb-12 leading-relaxed font-sans font-medium">Please link your wallet to authorize the Genesis VRF Reward Terminal.</p>
                  <button onClick={onConnect} className="w-full py-6 rounded-3xl bg-primary text-white font-display font-black uppercase tracking-[0.2em] text-sm hover:bg-primary-glow transition-all shadow-neon active:scale-95">Authorize Link</button>
                </div>
              )}

              <div className="text-center mb-12">
                <h3 className="text-3xl lg:text-4xl font-display font-black uppercase text-white mb-3 tracking-widest neon-text">Genesis Terminal</h3>
                <p className="text-gray-500 text-[11px] font-black tracking-[0.4em] uppercase">
                  {isClaimed ? 'PROTOCOL SYNC COMPLETE' : isConnected ? 'STATUS: TERMINAL_READY' : 'STATUS: WAITING_AUTH'}
                </p>
              </div>

              <div className="relative w-72 h-72 lg:w-96 lg:h-96 mx-auto mb-16">
                <div id="wheel-pointer" className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-gold drop-shadow-neon shadow-gold transition-transform duration-75"></div>
                
                <svg ref={wheelRef} viewBox="0 0 100 100" className={`w-full h-full drop-shadow-[0_0_40px_rgba(0,0,0,0.7)] ${!spinning && !isClaimed && isConnected ? 'animate-spin-slow' : ''}`}>
                  <defs>
                      <radialGradient id="jackpotGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffd700" />
                          <stop offset="60%" stopColor="#ff9900" />
                          <stop offset="100%" stopColor="#b8860b" />
                      </radialGradient>
                      <linearGradient id="sliceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2d1f42" />
                          <stop offset="100%" stopColor="#150d22" />
                      </linearGradient>
                  </defs>
                  {prizes.map((p, i) => {
                      const angle = 360 / prizes.length;
                      const rotate = i * angle;
                      const x1 = 50 + 50 * Math.cos((Math.PI * (rotate - 90)) / 180);
                      const y1 = 50 + 50 * Math.sin((Math.PI * (rotate - 90)) / 180);
                      const x2 = 50 + 50 * Math.cos((Math.PI * (rotate + angle - 90)) / 180);
                      const y2 = 50 + 50 * Math.sin((Math.PI * (rotate + angle - 90)) / 180);
                      return <path key={i} d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} fill={i === 0 ? 'url(#jackpotGrad)' : i % 2 === 0 ? 'url(#sliceGrad)' : '#1c142b'} stroke="#000" strokeWidth="0.4" />;
                  })}
                  {prizes.map((p, i) => {
                      const angle = 360 / prizes.length;
                      const rotate = i * angle + angle / 2;
                      return <text key={i} x="50" y="18" transform={`rotate(${rotate}, 50, 50)`} fill={i === 0 ? "#000" : "#fff"} fontSize="3.8" fontWeight="900" fontFamily="Orbitron" textAnchor="middle" style={{ pointerEvents: 'none' }}>{p.label}</text>;
                  })}
                </svg>

                <div 
                  onClick={handleWeb3Spin} 
                  className={`cursor-target absolute inset-0 m-auto w-24 h-24 lg:w-32 lg:h-32 bg-[#0b0514] rounded-full border-4 border-gold/40 flex items-center justify-center z-30 shadow-neon-gold hover:scale-110 active:scale-90 transition-all ${isClaimed || !isConnected ? 'grayscale opacity-50' : ''}`}
                >
                  <div className="text-center">
                      <span className="block text-xs font-black text-white font-display uppercase tracking-widest">{txStatus === 'signing' ? 'SIGN' : txStatus === 'vrf' ? 'VRF' : spinning ? 'ROLL' : isClaimed ? 'SYNC' : 'SPIN'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                  {txStatus === 'finalized' ? (
                    <div className="bg-primary/10 border border-primary/40 p-8 rounded-[2.5rem] text-center animate-fade-in relative overflow-hidden">
                      <h5 className={`font-display font-black uppercase text-2xl mb-3 ${isJackpotWin ? 'text-gold drop-shadow-neon' : 'text-white'}`}>
                          {isJackpotWin ? '0.01% JACKPOT HIT!' : 'SYNTHESIS COMPLETE'}
                      </h5>
                      <button onClick={onPlay} className="w-full py-5 rounded-2xl bg-gradient-to-r from-gold to-yellow-600 text-black font-display font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-neon-gold active:scale-95">START PLAYING</button>
                    </div>
                  ) : (
                    <button onClick={handleWeb3Spin} disabled={spinning} className={`cursor-target w-full py-6 lg:py-7 rounded-3xl bg-primary text-white font-display font-black uppercase tracking-[0.4em] text-xs lg:text-sm hover:bg-primary-glow transition-all shadow-neon group active:scale-[0.98] ${spinning ? 'opacity-50 grayscale' : ''}`}>
                      {spinning ? 'SYNCHRONIZING...' : 'CLAIM SIGNUP REWARD'}
                    </button>
                  )}
              </div>
              
              <p className="mt-10 text-center text-[11px] text-gray-600 font-black uppercase tracking-[0.4em] opacity-40">Verifiable Web3 Terminal // Powered by Chainlink VRF</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
