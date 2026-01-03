
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Legal: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    {role: 'model', text: 'Terminal Identity verified. No cash value protocol active. How can I assist?'}
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sections = [
    {
      title: 'No Cash Value Policy',
      id: 'ncv',
      icon: 'gavel',
      content: 'This application is for recreational entertainment only. Game Credits hold no cash value and are non-redeemable. There are no mechanisms for withdrawals or real-money payouts.'
    },
    {
      title: 'Privacy Node',
      id: 'privacy',
      icon: 'shield',
      content: 'We utilize decentralized identity (TronLink) to maintain user sessions. No personal data (PII) is stored or requested by our nodes.'
    },
    {
      title: 'Responsible Synthesis',
      id: 'responsible',
      icon: '18_up_rating',
      content: 'Gaming should remain entertainment. If you experience session fatigue, we recommend self-exclusion protocols. This terminal is restricted to users 18+.'
    },
    {
      title: 'Fair Proof Protocol',
      id: 'fairplay',
      icon: 'verified',
      content: 'Terminal outcomes are determined via verifiable RNG. While house edge is present for sustainable operations, outcome variance remains decentralized.'
    }
  ];

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setChatInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the "Quantum Terminal Support". This is a SOCIAL CASINO app using NON-REDEEMABLE CREDITS. USDT-TRC20, TRX, BTC only for deposits. NO WITHDRAWALS. Speak in technical cyberpunk jargon. Assist the user regarding rules or terminal status.
        User: ${userMsg}`,
        config: { maxOutputTokens: 200 }
      });
      const text = response.text || 'Error: Protocol link interrupted.';
      setMessages(prev => [...prev, {role: 'model', text: text}]);
    } catch (err) {
      setMessages(prev => [...prev, {role: 'model', text: 'Uplink severed.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-widest">Protocol Nodes</h1>
        <p className="text-gray-400 font-sans text-lg italic opacity-70">Simulation Protocol V3.4 - Non-Redeemable Credits Only</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border-primary/30">
        <div className="flex items-center gap-6">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-neon">
            <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-white uppercase">Terminal Support</h3>
            <p className="text-gray-400 text-sm">Query the support node for terminal protocols.</p>
          </div>
        </div>
        <button onClick={() => setIsChatOpen(true)} className="px-10 py-4 bg-primary rounded-xl font-display font-black text-white text-xs uppercase shadow-neon">Open Node</button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <details key={section.id} className="group glass-panel rounded-2xl overflow-hidden border-white/5">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors select-none">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary text-2xl group-hover:neon-text-accent transition-all">{section.icon}</span>
                <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">{section.title}</h3>
              </div>
              <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="px-8 pb-8 pt-2 text-gray-400 leading-relaxed font-sans border-t border-white/5 animate-fade-in-up">
              <p className="text-base font-light">{section.content}</p>
            </div>
          </details>
        ))}
      </div>

      {isChatOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsChatOpen(false)}></div>
          <div className="relative w-full max-w-lg glass-panel rounded-[2rem] border-primary/40 flex flex-col h-[600px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-primary/10">
               <h4 className="text-white font-display font-black uppercase tracking-widest text-sm">Terminal Support</h4>
               <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-gray-300 font-mono'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-primary font-mono text-xs animate-pulse">Syncing...</div>}
            </div>
            <div className="p-6 border-t border-white/10 bg-black/40">
              <div className="flex gap-4">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Query protocol..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm outline-none font-mono" />
                <button onClick={handleSendMessage} disabled={isTyping} className="bg-primary text-white p-3 rounded-xl hover:bg-primary-glow active:scale-95 disabled:opacity-50"><span className="material-symbols-outlined">send</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legal;
