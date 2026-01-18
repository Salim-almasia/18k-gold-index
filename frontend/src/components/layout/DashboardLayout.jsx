import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '../../context/LanguageContext';

const DashboardLayout = ({ children }) => {
  const { isRTL, language } = useLanguage();

  // Set document direction on language change
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Add RTL class to body for Tailwind RTL utilities
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.style.fontFamily = "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif";
      document.body.style.textAlign = 'right';
    } else {
      document.body.classList.remove('rtl');
      document.body.style.fontFamily = "";
      document.body.style.textAlign = '';
    }
  }, [isRTL, language]);

  return (
    <div
      className={`min-h-screen bg-white flex flex-col ${isRTL ? 'font-arabic' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
