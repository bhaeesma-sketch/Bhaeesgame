
import React, { useState, useEffect } from 'react';
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

  // Project ID for WalletConnect V2 (Placeholder)
  const walletConnectProjectId = 'c49870877983636598c1955986950275'; 
  
  const wcModal = new WalletConnectModal({
    projectId: walletConnectProjectId,
    chains: ['eip155:1']
  });

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
      // Simulation for non-TronLink environments if user insists
      const mockAddress = `T${Math.random().toString(16).slice(2, 34)}`;
      setUser(prev => ({
        ...prev,
        isConnected: true,
        walletAddress: mockAddress,
        network: 'TRC20',
        provider: 'tronlink'
      }));
      setShowConnectModal(false);
      console.warn("TronLink not detected. Using simulated TRC20 address.");
    }
  };

  const connectWalletConnect = async () => {
    try {
      // Using open() which triggers the modal to connect
      await wcModal.openModal();
      
      // Since this is a standalone modal in a demo environment, 
      // we'll simulate a successful connection after the modal interaction.
      // In a real app, you'd listen to the session_event.
      
      // Simulating connection result for this demo:
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
      
      <Header 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        balance={user.credits} 
        walletAddress={user.walletAddress}
        onConnect={() => setShowConnectModal(true)}
      />
      
      <main className="flex-grow pb-28 md:pb-12 pt-4">
        <div className="max-w-[1800px] mx-auto transition-all duration-500 ease-in-out">
          {renderScreen()}
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
      
      <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />

      <ConnectModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)} 
        onSelect={handleSelectProvider}
      />
    </div>
  );
};

export default App;
