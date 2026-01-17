"""
Script to seed the blog with articles from 18k.ma
Run this script from the backend directory: python seed_blog.py
"""

from database import SessionLocal, engine
from models import Base, Category, Article
from datetime import datetime
import re

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def seed_blog():
    db = SessionLocal()

    try:
        # Create categories
        categories_data = [
            {"name": "Bijoux", "slug": "bijoux", "color": "#D4AF37"},
            {"name": "Or", "slug": "or", "color": "#C9A961"},
            {"name": "Guide", "slug": "guide", "color": "#002FA7"},
        ]

        categories = {}
        for cat_data in categories_data:
            existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
            if existing:
                categories[cat_data["name"]] = existing
                print(f"Category '{cat_data['name']}' already exists")
            else:
                cat = Category(**cat_data)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                categories[cat_data["name"]] = cat
                print(f"Created category: {cat_data['name']}")

        # Articles data
        articles_data = [
            {
                "title": "Comment est calculé le prix d'un bijou en or ?",
                "slug": "comment-est-calcule-le-prix-dun-bijou-en-or",
                "excerpt": "L'or fascine autant par sa beauté que par sa valeur. Découvrez comment est réellement calculé le prix d'un bijou en or et pourquoi deux bagues au design similaire peuvent coûter des montants différents.",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2025/12/Blog-Hero-Comp.png",
                "category": "Guide",
                "reading_time": 12,
                "published_at": datetime(2026, 1, 15),
                "content": """<p>L'or fascine autant par sa beauté que par sa valeur. Pourtant, beaucoup de personnes se demandent comment est réellement calculé le prix d'un bijou en or. Pourquoi deux bagues au design similaire peuvent-elles coûter des montants différents ? Cette question revient souvent, aussi bien chez les acheteurs que chez les passionnés de bijoux. Au Maroc, le marché de l'or suit ses propres habitudes et particularités, ce qui peut parfois prêter à confusion.</p>

<h2>Les bases : comprendre l'or et ses carats</h2>

<h3>Qu'est-ce que le carat ?</h3>

<p>Le carat est l'unité qui permet de mesurer la pureté de l'or utilisé dans un bijou. L'or pur correspond à 24 carats. Comme il est très malléable et fragile, on le mélange à d'autres métaux (argent, cuivre, palladium, etc.) afin d'obtenir un alliage plus solide et plus adapté à la fabrication de bijoux.</p>

<p>Ainsi, plus le nombre de carats est élevé, plus la proportion d'or pur dans l'alliage est importante.</p>

<p>À titre indicatif :</p>
<ul>
<li>24 carats = or pur</li>
<li>22 carats = 91,6 % d'or</li>
<li>21 carats = 87,5 % d'or</li>
<li>18 carats = 75 % d'or</li>
<li>14 carats = 58,5 % d'or</li>
<li>9 carats = 37,5 % d'or</li>
</ul>

<p>Le choix du carat influence donc à la fois la valeur, la résistance et la couleur du bijou.</p>

<h2>Quels carats utilise-t-on le plus au Maroc ?</h2>

<p>Au Maroc, l'or 18 carats (750/1000) est la référence officielle et la plus utilisée dans le commerce réglementé. C'est ce que l'on retrouve dans la grande majorité des bijouteries, car il offre un bon équilibre entre pureté, solidité et valeur.</p>

<p>Il peut exister, dans certains cas, des bijoux en 21 ou 22 carats, mais ceux-ci circulent plutôt dans des réseaux privés ou informels, et ne correspondent pas au standard habituel du marché marocain organisé.</p>

<p>Pour le consommateur, il est donc important de vérifier le poinçon indiquant le carat du bijou afin de s'assurer de sa conformité et de sa valeur réelle.</p>

<h2>Le premier facteur : le cours de l'or</h2>

<h3>Comment est fixé le prix de l'or ?</h3>

<p>Le prix de l'or n'est pas décidé par les bijoutiers; il est déterminé sur les marchés internationaux. Ce cours officiel évolue en continu et peut varier d'un jour à l'autre. Le prix est fixé d'abord en dollars par once (unité de mesure internationale), puis converti en dirhams selon le taux de change du moment.</p>

<p>Une fois cette valeur obtenue, elle est ramenée au gramme d'or pur (24 carats). C'est sur cette base que l'on calcule ensuite le prix de l'or 18 carats, qui correspond à 75 % d'or pur. Ainsi, toute variation du cours mondial se répercute automatiquement sur le prix du bijou.</p>

<h3>Pourquoi le prix change-t-il ?</h3>

<p>Le cours de l'or est influencé par plusieurs facteurs économiques. L'un des principaux est la loi de l'offre et de la demande : lorsque la demande mondiale augmente, le prix a tendance à monter.</p>

<p>Les marchés financiers jouent également un rôle important. Dans les périodes d'incertitude économique, l'or est souvent considéré comme une valeur refuge, ce qui peut entraîner une hausse des prix.</p>

<p>D'autres éléments entrent aussi en jeu, comme l'inflation, les décisions des banques centrales, la situation géopolitique ou encore l'évolution du dollar. Tous ces facteurs expliquent pourquoi le prix de l'or n'est jamais totalement stable.</p>

<h2>Le deuxième facteur : le poids du bijou</h2>

<h3>Comment le bijoutier pèse-t-il l'or ?</h3>

<p>Le poids du bijou est un élément essentiel dans le calcul de son prix. En bijouterie, l'or est toujours pesé avec une balance électronique très précise, au gramme près, voire au centième de gramme.</p>

<p>Lorsque le bijou contient des éléments qui ne sont pas en or (pierres, perles, décorations, etc.), le bijoutier peut, lorsque c'est possible, en déduire le poids afin de ne facturer que l'or véritable. Dans certains cas, surtout pour les bijoux sertis, une estimation est faite en tenant compte de l'expérience du professionnel.</p>

<p>Plus le bijou est lourd, plus la quantité d'or qu'il contient est importante, et plus sa valeur de base augmente.</p>

<h3>Calculer simplement</h3>

<p>Pour comprendre facilement, on peut résumer le calcul de la valeur de l'or dans un bijou ainsi :</p>

<p><strong>"Prix du gramme d'or pur × pourcentage d'or selon le carat × poids du bijou"</strong></p>

<p>Par exemple, pour un bijou en or 18 carats (qui contient 75 % d'or pur), on applique ce taux au prix du gramme d'or pur, puis on multiplie par le poids total du bijou.</p>

<p>Ce résultat donne la valeur de la matière en or. À cette valeur viendront ensuite s'ajouter la main-d'œuvre, le design, la marge du bijoutier et les éventuels frais réglementaires, ce qui permettra d'obtenir le prix final affiché en boutique.</p>

<h2>Le troisième facteur : la main-d'œuvre et le travail artisanal</h2>

<h3>Pourquoi la main-d'œuvre est-elle facturée ?</h3>

<p>Une part importante du prix d'un bijou en or correspond à la main-d'œuvre, c'est-à-dire au temps, au savoir-faire et aux techniques utilisées pour fabriquer la pièce.</p>

<p>Cette main-d'œuvre recouvre plusieurs étapes essentielles :</p>
<ul>
<li>la conception et le design du bijou</li>
<li>la fabrication et l'assemblage</li>
<li>les finitions (polissage, gravure, ajourage, etc.)</li>
<li>le sertissage éventuel des pierres</li>
</ul>

<p>Plus le bijou est complexe et travaillé, plus ces étapes sont longues et techniques. C'est pourquoi deux bijoux de même poids et de même carat peuvent afficher des prix différents.</p>

<h3>Bijou artisanal vs bijou industriel</h3>

<p>On distingue généralement deux grandes catégories de bijoux :</p>

<p><strong>Le bijou artisanal</strong>, fabriqué à la main par un maître-artisan. Chaque pièce demande un travail minutieux, parfois inspiré de traditions régionales marocaines. Ce type de bijou nécessite un temps de réalisation important et un véritable savoir-faire. La main-d'œuvre est donc plus élevée, ce qui se reflète dans le prix final.</p>

<p><strong>Le bijou industriel</strong>, quant à lui, est produit en série grâce à des machines et des moules. Le temps de fabrication est réduit et la main-d'œuvre est moins coûteuse, ce qui permet d'obtenir un prix plus accessible.</p>

<h3>Un savoir-faire qui varie selon les régions marocaines</h3>

<p>Au Maroc, plusieurs régions possèdent une identité artisanale propre, qui influence le travail de l'or et donc la valeur de la main-d'œuvre.</p>

<p>À Fès et Meknès, on retrouve un travail très fin et détaillé, comme la filigrane. Ce type d'ouvrage demande une grande précision et beaucoup de temps, ce qui augmente naturellement le coût artisanal.</p>

<p>À Marrakech et dans le Sud, certains bijoux s'inspirent de traditions amazighes, avec des formes parfois plus imposantes et des motifs marqués. Leur fabrication nécessite souvent plusieurs étapes manuelles successives.</p>

<p>Dans le Nord, à Tanger ou Tétouan, on observe une influence andalouse, avec des bijoux élégants et raffinés, où la finition et le polissage jouent un rôle central.</p>

<p>Et dans les grandes villes comme Casablanca ou Rabat, les ateliers produisent aussi des bijoux modernes et minimalistes, qui exigent une précision technique pour obtenir des lignes nettes et régulières.</p>

<p>Ainsi, le prix de la main-d'œuvre rémunère le temps passé ainsi que l'expérience, la tradition et la qualité du travail réalisé. C'est ce qui fait qu'un bijou en or n'est pas seulement une valeur matérielle, mais aussi une pièce de patrimoine artisanal.</p>

<h2>Les autres éléments qui influencent le prix</h2>

<h3>La marge du bijoutier</h3>

<p>En plus de la valeur de l'or et de la main-d'œuvre, le prix d'un bijou inclut également la marge du bijoutier. Cette marge sert à couvrir l'ensemble des charges liées à son activité, comme le loyer de la boutique, le personnel, la sécurité, l'assurance, le matériel ou encore les risques liés aux variations du cours de l'or.</p>

<p>Elle permet aussi au commerçant de garantir un service professionnel : conseil, garantie, SAV, contrôle de qualité… Sans cette marge, l'activité ne serait tout simplement pas viable. Elle fait donc naturellement partie du prix final.</p>

<h3>Les taxes et réglementations locales</h3>

<p>Au Maroc, le secteur de la bijouterie est encadré par une réglementation spécifique. Certaines taxes ou frais peuvent s'appliquer conformément à la législation en vigueur. Ils peuvent concerner, par exemple, la commercialisation, le contrôle de qualité ou la conformité des bijoux.</p>

<p>Même si ces frais ne représentent pas toujours une part majeure du prix, ils contribuent néanmoins au coût global supporté par le bijoutier, et sont donc répercutés, au moins en partie, sur le prix de vente.</p>

<p>L'important pour le consommateur est d'acheter auprès de professionnels déclarés et reconnus, afin de garantir la traçabilité et l'authenticité du bijou.</p>

<h3>Les pierres et ornements éventuels</h3>

<p>Lorsqu'un bijou en or contient des pierres précieuses, semi-précieuses ou des perles, leur valeur vient naturellement s'ajouter à celle de l'or.</p>

<p>Les pierres précieuses comprennent notamment le diamant, le saphir, le rubis ou l'émeraude. Leur prix dépend de plusieurs critères : taille, couleur, pureté, poids, rareté et qualité de taille.</p>

<p>Les pierres semi-précieuses (telles que l'améthyste, la topaze, le grenat, etc.) ont une valeur plus accessible, mais peuvent tout de même influencer sensiblement le prix du bijou selon leur qualité.</p>

<p>Les perles naturelles ou de culture entrent également en compte, en fonction de leur origine, de leur éclat et de leur régularité.</p>

<p>Le sertissage, c'est-à-dire la technique utilisée pour fixer la pierre, ajoute également un coût de main-d'œuvre supplémentaire.</p>

<h2>Comment reconnaître un prix juste ?</h2>

<h3>Les bonnes pratiques pour l'acheteur</h3>

<p>Pour un client, il n'est pas toujours facile de savoir si le prix proposé est cohérent. Quelques réflexes simples peuvent aider à y voir plus clair :</p>
<ul>
<li><strong>Demander le poids du bijou</strong> : le poids est une donnée de base. Un bijoutier sérieux accepte en général de le communiquer.</li>
<li><strong>Demander le carat</strong> : il est essentiel de savoir en quel carat est le bijou (18 carats au Maroc pour la vente réglementée).</li>
<li><strong>Vérifier le poinçon</strong> : le bijou doit porter un poinçon officiel indiquant le titre de l'or. Ce marquage est une garantie de conformité.</li>
<li><strong>Demander la facture</strong> : une facture détaillée, mentionnant au minimum la nature du bijou, le carat et le poids, est un élément de traçabilité important.</li>
</ul>

<p>Ces informations permettent de comparer plus facilement les prix entre plusieurs professionnels.</p>

<h3>Nos conseils pour éviter les mauvaises surprises</h3>

<p>Pour limiter les risques de payer un bijou trop cher, ou de mauvaise qualité, quelques précautions supplémentaires sont utiles :</p>
<ul>
<li><strong>Comparer plusieurs bijoutiers</strong> : ne pas hésiter à visiter plusieurs boutiques pour comparer les prix pour un type de bijou similaire (même carat, poids proche, style comparable).</li>
<li><strong>Se renseigner sur le cours du jour</strong> : avoir une idée du prix du gramme d'or sur le marché, même approximative, aide à comprendre les écarts de prix.</li>
<li><strong>Privilégier les professionnels reconnus</strong> : choisir des bijouteries installées, recommandées et transparentes sur leurs pratiques.</li>
<li><strong>Poser des questions</strong> : un bon bijoutier prend le temps d'expliquer son prix, le carat, le poinçon, l'origine du bijou et les conditions de garantie.</li>
</ul>

<p>En combinant ces réflexes, le consommateur peut mieux évaluer si le prix proposé correspond réellement à la valeur du bijou, à la qualité de l'or et au travail artisanal qu'il représente.</p>

<h2>L'or : bien plus qu'un simple métal</h2>

<p>Un bijou en or ne se réduit jamais à un chiffre ou à une équation. Au-delà de son prix, il incarne une dimension esthétique, culturelle et émotionnelle. Au Maroc, l'or accompagne les moments importants : mariage, transmission familiale, célébrations… Il représente à la fois un plaisir personnel, un signe de raffinement et, dans certains cas, une forme de réserve de valeur.</p>

<p>Investir dans un bijou en or, c'est donc réunir trois dimensions : la beauté d'un objet décoratif, la richesse d'un savoir-faire artisanal et la solidité d'un métal précieux reconnu dans le monde entier. Chacun y trouve sa propre signification; symbole, héritage, fierté ou sécurité. Et c'est finalement cette combinaison unique qui fait la vraie valeur d'un bijou en or.</p>"""
            },
            {
                "title": "Comment comparer deux bagues en or au même prix ?",
                "slug": "comment-comparer-deux-bagues-en-or-au-meme-prix",
                "excerpt": "Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur. Découvrez les critères essentiels pour faire un choix éclairé.",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/3-1.png",
                "category": "Bijoux",
                "reading_time": 8,
                "published_at": datetime(2026, 1, 11),
                "content": """<p>Deux bagues en or 18 carats peuvent être proposées au même prix, mais cela ne signifie pas qu'elles ont la même valeur. En bijouterie, plusieurs facteurs entrent en jeu : le poids du métal, le type de fabrication, la complexité du design, ou encore la présence de pierres. Savoir analyser ces éléments permet d'éviter un achat impulsif et de mieux comprendre ce que l'on paie réellement.</p>

<h2>Poids et structure de la bague</h2>

<p>Le poids d'une bague en or est l'un des éléments les plus concrets pour évaluer sa valeur. Même si deux modèles sont vendus au même prix, leur masse réelle d'or peut varier, ce qui influence directement leur valeur intrinsèque.</p>

<h3>Pourquoi le poids compte ?</h3>

<p>L'or est un métal précieux vendu au gramme. Plus une bague est lourde, plus elle contient d'or pur, donc plus sa valeur « matière » est élevée. Par exemple, une bague de 5 grammes contient logiquement plus d'or qu'une bague de 3,5 grammes, même si elles sont toutes deux en 18k.</p>

<h3>Structure</h3>

<p>Le design d'une bague peut influencer la quantité d'or utilisée. Les trois structures principales sont :</p>
<ul>
<li><strong>Plein</strong> : massive et dense, avec bonne durabilité et valeur en or</li>
<li><strong>Creux</strong> : paraît épaisse mais creuse à l'intérieur, réduisant le poids et le coût</li>
<li><strong>Ajouré</strong> : modèles avec motifs découpés, visuellement intéressants mais moins de matière</li>
</ul>

<h2>Design et finition</h2>

<p>L'évaluation du design et de la finition est essentielle lors de la comparaison. Ces éléments impactent le coût de fabrication, la valeur perçue et la durabilité.</p>

<h3>Design simple ou travail artisanal complexe</h3>

<p>Un modèle minimaliste fabriqué en série demande moins de main-d'œuvre qu'un modèle orné de détails complexes. Un bijou au design sophistiqué peut coûter autant qu'un modèle plus lourd si son travail est particulièrement minutieux, incluant gravures fines, formes sculptées et textures originales.</p>

<h3>Qualité de la finition</h3>

<p>La finition désigne le polissage, lissage, assemblage et ajustement final. Une finition soignée se reconnaît à une surface parfaitement polie, l'absence de défauts visibles, des soudures discrètes et une symétrie maîtrisée.</p>

<h2>Pierres et matériaux ajoutés</h2>

<h3>La présence de pierres précieuses ou ornementales</h3>

<p>L'ajout de pierres augmente le prix final sans nécessairement augmenter la quantité d'or. Une bague sertie d'un diamant ou saphir peut coûter pareil qu'une bague plus lourde en or seul. Les pierres ornementales comme les oxydes de zirconium imitent l'aspect sans avoir la même valeur.</p>

<h3>L'or utilisé : attention aux comparaisons hors norme</h3>

<p>Au Maroc, seule la vente de bijoux en or 18 carats (750 millièmes) est autorisée par la loi. Tous les bijoutiers certifiés respectent cette exigence et portent un poinçon de garantie. Cela signifie que le niveau de pureté est identique entre bagues légalement commercialisées.</p>

<h2>Valeur de revente et transmission</h2>

<h3>Documents et traçabilité</h3>

<p>Une bague achetée avec facture détaillée, certificat d'authenticité et poinçon officiel aura plus de poids en cas de revente ou transmission. Ces éléments prouvent l'origine légale et la conformité aux normes marocaines.</p>

<h3>Style, durabilité et intemporalité</h3>

<p>Une bague conçue pour durer se reconnaît par une fabrication soignée, une structure solide et un style intemporel. Les modèles très fins ou inspirés de tendances passagères peuvent se démoder ou s'endommager plus facilement, tandis qu'un bijou équilibré au design sobre traverse les générations.</p>

<h2>Comment trancher entre deux modèles équivalents ?</h2>

<h3>Hiérarchiser les critères</h3>

<p>Deux bagues au même prix peuvent être également cohérentes sans qu'une soit objectivement supérieure. L'erreur fréquente est de chercher une réponse unique, alors que la décision dépend de la priorité accordée à chaque critère : matière, esthétique, usage ou symbolique.</p>

<h3>Comparer à usage égal</h3>

<p>Une comparaison pertinente suppose que les deux bagues soient évaluées pour un usage similaire. Une bague quotidienne n'est pas jugée selon les mêmes exigences qu'un bijou occasionnel ou cérémoniel.</p>

<h2>Penser le bijou comme une décision, pas une impulsion</h2>

<p>Comparer deux bagues en or au même prix signifie regarder au-delà de l'éclat et du chiffre. C'est interroger la logique de fabrication, la cohérence de l'objet et la sincérité du geste. Faire un choix éclairé implique de comprendre ce que l'on valorise personnellement.</p>"""
            },
            {
                "title": "Comment reconnaître un bijou en or authentique ?",
                "slug": "comment-reconnaitre-un-bijou-en-or-authentique",
                "excerpt": "Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons. Découvrez les méthodes simples et professionnelles pour distinguer l'or authentique d'une copie.",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/1-1.png",
                "category": "Or",
                "reading_time": 10,
                "published_at": datetime(2026, 1, 9),
                "content": """<p>Reconnaître un bijou en or véritable est essentiel pour éviter les contrefaçons, surtout face à la montée des imitations trompeuses sur le marché. Que ce soit pour un achat, une revente ou simplement par curiosité, savoir distinguer l'or authentique d'une copie peut vous faire économiser de l'argent… et des déceptions.</p>

<h2>Les caractéristiques de l'or authentique</h2>

<p>L'or fait partie des métaux précieux les plus appréciés au monde, surtout lorsqu'il s'agit de bijoux. Mais attention! Tous les bijoux en or ne se valent pas. Pour savoir si une pièce est vraiment authentique, il faut tenir compte de plusieurs éléments, comme la pureté du métal et sa teinte, souvent influencée par les métaux avec lesquels il est mélangé.</p>

<h3>La pureté de l'or : carats et alliages</h3>

<p>L'unité de mesure la plus utilisée pour évaluer la pureté de l'or est le carat (K). L'or pur, c'est-à-dire sans aucun autre métal ajouté, est désigné comme 24 carats, soit 99,9 % d'or. Cependant, l'or pur est naturellement très malléable et donc peu adapté à la fabrication de bijoux portés au quotidien.</p>

<p>Pour renforcer sa solidité, l'or est souvent allié à d'autres métaux comme l'argent, le cuivre, le zinc ou encore le nickel. Ces alliages donnent naissance à des or de différents carats :</p>

<ul>
<li><strong>18 carats (750/1000)</strong> : 75 % d'or pur, le plus courant en joaillerie haut de gamme au Maroc.</li>
<li><strong>14 carats (585/1000)</strong> : 58,5 % d'or, plus répandu dans certains pays comme les États-Unis.</li>
<li><strong>9 carats (375/1000)</strong> : 37,5 % d'or, plus abordable, mais moins précieux.</li>
</ul>

<h3>Les couleurs de l'or</h3>

<p>Contrairement à ce que l'on pourrait penser, l'or ne se limite pas à sa couleur jaune caractéristique. En réalité, l'or utilisé en bijouterie peut revêtir plusieurs teintes, selon les métaux avec lesquels il est allié.</p>

<ul>
<li><strong>Or jaune</strong> : mélange traditionnel d'or pur, d'argent et de cuivre.</li>
<li><strong>Or blanc</strong> : obtenu en mélangeant de l'or avec du palladium ou du nickel, recouvert de rhodium.</li>
<li><strong>Or rose</strong> : ton chaleureux obtenu en ajoutant plus de cuivre dans l'alliage.</li>
</ul>

<h2>Les méthodes pour reconnaître un bijou en or véritable</h2>

<h3>Rechercher les poinçons officiels</h3>

<p>L'un des premiers réflexes pour vérifier l'authenticité d'un bijou en or, c'est de regarder s'il porte un poinçon. Ce petit symbole gravé dans le métal indique le titre de l'or (c'est-à-dire sa pureté) et garantit que le bijou a été contrôlé.</p>

<p>Au Maroc, la législation reconnaît officiellement l'or 18 carats (750/1000) comme référence. Le poinçon le plus courant est la tête d'aigle, symbole utilisé pour certifier que le bijou est bien en or 18K.</p>

<h3>Utiliser un aimant</h3>

<p>L'or est un métal non magnétique. Cela signifie qu'un bijou en or véritable ne réagit pas à l'aimant. Ce test est rapide et facile à réaliser chez soi. S'il est attiré, il contient probablement un métal ferreux incompatible avec l'or pur.</p>

<h3>Le test de la céramique</h3>

<p>Il suffit de frotter légèrement le bijou sur une surface en céramique brute (par exemple, le dessous d'un carreau de carrelage non vernissé).</p>

<ul>
<li>Si la trace laissée est dorée, le bijou est probablement en or.</li>
<li>Si elle est noire ou grise, il s'agit sans doute d'un métal plaqué ou d'un alliage.</li>
</ul>

<h3>Le test de l'acide</h3>

<p>C'est l'une des méthodes les plus utilisées en bijouterie professionnelle. Le test à l'acide consiste à frotter le bijou sur une pierre de touche, puis à appliquer des gouttes d'acides spécialement formulés pour réagir avec différents titrages d'or.</p>

<h2>Faire appel à un professionnel</h2>

<p>Même si certaines astuces permettent de faire un premier tri à la maison, rien ne remplace l'avis d'un professionnel quand il s'agit de vérifier l'authenticité d'un bijou en or.</p>

<h3>L'avis du bijoutier ou de l'orfèvre</h3>

<p>Dans nos villes marocaines, les bijoutiers de quartier ont souvent des années, voire des générations d'expérience dans le travail et la reconnaissance de l'or. Un bon bijoutier saura :</p>

<ul>
<li>Vérifier la présence et la lisibilité du poinçon.</li>
<li>Tester la densité du bijou par simple pesée.</li>
<li>Analyser la couleur et la réaction du métal au contact.</li>
</ul>

<h3>Acheter dans des lieux de confiance</h3>

<p>Dans tous les cas, que vous achetiez ou fassiez expertiser un bijou, privilégiez toujours :</p>

<ul>
<li>Les bijouteries connues ou recommandées.</li>
<li>Les professionnels disposant d'un registre de commerce et d'une traçabilité claire.</li>
<li>Les enseignes qui remettent un reçu ou un certificat à l'achat.</li>
</ul>

<h2>Miser sur la confiance et la transparence</h2>

<p>Lorsque l'on souhaite acquérir un bijou en or, la prudence reste votre meilleur allié. Au Maroc, mieux vaut privilégier les bijouteries reconnues, disposant d'un registre légal et capables de vous fournir une facture claire ou un certificat d'authenticité.</p>

<p>Que ce soit pour un cadeau, un investissement ou un plaisir personnel, choisir un bijou en or doit toujours s'accompagner d'un minimum d'informations… et d'un maximum de confiance.</p>"""
            },
            {
                "title": "Pourquoi le 18k est le standard légal de l'or marocain ?",
                "slug": "pourquoi-18k-standard-legal-or-marocain",
                "excerpt": "Au Maroc, l'or occupe une place centrale dans la culture et les traditions. Découvrez pourquoi le 18 carats est devenu le standard légal pour la bijouterie marocaine.",
                "image": "https://www.18k.ma/blog/wp-content/uploads/2020/06/2-1.png",
                "category": "Or",
                "reading_time": 7,
                "published_at": datetime(2025, 12, 25),
                "content": """<p>Au Maroc, l'or occupe une place centrale dans la culture, l'économie et les traditions sociales. Présent dans les mariages, les cérémonies familiales et l'épargne domestique, il est à la fois symbole de richesse et de sécurité. Contrairement à d'autres pays où l'or 22 ou 24 carats domine, le Maroc a fait du 18 carats le standard légal pour la bijouterie.</p>

<h2>Comprendre les carats de l'or</h2>

<h3>Le carat : quésaco ?</h3>

<p>Le carat est une unité de mesure qui indique la pureté de l'or contenu dans un alliage. L'or pur correspond à 24 carats, soit 100 % d'or. Plus le nombre de carats est élevé, plus la proportion d'or fin est importante.</p>

<h3>Composition de l'or 18 carats</h3>

<p>L'or 18 carats est composé de 75 % d'or pur, les 25 % restants étant constitués de métaux d'alliage. Les métaux d'alliage les plus couramment utilisés sont le cuivre et l'argent. Cette composition offre un équilibre idéal entre pureté et résistance.</p>

<h2>Le cadre légal de l'or au Maroc</h2>

<h3>La réglementation marocaine sur les métaux précieux</h3>

<p>Au Maroc, la commercialisation et la fabrication des métaux précieux sont strictement encadrées par l'État. Des textes de loi définissent les titres légaux de l'or autorisés, les conditions de fabrication des bijoux ainsi que les obligations des artisans et des commerçants.</p>

<h3>Pourquoi le 18 carats a été choisi comme norme légale ?</h3>

<p>Le choix du 18 carats comme standard légal repose avant tout sur un équilibre entre pureté et solidité. Avec 75 % d'or pur, ce titre offre une valeur intrinsèque élevée tout en permettant l'ajout de métaux d'alliage qui renforcent la résistance du bijou.</p>

<h2>Raisons historiques et culturelles</h2>

<h3>Les traditions de bijouterie marocaines</h3>

<p>Au Maroc, l'or occupe une place essentielle dans les mariages et les grandes cérémonies familiales. Les bijoux en or symbolisent à la fois la prospérité, la sécurité financière et le statut social. Ils sont souvent transmis de génération en génération, ce qui explique l'importance accordée à leur durabilité.</p>

<h3>Héritage artisanal et savoir-faire local</h3>

<p>La bijouterie marocaine repose sur un riche héritage artisanal, transmis au sein des corporations et des ateliers traditionnels. L'or 18 carats répond parfaitement au besoin d'un matériau plus résistant que l'or presque pur, permettant aux artisans de créer des pièces finement travaillées sans compromettre leur solidité.</p>

<h2>Comparaison avec d'autres pays</h2>

<h3>Or 22 et 24 carats dans d'autres marchés</h3>

<p>Dans plusieurs régions du monde, notamment en Inde et dans certains pays du Moyen-Orient, l'or 22 carats, voire 24 carats, est largement privilégié. Ces marchés valorisent avant tout la pureté maximale du métal, parfois au détriment de la résistance.</p>

<h3>Spécificité du modèle marocain</h3>

<p>Le modèle marocain se distingue par un positionnement intermédiaire entre tradition et praticité. Le Maroc a privilégié un titre permettant un usage fréquent et durable, adapté aux habitudes de port quotidien des bijoux.</p>

<h2>Que faire si l'on possède de l'or 22 ou 24 carats ?</h2>

<h3>Détention personnelle</h3>

<p>Au Maroc, un particulier peut posséder et porter de l'or 22 ou 24 carats sans enfreindre la loi. Ces bijoux peuvent provenir d'héritages, de voyages ou d'achats à l'étranger.</p>

<h3>Vente et cadre légal</h3>

<p>La réglementation marocaine de la bijouterie impose le 18 carats comme standard légal pour la fabrication, le poinçonnage et la vente des bijoux. Cela garantit une uniformité sur le marché et protège les consommateurs.</p>

<h2>L'or 18k, entre valeur économique et choix de société</h2>

<p>Au Maroc, le 18 carats s'est imposé au fil du temps comme un choix à la fois économique et culturel. Ce standard permet de concilier le rôle de refuge économique de l'or avec les exigences de l'usage quotidien. Il représente un équilibre entre la valeur intrinsèque du métal précieux et la durabilité nécessaire pour des bijoux portés régulièrement et transmis à travers les générations.</p>"""
            }
        ]

        # Create articles
        for article_data in articles_data:
            existing = db.query(Article).filter(Article.slug == article_data["slug"]).first()
            if existing:
                print(f"Article '{article_data['title'][:50]}...' already exists")
                continue

            category = categories.get(article_data.pop("category"))

            article = Article(
                **article_data,
                category_id=category.id if category else None,
                status="published",
                views=0,
                meta_title=article_data["title"],
                meta_description=article_data["excerpt"]
            )
            db.add(article)
            db.commit()
            print(f"Created article: {article_data['title'][:50]}...")

        print("\n✅ Blog seeding completed successfully!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_blog()
