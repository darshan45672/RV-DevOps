# ☸️ Day 5 – Basic Kubernetes

**Duration**: Full day (8 hours)  
**Level**: Introductory (Beginner-Friendly)  
**Focus**: Container Orchestration with Kubernetes

---

## 📋 Overview

Day 5 introduces **Kubernetes (K8s)**, the industry-standard container orchestration platform. Learn how to deploy, scale, and manage containerized applications across clusters.

### What is Kubernetes?

**Kubernetes** is an open-source platform for automating deployment, scaling, and management of containerized applications.

**Think of it as:**
- 🎭 **Orchestrator** - Conducts multiple containers like a symphony
- 🏗️ **Manager** - Decides where containers run
- 🔄 **Self-healing** - Automatically restarts failed containers
- 📈 **Scaler** - Automatically scales based on load
- 🌐 **Load Balancer** - Distributes traffic across containers

---

## 🎯 Learning Objectives

By the end of Day 5, you will:

1. ✅ Understand why Kubernetes and container orchestration
2. ✅ Know Kubernetes architecture (control plane, nodes, etcd)
3. ✅ Work with core Kubernetes objects (Pods, Deployments, Services)
4. ✅ Use kubectl to manage clusters
5. ✅ Deploy containerized applications to Kubernetes
6. ✅ Expose applications with Services
7. ✅ Manage configuration with ConfigMaps and Secrets
8. ✅ Scale applications up and down

---

## 📚 Session Breakdown

### Morning Session (4 hours)

#### 1️⃣ Kubernetes Theory (1.5 hours)
- Why Kubernetes? The orchestration problem
- Container orchestration benefits
- Kubernetes architecture:
  - Control Plane (Master)
  - Worker Nodes
  - etcd, API Server, Scheduler, Controller Manager
- How Kubernetes works

#### 2️⃣ Core Kubernetes Objects (2.5 hours)
- Pods - The smallest deployable unit
- Deployments - Declarative updates
- ReplicaSets - Maintain pod replicas
- Services - Stable networking
- ConfigMaps - Configuration data
- Secrets - Sensitive data

### Afternoon Session (4 hours)

#### 3️⃣ Hands-on with kubectl (2 hours)
- Setting up kind with Podman
- Essential kubectl commands
- Creating and managing resources
- Debugging pods and logs
- Scaling applications

#### 4️⃣ Deploy Podman App to Kubernetes (2 hours)
- Build container image with Podman
- Push to registry (Docker Hub/Quay.io)
- Create Deployment YAML
- Create Service YAML
- Access and test application
- Update and rollback deployments

---

## 📖 Materials

1. **[Kubernetes Theory & Architecture](./01-kubernetes-theory.md)**
   - Why Kubernetes
   - Container orchestration
   - Cluster components
   - How K8s works

2. **[Core Kubernetes Objects](./02-core-objects.md)**
   - Pods
   - Deployments
   - ReplicaSets
   - Services
   - ConfigMaps
   - Secrets

3. **[Hands-on with kubectl](./03-kubectl-hands-on.md)**
   - kind with Podman setup
   - Essential kubectl commands
   - Managing resources
   - Debugging and scaling

4. **[Deploy to Kubernetes](./04-deploy-to-k8s.md)**
   - Complete deployment flow
   - YAML manifests
   - Podman build and push
   - Service exposure
   - Real-world examples

---

## 🛠️ Prerequisites

### Install Tools

**1. kubectl (Kubernetes CLI):**
```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify
kubectl version --client
```

**2. kind (Kubernetes in Podman):**
```bash
# macOS
brew install kind

# Linux
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
# For ARM64
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-arm64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Create cluster with Podman
KIND_EXPERIMENTAL_PROVIDER=podman kind create cluster --name kubectl-cluster

# Verify
kubectl cluster-info
kubectl get nodes
```

**3. Podman (Already installed from Day 4):**
```bash
podman --version
```

---

## 🎯 Hands-On Projects

### Project 1: Deploy Simple Web App
- Create Pod manifest
- Deploy Nginx to Kubernetes
- Expose with Service
- Access application

### Project 2: Deploy Full-Stack App
- Deploy Todo app from Day 4
- Create Deployment for backend
- Create Deployment for frontend
- Set up Services
- Configure persistent storage

### Project 3: ConfigMaps and Secrets
- Store configuration in ConfigMaps
- Store passwords in Secrets
- Mount as environment variables
- Mount as files

---

## 🔍 Kubernetes vs Podman

| Aspect | Podman | Kubernetes |
|--------|--------|------------|
| **Scope** | Single machine | Multi-machine cluster |
| **Container Runtime** | Runs containers directly | Orchestrates containers |
| **Scaling** | Manual | Automatic |
| **Self-healing** | No | Yes (restarts failed pods) |
| **Load Balancing** | Manual setup | Built-in Services |
| **Updates** | Manual | Rolling updates |
| **Use Case** | Development, single host | Production, clusters |

**Together:**
- Podman builds images
- Kubernetes runs them at scale

---

## 📊 Workshop Flow

```
Theory (1.5h)
    ↓
Core Objects (2.5h)
    ↓
--- Lunch Break ---
    ↓
kubectl Hands-on (2h)
    ↓
Deploy Project (2h)
    ↓
Q&A + Wrap-up (0.5h)
```

---

## 🎓 Expected Outcomes

By the end of Day 5, you'll have:

✅ Deployed applications to Kubernetes  
✅ Created Deployment and Service manifests  
✅ Scaled applications with kubectl  
✅ Used ConfigMaps and Secrets  
✅ Debugged pods with kubectl logs  
✅ Understood Kubernetes architecture  
✅ Built production-ready deployments  

---

## 🌟 Key Takeaways

1. **Kubernetes** automates container orchestration
2. **Control Plane** manages cluster state
3. **Pods** are the smallest deployable units
4. **Deployments** manage pod replicas
5. **Services** provide stable networking
6. **kubectl** is your primary tool
7. **YAML manifests** define desired state

---

## 🚀 Quick Setup Guide

### Get Started with kubectl and kind

1. **Verify Tools:**
```bash
kubectl version --client
podman version
kind version
```

2. **Create Cluster:**
```bash
KIND_EXPERIMENTAL_PROVIDER=podman kind create cluster --name kubectl-cluster
```

3. **Verify Setup:**
```bash
kubectl cluster-info
kubectl get nodes
kubectl get pods --all-namespaces
```

4. **Start Learning:**
```bash
# Create your first pod
kubectl run nginx --image=nginx:1.24
kubectl get pods
kubectl port-forward pod/nginx 8080:80
```

5. **Clean Up Later:**
```bash
kind delete cluster --name kubectl-cluster
```

---

**Resources:**
- [Official Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Basics Tutorial](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [kind Documentation](https://kind.sigs.k8s.io/)
- [Podman Documentation](https://docs.podman.io/)

---

**Previous**: [Day 4 - Podman Deep Dive ←](../Day-4/README.md)  
**Workshop Complete**: You've finished the 5-Day DevOps Workshop! 🎉
