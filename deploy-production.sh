#!/bin/bash

# Production Deployment Script for Justice Caseload Application
# This script builds and deploys the application using Docker Compose

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Check if environment file exists
check_env_file() {
    if [ ! -f ".env.production" ]; then
        log_warning ".env.production file not found."
        log_info "Creating .env.production from template..."
        
        if [ -f ".env.production.template" ]; then
            cp .env.production.template .env.production
            log_warning "Please edit .env.production with your production values before continuing."
            log_warning "Press Enter when ready to continue..."
            read -r
        else
            log_error "No .env.production.template found. Please create environment configuration."
            exit 1
        fi
    fi
    
    log_success "Environment file check passed"
}

# Build and deploy
deploy() {
    log_info "Starting production deployment..."
    
    # Load environment variables
    set -a
    source .env.production
    set +a
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Remove old images (optional - comment out if you want to keep them)
    # log_info "Removing old images..."
    # docker image prune -f
    
    # Build new images
    log_info "Building application image..."
    docker-compose -f docker-compose.prod.yml build --no-cache app
    
    # Start services
    log_info "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 10
    
    # Check health status
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:${APP_PORT:-3000}/api/health >/dev/null 2>&1; then
            log_success "Application is healthy and ready!"
            break
        else
            log_info "Attempt $attempt/$max_attempts: Waiting for application to be ready..."
            sleep 5
            ((attempt++))
        fi
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Application failed to become healthy within timeout period"
        log_info "Checking logs..."
        docker-compose -f docker-compose.prod.yml logs app
        exit 1
    fi
    
    log_success "Deployment completed successfully!"
    log_info "Application is running at http://localhost:${APP_PORT:-3000}"
}

# Show logs
show_logs() {
    log_info "Showing application logs..."
    docker-compose -f docker-compose.prod.yml logs -f
}

# Stop services
stop() {
    log_info "Stopping services..."
    docker-compose -f docker-compose.prod.yml down
    log_success "Services stopped"
}

# Main script
case "${1:-deploy}" in
    "deploy")
        check_dependencies
        check_env_file
        deploy
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop
        ;;
    "restart")
        stop
        sleep 2
        check_dependencies
        check_env_file
        deploy
        ;;
    *)
        echo "Usage: $0 {deploy|logs|stop|restart}"
        echo "  deploy  - Build and deploy the application (default)"
        echo "  logs    - Show application logs"
        echo "  stop    - Stop all services"
        echo "  restart - Stop and restart services"
        exit 1
        ;;
esac
