"use client";

import React, { useState, useEffect, useRef } from "react";
import { EyeBall, Pupil } from "./CharacterEyes";

interface AnimatedCharactersProps {
  isTyping: boolean;
  showPassword?: boolean;
  passwordLength?: number;
}

export const AnimatedCharacters = ({ 
  isTyping, 
  showPassword = false,
  passwordLength = 0
}: AnimatedCharactersProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPurpleBlinking(true);
      setTimeout(() => setIsPurpleBlinking(false), 150);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlackBlinking(true);
      setTimeout(() => setIsBlackBlinking(false), 150);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      const peekInterval = setInterval(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearInterval(peekInterval);
    } else {
      setIsPurplePeeking(false);
    }
  }, [passwordLength, showPassword]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-[#050505] p-12 text-primary-foreground min-h-screen overflow-hidden">
      {/* Chromatic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(97,43,107,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
      
      <div className="relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
            <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-bold text-xl tracking-tight leading-none">
              <span className="text-white">Bid</span>
              <span className="text-[#D4AF37]">Forge</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-none opacity-50">Enterprise</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-end justify-center h-[500px]">
        <div className="relative" style={{ width: '550px', height: '400px' }}>
          {/* Deep Purple Character */}
          <div 
            ref={purpleRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out border border-white/5"
            style={{
              left: '70px',
              width: '180px',
              height: (isTyping || (passwordLength > 0 && !showPassword)) ? '440px' : '400px',
              backgroundColor: '#612B6B',
              borderRadius: '10px 10px 0 0',
              zIndex: 1,
              transform: (passwordLength > 0 && showPassword)
                ? `skewX(0deg)`
                : (isTyping || (passwordLength > 0 && !showPassword))
                  ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                  : `skewX(${purplePos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              boxShadow: 'inset 0 20px 40px rgba(255,255,255,0.05), 0 0 40px rgba(97,43,107,0.2)',
            }}
          >
            <div 
              className="absolute flex gap-8 transition-all duration-700 ease-in-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                top: (passwordLength > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
              }}
            >
              <EyeBall 
                size={18} pupilSize={7} maxDistance={5} eyeColor="#E5E5E5" pupilColor="#0A0A0A" 
                isBlinking={isPurpleBlinking}
                forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
              <EyeBall 
                size={18} pupilSize={7} maxDistance={5} eyeColor="#E5E5E5" pupilColor="#0A0A0A" 
                isBlinking={isPurpleBlinking}
                forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
              />
            </div>
          </div>

          {/* Berry Magenta Character */}
          <div 
            ref={blackRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out border border-white/5"
            style={{
              left: '240px',
              width: '120px',
              height: '310px',
              backgroundColor: '#AD3964',
              borderRadius: '8px 8px 0 0',
              zIndex: 2,
              transform: (passwordLength > 0 && showPassword)
                ? `skewX(0deg)`
                : isLookingAtEachOther
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : (isTyping || (passwordLength > 0 && !showPassword))
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                    : `skewX(${blackPos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              boxShadow: 'inset 0 15px 30px rgba(255,255,255,0.05), 0 0 30px rgba(173,57,100,0.2)',
            }}
          >
            <div 
              className="absolute flex gap-6 transition-all duration-700 ease-in-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                top: (passwordLength > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
              }}
            >
              <EyeBall 
                size={16} pupilSize={6} maxDistance={4} eyeColor="#E5E5E5" pupilColor="#0A0A0A" 
                isBlinking={isBlackBlinking}
                forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
              <EyeBall 
                size={16} pupilSize={6} maxDistance={4} eyeColor="#E5E5E5" pupilColor="#0A0A0A" 
                isBlinking={isBlackBlinking}
                forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
              />
            </div>
          </div>

          {/* Sunset Orange Character */}
          <div 
            ref={orangeRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out border border-white/10"
            style={{
              left: '0px',
              width: '240px',
              height: '200px',
              zIndex: 3,
              backgroundColor: '#F28D5A',
              borderRadius: '120px 120px 0 0',
              transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              boxShadow: 'inset 0 20px 40px rgba(255,255,255,0.15), 0 0 25px rgba(242,141,90,0.15)',
            }}
          >
            <div 
              className="absolute flex gap-8 transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#0A0A0A" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#0A0A0A" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
            </div>
          </div>

          {/* Canary Yellow Character */}
          <div 
            ref={yellowRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out border border-white/20"
            style={{
              left: '310px',
              width: '140px',
              height: '230px',
              backgroundColor: '#F8EE6A',
              borderRadius: '70px 70px 0 0',
              zIndex: 4,
              transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
              boxShadow: 'inset 0 15px 30px rgba(255,255,255,0.3), 0 0 20px rgba(248,238,106,0.1)',
            }}
          >
            <div 
              className="absolute flex gap-6 transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#0A0A0A" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#0A0A0A" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
            </div>
            <div 
              className="absolute w-20 h-[4px] bg-[#0A0A0A]/30 rounded-full transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative Glows using Palette */}
      <div className="absolute top-1/4 right-1/4 size-64 bg-magenta/5 rounded-full blur-3xl opacity-30" style={{ backgroundColor: '#AD3964' }}  />
      <div className="absolute bottom-1/4 left-1/4 size-96 bg-purple/10 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#612B6B' }} />
    </div>
  );
};


