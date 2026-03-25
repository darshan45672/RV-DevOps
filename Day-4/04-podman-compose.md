# 4️⃣ Podman Compose Guide

**Duration**: 1 hour  
**Mode**: Hands-on Multi-Container Apps

---

## 📌 Table of Contents

1. [Introduction to Podman Compose](#introduction-to-podman-compose)
2. [Installation](#installation)
3. [Compose File Syntax](#compose-file-syntax)
4. [Services](#services)
5. [Networks](#networks)
6. [Volumes](#volumes)
7. [Complete Examples](#complete-examples)

---

## 🚀 Introduction to Podman Compose

### What is Podman Compose?

**Podman Compose** is a tool for defining and running multi-container applications using Podman.

**Features:**
✅ Docker Compose compatible  
✅ Uses YAML configuration  
✅ Manages multiple containers  
✅ Handles networks and volumes  
✅ Works with Podman pods  

### Why Use Compose?

**Without Compose:**
```bash
# Manual commands for each container
podman network create mynet
podman volume create dbdata
podman run -d --name db --network mynet -v dbdata:/data postgres
podman run -d --name api --network mynet -e DB_HOST=db myapi
podman run -d --name web --network mynet -p 80:80 nginx
```

**With Compose:**
```yaml
# compose.yaml - One file!
services:
  db:
    image: postgres
    volumes:
      - dbdata:/data
  api:
    image: myapi
    environment:
      DB_HOST: db
  web:
    image: nginx
    ports:
      - "80:80"
volumes:
  dbdata:
networks:
  default:
```

```bash
# Single command!
podman-compose up
```

---

## 📦 Installation

### Install Podman Compose

```bash
# Using pip
pip3 install podman-compose

# Or using pipx (recommended)
pipx install podman-compose

# Verify installation
podman-compose --version
```

### Alternative: Use Podman Directly

Podman can also use Docker Compose files:

```bash
# Install docker-compose
pip3 install docker-compose

# Use with Podman
export DOCKER_HOST=unix:///run/user/$(id -u)/podman/podman.sock
docker-compose up
```

---

## 📝 Compose File Syntax

### Basic Structure

```yaml
version: '3.8'  # Optional for podman-compose

services:
  # Your containers here
  
networks:
  # Your networks here
  
volumes:
  # Your volumes here
```

### File Naming

Podman Compose looks for these files (in order):
1. `compose.yaml`
2. `compose.yml`
3. `docker-compose.yaml`
4. `docker-compose.yml`
5. `podman-compose.yaml`
6. `podman-compose.yml`

---

## 🔧 Services

### Basic Service

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

### Build from Containerfile

```yaml
services:
  app:
    build: .
    # Or with context
    build:
      context: ./app
      dockerfile: Containerfile
```

### Port Mapping

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"           # host:container
      - "127.0.0.1:8080:80" # bind to specific IP
      - "8080-8085:80-85"   # port range
```

### Environment Variables

```yaml
services:
  app:
    image: myapp
    environment:
      NODE_ENV: production
      API_KEY: secret123
      DEBUG: "true"
    # Or from file
    env_file:
      - .env
```

**.env file:**
```
NODE_ENV=production
API_KEY=secret123
DEBUG=true
```

### Volumes

```yaml
services:
  db:
    image: postgres
    volumes:
      - dbdata:/var/lib/postgresql/data  # Named volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro  # Bind mount (read-only)
      - /host/path:/container/path  # Bind mount
```

### Depends On

```yaml
services:
  web:
    image: nginx
    depends_on:
      - api
      - db
  
  api:
    image: myapi
    depends_on:
      - db
  
  db:
    image: postgres

# Start order: db → api → web
```

### Restart Policies

```yaml
services:
  app:
    image: myapp
    restart: always
    # Options: no, always, on-failure, unless-stopped
```

### Health Checks

```yaml
services:
  app:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Resource Limits

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Complete Service Example

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Containerfile
    image: myapi:latest
    container_name: my-api
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://db:5432/mydb
    env_file:
      - .env
    volumes:
      - ./api:/app
      - node_modules:/app/node_modules
    depends_on:
      - db
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    networks:
      - backend
```

---

## 🌐 Networks

### Default Network

By default, Compose creates a network for your app:

```yaml
services:
  web:
    image: nginx
  db:
    image: postgres
# Both on same network automatically!
# web can access db via hostname "db"
```

### Custom Networks

```yaml
services:
  web:
    image: nginx
    networks:
      - frontend
  
  api:
    image: myapi
    networks:
      - frontend
      - backend
  
  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
  backend:
```

### Network with Options

```yaml
networks:
  custom:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

---

## 💾 Volumes

### Named Volumes

```yaml
services:
  db:
    image: postgres
    volumes:
      - dbdata:/var/lib/postgresql/data

volumes:
  dbdata:
```

### External Volumes

Use existing volume:

```yaml
volumes:
  dbdata:
    external: true
```

### Volume with Options

```yaml
volumes:
  dbdata:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/host
```

---

## 💡 Complete Examples

### Example 1: Web + Database

**compose.yaml:**
```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - backend

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - backend
      - frontend

  web:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    networks:
      - frontend

volumes:
  postgres-data:

networks:
  frontend:
  backend:
```

**Run:**
```bash
podman-compose up -d
```

### Example 2: Full Stack (React + Node + PostgreSQL)

**Project structure:**
```
project/
├── compose.yaml
├── frontend/
│   ├── Containerfile
│   ├── package.json
│   └── src/
├── backend/
│   ├── Containerfile
│   ├── package.json
│   └── src/
└── .env
```

**compose.yaml:**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Containerfile
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Containerfile
    environment:
      REACT_APP_API_URL: http://localhost:5000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

**.env:**
```
DB_USER=postgres
DB_PASSWORD=supersecret
DB_NAME=myapp
JWT_SECRET=your-secret-key
```

**backend/Containerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

**frontend/Containerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Run:**
```bash
podman-compose up --build
```

### Example 3: Microservices with Redis

**compose.yaml:**
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  auth-service:
    build: ./services/auth
    environment:
      REDIS_URL: redis://redis:6379
    ports:
      - "3001:3000"
    depends_on:
      - redis

  user-service:
    build: ./services/users
    environment:
      REDIS_URL: redis://redis:6379
      DATABASE_URL: postgresql://postgres:secret@postgres:5432/users
    ports:
      - "3002:3000"
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: users
    volumes:
      - postgres-data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - auth-service
      - user-service

volumes:
  redis-data:
  postgres-data:
```

---

## 🎮 Podman Compose Commands

### Basic Commands

```bash
# Start services
podman-compose up

# Start in background
podman-compose up -d

# Build images
podman-compose build

# Build and start
podman-compose up --build

# Stop services
podman-compose down

# Stop and remove volumes
podman-compose down -v

# View logs
podman-compose logs

# Follow logs
podman-compose logs -f

# View specific service logs
podman-compose logs api

# List containers
podman-compose ps

# Execute command in service
podman-compose exec api bash

# Run one-off command
podman-compose run api npm test

# Scale service
podman-compose up --scale api=3
```

### Useful Options

```bash
# Use specific compose file
podman-compose -f custom-compose.yaml up

# Use specific project name
podman-compose -p myproject up

# View configuration
podman-compose config

# Validate compose file
podman-compose config --quiet
```

---

## 🎯 Summary

### Key Concepts

1. ✅ **Services** - Individual containers
2. ✅ **Networks** - Connect containers
3. ✅ **Volumes** - Persist data
4. ✅ **Environment** - Configuration
5. ✅ **Dependencies** - Startup order
6. ✅ **Health Checks** - Service availability

### Compose File Checklist

✅ Define all services  
✅ Set environment variables  
✅ Map ports correctly  
✅ Create volumes for data  
✅ Set up networks  
✅ Configure dependencies  
✅ Add health checks  
✅ Set restart policies  

---

**Next**: [Practical Podman Project →](./05-podman-project.md)
