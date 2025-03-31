# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install curl for the initialization script
RUN apk --no-cache add curl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/data

# Build the application
RUN npm run build

COPY scripts/initial-cargo-of-pokemons.sh /app/initial-cargo-of-pokemons.sh
RUN chmod +x /app/initial-cargo-of-pokemons.sh

# Expose the port
EXPOSE 3000

# Run the application with the initial-cargo-of-pokemons script
CMD ["/bin/sh", "-c", "npm run dev & sleep 15 && /app/initial-cargo-of-pokemons.sh"]