# Cours de l'Or au Maroc

Site web pour afficher le prix de l'or en Dirham Marocain (MAD) avec historique des 30 derniers jours.

## 🌟 Fonctionnalités

- **Affichage du prix actuel** : Prix de l'or par gramme en MAD
- **Variation 24h** : Pourcentage de changement par rapport au jour précédent
- **Graphique historique** : Visualisation des prix sur les 30 derniers jours
- **Interface administrateur** : Gestion des prix quotidiens avec authentification

## 🛠️ Technologies utilisées

### Backend
- **FastAPI** : Framework web Python moderne et rapide
- **SQLite** : Base de données légère
- **SQLAlchemy** : ORM pour la gestion de la base de données
- **JWT** : Authentification sécurisée pour l'admin

### Frontend
- **React.js** : Bibliothèque JavaScript pour l'interface utilisateur
- **React Router** : Navigation entre les pages
- **Recharts** : Graphiques interactifs
- **Axios** : Requêtes HTTP vers l'API

## 📦 Installation

### Prérequis
- Python 3.8 ou supérieur
- Node.js 14 ou supérieur
- npm ou yarn

### Backend

1. Naviguez vers le dossier backend :
```bash
cd backend
```

2. Créez un environnement virtuel (recommandé) :
```bash
python -m venv venv
source venv/bin/activate  # Sur macOS/Linux
# ou
venv\Scripts\activate  # Sur Windows
```

3. Installez les dépendances :
```bash
pip install -r requirements.txt
```

4. (Optionnel) Initialisez la base de données avec des données d'exemple :
```bash
python init_sample_data.py
```

5. Lancez le serveur :
```bash
python main.py
```

Le serveur backend sera accessible sur `http://localhost:8000`

### Frontend

1. Ouvrez un nouveau terminal et naviguez vers le dossier frontend :
```bash
cd frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application React :
```bash
npm start
```

L'application frontend sera accessible sur `http://localhost:3000`

## 🔐 Configuration Admin

### Mot de passe par défaut
Au premier lancement, un compte administrateur est créé automatiquement avec le mot de passe :
```
admin123
```

**⚠️ IMPORTANT : Changez ce mot de passe en production !**

Pour changer le mot de passe :
1. Modifiez la fonction `init_admin_password()` dans `backend/auth.py`
2. Supprimez le fichier `gold_prices.db`
3. Relancez le serveur backend

### Clé secrète JWT
Pour la production, changez la clé secrète dans `backend/auth.py` :
```python
SECRET_KEY = "your-secret-key-change-in-production"
```

Générez une clé sécurisée avec :
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 📖 Utilisation

### Page publique
- Visitez `http://localhost:3000` pour voir le prix actuel de l'or
- Cliquez sur "Actualiser les données" pour recharger les prix
- Le graphique affiche l'évolution sur 30 jours

### Interface administrateur
1. Cliquez sur "Administration" en haut à droite
2. Connectez-vous avec le mot de passe admin
3. Ajoutez un nouveau prix en saisissant :
   - La date (par défaut : aujourd'hui)
   - Le prix par gramme en MAD
4. Cliquez sur "Ajouter le prix"
5. Les prix récents sont affichés dans le tableau

### API Endpoints

#### Endpoints publics
- `GET /api/prices/current` - Obtenir le prix actuel
- `GET /api/prices/history` - Obtenir l'historique des 30 derniers jours

#### Endpoints protégés (nécessitent authentification)
- `POST /api/admin/login` - Connexion administrateur
- `POST /api/admin/prices` - Ajouter/modifier un prix
- `GET /api/admin/prices/all` - Obtenir tous les prix

## 🗂️ Structure du projet

```
gold_prices/
├── backend/
│   ├── main.py              # Application FastAPI
│   ├── models.py            # Modèles de base de données
│   ├── database.py          # Configuration SQLite
│   ├── auth.py              # Authentification JWT
│   ├── requirements.txt     # Dépendances Python
│   └── gold_prices.db       # Base de données (créée automatiquement)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PriceDisplay.jsx      # Affichage du prix actuel
│   │   │   ├── PriceChart.jsx        # Graphique historique
│   │   │   ├── AdminLogin.jsx        # Page de connexion admin
│   │   │   └── AdminDashboard.jsx    # Tableau de bord admin
│   │   ├── styles/
│   │   │   ├── PriceDisplay.css
│   │   │   ├── PriceChart.css
│   │   │   ├── AdminLogin.css
│   │   │   └── AdminDashboard.css
│   │   ├── App.js           # Composant principal
│   │   ├── App.css          # Styles globaux
│   │   └── index.js         # Point d'entrée React
│   └── package.json         # Dépendances npm
└── README.md                # Ce fichier
```

## 🚀 Déploiement en production

### Déploiement sur Google Cloud Run (Recommandé)

**⚠️ Important : Le script de déploiement inclut automatiquement la persistence des données !**

Cloud Run utilise un stockage éphémère - les données sont perdues à chaque redémarrage. Notre solution intégrée utilise Google Cloud Storage pour sauvegarder automatiquement la base de données.

#### Déploiement unifié

```bash
# Déploie tout avec sauvegarde automatique sur Google Cloud Storage
./deploy.sh

# Ou déployer uniquement le backend
./deploy.sh backend

# Ou uniquement le frontend
./deploy.sh frontend
```

Ce script :
- ✅ Crée un bucket GCS pour sauvegarder la base de données
- ✅ Configure la sauvegarde/restauration automatique
- ✅ Conserve les 30 dernières versions
- ✅ Déploie backend et/ou frontend avec toutes les configurations
- ✅ Configure CORS et permissions automatiquement

Pour plus de détails, consultez [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) ou [DATABASE_PERSISTENCE_FIX.md](DATABASE_PERSISTENCE_FIX.md)

### Déploiement classique (serveur dédié)

#### Backend
1. Utilisez un serveur WSGI comme Gunicorn :
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

2. Configurez un reverse proxy (Nginx/Apache)
3. Utilisez HTTPS avec un certificat SSL
4. Changez la clé secrète JWT
5. Changez le mot de passe admin

#### Frontend
1. Créez un build de production :
```bash
npm run build
```

2. Déployez le dossier `build/` sur votre hébergeur web
3. Configurez les variables d'environnement pour l'URL de l'API

### Base de données

#### SQLite avec Google Cloud Storage (Par défaut)
- ✅ Automatique avec `deploy_with_persistence.sh`
- ✅ Sauvegardes versionnées (30 dernières versions)
- ✅ Restauration automatique au démarrage
- ✅ Pas de configuration supplémentaire

#### PostgreSQL ou MySQL (Alternative)
Pour des besoins plus avancés, vous pouvez migrer vers Cloud SQL ou PostgreSQL.

## 🔧 Dépannage

### Base de données qui se réinitialise ⚠️

**Problème** : Votre base de données se vide après un redémarrage ou un redéploiement

**Cause** : Cloud Run utilise un stockage éphémère - les données ne persistent pas entre les redémarrages

**Solution** : Utilisez le script de déploiement avec persistence
```bash
./deploy_with_persistence.sh
```

Consultez [FIX_SUMMARY.md](FIX_SUMMARY.md) pour plus de détails.

### Vérifier la persistence

```bash
# Vérifier que les sauvegardes sont créées
gsutil ls -a gs://luxoria-gold-prices-db-YOUR_PROJECT_ID/

# Voir les logs de sauvegarde/restauration
gcloud run services logs read luxoria-backend --region us-central1 --limit=50
```

### Erreur CORS
Si vous rencontrez des erreurs CORS, vérifiez que l'origine du frontend est bien autorisée dans `backend/main.py` :
```python
allow_origins=["http://localhost:3000", "http://localhost:5173"]
```

### Base de données verrouillée
Si SQLite indique que la base est verrouillée, arrêtez tous les processus Python et relancez le serveur.

### Port déjà utilisé
Si le port 8000 ou 3000 est occupé, vous pouvez changer le port :
- Backend : `uvicorn main:app --port 8001`
- Frontend : Modifiez `.env` avec `PORT=3001`

### Permissions GCS
Si les sauvegardes échouent, vérifiez les permissions :
```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

## 📝 Notes

- Les données sont mises à jour manuellement par l'administrateur
- Aucune actualisation automatique n'est activée
- L'historique est limité aux 30 derniers jours
- Les prix sont stockés avec 2 décimales de précision

## 📄 Licence

Ce projet est à usage personnel et éducatif.

## 👨‍💻 Support

Pour toute question ou problème, veuillez consulter la documentation ou créer une issue.

