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
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    color = Column(String(7), default="#D4AF37")
    created_at = Column(DateTime, default=datetime.utcnow)

    articles = relationship("Article", back_populates="category")


class Article(Base):
    """Model for blog articles"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False, index=True)
    excerpt = Column(String(300))
    content = Column(Text, nullable=False)
    image = Column(String(500))
    category_id = Column(Integer, ForeignKey("categories.id"))
    status = Column(String(20), default="draft")  # draft, published
    views = Column(Integer, default=0)
    reading_time = Column(Integer, default=5)  # in minutes
    meta_title = Column(String(200))
    meta_description = Column(String(300))
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="articles")




