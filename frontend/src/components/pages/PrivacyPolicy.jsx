import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

const PrivacyPolicy = () => {
  const { t, isRTL, getLocalizedPath } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? 'سياسة الخصوصية - 18K.MA'
      : 'Politique de Confidentialité - 18K.MA';
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
              {t('legal.privacy.title')}
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
              <p className="text-gray-600 leading-relaxed m-0" dangerouslySetInnerHTML={{ __html: t('legal.privacy.intro') }} />
            </div>

            {/* Section 1 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">1</span>
                {isRTL ? 'المسؤول عن المعالجة' : 'Responsable du traitement'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'المسؤول عن معالجة البيانات هو 18K.MA، المتاح عبر الموقع www.18k.ma. لأي سؤال يتعلق ببياناتكم، يمكنكم التواصل معنا عبر صفحة الاتصال.'
                  : 'Le responsable du traitement des données est 18K.MA, accessible via le site www.18k.ma. Pour toute question relative à vos données, vous pouvez nous contacter via notre page contact.'}
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">2</span>
                {isRTL ? 'البيانات المجمعة' : 'Données collectées'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL
                  ? 'نجمع فقط البيانات الضرورية لتشغيل الموقع:'
                  : 'Nous collectons uniquement les données strictement nécessaires au fonctionnement du site :'}
              </p>
              <div className="grid gap-3">
                <div className={`flex items-start gap-3 bg-gray-50 p-4 rounded-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-[#1A1A1A]">{isRTL ? 'نموذج الاتصال:' : 'Formulaire de contact :'}</strong>
                    <span className="text-gray-600"> {isRTL ? 'الاسم، البريد الإلكتروني، الرسالة' : 'nom, email, message'}</span>
                  </div>
                </div>
                <div className={`flex items-start gap-3 bg-gray-50 p-4 rounded-xl ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  </div>
                  <div>
                    <strong className="text-[#1A1A1A]">{isRTL ? 'بيانات التصفح:' : 'Données de navigation :'}</strong>
                    <span className="text-gray-600"> {isRTL ? 'عنوان IP، نوع المتصفح، الصفحات التي تمت زيارتها (عبر ملفات تعريف الارتباط)' : 'adresse IP, type de navigateur, pages visitées (via cookies)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">3</span>
                {isRTL ? 'استخدام البيانات' : 'Utilisation des données'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL ? 'تُستخدم بياناتكم حصرياً لـ:' : 'Vos données sont utilisées exclusivement pour :'}
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isRTL ? 'الرد على طلبات الاتصال' : 'Répondre à vos demandes de contact'}
                </li>
                <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isRTL ? 'تحسين تجربة المستخدم' : 'Améliorer l\'expérience utilisateur du site'}
                </li>
                <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isRTL ? 'تحليل زيارات الموقع (إحصائيات مجهولة)' : 'Analyser la fréquentation du site (statistiques anonymisées)'}
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">4</span>
                {isRTL ? 'مدة حفظ البيانات' : 'Conservation des données'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'يتم الاحتفاظ ببياناتكم الشخصية لمدة أقصاها 12 شهراً بعد آخر تفاعل مع خدماتنا، ما لم يكن هناك التزام قانوني بالاحتفاظ بها لفترة أطول.'
                  : 'Vos données personnelles sont conservées pour une durée maximale de 12 mois après votre dernière interaction avec nos services, sauf obligation légale de conservation plus longue.'}
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">5</span>
                {isRTL ? 'حقوقكم' : 'Vos droits'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL ? 'وفقاً للقانون رقم 09-08، لديكم الحقوق التالية:' : 'Conformément à la loi n°09-08, vous disposez des droits suivants :'}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-[#002FA7]/5 p-4 rounded-xl">
                  <strong className="text-[#002FA7]">{isRTL ? 'حق الوصول' : 'Droit d\'accès'}</strong>
                  <p className="text-gray-600 text-sm mt-1 mb-0">{isRTL ? 'الاطلاع على بياناتكم الشخصية' : 'Consulter vos données personnelles'}</p>
                </div>
                <div className="bg-[#002FA7]/5 p-4 rounded-xl">
                  <strong className="text-[#002FA7]">{isRTL ? 'حق التصحيح' : 'Droit de rectification'}</strong>
                  <p className="text-gray-600 text-sm mt-1 mb-0">{isRTL ? 'تصحيح بياناتكم غير الدقيقة' : 'Corriger vos données inexactes'}</p>
                </div>
                <div className="bg-[#002FA7]/5 p-4 rounded-xl">
                  <strong className="text-[#002FA7]">{isRTL ? 'حق الحذف' : 'Droit de suppression'}</strong>
                  <p className="text-gray-600 text-sm mt-1 mb-0">{isRTL ? 'طلب حذف بياناتكم' : 'Demander l\'effacement de vos données'}</p>
                </div>
                <div className="bg-[#002FA7]/5 p-4 rounded-xl">
                  <strong className="text-[#002FA7]">{isRTL ? 'حق الاعتراض' : 'Droit d\'opposition'}</strong>
                  <p className="text-gray-600 text-sm mt-1 mb-0">{isRTL ? 'الاعتراض على المعالجة' : 'Vous opposer au traitement'}</p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">6</span>
                {isRTL ? 'الأمان' : 'Sécurité'}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {isRTL
                  ? 'نطبق إجراءات تقنية وتنظيمية مناسبة لحماية بياناتكم من أي وصول غير مصرح به أو تعديل أو إفشاء أو تدمير. يستخدم موقعنا بروتوكول HTTPS لتأمين التبادلات.'
                  : 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction. Notre site utilise le protocole HTTPS pour sécuriser les échanges.'}
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-10">
              <h2 className={`text-xl font-bold text-[#002FA7] mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-8 h-8 bg-[#002FA7] text-white rounded-lg flex items-center justify-center text-sm">7</span>
                {isRTL ? 'التواصل والشكاوى' : 'Contact & Réclamations'}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {isRTL
                  ? 'لممارسة حقوقكم أو لأي سؤال يتعلق بهذه السياسة، تواصلوا معنا. يمكنكم أيضاً تقديم شكوى إلى CNDP (اللجنة الوطنية لحماية البيانات الشخصية).'
                  : 'Pour exercer vos droits ou pour toute question relative à cette politique, contactez-nous. Vous pouvez également adresser une réclamation à la CNDP (Commission Nationale de Contrôle de la Protection des Données à Caractère Personnel).'}
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

export default PrivacyPolicy;
