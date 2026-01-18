import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check URL first
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/ar')) {
        return 'ar';
      }
    }
    // Then check localStorage
    const saved = localStorage.getItem('language');
    return saved || 'fr';
  });

  const [translations, setTranslations] = useState({});

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to French
        const frModule = await import('../translations/fr.json');
        setTranslations(frModule.default);
      }
    };
    loadTranslations();
  }, [language]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
    // Set document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
  };

  // Translation function
  const t = (key, fallback = '') => {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return value || fallback || key;
  };

  // Check if current language is RTL
  const isRTL = language === 'ar';

  // Get localized path
  const getLocalizedPath = (path) => {
    if (language === 'ar') {
      // Remove /ar prefix if exists and add it back
      const cleanPath = path.replace(/^\/ar/, '');
      return `/ar${cleanPath === '' ? '' : cleanPath}`;
    }
    // Remove /ar prefix for French
    return path.replace(/^\/ar/, '');
  };

  // Get path without language prefix
  const getBasePath = (path) => {
    return path.replace(/^\/ar/, '') || '/';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t,
      isRTL,
      getLocalizedPath,
      getBasePath,
      translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
