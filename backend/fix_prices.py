#!/usr/bin/env python3
"""Fix prices from the correct CSV file"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, Price
from datetime import datetime

def parse_price(price_str):
    """Parse price string like '652,20 MAD' or '1 000,0 MAD' to float"""
    if not price_str or price_str.strip() == '':
        return None
    # Remove 'MAD', spaces (including thousands separator), replace comma with dot
    clean = price_str.replace('MAD', '').replace(' ', '').replace(',', '.').strip()
    try:
        return float(clean)
    except:
        return None

def parse_date(date_str):
    """Parse date in YYYY-MM-DD or DD/MM/YYYY format"""
    date_str = date_str.strip()
    # Try YYYY-MM-DD first
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        pass
    # Try DD/MM/YYYY
    try:
        return datetime.strptime(date_str, '%d/%m/%Y').date()
    except:
        pass
    return None

def restore_prices():
    """Restore all prices from the correct CSV"""
    db = SessionLocal()

    try:
        # Delete all existing prices
        deleted = db.query(Price).delete()
        db.commit()
        print(f"Deleted {deleted} existing prices")

        # Read the correct CSV file
        csv_path = '/Users/salim/Desktop/$.csv'
        with open(csv_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        count = 0
        for i, line in enumerate(lines):
            if i == 0:  # Skip header
                continue

            parts = line.strip().split(';')
            if len(parts) >= 2:
                date_str = parts[0].strip()
                price_str = parts[1].strip()

                date = parse_date(date_str)
                price_value = parse_price(price_str)

                if date and price_value:
                    price = Price(date=date, price_per_gram_mad=price_value)
                    db.add(price)
                    count += 1
                    if count <= 5 or count % 50 == 0:
                        print(f"  {date} -> {price_value} MAD")

        db.commit()
        print(f"\nRestored {count} prices from CSV")

        # Show latest price
        latest = db.query(Price).order_by(Price.date.desc()).first()
        if latest:
            print(f"\nLatest price: {latest.date} -> {latest.price_per_gram_mad} MAD")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("FIXING PRICES FROM CORRECT CSV")
    print("=" * 50)
    Base.metadata.create_all(bind=engine)
    restore_prices()
    print("=" * 50)
    print("DONE")
    print("=" * 50)
