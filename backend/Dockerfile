FROM node:22-alpine

WORKDIR /app

# Copy package manifests first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies using clean install
RUN npm ci

# Copy backend application source
COPY . .

# Build the TypeScript application to dist/
RUN npm run build

# Expose backend service port
EXPOSE 3000

# Start compiled server using verified production script (node dist/server.js)
CMD ["npm", "start"]
