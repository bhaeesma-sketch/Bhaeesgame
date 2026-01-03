
import React from 'react';
import { Screen } from '../types';

interface FooterProps {
  onNavigate: (screen: Screen) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-card-stroke bg-background-dark/80 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            System Online • © 2026 Casino Clash
          </p>
          <span className="text-[10px] text-gray-600 font-mono">QUANTUM-SECURED GAMING PROTOCOL ACTIVE</span>
        </div>
        
        <div className="flex gap-8 text-gray-500 text-xs font-display font-bold uppercase tracking-widest">
          <button onClick={() => onNavigate(Screen.LEGAL)} className="hover:text-secondary transition-colors">Fairness</button>
          <button onClick={() => onNavigate(Screen.LEGAL)} className="hover:text-secondary transition-colors">Rules</button>
          <button onClick={() => onNavigate(Screen.LEGAL)} className="hover:text-secondary transition-colors">Support</button>
        </div>

        <div className="flex gap-4">
          <span className="material-symbols-outlined text-gray-600 hover:text-primary cursor-pointer transition-colors">shield_with_heart</span>
          <span className="material-symbols-outlined text-gray-600 hover:text-primary cursor-pointer transition-colors">account_balance_wallet</span>
          <span className="material-symbols-outlined text-gray-600 hover:text-primary cursor-pointer transition-colors">token</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
