# Developing

The development branch is canary. All pull requests should be opened against canary. The changes on the canary branch are published regularly.

## Dependencies

- Install Docker
- Install Docker Compose (or use Docker Desktop which includes Docker Compose)
- Install Git
- Install Node.js (>= 18.17.1)

## Local Development Setup

### Clone the repository:

```
git clone <repository-url> --branch canary --single-branch
cd <repository-name>
```


### Running with Docker (recommended):
#### Make sure your scripts are executable (Mac/Linux):

```
chmod +x scripts/dev.sh
chmod +x scripts/initial-cargo-of-pokemons.sh
```

#### Start the development environment:

```
npm run docker:dev
```
This will:

Start the Next.js application
Start Redis
Start Redis Commander (a Redis admin interface)
Run the database migrations automatically

#### Initialize Pokemon Data:

```
npm run docker:init
# or
./scripts/dev.sh init
```

#### Start a fresh environment (remove all data and start from scratch):
```
npm run docker:fresh_dev
# or
./scripts/dev.sh start_fresh
```

This will:

Stop all containers
Remove all volumes (Redis data, SQLite database, and node_modules)
Start the containers again
Run database migrations
Initialize Pokemon data

#### Stop the development environment:

```
npm run docker:stop
# or
./scripts/dev.sh stop
```

#### Access Points

Next.js App: http://localhost:3000
Redis Commander: http://localhost:8081

### Create a new branch:

```
git checkout -b MY_BRANCH_NAME origin/canary
```

### Environment variables:

Use this as a start point:

```
REDIS_URL=redis://redis:6379
DATABASE_URL=/app/data/sqlite.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-me
```
