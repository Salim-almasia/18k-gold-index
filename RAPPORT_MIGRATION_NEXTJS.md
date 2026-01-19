# Rapport d'Audit et Migration Technique Complète
## Luxoria (18k.ma) - Next.js + PostgreSQL (Cloud SQL)

---

**Document:** Rapport d'Expertise Migration Frontend & Base de Données
**Client:** Luxoria - 18k.ma
**Date:** 19 Janvier 2026
**Version:** 2.0
**Classification:** Confidentiel

---

## Table des Matières

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Audit de l'Existant](#2-audit-de-lexistant)
3. [Analyse des Risques SEO Actuels](#3-analyse-des-risques-seo-actuels)
4. [Migration Base de Données: SQLite → PostgreSQL (Cloud SQL)](#4-migration-base-de-données-sqlite--postgresql-cloud-sql)
5. [Stratégie de Migration Recommandée](#5-stratégie-de-migration-recommandée)
6. [Plan de Migration Détaillé](#6-plan-de-migration-détaillé)
7. [Estimation de l'Effort](#7-estimation-de-leffort)
8. [Architecture Cible Complète](#8-architecture-cible-complète)
9. [Gains SEO Attendus](#9-gains-seo-attendus)
10. [Risques et Mitigations](#10-risques-et-mitigations)
11. [Recommandations Finales](#11-recommandations-finales)

---

## 1. Résumé Exécutif

### Constat

L'application Luxoria (18k.ma) présente **deux problèmes architecturaux majeurs**:

1. **Frontend React CRA (CSR)** - Limitations SEO structurelles
2. **SQLite sur Cloud Run** - Architecture non-scalable avec workaround GCS complexe

### Verdict Global

| Critère | État Actuel | Après Migration |
|---------|-------------|-----------------|
| **FRONTEND** | | |
| Indexation Google | ⚠️ Partielle/Lente | ✅ Immédiate |
| Core Web Vitals | ⚠️ LCP > 2.5s estimé | ✅ LCP < 1.5s |
| Meta Tags Dynamiques | ❌ Client-side | ✅ Server-side |
| Structured Data | ❌ Absent | ✅ JSON-LD natif |
| Sitemap/Robots | ❌ Manuel | ✅ Automatique |
| **BASE DE DONNÉES** | | |
| Scalabilité | ❌ Single instance | ✅ Multi-instances |
| Persistance | ⚠️ GCS Workaround | ✅ Native Cloud SQL |
| Connexions concurrentes | ❌ Limitées | ✅ Connection pooling |
| Full-text Search | ❌ Basique | ✅ PostgreSQL natif |
| Backups | ⚠️ Manuel | ✅ Automatique |

### Recommandations Principales

1. **Frontend:** Migration vers **Next.js 14+ (App Router)** avec SSG/SSR
2. **Backend:** Migration vers **PostgreSQL sur Google Cloud SQL**

### Effort Estimé Total

| Phase | Durée Estimée | Complexité |
|-------|---------------|------------|
| Phase 0 - PostgreSQL (Cloud SQL) | 1-2 jours | Faible |
| Phase 1 - Setup Next.js & Core | 3-4 jours | Moyenne |
| Phase 2 - Pages & Composants | 5-7 jours | Haute |
| Phase 3 - Blog & SEO | 3-4 jours | Moyenne |
| Phase 4 - Admin & Tests | 2-3 jours | Moyenne |
| **Total** | **14-20 jours** | **Haute** |

---

## 2. Audit de l'Existant

### 2.1 Stack Technique Actuelle

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (CSR)                           │
├─────────────────────────────────────────────────────────────┤
│  Framework      │ React 19.2.0 + Create React App 5.0.1    │
│  Routing        │ React Router DOM 7.9.6 (Client-side)     │
│  Styling        │ Tailwind CSS 3.4.19 + PostCSS            │
│  HTTP Client    │ Axios 1.13.2                             │
│  Charts         │ Recharts 3.5.0                           │
│  Email          │ EmailJS Browser 4.4.1                    │
│  i18n           │ Custom (JSON + Context API)              │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND (API)                            │
├─────────────────────────────────────────────────────────────┤
│  Framework      │ FastAPI (Python)                         │
│  Database       │ SQLite + GCS Backup                      │
│  Auth           │ JWT                                      │
│  Hosting        │ Google Cloud Run                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Inventaire des Composants

#### Pages Publiques (11 routes × 2 langues = 22 routes)

| Page | Fichier | Lignes | Complexité | SEO Priority |
|------|---------|--------|------------|--------------|
| Accueil | `HomePage.jsx` | 544 | Haute | 🔴 Critique |
| Prix Or | `PricePage.jsx` | 142 | Moyenne | 🔴 Critique |
| Blog Listing | `Blog.jsx` | 369 | Haute | 🔴 Critique |
| Article | `ArticlePage.jsx` | ~200 | Haute | 🔴 Critique |
| Contact | `Contact.jsx` | ~150 | Faible | 🟡 Moyenne |
| FAQ | `FAQ.jsx` | ~100 | Faible | 🟡 Moyenne |
| CGU | `CGU.jsx` | ~80 | Faible | 🟢 Basse |
| Politique Privée | `PrivacyPolicy.jsx` | ~80 | Faible | 🟢 Basse |
| Cookies | `CookiesPolicy.jsx` | ~80 | Faible | 🟢 Basse |
| Disclaimer | `Disclaimer.jsx` | ~80 | Faible | 🟢 Basse |
| 404 | `NotFound.jsx` | ~50 | Faible | 🟢 Basse |

#### Pages Admin (Non-indexées)

| Page | Fichier | Lignes | Complexité |
|------|---------|--------|------------|
| Login Admin | `AdminLogin.jsx` | ~100 | Faible |
| Dashboard | `AdminDashboard.jsx` | 516 | Très Haute |
| Blog Admin | `BlogAdmin.jsx` | ~250 | Très Haute |

#### Composants Réutilisables

| Catégorie | Composants | Effort Migration |
|-----------|------------|------------------|
| Layout | Header, Footer, DashboardLayout | 🟢 Faible |
| Dashboard | PriceHero, EnhancedPriceChart, PriceInfo, KaratPriceGrid | 🟡 Moyen |
| UI | Skeleton, ThemeToggle, ArticleCard | 🟢 Faible |
| Contextes | ThemeContext, LanguageContext | 🟡 Moyen |
| Hooks | useExchangeRates, useKaratCalculations | 🟢 Faible |
| Utils | formatters, karatCalculator | 🟢 Aucun |

### 2.3 Gestion de l'Internationalisation (i18n)

**Architecture Actuelle:**
```
/                    → Français (défaut)
/ar/*                → Arabe (RTL)
```

**Fichiers de Traduction:**
- `translations/fr.json` (267 lignes)
- `translations/ar.json` (267 lignes)

**Problème Identifié:** Routes dupliquées manuellement dans `App.js` (22 définitions au lieu de 11 avec routing dynamique).

### 2.4 Gestion des Thèmes

4 thèmes implémentés via CSS Variables:
- `blueGold` (défaut)
- `light`
- `midnight`
- `elegance`

Persistence: `localStorage`

---

## 3. Analyse des Risques SEO Actuels

### 3.1 Problèmes Critiques

#### ❌ Rendu Client-Side (CSR)

```
┌─────────────────────────────────────────────────────────────┐
│           PROCESSUS D'INDEXATION ACTUEL                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Googlebot visite 18k.ma                                │
│     ↓                                                       │
│  2. Reçoit HTML vide + bundle JS (~500KB)                  │
│     ↓                                                       │
│  3. Ajoute à la file de rendu JavaScript                   │
│     ↓                                                       │
│  4. [DÉLAI: heures à jours] Exécute JS                     │
│     ↓                                                       │
│  5. Indexe le contenu généré                               │
│                                                             │
│  ⚠️  Risque: Timeout JS, erreurs, contenu partiel          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Impact:** Délai d'indexation de 24h à 7 jours vs instantané avec SSR/SSG.

#### ❌ Meta Tags Dynamiques

**Code Actuel (Client-side):**
```javascript
useEffect(() => {
  document.title = "Prix de l'Or au Maroc | 18k.ma";
  // Meta description modifiée côté client
}, []);
```

**Problème:** Googlebot capture souvent le titre/description par défaut avant l'exécution du JS.

#### ❌ Absence de Données Structurées

Aucun JSON-LD pour:
- Organisation
- Produit (Prix Or)
- Article (Blog)
- FAQ
- BreadcrumbList

**Impact:** Pas de Rich Snippets dans les SERP.

#### ❌ Pas de Sitemap XML Dynamique

Sitemap absent ou statique. Les articles de blog ne sont pas automatiquement ajoutés.

#### ❌ Images Non Optimisées

```javascript
// Actuel: Images Unsplash pleine résolution
<img src="https://images.unsplash.com/photo-..." />

// Impact:
// - LCP dégradé (Largest Contentful Paint)
// - Pas de lazy loading natif
// - Pas de formats modernes (WebP, AVIF)
```

### 3.2 Scores Estimés (Avant Migration)

| Métrique | Score Estimé | Cible Google |
|----------|--------------|--------------|
| LCP (Largest Contentful Paint) | ~3.5s | < 2.5s |
| FID (First Input Delay) | ~150ms | < 100ms |
| CLS (Cumulative Layout Shift) | ~0.15 | < 0.1 |
| Performance (Lighthouse) | 45-60 | > 90 |
| SEO (Lighthouse) | 70-80 | > 95 |

---

## 4. Migration Base de Données: SQLite → PostgreSQL (Cloud SQL)

### 4.1 Problème Actuel avec SQLite sur Cloud Run

```
┌─────────────────────────────────────────────────────────────┐
│        ARCHITECTURE ACTUELLE (PROBLÉMATIQUE)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Google Cloud Run (Stateless/Éphémère)                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Instance 1  │  │ Instance 2  │  │ Instance 3  │        │
│  │ SQLite (A)  │  │ SQLite (B)  │  │ SQLite (C)  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                  │
│                   ⚠️ DÉSYNCHRONISATION                      │
│                                                             │
│  Workaround actuel:                                        │
│  - restore_db_from_gcs() au démarrage                     │
│  - backup_db_to_gcs() après chaque écriture               │
│  → Lent, risque de perte, complexe                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Problèmes identifiés:**
- ❌ Cloud Run est stateless → fichier SQLite perdu au redémarrage
- ❌ Scaling horizontal impossible (instances désynchronisées)
- ❌ Workaround GCS ajoute latence et complexité
- ❌ Risque de perte de données entre backups
- ❌ Pas de connection pooling
- ❌ Full-text search limité

### 4.2 Solution: Google Cloud SQL for PostgreSQL

**Google Cloud SQL** est le service de base de données relationnelle managé de GCP. Il supporte PostgreSQL, MySQL et SQL Server.

#### Pourquoi Cloud SQL PostgreSQL?

| Critère | SQLite (actuel) | Cloud SQL PostgreSQL |
|---------|-----------------|---------------------|
| Intégration GCP | ❌ Workaround | ✅ Native |
| Cloud Run compatible | ⚠️ Via GCS | ✅ Direct |
| Connexions concurrentes | ❌ 1 | ✅ Illimitées |
| Connection pooling | ❌ | ✅ (via Cloud SQL Proxy) |
| Scaling | ❌ | ✅ Vertical + Read replicas |
| Backups automatiques | ❌ | ✅ Point-in-time recovery |
| Haute disponibilité | ❌ | ✅ Option HA |
| Full-text search | ⚠️ Basique | ✅ Excellent |
| JSON support | ⚠️ | ✅ JSONB natif |
| Maintenance | ❌ Manuel | ✅ Automatique |

#### Options de Tarification Cloud SQL

| Tier | vCPU | RAM | Stockage | Prix Estimé/mois |
|------|------|-----|----------|------------------|
| **db-f1-micro** (Dev) | Shared | 0.6 GB | 10 GB | ~10-15$ |
| **db-g1-small** (Prod) | Shared | 1.7 GB | 20 GB | ~25-35$ |
| db-custom-1-3840 | 1 | 3.75 GB | 50 GB | ~50-70$ |

**Recommandation:** Commencer avec `db-f1-micro` pour le développement, puis `db-g1-small` pour la production.

### 4.3 Architecture Cible avec Cloud SQL

```
┌─────────────────────────────────────────────────────────────┐
│            ARCHITECTURE CIBLE (RECOMMANDÉE)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Google Cloud Run                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Instance 1  │  │ Instance 2  │  │ Instance N  │        │
│  │  (Next.js)  │  │  (Next.js)  │  │  (Next.js)  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                  │
│                          ▼                                  │
│         ┌────────────────────────────────┐                 │
│         │     Cloud SQL Proxy            │                 │
│         │   (Connection Pooling)         │                 │
│         └────────────────┬───────────────┘                 │
│                          │                                  │
│                          ▼                                  │
│         ┌────────────────────────────────┐                 │
│         │   Google Cloud SQL             │                 │
│         │   PostgreSQL 15                │                 │
│         │                                │                 │
│         │   • Backups auto (7 jours)    │                 │
│         │   • Point-in-time recovery    │                 │
│         │   • Connexions illimitées     │                 │
│         │   • Full-text search          │                 │
│         └────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 Plan de Migration SQLite → PostgreSQL

#### Phase 0: Migration Base de Données (1-2 jours)

| # | Tâche | Effort | Priorité |
|---|-------|--------|----------|
| 0.1 | Créer instance Cloud SQL PostgreSQL | 30min | Critique |
| 0.2 | Configurer réseau VPC et firewall | 30min | Critique |
| 0.3 | Créer base de données et utilisateur | 15min | Critique |
| 0.4 | Modifier `database.py` (connection string) | 1h | Critique |
| 0.5 | Adapter les migrations SQLAlchemy | 1h | Haute |
| 0.6 | Exporter données SQLite existantes | 30min | Haute |
| 0.7 | Importer données dans PostgreSQL | 30min | Haute |
| 0.8 | Supprimer code GCS backup/restore | 30min | Moyenne |
| 0.9 | Configurer Cloud SQL Proxy pour Cloud Run | 1h | Critique |
| 0.10 | Tests de connexion et performance | 2h | Haute |

**Total Phase 0:** 8-12 heures (1-2 jours)

### 4.5 Code de Migration

#### Avant (SQLite + GCS Workaround)

```python
# database.py - ACTUEL
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_FILE = "gold_prices.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DB_FILE}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite spécifique
)

# + 60 lignes de code pour GCS backup/restore
def restore_db_from_gcs(): ...
def backup_db_to_gcs(): ...
```

#### Après (PostgreSQL Cloud SQL)

```python
# database.py - NOUVEAU
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Cloud SQL connection via Unix socket (recommandé pour Cloud Run)
# ou via IP privée avec Cloud SQL Proxy
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://luxoria_user:password@/luxoria_db"
    "?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME"
)

# Connection pooling optimisé pour Cloud Run
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=2,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,  # Vérifie la connexion avant utilisation
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)

# Plus besoin de backup_db_to_gcs() / restore_db_from_gcs() !
# Cloud SQL gère les backups automatiquement
```

### 4.6 Configuration Cloud Run pour Cloud SQL

```yaml
# cloudbuild.yaml ou service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: luxoria-backend
spec:
  template:
    metadata:
      annotations:
        # Connexion Cloud SQL
        run.googleapis.com/cloudsql-instances: PROJECT_ID:REGION:luxoria-db
    spec:
      containers:
        - image: gcr.io/PROJECT_ID/luxoria-backend
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-url
                  key: latest
```

### 4.7 Commandes de Setup Cloud SQL

```bash
# 1. Créer l'instance Cloud SQL
gcloud sql instances create luxoria-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=europe-west1 \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=03:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=04

# 2. Créer la base de données
gcloud sql databases create luxoria_db --instance=luxoria-db

# 3. Créer l'utilisateur
gcloud sql users create luxoria_user \
  --instance=luxoria-db \
  --password=SECURE_PASSWORD

# 4. Autoriser Cloud Run à se connecter
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# 5. Stocker le mot de passe dans Secret Manager
echo -n "postgresql://luxoria_user:SECURE_PASSWORD@/luxoria_db?host=/cloudsql/PROJECT_ID:europe-west1:luxoria-db" | \
  gcloud secrets create database-url --data-file=-
```

### 4.8 Script de Migration des Données

```python
# migrate_data.py
import sqlite3
import psycopg2
from datetime import datetime

# Connexion SQLite source
sqlite_conn = sqlite3.connect('gold_prices.db')
sqlite_cursor = sqlite_conn.cursor()

# Connexion PostgreSQL cible
pg_conn = psycopg2.connect(
    host="CLOUD_SQL_IP",
    database="luxoria_db",
    user="luxoria_user",
    password="SECURE_PASSWORD"
)
pg_cursor = pg_conn.cursor()

# Migration table prices
sqlite_cursor.execute("SELECT id, date, price_per_gram_mad, created_at FROM prices")
for row in sqlite_cursor.fetchall():
    pg_cursor.execute(
        "INSERT INTO prices (id, date, price_per_gram_mad, created_at) VALUES (%s, %s, %s, %s)",
        row
    )

# Migration table categories
sqlite_cursor.execute("SELECT * FROM categories")
for row in sqlite_cursor.fetchall():
    pg_cursor.execute(
        "INSERT INTO categories (id, name, slug, name_ar, color, position, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        row
    )

# Migration table articles
sqlite_cursor.execute("SELECT * FROM articles")
for row in sqlite_cursor.fetchall():
    pg_cursor.execute(
        """INSERT INTO articles
           (id, title, slug, excerpt, content, meta_title, meta_description,
            title_ar, slug_ar, excerpt_ar, content_ar, meta_title_ar, meta_description_ar,
            image, category_id, status, views, reading_time, published_at, created_at, updated_at)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        row
    )

# Migration table newsletter_subscribers
sqlite_cursor.execute("SELECT * FROM newsletter_subscribers")
for row in sqlite_cursor.fetchall():
    pg_cursor.execute(
        "INSERT INTO newsletter_subscribers (id, email, subscribed_at, is_active) VALUES (%s, %s, %s, %s)",
        row
    )

# Migration table admin
sqlite_cursor.execute("SELECT * FROM admin")
for row in sqlite_cursor.fetchall():
    pg_cursor.execute(
        "INSERT INTO admin (id, password_hash) VALUES (%s, %s)",
        row
    )

pg_conn.commit()
print("✓ Migration terminée avec succès!")

# Fermeture connexions
sqlite_cursor.close()
sqlite_conn.close()
pg_cursor.close()
pg_conn.close()
```

### 4.9 Avantages Futurs avec PostgreSQL

| Fonctionnalité | Usage pour Luxoria |
|----------------|-------------------|
| **Full-text Search** | Recherche dans les articles du blog |
| **JSONB** | Stocker des métadonnées flexibles |
| **Indexes GIN/GiST** | Performance recherche accrue |
| **Triggers** | Mise à jour automatique `updated_at` |
| **Views** | Statistiques pré-calculées |
| **Extensions** | `pg_trgm` pour recherche fuzzy |

---

## 5. Stratégie de Migration Recommandée

### 5.1 Options Évaluées

| Option | Avantages | Inconvénients | Verdict |
|--------|-----------|---------------|---------|
| **A. Rester sur React CRA** | Aucune migration | SEO limité, pas d'avenir | ❌ Rejeté |
| **B. React + Prerender.io** | Migration minimale | Coût, latence, maintenance | ⚠️ Patch |
| **C. Next.js App Router** | SEO natif, performance, DX | Migration complète | ✅ Recommandé |
| **D. Astro + React** | Excellent SEO | Écosystème différent | ⚠️ Alternatif |
| **E. Remix** | SEO, nested routing | Moins mature, communauté | ⚠️ Alternatif |

### 5.2 Justification Next.js

1. **Conservation du code React** - 90% des composants réutilisables
2. **App Router (Next.js 14+)** - Architecture moderne, Server Components
3. **Internationalisation native** - Middleware i18n, pas de duplication de routes
4. **Image Optimization** - Composant `<Image>` avec WebP/AVIF automatique
5. **Génération statique** - Blog en SSG avec ISR pour les prix
6. **Écosystème mature** - next-seo, next-sitemap, etc.
7. **Déploiement** - Compatible Google Cloud Run, Vercel

### 5.3 Architecture Proposée

```
┌─────────────────────────────────────────────────────────────┐
│                   ARCHITECTURE CIBLE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   SSG       │    │   SSR       │    │   CSR       │     │
│  │  (Static)   │    │  (Dynamic)  │    │  (Client)   │     │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤     │
│  │ • Blog      │    │ • Prix Or   │    │ • Admin     │     │
│  │ • CGU       │    │ • Homepage  │    │ • Dashboard │     │
│  │ • FAQ       │    │   (ISR 60s) │    │ • Charts    │     │
│  │ • Contact   │    │             │    │   interactifs│     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MIDDLEWARE I18N                         │   │
│  │         /fr/* (défaut) | /ar/* (RTL)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              API ROUTES (Next.js)                    │   │
│  │    Proxy vers FastAPI Backend existant              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Plan de Migration Détaillé

### Phase 1: Setup & Infrastructure (3-4 jours)

#### Tâches

| # | Tâche | Priorité | Effort |
|---|-------|----------|--------|
| 1.1 | Initialiser projet Next.js 14+ (App Router) | Critique | 2h |
| 1.2 | Configurer Tailwind CSS (migration config) | Critique | 2h |
| 1.3 | Setup TypeScript (optionnel mais recommandé) | Haute | 4h |
| 1.4 | Configurer middleware i18n (fr/ar) | Critique | 4h |
| 1.5 | Migrer fichiers de traduction | Moyenne | 2h |
| 1.6 | Setup next-seo et next-sitemap | Critique | 3h |
| 1.7 | Configurer variables d'environnement | Haute | 1h |
| 1.8 | Setup ESLint + Prettier Next.js | Moyenne | 1h |

#### Livrables Phase 1
- Projet Next.js fonctionnel
- Routing i18n opérationnel
- Configuration SEO de base
- Pipeline CI/CD adapté

### Phase 2: Migration des Pages & Composants (5-7 jours)

#### Tâches

| # | Tâche | Priorité | Effort |
|---|-------|----------|--------|
| 2.1 | Migrer Layout (Header, Footer) | Critique | 4h |
| 2.2 | Migrer HomePage avec SSR/ISR | Critique | 8h |
| 2.3 | Migrer PricePage avec SSR | Critique | 4h |
| 2.4 | Migrer ThemeContext (Server Components) | Haute | 4h |
| 2.5 | Migrer composants Dashboard (Client) | Haute | 8h |
| 2.6 | Adapter hooks (useExchangeRates, etc.) | Moyenne | 3h |
| 2.7 | Migrer pages légales (CGU, Privacy, etc.) | Basse | 4h |
| 2.8 | Optimiser images avec next/image | Haute | 4h |
| 2.9 | Implémenter loading.tsx et error.tsx | Moyenne | 3h |

#### Livrables Phase 2
- Toutes les pages publiques migrées
- Server Components pour contenu statique
- Client Components pour interactivité
- Images optimisées

### Phase 3: Blog & Optimisation SEO (3-4 jours)

#### Tâches

| # | Tâche | Priorité | Effort |
|---|-------|----------|--------|
| 3.1 | Migrer Blog listing (SSG avec ISR) | Critique | 6h |
| 3.2 | Migrer ArticlePage (generateStaticParams) | Critique | 6h |
| 3.3 | Implémenter JSON-LD (Article, Organization) | Critique | 4h |
| 3.4 | Configurer sitemap.xml dynamique | Critique | 3h |
| 3.5 | Configurer robots.txt | Haute | 1h |
| 3.6 | Implémenter Open Graph / Twitter Cards | Haute | 3h |
| 3.7 | Ajouter canonical URLs | Haute | 2h |
| 3.8 | Optimiser meta descriptions dynamiques | Haute | 2h |

#### Livrables Phase 3
- Blog entièrement statique avec ISR
- Données structurées complètes
- Sitemap dynamique
- Partage social optimisé

### Phase 4: Admin & Tests (2-3 jours)

#### Tâches

| # | Tâche | Priorité | Effort |
|---|-------|----------|--------|
| 4.1 | Migrer AdminLogin (Client Component) | Haute | 2h |
| 4.2 | Migrer AdminDashboard (Client Component) | Haute | 6h |
| 4.3 | Migrer BlogAdmin | Haute | 4h |
| 4.4 | Configurer middleware auth | Haute | 3h |
| 4.5 | Tests E2E (Playwright/Cypress) | Moyenne | 4h |
| 4.6 | Tests Lighthouse CI | Haute | 2h |
| 4.7 | Configuration déploiement Cloud Run | Critique | 4h |
| 4.8 | Tests de régression | Haute | 4h |

#### Livrables Phase 4
- Zone admin fonctionnelle
- Tests automatisés
- Pipeline de déploiement
- Documentation technique

---

## 7. Estimation de l'Effort

### 7.1 Tableau Récapitulatif

| Phase | Jours Estimés | Heures | Complexité |
|-------|---------------|--------|------------|
| **Phase 0: PostgreSQL (Cloud SQL)** | 1-2 jours | 8-12h | 🟢 Faible |
| Phase 1: Setup Next.js | 3-4 jours | 19h | 🟡 Moyenne |
| Phase 2: Pages & Composants | 5-7 jours | 42h | 🔴 Haute |
| Phase 3: Blog/SEO | 3-4 jours | 27h | 🟡 Moyenne |
| Phase 4: Admin/Tests | 2-3 jours | 29h | 🟡 Moyenne |
| **TOTAL** | **14-20 jours** | **~125-129h** | **Haute** |

### 7.2 Facteurs d'Ajustement

| Facteur | Impact |
|---------|--------|
| Expérience Next.js de l'équipe | ±20% |
| Ajout TypeScript | +15% |
| Tests exhaustifs | +10% |
| Bugs imprévus | +10-20% |
| Revue code / QA | +10% |

### 7.3 Estimation Réaliste

| Scénario | Durée |
|----------|-------|
| Optimiste (équipe expérimentée) | 14 jours |
| Réaliste | 20 jours |
| Pessimiste (imprévus majeurs) | 27 jours |

---

## 8. Architecture Cible Complète

### 7.1 Structure des Fichiers

```
frontend-nextjs/
├── app/
│   ├── [lang]/                          # Route dynamique i18n
│   │   ├── layout.tsx                   # Layout principal + SEO
│   │   ├── page.tsx                     # HomePage (ISR 60s)
│   │   ├── prix-de-lor/
│   │   │   └── page.tsx                 # PricePage (ISR 60s)
│   │   ├── blog/
│   │   │   ├── page.tsx                 # Blog listing (ISR 5min)
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx             # Article (SSG)
│   │   │   └── page/[page]/
│   │   │       └── page.tsx             # Pagination
│   │   ├── contact/
│   │   │   └── page.tsx                 # Contact (Static)
│   │   ├── faq/
│   │   │   └── page.tsx                 # FAQ (Static + JSON-LD)
│   │   ├── cgu/
│   │   │   └── page.tsx                 # CGU (Static)
│   │   ├── politique-de-confidentialite/
│   │   │   └── page.tsx                 # Privacy (Static)
│   │   ├── cookies/
│   │   │   └── page.tsx                 # Cookies (Static)
│   │   ├── disclaimer/
│   │   │   └── page.tsx                 # Disclaimer (Static)
│   │   └── not-found.tsx                # 404 localisé
│   │
│   ├── admin/                           # Routes Admin (CSR)
│   │   ├── layout.tsx                   # Admin Layout
│   │   ├── login/
│   │   │   └── page.tsx                 # AdminLogin
│   │   └── dashboard/
│   │       └── page.tsx                 # AdminDashboard
│   │
│   ├── api/                             # API Routes (proxy)
│   │   ├── prices/
│   │   │   ├── current/route.ts
│   │   │   └── history/route.ts
│   │   └── revalidate/route.ts          # Webhook ISR
│   │
│   ├── sitemap.ts                       # Sitemap dynamique
│   ├── robots.ts                        # Robots.txt
│   └── globals.css                      # Styles globaux
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   ├── dashboard/
│   │   ├── PriceHero.tsx
│   │   ├── EnhancedPriceChart.tsx       # 'use client'
│   │   ├── PriceInfo.tsx
│   │   └── KaratPriceGrid.tsx
│   ├── blog/
│   │   └── ArticleCard.tsx
│   ├── ui/
│   │   ├── Skeleton.tsx
│   │   └── ThemeToggle.tsx              # 'use client'
│   └── seo/
│       ├── JsonLd.tsx                   # Structured Data
│       └── MetaTags.tsx
│
├── lib/
│   ├── api.ts                           # Fetch functions
│   ├── i18n/
│   │   ├── config.ts                    # Langues supportées
│   │   ├── dictionaries.ts              # Chargement traductions
│   │   └── middleware.ts                # Détection langue
│   ├── hooks/
│   │   ├── useExchangeRates.ts
│   │   └── useKaratCalculations.ts
│   └── utils/
│       ├── formatters.ts
│       └── karatCalculator.ts
│
├── dictionaries/
│   ├── fr.json
│   └── ar.json
│
├── public/
│   ├── logo-18k.svg
│   ├── favicon.ico
│   └── images/
│
├── middleware.ts                        # i18n + Auth middleware
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 7.2 Exemple de Code Clé

#### Middleware i18n (`middleware.ts`)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['fr', 'ar']
const defaultLocale = 'fr'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorer les fichiers statiques et API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Vérifier si la locale est dans le path
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Rediriger vers la locale par défaut
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${pathname}`, request.url)
  )
}

export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)']
}
```

#### Page avec ISR (`app/[lang]/page.tsx`)

```typescript
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getCurrentPrice, getHistoryPrices } from '@/lib/api'
import HomePage from '@/components/pages/HomePage'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
    alternates: {
      canonical: `https://18k.ma/${params.lang}`,
      languages: {
        'fr': 'https://18k.ma/fr',
        'ar': 'https://18k.ma/ar',
      },
    },
    openGraph: {
      title: dict.home.metaTitle,
      description: dict.home.metaDescription,
      url: `https://18k.ma/${params.lang}`,
      siteName: 'Luxoria - 18k.ma',
      locale: params.lang === 'ar' ? 'ar_MA' : 'fr_FR',
      type: 'website',
    },
  }
}

export const revalidate = 60 // ISR: Revalider toutes les 60 secondes

export default async function Page({ params }: Props) {
  const [dict, currentPrice, history] = await Promise.all([
    getDictionary(params.lang),
    getCurrentPrice(),
    getHistoryPrices(30),
  ])

  return (
    <HomePage
      lang={params.lang}
      dict={dict}
      currentPrice={currentPrice}
      historyData={history}
    />
  )
}
```

#### JSON-LD Structured Data (`components/seo/JsonLd.tsx`)

```typescript
export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Luxoria',
          url: 'https://18k.ma',
          logo: 'https://18k.ma/logo-18k.svg',
          sameAs: [
            'https://facebook.com/luxoria',
            'https://instagram.com/luxoria',
          ],
        }),
      }}
    />
  )
}

export function ArticleJsonLd({ article, lang }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.excerpt,
          image: article.image,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: {
            '@type': 'Organization',
            name: 'Luxoria',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Luxoria',
            logo: {
              '@type': 'ImageObject',
              url: 'https://18k.ma/logo-18k.svg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://18k.ma/${lang}/blog/${article.slug}`,
          },
        }),
      }}
    />
  )
}
```

---

## 9. Gains SEO Attendus

### 8.1 Améliorations Techniques

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Time to First Byte (TTFB) | ~800ms | ~200ms | **-75%** |
| First Contentful Paint (FCP) | ~2.5s | ~0.8s | **-68%** |
| Largest Contentful Paint (LCP) | ~3.5s | ~1.2s | **-66%** |
| Cumulative Layout Shift (CLS) | ~0.15 | ~0.02 | **-87%** |
| Total Blocking Time (TBT) | ~400ms | ~100ms | **-75%** |
| Lighthouse Performance | 45-60 | 90-100 | **+60%** |
| Lighthouse SEO | 70-80 | 95-100 | **+30%** |

### 8.2 Améliorations SEO

| Facteur | Impact |
|---------|--------|
| Indexation immédiate | ✅ Crawl et index en quelques heures |
| Rich Snippets (FAQ, Article) | ✅ Visibilité SERP accrue |
| Sitemap dynamique | ✅ Découverte automatique nouveau contenu |
| Canonical URLs | ✅ Pas de duplicate content |
| Hreflang (FR/AR) | ✅ Ciblage géographique correct |
| Core Web Vitals | ✅ Facteur de ranking positif |

### 8.3 Projection de Trafic

Basé sur les améliorations techniques et SEO:

| Période | Estimation Trafic Organique |
|---------|----------------------------|
| Mois 1-2 | +10-20% (indexation complète) |
| Mois 3-6 | +30-50% (Core Web Vitals + Rich Snippets) |
| Mois 6-12 | +50-100% (autorité domaine + contenu) |

*Note: Ces projections dépendent également de la stratégie de contenu.*

---

## 10. Risques et Mitigations

### 9.1 Risques Techniques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Régression fonctionnelle | Moyenne | Élevé | Tests E2E complets avant déploiement |
| Perte de trafic temporaire | Faible | Moyen | Redirections 301, sitemap à jour |
| Incompatibilité Recharts SSR | Moyenne | Moyen | Utiliser `'use client'` pour graphiques |
| Performance Cloud Run | Faible | Moyen | Configuration Cold Start optimisée |
| Bugs i18n | Moyenne | Moyen | Tests multi-langues automatisés |

### 9.2 Risques Projet

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Dépassement délai | Moyenne | Moyen | Buffer 20% dans planning |
| Manque expertise Next.js | Variable | Élevé | Formation ou accompagnement |
| Scope creep | Moyenne | Moyen | Définir MVP strict |

### 9.3 Plan de Rollback

```
┌─────────────────────────────────────────────────────────────┐
│                   STRATÉGIE DE ROLLBACK                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Conserver l'ancien frontend sur Cloud Run (staging)    │
│  2. Déployer Next.js sur URL de test                       │
│  3. Tests complets pendant 48-72h                          │
│  4. Basculement DNS progressif (10% → 50% → 100%)         │
│  5. Monitoring 24h post-migration                          │
│  6. Si problème critique: rebasculer DNS < 5 min          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Recommandations Finales

### 10.1 Décision Recommandée

**✅ Procéder à la migration vers Next.js 14+ (App Router)**

Justification:
- ROI SEO significatif (trafic organique +50-100% sur 12 mois)
- Stack moderne et maintenue
- Compatibilité totale avec l'existant React
- Amélioration UX (performance)
- Facilité de maintenance long terme

### 10.2 Prochaines Étapes

| Étape | Action | Responsable | Deadline |
|-------|--------|-------------|----------|
| 1 | Validation du rapport | Direction | J+2 |
| 2 | Allocation ressources | Direction | J+5 |
| 3 | Kick-off migration | Équipe Dev | J+7 |
| 4 | Phase 1 - Setup | Dev | J+11 |
| 5 | Phase 2 - Pages | Dev | J+18 |
| 6 | Phase 3 - SEO | Dev | J+22 |
| 7 | Phase 4 - Tests | Dev + QA | J+25 |
| 8 | Déploiement production | DevOps | J+28 |

### 10.3 Ressources Nécessaires

| Ressource | Quantité | Durée |
|-----------|----------|-------|
| Développeur Frontend Senior (Next.js) | 1 | 18 jours |
| Développeur Frontend Junior (support) | 1 | 10 jours |
| QA Engineer | 1 | 5 jours |
| DevOps (déploiement) | 1 | 2 jours |

### 11.4 Budget Indicatif

| Poste | Estimation |
|-------|------------|
| Développement (~125h × tarif) | Variable selon équipe |
| **Google Cloud SQL PostgreSQL** | **~25-35$/mois** (db-g1-small) |
| Outils (Vercel Pro si choisi) | ~20$/mois |
| Tests & QA | Inclus dans dev |
| **Total infrastructure/mois** | **~45-55$/mois** |

*Note: Cloud SQL db-f1-micro (~10-15$/mois) possible pour commencer, puis upgrade vers db-g1-small en production.*

---

## Annexes

### A. Checklist SEO Post-Migration

- [ ] Vérifier indexation Google Search Console
- [ ] Tester Rich Snippets (Google Rich Results Test)
- [ ] Valider Core Web Vitals (PageSpeed Insights)
- [ ] Soumettre nouveau sitemap
- [ ] Configurer redirections 301 si URLs changent
- [ ] Tester hreflang validator
- [ ] Vérifier canonical URLs
- [ ] Tester rendu mobile
- [ ] Valider Lighthouse scores (> 90)
- [ ] Monitorer erreurs 404 (Search Console)

### B. Outils Recommandés

| Outil | Usage |
|-------|-------|
| Google Search Console | Monitoring indexation |
| Google PageSpeed Insights | Core Web Vitals |
| Lighthouse CI | Tests automatisés |
| Screaming Frog | Audit technique |
| Ahrefs / SEMrush | Suivi positions |

### C. Documentation de Référence

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [next-seo Package](https://github.com/garmeeh/next-seo)
- [next-sitemap Package](https://github.com/iamvishnusankar/next-sitemap)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Document préparé par:** Claude (Expert Architecture Web & SEO)
**Date:** 19 Janvier 2026
**Version:** 1.0

---

*Ce document est confidentiel et destiné uniquement au client Luxoria (18k.ma).*
