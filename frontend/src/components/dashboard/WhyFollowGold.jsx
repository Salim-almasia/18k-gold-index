import React from 'react';
import { Link } from 'react-router-dom';

const WhyFollowGold = () => {
  return (
    <>
      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2A24C]"></span>
            <span className="w-2 h-2 rounded-full bg-[#002FA7]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2A24C]"></span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      {/* Why Follow Gold Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {/* Card Container */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 shadow-sm">
            {/* Title */}
            <h2 className="text-center text-xl lg:text-2xl font-bold text-[#002FA7] mb-10">
              Pourquoi suivre le cours de l'or ?
            </h2>

            {/* Grid 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Transparence du marché */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#002FA7] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Transparence du marché</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Accédez à des informations fiables et actualisées pour prendre des décisions éclairées.
                  </p>
                </div>
              </div>

              {/* Valeur refuge */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D2A24C] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Valeur refuge</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    L'or reste une valeur sûre pour protéger votre patrimoine contre l'inflation.
                  </p>
                </div>
              </div>

              {/* Suivi des tendances */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Suivi des tendances</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Analysez l'évolution des prix pour identifier les meilleurs moments d'achat ou de vente.
                  </p>
                </div>
              </div>

              {/* Ancrage local */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Ancrage local</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Des données spécifiques au marché marocain, adaptées à vos besoins.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors shadow-lg shadow-[#002FA7]/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Consulter notre Blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyFollowGold;
