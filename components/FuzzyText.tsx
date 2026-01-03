
import React, { useState } from 'react';

interface FuzzyTextProps {
  children: string;
  baseIntensity?: number;
  hoverIntensity?: number;
  enableHover?: boolean;
  className?: string;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  baseIntensity = 0.15,
  hoverIntensity = 0.4,
  enableHover = true,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const filterId = React.useId().replace(/:/g, "");

  const intensity = enableHover && isHovered ? hoverIntensity : baseIntensity;

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ filter: `url(#${filterId})` }}
    >
      <span className="relative z-10">{children}</span>
      
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency={intensity} 
            numOctaves="1" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale={isHovered ? "15" : "5"} 
          />
        </filter>
      </svg>
    </span>
  );
};

export default FuzzyText;
