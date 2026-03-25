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

## 🐧 Running Linux Distributions in Containers

### Why Run Linux Distros in Containers?

- **Test different environments** without virtual machines
- **Lightweight** - containers share the host kernel
- **Isolated** - perfect for testing and development
- **Quick cleanup** - remove when done

### Popular Linux Distributions

```bash
# Ubuntu - Popular for development
podman run -it ubuntu bash

# Alpine - Smallest Linux (5MB!)
podman run -it alpine sh

# CentOS Stream - Enterprise focused
podman run -it centos bash

# Debian - Stable and reliable
podman run -it debian bash

# Fedora - Cutting edge
podman run -it fedora bash

# Red Hat UBI (Universal Base Image)
podman run -it registry.access.redhat.com/ubi8/ubi bash
```

### Interactive Linux Exploration

Let's explore **Ubuntu** container:

```bash
# Run Ubuntu interactively
podman run -it --name my-ubuntu ubuntu bash

# Inside container, you can do anything:
root@container:/# cat /etc/os-release
root@container:/# uname -a
root@container:/# apt update
root@container:/# apt install -y curl wget git
root@container:/# curl https://api.github.com/users/octocat
root@container:/# exit
```

**Alpine Linux** (super lightweight):

```bash
# Run Alpine Linux
podman run -it --name my-alpine alpine sh

# Inside Alpine:
/# cat /etc/os-release
/# apk update
/# apk add python3 py3-pip
/# python3 --version
/# exit
```

### Persist Changes in Containers

```bash
# Make changes to Ubuntu container
podman run -it --name ubuntu-dev ubuntu bash
root@container:/# apt update && apt install -y python3 nodejs npm git
root@container:/# exit

# Changes are saved! Start the same container:
podman start -ai ubuntu-dev
root@container:/# python3 --version  # Still installed!
root@container:/# node --version     # Still there!
```

### Container vs Host Isolation

```bash
# Check host system
uname -a
cat /etc/os-release

# Run different OS in container
podman run -it alpine sh
/# uname -a        # Same kernel!
/# cat /etc/os-release  # Different OS!
```

---

## 🐍 Running Python in Containers

### Python Container Images

```bash
# Official Python images
podman pull python:3.11        # Full Python with libraries
podman pull python:3.11-slim   # Minimal Python
podman pull python:3.11-alpine # Smallest Python (Alpine-based)

# Check image sizes
podman images | grep python
```

**Image size comparison:**
- `python:3.11` - ~900MB (includes gcc, dev tools)
- `python:3.11-slim` - ~180MB (minimal Debian)
- `python:3.11-alpine` - ~50MB (Alpine Linux)

### Interactive Python Shell

```bash
# Start Python REPL
podman run -it python:3.11 python

>>> print("Hello from container!")
>>> import sys
>>> print(sys.version)
>>> import os
>>> print(os.uname())
>>> exit()
```

### Run Python Commands Directly

```bash
# Execute Python one-liner
podman run --rm python:3.11 python -c "print('Hello World!')"

# Execute Python expression
podman run --rm python:3.11 python -c "import math; print(f'Pi = {math.pi:.4f}')"

# Install packages and use them
podman run --rm python:3.11 sh -c "pip install requests && python -c 'import requests; print(requests.get(\"https://httpbin.org/json\").json())'"
```

### Run Python Scripts from Host

**Create a Python script:**

```bash
# Create a simple script
cat > hello.py << EOF
#!/usr/bin/env python3
import sys
import platform

print("🐍 Python Script Running in Container!")
print(f"Python Version: {sys.version}")
print(f"Platform: {platform.platform()}")
print(f"Architecture: {platform.machine()}")

# Read command line arguments
if len(sys.argv) > 1:
    print(f"Arguments: {sys.argv[1:]}")
EOF
```

**Run script in container:**

```bash
# Mount current directory and run script
podman run --rm -v $(pwd):/app -w /app python:3.11 python hello.py

# Pass arguments to script
podman run --rm -v $(pwd):/app -w /app python:3.11 python hello.py arg1 arg2
```

### Data Science with Python Containers

```bash
# Run Jupyter Notebook
podman run -d \
  --name jupyter \
  -p 8888:8888 \
  -v $(pwd):/home/jovyan/work \
  jupyter/scipy-notebook

# Get the access token
podman logs jupyter | grep token

# Or start with no token (development only!)
podman run -d \
  --name jupyter-dev \
  -p 8888:8888 \
  -e JUPYTER_ENABLE_LAB=yes \
  -e JUPYTER_TOKEN="" \
  -v $(pwd):/home/jovyan/work \
  jupyter/scipy-notebook
```

### Complex Python Application

**Create a web API script:**

```python
# Save as api.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import datetime

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                'message': 'Hello from Python container!',
                'timestamp': datetime.datetime.now().isoformat(),
                'python_version': '3.11'
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8000), APIHandler)
    print("🚀 Server starting on port 8000...")
    server.serve_forever()
```

**Run in container:**

```bash
# Run Python web server
podman run -d \
  --name python-api \
  -p 8000:8000 \
  -v $(pwd):/app \
  -w /app \
  python:3.11 \
  python api.py

# Test it
curl http://localhost:8000
```

### Python with Dependencies

**Create requirements.txt:**

```bash
cat > requirements.txt << EOF
requests==2.31.0
flask==2.3.3
pandas==2.1.0
numpy==1.24.3
EOF
```

**Create Flask app:**

```python
# Save as flask_app.py
from flask import Flask, jsonify
import pandas as pd
import numpy as np
import requests

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': 'Flask app in container!',
        'libraries': {
            'pandas': pd.__version__,
            'numpy': np.__version__
        }
    })

@app.route('/data')
def data():
    # Create sample data
    df = pd.DataFrame({
        'numbers': np.random.randint(1, 100, 10),
        'squares': [x**2 for x in range(10)]
    })
    return jsonify(df.to_dict('records'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

**Run Flask app in container:**

```bash
# Install dependencies and run
podman run -d \
  --name flask-app \
  -p 5000:5000 \
  -v $(pwd):/app \
  -w /app \
  python:3.11 \
  sh -c "pip install -r requirements.txt && python flask_app.py"

# Test endpoints
curl http://localhost:5000/
curl http://localhost:5000/data
```

### Multi-Language Container Environment

```bash
# Run container with Python + Node.js
podman run -it \
  --name poly-dev \
  -v $(pwd):/workspace \
  -w /workspace \
  python:3.11 \
  bash

# Inside container:
root@container:/workspace# python --version
root@container:/workspace# curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
root@container:/workspace# apt-get install -y nodejs
root@container:/workspace# node --version
root@container:/workspace# npm --version

# Now you have both Python and Node.js!
```

---

## 🎯 Practical Exercises

### Exercise 0: Linux Distribution Tour

```bash
# 1. Try different Linux distributions
podman run -it ubuntu bash
# Inside: apt update && apt install -y neofetch && neofetch

podman run -it alpine sh
# Inside: apk add neofetch && neofetch

podman run -it fedora bash
# Inside: dnf install -y neofetch && neofetch

# Compare the output!
```

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

### Exercise 2: Python Development Environment

```bash
# 1. Create a Python script
cat > calculator.py << EOF
#!/usr/bin/env python3
import sys

def calculator():
    if len(sys.argv) != 4:
        print("Usage: python calculator.py <num1> <operation> <num2>")
        print("Operations: +, -, *, /")
        return
    
    num1 = float(sys.argv[1])
    op = sys.argv[2]
    num2 = float(sys.argv[3])
    
    if op == '+':
        result = num1 + num2
    elif op == '-':
        result = num1 - num2
    elif op == '*':
        result = num1 * num2
    elif op == '/':
        result = num1 / num2 if num2 != 0 else "Error: Division by zero"
    else:
        result = "Error: Invalid operation"
    
    print(f"{num1} {op} {num2} = {result}")

if __name__ == "__main__":
    calculator()
EOF

# 2. Run with different Python versions
podman run --rm -v $(pwd):/app -w /app python:3.9 python calculator.py 10 + 5
podman run --rm -v $(pwd):/app -w /app python:3.11 python calculator.py 10 - 3
podman run --rm -v $(pwd):/app -w /app python:3.12 python calculator.py 10 "*" 4

# 3. Interactive Python development
podman run -it -v $(pwd):/app -w /app python:3.11 bash
# Inside container: python calculator.py 8 / 2
```

### Exercise 3: Data Analysis in Container

```bash
# 1. Create data analysis script
cat > data_analysis.py << EOF
import pandas as pd
import numpy as np
import json

# Generate sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'salary': [50000, 75000, 85000, 60000, 90000],
    'department': ['IT', 'Finance', 'IT', 'HR', 'Finance']
}

df = pd.DataFrame(data)

print("📊 Employee Data Analysis")
print("=" * 30)
print(df)
print(f"\nAverage Salary: ${df['salary'].mean():,.2f}")
print(f"Average Age: {df['age'].mean():.1f} years")
print("\nSalary by Department:")
print(df.groupby('department')['salary'].mean().sort_values(ascending=False))

# Save to JSON
df.to_json('employees.json', orient='records', indent=2)
print("\n✅ Data saved to employees.json")
EOF

# 2. Run data analysis in container
podman run --rm \
  -v $(pwd):/data \
  -w /data \
  python:3.11 \
  sh -c "pip install pandas numpy && python data_analysis.py"

# 3. Check the output file
cat employees.json
```

### Exercise 4: Multi-Service Python App

```bash
# 1. Create a Redis-backed Python app
cat > redis_app.py << EOF
import redis
import json
import time
from datetime import datetime

def main():
    try:
        # Connect to Redis
        r = redis.Redis(host='redis', port=6379, decode_responses=True)
        
        # Test connection
        r.ping()
        print("✅ Connected to Redis!")
        
        # Store some data
        r.set('app:started', datetime.now().isoformat())
        r.set('app:version', '1.0.0')
        
        # Increment counter
        count = r.incr('app:visits')
        
        # Store visit log
        visit_data = {
            'visit_number': count,
            'timestamp': datetime.now().isoformat()
        }
        r.lpush('app:visits_log', json.dumps(visit_data))
        
        print(f"📈 Visit #{count}")
        print(f"🕐 Started: {r.get('app:started')}")
        
        # Show recent visits
        recent_visits = r.lrange('app:visits_log', 0, 4)
        print("\n📝 Recent Visits:")
        for visit in recent_visits:
            data = json.loads(visit)
            print(f"  Visit #{data['visit_number']} at {data['timestamp']}")
            
    except redis.ConnectionError:
        print("❌ Could not connect to Redis")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
EOF

# 2. Create network and run Redis
podman network create python-net
podman run -d --name redis --network python-net redis:alpine

# 3. Run Python app that connects to Redis
podman run --rm \
  --network python-net \
  -v $(pwd):/app \
  -w /app \
  python:3.11 \
  sh -c "pip install redis && python redis_app.py"

# 4. Run it multiple times to see counter increment
podman run --rm --network python-net -v $(pwd):/app -w /app python:3.11 sh -c "pip install redis && python redis_app.py"
podman run --rm --network python-net -v $(pwd):/app -w /app python:3.11 sh -c "pip install redis && python redis_app.py"

# 5. Cleanup
podman stop redis
podman rm redis
podman network rm python-net
```

### Exercise 5: Compare Different Linux Distros

```bash
# 1. System Information Script
cat > sysinfo.py << EOF
#!/usr/bin/env python3
import platform
import subprocess
import sys

print("🐧 System Information")
print("=" * 40)
print(f"OS: {platform.system()}")
print(f"Distribution: {platform.platform()}")
print(f"Architecture: {platform.machine()}")
print(f"Python Version: {platform.python_version()}")

# Try to get package manager info
package_managers = {
    'apt': ['apt', '--version'],
    'yum': ['yum', '--version'],
    'apk': ['apk', '--version'],
    'dnf': ['dnf', '--version']
}

print(f"\n📦 Package Managers:")
for pm, cmd in package_managers.items():
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            version = result.stdout.split('\n')[0]
            print(f"  ✅ {pm}: {version}")
    except:
        print(f"  ❌ {pm}: Not available")

# Memory info
try:
    with open('/proc/meminfo', 'r') as f:
        for line in f:
            if 'MemTotal' in line:
                mem = int(line.split()[1]) // 1024
                print(f"\n💾 Memory: {mem} MB")
                break
except:
    print(f"\n💾 Memory: Unable to detect")
EOF

# 2. Run on different distributions
echo "🔍 Ubuntu Analysis:"
podman run --rm -v $(pwd):/app -w /app python:3.11 python sysinfo.py

echo -e "\n🔍 Alpine Analysis:"
podman run --rm -v $(pwd):/app -w /app python:3.11-alpine python sysinfo.py

echo -e "\n🔍 Slim Analysis:"
podman run --rm -v $(pwd):/app -w /app python:3.11-slim python sysinfo.py

# Compare image sizes
echo -e "\n📊 Image Sizes:"
podman images --format "{{.Repository}}:{{.Tag}}\t{{.Size}}" | grep python
```

---

## 💡 Pro Tips for Container Development

### 1. Container as Development Environment

```bash
# Create a persistent development container
podman run -it \
  --name dev-env \
  -v $(pwd):/workspace \
  -w /workspace \
  -p 8000:8000 \
  -p 5000:5000 \
  python:3.11 \
  bash

# Inside container - install your tools
pip install flask django pandas numpy jupyter
apt update && apt install -y git curl wget vim

# Use it like a VM but lightweight!
```

### 2. Quick Language Testing

```bash
# Test Python versions quickly
for version in 3.8 3.9 3.10 3.11 3.12; do
  echo "Python $version:"
  podman run --rm python:$version python -c "
    import sys
    print(f'  Version: {sys.version}')
    print(f'  Path: {sys.executable}')
  "
done
```

### 3. Container-based Package Testing

```bash
# Test if your code works with different package versions
podman run --rm -v $(pwd):/app -w /app python:3.11 sh -c "
  pip install requests==2.25.1 && python my_app.py
"

podman run --rm -v $(pwd):/app -w /app python:3.11 sh -c "
  pip install requests==2.31.0 && python my_app.py
"
```

### 4. Throwaway Containers

```bash
# Perfect for one-off tasks - automatically removed
podman run --rm -it ubuntu bash
podman run --rm python:3.11 python -c "print('Hello!')"
podman run --rm -v $(pwd):/data alpine tar czf /data/backup.tar.gz /data
```

---

## 🎓 Summary

### What You Learned

**Linux Containers:**
- Run any Linux distribution in seconds
- Isolated environments for testing
- Lightweight compared to VMs
- Perfect for exploring different OSes

**Python Containers:**
- Multiple Python versions available
- Run scripts without installing Python locally
- Test compatibility across versions
- Jupyter notebooks in containers

**Practical Skills:**
- Interactive container sessions
- Volume mounting for persistent data
- Networking between containers
- Development environment setup

### Key Commands Recap

```bash
# Interactive Linux exploration
podman run -it ubuntu bash
podman run -it alpine sh

# Python script execution
podman run --rm -v $(pwd):/app -w /app python:3.11 python script.py

# Development environment
podman run -it -v $(pwd):/workspace python:3.11 bash

# Multi-container apps
podman network create mynet
podman run -d --network mynet redis
podman run --network mynet -v $(pwd):/app python:3.11 python app.py
```

---

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
