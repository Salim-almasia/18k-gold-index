import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-terminal-border bg-terminal-card mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-terminal-muted text-sm">
            &copy; {new Date().getFullYear()} Luxoria - 18k.ma
          </p>
          <div className="flex items-center gap-6">
            <span className="text-terminal-muted text-sm">
              Prix mis a jour quotidiennement
            </span>
            <Link
              to="/admin/login"
              className="text-terminal-muted hover:text-gold-400 text-sm transition-colors"
            >
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
