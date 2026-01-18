import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import DashboardLayout from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';

// ============================================
// CONFIGURATION EMAILJS - À REMPLIR
// ============================================
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
// ============================================

const Contact = () => {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? 'اتصل بنا - وسائط المجوهرات والساعات الفاخرة في المغرب'
      : 'Contact - Média Bijoux et Montres de Luxe au Maroc';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', isRTL
        ? 'تواصل مع فريقنا الإعلامي المتخصص في المجوهرات والساعات الفاخرة في المغرب لأي سؤال أو تعاون أو شراكة أو معلومات.'
        : 'Contactez notre équipe média spécialisée en bijoux et horlogerie de luxe au Maroc pour toute question, collaboration, partenariat ou information.'
      );
    }
  }, [isRTL]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // CAPTCHA state
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Generate new CAPTCHA (alphanumeric code)
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaAnswer('');
    setCaptchaError(false);
  };

  // Initialize CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verify CAPTCHA
    if (captchaAnswer.toUpperCase() !== captchaCode) {
      setCaptchaError(true);
      generateCaptcha();
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    // Map subject value to readable text
    const subjectLabels = {
      'info': t('contact.form.subjectInfo'),
      'price': t('contact.form.subjectPrice'),
      'partnership': t('contact.form.subjectPartnership'),
      'press': t('contact.form.subjectPress'),
      'other': t('contact.form.subjectOther')
    };

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: subjectLabels[formData.subject] || formData.subject,
      message: formData.message,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setStatus({ type: 'success', message: t('contact.form.success') });
      setFormData({ name: '', email: '', subject: '', message: '' });
      generateCaptcha();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({ type: 'error', message: t('contact.form.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Combined Hero + Form Section */}
      <section className={`relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1920&q=80"
            alt="Gold"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${isRTL ? 'from-[#1A1A1A]/70 via-[#1A1A1A]/85 to-[#1A1A1A]/95' : 'from-[#1A1A1A]/95 via-[#1A1A1A]/85 to-[#1A1A1A]/70'}`}></div>
        </div>

        {/* Content Grid */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left: Info */}
            <div className="text-center lg:text-start">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <div className="w-10 h-[2px] bg-[#D4AF37]"></div>
                <span className="text-xs font-medium text-[#D4AF37] uppercase tracking-[0.2em]">{t('contact.title')}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {t('contact.heroTitle')}
                <span className="block text-[#D4AF37]">{t('contact.heroHighlight')}</span>
              </h1>

              <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                {t('contact.heroDescription')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="mailto:contact@18k.ma"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-[#D4AF37] group-hover:bg-white rounded-lg flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-white group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-start">
                    <p className="text-xs text-gray-400 group-hover:text-white/80 transition-colors">{t('contact.info.email')}</p>
                    <p className="text-white font-semibold">contact@18k.ma</p>
                  </div>
                </a>
              </div>

            </div>

            {/* Right: Form Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-[#1A1A1A] mb-1">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                {t('contact.form.subtitle')}
              </p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.namePlaceholder')}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#D4AF37] focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.emailPlaceholder')}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#D4AF37] focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    {t('contact.form.subject')}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#D4AF37] focus:bg-white transition-all outline-none text-gray-700 text-sm"
                  >
                    <option value="">{t('contact.form.subjectPlaceholder')}</option>
                    <option value="info">{t('contact.form.subjectInfo')}</option>
                    <option value="price">{t('contact.form.subjectPrice')}</option>
                    <option value="partnership">{t('contact.form.subjectPartnership')}</option>
                    <option value="press">{t('contact.form.subjectPress')}</option>
                    <option value="other">{t('contact.form.subjectOther')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#D4AF37] focus:bg-white transition-all outline-none text-gray-700 placeholder-gray-400 resize-none text-sm"
                  />
                </div>

                {/* CAPTCHA - Alphanumeric */}
                <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{t('contact.form.captcha')}</span>
                    <div className="relative bg-[#1A1A1A] px-4 py-2 rounded-lg select-none">
                      <span
                        className="text-lg font-mono font-bold tracking-[0.3em] text-[#D4AF37]"
                        style={{
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                          letterSpacing: '0.25em'
                        }}
                      >
                        {captchaCode}
                      </span>
                      {/* Noise lines */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 transform -rotate-3"></div>
                        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/10 transform rotate-2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={captchaAnswer}
                      onChange={(e) => {
                        setCaptchaAnswer(e.target.value.toUpperCase());
                        setCaptchaError(false);
                      }}
                      required
                      maxLength={5}
                      placeholder={t('contact.form.captchaPlaceholder')}
                      className={`w-24 px-3 py-2 bg-white border rounded-lg focus:ring-0 focus:border-[#D4AF37] transition-all outline-none text-gray-700 text-center font-mono font-semibold text-sm uppercase tracking-wider ${
                        captchaError ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                      title={isRTL ? 'رمز جديد' : 'Nouveau code'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                {captchaError && (
                  <p className="text-xs text-red-500 -mt-2">{t('contact.form.captchaError')}</p>
                )}

                {status.message && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                    status.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>{t('contact.form.sending')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('contact.form.send')}</span>
                      <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Contact;
