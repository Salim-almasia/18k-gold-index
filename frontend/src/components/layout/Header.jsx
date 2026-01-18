import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t, isRTL, getLocalizedPath, getBasePath } = useLanguage();

  const isActive = (path) => {
    const currentPath = getBasePath(location.pathname);
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/prix-de-lor', label: t('nav.goldPrice') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const handleLanguageChange = (newLang) => {
    const basePath = getBasePath(location.pathname);
    setLanguage(newLang);
    setLangMenuOpen(false);

    // Navigate to the new language path
    if (newLang === 'ar') {
      navigate(`/ar${basePath === '/' ? '' : basePath}`);
    } else {
      navigate(basePath);
    }
  };

  const getNavLink = (path) => {
    return getLocalizedPath(path);
  };

  return (
    <header className={`bg-[#002FA7] relative z-50 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to={getNavLink('/')} className="flex items-center">
            <img
              src="/logo-18k.svg"
              alt="18k.ma"
              className="h-7"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={getNavLink(link.to)}
                className={`text-sm font-medium uppercase tracking-wide transition-colors relative ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-[#D4AF37]"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Language Selector */}
          <div className="hidden sm:block relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md cursor-pointer transition-colors"
            >
              <span className="text-sm">{language === 'ar' ? '🇲🇦' : '🇫🇷'}</span>
              <span className="text-white text-sm font-medium">
                {language === 'ar' ? 'العربية' : 'Français'}
              </span>
              <svg className={`w-4 h-4 text-white/70 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangMenuOpen(false)}
                ></div>
                <div className={`absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20 min-w-[140px] ${isRTL ? 'start-0' : 'end-0'}`}>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'} ${language === 'fr' ? 'bg-[#002FA7]/5 text-[#002FA7] font-medium' : 'text-gray-700'}`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                    {language === 'fr' && (
                      <svg className={`w-4 h-4 ${isRTL ? 'mr-auto' : 'ml-auto'} text-[#002FA7]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'} ${language === 'ar' ? 'bg-[#002FA7]/5 text-[#002FA7] font-medium' : 'text-gray-700'}`}
                  >
                    <span>🇲🇦</span>
                    <span>العربية</span>
                    {language === 'ar' && (
                      <svg className={`w-4 h-4 ${isRTL ? 'mr-auto' : 'ml-auto'} text-[#002FA7]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#002FA7] border-t border-white/10">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={getNavLink(link.to)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                } ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Language Selector */}
          <div className="px-4 pb-4 space-y-2">
            <p className={`text-white/50 text-xs uppercase tracking-wide px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('languages.fr') === 'Français' ? 'Langue' : 'اللغة'}
            </p>
            <button
              onClick={() => {
                handleLanguageChange('fr');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                language === 'fr'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5'
              } ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>🇫🇷</span>
              <span>Français</span>
            </button>
            <button
              onClick={() => {
                handleLanguageChange('ar');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                language === 'ar'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5'
              } ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>🇲🇦</span>
              <span>العربية</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
