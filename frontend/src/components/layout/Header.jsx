import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#002FA7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-0.5">
            <span className="text-white text-2xl font-bold tracking-tight">|||</span>
            <span className="text-white text-2xl font-bold">18k</span>
            <span className="text-white/60 text-2xl font-light">.ma</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link
              to="/"
              className="text-white/90 hover:text-white text-sm font-medium uppercase tracking-wide transition-colors"
            >
              Accueil
            </Link>
            <span className="text-white/50 text-sm font-medium uppercase tracking-wide cursor-not-allowed">
              Blog
            </span>
            <span className="text-white text-sm font-medium uppercase tracking-wide">
              Prix de l'Or
            </span>
          </nav>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md cursor-pointer transition-colors">
            <span className="text-sm">🇫🇷</span>
            <span className="text-white text-sm font-medium">Français</span>
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Mobile Menu Button */}
          <button className="sm:hidden p-2 text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
