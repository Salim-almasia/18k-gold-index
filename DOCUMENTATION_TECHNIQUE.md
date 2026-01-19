# Documentation Technique - Luxoria (18k.ma)

## Résumé Exécutif

Plateforme web de suivi du prix de l'or au Maroc avec système de blog intégré, support bilingue (Français/Arabe), et panel d'administration complet.

**URL de production** : https://gold-prices-frontend-1022015820987.us-central1.run.app

---

## 1. Stack Technique

### Backend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **Python** | 3.9+ | Langage principal |
| **FastAPI** | 0.115.0 | Framework API REST |
| **SQLAlchemy** | 2.0.36 | ORM pour base de données |
| **SQLite** | - | Base de données |
| **Uvicorn** | 0.32.1 | Serveur ASGI |
| **Pydantic** | 2.10.4 | Validation des données |
| **python-jose** | 3.3.0 | JWT Authentication |
| **bcrypt** | 5.0.0 | Hachage des mots de passe |
| **Google Cloud Storage** | 2.14.0 | Backup automatique de la BDD |

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 19.2.0 | Framework UI |
| **React Router DOM** | 7.9.6 | Routing SPA |
| **Tailwind CSS** | 3.4.19 | Framework CSS (utility-first) |
| **Recharts** | 3.5.0 | Graphiques des prix |
| **Axios** | 1.13.2 | Client HTTP |
| **EmailJS** | 4.4.1 | Envoi de formulaires de contact |

### Infrastructure (Google Cloud Platform)
| Service | Usage |
|---------|-------|
| **Cloud Run** | Hébergement containerisé (Backend + Frontend) |
| **Cloud Storage** | Backup BDD + Hébergement images articles |
| **Container Registry** | Images Docker |

---

## 2. Architecture du Projet

```
gold-prices-main/
├── backend/
│   ├── main.py              # API FastAPI (tous les endpoints)
│   ├── models.py            # Modèles SQLAlchemy
│   ├── database.py          # Config BDD + backup/restore GCS
│   ├── auth.py              # JWT + hachage mdp
│   ├── requirements.txt     # Dépendances Python
│   ├── Dockerfile           # Image Docker backend
│   └── uploads/             # Images uploadées (local)
│
├── frontend/
│   ├── src/
│   │   ├── App.js           # Router principal
│   │   ├── config.js        # URL API
│   │   ├── index.js         # Point d'entrée React
│   │   ├── index.css        # Styles Tailwind
│   │   │
│   │   ├── components/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PriceDisplay.jsx
│   │   │   ├── PriceChart.jsx
│   │   │   ├── admin/
│   │   │   │   └── BlogAdmin.jsx
│   │   │   ├── blog/
│   │   │   │   └── ArticleCard.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── PriceHero.jsx
│   │   │   │   ├── KaratPriceGrid.jsx
│   │   │   │   ├── CurrencyConverter.jsx
│   │   │   │   ├── PriceStatistics.jsx
│   │   │   │   └── EnhancedPriceChart.jsx
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── PricePage.jsx
│   │   │   │   ├── Blog.jsx
│   │   │   │   ├── ArticlePage.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── FAQ.jsx
│   │   │   │   ├── CGU.jsx
│   │   │   │   ├── PrivacyPolicy.jsx
│   │   │   │   ├── CookiesPolicy.jsx
│   │   │   │   ├── Disclaimer.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   └── ui/
│   │   │       └── Skeleton.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx   # Gestion i18n
│   │   │   └── ThemeContext.jsx      # Dark/Light mode
│   │   │
│   │   ├── hooks/
│   │   │   ├── useKaratCalculations.js
│   │   │   └── useExchangeRates.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js         # Formatage prix/dates
│   │   │   └── karatCalculator.js    # Calculs carats
│   │   │
│   │   └── translations/
│   │       ├── fr.json               # Traductions françaises
│   │       └── ar.json               # Traductions arabes
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.png
│   │   ├── logo-18k.svg
│   │   └── icon-18k.png
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
│
├── deploy.sh                 # Script de déploiement GCP
└── CLAUDE.md                 # Instructions pour Claude Code
```

---

## 3. Base de Données

### Schéma des Tables

#### `prices` - Prix de l'or
| Colonne | Type | Description |
|---------|------|-------------|
| id | Integer | Clé primaire |
| date | Date | Date unique (index) |
| price_per_gram_mad | Float | Prix par gramme en MAD |
| created_at | DateTime | Date de création |

#### `admin` - Authentification admin
| Colonne | Type | Description |
|---------|------|-------------|
| id | Integer | Clé primaire |
| password_hash | String | Hash bcrypt du mot de passe |

#### `categories` - Catégories du blog
| Colonne | Type | Description |
|---------|------|-------------|
| id | Integer | Clé primaire |
| name | String(100) | Nom en français |
| name_ar | String(100) | Nom en arabe |
| slug | String(100) | Slug URL |
| color | String(7) | Couleur hex (#D4AF37) |
| position | Integer | Ordre d'affichage |
| created_at | DateTime | Date de création |

#### `articles` - Articles du blog (bilingues)
| Colonne | Type | Description |
|---------|------|-------------|
| id | Integer | Clé primaire |
| **Français** | | |
| title | String(200) | Titre |
| slug | String(200) | Slug URL (unique) |
| excerpt | String(300) | Extrait |
| content | Text | Contenu HTML |
| meta_title | String(200) | Titre SEO |
| meta_description | String(300) | Description SEO |
| **Arabe** | | |
| title_ar | String(200) | Titre arabe |
| slug_ar | String(200) | Slug arabe |
| excerpt_ar | String(300) | Extrait arabe |
| content_ar | Text | Contenu HTML arabe |
| meta_title_ar | String(200) | Titre SEO arabe |
| meta_description_ar | String(300) | Description SEO arabe |
| **Commun** | | |
| image | String(500) | URL de l'image |
| category_id | Integer | FK vers categories |
| status | String(20) | draft/published |
| views | Integer | Compteur de vues |
| reading_time | Integer | Temps de lecture (min) |
| published_at | DateTime | Date de publication |
| created_at | DateTime | Date de création |
| updated_at | DateTime | Dernière mise à jour |

#### `newsletter_subscribers` - Abonnés newsletter
| Colonne | Type | Description |
|---------|------|-------------|
| id | Integer | Clé primaire |
| email | String(255) | Email unique (index) |
| subscribed_at | DateTime | Date d'inscription |
| is_active | Boolean | Statut actif/inactif |

### Persistence & Backup
- **SQLite** stocké localement dans le container
- **Backup automatique** vers Google Cloud Storage à chaque arrêt du container
- **Restore automatique** au démarrage si backup existant
- **Bucket GCS** : `gold-prices-db-luxoria-gold-18k`
- **Rétention** : 30 versions de backup conservées

---

## 4. API Endpoints

### Endpoints Publics

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/prices/current` | Prix actuel + variation 24h |
| GET | `/api/prices/history?days=30` | Historique des prix |
| GET | `/api/articles` | Liste des articles publiés |
| GET | `/api/articles/{slug}` | Détail d'un article |
| GET | `/api/articles/by-slug-ar/{slug}` | Article par slug arabe |
| GET | `/api/categories` | Liste des catégories |
| GET | `/api/categories/{slug}` | Catégorie par slug |
| POST | `/api/newsletter/subscribe` | Inscription newsletter |

### Endpoints Admin (JWT requis)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/admin/login` | Authentification (retourne JWT) |
| POST | `/api/admin/prices` | Ajouter/modifier un prix |
| GET | `/api/admin/prices/all` | Tous les prix |
| GET | `/api/admin/articles` | Tous les articles (+ brouillons) |
| POST | `/api/admin/articles` | Créer un article |
| PUT | `/api/admin/articles/{id}` | Modifier un article |
| DELETE | `/api/admin/articles/{id}` | Supprimer un article |
| POST | `/api/admin/categories` | Créer une catégorie |
| PUT | `/api/admin/categories/{id}` | Modifier une catégorie |
| DELETE | `/api/admin/categories/{id}` | Supprimer une catégorie |
| POST | `/api/admin/upload` | Upload d'image |
| GET | `/api/admin/blog/stats` | Statistiques du blog |
| GET | `/api/admin/newsletter/subscribers` | Liste des abonnés |
| DELETE | `/api/admin/newsletter/subscribers/{id}` | Supprimer un abonné |

---

## 5. Système Multilingue (i18n)

### Langues supportées
- **Français** (fr) - Langue par défaut
- **Arabe** (ar) - Support RTL complet

### Implémentation
```javascript
// LanguageContext.jsx
- Détection automatique via URL (/ar pour arabe)
- Stockage de la préférence en localStorage
- Direction RTL automatique pour l'arabe
- Fonction t() pour accéder aux traductions
```

### Fichiers de traduction
- `frontend/src/translations/fr.json` (~16 Ko)
- `frontend/src/translations/ar.json` (~18 Ko)

### Routing bilingue
```
Français (défaut)    |    Arabe
/                    |    /ar
/prix-de-lor         |    /ar/prix-de-lor
/blog                |    /ar/blog
/blog/{slug}         |    /ar/blog/{slug}
/contact             |    /ar/contact
...
```

### Contenu bilingue du blog
- Chaque article possède des champs séparés pour FR et AR
- Les catégories ont `name` (FR) et `name_ar` (AR)
- Affichage automatique selon la langue active

---

## 6. Fonctionnalités Principales

### 6.1 Page d'accueil
- Hero section avec CTA
- Badge "En direct" avec animation
- Mini-statistiques (18K, 75%, 24/7)
- Section "L'or 18 carats" avec image
- Section "Une vision sobre" avec icône 18k
- Grille des 5 catégories d'expertise
- Section CTA
- Formulaire newsletter

### 6.2 Page Prix de l'Or
- **PriceHero** : Affichage du prix actuel avec variation
- **KaratPriceGrid** : Prix calculés pour 24K, 21K, 18K
  - 24K = prix base × 1.333 (100%)
  - 21K = prix base × 1.167 (87.5%)
  - 18K = prix base (75%)
- **CurrencyConverter** : Conversion MAD/EUR/USD
- **PriceStatistics** : Min, Max, Moyenne, Volatilité
- **EnhancedPriceChart** : Graphique Recharts avec sélecteur de période (5J, 30J, 90J, 1A, Max)

### 6.3 Blog
- Liste des articles avec pagination (3 articles/page)
- Filtrage par catégorie via URL `/blog/{category-slug}`
- Page article avec :
  - Image d'en-tête
  - Métadonnées (catégorie, temps de lecture, vues, date)
  - Contenu HTML stylé
  - Navigation vers articles connexes
- 5 catégories prédéfinies :
  1. Or & valeur
  2. Bijouterie & horlogerie
  3. Diamant & pierres précieuses
  4. Métier & savoir-faire
  5. Croyances & idées reçues

### 6.4 Newsletter
- Formulaire d'inscription sur la page d'accueil
- Validation email côté API
- Gestion des doublons (réactivation si désactivé)
- Messages de confirmation bilingues
- Administration des abonnés dans le dashboard

### 6.5 Panel Administration
**URL** : `/admin/login` → `/admin/dashboard`

**Onglets disponibles** :
1. **Prix de l'or**
   - Formulaire d'ajout de prix (date + prix MAD)
   - Tableau des 10 derniers prix
   - Statistiques (total entrées, dernier prix, dernière MAJ)

2. **Blog**
   - Liste des articles avec statut
   - Éditeur d'articles (création/modification)
   - Gestion des catégories
   - Upload d'images
   - Statistiques (articles publiés, brouillons, vues totales)

3. **Newsletter**
   - Tableau des abonnés (email, date, statut)
   - Compteur total d'abonnés
   - Bouton de suppression par abonné

### 6.6 Pages légales
- CGU (Conditions Générales d'Utilisation)
- Politique de confidentialité
- Politique de cookies
- Clause de non-responsabilité
- FAQ

---

## 7. Design System

### Couleurs principales
```css
--bleu-principal: #002FA7    /* Boutons, liens, accents */
--or: #D2A24C                /* Highlights, prix */
--or-secondaire: #C9A961     /* Variations */
--fond-clair: #F9FAFB        /* Background sections */
--texte: #1A1A1A             /* Texte principal */
--texte-secondaire: #6B7280  /* Texte désactivé */
```

### Typographie
- **Sans-serif** : System fonts (Tailwind default)
- **Arabe** : Noto Sans Arabic (Google Fonts)

### Composants UI
- Cards avec `rounded-2xl` et `shadow-sm`
- Boutons avec états hover et focus
- Inputs avec focus ring `#002FA7`
- Skeletons pour états de chargement
- Tables avec hover states
- Badges (statuts, catégories)

---

## 8. Déploiement

### Commandes
```bash
./deploy.sh           # Déploie backend + frontend
./deploy.sh backend   # Backend uniquement
./deploy.sh frontend  # Frontend uniquement
```

### Configuration GCP
- **Projet** : `luxoria-gold-18k`
- **Région** : `us-central1`
- **Services Cloud Run** :
  - `gold-prices-backend`
  - `gold-prices-frontend`

### URLs de production
- **Frontend** : https://gold-prices-frontend-1022015820987.us-central1.run.app
- **Backend** : https://gold-prices-backend-1022015820987.us-central1.run.app

### Variables d'environnement
| Variable | Valeur | Service |
|----------|--------|---------|
| GCS_BUCKET_NAME | gold-prices-db-luxoria-gold-18k | Backend |
| REACT_APP_API_URL | URL du backend | Frontend |

---

## 9. Sécurité

### Authentification
- JWT avec expiration 24h
- Mot de passe hashé avec bcrypt
- Token stocké en localStorage côté client

### API
- CORS configuré avec liste blanche d'origines
- Validation Pydantic sur tous les inputs
- Protection des endpoints admin via middleware JWT

### Données
- Pas de stockage de données sensibles
- Emails newsletter validés et normalisés
- Images uploadées vérifiées (types autorisés)

---

## 10. Articles de Blog (Seed Data)

4 articles pré-remplis avec contenu bilingue complet :

1. **Comment est calculé le prix d'un bijou en or ?**
   - Catégorie : Or & valeur
   - Image : article1.png

2. **Comment comparer deux bagues en or au même prix ?**
   - Catégorie : Croyances & idées reçues
   - Image : article2.png

3. **Comment reconnaître un bijou en or authentique ?**
   - Catégorie : Métier & savoir-faire
   - Image : article3.png

4. **Pourquoi le 18 carats est le standard légal de l'or marocain ?**
   - Catégorie : Or & valeur
   - Image : article4.png

**Stockage images** : `gs://gold-prices-db-luxoria-gold-18k/images/`

---

## 11. Améliorations Futures Possibles

- [ ] PWA (Progressive Web App)
- [ ] Notifications push pour variations de prix
- [ ] Export CSV des données prix
- [ ] Authentification OAuth (Google/Facebook)
- [ ] Commentaires sur les articles
- [ ] Cache Redis pour les requêtes fréquentes
- [ ] Tests unitaires et e2e
- [ ] Monitoring et alerting (Cloud Monitoring)
- [ ] CDN pour les assets statiques

---

## 12. Contacts & Maintenance

- **Déploiement** : Via script `./deploy.sh`
- **Logs** : `gcloud run services logs read gold-prices-backend --region us-central1`
- **Backups** : `gsutil ls -a gs://gold-prices-db-luxoria-gold-18k/`

---

*Document généré le 19 janvier 2026*
