import React, { useState } from 'react';
import logoImg from '../assets/images/jalraksha_logo_prime_1789908691622.jpg';

interface JalrakshaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
  animated?: boolean;
}

export const JalrakshaLogo: React.FC<JalrakshaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  animated = true,
}) => {
  const [imgError, setImgError] = useState(false);

  let dimension = 36;
  let roundedClass = "rounded-xl";

  if (typeof size === 'number') {
    dimension = size;
    roundedClass = dimension > 48 ? "rounded-2xl" : "rounded-xl";
  } else {
    switch (size) {
      case 'xs':
        dimension = 24;
        roundedClass = "rounded-md";
        break;
      case 'sm':
        dimension = 32;
        roundedClass = "rounded-lg";
        break;
      case 'md':
        dimension = 40;
        roundedClass = "rounded-xl";
        break;
      case 'lg':
        dimension = 56;
        roundedClass = "rounded-2xl";
        break;
      case 'xl':
        dimension = 72;
        roundedClass = "rounded-2xl";
        break;
    }
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0 group select-none"
        style={{ width: dimension, height: dimension }}
      >
        {/* Ambient back-glow pulse */}
        <div 
          className={`absolute -inset-0.5 ${roundedClass} bg-gradient-to-tr from-cyan-500/40 via-blue-600/30 to-teal-400/40 blur-sm group-hover:from-cyan-400/60 group-hover:to-blue-500/60 transition-all duration-300 ${animated ? 'animate-pulse' : ''}`} 
        />

        {/* Logo Shield & Emblem Container */}
        <div 
          className={`relative w-full h-full ${roundedClass} overflow-hidden bg-slate-950 border border-cyan-400/50 group-hover:border-cyan-300 transition-all duration-300 shadow-xl shadow-cyan-950/80 flex items-center justify-center ring-1 ring-white/10`}
        >
          {!imgError ? (
            <img
              src={logoImg}
              alt="Jalraksha Prime Water Defense Emblem"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            /* Premium Geometric Vector Fallback */
            <svg
              viewBox="0 0 100 100"
              width={dimension * 0.88}
              height={dimension * 0.88}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="10" y1="0" x2="90" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="45%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="dropGrad" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="30%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="radarArcGrad" x1="20" y1="30" x2="80" y2="30" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Outer Sentinel Guardian Shape */}
              <path 
                d="M 50,6 L 86,22 C 86,56 70,82 50,94 C 30,82 14,56 14,22 Z" 
                fill="#031525" 
                stroke="url(#shieldGrad)" 
                strokeWidth="3.5" 
                strokeLinejoin="round" 
              />
              {/* Radar Microwave Scan Arcs */}
              <path d="M 26,38 A 28 28 0 0 1 74,38" stroke="url(#radarArcGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
              <path d="M 33,48 A 20 20 0 0 1 67,48" stroke="url(#radarArcGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              {/* Central Geometric Water Tear */}
              <path 
                d="M 50,22 C 50,22 68,44 68,59 C 68,69.5 59.9,78 50,78 C 40.1,78 32,69.5 32,59 C 32,44 50,22 50,22 Z" 
                fill="url(#dropGrad)" 
                filter="drop-shadow(0 4px 6px rgba(2,132,199,0.5))"
              />
              {/* Golden Core Alert Beacon */}
              <circle cx="50" cy="62" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          )}

          {/* High-tech subtle lens reflection highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/10 to-white/20 pointer-events-none" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white tracking-wider font-mono uppercase text-sm leading-none">
              JALRAKSHA
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              EO DSS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-sans tracking-tight font-medium mt-0.5">
            Post-Flood WASH Emergency Response
          </span>
        </div>
      )}
    </div>
  );
};
