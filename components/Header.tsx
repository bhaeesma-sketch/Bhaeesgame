
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import GlitchText from './GlitchText';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  balance: number;
  walletAddress: string | null;
  onConnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, balance, walletAddress, onConnect }) => {
  const [telemetry, setTelemetry] = useState({ cpu: 42, latency: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        cpu: 30 + Math.floor(Math.random() * 25),
        latency: 8 + Math.floor(Math.random() * 10)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    { id: Screen.LANDING, label: 'Lobby', icon: 'hub' },
    { id: Screen.GAMES, label: 'Game Modules', icon: 'casino' },
    { id: Screen.STORE, label: 'Exchange', icon: 'currency_exchange' },
    { id: Screen.PROFILE, label: 'Operator', icon: 'fingerprint' },
    { id: Screen.LEGAL, label: 'Compliance', icon: 'verified_user' },
  ];

  return (
    <header className="sticky top-0 z-[100] border-b border-white/5 shadow-2xl overflow-hidden">
      {/* 4K Background Layers */}
      <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-3xl z-[-1]"></div>
      <div className="absolute inset-0 bg-cyber-grid opacity-10 z-[-1]"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="max-w-[1800px] mx-auto px-4 py-2 lg:px-8 flex items-center justify-between gap-6 relative">
        {/* Left: Branding */}
        <div 
          className="flex items-center gap-4 cursor-target group py-2"
          onClick={() => onNavigate(Screen.LANDING)}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-700"></div>
            <span className="material-symbols-outlined text-4xl lg:text-5xl text-primary neon-text relative z-10 animate-pulse-slow">terminal</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl lg:text-3xl font-display font-black tracking-[0.2em] uppercase leading-none">
              <GlitchText
                speed={2.5}
                enableShadows={true}
                enableOnHover={false}
                className="text-white drop-shadow-[0_0_15px_rgba(139,36,255,0.8)]"
              >
                TERMINAL
              </GlitchText>
            </h2>
            <span className="text-[9px] font-black text-secondary tracking-[0.6em] uppercase opacity-60">Quantum v4.0.1</span>
          </div>
        </div>

        {/* Center: Command Telemetry & Nav */}
        <div className="hidden lg:flex flex-col items-center flex-1 gap-2">
          <div className="flex gap-10 text-[9px] font-mono text-gray-500 uppercase tracking-widest border-x border-white/10 px-8 py-1 bg-black/40 rounded-full">
            <span className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full animate-ping"></span>CPU: {telemetry.cpu}%</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>LATENCY: {telemetry.latency}MS</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full"></span>SECURE_HANDSHAKE: ACTIVE</span>
          </div>

          <nav className="flex items-center gap-1">
            {navigationItems.map((nav) => (
              <button
                key={nav.id}
                onClick={() => onNavigate(nav.id)}
                className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-display font-black uppercase tracking-[0.2em] transition-all rounded-xl relative group/nav cursor-target ${
                  currentScreen === nav.id 
                    ? 'text-white bg-primary/10 border border-primary/40 shadow-neon'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${currentScreen === nav.id ? 'neon-text' : 'group-hover/nav:scale-110 transition-transform'}`}>
                  {nav.icon}
                </span>
                {nav.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Credits & Identity */}
        <div className="flex items-center gap-4 lg:gap-8 shrink-0">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-2xl p-1.5 shadow-2xl hover:border-primary/50 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <button 
                onClick={() => onNavigate(Screen.STORE)}
                className="flex items-center justify-center rounded-xl h-10 lg:h-12 px-6 bg-gradient-to-br from-primary to-violet-900 hover:from-primary-glow hover:to-primary text-white text-[10px] font-display font-black uppercase tracking-[0.2em] clip-hex shadow-neon cursor-target active:scale-95"
              >
                SYNC
              </button>
              <div className="flex flex-col items-end px-4 leading-none">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Credits Pool</span>
                <span className="text-xl lg:text-2xl font-display font-black text-white tracking-wide neon-text">
                  {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {walletAddress && (
               <div className="flex items-center gap-2 mr-2">
                  <span className="size-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                  <span className="text-[10px] font-mono text-secondary font-bold uppercase tracking-tighter">NODE_{walletAddress.slice(-6)}</span>
               </div>
            )}
          </div>

          <div 
            className="relative cursor-target group"
            onClick={() => onNavigate(Screen.PROFILE)}
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
            <div className="relative border-2 border-white/10 rounded-full p-1 group-hover:border-primary transition-all duration-300">
               <div 
                  className="bg-center bg-no-repeat bg-cover rounded-full size-11 lg:size-14 grayscale group-hover:grayscale-0 transition-all duration-500"
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200")' }}
                ></div>
            </div>
            <div className="absolute -bottom-1 -right-1 size-5 bg-black border-2 border-primary rounded-full flex items-center justify-center shadow-neon">
               <span className="material-symbols-outlined text-[10px] text-primary font-black">shield</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
