# 3️⃣ Containerfile Best Practices

**Duration**: 1.5 hours  
**Mode**: Hands-on + Best Practices

---

## 📌 Table of Contents

1. [Containerfile Basics](#containerfile-basics)
2. [Essential Instructions](#essential-instructions)
3. [Multi-Stage Builds](#multi-stage-builds)
4. [Optimization Techniques](#optimization-techniques)
5. [Security Best Practices](#security-best-practices)
6. [Real-World Examples](#real-world-examples)

---

## 📝 Containerfile Basics

### What is a Containerfile?

A **Containerfile** (or Dockerfile) is a text file with instructions to build a container image.

**Containerfile vs Dockerfile:**
- Same syntax, same instructions
- Podman accepts both names
- `Containerfile` is more generic (OCI standard)
- `Dockerfile` is Docker-specific naming

**Create a Containerfile:**
```bash
touch Containerfile
# or
touch Dockerfile
```

### Basic Structure

```dockerfile
# Comment
INSTRUCTION arguments
```

**Example:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Build Image

```bash
# Build from Containerfile
podman build -t myapp .

# Build from Dockerfile
podman build -t myapp -f Dockerfile .

# Build with no cache
podman build --no-cache -t myapp .

# Build with build args
podman build --build-arg NODE_ENV=production -t myapp .
```

---

## 🔧 Essential Instructions

### 1. FROM - Base Image

Every Containerfile starts with `FROM`.

```dockerfile
# Official image
FROM node:18

# Specific version
FROM node:18.17.0

# Alpine (smaller)
FROM node:18-alpine

# Slim variant
FROM node:18-slim

# Scratch (empty image)
FROM scratch
```

**Best practices:**
✅ Use specific versions (`node:18.17.0` not `node:latest`)  
✅ Prefer Alpine for smaller size  
✅ Use official images from trusted sources  

### 2. WORKDIR - Working Directory

Sets the working directory for subsequent instructions.

```dockerfile
WORKDIR /app

# All following commands run in /app
COPY . .
RUN npm install
```

**vs doing:**
```dockerfile
# ❌ Bad
RUN cd /app && npm install
# Each RUN is a new layer, cd doesn't persist!
```

### 3. COPY - Copy Files

Copy files from host to image.

```dockerfile
# Copy single file
COPY package.json /app/

# Copy multiple files
COPY package.json package-lock.json /app/

# Copy directory
COPY src/ /app/src/

# Copy everything
COPY . /app/

# Copy with wildcard
COPY *.json /app/
```

**COPY vs ADD:**
```dockerfile
# Use COPY for simple file copying
COPY app.js /app/

# Use ADD only for auto-extraction
ADD archive.tar.gz /app/
# ADD auto-extracts tar files

# ADD can also fetch URLs
ADD https://example.com/file.txt /app/
```

**Best practice:** Use `COPY` unless you need ADD's special features.

### 4. RUN - Execute Commands

Run commands during image build.

```dockerfile
# Single command
RUN npm install

# Multiple commands (bad)
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# Multiple commands (good - single layer)
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**Why chain commands?**
- Each `RUN` creates a new layer
- More layers = bigger image
- Chaining = fewer layers = smaller image

### 5. ENV - Environment Variables

Set environment variables.

```dockerfile
# Single variable
ENV NODE_ENV=production

# Multiple variables
ENV NODE_ENV=production \
    PORT=3000 \
    API_URL=https://api.example.com

# Use in commands
ENV APP_HOME=/app
WORKDIR $APP_HOME
```

### 6. EXPOSE - Document Ports

Documents which ports the container listens on.

```dockerfile
EXPOSE 3000

# Multiple ports
EXPOSE 3000 8080

# With protocol
EXPOSE 3000/tcp
EXPOSE 53/udp
```

**Note:** `EXPOSE` is documentation only! Use `-p` when running:
```bash
podman run -p 3000:3000 myapp
```

### 7. CMD - Default Command

Default command when container starts.

```dockerfile
# Exec form (preferred)
CMD ["node", "server.js"]

# Shell form
CMD node server.js

# With arguments
CMD ["npm", "start"]
```

**Only the last CMD is used:**
```dockerfile
CMD ["echo", "first"]
CMD ["echo", "second"]  # This one runs
```

### 8. ENTRYPOINT - Container Executable

Makes container run like an executable.

```dockerfile
# Exec form
ENTRYPOINT ["node"]

# Now you can pass args:
# podman run myapp server.js
# Runs: node server.js
```

**ENTRYPOINT + CMD:**
```dockerfile
ENTRYPOINT ["node"]
CMD ["server.js"]

# Default: node server.js
# Override: podman run myapp app.js → node app.js
```

**CMD vs ENTRYPOINT:**

```dockerfile
# CMD - can be completely overridden
CMD ["node", "server.js"]
# podman run myapp echo hello  → echo hello

# ENTRYPOINT - always runs, args appended
ENTRYPOINT ["node"]
CMD ["server.js"]
# podman run myapp           → node server.js
# podman run myapp app.js    → node app.js
```

### 9. ARG - Build Arguments

Variables available only during build.

```dockerfile
# Define arg
ARG NODE_VERSION=18

# Use it
FROM node:${NODE_VERSION}

# With default value
ARG PORT=3000
ENV PORT=$PORT

# Build:
# podman build --build-arg NODE_VERSION=20 -t myapp .
```

### 10. USER - Set User

Run container as non-root user (security!).

```dockerfile
# Create user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Switch to user
USER nodejs

# All subsequent commands run as nodejs user
```

### 11. VOLUME - Mount Points

Create mount point for external storage.

```dockerfile
VOLUME /data

# Container data in /data can persist
```

### 12. HEALTHCHECK - Container Health

Define health check command.

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Podman will check container health every 30s
```

---

## 🏗️ Multi-Stage Builds

**Problem:** Build tools increase image size.

**Solution:** Multi-stage builds!

### Basic Multi-Stage

```dockerfile
# Stage 1: Build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Result:**
- Build stage: 1.2 GB (includes dev dependencies, build tools)
- Final image: 150 MB (only production files!)

### Example: React Application

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- Build: 500 MB
- Final: 25 MB! 🚀

### Example: Go Application

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server

# Production stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server ./
EXPOSE 8080
CMD ["./server"]
```

**Result:**
- Build: 400 MB
- Final: 10 MB! 🔥

### Example: Python Application

```dockerfile
# Build stage
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 8000
CMD ["python", "app.py"]
```

---

## ⚡ Optimization Techniques

### 1. Layer Caching

**Podman caches each layer!**

❌ **Bad (cache misses on code change):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .              # Changes often
RUN npm install       # Reinstalls every time!
CMD ["node", "server.js"]
```

✅ **Good (cache hits):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./    # Changes rarely
RUN npm install          # Cached!
COPY . .                 # Changes often
CMD ["node", "server.js"]
```

**Order matters:**
1. Instructions that change less → first
2. Instructions that change more → last

### 2. Minimize Layers

Each `RUN`, `COPY`, `ADD` creates a layer.

❌ **Bad (many layers):**
```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean
```

✅ **Good (one layer):**
```dockerfile
RUN apt-get update && \
    apt-get install -y \
      curl \
      git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Use .containerignore

Exclude files from build context (like `.gitignore`).

**.containerignore:**
```
node_modules
.git
.env
*.log
.DS_Store
README.md
.vscode
```

**Reduces:**
- Build context size
- Build time
- Image size

### 4. Optimize Base Image

```dockerfile
# ❌ Large (1.1 GB)
FROM node:18

# ✅ Smaller (150 MB)
FROM node:18-slim

# ✅ Smallest (120 MB)
FROM node:18-alpine

# ✅ Minimal (< 10 MB + app)
FROM scratch
COPY --from=builder /app/binary /binary
CMD ["/binary"]
```

### 5. Remove Build Dependencies

```dockerfile
RUN apk add --no-cache --virtual .build-deps \
        gcc \
        g++ \
        make && \
    npm install && \
    apk del .build-deps
```

### 6. Combine Commands

```dockerfile
# Instead of multiple COPY
COPY package.json .
COPY package-lock.json .
COPY src/ ./src/

# Do this
COPY package*.json ./
COPY src/ ./src/
```

---

## 🔒 Security Best Practices

### 1. Don't Run as Root

❌ **Bad:**
```dockerfile
FROM node:18-alpine
COPY . /app
CMD ["node", "server.js"]
# Runs as root!
```

✅ **Good:**
```dockerfile
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs . .
USER nodejs
CMD ["node", "server.js"]
```

### 2. Use Specific Versions

❌ **Bad:**
```dockerfile
FROM node:latest
```

✅ **Good:**
```dockerfile
FROM node:18.17.0-alpine3.18
```

### 3. Scan for Vulnerabilities

```bash
# Scan image
podman scan myapp

# Or use Trivy
trivy image myapp
```

### 4. Minimize Attack Surface

```dockerfile
# Only install what you need
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*
```

### 5. Don't Store Secrets

❌ **Never:**
```dockerfile
ENV API_KEY=secret123
COPY .env /app/
```

✅ **Instead:**
```bash
# Pass at runtime
podman run -e API_KEY=secret123 myapp

# Or use secrets
podman secret create api_key ./key.txt
podman run --secret api_key myapp
```

### 6. Use Read-Only Filesystem

```bash
podman run --read-only myapp
```

---

## 💡 Real-World Examples

### Example 1: Node.js Express API

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "server.js"]
```

### Example 2: Python Flask API

```dockerfile
# Build stage
FROM python:3.11-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY --chown=appuser:appuser . .
USER appuser
ENV PATH="/opt/venv/bin:$PATH"
EXPOSE 5000
HEALTHCHECK CMD curl --fail http://localhost:5000/health || exit 1
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Example 3: React Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🎯 Summary

### Best Practices Checklist

✅ Use specific base image versions  
✅ Order instructions by change frequency  
✅ Combine RUN commands to reduce layers  
✅ Use multi-stage builds  
✅ Create .containerignore file  
✅ Run as non-root user  
✅ Use HEALTHCHECK  
✅ Don't store secrets in image  
✅ Keep images small  
✅ Scan for vulnerabilities  

---

**Next**: [Podman Compose Guide →](./04-podman-compose.md)
