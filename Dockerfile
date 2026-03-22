# ----------------------
# Build stage
# ----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm ci

# Copy app code
COPY . .

# Build Vite application
RUN npm run build

# ----------------------
# Production stage
# ----------------------
FROM nginx:alpine

# Install bash, curl, certbot, and certbot-nginx plugin
RUN apk add --no-cache bash curl certbot certbot-nginx

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]