#!/bin/bash

echo "🦁 EternaLynX Network - Initial Setup"
echo "======================================"

# Create .env if not exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️  Please update .env with your actual keys"
fi

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build --no-cache

# Start services
echo "🚀 Starting EternaLynX Network..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to become healthy..."
sleep 10

# Check status
echo "✅ Checking service health..."
docker-compose ps

# Create database schema
echo "🗄️  Initializing database..."
docker-compose exec postgres_db psql -U eternalynx_admin -d eternadb -f /docker-entrypoint-initdb. d/init.sql

echo ""
echo "✨ EternaLynX is running!"
echo "🌐 Gateway: http://localhost"
echo "🎨 Frontend: http://localhost:3000"
echo "🔐 Security: http://localhost:3001"
echo "💰 Finance: http://localhost:3002"
echo "📱 Social: http://localhost:3003"
echo "🛍️  Market: http://localhost:3004"
echo "🤖 AI Core: http://localhost:8081"
