.PHONY: help up down restart logs clean rebuild dev-bo dev-api build test

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)DamierClub - Makefile Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Docker Commands
up: ## Start Docker containers (API + DB only, no BO)
	@echo "$(BLUE)Starting Docker containers...$(NC)"
	docker-compose up -d postgres api
	@echo "$(GREEN)Containers started!$(NC)"
	@echo "API: http://localhost:8090"
	@echo "DB: localhost:5433"

up-all: ## Start ALL Docker containers (API + DB + BO)
	@echo "$(BLUE)Starting all Docker containers...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)All containers started!$(NC)"
	@echo "API: http://localhost:8090"
	@echo "DB: localhost:5433"
	@echo "BO: http://localhost:3000"

down: ## Stop all Docker containers
	@echo "$(YELLOW)Stopping Docker containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)Containers stopped!$(NC)"

restart: ## Restart all Docker containers
	@echo "$(YELLOW)Restarting Docker containers...$(NC)"
	docker-compose restart
	@echo "$(GREEN)Containers restarted!$(NC)"

logs: ## Show Docker logs (use 'make logs-api' or 'make logs-db')
	docker-compose logs -f

logs-api: ## Show API logs
	docker-compose logs -f api

logs-db: ## Show database logs
	docker-compose logs -f postgres

logs-bo: ## Show BO logs
	docker-compose logs -f bo

logs-bo-follow: ## Follow BO Docker logs in real-time
	docker-compose logs -f --tail=100 bo

# Build Commands
build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	docker-compose build
	@echo "$(GREEN)Build complete!$(NC)"

rebuild: ## Rebuild all Docker images from scratch
	@echo "$(BLUE)Rebuilding Docker images from scratch...$(NC)"
	docker-compose build --no-cache
	@echo "$(GREEN)Rebuild complete!$(NC)"

rebuild-api: ## Rebuild API image
	@echo "$(BLUE)Rebuilding API image...$(NC)"
	docker-compose build --no-cache api
	@echo "$(GREEN)API rebuild complete!$(NC)"

rebuild-bo: ## Rebuild BO image
	@echo "$(BLUE)Rebuilding BO image...$(NC)"
	docker-compose build --no-cache bo
	@echo "$(GREEN)BO rebuild complete!$(NC)"

rebuild-bo-docker: ## Rebuild BO Docker image completely and restart
	@echo "$(BLUE)Rebuilding BO Docker image completely...$(NC)"
	docker-compose stop bo || true
	docker-compose rm -f bo || true
	docker volume rm -f damierclub_bo-node-modules damierclub_bo-next || true
	docker-compose build --no-cache bo
	docker-compose up -d bo
	@echo "$(GREEN)BO Docker rebuild complete!$(NC)"
	@echo "BO: http://localhost:3000"

# Development Commands
dev-bo: ## Start BO in development mode (local)
	@echo "$(BLUE)Starting BO in development mode...$(NC)"
	cd bo && pnpm dev

dev-bo-clean: ## Clean BO cache and start development mode
	@echo "$(YELLOW)Cleaning BO cache...$(NC)"
	cd bo && rm -rf .next node_modules/.cache || true
	@echo "$(BLUE)Starting BO in development mode...$(NC)"
	cd bo && pnpm dev

install-bo: ## Install BO dependencies
	@echo "$(BLUE)Installing BO dependencies...$(NC)"
	cd bo && pnpm install
	@echo "$(GREEN)Dependencies installed!$(NC)"

# API Commands
dev-api: ## Start API in development mode
	@echo "$(BLUE)Starting API in development mode...$(NC)"
	cd api && ./mvnw spring-boot:run

build-api: ## Build API JAR
	@echo "$(BLUE)Building API...$(NC)"
	cd api && ./mvnw clean package
	@echo "$(GREEN)API build complete!$(NC)"

# Database Commands
db-shell: ## Connect to PostgreSQL shell
	docker exec -it club-db psql -U damier damierdb

db-reset: ## Reset database (WARNING: destroys all data)
	@echo "$(RED)WARNING: This will destroy all data!$(NC)"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	docker-compose down -v
	docker-compose up -d postgres
	@echo "$(GREEN)Database reset complete!$(NC)"

# Testing Commands
test-bo: ## Run BO tests
	@echo "$(BLUE)Running BO tests...$(NC)"
	cd bo && pnpm test

test-cypress: ## Run Cypress E2E tests
	@echo "$(BLUE)Running Cypress tests...$(NC)"
	cd bo && pnpm cypress:headless

test-cypress-open: ## Open Cypress UI
	@echo "$(BLUE)Opening Cypress...$(NC)"
	cd bo && npx cypress open

# Clean Commands
clean: ## Clean all caches and temporary files
	@echo "$(YELLOW)Cleaning caches...$(NC)"
	cd bo && rm -rf .next node_modules/.cache
	cd api && ./mvnw clean
	@echo "$(GREEN)Clean complete!$(NC)"

clean-all: ## Clean everything including node_modules and Docker volumes
	@echo "$(RED)WARNING: This will remove node_modules, Docker volumes, and all caches!$(NC)"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read confirm
	@echo "$(YELLOW)Cleaning everything...$(NC)"
	cd bo && rm -rf .next node_modules node_modules/.cache
	docker-compose down -v
	@echo "$(GREEN)Deep clean complete!$(NC)"

# Status Commands
status: ## Show status of all services
	@echo "$(BLUE)Service Status:$(NC)"
	@echo ""
	@echo "$(GREEN)Docker Containers:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(GREEN)Ports in use:$(NC)"
	@echo "API: 8090"
	@echo "DB: 5433"
	@echo "BO: 3000"

ps: ## Show running Docker containers
	docker-compose ps

bo-shell: ## Open shell in BO Docker container
	@echo "$(BLUE)Opening shell in BO container...$(NC)"
	docker exec -it club-bo sh

api-shell: ## Open shell in API Docker container
	@echo "$(BLUE)Opening shell in API container...$(NC)"
	docker exec -it club-api sh

# Quick Start Commands
start: up-all ## Quick start (start all Docker containers including BO)

start-local: up install-bo dev-bo ## Start with local BO (Docker API + DB, local BO)

stop: down ## Quick stop (stop all Docker containers)

restart-all: down up ## Restart everything
	@echo "$(GREEN)All services restarted!$(NC)"

# Article Feature
article-test: ## Test articles feature
	@echo "$(BLUE)Testing Articles API...$(NC)"
	curl -s http://localhost:8090/api/articles?page=0&size=10 | head -20
	@echo ""
	@echo "$(GREEN)Articles API is responding!$(NC)"
