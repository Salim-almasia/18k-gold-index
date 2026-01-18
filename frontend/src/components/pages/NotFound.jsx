import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page non trouvée - 18k.ma';
  }, []);

  return (
    <DashboardLayout>
      {/* Hero Section - Same design as FAQ */}
      <section className="relative bg-[#FAFAFA] overflow-hidden">
        {/* Watermark gold bars */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none select-none opacity-[0.04]">
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
              <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-[0.2em]">Erreur</span>
              <div className="w-12 h-[2px] bg-[#D4AF37]"></div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-[#1A1A1A] mb-4">
              404
            </h1>
            <p className="text-xl text-gray-500 mb-2">
              Page non trouvée
            </p>
            <p className="text-gray-400">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-px bg-gradient-to-r from-[#D4AF37] via-gray-200 to-transparent"></div>
      </section>

      {/* Actions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100 text-center">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Que souhaitez-vous faire ?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#002FA7] text-white font-semibold rounded-xl hover:bg-[#001f7a] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l'accueil
              </Link>
              <Link
                to="/prix-de-lor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8963E] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Voir le cours de l'or
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] font-semibold rounded-xl border-2 border-gray-200 hover:border-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default NotFound;
