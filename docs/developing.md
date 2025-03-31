# Developing

    The development branch is canary.

    All pull requests should be opened against canary.

    The changes on the canary branch are published regularly.

### Dependencies

    Install Docker.

    Install Docker Compose.

    Install Git.

    Install Node.js (>= 18.17.1) via nvm:
    
    nvm install 18.17.1
    nvm use 18.17.1

### Enable pnpm:

    corepack enable pnpm

    Install Redis and SQLite via Docker.

# Local Development

### Clone the repository:
    git clone <repository-url> --branch canary --single-branch
    cd <repository-name>
    
### Create a new branch:

    git checkout -b MY_BRANCH_NAME origin/canary

### Install dependencies:

    pnpm install

### Start the development server:

    pnpm dev

Run type checking:

    pnpm types

### When changes are complete, commit them:

    git add .
    git commit -m "DESCRIBE_YOUR_CHANGES_HERE"

# Running the Application with Docker

## Start the services using Docker Compose:

    docker-compose up -d

## To stop the services:

    docker-compose down
    
```
version: '3.8'

services:
  app:
    build: .
    container_name: nextjs_redis-nextjs-txtfl-pkmn
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - redis
      - sqlite
    environment:
      NODE_ENV: development

  redis:
    image: redis:latest
    container_name: redis_redis-nextjs-txtfl-pkmn
    ports:
      - "6379:6379"

  sqlite:
    image: nouchka/sqlite3:latest
    container_name: my_sqlite
    volumes:
      - sqlite_data:/root/db

volumes:
  sqlite_data:

``` 
