import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';

const HomePage = () => {
  return (
    <DashboardLayout>
      {/* Hero Section - Clean White */}
      <section className="bg-white pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Content - 5 cols */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#002FA7]/5 rounded-full mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D2A24C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D2A24C]"></span>
                </span>
                <span className="text-xs font-medium text-[#002FA7]">Mis à jour quotidiennement</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-[#002FA7] mb-3 leading-[1.1]">
                Prix de l'Or <span className="text-[#D2A24C]">Aujourd'hui</span>
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Le prix de l'or en toute transparence. Un repère fiable pour suivre
                l'évolution du cours et prendre des décisions éclairées.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/prix-de-lor"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white text-sm font-semibold rounded-lg hover:bg-[#001f7a] transition-all shadow-lg shadow-[#002FA7]/20"
                >
                  Voir le cours
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-[#002FA7] hover:text-[#002FA7] transition-all"
                >
                  Notre blog
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-[#002FA7]">18K</p>
                  <p className="text-xs text-gray-500">Or de référence</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-[#D2A24C]">75%</p>
                  <p className="text-xs text-gray-500">Pureté garantie</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">24/7</p>
                  <p className="text-xs text-gray-500">Accès en ligne</p>
                </div>
              </div>
            </div>

            {/* Image - 7 cols */}
            <div className="lg:col-span-7 relative">
              <div className="relative">
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=2070&auto=format&fit=crop"
                    alt="Lingots d'or"
                    className="w-full h-[320px] lg:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#002FA7]/20 via-transparent to-[#D2A24C]/10"></div>
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-4 left-4 lg:left-8 bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D2A24C] to-[#b8893f] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cours Or 18K</p>
                    <p className="text-lg font-bold text-[#002FA7]">MAD / gramme</p>
                  </div>
                </div>

                {/* Decorative */}
                <div className="absolute -top-2 -right-2 w-20 h-20 border-2 border-[#D2A24C]/20 rounded-xl -z-10"></div>
                <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-[#002FA7]/5 rounded-full -z-10 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-[#002FA7] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Information fiable</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Actualisation quotidienne</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Marché marocain</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium">Transparence totale</span>
            </div>
          </div>
        </div>
      </section>

      {/* L'or 18 carats + Vision sobre - Combined */}
      <section className="bg-gray-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - 18K Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-48">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop"
                  alt="Bijoux en or 18 carats"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-[#D2A24C] text-white text-xs font-bold rounded-full">18 CARATS</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#002FA7] mb-2">
                  L'or 18 carats, un standard d'excellence
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Équilibre parfait entre pureté, solidité et élégance. L'or 18k est au cœur
                  de la bijouterie marocaine avec ses 75% d'or pur.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#002FA7]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Pureté</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D2A24C]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Solidité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#002FA7]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Élégance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Vision */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#002FA7] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">18K</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#002FA7]">Une vision sobre</h3>
                    <p className="text-xs text-gray-500">Espace d'information premium</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  18k.ma est pensé pour un public exigeant, à la recherche d'informations fiables
                  et objectives sur le marché de l'or au Maroc. Le luxe véritable ne se proclame pas,
                  il se reconnaît dans les détails, la rigueur et le respect du lecteur.
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Nous défendons l'authenticité et la transparence, sans artifice ni exagération.
                  Chaque donnée publiée reflète la réalité du marché, chaque analyse vise à éclairer
                  vos décisions. Notre engagement : vous offrir un contenu de qualité, sobre et précis.
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#002FA7]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span className="text-xs font-semibold text-[#002FA7]">Neutralité</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#D2A24C]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#D2A24C]">Clarté</span>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-[#002FA7]/5 transition-colors">
                  <svg className="w-6 h-6 mx-auto mb-2 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#002FA7]">Élégance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#002FA7]">Notre Expertise</h2>
              <p className="text-gray-500 text-sm mt-1">Découvrez nos domaines de spécialisation</p>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <div className="w-8 h-1 bg-[#D2A24C] rounded-full"></div>
              <div className="w-2 h-1 bg-[#D2A24C]/50 rounded-full"></div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bijoux Card */}
            <Link to="/blog" className="group relative rounded-xl overflow-hidden h-[280px] block">
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop"
                alt="Bijoux en or"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002FA7] via-[#002FA7]/60 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D2A24C] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Bijoux en or</h3>
                    <p className="text-white/70 text-sm">La valeur avant tout</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  Un bijou est un objet de style et de valeur. Nous vous aidons à comprendre
                  le juste prix.
                </p>
                <span className="inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all">
                  Découvrir
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Horlogerie Card */}
            <Link to="/blog" className="group relative rounded-xl overflow-hidden h-[280px] block">
              <img
                src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop"
                alt="Horlogerie de luxe"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002FA7] via-[#002FA7]/60 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D2A24C] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Horlogerie de luxe</h3>
                    <p className="text-white/70 text-sm">L'élégance du temps</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  Les grandes montres traversent le temps avec caractère. Certaines deviennent
                  des icônes.
                </p>
                <span className="inline-flex items-center gap-1 text-[#D2A24C] text-sm font-medium group-hover:gap-2 transition-all">
                  Découvrir
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#002FA7] to-[#001a5c] py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Suivez le cours de l'or <span className="text-[#D2A24C]">au quotidien</span>
              </h2>
              <p className="text-white/60 text-sm">
                Accédez à des informations fiables pour des décisions éclairées.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/prix-de-lor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D2A24C] text-white text-sm font-semibold rounded-lg hover:bg-[#b8893f] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Voir le cours actuel
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Consulter le blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default HomePage;
