
import React from 'react';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  speed = 1, 
  enableShadows = true, 
  enableOnHover = false,
  className = "" 
}) => {
  return (
    <span 
      className={`relative inline-block glitch-wrapper ${enableOnHover ? 'hover-glitching' : 'glitching'} ${className}`}
      style={{ '--glitch-speed': `${speed}s` } as React.CSSProperties}
    >
      <span className="relative z-10">{children}</span>
      
      {/* Glitch layers */}
      <span className={`absolute top-0 left-0 w-full h-full glitch-layer glitch-layer-1 ${enableShadows ? 'text-secondary opacity-70' : 'text-white opacity-40'}`} aria-hidden="true">
        {children}
      </span>
      <span className={`absolute top-0 left-0 w-full h-full glitch-layer glitch-layer-2 ${enableShadows ? 'text-accent-pink opacity-70' : 'text-white opacity-40'}`} aria-hidden="true">
        {children}
      </span>

      <style>{`
        .glitch-wrapper {
          display: inline-block;
        }

        .glitch-layer {
          display: none;
          pointer-events: none;
        }

        .glitching .glitch-layer,
        .hover-glitching:hover .glitch-layer {
          display: block;
        }

        .glitching .glitch-layer-1,
        .hover-glitching:hover .glitch-layer-1 {
          animation: glitch-anim-1 var(--glitch-speed) infinite linear alternate-reverse;
          left: 2px;
          text-shadow: -2px 0 #ff00c1;
        }

        .glitching .glitch-layer-2,
        .hover-glitching:hover .glitch-layer-2 {
          animation: glitch-anim-2 var(--glitch-speed) infinite linear alternate-reverse;
          left: -2px;
          text-shadow: 2px 0 #00fff9;
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 30% 0); transform: translate(-2px, -1px); }
          10% { clip-path: inset(10% 0 85% 0); transform: translate(2px, 1px); }
          20% { clip-path: inset(50% 0 45% 0); transform: translate(-1px, 2px); }
          30% { clip-path: inset(80% 0 10% 0); transform: translate(1px, -2px); }
          40% { clip-path: inset(40% 0 20% 0); transform: translate(-2px, -1px); }
          50% { clip-path: inset(70% 0 15% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(30% 0 60% 0); transform: translate(-1px, -2px); }
          70% { clip-path: inset(15% 0 80% 0); transform: translate(2px, 1px); }
          80% { clip-path: inset(60% 0 25% 0); transform: translate(-2px, 2px); }
          90% { clip-path: inset(45% 0 40% 0); transform: translate(1px, -1px); }
          100% { clip-path: inset(25% 0 70% 0); transform: translate(-1px, 2px); }
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 80% 0); transform: translate(2px, 1px); }
          10% { clip-path: inset(60% 0 25% 0); transform: translate(-2px, -1px); }
          20% { clip-path: inset(30% 0 60% 0); transform: translate(1px, 2px); }
          30% { clip-path: inset(15% 0 85% 0); transform: translate(-2px, 1px); }
          40% { clip-path: inset(80% 0 10% 0); transform: translate(2px, -2px); }
          50% { clip-path: inset(25% 0 70% 0); transform: translate(-1px, 2px); }
          60% { clip-path: inset(45% 0 40% 0); transform: translate(2px, -1px); }
          70% { clip-path: inset(70% 0 15% 0); transform: translate(-2px, 2px); }
          80% { clip-path: inset(40% 0 20% 0); transform: translate(1px, -2px); }
          90% { clip-path: inset(50% 0 45% 0); transform: translate(-2px, 1px); }
          100% { clip-path: inset(20% 0 30% 0); transform: translate(2px, -1px); }
        }
      `}</style>
    </span>
  );
};

export default GlitchText;
