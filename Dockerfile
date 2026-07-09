# Stage 1: Build the React frontend
FROM node:20 AS frontend-builder
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
RUN npm run build

# Stage 2: Setup the Node backend with Puppeteer/Chromium dependencies
FROM node:20-slim

# Install Chromium system dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for Backend
WORKDIR /app/backend

# Copy backend packages and install dependencies
COPY Backend/package*.json ./
RUN npm install

# Copy the built frontend dist directory from Stage 1 to the location expected by Express app.js
COPY --from=frontend-builder /app/frontend/dist /app/Frontend/dist

# Copy backend source code
COPY Backend/ ./

# Configure environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Hugging Face Spaces runs on port 7860 by default
EXPOSE 7860

CMD ["node", "server.js"]
