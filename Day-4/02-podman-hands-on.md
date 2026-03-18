# 2️⃣ Podman Hands-On Commands

**Duration**: 2.5 hours  
**Mode**: Hands-on Practice

---

## 📌 Table of Contents

1. [Essential Podman Commands](#essential-podman-commands)
2. [Working with Images](#working-with-images)
3. [Running Containers](#running-containers)
4. [Managing Containers](#managing-containers)
5. [Debugging Containers](#debugging-containers)
6. [Volumes & Persistent Data](#volumes--persistent-data)
7. [Networking](#networking)
8. [Pods](#pods)
9. [Cleanup & Maintenance](#cleanup--maintenance)

---

## 🚀 Essential Podman Commands

### Quick Reference

```bash
# Images
podman search nginx                 # Search for images
podman pull nginx                   # Download image
podman images                       # List local images
podman rmi nginx                    # Remove image

# Containers
podman run nginx                    # Run container
podman ps                           # List running containers
podman ps -a                        # List all containers
podman stop <container>             # Stop container
podman rm <container>               # Remove container

# Debugging
podman logs <container>             # View logs
podman exec -it <container> bash    # Interactive shell
podman inspect <container>          # Detailed info

# System
podman info                         # System information
podman version                      # Podman version
```

---

## 🖼️ Working with Images

### 1. Search for Images

```bash
# Search Docker Hub
podman search nginx

# Limit results
podman search nginx --limit 5

# Filter by stars
podman search nginx --filter stars=100
```

**Output:**
```
NAME                      DESCRIPTION                       STARS
docker.io/library/nginx   Official build of Nginx.          19000
docker.io/bitnami/nginx   Bitnami Nginx Docker Image        150
```

### 2. Pull Images

```bash
# Pull latest version
podman pull nginx

# Pull specific version
podman pull nginx:1.25

# Pull from specific registry
podman pull quay.io/nginx/nginx

# Pull multi-architecture image
podman pull --platform linux/arm64 nginx
```

### 3. List Images

```bash
# List all images
podman images

# List with specific format
podman images --format "{{.Repository}}:{{.Tag}}"

# List image IDs only
podman images -q

# Filter images
podman images --filter "dangling=true"
```

**Example output:**
```
REPOSITORY              TAG      IMAGE ID       CREATED       SIZE
docker.io/library/nginx latest   605c77e624dd   2 weeks ago   141 MB
docker.io/library/redis 7-alpine 7614ae9453d1   3 weeks ago   29.2 MB
```

### 4. Inspect Images

```bash
# View image details
podman inspect nginx

# Get specific field
podman inspect nginx --format '{{.Architecture}}'

# View image history
podman history nginx
```

### 5. Tag Images

```bash
# Tag image
podman tag nginx myregistry.com/nginx:v1.0

# Multiple tags
podman tag nginx:latest nginx:stable
```

### 6. Remove Images

```bash
# Remove single image
podman rmi nginx

# Remove by ID
podman rmi 605c77e624dd

# Force remove (even if containers exist)
podman rmi -f nginx

# Remove all unused images
podman image prune

# Remove all images
podman rmi $(podman images -q)
```

---

## 🏃 Running Containers

### Basic Run

```bash
# Run container (foreground)
podman run nginx

# Run container (background/detached)
podman run -d nginx

# Run with custom name
podman run -d --name my-nginx nginx

# Run with interactive terminal
podman run -it ubuntu bash
```

### Port Mapping

```bash
# Map port 8080 on host to 80 in container
podman run -d -p 8080:80 nginx

# Map to specific host IP
podman run -d -p 127.0.0.1:8080:80 nginx

# Map multiple ports
podman run -d -p 8080:80 -p 8443:443 nginx

# Map random port (high port number)
podman run -d -P nginx

# Check port mapping
podman port my-nginx
```

**Test it:**
```bash
curl http://localhost:8080
```

### Environment Variables

```bash
# Set single variable
podman run -d -e MYSQL_ROOT_PASSWORD=secret mysql

# Set multiple variables
podman run -d \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=pass \
  mysql

# Load from file
podman run -d --env-file ./env.list nginx
```

**env.list:**
```
NODE_ENV=production
API_KEY=your_key_here
DEBUG=false
```

### Resource Limits

```bash
# Limit memory
podman run -d --memory=512m nginx

# Limit CPU
podman run -d --cpus=1.5 nginx

# Combined limits
podman run -d \
  --memory=1g \
  --cpus=2 \
  --memory-swap=2g \
  nginx
```

### Auto-restart Policies

```bash
# Always restart
podman run -d --restart=always nginx

# Restart on failure
podman run -d --restart=on-failure nginx

# Restart with max retries
podman run -d --restart=on-failure:5 nginx

# Never restart (default)
podman run -d --restart=no nginx
```

### Complete Example

```bash
podman run -d \
  --name my-app \
  -p 8080:80 \
  -e NODE_ENV=production \
  -e API_URL=https://api.example.com \
  --memory=512m \
  --cpus=1 \
  --restart=always \
  nginx
```

---

## 🔧 Managing Containers

### List Containers

```bash
# Running containers
podman ps

# All containers (including stopped)
podman ps -a

# Last created container
podman ps -l

# Custom format
podman ps --format "{{.ID}}\t{{.Names}}\t{{.Status}}"

# Filter containers
podman ps --filter "status=running"
podman ps --filter "name=nginx"
```

### Start/Stop/Restart

```bash
# Stop container
podman stop my-nginx

# Stop with timeout
podman stop -t 30 my-nginx

# Start container
podman start my-nginx

# Restart container
podman restart my-nginx

# Pause container
podman pause my-nginx

# Unpause container
podman unpause my-nginx

# Kill container (force stop)
podman kill my-nginx
```

### Remove Containers

```bash
# Remove stopped container
podman rm my-nginx

# Force remove running container
podman rm -f my-nginx

# Remove multiple containers
podman rm container1 container2 container3

# Remove all stopped containers
podman container prune

# Remove all containers (stopped and running)
podman rm -f $(podman ps -aq)
```

---

## 🐛 Debugging Containers

### View Logs

```bash
# View logs
podman logs my-nginx

# Follow logs (real-time)
podman logs -f my-nginx

# Last 100 lines
podman logs --tail 100 my-nginx

# Logs with timestamps
podman logs -t my-nginx

# Logs since specific time
podman logs --since 2024-01-01T10:00:00 my-nginx
podman logs --since 1h my-nginx
```

### Execute Commands

```bash
# Interactive bash shell
podman exec -it my-nginx bash

# Run single command
podman exec my-nginx ls /etc

# Run as specific user
podman exec -u root my-nginx whoami

# Set working directory
podman exec -w /app my-nginx pwd

# Set environment variable
podman exec -e DEBUG=true my-nginx printenv
```

**Common debugging commands:**
```bash
# Check running processes
podman exec my-nginx ps aux

# Check network
podman exec my-nginx netstat -tuln

# Check disk space
podman exec my-nginx df -h

# View file content
podman exec my-nginx cat /etc/nginx/nginx.conf
```

### Inspect Containers

```bash
# Full container details
podman inspect my-nginx

# Get IP address
podman inspect my-nginx --format '{{.NetworkSettings.IPAddress}}'

# Get all environment variables
podman inspect my-nginx --format '{{.Config.Env}}'

# Get mounted volumes
podman inspect my-nginx --format '{{.Mounts}}'

# Get container state
podman inspect my-nginx --format '{{.State.Status}}'
```

### Container Stats

```bash
# Real-time stats for all containers
podman stats

# Stats for specific container
podman stats my-nginx

# One-time stats (no stream)
podman stats --no-stream
```

**Output:**
```
CONTAINER  CPU %  MEM USAGE / LIMIT  MEM %  NET I/O      BLOCK I/O
my-nginx   0.5%   50MiB / 512MiB     9.7%   1.2kB/0B     0B/0B
```

### Copy Files

```bash
# Copy from container to host
podman cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf

# Copy from host to container
podman cp ./index.html my-nginx:/usr/share/nginx/html/

# Copy entire directory
podman cp ./config/ my-nginx:/etc/myapp/
```

---

## 💾 Volumes & Persistent Data

### Why Volumes?

Containers are **ephemeral** - data is lost when container is removed!

**Problem:**
```bash
podman run -d --name db postgres
# Add data to database
podman rm -f db
# Data is gone! 😢
```

**Solution: Volumes!**

### Named Volumes

```bash
# Create volume
podman volume create mydata

# List volumes
podman volume ls

# Inspect volume
podman volume inspect mydata

# Use volume in container
podman run -d \
  --name db \
  -v mydata:/var/lib/postgresql/data \
  postgres

# Data persists even after container removal!
podman rm -f db
podman run -d --name db2 -v mydata:/var/lib/postgresql/data postgres
# Data is still there! ✅
```

### Bind Mounts

Mount a **host directory** into container:

```bash
# Mount host directory
podman run -d \
  --name web \
  -v /Users/me/website:/usr/share/nginx/html:ro \
  nginx

# Read-write mount (default)
podman run -d \
  -v /Users/me/logs:/var/log/nginx \
  nginx

# With SELinux label (Linux only)
podman run -d \
  -v /Users/me/data:/data:z \
  nginx
```

**Options:**
- `:ro` - Read-only
- `:rw` - Read-write (default)
- `:z` - Private SELinux label
- `:Z` - Shared SELinux label

### Tmpfs Mounts

Temporary filesystem in memory (fast, but not persistent):

```bash
podman run -d \
  --tmpfs /tmp:rw,size=100m \
  nginx
```

### Volume Management

```bash
# List volumes
podman volume ls

# Remove volume
podman volume rm mydata

# Remove unused volumes
podman volume prune

# Remove all volumes
podman volume rm $(podman volume ls -q)
```

### Example: PostgreSQL with Volume

```bash
# Create volume
podman volume create postgres-data

# Run PostgreSQL
podman run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=mydb \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres

# Data persists across container restarts!
```

---

## 🌐 Networking

### Network Types

1. **bridge** - Default, isolated network
2. **host** - Share host's network
3. **none** - No network

### List Networks

```bash
# List all networks
podman network ls

# Inspect network
podman network inspect podman
```

### Create Custom Network

```bash
# Create network
podman network create mynetwork

# Create with subnet
podman network create \
  --subnet 10.10.0.0/16 \
  --gateway 10.10.0.1 \
  mynetwork

# Create with driver
podman network create \
  --driver bridge \
  mynetwork
```

### Connect Containers

```bash
# Run containers on same network
podman run -d --name db --network mynetwork postgres
podman run -d --name app --network mynetwork myapp

# Containers can talk to each other using names!
# app can connect to: postgresql://db:5432
```

**Example: Multi-tier Application**

```bash
# Create network
podman network create app-network

# Database
podman run -d \
  --name database \
  --network app-network \
  -e POSTGRES_PASSWORD=secret \
  postgres

# Backend API
podman run -d \
  --name backend \
  --network app-network \
  -e DATABASE_URL=postgresql://database:5432 \
  mybackend

# Frontend
podman run -d \
  --name frontend \
  --network app-network \
  -p 8080:80 \
  myfrontend

# frontend → backend → database (all by hostname!)
```

### Network Management

```bash
# Connect container to network
podman network connect mynetwork my-container

# Disconnect from network
podman network disconnect mynetwork my-container

# Remove network
podman network rm mynetwork

# Remove unused networks
podman network prune
```

---

## 🏷️ Pods

**Pods** are unique to Podman! Group of containers sharing network/IPC.

### Why Pods?

- Containers in pod share **same IP address**
- Can communicate via **localhost**
- Kubernetes-compatible concept

### Create Pod

```bash
# Create pod
podman pod create --name mypod

# Create pod with port mapping
podman pod create --name mypod -p 8080:80

# List pods
podman pod ls

# Inspect pod
podman pod inspect mypod
```

### Add Containers to Pod

```bash
# Create pod
podman pod create --name webapp -p 8080:80

# Add nginx container
podman run -d --pod webapp nginx

# Add redis container
podman run -d --pod webapp redis

# Both containers share same network!
# nginx can access redis at localhost:6379
```

### Manage Pods

```bash
# Start pod (starts all containers)
podman pod start webapp

# Stop pod (stops all containers)
podman pod stop webapp

# Restart pod
podman pod restart webapp

# Remove pod
podman pod rm webapp

# Remove pod and all containers
podman pod rm -f webapp
```

### Example: Complete Application Pod

```bash
# Create pod
podman pod create \
  --name myapp \
  -p 8080:80 \
  -p 3000:3000

# Database
podman run -d \
  --pod myapp \
  --name db \
  -e POSTGRES_PASSWORD=secret \
  postgres

# Backend API
podman run -d \
  --pod myapp \
  --name api \
  -e DATABASE_URL=postgresql://localhost:5432 \
  myapi

# Frontend
podman run -d \
  --pod myapp \
  --name web \
  nginx

# All accessible:
# http://localhost:8080 → nginx
# http://localhost:3000 → API
# API connects to DB via localhost:5432
```

---

## 🧹 Cleanup & Maintenance

### Remove Everything

```bash
# Stop all containers
podman stop $(podman ps -q)

# Remove all containers
podman rm $(podman ps -aq)

# Remove all images
podman rmi $(podman images -q)

# Remove all volumes
podman volume rm $(podman volume ls -q)

# Remove all networks
podman network rm $(podman network ls -q)
```

### System Prune

```bash
# Remove all unused data
podman system prune

# Remove including volumes
podman system prune --volumes

# Remove everything (force)
podman system prune -af --volumes
```

### Check Disk Usage

```bash
# Show disk usage
podman system df

# Detailed view
podman system df -v
```

**Output:**
```
TYPE            TOTAL   ACTIVE  SIZE      RECLAIMABLE
Images          10      5       2.5GB     1.2GB (48%)
Containers      15      3       500MB     200MB (40%)
Local Volumes   5       2       1GB       500MB (50%)
```

---

## 🎯 Practical Exercises

### Exercise 1: Run Web Server

```bash
# 1. Pull nginx image
podman pull nginx

# 2. Run container with port mapping
podman run -d --name my-web -p 8080:80 nginx

# 3. Test it
curl http://localhost:8080

# 4. View logs
podman logs my-web

# 5. Check running containers
podman ps

# 6. Stop and remove
podman stop my-web
podman rm my-web
```

### Exercise 2: Persistent Database

```bash
# 1. Create volume
podman volume create postgres-data

# 2. Run PostgreSQL
podman run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=mysecret \
  -e POSTGRES_DB=testdb \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres

# 3. Connect and create data
podman exec -it postgres psql -U postgres -d testdb
# CREATE TABLE users (id INT, name TEXT);
# INSERT INTO users VALUES (1, 'Alice');
# \q

# 4. Remove container
podman rm -f postgres

# 5. Run new container with same volume
podman run -d \
  --name postgres2 \
  -e POSTGRES_PASSWORD=mysecret \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres

# 6. Data is still there!
podman exec -it postgres2 psql -U postgres -d testdb -c "SELECT * FROM users;"
```

### Exercise 3: Multi-Container Network

```bash
# 1. Create network
podman network create app-net

# 2. Run Redis
podman run -d --name redis --network app-net redis

# 3. Run app that connects to Redis
podman run -d \
  --name app \
  --network app-net \
  -p 8080:8080 \
  -e REDIS_URL=redis://redis:6379 \
  myapp

# App can access Redis via hostname "redis"
```

---

## 🎓 Summary

### Commands Learned

**Images:**
- `podman search`, `pull`, `images`, `rmi`, `tag`, `inspect`

**Containers:**
- `podman run`, `ps`, `stop`, `start`, `restart`, `rm`

**Debugging:**
- `podman logs`, `exec`, `inspect`, `stats`, `cp`

**Data:**
- `podman volume create`, `ls`, `rm`, `prune`

**Networking:**
- `podman network create`, `ls`, `connect`, `disconnect`

**Pods:**
- `podman pod create`, `ls`, `start`, `stop`, `rm`

**Cleanup:**
- `podman system prune`, `system df`

---

**Next**: [Containerfile Best Practices →](./03-containerfile-guide.md)
