
import React, { useState, useEffect, useRef } from 'react';
import { Screen, UserState } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Landing from './screens/Landing';
import Games from './screens/Games';
import Store from './screens/Store';
import Profile from './screens/Profile';
import Legal from './screens/Legal';
import TargetCursor from './components/TargetCursor';
import ConnectModal from './components/ConnectModal';
import { WalletConnectModal } from '@walletconnect/modal';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LANDING);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [user, setUser] = useState<UserState>({
    credits: 0.00,
    streak: 0,
    xp: 0,
    wins: 0,
    wagered: 0,
    lastWin: 0,
    hasDeposited: false,
    bonusClaimed: false,
    genesisClaimed: false,
    isConnected: false,
    walletAddress: null,
    network: null,
    provider: null
  });

  const walletConnectProjectId = 'c49870877983636598c1955986950275'; 
  
  const wcModal = new WalletConnectModal({
    projectId: walletConnectProjectId,
    chains: ['eip155:1']
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);

      // Simple reveal logic
      const reveals = document.querySelectorAll('.reveal-section');
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentScreen]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const connectTronLink = async () => {
    if ((window as any).tronWeb && (window as any).tronWeb.defaultAddress.base58) {
      const address = (window as any).tronWeb.defaultAddress.base58;
      setUser(prev => ({
        ...prev,
        isConnected: true,
        walletAddress: address,
        network: 'TRC20',
        provider: 'tronlink'
      }));
      setShowConnectModal(false);
    } else {
      const mockAddress = `T${Math.random().toString(16).slice(2, 34)}`;
      setUser(prev => ({
        ...prev,
        isConnected: true,
        walletAddress: mockAddress,
        network: 'TRC20',
        provider: 'tronlink'
      }));
      setShowConnectModal(false);
    }
  };

  const connectWalletConnect = async () => {
    try {
      await wcModal.openModal();
      const mockEthAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      setUser(prev => ({
        ...prev,
        isConnected: true,
        walletAddress: mockEthAddress,
        network: 'EVM',
        provider: 'walletconnect'
      }));
      setShowConnectModal(false);
      wcModal.closeModal();
    } catch (error) {
      console.error("WalletConnect Connection Error", error);
    }
  };

  const handleSelectProvider = (provider: 'tronlink' | 'walletconnect') => {
    if (provider === 'tronlink') connectTronLink();
    else connectWalletConnect();
  };

  const updateCredits = (amount: number, isDeposit: boolean = false) => {
    setUser(prev => {
      let finalCredits = prev.credits + amount;
      let bonusClaimed = prev.bonusClaimed;
      let hasDeposited = prev.hasDeposited;

      if (isDeposit && amount >= 10 && !prev.bonusClaimed) {
        finalCredits += 3;
        bonusClaimed = true;
        hasDeposited = true;
      } else if (isDeposit) {
        hasDeposited = true;
      }

      return { 
        ...prev, 
        credits: Math.max(0, finalCredits), 
        hasDeposited,
        bonusClaimed,
        xp: prev.xp + (Math.abs(amount) * 10),
        wins: amount > 0 && !isDeposit ? prev.wins + 1 : prev.wins,
        wagered: amount < 0 ? prev.wagered + Math.abs(amount) : prev.wagered
      };
    });
  };

  const handleClaimGenesis = (amount: number) => {
    if (user.genesisClaimed) return;
    setUser(prev => ({
      ...prev,
      credits: prev.credits + amount,
      genesisClaimed: true,
      xp: prev.xp + 500
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LANDING:
        return (
          <Landing 
            onPlay={() => handleNavigate(Screen.GAMES)} 
            onClaim={handleClaimGenesis} 
            isClaimed={user.genesisClaimed} 
            isConnected={user.isConnected}
            walletAddress={user.walletAddress}
            onConnect={() => setShowConnectModal(true)}
          />
        );
      case Screen.GAMES:
        return <Games user={user} onUpdateBalance={(amt: number) => updateCredits(amt)} />;
      case Screen.STORE:
        return <Store balance={user.credits} streak={user.streak} onUpdateBalance={(amt: number) => updateCredits(amt, true)} />;
      case Screen.PROFILE:
        return <Profile user={user} />;
      case Screen.LEGAL:
        return <Legal />;
      default:
        return <Landing onPlay={() => handleNavigate(Screen.GAMES)} onClaim={handleClaimGenesis} isClaimed={user.genesisClaimed} isConnected={user.isConnected} walletAddress={user.walletAddress} onConnect={() => setShowConnectModal(true)} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark selection:bg-primary selection:text-white overflow-x-hidden">
      <TargetCursor targetSelector=".cursor-target" />
      
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      <Header 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        balance={user.credits} 
        walletAddress={user.walletAddress}
        onConnect={() => setShowConnectModal(true)}
      />
      
      <main className="flex-grow pb-28 md:pb-12 pt-4">
        <div className="max-w-[1800px] mx-auto">
          {renderScreen()}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
      
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />

      {/* Back to Top Terminal */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-24 right-8 z-[70] size-14 rounded-xl bg-primary/10 border border-primary/40 backdrop-blur-xl flex items-center justify-center text-primary shadow-neon transition-all duration-500 cursor-target ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <span className="material-symbols-outlined text-3xl animate-bounce">expand_less</span>
      </button>

      <ConnectModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)} 
        onSelect={handleSelectProvider}
      />
    </div>
  );
};

export default App;
