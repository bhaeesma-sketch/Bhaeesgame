
import React from 'react';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (provider: 'tronlink' | 'walletconnect') => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-fade-in"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md glass-panel rounded-[3rem] p-10 lg:p-12 border-primary/40 animate-fade-in-up shadow-[0_0_100px_rgba(139,36,255,0.2)]">
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
            onClick={() => onSelect('walletconnect')}
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

        <p className="mt-10 text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] leading-relaxed">
          Verifiable Entropy Handshake Active.<br/>Identity data is not stored on central nodes.
        </p>
      </div>
    </div>
  );
};

export default ConnectModal;
