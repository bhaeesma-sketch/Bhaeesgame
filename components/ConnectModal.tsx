
import React, { useState } from 'react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (provider: 'tronlink' | 'walletconnect') => void;
}

type ModalView = 'providers' | 'walletconnect';

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [view, setView] = useState<ModalView>('providers');

  if (!isOpen) return null;

  const handleSelectWC = () => {
    setView('walletconnect');
  };

  const handleBack = () => {
    setView('providers');
  };

  const handleFinalConnect = () => {
    onSelect('walletconnect');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-fade-in"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md glass-panel rounded-[3rem] p-10 lg:p-12 border-primary/40 animate-fade-in-up shadow-[0_0_100px_rgba(139,36,255,0.2)] overflow-hidden">
        {/* View 1: Provider Selection */}
        <div className={`transition-all duration-500 ${view === 'providers' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest">Connect Identity</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* TronLink Option */}
            <button 
              onClick={() => onSelect('tronlink')}
              className="w-full group relative flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-primary/5 text-left"
            >
              <div className="size-14 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-3xl text-red-500">grid_view</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-display font-bold text-white uppercase tracking-wide">TronLink</h4>
                  <img 
                    src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=040" 
                    alt="Tron" 
                    className="size-5 grayscale group-hover:grayscale-0 transition-all duration-300 drop-shadow-[0_0_5px_#ff0013]" 
                  />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">TRC20 Native Protocol</p>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:text-primary transition-colors">chevron_right</span>
            </button>

            {/* WalletConnect Option */}
            <button 
              onClick={handleSelectWC}
              className="w-full group relative flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary/50 transition-all hover:bg-secondary/5 text-left"
            >
              <div className="size-14 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-3xl text-secondary">account_balance_wallet</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-display font-bold text-white uppercase tracking-wide">WalletConnect</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Multi-Chain / EVM / BTC</p>
              </div>
              <span className="material-symbols-outlined text-gray-700 group-hover:text-secondary transition-colors">chevron_right</span>
            </button>
          </div>
        </div>

        {/* View 2: WalletConnect QR */}
        <div className={`transition-all duration-500 ${view === 'walletconnect' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'}`}>
           <div className="flex items-center gap-4 mb-8">
              <button onClick={handleBack} className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all">
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </button>
              <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">Secure Pairing</h2>
           </div>

           <div className="flex flex-col items-center text-center space-y-8">
              <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(0,240,255,0.2)] group overflow-hidden">
                {/* QR Code Container */}
                <div className="relative">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=walletconnect-terminal-bridge-demo" 
                    alt="WalletConnect QR" 
                    className="size-48 lg:size-56 opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  {/* Scanning Animation */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary shadow-[0_0_15px_#00f0ff] animate-scan"></div>
                  </div>
                </div>
                {/* WC Logo Overlay */}
                <div className="absolute inset-0 m-auto size-12 bg-white rounded-xl shadow-2xl flex items-center justify-center p-1 border-2 border-secondary/20">
                  <img src="https://walletconnect.com/walletconnect-logo.svg" alt="WC Logo" className="w-full" />
                </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-center gap-3">
                    <span className="size-2 bg-secondary rounded-full animate-ping"></span>
                    <p className="text-secondary font-display font-bold uppercase tracking-[0.2em] text-sm">Awaiting Mobile Link...</p>
                 </div>
                 <p className="text-gray-500 text-[11px] font-medium max-w-[280px] leading-relaxed uppercase tracking-widest">
                   Open your favorite wallet app (Metamask, Trust, Rainbow) and scan this terminal bridge.
                 </p>
              </div>

              <button 
                onClick={handleFinalConnect}
                className="w-full py-5 rounded-2xl bg-secondary/10 border border-secondary/40 text-secondary font-display font-black uppercase tracking-[0.3em] text-xs hover:bg-secondary hover:text-black transition-all shadow-neon-cyan"
              >
                Open Desktop Protocol
              </button>
           </div>
        </div>

        <p className="mt-10 text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] leading-relaxed">
          Verifiable Entropy Handshake Active.<br/>Identity data is not stored on central nodes.
        </p>
      </div>
    </div>
  );
};

export default ConnectModal;
