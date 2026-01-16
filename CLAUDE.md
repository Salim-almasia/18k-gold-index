# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luxoria (18k.ma) - A Moroccan gold price tracker displaying current and historical gold prices in Moroccan Dirham (MAD) per gram, with a 30-day price history chart and admin dashboard for managing price data. The website is in French.

## Development Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python main.py            # Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start                 # Runs on http://localhost:3000
npm run build             # Production build
npm test                  # Run tests
```

### Deployment
```bash
./deploy.sh               # Deploy both backend and frontend to Google Cloud Run
./deploy.sh backend       # Deploy backend only
./deploy.sh frontend      # Deploy frontend only
```

## Architecture

**Backend (FastAPI + SQLite):**
- `backend/main.py` - All API endpoints and FastAPI app configuration
- `backend/models.py` - SQLAlchemy models (Price, Admin tables)
- `backend/database.py` - Database config and GCS backup/restore functions
- `backend/auth.py` - JWT authentication and password hashing

**Frontend (React):**
- `frontend/src/App.js` - Main router component
- `frontend/src/config.js` - API URL configuration
- `frontend/src/components/` - React components (PriceDisplay, PriceChart, AdminLogin, AdminDashboard)
- `frontend/src/styles/` - Component-specific CSS files

## API Endpoints

**Public:**
- `GET /api/prices/current` - Current gold price with 24h variation
- `GET /api/prices/history?days=30` - Historical prices

**Admin (JWT Protected):**
- `POST /api/admin/login` - Authenticate and get JWT token
- `POST /api/admin/prices` - Add/update price for a date
- `GET /api/admin/prices/all` - Retrieve all prices

## Database

SQLite with automatic GCS backup on Cloud Run. Tables:
- `prices`: id, date (unique), price_per_gram_mad, created_at
- `admin`: id, password_hash

On startup: restores from GCS, initializes tables, creates default admin if missing, populates sample data if empty.

## Key Configuration

- Default admin password: `admin123` (defined in `backend/auth.py`)
- JWT secret: `your-secret-key-change-in-production` (in `backend/auth.py`)
- CORS origins: configured in `backend/main.py`
- GCS bucket: `luxoria-gold-prices-db` (env: `GCS_BUCKET_NAME`)

## Conventions

- French localization throughout (fr-FR formatting)
- Gold accent color: #C9A961
- All numeric displays use French locale formatting
- Admin endpoints require Bearer token authentication
- Prices stored with 2 decimal precision
