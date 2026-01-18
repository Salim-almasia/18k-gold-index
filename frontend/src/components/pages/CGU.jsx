import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const CGU = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? 'شروط الاستخدام - 18K.MA'
      : 'Conditions Générales d\'Utilisation - 18K.MA';
  }, [isRTL]);

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className={`relative bg-[#FAFAFA] overflow-hidden ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Watermark gold bars */}
        <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-1/2 pointer-events-none select-none opacity-[0.04]`}>
          <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <rect x="50" y="80" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 110 100)"/>
            <rect x="55" y="85" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 110 100)"/>
            <rect x="150" y="120" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 210 140)"/>
            <rect x="155" y="125" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 210 140)"/>
            <rect x="100" y="160" width="120" height="40" rx="4" fill="#D4AF37" transform="rotate(-15 160 180)"/>
            <rect x="105" y="165" width="110" height="30" rx="2" fill="#B8963E" transform="rotate(-15 160 180)"/>
            <circle cx="300" cy="100" r="35" fill="#D4AF37"/>
            <circle cx="300" cy="100" r="28" fill="#B8963E"/>
            <circle cx="320" cy="140" r="35" fill="#D4AF37"/>
            <circle cx="320" cy="140" r="28" fill="#C9A961"/>
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className={`flex items-center justify-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.2em]">{t('legal.eyebrow')}</span>
              <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              {t('legal.cgu.title')}
            </h1>
            <p className="text-gray-500">
              {t('legal.lastUpdated')}
            </p>
          </div>
        </div>

        {/* Bottom border */}
        <div className={`h-px bg-gradient-to-r ${isRTL ? 'from-transparent via-gray-200 to-[#D4AF37]' : 'from-[#D4AF37] via-gray-200 to-transparent'}`}></div>
      </section>

      {/* Content */}
      <section className={`py-16 bg-white ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <div className="bg-[#FAFAFA] rounded-2xl p-8 mb-10 border border-gray-100">
              <p className="text-gray-600 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: t('legal.cgu.intro') }} />
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">1</span>
                {t('legal.cgu.section1Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section1Content')}
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">2</span>
                {t('legal.cgu.section2Title')}
              </h2>
              <div className={`bg-amber-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-[#D4AF37] p-6 ${isRTL ? 'rounded-l-xl' : 'rounded-r-xl'} mb-4`}>
                <p className="text-gray-700 m-0" dangerouslySetInnerHTML={{ __html: t('legal.cgu.section2Warning') }} />
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section2Content')}
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">3</span>
                {t('legal.cgu.section3Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section3Content')}
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">4</span>
                {t('legal.cgu.section4Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('legal.cgu.section4Content1')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section4Content2')}
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">5</span>
                {t('legal.cgu.section5Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section5Content')}
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">6</span>
                {t('legal.cgu.section6Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section6Content')}
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">7</span>
                {t('legal.cgu.section7Title')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('legal.cgu.section7Content')}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  to={getLocalizedPath('/contact')}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('legal.contactUs')}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CGU;
