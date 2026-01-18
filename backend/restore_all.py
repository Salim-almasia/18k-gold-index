#!/usr/bin/env python3
"""
Script to restore prices from CSV and re-seed blog articles
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models import Base, Price, Category, Article
from datetime import datetime
import re

def parse_price(price_str):
    """Parse price string like '652,2 MAD' to float"""
    if not price_str or price_str.strip() == '.' or price_str.strip() == '':
        return None
    # Remove 'MAD' and spaces, replace comma with dot
    clean = price_str.replace('MAD', '').replace(' ', '').replace(',', '.').strip()
    try:
        return float(clean)
    except:
        return None

def restore_prices():
    """Restore all prices from CSV"""
    db = SessionLocal()

    try:
        # Delete all existing prices
        db.query(Price).delete()
        db.commit()
        print("Deleted all existing prices")

        # Read CSV file
        csv_path = os.path.join(os.path.dirname(__file__), 'prices.csv')
        with open(csv_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        count = 0
        for line in lines:
            parts = line.strip().split(';')
            if len(parts) >= 3:
                date_str = parts[0].strip()
                # Use the second price column (index 2) as it's more complete
                price_str = parts[2].strip() if parts[2].strip() and parts[2].strip() != '.' else parts[1].strip()

                price_value = parse_price(price_str)

                if price_value:
                    try:
                        date = datetime.strptime(date_str, '%Y-%m-%d').date()
                        price = Price(date=date, price_per_gram_mad=price_value)
                        db.add(price)
                        count += 1
                    except Exception as e:
                        print(f"Error parsing line: {line.strip()} - {e}")

        db.commit()
        print(f"Restored {count} prices from CSV")

    except Exception as e:
        print(f"Error restoring prices: {e}")
        db.rollback()
    finally:
        db.close()

def seed_blog():
    """Re-seed blog categories and articles"""
    db = SessionLocal()

    try:
        # Delete existing articles and categories
        db.query(Article).delete()
        db.query(Category).delete()
        db.commit()
        print("Deleted existing blog data")

        # Create categories
        categories_data = [
            {"name": "Bijoux", "slug": "bijoux", "color": "#D4AF37"},
            {"name": "Or", "slug": "or", "color": "#C9A961"},
            {"name": "Guide", "slug": "guide", "color": "#002FA7"},
        ]

        categories = {}
        for cat_data in categories_data:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            categories[cat_data["slug"]] = cat

        # Create articles
        articles_data = [
            {
                "title": "Comment est calculé le prix d'un bijou en or ?",
                "slug": "comment-est-calcule-le-prix-dun-bijou-en-or",
                "excerpt": "L'or fascine autant par sa beauté que par sa valeur. Découvrez comment est réellement calculé le prix d'un bijou en or.",
                "content": """<p>L'or fascine autant par sa beauté que par sa valeur. Pourtant, beaucoup de personnes se demandent comment est réellement calculé le prix d'un bijou en or. Pourquoi deux bagues au design similaire peuvent-elles coûter des montants très différents ?</p>

<h2>Les composantes du prix d'un bijou en or</h2>

<p>Le prix d'un bijou en or se compose de plusieurs éléments :</p>

<ul>
<li><strong>Le poids de l'or</strong> : mesuré en grammes, c'est la base du calcul</li>
<li><strong>La pureté (caratage)</strong> : 18K, 14K, 9K... plus le caratage est élevé, plus le bijou contient d'or pur</li>
<li><strong>Le cours de l'or</strong> : fluctue quotidiennement sur les marchés internationaux</li>
<li><strong>La main d'œuvre</strong> : le travail de l'artisan bijoutier</li>
<li><strong>Les pierres précieuses</strong> : si le bijou en contient</li>
</ul>

<h2>Le calcul de base</h2>

<p>Pour un bijou en or 18 carats (75% d'or pur) :</p>
<p><strong>Prix = Poids × Cours de l'or × 0.75 + Main d'œuvre + Marge</strong></p>

<h2>Pourquoi le 18K au Maroc ?</h2>

<p>Au Maroc, le standard légal est l'or 18 carats. Cela garantit un bon équilibre entre pureté et durabilité du bijou.</p>""",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2025/12/Blog-Hero-Comp.png",
                "category": categories["guide"],
                "status": "published",
                "reading_time": 12,
                "published_at": datetime(2025, 1, 15)
            },
            {
                "title": "Comment comparer deux bagues en or au même prix ?",
                "slug": "comment-comparer-deux-bagues-en-or-au-meme-prix",
                "excerpt": "Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur.",
                "content": """<p>Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur. Découvrez les critères essentiels pour faire un choix éclairé.</p>

<h2>Le poids : critère fondamental</h2>

<p>Le premier réflexe doit être de comparer le poids. Une bague de 5g ne vaut pas la même chose qu'une bague de 3g, même si elles sont vendues au même prix.</p>

<h2>La qualité de fabrication</h2>

<p>Observez attentivement :</p>
<ul>
<li>Les finitions</li>
<li>La régularité des soudures</li>
<li>Le polissage</li>
<li>La symétrie du design</li>
</ul>

<h2>Le poinçon : garantie d'authenticité</h2>

<p>Au Maroc, tout bijou en or doit porter un poinçon officiel garantissant sa teneur en or. Vérifiez toujours sa présence.</p>""",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/3-1.png",
                "category": categories["bijoux"],
                "status": "published",
                "reading_time": 8,
                "published_at": datetime(2025, 1, 11)
            },
            {
                "title": "Comment reconnaître un bijou en or authentique ?",
                "slug": "comment-reconnaitre-un-bijou-en-or-authentique",
                "excerpt": "Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons.",
                "content": """<p>Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons. Découvrez les méthodes simples et professionnelles pour distinguer l'or authentique d'une copie.</p>

<h2>Les tests simples à faire soi-même</h2>

<h3>Le test du poinçon</h3>
<p>Recherchez le poinçon officiel, souvent situé à l'intérieur du bijou. Au Maroc, le poinçon certifie la teneur en or.</p>

<h3>Le test de l'aimant</h3>
<p>L'or pur n'est pas magnétique. Si votre bijou est attiré par un aimant, il contient probablement d'autres métaux.</p>

<h3>Le test visuel</h3>
<p>L'or véritable ne ternit pas et ne rouille pas. Des traces verdâtres indiquent souvent un plaqué or.</p>

<h2>Les tests professionnels</h2>

<p>Pour une certitude absolue, consultez un bijoutier professionnel qui dispose d'outils spécialisés :</p>
<ul>
<li>Test à l'acide</li>
<li>Spectromètre</li>
<li>Balance de précision</li>
</ul>""",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/1-1.png",
                "category": categories["or"],
                "status": "published",
                "reading_time": 10,
                "published_at": datetime(2025, 1, 9)
            },
            {
                "title": "Pourquoi le 18K est le standard légal de l'or marocain ?",
                "slug": "pourquoi-18k-standard-legal-or-marocain",
                "excerpt": "Au Maroc, l'or occupe une place centrale dans la culture et les traditions. Découvrez pourquoi le 18 carats est devenu le standard légal.",
                "content": """<p>Au Maroc, l'or occupe une place centrale dans la culture et les traditions. Découvrez pourquoi le 18 carats est devenu le standard légal pour la bijouterie marocaine.</p>

<h2>Qu'est-ce que l'or 18 carats ?</h2>

<p>L'or 18 carats contient 75% d'or pur, mélangé à 25% d'autres métaux (cuivre, argent, zinc). Ce mélange apporte :</p>
<ul>
<li><strong>Durabilité</strong> : plus résistant que l'or pur (24K)</li>
<li><strong>Beauté</strong> : conserve l'éclat caractéristique de l'or</li>
<li><strong>Valeur</strong> : teneur élevée garantissant une bonne valeur de revente</li>
</ul>

<h2>La réglementation marocaine</h2>

<p>Le Maroc a adopté le 18 carats comme standard légal pour plusieurs raisons :</p>
<ul>
<li>Protection des consommateurs</li>
<li>Standardisation du marché</li>
<li>Équilibre qualité-durabilité optimal</li>
</ul>

<h2>Comment vérifier ?</h2>

<p>Tout bijou en or vendu au Maroc doit porter le poinçon officiel "750" ou le symbole de l'hippocampe, garantissant sa teneur en or.</p>""",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/2-1.png",
                "category": categories["or"],
                "status": "published",
                "reading_time": 7,
                "published_at": datetime(2025, 1, 5)
            },
        ]

        for article_data in articles_data:
            article = Article(**article_data)
            db.add(article)

        db.commit()
        print(f"Created {len(categories_data)} categories and {len(articles_data)} articles")

    except Exception as e:
        print(f"Error seeding blog: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("RESTORING DATABASE")
    print("=" * 50)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    print("\n1. Restoring prices from CSV...")
    restore_prices()

    print("\n2. Seeding blog articles...")
    seed_blog()

    print("\n" + "=" * 50)
    print("RESTORATION COMPLETE")
    print("=" * 50)
