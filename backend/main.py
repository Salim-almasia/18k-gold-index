from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta, date
from pydantic import BaseModel
from typing import List, Optional

from database import get_db, init_db, restore_db_from_gcs, backup_db_to_gcs
from models import Price, Admin
from auth import (
    verify_password,
    create_access_token,
    verify_token,
    init_admin_password,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Initialize FastAPI app
app = FastAPI(title="Gold Price API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gold-prices-frontend-250518917656.us-central1.run.app",
        "https://almasia-landing-250518917656.us-central1.run.app",
        "https://18k.ma",
        "https://www.18k.ma",
        "http://18k.ma",
        "http://www.18k.ma",
        "http://34.54.176.240",
        "http://34.79.168.13",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class LoginRequest(BaseModel):
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class PriceRequest(BaseModel):
    date: date
    price_per_gram_mad: float


class PriceResponse(BaseModel):
    id: int
    date: date
    price_per_gram_mad: float
    created_at: datetime

    class Config:
        from_attributes = True


class CurrentPriceResponse(BaseModel):
    date: date
    price_per_gram_mad: float
    variation_24h: Optional[float] = None


# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Initialize database and admin on startup"""
    # First, try to restore database from GCS
    print("🔄 Checking for existing database backup in Google Cloud Storage...")
    restore_db_from_gcs()
    
    # Initialize database tables
    init_db()
    db = next(get_db())
    init_admin_password(db)
    
    # Auto-populate with sample data if database is empty
    price_count = db.query(Price).count()
    if price_count == 0:
        print("Database is empty. Auto-populating with sample data...")
        import random
        from datetime import date as date_obj, timedelta as td
        
        base_price = 1250.0
        today = date_obj.today()
        
        # Add 30 days of historical data
        for i in range(30, 0, -1):
            price_date = today - td(days=i)
            variation = random.uniform(-0.02, 0.02)
            trend = (30 - i) * 0.3
            price_value = round(base_price * (1 + variation) + trend, 2)
            
            sample_price = Price(
                date=price_date,
                price_per_gram_mad=price_value
            )
            db.add(sample_price)
        
        # Add today's price
        today_price = Price(
            date=today,
            price_per_gram_mad=1280.50
        )
        db.add(today_price)
        db.commit()
        print(f"✓ Auto-populated database with 31 sample prices")
    else:
        print(f"✓ Database already has {price_count} entries")
    
    db.close()


@app.on_event("shutdown")
def shutdown_event():
    """Backup database to GCS on shutdown"""
    print("🔄 Backing up database to Google Cloud Storage...")
    backup_db_to_gcs()


# Public endpoints
@app.get("/")
def read_root():
    """Root endpoint"""
    return {"message": "Gold Price API"}


@app.get("/api/prices/current", response_model=CurrentPriceResponse)
def get_current_price(db: Session = Depends(get_db)):
    """Get the most recent gold price"""
    latest_price = db.query(Price).order_by(desc(Price.date)).first()
    
    if not latest_price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No price data available"
        )
    
    # Calculate 24h variation
    previous_price = db.query(Price).filter(
        Price.date < latest_price.date
    ).order_by(desc(Price.date)).first()
    
    variation_24h = None
    if previous_price and previous_price.price_per_gram_mad > 0:
        variation_24h = (
            (latest_price.price_per_gram_mad - previous_price.price_per_gram_mad) 
            / previous_price.price_per_gram_mad * 100
        )
    
    return CurrentPriceResponse(
        date=latest_price.date,
        price_per_gram_mad=latest_price.price_per_gram_mad,
        variation_24h=variation_24h
    )


@app.get("/api/prices/history", response_model=List[PriceResponse])
def get_price_history(days: Optional[int] = None, db: Session = Depends(get_db)):
    """Get historical gold prices. By default returns all data. Use 'days' parameter to limit (e.g., ?days=30 for last 30 days)"""
    
    if days is not None:
        cutoff_date = datetime.now().date() - timedelta(days=days)
        prices = db.query(Price).filter(
            Price.date >= cutoff_date
        ).order_by(Price.date).all()
    else:
        # Return all historical data
        prices = db.query(Price).order_by(Price.date).all()
    
    return prices


# Admin endpoints
@app.post("/api/admin/login", response_model=TokenResponse)
def admin_login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    admin = db.query(Admin).first()
    
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "admin"}, expires_delta=access_token_expires
    )
    
    return TokenResponse(access_token=access_token, token_type="bearer")


@app.post("/api/admin/prices", response_model=PriceResponse)
def add_price(
    price_data: PriceRequest,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Add a new gold price (protected endpoint)"""
    # Check if price for this date already exists
    existing_price = db.query(Price).filter(Price.date == price_data.date).first()
    
    if existing_price:
        # Update existing price
        existing_price.price_per_gram_mad = price_data.price_per_gram_mad
        existing_price.created_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_price)
        result = existing_price
    else:
        # Create new price entry
        new_price = Price(
            date=price_data.date,
            price_per_gram_mad=price_data.price_per_gram_mad
        )
        db.add(new_price)
        db.commit()
        db.refresh(new_price)
        result = new_price
    
    # Backup database after price update
    backup_db_to_gcs()
    
    return result


@app.get("/api/admin/prices/all", response_model=List[PriceResponse])
def get_all_prices(
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get all prices (protected endpoint)"""
    prices = db.query(Price).order_by(desc(Price.date)).all()
    return prices


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

