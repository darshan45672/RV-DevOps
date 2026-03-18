# 1️⃣ Podman Theory & Fundamentals

**Duration**: 1.5 hours  
**Mode**: Theory + Discussion

---

## 📌 Table of Contents

1. [What is Containerization?](#what-is-containerization)
2. [Virtual Machines vs Containers](#virtual-machines-vs-containers)
3. [What is Podman?](#what-is-podman)
4. [Podman Architecture](#podman-architecture)
5. [Podman vs Docker](#podman-vs-docker)
6. [Core Concepts](#core-concepts)
7. [Security Advantages](#security-advantages)

---

## 🚀 What is Containerization?

### Definition

**Containerization** is a lightweight form of virtualization that packages an application and its dependencies together in an isolated environment called a **container**.

### Why Containerization?

**The Problem:**
```
Developer: "It works on my machine!"
Operations: "Well, it doesn't work in production!"
```

**The Solution: Containers**
```
Package everything together:
- Application code
- Runtime (Node.js, Python, Java)
- Libraries and dependencies
- Configuration files
- Environment variables

Result: Works the same everywhere! ✅
```

### Benefits of Containerization

✅ **Portability** - Run anywhere (laptop, server, cloud)  
✅ **Consistency** - Same environment in dev, staging, prod  
✅ **Isolation** - Each container runs independently  
✅ **Efficiency** - Lightweight, fast startup  
✅ **Scalability** - Easy to scale up/down  
✅ **DevOps friendly** - CI/CD integration  

---

## 🖥️ Virtual Machines vs Containers

### Architecture Comparison

```
┌────────────────────────────────────────────────────────────┐
│                  VIRTUAL MACHINES                          │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│   │   App A     │  │   App B     │  │   App C     │      │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤      │
│   │   Bins/Libs │  │   Bins/Libs │  │   Bins/Libs │      │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤      │
│   │ Guest OS    │  │ Guest OS    │  │ Guest OS    │  ← Each VM has full OS
│   │ (2-4 GB)    │  │ (2-4 GB)    │  │ (2-4 GB)    │      │
│   └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                            │
│   ┌────────────────────────────────────────────────┐      │
│   │          Hypervisor (ESXi, KVM)                │      │
│   └────────────────────────────────────────────────┘      │
│   ┌────────────────────────────────────────────────┐      │
│   │          Host Operating System                 │      │
│   └────────────────────────────────────────────────┘      │
│   ┌────────────────────────────────────────────────┐      │
│   │          Physical Hardware                     │      │
│   └────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘


┌────────────────────────────────────────────────────────────┐
│                     CONTAINERS                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│   │   App A     │  │   App B     │  │   App C     │      │
│   ├─────────────┤  ├─────────────┤  ├─────────────┤      │
│   │   Bins/Libs │  │   Bins/Libs │  │   Bins/Libs │      │
│   └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                            │
│   ┌────────────────────────────────────────────────┐      │
│   │    Container Engine (Podman/Docker)            │      │
│   └────────────────────────────────────────────────┘      │
│   ┌────────────────────────────────────────────────┐      │
│   │          Host Operating System                 │  ← Shared OS
│   └────────────────────────────────────────────────┘      │
│   ┌────────────────────────────────────────────────┐      │
│   │          Physical Hardware                     │      │
│   └────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────┘
```

### Key Differences

| Aspect | Virtual Machines | Containers |
|--------|-----------------|------------|
| **OS** | Full guest OS per VM | Shared host OS kernel |
| **Size** | Gigabytes (2-20 GB) | Megabytes (10-500 MB) |
| **Startup** | Minutes | Seconds or milliseconds |
| **Resource Usage** | Heavy | Lightweight |
| **Isolation** | Strong (hardware-level) | Process-level |
| **Portability** | Less portable | Highly portable |
| **Use Case** | Run different OS | Run applications |

### Example: Running 10 Applications

**Virtual Machines:**
- 10 VMs × 2 GB OS = 20 GB overhead
- 10 VMs × 2 minutes boot = 20 minutes total
- Heavy resource consumption

**Containers:**
- 1 host OS (shared) = 0 GB overhead per app
- 10 containers × 1 second = 10 seconds total
- Minimal resource consumption

---

## 🐳 What is Podman?

### Definition

**Podman** (Pod Manager) is a **daemonless**, **rootless**, **open-source** container engine for developing, managing, and running OCI containers on Linux.

### Key Tagline
> "Podman: A tool for managing OCI containers and pods"

### Podman Origins

- Created by **Red Hat** in 2018
- Part of the **containers** project ecosystem
- Designed to address Docker's security and architectural limitations
- **OCI-compliant** (Open Container Initiative)

### Podman Philosophy

```
"Alias docker=podman"
```

Podman is **drop-in replacement** for Docker with the same CLI commands!

### Core Features

✅ **Daemonless** - No background daemon process  
✅ **Rootless** - Run containers without root privileges  
✅ **Docker-compatible** - Same commands as Docker  
✅ **Pod support** - Native Kubernetes pod concepts  
✅ **Systemd integration** - Native systemd service management  
✅ **OCI-compliant** - Works with standard container images  
✅ **Fork-exec model** - Direct process execution  
✅ **Security-first** - Built with security as priority  

---

## 🏗️ Podman Architecture

### Daemonless Design

**Docker Architecture (Daemon-based):**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  CLI Client                                         │
│      ↓                                              │
│  Docker Daemon (always running as root)             │
│      ↓                                              │
│  containerd                                         │
│      ↓                                              │
│  runc (OCI Runtime)                                 │
│      ↓                                              │
│  Container Processes                                │
│                                                     │
└─────────────────────────────────────────────────────┘

Issues:
❌ Daemon is single point of failure
❌ Daemon runs as root (security risk)
❌ All containers die if daemon crashes
❌ Resource overhead from daemon
```

**Podman Architecture (Daemonless):**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  podman CLI                                         │
│      ↓                                              │
│  fork() + exec() ──────→ conmon (per container)    │
│                              ↓                      │
│                          crun/runc (OCI Runtime)    │
│                              ↓                      │
│                          Container Process          │
│                                                     │
└─────────────────────────────────────────────────────┘

Benefits:
✅ No daemon = No single point of failure
✅ Each container is independent process
✅ Can run rootless (non-root user)
✅ Containers survive even if CLI crashes
✅ Lower resource overhead
```

### Fork-Exec Model

**How Podman runs containers:**

1. **User runs:** `podman run nginx`
2. **Podman forks** a child process
3. **Launches conmon** (container monitor)
4. **conmon calls** OCI runtime (crun/runc)
5. **Runtime creates** container namespace
6. **Container process runs** directly

**No daemon in between!**

### Components

**1. Podman CLI**
- User-facing command-line interface
- Docker-compatible commands
- Manages images, containers, pods

**2. conmon (Container Monitor)**
- One per container
- Monitors container lifecycle
- Handles I/O (logs, stdin/stdout)
- Reports exit codes

**3. OCI Runtime (crun/runc)**
- **crun** - C-based runtime (faster, default for Podman)
- **runc** - Go-based runtime (Docker's default)
- Creates container namespaces
- Sets up cgroups
- Executes container process

**4. Storage Backend**
- Default: **overlay2** filesystem
- Stores images and container layers
- User-specific storage for rootless mode

---

## ⚖️ Podman vs Docker

### Command Compatibility

**99% compatible!** Just alias it:

```bash
alias docker=podman
```

**Example commands:**
```bash
# Docker
docker run -d nginx
docker ps
docker build -t myapp .
docker-compose up

# Podman (same commands!)
podman run -d nginx
podman ps
podman build -t myapp .
podman-compose up
```

### Key Differences

| Feature | Podman | Docker |
|---------|--------|--------|
| **Architecture** | Daemonless (fork-exec) | Daemon-based (client-server) |
| **Root Required** | ❌ No (rootless by default) | ✅ Yes (daemon runs as root) |
| **Security** | 🔒 More secure | ⚠️ Less secure |
| **Single Point of Failure** | ❌ No | ✅ Yes (daemon) |
| **Process Model** | Direct child processes | Daemon manages all containers |
| **Pods** | ✅ Native support | ❌ No (needs Kubernetes) |
| **systemd Integration** | ✅ Built-in | ⚠️ Workarounds needed |
| **Docker Compose** | `podman-compose` | `docker-compose` |
| **Kubernetes YAML** | ✅ `podman play kube` | ❌ No |
| **REST API** | ✅ Optional | ✅ Always on |
| **Default Runtime** | crun (C, faster) | runc (Go) |
| **OCI Compliance** | ✅ Yes | ✅ Yes |
| **License** | Apache 2.0 | Apache 2.0 |
| **Vendor** | Red Hat | Docker Inc. |

### Migration from Docker

**Super easy!** Most Docker commands work as-is:

```bash
# Replace docker with podman
docker run -d -p 8080:80 nginx
podman run -d -p 8080:80 nginx

# Or create alias
alias docker=podman

# Now use docker commands!
docker ps
docker images
docker build -t myapp .
```

**Dockerfile vs Containerfile:**
- Podman accepts both `Dockerfile` and `Containerfile`
- Same syntax, same instructions
- `Containerfile` is more generic name

---

## 🧩 Core Concepts

### 1. Images

**What is an image?**
- Read-only template for creating containers
- Contains application code + dependencies
- Stored in layers (efficient storage)
- Can be shared via registries

**Example:**
```bash
# Pull image from registry
podman pull nginx

# List images
podman images

# Remove image
podman rmi nginx
```

**Image Layers:**
```
┌────────────────────────┐
│  App Code (10 MB)      │  ← Top layer (your app)
├────────────────────────┤
│  Dependencies (50 MB)  │
├────────────────────────┤
│  Runtime (100 MB)      │
├────────────────────────┤
│  Base OS (20 MB)       │  ← Bottom layer
└────────────────────────┘
   Total: 180 MB
   (Layers are shared and cached)
```

### 2. Containers

**What is a container?**
- Running instance of an image
- Isolated process with its own filesystem
- Has its own network, process tree, users
- Temporary (changes lost unless committed)

**Example:**
```bash
# Run container
podman run -d --name web nginx

# List running containers
podman ps

# Stop container
podman stop web

# Remove container
podman rm web
```

**Container Lifecycle:**
```
Created → Running → Paused → Stopped → Removed
   ↑         ↓         ↓         ↓
   └─────────┴─────────┴─────────┘
```

### 3. Volumes

**What are volumes?**
- Persistent storage for containers
- Data survives container deletion
- Can be shared between containers
- Managed by Podman

**Types:**

**Named Volume:**
```bash
podman volume create mydata
podman run -v mydata:/data nginx
```

**Bind Mount:**
```bash
podman run -v /host/path:/container/path nginx
```

**Anonymous Volume:**
```bash
podman run -v /data nginx
```

### 4. Networks

**What are networks?**
- Isolated network environments
- Containers can communicate via network
- Different network drivers available

**Example:**
```bash
# Create network
podman network create mynet

# Run containers on network
podman run -d --name db --network mynet postgres
podman run -d --name app --network mynet myapp

# Containers can talk to each other!
# app can access db via hostname "db"
```

### 5. Pods

**What are pods?** (Unique to Podman!)
- Group of containers that share:
  - Network namespace (same IP)
  - IPC namespace
  - UTS namespace
- Similar to Kubernetes pods

**Example:**
```bash
# Create pod
podman pod create --name mypod -p 8080:80

# Add containers to pod
podman run -d --pod mypod nginx
podman run -d --pod mypod redis

# Both containers share same network
# Accessible on localhost within pod
```

---

## 🔒 Security Advantages

### 1. Rootless Containers

**What is rootless?**
- Run containers as regular user (no sudo needed)
- Container processes owned by your UID
- Enhanced security - even if container is compromised, attacker only has your user privileges

**Docker (Rootful):**
```
User ────> docker CLI
              ↓
         Docker Daemon (runs as root)
              ↓
         Container (root inside = root outside!)
         
Risk: Container escape = Full system access! 🚨
```

**Podman (Rootless):**
```
User ────> podman CLI (no root needed)
              ↓
         Container (mapped to your UID)
         
Container thinks it's root, but actually your user!
Container escape = Limited to your user privileges ✅
```

**User Namespace Mapping:**
```
Inside Container    →    Outside (Host)
─────────────────────────────────────────
root (UID 0)        →    user (UID 1000)
user1 (UID 1)       →    subuid (UID 100001)
user2 (UID 2)       →    subuid (UID 100002)
```

### 2. No Daemon = No Single Point of Failure

**Docker:**
- Daemon crash = All containers stop! 💥
- Daemon vulnerability = All containers at risk
- Daemon upgrade requires stopping all containers

**Podman:**
- Each container is independent process
- Container crash doesn't affect others
- No daemon to hack or crash
- Upgrade Podman without affecting running containers

### 3. SELinux & Seccomp

**Built-in security features:**

**SELinux (Security-Enhanced Linux):**
- Mandatory access control
- Labels on files, processes
- Restricts what containers can do

**Seccomp (Secure Computing Mode):**
- Filters system calls
- Blocks dangerous operations
- Default profile blocks 300+ syscalls

**Example:**
```bash
# Run with security options
podman run --security-opt label=disable nginx  # Disable SELinux
podman run --security-opt seccomp=unconfined nginx  # Disable seccomp
```

### 4. Read-Only Root Filesystem

```bash
# Make container filesystem read-only
podman run --read-only nginx

# Even if compromised, attacker can't modify files!
```

### 5. Capabilities

**Drop dangerous capabilities:**
```bash
# Remove all capabilities except needed ones
podman run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx
```

---

## 🎯 Summary

### What We Learned

1. ✅ **Containerization** - Package app + dependencies together
2. ✅ **VMs vs Containers** - Containers are lightweight and fast
3. ✅ **Podman** - Daemonless, rootless container engine
4. ✅ **Architecture** - Fork-exec model, no daemon
5. ✅ **Podman vs Docker** - 99% compatible, more secure
6. ✅ **Core Concepts** - Images, containers, volumes, networks, pods
7. ✅ **Security** - Rootless, no SPOF, SELinux, seccomp

### Why Choose Podman?

✅ **Security first** - Rootless, daemonless  
✅ **Docker-compatible** - Easy migration  
✅ **Kubernetes-friendly** - Native pod support  
✅ **Production-ready** - Used by Red Hat, IBM, others  
✅ **Open-source** - Community-driven  

---

## 💡 Discussion Questions

1. When would you choose containers over VMs?
2. Why is rootless mode more secure?
3. How does Podman's daemonless architecture improve reliability?
4. What are the benefits of pod support in Podman?
5. Can you run Docker containers in Podman? (Yes!)

---

**Next**: [Podman Hands-On Commands →](./02-podman-hands-on.md)
