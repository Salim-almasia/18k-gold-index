import React from 'react';

const EditorialBlock = () => {
  return (
    <section className="editorial-block py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="editorial-title">
          Le Cours de l'Or au Maroc – Un signal quotidien au service de l'écosystème
        </h2>

        <div className="editorial-text space-y-4">
          <p>
            Le Cours de l'Or au Maroc n'est pas une simple donnée chiffrée. C'est un signal
            quotidien de terrain, issu de l'observation directe du marché marocain, depuis la
            source de Casablanca, cœur historique et économique de la bijouterie nationale.
            Pensé comme un outil d'incubation et d'accompagnement, ce signal vise à structurer
            le secteur, renforcer la confiance et rapprocher l'information des réalités du terrain.
          </p>

          <p>
            Pour les bijoutiers, ce repère local, fiable et actualisé constitue un outil d'aide
            à la décision au quotidien. Il permet de mieux anticiper les variations du marché,
            de sécuriser les achats et les ventes, d'optimiser la gestion des stocks et de
            préserver les marges dans un contexte de forte volatilité. Il contribue également
            à la professionnalisation du métier et à l'instauration d'un langage commun entre
            acteurs du secteur.
          </p>

          <p>
            Pour les consommateurs, l'accès à un cours de référence clair et ancré dans le
            marché marocain renforce la transparence, la compréhension des prix et la confiance
            au moment de l'achat. Il favorise une relation plus équilibrée avec les bijoutiers
            et participe à une meilleure valorisation du bijou, au-delà de sa dimension purement
            commerciale.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditorialBlock;
