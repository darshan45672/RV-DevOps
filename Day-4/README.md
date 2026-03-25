# 🐳 Day 4 – Podman Deep Dive

**Duration**: Full day (8 hours)  
**Focus**: Containerization with Podman (Daemonless & Rootless)

---

## 📋 Overview

Day 4 focuses on **Podman**, a modern, secure alternative to Docker. Podman is daemonless, rootless, and fully compatible with Docker commands and images.

### Why Podman?

✅ **Daemonless** - No background daemon required (more secure)  
✅ **Rootless** - Run containers without root privileges  
✅ **Docker-compatible** - Same CLI commands as Docker  
✅ **Pod support** - Native Kubernetes pod concepts  
✅ **No vendor lock-in** - Open-source, OCI-compliant  
✅ **Better security** - No single point of failure  

---

## 🎯 Learning Objectives

By the end of Day 4, you will:

1. ✅ Understand containerization and Podman architecture
2. ✅ Build container images with Containerfiles
3. ✅ Run and manage containers with Podman
4. ✅ Work with volumes and networks
5. ✅ Create multi-container applications with Podman Compose
6. ✅ Implement security best practices
7. ✅ Build production-ready containerized applications

---

## 📚 Session Breakdown

### Morning Session (4 hours)

#### 1️⃣ Podman Theory (1.5 hours)
- What is containerization?
- VM vs Container comparison
- Podman architecture (daemonless design)
- Podman vs Docker differences
- Images, containers, volumes, networks
- Security advantages of Podman

#### 2️⃣ Hands-on Podman (2.5 hours)
- Essential Podman commands
- Building images with `podman build`
- Running containers with `podman run`
- Managing containers (`ps`, `stop`, `rm`)
- Debugging (`exec`, `logs`, `inspect`)
- Working with volumes and networks

### Afternoon Session (4 hours)

#### 3️⃣ Containerfile Deep Dive (1.5 hours)
- Containerfile syntax
- Instructions: FROM, RUN, COPY, WORKDIR, EXPOSE
- CMD vs ENTRYPOINT
- Multi-stage builds for optimization
- Best practices and security

#### 4️⃣ Podman Compose (1 hour)
- Multi-container applications
- Compose file syntax
- Networking between containers
- Volume management
- Service dependencies

#### 5️⃣ Practical Project (1.5 hours)
- Build full-stack application
- Frontend + Backend + Database
- Multi-stage Containerfiles
- Podman Compose orchestration
- Production optimization

---

## 📖 Materials

1. **[Podman Theory & Fundamentals](./01-podman-theory.md)**
   - Containerization basics
   - Podman architecture
   - Podman vs Docker
   - Security advantages

2. **[Podman Hands-On Commands](./02-podman-hands-on.md)**
   - Essential Podman commands
   - Container lifecycle management
   - Volumes and networks
   - Debugging and troubleshooting

3. **[Containerfile Best Practices](./03-containerfile-guide.md)**
   - Containerfile syntax
   - Multi-stage builds
   - Optimization techniques
   - Security hardening

4. **[Podman Compose Guide](./04-podman-compose.md)**
   - Multi-container applications
   - Compose file structure
   - Service orchestration
   - Networking and volumes

5. **[Practical Podman Project](./05-podman-project.md)**
   - Full-stack application
   - Production-ready setup
   - Complete implementation

---

## 🛠️ Prerequisites

### Install Podman

**macOS:**
```bash
brew install podman
podman machine init
podman machine start
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y podman
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install -y podman
```

**Windows:**
```bash
winget install RedHat.Podman
```

**Verify installation:**
```bash
podman --version
podman info
```

### Install Podman Compose

```bash
pip3 install podman-compose
```

---

## 🎯 Hands-On Projects

### Project 1: Simple Web Server
- Containerize a Node.js/Python web app
- Create optimized Containerfile
- Run and test container

### Project 2: Multi-Container Application
- Frontend (React/Vue)
- Backend API (Node.js/Python)
- Database (PostgreSQL/MongoDB)
- Orchestrate with Podman Compose

### Project 3: Production Deployment
- Multi-stage builds
- Security hardening
- Health checks
- Volume persistence

---

## 🔍 Key Differences: Podman vs Docker

| Feature | Podman | Docker |
|---------|--------|--------|
| **Architecture** | Daemonless | Client-server (daemon) |
| **Root Required** | No (rootless by default) | Yes (daemon runs as root) |
| **Security** | More secure (no daemon) | Less secure (daemon is SPOF) |
| **CLI Compatibility** | Docker-compatible | Standard |
| **Pods** | Native support | Requires Kubernetes |
| **systemd Integration** | Built-in | Requires workarounds |
| **OCI Compliance** | Yes | Yes |
| **Alias** | `alias docker=podman` works! | N/A |

---

## 📊 Workshop Flow

```
Theory (1.5h)
    ↓
Basic Commands (1h)
    ↓
Containerfile Practice (1.5h)
    ↓
--- Lunch Break ---
    ↓
Volumes & Networks (1h)
    ↓
Podman Compose (1h)
    ↓
Full Project (1.5h)
    ↓
Q&A + Wrap-up (0.5h)
```

---

## 🎓 Expected Outcomes

By the end of Day 4, you'll have:

✅ Built and run containerized applications  
✅ Created multi-stage Containerfiles  
✅ Managed multi-container apps with Podman Compose  
✅ Implemented container security best practices  
✅ Deployed production-ready containerized services  

---

**Next**: [Day 5 - Kubernetes Basics →](../Day-5/README.md)

**Resources:**
- [Official Podman Documentation](https://docs.podman.io/)
- [Podman GitHub Repository](https://github.com/containers/podman)
- [Podman Tutorials](https://docs.podman.io/en/latest/Tutorials.html)
- [Containerfile vs Dockerfile](https://docs.podman.io/en/latest/markdown/podman-build.1.html)
