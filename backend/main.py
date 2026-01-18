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
        "https://gold-prices-frontend-1022015820987.us-central1.run.app",
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
    name_ar: Optional[str] = None
    color: Optional[str] = "#D4AF37"
    position: Optional[int] = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True


class ArticleBase(BaseModel):
    # French content
    title: str
    excerpt: Optional[str] = None
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    # Arabic content
    title_ar: Optional[str] = None
    excerpt_ar: Optional[str] = None
    content_ar: Optional[str] = None
    meta_title_ar: Optional[str] = None
    meta_description_ar: Optional[str] = None
    # Common fields
    image: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = "draft"
    reading_time: Optional[int] = 5
    published_at: Optional[datetime] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    # French content
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    # Arabic content
    title_ar: Optional[str] = None
    excerpt_ar: Optional[str] = None
    content_ar: Optional[str] = None
    meta_title_ar: Optional[str] = None
    meta_description_ar: Optional[str] = None
    # Common fields
    image: Optional[str] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    reading_time: Optional[int] = None
    published_at: Optional[datetime] = None


class ArticleResponse(BaseModel):
    id: int
    # French content
    title: str
    slug: str
    excerpt: Optional[str]
    content: str
    meta_title: Optional[str]
    meta_description: Optional[str]
    # Arabic content
    title_ar: Optional[str]
    slug_ar: Optional[str]
    excerpt_ar: Optional[str]
    content_ar: Optional[str]
    meta_title_ar: Optional[str]
    meta_description_ar: Optional[str]
    # Common fields
    image: Optional[str]
    category_id: Optional[int]
    category: Optional[CategoryResponse]
    status: str
    views: int
    reading_time: int
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    id: int
    # French content
    title: str
    slug: str
    excerpt: Optional[str]
    # Arabic content
    title_ar: Optional[str]
    slug_ar: Optional[str]
    excerpt_ar: Optional[str]
    # Common fields
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


# Seed prices data function
def seed_prices_data(db: Session):
    """Seed sample price data"""
    if db.query(Price).count() > 0:
        print("✓ Prices already exist, skipping seed")
        return

    print("🌱 Seeding price data...")
    prices_data = [
        ("2026-01-17", 1113.0), ("2026-01-16", 1125.0), ("2026-01-15", 1125.0),
        ("2026-01-14", 1130.0), ("2026-01-13", 1082.0), ("2026-01-12", 1080.0),
        ("2026-01-11", 1040.0), ("2026-01-10", 1030.0), ("2026-01-09", 1015.0),
        ("2026-01-08", 1015.0), ("2026-01-07", 1015.0), ("2026-01-06", 1015.0),
        ("2026-01-05", 1015.0), ("2026-01-04", 980.0), ("2026-01-03", 980.0),
        ("2026-01-02", 985.0), ("2026-01-01", 985.0), ("2025-12-31", 985.0),
        ("2025-12-30", 990.0), ("2025-12-29", 995.0), ("2025-12-28", 1005.0),
        ("2025-12-27", 1000.0), ("2025-12-26", 993.0), ("2025-12-25", 990.0),
        ("2025-12-24", 990.0), ("2025-12-23", 992.0), ("2025-12-22", 980.0),
        ("2025-12-21", 970.0), ("2025-12-20", 960.0), ("2025-12-19", 970.0),
    ]
    for date_str, price in prices_data:
        db.add(Price(date=date.fromisoformat(date_str), price_per_gram_mad=price))
    db.commit()
    print(f"✓ Seeded {len(prices_data)} price entries")


# Seed blog data function
def seed_blog_data(db: Session):
    """Seed blog categories and articles from existing data"""
    if db.query(Category).count() > 0:
        print("✓ Blog categories already exist, skipping seed")
        return

    print("🌱 Seeding blog categories and articles...")

    # Create categories (matching existing local data)
    categories_data = [
        {"name": "Or & valeur", "name_ar": "الذهب والقيمة", "slug": "or-valeur", "color": "#D4AF37", "position": 1},
        {"name": "Bijouterie & horlogerie", "name_ar": "المجوهرات والساعات", "slug": "bijouterie-horlogerie", "color": "#8B7355", "position": 2},
        {"name": "Diamant & pierres", "name_ar": "الماس والأحجار", "slug": "diamant-pierres", "color": "#B9F2FF", "position": 3},
        {"name": "Métier & savoir-faire", "name_ar": "المهنة والخبرة", "slug": "metier-savoir-faire", "color": "#C19A6B", "position": 4},
        {"name": "Croyances & idées reçues", "name_ar": "معتقدات وأفكار شائعة", "slug": "croyances-idees-recues", "color": "#9B59B6", "position": 5},
    ]

    categories = {}
    for cat_data in categories_data:
        category = Category(**cat_data)
        db.add(category)
        db.flush()
        categories[cat_data["slug"]] = category

    # Create articles (existing articles with Arabic translations)
    articles_data = [
        {
            "title": "Comment est calculé le prix d'un bijou en or ?",
            "title_ar": "كيف يُحسب سعر مجوهرات الذهب؟",
            "slug": "comment-est-calcule-le-prix-dun-bijou-en-or",
            "excerpt": "L'or fascine autant par sa beauté que par sa valeur. Découvrez comment est réellement calculé le prix d'un bijou en or au Maroc, du cours mondial à la main-d'œuvre artisanale.",
            "excerpt_ar": "يأسر الذهب بجماله وقيمته على حد سواء. اكتشف كيف يُحسب فعلياً سعر مجوهرات الذهب في المغرب، من السعر العالمي إلى العمل الحرفي.",
            "content": """<p>L'or fascine autant par sa beauté que par sa valeur. Pourtant, beaucoup de personnes se demandent comment est réellement calculé le prix d'un bijou en or. Pourquoi deux bagues au design similaire peuvent-elles coûter des montants différents ? Cette question revient souvent, aussi bien chez les acheteurs que chez les passionnés de bijoux.</p>

<h2>Les bases : comprendre l'or et ses carats</h2>
<h3>Qu'est-ce que le carat ?</h3>
<p>Le carat est l'unité qui permet de mesurer la pureté de l'or utilisé dans un bijou. L'or pur correspond à 24 carats. Comme il est très malléable et fragile, on le mélange à d'autres métaux (argent, cuivre, palladium, etc.) afin d'obtenir un alliage plus solide et plus adapté à la fabrication de bijoux.</p>
<p>À titre indicatif :</p>
<ul>
<li><strong>24 carats</strong> = or pur</li>
<li><strong>22 carats</strong> = 91,6 % d'or</li>
<li><strong>21 carats</strong> = 87,5 % d'or</li>
<li><strong>18 carats</strong> = 75 % d'or</li>
<li><strong>14 carats</strong> = 58,5 % d'or</li>
<li><strong>9 carats</strong> = 37,5 % d'or</li>
</ul>

<h3>Quels carats utilise-t-on le plus au Maroc ?</h3>
<p>Au Maroc, l'or 18 carats (750/1000) est la référence officielle et la plus utilisée dans le commerce réglementé. C'est ce que l'on retrouve dans la grande majorité des bijouteries, car il offre un bon équilibre entre pureté, solidité et valeur.</p>

<h2>Le premier facteur : le cours de l'or</h2>
<h3>Comment est fixé le prix de l'or ?</h3>
<p>Le prix de l'or n'est pas décidé par les bijoutiers ; il est déterminé sur les marchés internationaux. Ce cours officiel évolue en continu et peut varier d'un jour à l'autre. Le prix est fixé d'abord en dollars par once (unité de mesure internationale), puis converti en dirhams selon le taux de change du moment.</p>

<h3>Pourquoi le prix change-t-il ?</h3>
<p>Le cours de l'or est influencé par plusieurs facteurs économiques :</p>
<ul>
<li>La loi de l'offre et de la demande</li>
<li>Les périodes d'incertitude économique (l'or comme valeur refuge)</li>
<li>L'inflation et les décisions des banques centrales</li>
<li>La situation géopolitique et l'évolution du dollar</li>
</ul>

<h2>Le deuxième facteur : le poids du bijou</h2>
<h3>Comment le bijoutier pèse-t-il l'or ?</h3>
<p>Le poids du bijou est un élément essentiel dans le calcul de son prix. En bijouterie, l'or est toujours pesé avec une balance électronique très précise, au gramme près, voire au centième de gramme.</p>

<h3>Calculer simplement</h3>
<p>Pour comprendre facilement, on peut résumer le calcul de la valeur de l'or dans un bijou ainsi :</p>
<p><em>"Prix du gramme d'or pur × pourcentage d'or selon le carat × poids du bijou"</em></p>
<p>Par exemple, pour un bijou en or 18 carats (qui contient 75 % d'or pur), on applique ce taux au prix du gramme d'or pur, puis on multiplie par le poids total du bijou.</p>

<h2>Le troisième facteur : la main-d'œuvre et le travail artisanal</h2>
<h3>Pourquoi la main-d'œuvre est-elle facturée ?</h3>
<p>Une part importante du prix d'un bijou en or correspond à la main-d'œuvre. Cette main-d'œuvre recouvre plusieurs étapes essentielles :</p>
<ul>
<li>La conception et le design du bijou</li>
<li>La fabrication et l'assemblage</li>
<li>Les finitions (polissage, gravure, ajourage, etc.)</li>
<li>Le sertissage éventuel des pierres</li>
</ul>

<h3>Bijou artisanal vs bijou industriel</h3>
<p><strong>Le bijou artisanal</strong>, fabriqué à la main par un maître-artisan, demande un travail minutieux et un temps de réalisation important. La main-d'œuvre est donc plus élevée.</p>
<p><strong>Le bijou industriel</strong> est produit en série grâce à des machines et des moules. Le temps de fabrication est réduit, ce qui permet un prix plus accessible.</p>

<h3>Un savoir-faire qui varie selon les régions marocaines</h3>
<ul>
<li><strong>Fès et Meknès</strong> : travail très fin et détaillé, comme la filigrane</li>
<li><strong>Marrakech et le Sud</strong> : inspirations amazighes avec des formes imposantes</li>
<li><strong>Le Nord (Tanger, Tétouan)</strong> : influence andalouse, bijoux élégants et raffinés</li>
<li><strong>Casablanca et Rabat</strong> : bijoux modernes et minimalistes</li>
</ul>

<h2>Les autres éléments qui influencent le prix</h2>
<h3>La marge du bijoutier</h3>
<p>Cette marge sert à couvrir l'ensemble des charges liées à l'activité : loyer, personnel, sécurité, assurance, matériel, et les risques liés aux variations du cours de l'or.</p>

<h3>Les taxes et réglementations locales</h3>
<p>Au Maroc, le secteur de la bijouterie est encadré par une réglementation spécifique. L'important pour le consommateur est d'acheter auprès de professionnels déclarés et reconnus.</p>

<h3>Les pierres et ornements éventuels</h3>
<p>Lorsqu'un bijou en or contient des pierres précieuses (diamant, saphir, rubis, émeraude), semi-précieuses ou des perles, leur valeur vient s'ajouter à celle de l'or.</p>

<h2>Comment reconnaître un prix juste ?</h2>
<h3>Les bonnes pratiques pour l'acheteur</h3>
<ul>
<li>Demander le poids du bijou</li>
<li>Demander le carat (18 carats au Maroc pour la vente réglementée)</li>
<li>Vérifier le poinçon officiel</li>
<li>Demander la facture détaillée</li>
</ul>

<h3>Nos conseils pour éviter les mauvaises surprises</h3>
<ul>
<li>Comparer plusieurs bijoutiers</li>
<li>Se renseigner sur le cours du jour</li>
<li>Privilégier les professionnels reconnus</li>
<li>Poser des questions au bijoutier</li>
</ul>

<h2>L'or : bien plus qu'un simple métal</h2>
<p>Un bijou en or ne se réduit jamais à un chiffre ou à une équation. Au-delà de son prix, il incarne une dimension esthétique, culturelle et émotionnelle. Au Maroc, l'or accompagne les moments importants : mariage, transmission familiale, célébrations…</p>
<p>Investir dans un bijou en or, c'est réunir trois dimensions : la beauté d'un objet décoratif, la richesse d'un savoir-faire artisanal et la solidité d'un métal précieux reconnu dans le monde entier.</p>""",
            "content_ar": """<p>يأسر الذهب بجماله وقيمته على حد سواء. ومع ذلك، يتساءل الكثيرون كيف يُحسب فعلياً سعر مجوهرات الذهب. لماذا قد تكلف خاتمان بتصميم مماثل مبالغ مختلفة؟ هذا السؤال يتكرر كثيراً بين المشترين وعشاق المجوهرات.</p>

<h2>الأساسيات: فهم الذهب وقراريطه</h2>
<h3>ما هو القيراط؟</h3>
<p>القيراط هو وحدة قياس نقاء الذهب المستخدم في المجوهرات. الذهب الخالص يعادل 24 قيراطاً. ولأنه طري وهش جداً، يُخلط مع معادن أخرى (الفضة، النحاس، البلاديوم، إلخ) للحصول على سبيكة أقوى وأنسب لصناعة المجوهرات.</p>
<p>للإشارة:</p>
<ul>
<li><strong>24 قيراط</strong> = ذهب خالص</li>
<li><strong>22 قيراط</strong> = 91.6% ذهب</li>
<li><strong>21 قيراط</strong> = 87.5% ذهب</li>
<li><strong>18 قيراط</strong> = 75% ذهب</li>
<li><strong>14 قيراط</strong> = 58.5% ذهب</li>
<li><strong>9 قراريط</strong> = 37.5% ذهب</li>
</ul>

<h3>ما هي القراريط الأكثر استخداماً في المغرب؟</h3>
<p>في المغرب، يعتبر الذهب 18 قيراطاً (750/1000) المرجع الرسمي والأكثر استخداماً في التجارة المنظمة. هذا ما نجده في غالبية محلات المجوهرات، لأنه يوفر توازناً جيداً بين النقاء والمتانة والقيمة.</p>

<h2>العامل الأول: سعر الذهب</h2>
<h3>كيف يُحدد سعر الذهب؟</h3>
<p>سعر الذهب لا يحدده الصاغة؛ بل يُحدد في الأسواق الدولية. هذا السعر الرسمي يتطور باستمرار ويمكن أن يتغير من يوم لآخر. يُحدد السعر أولاً بالدولار للأونصة (وحدة القياس الدولية)، ثم يُحول إلى الدرهم حسب سعر الصرف.</p>

<h2>العامل الثاني: وزن المجوهرات</h2>
<p>وزن المجوهرات عنصر أساسي في حساب سعرها. في صناعة المجوهرات، يُوزن الذهب دائماً بميزان إلكتروني دقيق جداً، بالغرام أو حتى بجزء من مئة من الغرام.</p>

<h2>العامل الثالث: اليد العاملة والعمل الحرفي</h2>
<p>جزء مهم من سعر مجوهرات الذهب يعود لليد العاملة. هذه اليد العاملة تشمل عدة مراحل أساسية: التصميم، التصنيع، التشطيبات وترصيع الأحجار المحتمل.</p>""",
            "category_slug": "or-valeur",
            "image": "https://www.18k.ma/blog/wp-content/uploads/2025/12/Blog-Hero-Comp.png",
            "reading_time": 10
        },
        {
            "title": "Comment comparer deux bagues en or au même prix ?",
            "title_ar": "كيف تقارن بين خاتمين ذهبيين بنفس السعر؟",
            "slug": "comment-comparer-deux-bagues-en-or-au-meme-prix",
            "excerpt": "Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur. Découvrez les facteurs clés pour faire un choix éclairé.",
            "excerpt_ar": "قد يُعرض خاتمان من الذهب 18 قيراط بنفس السعر، لكن هذا لا يعني أن لهما نفس القيمة. اكتشف العوامل الرئيسية لاتخاذ قرار مستنير.",
            "content": """<p>Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur. En bijouterie, plusieurs facteurs entrent en jeu : le poids du métal, le type de fabrication, la complexité du design, ou encore la présence de pierres. Savoir analyser ces éléments permet d'éviter un achat impulsif et de mieux comprendre ce que l'on paie réellement.</p>

<h2>Poids et structure de la bague</h2>
<p>Le poids d'une bague en or est l'un des éléments les plus concrets pour évaluer sa valeur. Même si deux modèles sont vendus au même prix, leur masse réelle d'or peut varier, ce qui influence directement leur valeur intrinsèque.</p>

<h3>Pourquoi le poids compte ?</h3>
<p>L'or est un métal précieux vendu au gramme. Plus une bague est lourde, plus elle contient d'or pur, donc plus sa valeur « matière » est élevée. Par exemple, une bague de 5 grammes contient logiquement plus d'or qu'une bague de 3,5 grammes, même si elles sont toutes deux en 18k. Ainsi, deux bagues au même prix peuvent ne pas offrir la même quantité d'or.</p>

<h3>Structure</h3>
<p>Le design d'une bague peut influencer la quantité d'or utilisée, sans que cela soit toujours évident à l'œil nu. Voici les trois structures principales :</p>
<ul>
<li><strong>Plein</strong> : la bague est massive et dense. C'est souvent le choix le plus durable, avec une bonne valeur en or.</li>
<li><strong>Creux</strong> : certaines bagues sont façonnées pour paraître épaisses tout en étant creuses à l'intérieur, afin de réduire le poids (et donc le coût de fabrication).</li>
<li><strong>Ajouré</strong> : les modèles avec des motifs découpés ou ouverts sont visuellement intéressants, mais contiennent souvent moins de matière.</li>
</ul>
<p>Il ne s'agit pas de dire qu'une structure est meilleure qu'une autre, mais de comprendre ce que l'on achète vraiment. Une bague ajourée peut valoir le même prix qu'un modèle plein si son travail de fabrication est plus complexe, mais elle contiendra moins d'or.</p>

<h2>Design et finition</h2>
<p>Lorsqu'on compare deux bagues en or 18 carats proposées au même prix, il est essentiel d'évaluer leur design et leur niveau de finition. Ces éléments ont un impact significatif sur le coût de fabrication, la valeur perçue du bijou, mais aussi sur sa durabilité.</p>

<h3>Design simple ou travail artisanal complexe</h3>
<p>Le design d'une bague influence directement le temps et le savoir-faire nécessaires à sa fabrication. Un modèle au style minimaliste, fabriqué en série, demandera moins de main-d'œuvre qu'un modèle orné de détails complexes, souvent réalisé à la main ou avec des techniques de bijouterie plus avancées.</p>
<p>Un bijou au design sophistiqué peut donc coûter aussi cher qu'un modèle plus lourd, si son travail est particulièrement minutieux. Gravures fines, formes sculptées, textures originales : tous ces éléments ajoutent de la valeur au produit final.</p>

<h3>Qualité de la finition</h3>
<p>La finition désigne l'ensemble des étapes de polissage, de lissage, d'assemblage et d'ajustement qui donnent à la bague son aspect final. Une finition soignée se reconnaît à une surface parfaitement polie, à l'absence de défauts visibles, à des soudures discrètes, et à une symétrie bien maîtrisée.</p>
<p>À l'inverse, une finition approximative peut entraîner une usure prématurée, des inconforts au port ou encore des risques de déformation.</p>

<h2>Pierres et matériaux ajoutés</h2>
<h3>La présence de pierres précieuses ou ornementales</h3>
<p>L'ajout de pierres peut augmenter le prix final d'une bague sans pour autant augmenter la quantité d'or qu'elle contient. Par exemple, une bague sertie d'un diamant, d'un saphir ou d'une autre pierre précieuse peut coûter le même prix – ou plus cher – qu'une bague plus lourde composée uniquement d'or.</p>
<p>Il est également courant de rencontrer des pierres ornementales, comme les oxydes de zirconium (zircons), dont l'aspect imite les pierres précieuses sans en avoir la même valeur.</p>

<h3>L'or utilisé : attention aux comparaisons hors norme</h3>
<p>Il est important de rappeler qu'au Maroc, seule la vente de bijoux en or 18 carats (750 millièmes) est autorisée par la loi. Les bijoutiers certifiés respectent cette exigence, et toutes les bagues légalement commercialisées doivent porter un poinçon de garantie.</p>

<h2>Valeur de revente et transmission</h2>
<h3>Documents et traçabilité</h3>
<p>La traçabilité joue un rôle déterminant dans la valeur future d'un bijou. Une bague achetée avec une facture détaillée, un certificat d'authenticité, et portant un poinçon officiel, aura bien plus de poids en cas de revente ou de transmission.</p>

<h3>Style, durabilité et intemporalité</h3>
<p>Une bague conçue pour durer se reconnaît à certains critères : une fabrication soignée, une structure solide, et un style intemporel. Les modèles très fins ou fortement inspirés de tendances passagères peuvent sembler séduisants à court terme, mais se démodent ou s'endommagent plus facilement.</p>

<h2>Comment trancher entre deux modèles équivalents ?</h2>
<h3>Hiérarchiser les critères</h3>
<p>Deux bagues au même prix peuvent être également cohérentes, sans qu'une soit objectivement supérieure à l'autre. L'erreur fréquente consiste à chercher une réponse unique, alors que la décision dépend souvent de la priorité accordée à chaque critère : matière, esthétique, usage, ou symbolique.</p>

<h3>Comparer à usage égal</h3>
<p>Une comparaison pertinente suppose que les deux bagues soient évaluées pour un usage similaire. Une bague destinée à être portée quotidiennement n'est pas jugée selon les mêmes exigences qu'un bijou occasionnel ou cérémoniel.</p>

<h3>Penser le bijou comme une décision, pas une impulsion</h3>
<p>Comparer deux bagues en or au même prix, c'est accepter de regarder au-delà de l'éclat et du chiffre. C'est interroger la logique de fabrication, la cohérence de l'objet, la sincérité du geste. Faire un choix éclairé, c'est aussi prendre le temps de comprendre ce que l'on valorise. Le prix, lui, ne fait qu'ouvrir la conversation.</p>""",
            "content_ar": """<p>قد يُعرض خاتمان من الذهب 18 قيراط بنفس السعر، لكن هذا لا يعني أن لهما نفس القيمة. في صناعة المجوهرات، تدخل عدة عوامل: وزن المعدن، نوع الصناعة، تعقيد التصميم، أو وجود الأحجار.</p>

<h2>وزن وهيكل الخاتم</h2>
<p>وزن خاتم الذهب هو أحد العناصر الأكثر واقعية لتقييم قيمته. حتى لو بيع نموذجان بنفس السعر، قد تختلف كتلتهما الفعلية من الذهب.</p>

<h3>لماذا يهم الوزن؟</h3>
<p>الذهب معدن ثمين يُباع بالغرام. كلما كان الخاتم أثقل، زاد محتواه من الذهب الخالص، وبالتالي ارتفعت قيمته "المادية".</p>

<h2>التصميم والتشطيب</h2>
<p>يؤثر تصميم الخاتم مباشرة على الوقت والمهارة اللازمين لصنعه. النموذج البسيط المصنع على نطاق واسع يتطلب يد عاملة أقل من النموذج المزخرف بتفاصيل معقدة.</p>

<h2>الأحجار والمواد المضافة</h2>
<p>إضافة الأحجار يمكن أن ترفع السعر النهائي للخاتم دون زيادة كمية الذهب التي يحتويها.</p>""",
            "category_slug": "or-valeur",
            "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/3-1.png",
            "reading_time": 8
        },
        {
            "title": "Comment reconnaître un bijou en or authentique ?",
            "title_ar": "كيف تتعرف على مجوهرات الذهب الأصلية؟",
            "slug": "comment-reconnaitre-un-bijou-en-or-authentique",
            "excerpt": "Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons. Découvrez les méthodes pour distinguer l'or authentique d'une imitation.",
            "excerpt_ar": "التعرف على مجوهرات الذهب الحقيقية أمر ضروري لتجنب التزوير. اكتشف الطرق للتمييز بين الذهب الأصلي والتقليد.",
            "content": """<p>Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons, surtout face à la montée des imitations trompeuses sur le marché. Que ce soit pour un achat, une revente ou simplement par curiosité, savoir distinguer l'or authentique d'une copie peut vous faire économiser de l'argent… et des déceptions.</p>

<h2>Les caractéristiques de l'or authentique</h2>
<h3>La pureté de l'or : carats et alliages</h3>
<p>L'unité de mesure la plus utilisée pour évaluer la pureté de l'or est le carat (K). L'or pur, c'est-à-dire sans aucun autre métal ajouté, est désigné comme 24 carats, soit 99,9 % d'or.</p>
<p>Pour renforcer sa solidité, l'or est souvent allié à d'autres métaux comme l'argent, le cuivre, le zinc ou encore le nickel. Ces alliages donnent naissance à des or de différents carats :</p>
<ul>
<li><strong>18 carats (750/1000)</strong> : 75 % d'or pur, le plus courant en joaillerie haut de gamme au Maroc</li>
<li><strong>14 carats (585/1000)</strong> : 58,5 % d'or, plus répandu dans certains pays comme les États-Unis</li>
<li><strong>9 carats (375/1000)</strong> : 37,5 % d'or, plus abordable, mais moins précieux</li>
</ul>

<h3>Les couleurs de l'or</h3>
<p>Contrairement à ce que l'on pourrait penser, l'or ne se limite pas à sa couleur jaune caractéristique :</p>
<ul>
<li><strong>Or jaune</strong> : mélange traditionnel d'or pur, d'argent et de cuivre</li>
<li><strong>Or blanc</strong> : obtenu en mélangeant de l'or avec du palladium ou du nickel, puis recouvert de rhodium</li>
<li><strong>Or rose</strong> : ton chaleureux obtenu en ajoutant plus de cuivre dans l'alliage</li>
</ul>

<h3>L'impact de la couleur sur l'authenticité</h3>
<p>La couleur, à elle seule, ne suffit pas pour dire si un bijou est vraiment en or. Si le bijou change de teinte avec le temps, s'il noircit ou s'il perd de son éclat, c'est souvent un signe qu'il ne s'agit pas d'or massif.</p>

<h2>Les méthodes pour reconnaître un bijou en or véritable</h2>
<h3>Rechercher les poinçons officiels</h3>
<p>L'un des premiers réflexes pour vérifier l'authenticité d'un bijou en or, c'est de regarder s'il porte un poinçon. Ce petit symbole gravé dans le métal indique le titre de l'or et garantit que le bijou a été contrôlé.</p>
<p>Au Maroc, le poinçon le plus courant est <strong>la tête d'aigle</strong>, symbole utilisé pour certifier que le bijou est bien en or 18K.</p>
<p>On peut aussi croiser d'autres poinçons :</p>
<ul>
<li><strong>La coquille Saint-Jacques</strong> pour l'or 14 carats (585/1000)</li>
<li><strong>Le trèfle</strong> pour l'or 9 carats (375/1000)</li>
</ul>
<p>Ces poinçons sont discrets, généralement gravés à l'intérieur des anneaux, sur les fermoirs ou à l'arrière des pendentifs.</p>

<h3>Utiliser un aimant</h3>
<p>L'or est un métal non magnétique. Cela signifie qu'un bijou en or véritable ne réagit pas à l'aimant. Ce test est donc rapide et facile à réaliser chez soi.</p>
<p><strong>Attention</strong> : ce test a ses limites. Certains bijoux fantaisie sont faits d'alliages non magnétiques. À l'inverse, un bijou en or avec un fermoir à ressort (souvent en acier) peut montrer une légère attraction.</p>

<h3>Le test de la céramique ou de la pierre de touche</h3>
<p>Frottez légèrement le bijou sur une surface en céramique brute (par exemple, le dessous d'un carreau de carrelage non vernissé) :</p>
<ul>
<li>Si la trace laissée est <strong>dorée</strong>, le bijou est probablement en or</li>
<li>Si elle est <strong>noire ou grise</strong>, il s'agit sans doute d'un métal plaqué ou d'un alliage</li>
</ul>

<h3>Le test de l'acide</h3>
<p>C'est l'une des méthodes les plus utilisées en bijouterie professionnelle. Le test à l'acide consiste à frotter le bijou sur une pierre de touche, puis à appliquer des gouttes d'acides spécialement formulés pour réagir avec différents titrages d'or.</p>
<p>Ce test est précis et efficace, mais il doit être manipulé avec soin et est fortement conseillé de le confier à un professionnel.</p>

<h2>Faire appel à un professionnel</h2>
<h3>L'avis du bijoutier ou de l'orfèvre</h3>
<p>Dans nos villes marocaines, les bijoutiers de quartier ont souvent des années d'expérience dans le travail et la reconnaissance de l'or. Un bon bijoutier saura :</p>
<ul>
<li>Vérifier la présence et la lisibilité du poinçon</li>
<li>Tester la densité du bijou par simple pesée</li>
<li>Analyser la couleur et la réaction du métal au contact</li>
<li>Effectuer un test à l'acide sans endommager la pièce</li>
</ul>

<h3>Quand faire appel à un expert indépendant ?</h3>
<p>Si vous souhaitez revendre un bijou, faire une estimation pour un héritage, ou si vous avez des doutes sérieux sur l'authenticité d'un achat, il est recommandé de consulter un expert agréé.</p>

<h3>Acheter ou faire expertiser dans des lieux de confiance</h3>
<p>Privilégiez toujours :</p>
<ul>
<li>Les bijouteries connues ou recommandées</li>
<li>Les professionnels disposant d'un registre de commerce et d'une traçabilité claire</li>
<li>Les enseignes qui remettent un reçu ou un certificat à l'achat</li>
</ul>

<h2>Miser sur la confiance et la transparence</h2>
<p>Lorsque l'on souhaite acquérir un bijou en or, la prudence reste votre meilleur allié. Au Maroc, mieux vaut privilégier les bijouteries reconnues, disposant d'un registre légal et capables de vous fournir une facture claire ou un certificat d'authenticité.</p>
<p>Que ce soit pour un cadeau, un investissement ou un plaisir personnel, choisir un bijou en or doit toujours s'accompagner d'un minimum d'informations… et d'un maximum de confiance.</p>""",
            "content_ar": """<p>التعرف على مجوهرات الذهب الحقيقية أمر ضروري لتجنب التزوير، خاصة مع تزايد التقليدات المخادعة في السوق.</p>

<h2>خصائص الذهب الأصلي</h2>
<h3>نقاء الذهب: القراريط والسبائك</h3>
<p>وحدة القياس الأكثر استخداماً لتقييم نقاء الذهب هي القيراط (K). الذهب الخالص، أي بدون أي معدن مضاف، يُعين بـ 24 قيراطاً، أي 99.9% ذهب.</p>

<h2>طرق التعرف على مجوهرات الذهب الحقيقية</h2>
<h3>البحث عن الأختام الرسمية</h3>
<p>أول رد فعل للتحقق من أصالة مجوهرات الذهب هو النظر إذا كانت تحمل ختماً. في المغرب، الختم الأكثر شيوعاً هو رأس النسر، الرمز المستخدم للتصديق على أن المجوهرات من ذهب 18K.</p>

<h3>استخدام المغناطيس</h3>
<p>الذهب معدن غير مغناطيسي. هذا يعني أن مجوهرات الذهب الحقيقية لا تتفاعل مع المغناطيس.</p>

<h2>الاستعانة بمحترف</h2>
<p>في مدننا المغربية، غالباً ما يمتلك صاغة الأحياء سنوات من الخبرة في العمل والتعرف على الذهب.</p>""",
            "category_slug": "or-valeur",
            "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/1-1.png",
            "reading_time": 8
        },
        {
            "title": "Pourquoi le 18k est le standard légal de l'or marocain ?",
            "title_ar": "لماذا يعتبر 18 قيراط المعيار القانوني للذهب المغربي؟",
            "slug": "pourquoi-le-18k-est-le-standard-legal-de-lor-marocain",
            "excerpt": "Au Maroc, l'or 18 carats est le standard légal pour la bijouterie. Découvrez les raisons historiques, culturelles et pratiques de ce choix.",
            "excerpt_ar": "في المغرب، يعتبر الذهب 18 قيراط المعيار القانوني لصناعة المجوهرات. اكتشف الأسباب التاريخية والثقافية والعملية لهذا الاختيار.",
            "content": """<p>Au Maroc, l'or occupe une place centrale dans la culture, l'économie et les traditions sociales. Présent dans les mariages, les cérémonies familiales et l'épargne domestique, il est à la fois symbole de richesse et de sécurité. Contrairement à d'autres pays où l'or 22 ou 24 carats domine, le Maroc a fait du 18 carats le standard légal pour la bijouterie.</p>

<h2>Comprendre les carats de l'or</h2>
<h3>Le carat : quésaco ?</h3>
<p>Le carat est une unité de mesure qui indique la pureté de l'or contenu dans un alliage. L'or pur correspond à 24 carats, soit 100 % d'or. Plus le nombre de carats est élevé, plus la proportion d'or fin est importante.</p>
<p>La différence entre les principaux titres d'or est significative :</p>
<ul>
<li><strong>24 carats</strong> : presque entièrement pur</li>
<li><strong>22 carats</strong> : environ 91,6 % d'or</li>
<li><strong>18 carats</strong> : 75 % d'or</li>
<li><strong>14 carats</strong> : environ 58,5 % d'or</li>
</ul>

<h3>Composition de l'or 18 carats</h3>
<p>L'or 18 carats est composé de 75 % d'or pur, les 25 % restants étant constitués de métaux d'alliage. Cette proportion permet de conserver l'éclat et la valeur de l'or tout en le rendant suffisamment solide pour la fabrication de bijoux destinés à un usage quotidien.</p>
<p>Les métaux d'alliage les plus couramment utilisés sont le cuivre (qui apporte robustesse et teintes plus chaudes) et l'argent (qui adoucit la couleur et améliore la malléabilité).</p>

<h2>Le cadre légal de l'or au Maroc</h2>
<h3>La réglementation marocaine sur les métaux précieux</h3>
<p>Au Maroc, la commercialisation et la fabrication des métaux précieux sont strictement encadrées par l'État afin de garantir la protection des consommateurs et la transparence du marché.</p>
<p>Un élément central de ce dispositif est le <strong>poinçon officiel marocain</strong>. Apposé par les services compétents, il atteste de la conformité du bijou au titre légal déclaré, notamment le 18 carats.</p>

<h3>Pourquoi le 18 carats a été choisi comme norme légale ?</h3>
<p>Le choix du 18 carats comme standard légal repose sur plusieurs facteurs :</p>
<ul>
<li><strong>Équilibre entre pureté et solidité</strong> : avec 75 % d'or pur, ce titre offre une valeur intrinsèque élevée tout en permettant l'ajout de métaux d'alliage qui renforcent la résistance du bijou</li>
<li><strong>Adapté à l'usage quotidien</strong> : il résiste mieux aux chocs, à l'usure et aux déformations que les titres plus élevés</li>
<li><strong>Facilité de contrôle administratif</strong> : en tant que standard unique, il facilite le calcul des taxes et les contrôles de conformité</li>
</ul>

<h2>Raisons historiques et culturelles</h2>
<h3>Les traditions de bijouterie marocaines</h3>
<p>Au Maroc, l'or occupe une place essentielle dans les mariages et les grandes cérémonies familiales. Les bijoux en or symbolisent à la fois la prospérité, la sécurité financière et le statut social.</p>
<p>Le choix du 18 carats répond également à une préférence esthétique profondément ancrée dans la culture marocaine. Le goût traditionnel tend vers un <strong>or jaune chaud</strong>, dont la teinte s'accorde naturellement avec les vêtements traditionnels.</p>
<p>Au-delà de leur fonction ornementale, ces bijoux sont souvent destinés à une <strong>transmission familiale</strong>. De génération en génération, ils sont conservés comme un patrimoine.</p>

<h3>Héritage artisanal et savoir-faire local</h3>
<p>La bijouterie marocaine repose sur un riche héritage artisanal, transmis au sein des corporations et des ateliers traditionnels. Les techniques de façonnage, de gravure et de décoration exigent un métal capable de supporter des manipulations répétées et des soudures complexes.</p>
<p>L'or 18 carats répond parfaitement à ce besoin, permettant aux artisans de créer des pièces détaillées et durables.</p>

<h2>Comparaison avec d'autres pays</h2>
<h3>Or 22 et 24 carats dans d'autres marchés</h3>
<p>Dans plusieurs régions du monde, notamment en Inde et dans certains pays du Moyen-Orient, l'or 22 carats, voire 24 carats, est largement privilégié. Ces titres élevés sont associés à une forte valeur symbolique et à une fonction d'épargne plutôt que d'usage quotidien.</p>

<h3>Spécificité du modèle marocain</h3>
<p>Le modèle marocain se distingue par un positionnement intermédiaire entre tradition et praticité. L'or 18 carats répond aux besoins d'une population qui porte ses bijoux au quotidien, sans renoncer à leur valeur intrinsèque.</p>

<h2>Que faire si l'on possède de l'or 22 ou 24 carats ?</h2>
<h3>Détention personnelle</h3>
<p>Au Maroc, un particulier peut posséder et porter de l'or 22 ou 24 carats sans enfreindre la loi. Les bijoux personnels peuvent être introduits sur le territoire, conservés à domicile ou transmis comme patrimoine familial, à condition qu'ils ne soient pas destinés à un usage commercial.</p>

<h3>Vente, recyclage et cadre légal</h3>
<p>La réglementation marocaine impose le 18 carats comme standard légal pour la fabrication, le poinçonnage et la vente des bijoux. Les pièces en or d'un titre supérieur ne sont généralement pas commercialisées telles quelles sur le marché local. Elles sont souvent fondues ou recyclées pour être transformées en or 18 carats conforme aux normes.</p>

<h2>L'or 18k, entre valeur économique et choix de société</h2>
<p>Au Maroc, le 18 carats s'est imposé au fil du temps comme un choix à la fois économique et culturel. Dans un environnement marqué par l'instabilité de certaines valeurs, l'or conserve un statut particulier comme actif tangible, universel et transmissible.</p>
<p>Le standard 18 carats permet de concilier le rôle de refuge économique avec les exigences de l'usage quotidien. Il garantit la pérennité du métal tout en offrant la solidité nécessaire à des bijoux portés et transmis sur plusieurs générations.</p>
<p>C'est cette cohérence qui explique la stabilité du 18 carats face aux évolutions du marché et aux nouvelles formes d'investissement.</p>""",
            "content_ar": """<p>في المغرب، يحتل الذهب مكانة مركزية في الثقافة والاقتصاد والتقاليد الاجتماعية. موجود في الأعراس والمناسبات العائلية والادخار المنزلي، فهو رمز للثروة والأمان في آن واحد. على عكس دول أخرى حيث يسود الذهب 22 أو 24 قيراطاً، اختار المغرب 18 قيراطاً كمعيار قانوني لصناعة المجوهرات.</p>

<h2>فهم قراريط الذهب</h2>
<h3>ما هو القيراط؟</h3>
<p>القيراط هو وحدة قياس تشير إلى نقاء الذهب الموجود في السبيكة. الذهب الخالص يعادل 24 قيراطاً، أي 100% ذهب. كلما ارتفع عدد القراريط، زادت نسبة الذهب الخالص.</p>
<p>الفرق بين درجات الذهب الرئيسية ملحوظ:</p>
<ul>
<li><strong>24 قيراط</strong>: نقي تقريباً بالكامل</li>
<li><strong>22 قيراط</strong>: حوالي 91.6% ذهب</li>
<li><strong>18 قيراط</strong>: 75% ذهب</li>
<li><strong>14 قيراط</strong>: حوالي 58.5% ذهب</li>
</ul>

<h3>تركيبة الذهب 18 قيراط</h3>
<p>يتكون الذهب 18 قيراطاً من 75% ذهب خالص، بينما تتكون النسبة المتبقية 25% من معادن السبائك. هذه النسبة تحافظ على بريق وقيمة الذهب مع جعله صلباً بما يكفي لصناعة مجوهرات مخصصة للاستخدام اليومي.</p>

<h2>الإطار القانوني للذهب في المغرب</h2>
<h3>التنظيم المغربي للمعادن الثمينة</h3>
<p>في المغرب، تسويق وصناعة المعادن الثمينة مؤطران بشكل صارم من قبل الدولة لضمان حماية المستهلكين وشفافية السوق.</p>
<p>عنصر أساسي في هذا النظام هو <strong>الختم الرسمي المغربي</strong>. يُثبت من قبل الجهات المختصة، ويشهد على مطابقة المجوهرات للدرجة القانونية المعلنة، خاصة 18 قيراطاً.</p>

<h3>لماذا اختير 18 قيراط كمعيار قانوني؟</h3>
<p>اختيار 18 قيراط كمعيار قانوني يعتمد على عدة عوامل:</p>
<ul>
<li><strong>التوازن بين النقاء والمتانة</strong>: بنسبة 75% من الذهب الخالص، تقدم هذه الدرجة قيمة جوهرية عالية مع السماح بإضافة معادن سبائك تعزز مقاومة المجوهرات</li>
<li><strong>الملاءمة للاستخدام اليومي</strong>: يقاوم الصدمات والتآكل والتشوه بشكل أفضل من الدرجات الأعلى</li>
<li><strong>سهولة الرقابة الإدارية</strong>: كمعيار موحد، يسهل حساب الضرائب وعمليات التفتيش على المطابقة</li>
</ul>

<h2>أسباب تاريخية وثقافية</h2>
<h3>تقاليد صناعة المجوهرات المغربية</h3>
<p>في المغرب، يحتل الذهب مكانة أساسية في الأعراس والمناسبات العائلية الكبرى. مجوهرات الذهب ترمز في آن واحد إلى الازدهار والأمان المالي والمكانة الاجتماعية.</p>
<p>اختيار 18 قيراط يستجيب أيضاً لتفضيل جمالي متجذر بعمق في الثقافة المغربية. الذوق التقليدي يميل نحو <strong>الذهب الأصفر الدافئ</strong>، الذي يتناسق طبيعياً مع الملابس التقليدية.</p>

<h3>التراث الحرفي والمهارة المحلية</h3>
<p>تعتمد صناعة المجوهرات المغربية على تراث حرفي غني، ينتقل داخل النقابات والورشات التقليدية. تقنيات التشكيل والنقش والزخرفة تتطلب معدناً قادراً على تحمل التعامل المتكرر واللحام المعقد.</p>
<p>الذهب 18 قيراط يستجيب تماماً لهذه الحاجة، مما يسمح للحرفيين بإنشاء قطع مفصلة ودائمة.</p>

<h2>الذهب 18 قيراط، بين القيمة الاقتصادية واختيار المجتمع</h2>
<p>في المغرب، فرض 18 قيراط نفسه بمرور الوقت كخيار اقتصادي وثقافي في آن واحد. في بيئة تتميز بعدم استقرار بعض القيم، يحتفظ الذهب بمكانة خاصة كأصل ملموس وعالمي وقابل للنقل.</p>
<p>معيار 18 قيراط يتيح التوفيق بين دور الملاذ الاقتصادي ومتطلبات الاستخدام اليومي. يضمن استدامة المعدن مع توفير المتانة اللازمة لمجوهرات تُلبس وتُنقل عبر أجيال متعددة.</p>""",
            "category_slug": "or-valeur",
            "image": "https://storage.googleapis.com/gold-prices-db-luxoria-gold-18k/images/18k-standard-legal.png",
            "reading_time": 9
        },
    ]

    for idx, article_data in enumerate(articles_data):
        category_slug = article_data.pop("category_slug")
        category = categories.get(category_slug)
        article = Article(
            **article_data,
            category_id=category.id if category else None,
            status="published",
            published_at=datetime.utcnow() - timedelta(days=len(articles_data) - idx)
        )
        db.add(article)

    db.commit()
    print(f"✓ Seeded {len(categories_data)} categories and {len(articles_data)} articles")


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

    # Seed data if empty
    seed_prices_data(db)
    seed_blog_data(db)

    # Check database status
    price_count = db.query(Price).count()
    article_count = db.query(Article).count()
    print(f"✓ Database has {price_count} price entries and {article_count} articles")

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
    """Get all categories ordered by position"""
    return db.query(Category).order_by(Category.position, Category.name).all()


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

    # Generate Arabic slug if title_ar provided
    slug_ar = None
    if article_data.title_ar:
        slug_ar = slugify(article_data.title_ar)
        base_slug_ar = slug_ar
        counter_ar = 1
        while db.query(Article).filter(Article.slug_ar == slug_ar).first():
            slug_ar = f"{base_slug_ar}-{counter_ar}"
            counter_ar += 1

    article = Article(
        # French content
        title=article_data.title,
        slug=slug,
        excerpt=article_data.excerpt,
        content=article_data.content,
        meta_title=article_data.meta_title,
        meta_description=article_data.meta_description,
        # Arabic content
        title_ar=article_data.title_ar,
        slug_ar=slug_ar,
        excerpt_ar=article_data.excerpt_ar,
        content_ar=article_data.content_ar,
        meta_title_ar=article_data.meta_title_ar,
        meta_description_ar=article_data.meta_description_ar,
        # Common fields
        image=article_data.image,
        category_id=article_data.category_id,
        status=article_data.status,
        reading_time=article_data.reading_time,
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

    # Regenerate slug_ar if title_ar changed
    if "title_ar" in update_data and update_data["title_ar"]:
        new_slug_ar = slugify(update_data["title_ar"])
        if new_slug_ar != article.slug_ar:
            base_slug_ar = new_slug_ar
            counter_ar = 1
            while db.query(Article).filter(Article.slug_ar == new_slug_ar, Article.id != article_id).first():
                new_slug_ar = f"{base_slug_ar}-{counter_ar}"
                counter_ar += 1
            update_data["slug_ar"] = new_slug_ar

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
        name_ar=category_data.name_ar,
        slug=slug,
        color=category_data.color,
        position=category_data.position
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
    category.name_ar = category_data.name_ar
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

