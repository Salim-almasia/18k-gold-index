from sqlalchemy import Column, Integer, Float, String, Date, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from database import Base


class Price(Base):
    """Model for gold prices"""
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, nullable=False, index=True)
    price_per_gram_mad = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Admin(Base):
    """Model for admin authentication"""
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)
    password_hash = Column(String, nullable=False)


class Category(Base):
    """Model for blog categories"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    # French fields
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    # Arabic fields
    name_ar = Column(String(100), nullable=True)
    # Common fields
    color = Column(String(7), default="#D4AF37")
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    articles = relationship("Article", back_populates="category")


class Article(Base):
    """Model for blog articles - Bilingual (French/Arabic)"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)

    # French content
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    excerpt = Column(String(300))
    content = Column(Text, nullable=False)
    meta_title = Column(String(200))
    meta_description = Column(String(300))

    # Arabic content
    title_ar = Column(String(200), nullable=True)
    slug_ar = Column(String(200), nullable=True, index=True)
    excerpt_ar = Column(String(300), nullable=True)
    content_ar = Column(Text, nullable=True)
    meta_title_ar = Column(String(200), nullable=True)
    meta_description_ar = Column(String(300), nullable=True)

    # Common fields
    image = Column(String(500))
    category_id = Column(Integer, ForeignKey("categories.id"))
    status = Column(String(20), default="draft")  # draft, published
    views = Column(Integer, default=0)
    reading_time = Column(Integer, default=5)  # in minutes
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="articles")


class NewsletterSubscriber(Base):
    """Model for newsletter subscribers"""
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
