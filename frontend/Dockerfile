# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy package manifests first for caching
COPY package.json package-lock.json ./

# Install dependencies using clean install
RUN npm ci

# Copy frontend source code
COPY . .

# Build argument for Vite API URL (defaults to local Docker backend)
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle to dist/
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets to Nginx html root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration for React Router SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
