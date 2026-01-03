
import React, { useState } from 'react';

interface StoreProps {
  balance: number;
  streak: number;
  onUpdateBalance: (amt: number) => void;
}

const Store: React.FC<StoreProps> = ({ balance, streak, onUpdateBalance }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'waiting' | 'confirming' | 'success'>('idle');

  const cryptoPackages = [
    { name: 'Micro Bridge', cost: 10, reward: 10, currency: 'USDT (TRC20)', icon: 'token', bonus: true },
    { name: 'Quantum Node', cost: 50, reward: 50, currency: 'USDT (TRC20)', icon: 'diamond', tag: 'High Speed', highlight: true },
    { name: 'Galaxy Reserve', cost: 250, reward: 250, currency: 'TRX', icon: 'account_balance', tag: 'Whale Protocol', highlight: false },
  ];

  const handleOpenDeposit = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowDepositModal(true);
    setPaymentStatus('waiting');
  };

  const simulatePayment = () => {
    setPaymentStatus('confirming');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        onUpdateBalance(selectedPackage.reward);
        setShowDepositModal(false);
        setPaymentStatus('idle');
      }, 2000);
    }, 3000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-16 space-y-20 animate-fade-in">
      <div className="text-center space-y-8">
        <h1 className="text-6xl lg:text-9xl font-display font-black text-white uppercase tracking-tighter">
          Credit <span className="text-primary neon-text">Terminal</span>
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div className="inline-block px-10 py-4 bg-primary/10 border border-primary/40 rounded-[2rem] shadow-neon">
            <p className="text-xs lg:text-base text-primary-glow font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="material-symbols-outlined">verified</span>
              HANDSHAKE ACTIVE: +3 CREDIT BONUS ON DEPOSITS >= 10 USDT
            </p>
          </div>
          <p className="text-gray-500 text-sm lg:text-base font-bold uppercase tracking-[0.4em]">USDT-TRC20, TRX, BTC Support Only</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {cryptoPackages.map((pkg) => (
          <div 
            key={pkg.name}
            className={`cursor-target group relative p-12 lg:p-16 rounded-[4rem] glass-panel border-white/5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-4 hover:border-primary/50 shadow-2xl ${pkg.highlight ? 'bg-primary/5 shadow-[0_0_60px_rgba(139,36,255,0.15)] ring-1 ring-primary/20' : ''}`}
          >
            {pkg.tag && (
              <span className="absolute -top-6 px-8 py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-neon z-10">
                {pkg.tag}
              </span>
            )}
            
            <div className={`size-28 lg:size-36 rounded-[2.5rem] flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 ${pkg.highlight ? 'bg-primary/20 text-primary-glow shadow-neon' : 'bg-white/5 text-gray-500'}`}>
               <span className="material-symbols-outlined text-6xl lg:text-8xl">{pkg.icon}</span>
            </div>

            <h3 className="text-3xl font-display font-black text-white uppercase mb-4 tracking-wider">{pkg.name}</h3>
            <div className="flex flex-col items-center mb-12">
              <span className="text-6xl font-display font-black text-white">{pkg.reward}</span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mt-2">Game Credits</span>
            </div>

            <button 
              onClick={() => handleOpenDeposit(pkg)}
              className="w-full py-6 rounded-2xl bg-white text-black font-display font-black uppercase tracking-[0.2em] text-sm hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 cursor-target"
            >
              Sync {pkg.cost} {pkg.currency}
            </button>
          </div>
        ))}
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setShowDepositModal(false)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[4rem] p-12 lg:p-20 border-primary/50 animate-fade-in shadow-[0_0_150px_rgba(139,36,255,0.25)] my-auto">
            <div className="text-center space-y-12">
              <div className="flex items-center justify-center gap-4">
                <span className="material-symbols-outlined text-primary text-4xl neon-text">hub</span>
                <h2 className="text-4xl font-display font-black text-white uppercase tracking-[0.2em]">Quantum Link</h2>
              </div>
              
              {paymentStatus === 'waiting' ? (
                <>
                  <p className="text-gray-400 text-sm lg:text-base leading-relaxed tracking-wide">Forward <span className="text-white font-black underline decoration-primary underline-offset-8">{selectedPackage.cost} {selectedPackage.currency}</span> to the terminal address below.</p>
                  
                  <div className="bg-white p-8 rounded-[3rem] inline-block shadow-[0_0_60px_rgba(255,255,255,0.2)] group cursor-target transition-all hover:scale-105 active:scale-95">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TWr7s5yV2jP9H8kQ2nL1mZ7u3x8c6v5b4a`} alt="Terminal Address" className="w-56 h-56" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-black/80 border border-white/10 rounded-2xl p-6 flex items-center justify-between group/addr hover:border-primary/50 transition-all">
                      <span className="text-xs lg:text-sm font-mono text-gray-500 truncate mr-10 select-all tracking-wider">TWr7s5yV2jP9H8kQ2nL1mZ7u3x8c6v5b4a</span>
                      <button className="text-primary font-black text-xs uppercase tracking-widest hover:text-white transition-all cursor-target shrink-0">Copy Address</button>
                    </div>
                  </div>

                  <button 
                    onClick={simulatePayment}
                    className="w-full py-6 rounded-2xl bg-primary text-white font-display font-black uppercase tracking-[0.25em] text-sm shadow-neon hover:bg-primary-glow transition-all active:scale-[0.98] cursor-target"
                  >
                    Check Blockchain Protocol
                  </button>
                </>
              ) : paymentStatus === 'confirming' ? (
                <div className="py-32 space-y-10">
                  <div className="relative mx-auto size-32">
                     <div className="absolute inset-0 border-[6px] border-primary/20 rounded-full"></div>
                     <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-primary-glow font-display font-black text-2xl tracking-widest animate-pulse">VERIFYING SYNTHESIS...</p>
                  </div>
                </div>
              ) : (
                <div className="py-32 space-y-10">
                  <div className="size-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50 shadow-neon-gold animate-bounce">
                    <span className="material-symbols-outlined text-7xl text-green-500">check_circle</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-white font-display font-black text-4xl uppercase tracking-tighter">Terminal Linked</p>
                    <p className="text-gray-500 text-sm lg:text-base font-medium">Assets successfully synchronized. Credits are now active.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimers */}
      <div className="glass-panel p-16 rounded-[4rem] border-red-500/20 bg-red-500/5 space-y-10 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
           <span className="material-symbols-outlined text-red-500 text-5xl">gavel</span>
           <h4 className="text-white font-display font-black uppercase text-2xl lg:text-3xl tracking-widest">Notice of Gaming Finality</h4>
        </div>
        <p className="text-gray-500 text-sm lg:text-lg max-w-4xl mx-auto leading-relaxed text-center font-medium opacity-80">
          This is a simulated entertainment platform using non-redeemable Game Credits. There is no real gambling or cash value. All crypto flows directly to pre-configured cold storage and cannot be withdrawn. Not available in restricted regions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-12 border-t border-white/5">
           <div className="text-center space-y-2">
              <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] block">Reward Status</span>
              <span className="text-white font-black text-sm lg:text-base uppercase tracking-widest">Non-Redeemable</span>
           </div>
           <div className="text-center space-y-2">
              <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] block">Protocol Type</span>
              <span className="text-white font-black text-sm lg:text-base uppercase tracking-widest">Social Gaming</span>
           </div>
           <div className="text-center space-y-2">
              <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em] block">House Bias</span>
              <span className="text-white font-black text-sm lg:text-base uppercase tracking-widest">High Edge</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
