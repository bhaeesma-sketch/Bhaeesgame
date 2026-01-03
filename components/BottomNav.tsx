
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const items = [
    { id: Screen.LANDING, label: 'Lobby', icon: 'grid_view' },
    { id: Screen.GAMES, label: 'Games', icon: 'casino' },
    { id: Screen.STORE, label: 'Store', icon: 'shopping_bag' },
    { id: Screen.PROFILE, label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto glass-panel rounded-2xl border border-white/10 shadow-2xl flex justify-around items-center p-2 pointer-events-auto bg-[#150d22]/90 backdrop-blur-xl">
        {items.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300 relative ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl animate-pulse-slow border border-primary/20"></div>
              )}
              <span className={`material-symbols-outlined text-2xl mb-1 transition-transform ${isActive ? 'scale-110 neon-text' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[9px] font-display font-bold uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#8b24ff]"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
