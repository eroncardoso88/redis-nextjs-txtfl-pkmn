#!/bin/bash
set -e

echo "Starting Pokemon data initialization..."

# Wait for the Next.js app to be ready
echo "Waiting for Next.js app to start..."
sleep 10

# Call the sync endpoint to populate the Pokemon table
echo "Syncing Pokemon data..."
curl -X POST http://nextjs-dev:3000/api/pokemon/sync

echo "Pokemon initialization complete!"