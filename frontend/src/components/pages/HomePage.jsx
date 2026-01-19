import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import API_URL from '../../config';

const HomePage = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    setNewsletterError('');

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Erreur lors de l\'inscription');
      }

      setNewsletterSubmitted(true);
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterError(error.message);
    } finally {
      setNewsletterLoading(false);
    }
  };

  useEffect(() => {
    document.title = isRTL
      ? 'وسائط المجوهرات والساعات الفاخرة في المغرب | أخبار'
      : 'Média Bijoux & Horlogerie de Luxe au Maroc | Actualités';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', isRTL
        ? 'المرجع الإعلامي في المغرب للذهب والمجوهرات والساعات الفاخرة: أخبار، اتجاهات، تحليلات وعالم حصري للمهنيين والهواة.'
        : 'Le média de référence au Maroc sur l\'or, les bijoux et l\'horlogerie de luxe : actualités, tendances, analyses et univers exclusif pour professionnels et passionnés.'
      );
    }
  }, [isRTL]);

  return (
    <DashboardLayout>
      {/* Hero Section - Clean White */}
      <section className={`bg-white pt-8 pb-12 lg:pt-12 lg:pb-16 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Content - 5 cols */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#002FA7]/5 rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D2A24C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D2A24C]"></span>
                </span>
                <span className="text-xs font-medium text-[#002FA7]">{t('home.hero.badge')}</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-[#002FA7] mb-3 leading-[1.1]">
                {t('home.hero.title')} <span className="text-[#D2A24C]">{t('home.hero.titleHighlight')}</span>
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('home.hero.description')}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={getLocalizedPath('/prix-de-lor')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white text-sm font-semibold rounded-lg hover:bg-[#001f7a] transition-all shadow-lg shadow-[#002FA7]/20"
                >
                  {t('home.hero.cta')}
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to={getLocalizedPath('/blog')}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-[#002FA7] hover:text-[#002FA7] transition-all"
                >
                  {t('home.hero.blog')}
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-[#002FA7]">18K</p>
                  <p className="text-xs text-gray-500">{t('home.stats.reference')}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-[#D2A24C]">75%</p>
                  <p className="text-xs text-gray-500">{t('home.stats.purity')}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">24/7</p>
                  <p className="text-xs text-gray-500">{t('home.stats.access')}</p>
                </div>
              </div>
            </div>

            {/* Image - 7 cols */}
            <div className={`lg:col-span-7 relative ${isRTL ? 'lg:order-first' : ''}`}>
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/cours-or-maroc-prix-or-aujourdhui.jpeg"
                    alt="Cours de l'or au Maroc aujourd'hui, prix de l'or en dirham marocain"
                    className="w-full h-[320px] lg:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#002FA7]/20 via-transparent to-[#D2A24C]/10"></div>
                </div>

                {/* Floating Card */}
                <div className={`absolute -bottom-4 ${isRTL ? 'right-4 lg:right-8' : 'left-4 lg:left-8'} bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D2A24C] to-[#b8893f] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <p className="text-xs text-gray-500">{isRTL ? 'سعر الذهب 18 قيراط' : 'Cours Or 18K'}</p>
                    <p className="text-lg font-bold text-[#002FA7]">{isRTL ? 'درهم / غرام' : 'MAD / gramme'}</p>
                  </div>
                </div>

                {/* Decorative */}
                <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} w-20 h-20 border-2 border-[#D2A24C]/20 rounded-xl -z-10`}></div>
                <div className={`absolute -bottom-2 ${isRTL ? '-left-2' : '-right-2'} w-32 h-32 bg-[#002FA7]/5 rounded-full -z-10 blur-2xl`}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className={`bg-[#002FA7] py-4 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{t('home.features.reliable')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{t('home.features.daily')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{t('home.features.moroccan')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium">{t('home.features.transparent')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* L'or 18 karats + Vision sobre - Combined */}
      <section className={`bg-gray-50 py-12 lg:py-16 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - 18K Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-48">
                <img
                  src="/or-18-carats-maroc-750.webp"
                  alt="Or 18 karats au Maroc, pureté 750 et valeur réelle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <span className="px-3 py-1 bg-[#D2A24C] text-white text-xs font-bold rounded-full">{isRTL ? '18 قيراط' : '18 KARATS'}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#002FA7] mb-2">
                  {t('home.karat.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('home.karat.description')}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#002FA7]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">{t('home.karat.purity')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D2A24C]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">{t('home.karat.solidity')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#002FA7]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">{t('home.karat.elegance')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Vision */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img src="/icon-18k.png" alt="18k" className="w-12 h-12 rounded-xl" />
                  <div>
                    <h3 className="text-xl font-bold text-[#002FA7]">{t('home.vision.title')}</h3>
                    <p className="text-xs text-gray-500">{t('home.vision.subtitle')}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('home.vision.description1')}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {t('home.vision.description2')}
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#002FA7]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span className="text-xs font-semibold text-[#002FA7]">{t('home.vision.neutrality')}</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#D2A24C]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#D2A24C]">{t('home.vision.clarity')}</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#002FA7]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#002FA7]">{t('home.vision.elegance')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className={`bg-white py-12 lg:py-16 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#002FA7]">{t('home.expertise.title')}</h2>
              <p className="text-gray-500 text-sm mt-1">{t('home.expertise.subtitle')}</p>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <div className="w-8 h-1 bg-[#D2A24C] rounded-full"></div>
              <div className="w-2 h-1 bg-[#D2A24C]/50 rounded-full"></div>
            </div>
          </div>

          {/* Or & valeur - Wide Rectangular Card */}
          <Link to={getLocalizedPath('/blog/or-valeur')} className="group relative rounded-xl overflow-hidden h-[280px] lg:h-[320px] block mb-6">
            <img
              src="/valeur-or-maroc-prix-purete.webp"
              alt="Valeur de l'or au Maroc, prix, pureté et perception de la valeur"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className={`absolute inset-0 ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#1A1A1A] via-[#1A1A1A]/70 to-transparent`}></div>
            <div className={`absolute inset-0 p-8 lg:p-10 flex flex-col justify-center max-w-2xl ${isRTL ? 'right-0 text-right items-end' : ''}`}>
              <div className="w-12 h-12 rounded-xl bg-[#D2A24C] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">{t('categories.orValeur.title')}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4 max-w-lg">
                {t('categories.orValeur.description')}
              </p>
              <span className={`inline-flex items-center gap-2 text-[#D2A24C] text-sm font-semibold group-hover:gap-3 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('home.expertise.explore')}
                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>

          {/* 4 cards in 2 rows x 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bijouterie & horlogerie */}
            <Link to={getLocalizedPath('/blog/bijouterie-horlogerie')} className="group relative rounded-xl overflow-hidden h-[280px] lg:h-[300px] block">
              <img
                src="/bijouterie-horlogerie-maroc-guide.webp"
                alt="Bijouterie et horlogerie au Maroc, bijoux et montres expliqués"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : ''}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{t('categories.bijouterieHorlogerie.title')}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
                  {t('categories.bijouterieHorlogerie.description')}
                </p>
                <span className={`inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.expertise.discover')}
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Diamant & pierres */}
            <Link to={getLocalizedPath('/blog/diamant-pierres')} className="group relative rounded-xl overflow-hidden h-[280px] lg:h-[300px] block">
              <img
                src="/diamants-pierres-precieuses-maroc.webp"
                alt="Diamants et pierres précieuses au Maroc, bagues et bracelets"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : ''}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{t('categories.diamantPierres.title')}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
                  {t('categories.diamantPierres.description')}
                </p>
                <span className={`inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.expertise.discover')}
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Métier & savoir-faire */}
            <Link to={getLocalizedPath('/blog/metier-savoir-faire')} className="group relative rounded-xl overflow-hidden h-[280px] lg:h-[300px] block">
              <img
                src="/artisan-bijoutier-maroc-savoir-faire.webp"
                alt="Métier de bijoutier au Maroc, savoir-faire et artisanat traditionnel"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : ''}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{t('categories.metierSavoirFaire.title')}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
                  {t('categories.metierSavoirFaire.description')}
                </p>
                <span className={`inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.expertise.discover')}
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Croyances & idées reçues */}
            <Link to={getLocalizedPath('/blog/croyances-idees-recues')} className="group relative rounded-xl overflow-hidden h-[280px] lg:h-[300px] block">
              <img
                src="/croyances-bijoux-or-maroc.webp"
                alt="Idées reçues sur l'or et les bijoux au Maroc, mythes et réalités"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/50 to-transparent"></div>
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : ''}`}>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">{t('categories.croyancesIdees.title')}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md">
                  {t('categories.croyancesIdees.description')}
                </p>
                <span className={`inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('home.expertise.discover')}
                  <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-gradient-to-br from-[#002FA7] to-[#001a5c] py-12 lg:py-14 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-start">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {t('home.cta.title')} <span className="text-[#D2A24C]">{t('home.cta.titleHighlight')}</span>
              </h2>
              <p className="text-white/60 text-sm">
                {t('home.cta.description')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={getLocalizedPath('/prix-de-lor')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D2A24C] text-white text-sm font-semibold rounded-lg hover:bg-[#b8893f] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {t('home.cta.button')}
              </Link>
              <Link
                to={getLocalizedPath('/blog')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                {t('home.cta.blog')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`bg-white py-16 lg:py-20 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D2A24C] to-[#b8893f] mb-6 shadow-lg shadow-[#D2A24C]/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-3">
                {t('home.newsletter.title')}
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-xl mx-auto">
                {t('home.newsletter.description')}
              </p>
            </div>

            {/* Form */}
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-10 border border-gray-100">
              {!newsletterSubmitted ? (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 start-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder={t('home.newsletter.placeholder')}
                        required
                        disabled={newsletterLoading}
                        className="w-full ps-12 pe-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#002FA7] focus:ring-2 focus:ring-[#002FA7]/10 transition-all disabled:opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-all shadow-lg shadow-[#002FA7]/20 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newsletterLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isRTL ? 'جاري التسجيل...' : 'Envoi...'}
                        </>
                      ) : (
                        <>
                          {t('home.newsletter.button')}
                          <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                  {newsletterError && (
                    <p className="text-red-500 text-sm text-center">{newsletterError}</p>
                  )}
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {isRTL ? 'شكراً لك!' : 'Merci !'}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL
                      ? 'تم تسجيل بريدك الإلكتروني بنجاح. سنبقيك على اطلاع بآخر أخبار سوق الذهب.'
                      : 'Votre adresse e-mail a bien été enregistrée. Nous vous tiendrons informé des dernières actualités du marché de l\'or.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default HomePage;
