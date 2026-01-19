import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const FAQ = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    document.title = isRTL
      ? 'الأسئلة الشائعة - أسئلة متكررة حول الذهب في المغرب'
      : 'FAQ - Questions Fréquentes sur l\'Or au Maroc';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', isRTL
        ? 'اعثر على إجابات لأسئلتك حول سعر الذهب في المغرب، ذهب 18 قيراط، شراء وبيع الذهب، والمزيد.'
        : 'Trouvez les réponses à vos questions sur le prix de l\'or au Maroc, l\'or 18 karats, l\'achat et la vente d\'or, et bien plus encore.'
      );
    }
  }, [isRTL]);

  // Get FAQ questions from translation file
  const faqs = t('faq.questions') || [];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className="relative bg-[#FAFAFA] overflow-hidden">
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
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.2em]">{t('faq.eyebrow')}</span>
              <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              {t('faq.title')}
            </h1>
            <p className="text-gray-500">
              {t('faq.subtitle')}
            </p>
          </div>
        </div>

        {/* Bottom border */}
        <div className={`h-px bg-gradient-to-r ${isRTL ? 'from-transparent via-gray-200 to-[#D4AF37]' : 'from-[#D4AF37] via-gray-200 to-transparent'}`}></div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {Array.isArray(faqs) && faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#FAFAFA] rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-6 py-5 flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                >
                  <span className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="flex-shrink-0 w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className={`font-semibold text-[#1A1A1A] ${isRTL ? 'pl-4' : 'pr-4'}`}>{faq.question}</span>
                  </span>
                  <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-[#D4AF37] text-white'
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-6 pt-0">
                    <div className={`${isRTL ? 'pr-12 border-r-2 mr-4' : 'pl-12 border-l-2 ml-4'} border-[#D4AF37]/30`}>
                      <p className={`text-gray-600 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12">
            <div className={`bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100 text-center ${isRTL ? 'text-right' : ''}`}>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                {t('faq.contactTitle')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('faq.contactDescription')}
              </p>
              <Link
                to={getLocalizedPath('/contact')}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('faq.contactButton')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default FAQ;
