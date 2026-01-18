import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();

  return (
    <footer className={`bg-[#002FA7] mt-auto relative overflow-hidden ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Galaxy Network Pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="galaxy-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Dots */}
              <circle cx="10" cy="10" r="1.5" fill="#ffffff"/>
              <circle cx="50" cy="20" r="1" fill="#ffffff"/>
              <circle cx="90" cy="15" r="1.5" fill="#ffffff"/>
              <circle cx="30" cy="50" r="1" fill="#ffffff"/>
              <circle cx="70" cy="45" r="1.5" fill="#ffffff"/>
              <circle cx="20" cy="80" r="1" fill="#ffffff"/>
              <circle cx="60" cy="75" r="1.5" fill="#ffffff"/>
              <circle cx="85" cy="85" r="1" fill="#ffffff"/>
              <circle cx="45" cy="90" r="1" fill="#ffffff"/>
              {/* Connecting lines */}
              <line x1="10" y1="10" x2="50" y2="20" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="50" y1="20" x2="90" y2="15" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="50" y1="20" x2="30" y2="50" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="30" y1="50" x2="70" y2="45" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="70" y1="45" x2="90" y2="15" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="30" y1="50" x2="20" y2="80" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="20" y1="80" x2="60" y2="75" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="60" y1="75" x2="70" y2="45" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="60" y1="75" x2="85" y2="85" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="20" y1="80" x2="45" y2="90" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
              <line x1="45" y1="90" x2="85" y2="85" stroke="#ffffff" strokeWidth="0.3" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#galaxy-pattern)"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to={getLocalizedPath('/')} className="flex items-center">
            <img
              src="/logo-18k.svg"
              alt="18k.ma"
              className="h-9"
            />
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* Instagram */}
          <a
            href="https://instagram.com/18kofficiel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/18k.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com/@18k.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
            aria-label="TikTok"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@18k_ma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>

          {/* Pinterest */}
          <a
            href="https://pinterest.com/18kofficiel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Pinterest"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          <Link
            to={getLocalizedPath('/politique-de-confidentialite')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to={getLocalizedPath('/conditions-generales-utilisation')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t('footer.cgu')}
          </Link>
          <Link
            to={getLocalizedPath('/politique-de-cookies')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t('footer.cookies')}
          </Link>
          <Link
            to={getLocalizedPath('/faq')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            FAQ
          </Link>
          <Link
            to={getLocalizedPath('/clause-non-responsabilite')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t('footer.disclaimer')}
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          {/* Copyright */}
          <div className="text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} 18K.MA - {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
