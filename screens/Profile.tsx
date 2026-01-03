
import React from 'react';
import { UserState } from '../types';

interface ProfileProps {
  user: UserState;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 space-y-16">
      <div className="glass-panel p-12 lg:p-20 rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
        <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>

        <div className="relative group shrink-0">
          <div className="size-56 lg:size-72 rounded-full border-4 border-primary/40 p-2 bg-[#0b0514]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-card-stroke to-background-dark flex items-center justify-center overflow-hidden relative border-2 border-white/10">
              <span className="material-symbols-outlined text-[100px] lg:text-[140px] text-white">fingerprint</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-10 text-center lg:text-left">
           <h1 className="text-6xl lg:text-8xl font-display font-black text-white tracking-tighter uppercase">Identity <span className="text-secondary neon-text">Terminal</span></h1>
           <div className="max-w-2xl mx-auto lg:mx-0 space-y-4">
              <span className="text-sm font-black text-secondary tracking-[0.4em] uppercase">Status: TronLink Synced</span>
              <p className="text-gray-500 font-mono text-sm tracking-widest">{user.walletAddress || 'WAITING_FOR_HANDSHAKE'}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 w-full lg:w-72">
          {[
            { label: 'Gaming Credits', value: user.credits.toLocaleString(), color: 'text-secondary' },
            { label: 'Wagered Buffer', value: user.wagered.toLocaleString(), color: 'text-white' },
            { label: 'XP Protocol', value: user.xp.toLocaleString(), color: 'text-primary' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center transition-all hover:border-primary/50">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] block mb-3">{stat.label}</span>
              <span className={`text-4xl font-display font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
