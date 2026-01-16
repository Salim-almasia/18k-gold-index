from sqlalchemy import Column, Integer, Float, String, Date, DateTime
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




