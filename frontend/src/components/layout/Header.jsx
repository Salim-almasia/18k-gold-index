import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  return (
    <header className="border-b border-terminal-border bg-terminal-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gold-400">LUXORIA</span>
            <span className="text-terminal-muted text-sm hidden sm:block">| Cours de l'Or au Maroc</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-terminal-muted text-sm hidden sm:block">En direct</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
