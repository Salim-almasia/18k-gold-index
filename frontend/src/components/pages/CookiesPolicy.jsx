import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const CookiesPolicy = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? 'سياسة ملفات تعريف الارتباط - 18K.MA'
      : 'Politique de Cookies - 18K.MA';
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
              {t('legal.cookies.title')}
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
              <p className="text-gray-600 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: t('legal.cookies.intro') }} />
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">1</span>
                {isRTL ? 'ما هو ملف تعريف الارتباط؟' : 'Qu\'est-ce qu\'un cookie ?'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'ملف تعريف الارتباط هو ملف نصي صغير يُخزن على جهازك (حاسوب، هاتف ذكي، جهاز لوحي) عند زيارة موقع ويب. تسمح ملفات تعريف الارتباط للموقع بتذكر بعض المعلومات لتسهيل تصفحك.'
                  : 'Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur un site web. Les cookies permettent au site de mémoriser certaines informations pour faciliter votre navigation.'}
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">2</span>
                {isRTL ? 'أنواع ملفات تعريف الارتباط المستخدمة' : 'Types de cookies utilisés'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL ? 'نستخدم الأنواع التالية من ملفات تعريف الارتباط:' : 'Nous utilisons les types de cookies suivants :'}
              </p>

              {/* Cookie Type Cards */}
              <div className="space-y-4">
                {/* Essential */}
                <div className="border border-gray-200 rounded-xl p-5 hover:border-[#D4AF37] transition-colors">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] m-0">{isRTL ? 'ملفات تعريف الارتباط الأساسية' : 'Cookies essentiels'}</h3>
                      <span className="text-xs text-emerald-600 font-medium">{isRTL ? 'نشطة دائماً' : 'Toujours actifs'}</span>
                    </div>
                  </div>
                  <p className={`text-gray-600 text-sm m-0 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL
                      ? 'ضرورية لتشغيل الموقع. تتيح التنقل والوصول إلى الميزات الأساسية. بدون هذه الملفات، لا يمكن للموقع أن يعمل بشكل صحيح.'
                      : 'Nécessaires au fonctionnement du site. Ils permettent la navigation et l\'accès aux fonctionnalités de base. Sans ces cookies, le site ne peut pas fonctionner correctement.'}
                  </p>
                </div>

                {/* Analytics */}
                <div className="border border-gray-200 rounded-xl p-5 hover:border-[#D4AF37] transition-colors">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] m-0">{isRTL ? 'ملفات تعريف الارتباط التحليلية' : 'Cookies analytiques'}</h3>
                      <span className="text-xs text-blue-600 font-medium">{isRTL ? 'اختيارية' : 'Optionnels'}</span>
                    </div>
                  </div>
                  <p className={`text-gray-600 text-sm m-0 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL
                      ? 'تساعدنا في فهم كيفية استخدام الزوار للموقع من خلال جمع معلومات مجهولة (الصفحات التي تمت زيارتها، الوقت المستغرق، مصدر الزيارة).'
                      : 'Nous aident à comprendre comment les visiteurs utilisent le site en collectant des informations anonymes (pages visitées, temps passé, source de trafic).'}
                  </p>
                </div>

                {/* Preferences */}
                <div className="border border-gray-200 rounded-xl p-5 hover:border-[#D4AF37] transition-colors">
                  <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] m-0">{isRTL ? 'ملفات تعريف الارتباط للتفضيلات' : 'Cookies de préférences'}</h3>
                      <span className="text-xs text-purple-600 font-medium">{isRTL ? 'اختيارية' : 'Optionnels'}</span>
                    </div>
                  </div>
                  <p className={`text-gray-600 text-sm m-0 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL
                      ? 'تسمح بتذكر تفضيلاتكم (مثل الوضع الداكن/الفاتح) لتخصيص تجربتكم في الزيارات المقبلة.'
                      : 'Permettent de mémoriser vos préférences (comme le mode sombre/clair) pour personnaliser votre expérience lors de vos prochaines visites.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 - Contact */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">3</span>
                {isRTL ? 'التواصل' : 'Contact'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'لأي سؤال يتعلق باستخدامنا لملفات تعريف الارتباط، لا تترددوا في التواصل معنا.'
                  : 'Pour toute question concernant notre utilisation des cookies, n\'hésitez pas à nous contacter.'}
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

export default CookiesPolicy;
