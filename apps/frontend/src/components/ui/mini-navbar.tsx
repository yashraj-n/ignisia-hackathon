"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';

const AnimatedNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: (e: React.MouseEvent) => void }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const [isScrolled, setIsScrolled] = useState(false);
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const smoothScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  const logoElement = (
    <div className="flex items-center gap-2.5">
      <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-7 h-7 object-contain" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-extrabold text-xl tracking-tighter">BidForge<span className="text-[#D4AF37]">.</span></span>
    </div>
  );

  const navLinksData = [
    { label: 'Features', targetId: 'features' },
    { label: 'How It Works', targetId: 'how-it-works' },
    { label: 'Tech Stack', targetId: 'tech-stack' },
    { label: 'FAQ', targetId: 'faq' },
  ];

  const signupButtonElement = (
    <Link to="/auth">
      <button className="relative z-10 px-6 py-2 text-sm font-semibold text-black bg-[#D4AF37] rounded-full hover:bg-[#ebd074] transition-all duration-200 cursor-pointer">
        Sign Up
      </button>
    </Link>
  );

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-3 py-2 backdrop-blur-md
                       ${headerShapeClass}
                       border border-[#333] ${isScrolled ? 'bg-[#0a0a0a]/90' : 'bg-[#1f1f1f80]'}
                       w-fit
                       transition-[border-radius,background-color,padding] duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-8">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          {logoElement}
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden lg:flex items-center justify-center gap-8 text-sm px-4">
          {navLinksData.map((link) => (
            <AnimatedNavLink
              key={link.targetId}
              href={`#${link.targetId}`}
              onClick={(e) => smoothScroll(e, link.targetId)}
            >
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        {/* Right: Buttons */}
        <div className="hidden lg:flex flex-shrink-0 items-center justify-end">
          {signupButtonElement}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none shrink-0" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a
              key={link.targetId}
              href={`#${link.targetId}`}
              onClick={(e) => smoothScroll(e, link.targetId)}
              className="text-gray-300 hover:text-white transition-colors w-full text-center"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}
