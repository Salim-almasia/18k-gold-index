# Add this to main.py if you want a manual initialization endpoint

@app.post("/api/admin/initialize-data")
def initialize_sample_data(
    db: Session = Depends(get_db),
    token: dict = Depends(verify_token)
):
    """
    Initialize database with sample data (admin only)
    Call this endpoint if your database is empty
    """
    import random
    from datetime import date as date_obj, timedelta as td
    
    # Check if already has data
    price_count = db.query(Price).count()
    if price_count > 0:
        return {
            "message": "Database already has data",
            "existing_entries": price_count
        }
    
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
    
    return {
        "message": "Sample data initialized successfully",
        "entries_added": 31,
        "date_range": f"{today - td(days=30)} to {today}"
    }



