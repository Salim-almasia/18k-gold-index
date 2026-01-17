import React from 'react';

const EditorialBlock = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-center text-xl lg:text-2xl font-bold text-[#002FA7] mb-6">
          Le Cours de l'Or au Maroc – Un signal quotidien au service de l'écosystème
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Signal */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#002FA7]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#002FA7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Un Signal de Terrain</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed text-justify">
              Le Cours de l'Or au Maroc n'est pas une simple donnée chiffrée. C'est un signal
              quotidien issu de l'observation directe du marché marocain, depuis Casablanca,
              cœur historique de la bijouterie nationale. Ce signal vise à structurer le secteur
              et rapprocher l'information des réalités du terrain.
            </p>
          </div>

          {/* Card 2: Bijoutiers */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#D2A24C]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#D2A24C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Pour les Bijoutiers</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed text-justify">
              Ce repère local, fiable et actualisé constitue un outil d'aide à la décision.
              Il permet d'anticiper les variations du marché, sécuriser les transactions,
              optimiser la gestion des stocks et préserver les marges. Il contribue à la
              professionnalisation du métier.
            </p>
          </div>

          {/* Card 3: Consommateurs */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-700">Pour les Consommateurs</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed text-justify">
              L'accès à un cours de référence clair renforce la transparence, la compréhension
              des prix et la confiance au moment de l'achat. Il favorise une relation équilibrée
              avec les bijoutiers et participe à une meilleure valorisation du bijou.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialBlock;
