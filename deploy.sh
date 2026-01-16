#!/bin/bash

# Unified Deployment Script for Gold Prices Project
# Handles backend and/or frontend deployment with database persistence

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Display usage
usage() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   Gold Prices Deployment Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo "Usage: $0 [backend|frontend|all]"
    echo ""
    echo "Options:"
    echo "  backend   - Deploy backend only (with database persistence)"
    echo "  frontend  - Deploy frontend only"
    echo "  all       - Deploy both backend and frontend (default)"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy everything"
    echo "  $0 backend      # Deploy backend only"
    echo "  $0 frontend     # Deploy frontend only"
    echo ""
    exit 1
}

# Parse arguments
DEPLOY_TARGET="${1:-all}"

if [[ ! "$DEPLOY_TARGET" =~ ^(backend|frontend|all)$ ]]; then
    echo -e "${RED}Error: Invalid argument '$DEPLOY_TARGET'${NC}"
    echo ""
    usage
fi

# Get GCP configuration
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set.${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

# Configuration
BACKEND_SERVICE="gold-prices-backend"
FRONTEND_SERVICE="gold-prices-frontend"
REGION="us-central1"
BUCKET_NAME="gold-prices-db-${PROJECT_ID}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Gold Prices Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Project: ${GREEN}$PROJECT_ID${NC}"
echo -e "  Region: ${GREEN}$REGION${NC}"
echo -e "  Target: ${GREEN}$DEPLOY_TARGET${NC}"
echo ""

# Function to setup GCS persistence
setup_gcs_persistence() {
    echo -e "${YELLOW}Setting up database persistence...${NC}"
    
    # Create GCS bucket if it doesn't exist
    if gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
        echo -e "${GREEN}✓ GCS bucket already exists${NC}"
    else
        echo "Creating GCS bucket..."
        gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME
        gsutil versioning set on gs://$BUCKET_NAME
        
        # Set lifecycle policy
        cat > /tmp/lifecycle.json << 'EOF'
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {
          "numNewerVersions": 30
        }
      }
    ]
  }
}
EOF
        gsutil lifecycle set /tmp/lifecycle.json gs://$BUCKET_NAME
        rm /tmp/lifecycle.json
        
        echo -e "${GREEN}✓ GCS bucket created and configured${NC}"
    fi
    
    # Setup permissions
    PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
    SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/storage.objectAdmin" \
        --condition=None \
        > /dev/null 2>&1 || true
    
    echo -e "${GREEN}✓ Permissions configured${NC}"
    echo ""
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  Deploying Backend${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Setup GCS persistence first
    setup_gcs_persistence
    
    cd backend
    
    echo "Building and deploying backend to Cloud Run..."
    gcloud run deploy $BACKEND_SERVICE \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --timeout 60 \
        --set-env-vars GCS_BUCKET_NAME=$BUCKET_NAME,GCS_PERSISTENCE=true \
        --project=$PROJECT_ID
    
    BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE \
        --platform managed \
        --region $REGION \
        --format 'value(status.url)' \
        --project=$PROJECT_ID)
    
    echo ""
    echo -e "${GREEN}✓ Backend deployed successfully!${NC}"
    echo -e "${GREEN}  URL: $BACKEND_URL${NC}"
    echo ""
    
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}  Deploying Frontend${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Get backend URL if not already set
    if [ -z "$BACKEND_URL" ]; then
        BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE \
            --platform managed \
            --region $REGION \
            --format 'value(status.url)' \
            --project=$PROJECT_ID 2>/dev/null)
    fi
    
    if [ -n "$BACKEND_URL" ]; then
        echo "Updating frontend configuration..."
        # Update config.js with backend URL
        if [ -f "frontend/src/config.js" ]; then
            sed -i.bak "s|http://localhost:8000|$BACKEND_URL|g" frontend/src/config.js
        fi
    fi
    
    cd frontend
    
    echo "Building and deploying frontend to Cloud Run..."
    gcloud run deploy $FRONTEND_SERVICE \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --memory 256Mi \
        --cpu 1 \
        --max-instances 10 \
        --project=$PROJECT_ID
    
    FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE \
        --platform managed \
        --region $REGION \
        --format 'value(status.url)' \
        --project=$PROJECT_ID)
    
    echo ""
    echo -e "${GREEN}✓ Frontend deployed successfully!${NC}"
    echo -e "${GREEN}  URL: $FRONTEND_URL${NC}"
    echo ""
    
    cd ..
    
    # Update backend CORS if both URLs are available
    if [ -n "$BACKEND_URL" ] && [ -n "$FRONTEND_URL" ]; then
        echo -e "${YELLOW}Updating backend CORS configuration...${NC}"
        # Note: The CORS is already configured in main.py
        # Just redeploy backend if needed
        echo -e "${GREEN}✓ CORS already configured in backend${NC}"
        echo ""
    fi
}

# Main deployment logic
case "$DEPLOY_TARGET" in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_backend
        deploy_frontend
        ;;
esac

# Final summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Deployment Complete! 🎉${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [[ "$DEPLOY_TARGET" == "backend" ]] || [[ "$DEPLOY_TARGET" == "all" ]]; then
    echo -e "${GREEN}Backend:${NC}"
    echo -e "  URL: $BACKEND_URL"
    echo -e "  Database: Backed up to gs://$BUCKET_NAME"
    echo -e "  Persistence: ${GREEN}ENABLED${NC} ✓"
    echo ""
fi

if [[ "$DEPLOY_TARGET" == "frontend" ]] || [[ "$DEPLOY_TARGET" == "all" ]]; then
    echo -e "${GREEN}Frontend:${NC}"
    echo -e "  URL: $FRONTEND_URL"
    echo ""
fi

echo -e "${YELLOW}Key Features:${NC}"
echo "  ✅ Database persists across restarts"
echo "  ✅ Automatic backup to Google Cloud Storage"
echo "  ✅ Version history (30 backups retained)"
echo "  ✅ Auto-restore on container startup"
echo ""

echo -e "${YELLOW}Useful Commands:${NC}"
echo "  # View backups"
echo "  gsutil ls -a gs://$BUCKET_NAME/"
echo ""
echo "  # View logs"
echo "  gcloud run services logs read $BACKEND_SERVICE --region $REGION --limit=50"
echo ""
echo "  # Test API"
echo "  curl $BACKEND_URL/api/prices/current"
echo ""

echo -e "${GREEN}Your gold prices website is live! 🎉${NC}"
echo ""
