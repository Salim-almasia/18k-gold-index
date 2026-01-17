from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func
from datetime import datetime, timedelta, date
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import re

from database import get_db, init_db, restore_db_from_gcs, backup_db_to_gcs
from models import Price, Admin, Category, Article
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


# Blog Pydantic models
class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#D4AF37"


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str
    image: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = "draft"
    reading_time: Optional[int] = 5
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    published_at: Optional[datetime] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    reading_time: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    published_at: Optional[datetime] = None


class ArticleResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    image: Optional[str]
    category_id: Optional[int]
    category: Optional[CategoryResponse]
    status: str
    views: int
    reading_time: int
    meta_title: Optional[str]
    meta_description: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    image: Optional[str]
    category: Optional[CategoryResponse]
    status: str
    views: int
    reading_time: int
    published_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedArticlesResponse(BaseModel):
    articles: List[ArticleListResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class BlogStatsResponse(BaseModel):
    total_articles: int
    published_articles: int
    draft_articles: int
    total_views: int
    total_categories: int


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


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
        ).order_by(Price.date.desc()).all()
    else:
        # Return all historical data (newest first)
        prices = db.query(Price).order_by(Price.date.desc()).all()
    
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


# ==================== BLOG API ENDPOINTS ====================

# --- Public Blog Endpoints ---

@app.get("/api/blog/articles", response_model=PaginatedArticlesResponse)
def get_published_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(9, ge=1, le=50),
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get published articles with pagination"""
    query = db.query(Article).options(joinedload(Article.category)).filter(
        Article.status == "published"
    )

    if category:
        query = query.join(Category).filter(Category.slug == category)

    total = query.count()
    total_pages = (total + per_page - 1) // per_page

    articles = query.order_by(desc(Article.published_at)).offset(
        (page - 1) * per_page
    ).limit(per_page).all()

    return PaginatedArticlesResponse(
        articles=articles,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@app.get("/api/blog/articles/{slug}", response_model=ArticleResponse)
def get_article_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a single article by slug"""
    article = db.query(Article).options(joinedload(Article.category)).filter(
        Article.slug == slug,
        Article.status == "published"
    ).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Increment views
    article.views += 1
    db.commit()

    return article


@app.get("/api/blog/articles/{slug}/related", response_model=List[ArticleListResponse])
def get_related_articles(slug: str, limit: int = 3, db: Session = Depends(get_db)):
    """Get related articles based on category"""
    article = db.query(Article).filter(Article.slug == slug).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    related = db.query(Article).options(joinedload(Article.category)).filter(
        Article.status == "published",
        Article.id != article.id,
        Article.category_id == article.category_id
    ).order_by(desc(Article.published_at)).limit(limit).all()

    # If not enough related, get recent articles
    if len(related) < limit:
        additional = db.query(Article).options(joinedload(Article.category)).filter(
            Article.status == "published",
            Article.id != article.id,
            Article.id.notin_([a.id for a in related])
        ).order_by(desc(Article.published_at)).limit(limit - len(related)).all()
        related.extend(additional)

    return related


@app.get("/api/blog/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    return db.query(Category).order_by(Category.name).all()


# --- Admin Blog Endpoints ---

@app.get("/api/admin/blog/stats", response_model=BlogStatsResponse)
def get_blog_stats(db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    """Get blog statistics"""
    total_articles = db.query(Article).count()
    published_articles = db.query(Article).filter(Article.status == "published").count()
    draft_articles = db.query(Article).filter(Article.status == "draft").count()
    total_views = db.query(func.sum(Article.views)).scalar() or 0
    total_categories = db.query(Category).count()

    return BlogStatsResponse(
        total_articles=total_articles,
        published_articles=published_articles,
        draft_articles=draft_articles,
        total_views=total_views,
        total_categories=total_categories
    )


@app.get("/api/admin/blog/articles", response_model=PaginatedArticlesResponse)
def get_all_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    status: Optional[str] = None,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get all articles (admin)"""
    query = db.query(Article).options(joinedload(Article.category))

    if status:
        query = query.filter(Article.status == status)
    if category_id:
        query = query.filter(Article.category_id == category_id)
    if search:
        query = query.filter(Article.title.ilike(f"%{search}%"))

    total = query.count()
    total_pages = (total + per_page - 1) // per_page

    articles = query.order_by(desc(Article.created_at)).offset(
        (page - 1) * per_page
    ).limit(per_page).all()

    return PaginatedArticlesResponse(
        articles=articles,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )


@app.get("/api/admin/blog/articles/{article_id}", response_model=ArticleResponse)
def get_article_by_id(
    article_id: int,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Get article by ID (admin)"""
    article = db.query(Article).options(joinedload(Article.category)).filter(
        Article.id == article_id
    ).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return article


@app.post("/api/admin/blog/articles", response_model=ArticleResponse)
def create_article(
    article_data: ArticleCreate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Create a new article"""
    # Generate slug
    slug = slugify(article_data.title)

    # Ensure unique slug
    base_slug = slug
    counter = 1
    while db.query(Article).filter(Article.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # Set published_at if publishing
    published_at = article_data.published_at
    if article_data.status == "published" and not published_at:
        published_at = datetime.utcnow()

    article = Article(
        title=article_data.title,
        slug=slug,
        excerpt=article_data.excerpt,
        content=article_data.content,
        image=article_data.image,
        category_id=article_data.category_id,
        status=article_data.status,
        reading_time=article_data.reading_time,
        meta_title=article_data.meta_title,
        meta_description=article_data.meta_description,
        published_at=published_at
    )

    db.add(article)
    db.commit()
    db.refresh(article)

    # Reload with category
    article = db.query(Article).options(joinedload(Article.category)).filter(
        Article.id == article.id
    ).first()

    backup_db_to_gcs()
    return article


@app.put("/api/admin/blog/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    article_data: ArticleUpdate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Update an article"""
    article = db.query(Article).filter(Article.id == article_id).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    update_data = article_data.dict(exclude_unset=True)

    # Regenerate slug if title changed
    if "title" in update_data:
        new_slug = slugify(update_data["title"])
        if new_slug != article.slug:
            base_slug = new_slug
            counter = 1
            while db.query(Article).filter(Article.slug == new_slug, Article.id != article_id).first():
                new_slug = f"{base_slug}-{counter}"
                counter += 1
            update_data["slug"] = new_slug

    # Set published_at if changing to published
    if update_data.get("status") == "published" and not article.published_at:
        update_data["published_at"] = datetime.utcnow()

    for key, value in update_data.items():
        setattr(article, key, value)

    db.commit()
    db.refresh(article)

    # Reload with category
    article = db.query(Article).options(joinedload(Article.category)).filter(
        Article.id == article.id
    ).first()

    backup_db_to_gcs()
    return article


@app.delete("/api/admin/blog/articles/{article_id}")
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Delete an article"""
    article = db.query(Article).filter(Article.id == article_id).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    db.delete(article)
    db.commit()

    backup_db_to_gcs()
    return {"message": "Article deleted successfully"}


# --- Category Admin Endpoints ---

@app.post("/api/admin/blog/categories", response_model=CategoryResponse)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Create a new category"""
    slug = slugify(category_data.name)

    # Check if exists
    if db.query(Category).filter(Category.slug == slug).first():
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(
        name=category_data.name,
        slug=slug,
        color=category_data.color
    )

    db.add(category)
    db.commit()
    db.refresh(category)

    backup_db_to_gcs()
    return category


@app.put("/api/admin/blog/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Update a category"""
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = category_data.name
    category.slug = slugify(category_data.name)
    category.color = category_data.color

    db.commit()
    db.refresh(category)

    backup_db_to_gcs()
    return category


@app.delete("/api/admin/blog/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """Delete a category"""
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Set articles to no category
    db.query(Article).filter(Article.category_id == category_id).update(
        {Article.category_id: None}
    )

    db.delete(category)
    db.commit()

    backup_db_to_gcs()
    return {"message": "Category deleted successfully"}


# --- File Upload Endpoint ---

@app.post("/api/admin/upload")
async def upload_file(
    file: UploadFile = File(...),
    token: dict = Depends(verify_token)
):
    """Upload an image file"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type")

    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    # Save file
    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    return {"filename": filename, "url": f"/uploads/{filename}"}


# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

