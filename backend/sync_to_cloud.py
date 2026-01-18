#!/usr/bin/env python3
"""
Sync local database to Cloud Run backend
"""
import sqlite3
import requests
import json

# Configuration
LOCAL_DB = "gold_prices.db"
CLOUD_BACKEND = "https://gold-prices-backend-quqmk4x6yq-uc.a.run.app"
ADMIN_PASSWORD = "admin123"

def get_token():
    """Get admin JWT token"""
    response = requests.post(
        f"{CLOUD_BACKEND}/api/admin/login",
        json={"password": ADMIN_PASSWORD}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.text}")
        return None

def sync_prices(token):
    """Sync prices to cloud"""
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()

    cursor.execute("SELECT date, price_per_gram_mad FROM prices ORDER BY date")
    prices = cursor.fetchall()
    conn.close()

    headers = {"Authorization": f"Bearer {token}"}

    print(f"\nSyncing {len(prices)} prices...")
    for date, price in prices:
        response = requests.post(
            f"{CLOUD_BACKEND}/api/admin/prices",
            json={"date": date, "price_per_gram_mad": price},
            headers=headers
        )
        if response.status_code in [200, 201]:
            print(f"  ✓ {date}: {price} MAD")
        else:
            print(f"  ✗ {date}: {response.text}")

    print("Prices synced!")

def sync_categories(token):
    """Sync categories to cloud"""
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()

    # Check if categories table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='categories'")
    if not cursor.fetchone():
        print("No categories table found")
        conn.close()
        return {}

    cursor.execute("SELECT id, name, slug, color FROM categories")
    categories = cursor.fetchall()
    conn.close()

    if not categories:
        print("No categories found")
        return {}

    headers = {"Authorization": f"Bearer {token}"}
    category_map = {}  # old_id -> new_id

    print(f"\nSyncing {len(categories)} categories...")
    for old_id, name, slug, color in categories:
        response = requests.post(
            f"{CLOUD_BACKEND}/api/admin/blog/categories",
            json={"name": name, "color": color or "#D4AF37"},
            headers=headers
        )
        if response.status_code in [200, 201]:
            new_id = response.json().get("id")
            category_map[old_id] = new_id
            print(f"  ✓ {name}")
        else:
            print(f"  ✗ {name}: {response.text}")

    print("Categories synced!")
    return category_map

def sync_articles(token, category_map):
    """Sync articles to cloud"""
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()

    # Check if articles table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='articles'")
    if not cursor.fetchone():
        print("No articles table found")
        conn.close()
        return

    cursor.execute("""
        SELECT title, slug, excerpt, content, image, category_id,
               status, reading_time, meta_title, meta_description
        FROM articles
    """)
    articles = cursor.fetchall()
    conn.close()

    if not articles:
        print("No articles found")
        return

    headers = {"Authorization": f"Bearer {token}"}

    print(f"\nSyncing {len(articles)} articles...")
    for article in articles:
        title, slug, excerpt, content, image, category_id, status, reading_time, meta_title, meta_description = article

        # Map old category_id to new one
        new_category_id = category_map.get(category_id) if category_id else None

        response = requests.post(
            f"{CLOUD_BACKEND}/api/admin/blog/articles",
            json={
                "title": title,
                "excerpt": excerpt or "",
                "content": content or "",
                "image": image or "",
                "category_id": new_category_id,
                "status": status or "draft",
                "reading_time": reading_time or 5,
                "meta_title": meta_title or "",
                "meta_description": meta_description or ""
            },
            headers=headers
        )
        if response.status_code in [200, 201]:
            print(f"  ✓ {title}")
        else:
            print(f"  ✗ {title}: {response.text}")

    print("Articles synced!")

def main():
    print("=" * 50)
    print("  Sync Local Data to Cloud")
    print("=" * 50)

    # Get token
    print("\nLogging in...")
    token = get_token()
    if not token:
        print("Failed to login. Check password.")
        return
    print("✓ Logged in!")

    # Sync data
    sync_prices(token)
    category_map = sync_categories(token)
    sync_articles(token, category_map)

    print("\n" + "=" * 50)
    print("  Sync Complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()
