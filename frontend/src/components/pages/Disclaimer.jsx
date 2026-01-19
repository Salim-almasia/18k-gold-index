import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const Disclaimer = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? 'إخلاء المسؤولية - 18K.MA'
      : 'Clause de non-responsabilité - 18K.MA';
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
              {t('legal.disclaimer.title')}
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
              <p className="text-gray-600 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: t('legal.disclaimer.intro') }} />
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">1</span>
                {isRTL ? 'الطابع الإرشادي للأسعار' : 'Caractère indicatif des prix'}
              </h2>
              <div className={`bg-amber-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-[#D4AF37] p-6 ${isRTL ? 'rounded-l-xl' : 'rounded-r-xl'} mb-4`}>
                <p className="text-gray-700 m-0">
                  <strong>{isRTL ? 'تحذير:' : 'Avertissement :'}</strong> {isRTL
                    ? 'أسعار الذهب المعروضة على 18K.MA هي تقديرات مبنية على اتجاهات السوق ولا تمثل أسعاراً رسمية.'
                    : 'Les cours de l\'or affichés sur 18K.MA sont des estimations basées sur les tendances du marché et ne représentent pas des cotations officielles.'}
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'قد تختلف الأسعار بشكل كبير من محل مجوهرات إلى آخر وحسب المناطق. لا تشكل بأي حال ضماناً لأسعار البيع أو الشراء لدى المحترفين.'
                  : 'Les prix peuvent varier significativement d\'un bijoutier à l\'autre et selon les régions. Ils ne constituent en aucun cas une garantie de prix d\'achat ou de vente auprès des professionnels.'}
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">2</span>
                {isRTL ? 'غياب المشورة المالية' : 'Absence de conseil financier'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL
                  ? '18K.MA ليس مستشاراً مالياً أو وسيطاً في المعادن الثمينة. المحتويات المنشورة (مقالات، تحليلات، بيانات تاريخية) لا تشكل:'
                  : '18K.MA n\'est pas un conseiller financier, un courtier ou un intermédiaire en métaux précieux. Les contenus publiés (articles, analyses, données historiques) ne constituent pas :'}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside text-right' : 'list-inside'} text-gray-600 space-y-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                <li>{isRTL ? 'نصائح استثمارية شخصية' : 'Des conseils d\'investissement personnalisés'}</li>
                <li>{isRTL ? 'توصيات بيع أو شراء' : 'Des recommandations d\'achat ou de vente'}</li>
                <li>{isRTL ? 'تحريض على إجراء معاملات على الذهب' : 'Des incitations à effectuer des transactions sur l\'or'}</li>
                <li>{isRTL ? 'آراء مهنية في المسائل المالية أو الضريبية' : 'Des avis professionnels en matière financière ou fiscale'}</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">3</span>
                {isRTL ? 'دقة المعلومات' : 'Exactitude des informations'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL
                  ? 'رغم سعينا لتقديم معلومات دقيقة ومحدثة، لا يمكن لـ 18K.MA ضمان:'
                  : 'Bien que nous nous efforcions de fournir des informations précises et à jour, 18K.MA ne peut garantir :'}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside text-right' : 'list-inside'} text-gray-600 space-y-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                <li>{isRTL ? 'دقة أو شمولية البيانات المعروضة' : 'L\'exactitude ou l\'exhaustivité des données affichées'}</li>
                <li>{isRTL ? 'استمرارية توفر الخدمة' : 'La disponibilité continue du service'}</li>
                <li>{isRTL ? 'غياب الأخطاء التقنية أو التأخير في التحديث' : 'L\'absence d\'erreurs techniques ou de retards dans la mise à jour'}</li>
                <li>{isRTL ? 'مطابقة الأسعار مع تلك التي يمارسها المحترفون' : 'La conformité des prix avec ceux pratiqués par les professionnels'}</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">4</span>
                {isRTL ? 'إخلاء المسؤولية' : 'Exclusion de responsabilité'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL ? '18K.MA يخلي مسؤوليته في حالة:' : '18K.MA décline toute responsabilité en cas de :'}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside text-right' : 'list-inside'} text-gray-600 space-y-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                <li>{isRTL ? 'خسائر مالية مرتبطة بقرارات مبنية على معلوماتنا' : 'Pertes financières liées à des décisions basées sur nos informations'}</li>
                <li>{isRTL ? 'اختلافات بين الأسعار المعروضة والأسعار الفعلية' : 'Différences entre les prix affichés et les prix réels pratiqués'}</li>
                <li>{isRTL ? 'عدم توفر الموقع مؤقتاً أو دائماً' : 'Indisponibilité temporaire ou permanente du site'}</li>
                <li>{isRTL ? 'أخطاء أو سهو في المحتويات المنشورة' : 'Erreurs ou omissions dans les contenus publiés'}</li>
                <li>{isRTL ? 'أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع' : 'Dommages directs ou indirects résultant de l\'utilisation du site'}</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">5</span>
                {isRTL ? 'التوصيات' : 'Recommandations'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL ? 'قبل أي معاملة على الذهب، ننصحكم بـ:' : 'Avant toute transaction sur l\'or, nous vous recommandons de :'}
              </p>
              <ul className={`list-disc ${isRTL ? 'list-inside text-right' : 'list-inside'} text-gray-600 space-y-2 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                <li>{isRTL ? 'استشارة عدة محلات مجوهرات لمقارنة الأسعار' : 'Consulter plusieurs bijoutiers pour comparer les prix'}</li>
                <li>{isRTL ? 'التحقق من الدمغة الرسمية ومطابقة المجوهرات' : 'Vérifier le poinçon officiel et la conformité du bijou'}</li>
                <li>{isRTL ? 'طلب فاتورة مفصلة تذكر الوزن والقيراط' : 'Demander une facture détaillée mentionnant le poids et le karat'}</li>
                <li>{isRTL ? 'استشارة خبير في حالة الشك حول الأصالة' : 'Faire appel à un expert en cas de doute sur l\'authenticité'}</li>
                <li>{isRTL ? 'استشارة مستشار مالي لأي استثمار كبير' : 'Consulter un conseiller financier pour tout investissement significatif'}</li>
              </ul>
            </div>

            {/* Section 6 - Contact */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">6</span>
                {isRTL ? 'التواصل' : 'Contact'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'لأي سؤال يتعلق بهذا البيان، يمكنكم التواصل معنا:'
                  : 'Pour toute question concernant cette clause, vous pouvez nous contacter :'}
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

export default Disclaimer;
