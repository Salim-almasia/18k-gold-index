"""
Script to initialize the database with sample gold price data.
This creates 30 days of sample data for testing purposes.
"""

from datetime import datetime, timedelta
from database import init_db, SessionLocal
from models import Price
from auth import init_admin_password
import random


def create_sample_data():
    """Create 30 days of sample gold price data"""
    init_db()
    db = SessionLocal()
    
    try:
        # Initialize admin password
        init_admin_password(db, password="admin123")
        print("✓ Admin password initialized: admin123")
        
        # Check if data already exists
        existing_count = db.query(Price).count()
        if existing_count > 0:
            print(f"✓ Database already contains {existing_count} price entries")
            response = input("Do you want to add more sample data? (y/n): ")
            if response.lower() != 'y':
                print("Skipping sample data creation")
                return
        
        # Generate 30 days of sample data
        base_price = 1200.00  # Base price around 1200 MAD per gram
        today = datetime.now().date()
        
        print("\nGenerating 30 days of sample data...")
        
        for i in range(30, 0, -1):  # From 30 days ago to today
            date = today - timedelta(days=i)
            
            # Check if price for this date already exists
            existing_price = db.query(Price).filter(Price.date == date).first()
            if existing_price:
                print(f"  - {date}: Price already exists, skipping")
                continue
            
            # Generate realistic price variation (±2% from base)
            variation = random.uniform(-0.02, 0.02)
            price = base_price * (1 + variation)
            
            # Add some trend (slight increase over time)
            trend = (30 - i) * 0.5
            price += trend
            
            # Round to 2 decimal places
            price = round(price, 2)
            
            # Create price entry
            price_entry = Price(
                date=date,
                price_per_gram_mad=price
            )
            db.add(price_entry)
            print(f"  ✓ {date}: {price} MAD/g")
        
        # Add today's price if not exists
        today_price = db.query(Price).filter(Price.date == today).first()
        if not today_price:
            latest_price = round(base_price * 1.03, 2)  # 3% higher than base
            today_entry = Price(
                date=today,
                price_per_gram_mad=latest_price
            )
            db.add(today_entry)
            print(f"  ✓ {today}: {latest_price} MAD/g (TODAY)")
        
        db.commit()
        print("\n✓ Sample data created successfully!")
        print(f"✓ Total entries in database: {db.query(Price).count()}")
        
    except Exception as e:
        print(f"✗ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Gold Price Database Initialization")
    print("=" * 60)
    create_sample_data()
    print("\n" + "=" * 60)
    print("You can now start the FastAPI server with: python main.py")
    print("Default admin password: admin123")
    print("=" * 60)




