#!/bin/bash

# Function to use the appropriate docker compose command
docker_compose() {
  if command -v docker-compose &> /dev/null; then
    docker-compose "$@"
  else
    docker compose "$@"
  fi
}

function start_dev {
  echo "Starting development environment..."
  docker_compose -f docker-compose.dev.yml up -d nextjs-dev redis redis-commander
  
  echo "Waiting for services to be ready..."
  sleep 10
  
  echo "Running database migrations..."
  docker_compose -f docker-compose.dev.yml exec nextjs-dev npm run db:migrate
  
  echo "Development environment is ready! You can access:"
  echo "- Next.js app: http://localhost:3000"
  echo "- Redis Commander: http://localhost:8081"
}

function init_data {
  docker_compose -f docker-compose.dev.yml exec nextjs-dev bash -c "curl -X POST http://localhost:3000/api/pokemon/sync"
}

function stop_dev {
  echo "Stopping development environment..."
  docker_compose -f docker-compose.dev.yml down
}

function show_logs {
  echo "Showing logs..."
  docker_compose -f docker-compose.dev.yml logs -f
}

function run_migrate {
  echo "Running database migrations..."
  docker_compose -f docker-compose.dev.yml exec nextjs-dev npm run db:migrate
}

function start_fresh {
  echo "Starting fresh development environment..."
  stop_dev
  echo "Removing Docker volumes..."
  docker volume rm redis-nextjs-txtfl-pkmn_redis-data redis-nextjs-txtfl-pkmn_sqlite-data redis-nextjs-txtfl-pkmn_node_modules 2>/dev/null || true
  echo "Rebuilding and starting containers..."
  docker_compose -f docker-compose.dev.yml up -d --build nextjs-dev redis redis-commander
  echo "Waiting for containers to be ready..."
  sleep 10
  echo "Running database migrations..."
  run_migrate
  echo "Initializing Pokemon data..."
  init_data
  echo "Setup complete! Your development environment is ready."
}

# Add the missing show_help function
function show_help {
  echo "Development Environment Management"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  start       Start the development environment"
  echo "  start_fresh Start fresh environment (remove volumes and start from scratch)"
  echo "  stop        Stop the development environment"
  echo "  restart     Restart the development environment"
  echo "  init        Initialize Pokemon data"
  echo "  migrate     Run database migrations"
  echo "  logs        Show logs from all containers"
  echo "  help        Show this help message"
}

case "$1" in
  start)
    start_dev
    ;;
  start_fresh)
    start_fresh
    ;;
  stop)
    stop_dev
    ;;
  restart)
    stop_dev
    start_dev
    ;;
  init)
    init_data
    ;;
  migrate)
    run_migrate
    ;;
  logs)
    show_logs
    ;;
  help|*)
    show_help
    ;;
esac