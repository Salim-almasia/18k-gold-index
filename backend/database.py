from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_FILE = "gold_prices.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DB_FILE}"

# Google Cloud Storage configuration
GCS_BUCKET = os.getenv("GCS_BUCKET_NAME", "luxoria-gold-prices-db")
GCS_ENABLED = os.getenv("GCS_PERSISTENCE", "true").lower() == "true"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def restore_db_from_gcs():
    """Restore database from Google Cloud Storage if it exists"""
    if not GCS_ENABLED:
        logger.info("GCS persistence is disabled")
        return False
    
    try:
        from google.cloud import storage
        
        # Initialize GCS client
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET)
        blob = bucket.blob(DB_FILE)
        
        # Check if database backup exists
        if blob.exists():
            logger.info(f"Restoring database from GCS bucket: {GCS_BUCKET}")
            blob.download_to_filename(DB_FILE)
            logger.info("✓ Database restored successfully from GCS")
            return True
        else:
            logger.info("No existing database backup found in GCS")
            return False
    except Exception as e:
        logger.error(f"Failed to restore database from GCS: {e}")
        return False


def backup_db_to_gcs():
    """Backup database to Google Cloud Storage"""
    if not GCS_ENABLED:
        return False
    
    try:
        from google.cloud import storage
        
        # Check if database file exists
        if not os.path.exists(DB_FILE):
            logger.warning(f"Database file {DB_FILE} does not exist, skipping backup")
            return False
        
        # Initialize GCS client
        client = storage.Client()
        bucket = client.bucket(GCS_BUCKET)
        blob = bucket.blob(DB_FILE)
        
        # Upload database to GCS
        logger.info(f"Backing up database to GCS bucket: {GCS_BUCKET}")
        blob.upload_from_filename(DB_FILE)
        logger.info("✓ Database backed up successfully to GCS")
        return True
    except Exception as e:
        logger.error(f"Failed to backup database to GCS: {e}")
        return False




