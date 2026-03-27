# 🛠️ kubectl Hands-On Guide

**Duration**: 3 hours  
**Prerequisites**: Day 4 Podman knowledge  
**Focus**: Production-ready kubectl workflows

## 📚 Table of Contents
- [Introduction](#introduction)
- [Setup: Installing Tools](#setup-installing-tools)
- [Setting up kind with Podman](#setting-up-kind-with-podman)
- [Essential kubectl Commands](#essential-kubectl-commands)
- [kubectl Best Practices](#kubectl-best-practices)
- [Working with Pods](#working-with-pods)
- [Working with Deployments](#working-with-deployments)
- [Working with Services](#working-with-services)
- [ConfigMaps and Secrets](#configmaps-and-secrets)
- [Advanced kubectl Techniques](#advanced-kubectl-techniques)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Real-World kubectl Workflows](#real-world-kubectl-workflows)
- [Practical Exercises](#practical-exercises)

---

## 🎯 Introduction

**kubectl** (Kube Control) is the command-line tool for interacting with Kubernetes clusters. Think of it as your **remote control** for Kubernetes.

**What we'll learn:**
- Install and configure kubectl
- Set up kind with Podman runtime
- Master essential kubectl commands
- Debug and troubleshoot pods
- Complete hands-on exercises

---

## 📦 Setup: Installing Tools

### 1. Install kubectl

#### macOS
```bash
# Using Homebrew
brew install kubectl

# Verify installation
kubectl version --client
```

#### Linux
```bash
# Download latest version
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make executable
chmod +x kubectl

# Move to PATH
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version --client
```

#### Windows
```powershell
# Using Chocolatey
choco install kubernetes-cli

# Verify installation
kubectl version --client
```

**Expected Output:**
```
Client Version: v1.28.0
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
```

### 2. Install kind (Kubernetes in Docker/Podman)

kind is a tool for running local Kubernetes clusters using container "nodes".

#### macOS
```bash
# Using Homebrew
brew install kind

# Verify installation
kind version
```

#### Linux
```bash
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
# For ARM64
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-arm64

# Make executable and install
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Verify installation
kind version
```

#### Windows
```powershell
# Using Chocolatey
choco install kind

# Verify installation
kind version
```

**Expected Output:**
```
kind v0.20.0 go1.20.4 darwin/amd64
```
```

#### Windows
```powershell
# Using Chocolatey
choco install kind

# Verify installation
kind version
```

**Expected Output:**
```
minikube version: v1.32.0
commit: 8220a6eb95f0a4d75f7f2d7b14cef975f050512d
```

### 3. Verify Podman Installation

From Day 4, you should have Podman installed:

```bash
podman --version
# podman version 4.9.0
```

If not installed:
```bash
# macOS
brew install podman
podman machine init
podman machine start

# Linux (Fedora/RHEL)
sudo dnf install podman

# Linux (Ubuntu/Debian)
sudo apt-get install podman
```

---

## 🚀 Setting up kind with Podman

kind can use different container runtimes. We'll configure it to use Podman instead of Docker.

### 1. Verify Podman is Running

```bash
# Check Podman version
podman version

# Ensure Podman socket is available (if needed)
podman system service --time=0 &
```

### 2. Create Kubernetes Cluster with kind

```bash
# Create cluster using Podman as the provider
KIND_EXPERIMENTAL_PROVIDER=podman kind create cluster --name kubectl-cluster
```

**What happens:**
1. Downloads kindest/node image
2. Creates container "nodes" for the cluster
3. Configures kubectl to use kind cluster
4. Starts control plane components

**Expected Output:**
```
Creating cluster "kubectl-cluster" ...
 ✓ Ensuring node image (kindest/node:v1.28.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-kubectl-cluster"
You can now use your cluster with:

kubectl cluster-info --context kind-kubectl-cluster

Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
```

### 3. Verify Cluster Status

```bash
# Check cluster info
kubectl cluster-info

# List nodes
kubectl get nodes

# Check all system pods are running
kubectl get pods --all-namespaces
```

**Expected Output:**
```
NAME                             STATUS   ROLES           AGE   VERSION
kubectl-cluster-control-plane   Ready    control-plane   2m   v1.28.0
```

### 4. Configure kubectl Context

```bash
# View current context
kubectl config current-context
# kind-kubectl-cluster

# View cluster info
kubectl cluster-info
# Kubernetes control plane is running at https://127.0.0.1:xxxxx
# CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

### 5. Access Cluster (Optional)

```bash
# Get cluster endpoint
kubectl cluster-info

# List all contexts
kubectl config get-contexts

# Switch contexts if needed
kubectl config use-context kind-kubectl-cluster
```

---

## ⚡ kubectl Best Practices

### Command Structure Rules

**✅ Correct kubectl syntax:**
```bash
# Verb MUST directly follow kubectl
kubectl get pods
kubectl get pods --all-namespaces
kubectl apply -f deployment.yaml
kubectl delete deployment nginx --namespace=production
```

**❌ Incorrect syntax:**
```bash
# Don't put flags before the verb
kubectl --namespace=default get pods  # WRONG
get pods  # WRONG - missing kubectl

# Don't separate kubectl from verb
kubectl --context=prod apply -f app.yaml  # Can cause issues
```

### Essential kubectl Aliases

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
# Essential kubectl shortcuts
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get services'
alias kgd='kubectl get deployments'
alias kaf='kubectl apply -f'
alias kdel='kubectl delete'
alias klog='kubectl logs'
alias kexec='kubectl exec -it'
alias kdesc='kubectl describe'

# Namespace shortcuts
alias kns='kubectl config set-context --current --namespace'
alias kgns='kubectl get namespaces'

# Quick context switching
alias kctx='kubectl config use-context'
alias kctxs='kubectl config get-contexts'
```

### Output Formats

```bash
# Default table output
kubectl get pods

# Wide format (more columns)
kubectl get pods -o wide

# YAML output
kubectl get pod nginx -o yaml

# JSON output 
kubectl get pod nginx -o json

# Custom columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName

# JSONPath queries
kubectl get pods -o jsonpath='{.items[*].metadata.name}'
```

### Watching Resources

```bash
# Watch pods in real-time
kubectl get pods --watch

# Watch with timestamps
kubectl get pods --watch --timestamps

# Watch specific resource
kubectl get deployment/nginx --watch

# Watch all resources in namespace
kubectl get all --watch
```

---

## 📖 Essential kubectl Commands

### Command Structure

```bash
kubectl [command] [TYPE] [NAME] [flags]
```

**Examples:**
```bash
kubectl get pods                  # List all pods
kubectl describe pod my-pod       # Show pod details
kubectl delete deployment my-app  # Delete deployment
```

### Common Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `get` | List resources | `kubectl get pods` |
| `describe` | Show details | `kubectl describe pod nginx` |
| `create` | Create resource | `kubectl create deployment nginx --image=nginx` |
| `apply` | Apply YAML config | `kubectl apply -f deployment.yaml` |
| `delete` | Delete resource | `kubectl delete pod nginx` |
| `logs` | View container logs | `kubectl logs nginx-pod` |
| `exec` | Execute command in container | `kubectl exec -it nginx-pod -- bash` |
| `port-forward` | Forward port to local | `kubectl port-forward pod/nginx 8080:80` |
| `scale` | Scale replicas | `kubectl scale deployment nginx --replicas=5` |
| `rollout` | Manage rollouts | `kubectl rollout status deployment/nginx` |

---

## 🎁 Working with Pods

### 1. Create a Simple Pod

**Method 1: Imperative (Command)**
```bash
kubectl run nginx-pod --image=nginx:1.24 --port=80
```

**Method 2: Declarative (YAML)**
```yaml
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.24
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f nginx-pod.yaml
```

### 2. List Pods

```bash
# List pods in default namespace
kubectl get pods

# Wide output (shows node, IP)
kubectl get pods -o wide

# Watch pods in real-time
kubectl get pods --watch

# All namespaces
kubectl get pods --all-namespaces
```

**Example Output:**
```
NAME        READY   STATUS    RESTARTS   AGE   IP           NODE       
nginx-pod   1/1     Running   0          30s   10.244.0.4   kubectl-cluster-control-plane
```

### 3. Describe Pod (Detailed Info)

```bash
kubectl describe pod nginx-pod
```

**Output includes:**
- Node assignment
- Labels and annotations
- Container details
- Events (scheduling, pulling image, starting)
- Resource usage

### 4. View Pod Logs

```bash
# Current logs
kubectl logs nginx-pod

# Follow logs (live tail)
kubectl logs -f nginx-pod

# Previous container (if crashed)
kubectl logs nginx-pod --previous

# Specific container in multi-container pod
kubectl logs nginx-pod -c sidecar-container
```

### 5. Execute Commands in Pod

```bash
# Interactive shell
kubectl exec -it nginx-pod -- /bin/bash

# Run single command
kubectl exec nginx-pod -- ls /usr/share/nginx/html

# Run with custom environment
kubectl exec nginx-pod -- env
```

**Inside the pod:**
```bash
root@nginx-pod:/# curl localhost
# <!DOCTYPE html>
# <html>
# <head>
# <title>Welcome to nginx!</title>
```

### 6. Port Forwarding

```bash
# Forward local port 8080 to pod port 80
kubectl port-forward pod/nginx-pod 8080:80
```

**Test:**
```bash
# In another terminal
curl http://localhost:8080
```

### 7. Delete Pod

```bash
kubectl delete pod nginx-pod

# Force delete (immediate)
kubectl delete pod nginx-pod --force --grace-period=0
```

---

## 🚀 Working with Deployments

### 1. Create Deployment

**Method 1: Imperative**
```bash
kubectl create deployment nginx-deployment --image=nginx:1.24 --replicas=3
```

**Method 2: Declarative**
```yaml
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24
        ports:
        - containerPort: 80
```

```bash
kubectl apply -f nginx-deployment.yaml
```

### 2. List Deployments

```bash
kubectl get deployments

# Short form
kubectl get deploy

# Detailed output
kubectl get deployments -o wide
```

**Output:**
```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           2m
```

### 3. View Deployment Details

```bash
kubectl describe deployment nginx-deployment
```

Shows:
- Replica status
- Deployment strategy
- Pod template
- Events (scaling, updates)

### 4. View ReplicaSets

```bash
kubectl get replicasets

# Short form
kubectl get rs
```

**Output:**
```
NAME                         DESIRED   CURRENT   READY   AGE
nginx-deployment-6d4b8c7f9   3         3         3       5m
```

### 5. Scale Deployment

```bash
# Scale to 5 replicas
kubectl scale deployment nginx-deployment --replicas=5

# Verify
kubectl get pods
```

**Output:**
```
NAME                               READY   STATUS    RESTARTS   AGE
nginx-deployment-6d4b8c7f9-abc12   1/1     Running   0          10m
nginx-deployment-6d4b8c7f9-def34   1/1     Running   0          10m
nginx-deployment-6d4b8c7f9-ghi56   1/1     Running   0          10m
nginx-deployment-6d4b8c7f9-jkl78   1/1     Running   0          5s  ← NEW
nginx-deployment-6d4b8c7f9-mno90   1/1     Running   0          5s  ← NEW
```

### 6. Update Deployment (Rolling Update)

```bash
# Update image
kubectl set image deployment/nginx-deployment nginx=nginx:1.25

# Watch rollout
kubectl rollout status deployment/nginx-deployment
```

**Output:**
```
Waiting for deployment "nginx-deployment" rollout to finish: 2 out of 5 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 2 out of 5 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 3 out of 5 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 4 out of 5 new replicas have been updated...
deployment "nginx-deployment" successfully rolled out
```

### 7. Rollback Deployment

```bash
# View rollout history
kubectl rollout history deployment/nginx-deployment
```

**Output:**
```
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

```bash
# Rollback to previous version
kubectl rollout undo deployment/nginx-deployment

# Rollback to specific revision
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

### 8. Pause/Resume Rollout

```bash
# Pause rollout (for multiple changes)
kubectl rollout pause deployment/nginx-deployment

# Make changes
kubectl set image deployment/nginx-deployment nginx=nginx:1.26
kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi

# Resume rollout
kubectl rollout resume deployment/nginx-deployment
```

### 9. Delete Deployment

```bash
kubectl delete deployment nginx-deployment
```

**Note:** This also deletes all ReplicaSets and Pods created by the deployment!

---

## 🌐 Working with Services

### 1. Create Service

**Expose Deployment:**
```bash
kubectl expose deployment nginx-deployment --type=ClusterIP --port=80

# Or specify target port
kubectl expose deployment nginx-deployment --type=NodePort --port=80 --target-port=8080
```

**Declarative:**
```yaml
# nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

```bash
kubectl apply -f nginx-service.yaml
```

### 2. List Services

```bash
kubectl get services

# Short form
kubectl get svc

# With endpoints
kubectl get endpoints
```

**Output:**
```
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
nginx-service   ClusterIP   10.96.123.45    <none>        80/TCP    1m
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP   10d
```

### 3. Describe Service

```bash
kubectl describe service nginx-service
```

Shows:
- Selector (which pods it routes to)
- Endpoints (pod IPs)
- Port configuration

### 4. Test Service (ClusterIP)

**From within cluster:**
```bash
# Create test pod
kubectl run test-pod --image=curlimages/curl --rm -it --restart=Never -- sh

# Inside test pod
curl http://nginx-service
```

**From your machine (port-forward):**
```bash
kubectl port-forward service/nginx-service 8080:80
curl http://localhost:8080
```

### 5. Expose with NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080  # 30000-32767
```

```bash
kubectl apply -f nginx-nodeport.yaml

# Use port-forward to access service locally
kubectl port-forward service/nginx-nodeport 8080:80

# Access service in browser: http://localhost:8080
# Or with curl
curl http://localhost:8080
```

### 6. Expose with LoadBalancer (kind)

**Note:** kind doesn't support LoadBalancer services by default. Use port-forward or NodePort instead.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

```bash
kubectl apply -f nginx-loadbalancer.yaml

# Service will show <pending> for EXTERNAL-IP in kind
kubectl get service nginx-loadbalancer

# Use port-forward to access
kubectl port-forward service/nginx-loadbalancer 8080:80
```

**Check service status:**
```bash
kubectl get service nginx-loadbalancer
# NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)
# nginx-loadbalancer   LoadBalancer   10.96.45.123    <pending>     80:31234/TCP
```

**Access:**
```bash
curl http://127.0.0.1
```

---

## ⚙️ ConfigMaps and Secrets

### ConfigMaps

**Create:**
```bash
# From literal
kubectl create configmap app-config --from-literal=DB_HOST=postgres --from-literal=DB_PORT=5432

# From file
echo "database_url=postgres://localhost:5432/mydb" > config.env
kubectl create configmap app-config --from-file=config.env

# View
kubectl get configmaps
kubectl describe configmap app-config
kubectl get configmap app-config -o yaml
```

**Use in Pod:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:v1
    envFrom:
    - configMapRef:
        name: app-config
```

### Secrets

**Create:**
```bash
# From literal
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123

# From file
echo -n 'admin' > username.txt
echo -n 'secret123' > password.txt
kubectl create secret generic db-secret --from-file=username.txt --from-file=password.txt

# View (values hidden)
kubectl get secrets
kubectl describe secret db-secret

# View decoded
kubectl get secret db-secret -o jsonpath='{.data.username}' | base64 --decode
```

**Use in Pod:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: db-pod
spec:
  containers:
  - name: postgres
    image: postgres:15
    env:
    - name: POSTGRES_USER
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: username
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

---

## 🚀 Advanced kubectl Techniques

### 1. Resource Management with Labels and Selectors

**Label resources during creation:**
```bash
kubectl run nginx --image=nginx --labels="app=nginx,version=v1,env=prod"

# Apply labels to existing resources
kubectl label pod nginx-pod tier=frontend
kubectl label deployment nginx-deployment version=v2 --overwrite

# Remove labels
kubectl label pod nginx-pod tier-
```

**Select by labels:**
```bash
# Get pods with specific labels
kubectl get pods -l app=nginx
kubectl get pods -l 'app=nginx,env=prod'
kubectl get pods -l 'env in (dev,staging)'
kubectl get pods -l 'version!=v1'

# Show labels in output
kubectl get pods --show-labels
```

### 2. Advanced Filtering and Queries

**JSONPath queries:**
```bash
# Get pod names only
kubectl get pods -o jsonpath='{.items[*].metadata.name}'

# Get pod IPs and names
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.podIP}{"\n"}{end}'

# Get image versions
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'

# Complex queries
kubectl get pods -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'
```

**Custom output columns:**
```bash
# Custom table format
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,NODE:.spec.nodeName,IP:.status.podIP

# Sorted output
kubectl get pods --sort-by=.metadata.creationTimestamp

# Age-based sorting
kubectl get pods --sort-by=.status.startTime
```

### 3. Bulk Operations

**Apply multiple resources:**
```bash
# Apply all YAML files in directory
kubectl apply -f ./manifests/

# Apply resources recursively
kubectl apply -f ./manifests/ --recursive

# Apply and record change cause
kubectl apply -f deployment.yaml --record
```

**Bulk delete operations:**
```bash
# Delete all pods with label
kubectl delete pods -l app=nginx

# Delete all resources in namespace
kubectl delete all --all

# Delete multiple resource types
kubectl delete deployments,services,configmaps -l app=myapp
```

### 4. Context and Namespace Management

**Manage contexts:**
```bash
# View available contexts
kubectl config get-contexts

# Switch context
kubectl config use-context kind-kubectl-cluster

# Create new context
kubectl config set-context dev --namespace=development --cluster=kind-kubectl-cluster --user=kind-kubectl-cluster

# Set default namespace for context
kubectl config set-context --current --namespace=kube-system
```

**Namespace shortcuts:**
```bash
# Create namespace
kubectl create namespace development

# Work in specific namespace
kubectl get pods -n kube-system
kubectl get pods --namespace=development

# Set default namespace
kubectl config set-context --current --namespace=development
```

### 5. Resource Patching

**Strategic merge patch:**
```bash
# Add label to deployment
kubectl patch deployment nginx -p '{"metadata":{"labels":{"version":"v2"}}}'

# Update deployment image
kubectl patch deployment nginx -p '{"spec":{"template":{"spec":{"containers":[{"name":"nginx","image":"nginx:1.25"}]}}}}'

# Scale deployment
kubectl patch deployment nginx -p '{"spec":{"replicas":5}}'
```

**JSON merge patch:**
```bash
kubectl patch pod nginx --type='merge' -p='{"spec":{"containers":[{"name":"nginx","image":"nginx:1.25"}]}}'
```

### 6. Resource Monitoring and Events

**Watch resource changes:**
```bash
# Watch pods with output
kubectl get pods -w

# Watch with timestamps
kubectl get pods -w --timestamps

# Watch events in real-time
kubectl get events -w
```

**Event debugging:**
```bash
# Get recent events
kubectl get events --sort-by=.metadata.creationTimestamp

# Events for specific resource
kubectl describe pod nginx-pod | grep -A 10 Events

# All events in namespace
kubectl get events --all-namespaces
```

### 7. Dry Run and Validation

**Test configurations without applying:**
```bash
# Client-side dry run
kubectl apply -f deployment.yaml --dry-run=client

# Server-side dry run (validates against API server)
kubectl apply -f deployment.yaml --dry-run=server

# Validate YAML syntax
kubectl apply -f deployment.yaml --validate=true --dry-run=client
```

**Generate YAML templates:**
```bash
# Generate deployment YAML
kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deployment.yaml

# Generate service YAML
kubectl expose deployment nginx --port=80 --dry-run=client -o yaml > service.yaml

# Generate configmap YAML
kubectl create configmap app-config --from-literal=key=value --dry-run=client -o yaml
```

### 8. Plugin Management

**Install kubectl plugins:**
```bash
# Using krew plugin manager
curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew.tar.gz"
tar zxvf krew.tar.gz
KREW=./krew-"$(uname | tr '[:upper:]' '[:lower:]')_$(uname -m | sed -e 's/x86_64/amd64/' -e 's/arm.*$/arm64/')"
"$KREW" install krew

# Add to PATH
export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

# Install useful plugins
kubectl krew install ctx    # Context switching
kubectl krew install ns     # Namespace switching
kubectl krew install tree   # Resource tree view
kubectl krew install who-can # RBAC analysis
```

**Use plugins:**
```bash
# Quick context switching
kubectl ctx kind-kubectl-cluster

# Quick namespace switching  
kubectl ns kube-system

# View resource relationships
kubectl tree deployment nginx
```

---

## 🛠️ Real-World kubectl Workflows

### 1. Application Deployment Workflow

**Complete app deployment with health checks:**
```bash
# 1. Create namespace
kubectl create namespace myapp

# 2. Create ConfigMap
kubectl create configmap app-config \
  --from-literal=DATABASE_URL=postgres://db:5432/myapp \
  --from-literal=REDIS_URL=redis://redis:6379 \
  -n myapp

# 3. Create Secret
kubectl create secret generic app-secrets \
  --from-literal=API_KEY=supersecret123 \
  --from-literal=DB_PASSWORD=dbpass \
  -n myapp

# 4. Deploy application
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DATABASE_URL
        - name: API_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: API_KEY
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
EOF

# 5. Expose service
kubectl expose deployment myapp --port=80 --target-port=8080 -n myapp

# 6. Monitor deployment
kubectl rollout status deployment/myapp -n myapp
kubectl get pods -l app=myapp -n myapp -w
```

### 2. Troubleshooting Workflow

**Systematic debugging approach:**
```bash
#!/bin/bash
# kubectl-debug-workflow.sh

APP_NAME=$1
NAMESPACE=${2:-default}

echo "🔍 Debugging $APP_NAME in namespace $NAMESPACE"

# 1. Check deployment status
echo "📊 Deployment Status:"
kubectl get deployment $APP_NAME -n $NAMESPACE

# 2. Check replica sets
echo "📋 ReplicaSets:"
kubectl get replicasets -l app=$APP_NAME -n $NAMESPACE

# 3. Check pods
echo "🐋 Pods:"
kubectl get pods -l app=$APP_NAME -n $NAMESPACE -o wide

# 4. Check pod events
echo "📅 Recent Events:"
kubectl get events --field-selector involvedObject.kind=Pod -n $NAMESPACE --sort-by=.metadata.creationTimestamp

# 5. Check logs of failed pods
FAILED_PODS=$(kubectl get pods -l app=$APP_NAME -n $NAMESPACE -o jsonpath='{.items[?(@.status.phase!="Running")].metadata.name}')
for pod in $FAILED_PODS; do
  echo "📄 Logs for failed pod $pod:"
  kubectl logs $pod -n $NAMESPACE --previous 2>/dev/null || kubectl logs $pod -n $NAMESPACE
done

# 6. Check service
echo "🌐 Service:"
kubectl get service -l app=$APP_NAME -n $NAMESPACE

# 7. Check endpoints
echo "🔗 Endpoints:"
kubectl get endpoints -l app=$APP_NAME -n $NAMESPACE
```

### 3. Rolling Update Workflow

**Zero-downtime deployment:**
```bash
# 1. Check current status
kubectl get deployment myapp -o wide

# 2. Update image with change cause annotation
kubectl annotate deployment myapp deployment.kubernetes.io/change-cause="Update to v1.1.0"
kubectl set image deployment/myapp app=myapp:v1.1.0

# 3. Monitor rollout
kubectl rollout status deployment/myapp --timeout=300s

# 4. Verify new pods
kubectl get pods -l app=myapp

# 5. Test application
kubectl port-forward deployment/myapp 8080:8080 &
curl http://localhost:8080/version

# 6. If issues, rollback
if [ $? -ne 0 ]; then
  echo "❌ Update failed, rolling back..."
  kubectl rollout undo deployment/myapp
  kubectl rollout status deployment/myapp
fi
```

### 4. Backup and Migration Workflow

**Resource backup:**
```bash
# Backup entire namespace
kubectl get all -o yaml -n myapp > myapp-backup.yaml

# Backup specific resources
kubectl get deployment myapp -o yaml > myapp-deployment.yaml
kubectl get service myapp -o yaml > myapp-service.yaml
kubectl get configmap app-config -o yaml > app-config.yaml

# Backup with kubectl-backup plugin
kubectl backup create myapp-backup --namespace=myapp
```

**Migration to new cluster:**
```bash
# 1. Export resources
kubectl get deploy,svc,configmap,secret -o yaml -n myapp > migration-bundle.yaml

# 2. Switch context to new cluster
kubectl config use-context new-cluster

# 3. Create namespace
kubectl create namespace myapp

# 4. Apply resources
kubectl apply -f migration-bundle.yaml -n myapp

# 5. Verify migration
kubectl get all -n myapp
```

---

## 🐛 Debugging and Troubleshooting

### 1. Check Pod Status

```bash
# List pods with status
kubectl get pods

# Watch for changes
kubectl get pods --watch
```

**Common Statuses:**
- `Pending` – Waiting to be scheduled
- `ContainerCreating` – Pulling image, creating container
- `Running` – Pod is running
- `CrashLoopBackOff` – Container keeps crashing
- `ImagePullBackOff` – Cannot pull image
- `Error` – Container exited with error

### 2. View Pod Events

```bash
kubectl describe pod <pod-name>
```

Look at **Events** section at the bottom:
```
Events:
  Type     Reason     Age   From               Message
  ----     ------     ----  ----               -------
  Normal   Scheduled  30s   default-scheduler  Successfully assigned default/nginx-pod to kubectl-cluster-control-plane
  Normal   Pulling    29s   kubelet            Pulling image "nginx:1.24"
  Normal   Pulled     25s   kubelet            Successfully pulled image
  Normal   Created    25s   kubelet            Created container nginx
  Normal   Started    24s   kubelet            Started container nginx
```

### 3. View Container Logs

```bash
# Current logs
kubectl logs <pod-name>

# Last 100 lines
kubectl logs <pod-name> --tail=100

# Follow logs
kubectl logs -f <pod-name>

# Previous container (if crashed)
kubectl logs <pod-name> --previous
```

### 4. Debug CrashLoopBackOff

```bash
# Check logs of crashed container
kubectl logs <pod-name> --previous

# Check events
kubectl describe pod <pod-name>

# Try to see what's happening
kubectl get pod <pod-name> -o yaml
```

**Common causes:**
- Missing environment variables
- Application error (check logs)
- Incorrect command/entrypoint
- Health check failures

### 5. Debug ImagePullBackOff

```bash
kubectl describe pod <pod-name>
```

**Common causes:**
- Image doesn't exist
- Typo in image name/tag
- Private registry without credentials
- Network issues

**Fix:**
```bash
# Verify image exists
podman pull nginx:1.24

# For private registry, create secret
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=myuser \
  --docker-password=mypass
```

### 6. Interactive Debugging

```bash
# Shell into running container
kubectl exec -it <pod-name> -- /bin/bash

# If no bash, try sh
kubectl exec -it <pod-name> -- /bin/sh

# Run diagnostics
kubectl exec <pod-name> -- ps aux
kubectl exec <pod-name> -- df -h
kubectl exec <pod-name> -- curl localhost:8080
```

### 7. Check Resource Usage

```bash
# Node resources
kubectl top nodes

# Pod resources
kubectl top pods

# Specific pod
kubectl top pod <pod-name>
```

### 8. View All Resources

```bash
# All resources in namespace
kubectl get all

# Across all namespaces
kubectl get all --all-namespaces

# Specific resource types
kubectl get pods,services,deployments
```

---

## 🎯 Practical Exercises

### Exercise 1: Deploy Your Day 4 Todo App to Kubernetes

**Objective**: Deploy the multi-container Todo app from Day 4 using kubectl and kubectl best practices

**Step 1: Create Dedicated Namespace**
```bash
kubectl create namespace todo-app
kubectl config set-context --current --namespace=todo-app
```

**Step 2: Deploy PostgreSQL with Persistence**
```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  labels:
    app: postgres
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
        tier: database
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_PASSWORD
          value: "secret"
        - name: POSTGRES_DB
          value: "todoapp"
        - name: POSTGRES_USER
          value: "admin"
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: postgres-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  labels:
    app: postgres
spec:
  selector:
    app: postgres
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
```

**Step 3: Deploy Redis Cache**
```yaml
# redis-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    app: redis
    tier: cache
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        tier: cache
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
spec:
  selector:
    app: redis
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
```

**Step 4: Deploy Backend API with Health Checks**
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
  labels:
    app: todo-backend
    tier: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: todo-backend
  template:
    metadata:
      labels:
        app: todo-backend
        tier: backend
    spec:
      containers:
      - name: backend
        image: localhost/rv-devops_backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          value: "postgresql://admin:secret@postgres:5432/todoapp"
        - name: REDIS_URL
          value: "redis://redis:6379"
        - name: LOG_LEVEL
          value: "info"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: todo-backend
  labels:
    app: todo-backend
spec:
  selector:
    app: todo-backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
```

**Step 5: Deploy Frontend with LoadBalancer**
```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
  labels:
    app: todo-frontend
    tier: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-frontend
  template:
    metadata:
      labels:
        app: todo-frontend
        tier: frontend
    spec:
      containers:
      - name: frontend
        image: localhost/rv-devops_frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: todo-frontend
  labels:
    app: todo-frontend
spec:
  type: NodePort
  selector:
    app: todo-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
```

**Deploy everything using kubectl:**
```bash
# Apply all deployments
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Check deployment status
kubectl get all -o wide

# Watch pods come online
kubectl get pods -w

# Check resource usage
kubectl top pods

# Access the application using port-forward
kubectl port-forward service/todo-frontend 8080:80
```

### Exercise 2: Scaling and Load Testing

**Objective**: Test application scaling under load using kubectl

**Step 1: Generate Load**
```bash
# Deploy a load testing pod
kubectl run load-tester --image=busybox --rm -it --restart=Never -- sh

# Inside the pod, install curl and run load test
apk add --no-cache curl
for i in $(seq 1 1000); do
  curl -s http://todo-backend:5000/health > /dev/null
  echo "Request $i completed at $(date)"
  sleep 0.1
done
```

**Step 2: Monitor and Scale with kubectl**
```bash
# In another terminal, watch pods
kubectl get pods -w

# Monitor resource usage
kubectl top pods
kubectl top nodes

# Scale backend based on load
kubectl scale deployment todo-backend --replicas=5

# Verify scaling
kubectl get pods -l app=todo-backend

# Check endpoint distribution
kubectl get endpoints todo-backend
```

**Step 3: Horizontal Pod Autoscaler (HPA)**
```bash
# Install metrics-server for kind
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Patch metrics-server for kind (insecure TLS)
kubectl patch -n kube-system deployment metrics-server --type='json' -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

# Create HPA with kubectl
kubectl autoscale deployment todo-backend --cpu-percent=50 --min=2 --max=10

# Check HPA status
kubectl get hpa
kubectl describe hpa todo-backend

# Generate more load and watch HPA
# (Run load test from Step 1 again)
kubectl get hpa -w
```

### Exercise 3: Configuration Management with kubectl

**Objective**: Manage application configuration using ConfigMaps and Secrets

**Step 1: Create ConfigMap using kubectl**
```bash
kubectl create configmap todo-config \
  --from-literal=LOG_LEVEL=debug \
  --from-literal=MAX_CONNECTIONS=100 \
  --from-literal=CACHE_TTL=3600 \
  --from-literal=SESSION_TIMEOUT=1800

# Verify creation
kubectl get configmap todo-config -o yaml
```

**Step 2: Create Secret using kubectl**
```bash
kubectl create secret generic todo-secrets \
  --from-literal=JWT_SECRET=supersecretkey123 \
  --from-literal=ADMIN_PASSWORD=admin123 \
  --from-literal=DB_ENCRYPTION_KEY=encryptionkey456

# Verify creation (values are base64 encoded)
kubectl get secret todo-secrets -o yaml

# Decode secret values
kubectl get secret todo-secrets -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

**Step 3: Update Backend Deployment with kubectl patch**
```bash
# Add ConfigMap environment variables
kubectl patch deployment todo-backend -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "backend",
            "envFrom": [
              {
                "configMapRef": {
                  "name": "todo-config"
                }
              }
            ]
          }
        ]
      }
    }
  }
}'

# Add Secret environment variables
kubectl patch deployment todo-backend -p '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "backend",
            "env": [
              {
                "name": "JWT_SECRET",
                "valueFrom": {
                  "secretKeyRef": {
                    "name": "todo-secrets",
                    "key": "JWT_SECRET"
                  }
                }
              },
              {
                "name": "ADMIN_PASSWORD",
                "valueFrom": {
                  "secretKeyRef": {
                    "name": "todo-secrets",
                    "key": "ADMIN_PASSWORD"
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }
}'

# Check rollout status
kubectl rollout status deployment/todo-backend

# Verify environment variables
kubectl exec -it deployment/todo-backend -- env | grep -E "(LOG_LEVEL|JWT_SECRET|MAX_CONNECTIONS)"
```

### Exercise 4: Advanced kubectl Debugging

**Objective**: Practice troubleshooting using systematic kubectl approaches

**Step 1: Simulate ImagePullBackOff**
```bash
# Create deployment with invalid image
kubectl create deployment broken-app --image=nonexistent/image:latest

# Debug with kubectl
kubectl get pods -l app=broken-app
kubectl describe pod $(kubectl get pods -l app=broken-app -o jsonpath='{.items[0].metadata.name}')
kubectl get events --field-selector reason=Failed --sort-by=.metadata.creationTimestamp
```

**Step 2: Simulate CrashLoopBackOff**
```yaml
# Create crashing-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: crashing-pod
spec:
  containers:
  - name: app
    image: busybox
    command: ["sh", "-c", "echo 'Starting...' && sleep 5 && exit 1"]
    restartPolicy: Always
```

**Debug with kubectl:**
```bash
kubectl apply -f crashing-pod.yaml

# Monitor crash loop
kubectl get pods crashing-pod -w

# Check logs from current and previous container
kubectl logs crashing-pod
kubectl logs crashing-pod --previous

# Get detailed information
kubectl describe pod crashing-pod

# Check events
kubectl get events --field-selector involvedObject.name=crashing-pod
```

**Step 3: Debug Network Issues**
```bash
# Create a debug pod for network testing
kubectl run debug-pod --image=busybox --rm -it --restart=Never -- sh

# Inside the pod, test connectivity
nslookup todo-backend
nslookup postgres
wget -qO- todo-backend:5000/health
telnet postgres 5432

# Exit and check service endpoints
kubectl get endpoints
kubectl get svc -o wide
```

### Exercise 5: Blue-Green Deployment with kubectl

**Objective**: Implement zero-downtime deployment strategy using kubectl

**Step 1: Deploy Blue Version**
```bash
# Create blue deployment
kubectl create deployment app-blue --image=nginx:1.24
kubectl label deployment app-blue version=blue

# Scale it up
kubectl scale deployment app-blue --replicas=3

# Expose service pointing to blue
kubectl create service clusterip app-service --tcp=80:80
kubectl patch service app-service -p '{"spec":{"selector":{"app":"app-blue","version":"blue"}}}'
```

**Step 2: Deploy Green Version**
```bash
# Create green deployment
kubectl create deployment app-green --image=nginx:1.25
kubectl label deployment app-green version=green
kubectl scale deployment app-green --replicas=3

# Wait for green to be ready
kubectl rollout status deployment/app-green
```

**Step 3: Test Green Version**
```bash
# Port forward to test green version
kubectl port-forward deployment/app-green 8081:80 &

# Test green version
curl http://localhost:8081

# Kill port forward
pkill -f "kubectl port-forward"
```

**Step 4: Switch Traffic with kubectl**
```bash
# Switch service to green
kubectl patch service app-service -p '{"spec":{"selector":{"app":"app-green","version":"green"}}}'

# Verify switch
kubectl get endpoints app-service
kubectl describe service app-service

# Test the switch
kubectl port-forward service/app-service 8080:80 &
curl http://localhost:8080
pkill -f "kubectl port-forward"
```

**Step 5: Cleanup Blue Deployment**
```bash
# Remove blue deployment
kubectl delete deployment app-blue

# Verify only green is running
kubectl get deployments
kubectl get pods
```

### Exercise 6: Resource Management and Monitoring

**Objective**: Monitor and manage resources using kubectl

**Step 1: Create Resource Quotas**
```bash
# Create ResourceQuota using kubectl
kubectl create quota todo-quota \
  --hard=requests.cpu=2,requests.memory=4Gi,limits.cpu=4,limits.memory=8Gi,pods=10 \
  -n todo-app

# Check quota
kubectl describe quota todo-quota -n todo-app
```

**Step 2: Create LimitRange**
```yaml
# limit-range.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: todo-limits
  namespace: todo-app
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container
```

```bash
kubectl apply -f limit-range.yaml
kubectl describe limitrange todo-limits -n todo-app
```

**Step 3: Monitor Resources with kubectl**
```bash
# Check quota usage
kubectl top pods -n todo-app
kubectl top nodes

# Get resource usage details
kubectl get pods -n todo-app -o custom-columns=NAME:.metadata.name,CPU_REQ:.spec.containers[*].resources.requests.cpu,MEM_REQ:.spec.containers[*].resources.requests.memory,CPU_LIM:.spec.containers[*].resources.limits.cpu,MEM_LIM:.spec.containers[*].resources.limits.memory

# Monitor resource usage over time
kubectl get pods -n todo-app -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\t"}{.spec.containers[0].resources.requests.cpu}{"\t"}{.spec.containers[0].resources.requests.memory}{"\n"}{end}'
```

---

## 🎓 Enhanced kubectl Summary

### Skills Mastered in This Guide

**🎯 Core kubectl Operations:**
- ✅ Resource management (create, get, describe, delete, apply)
- ✅ Application deployment and service exposure
- ✅ Scaling and rolling updates with rollback capabilities
- ✅ Configuration management with ConfigMaps and Secrets
- ✅ Log analysis and interactive debugging

**🔧 Advanced kubectl Techniques:**
- ✅ Label-based resource selection and filtering
- ✅ JSONPath queries for custom output formatting
- ✅ Bulk operations and resource patching
- ✅ Context and namespace management
- ✅ Resource monitoring and events analysis
- ✅ Plugin management and workflow automation

**🐛 Production Debugging Skills:**
- ✅ Systematic troubleshooting workflows
- ✅ Health check and probe configuration
- ✅ Network connectivity testing
- ✅ Resource usage analysis and optimization
- ✅ Event correlation and root cause analysis

**🚀 Real-World Deployment Patterns:**
- ✅ Multi-tier application deployment (from Day 4 Todo app)
- ✅ Blue-green deployments for zero-downtime updates
- ✅ Horizontal Pod Autoscaling under load
- ✅ Resource quotas and limits management
- ✅ Configuration injection and secret management

### kubectl Command Mastery

**Essential Daily Commands:**
```bash
# Resource overview
kubectl get pods -o wide --show-labels
kubectl get all -n <namespace>
kubectl top pods && kubectl top nodes

# Debugging workflow
kubectl describe pod <name>
kubectl logs -f <pod> --previous
kubectl exec -it <pod> -- bash

# Application management
kubectl apply -f <file.yaml>
kubectl scale deployment <name> --replicas=5
kubectl rollout status deployment/<name>
kubectl rollout undo deployment/<name>
```

**Advanced Operations:**
```bash
# Custom queries with JSONPath
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'

# Bulk operations
kubectl delete pods --field-selector=status.phase==Failed
kubectl get pods --all-namespaces -l environment=production

# Resource patching
kubectl patch deployment <name> -p '{"spec":{"replicas":3}}'

# Context switching
kubectl config use-context <context>
kubectl config set-context --current --namespace=<ns>
```

### Bridging Day 4 and Day 5 Knowledge

**Container to Kubernetes Journey:**
1. **Day 4**: Learned container fundamentals with Podman
   - Built multi-container applications
   - Managed container networking and volumes
   - Created containerized development environments

2. **Day 5**: Scaled to Kubernetes orchestration
   - Deployed Day 4's Todo app to Kubernetes cluster
   - Implemented production-ready health checks and scaling
   - Applied enterprise patterns like blue-green deployments
   - Managed configuration and secrets at scale

**Key Connections:**
- **Podman containers** → **Kubernetes Pods**
- **Container networking** → **Kubernetes Services**
- **Volume mounts** → **Persistent Volumes**
- **Container orchestration** → **Deployments and ReplicaSets**
- **Development workflow** → **Production deployment patterns**

### Next Steps in Your Kubernetes Journey

**1. Immediate Practice (This Week):**
- Deploy your Day 4 Todo app using the Exercise 1 workflow
- Practice kubectl debugging with the provided scenarios
- Set up kubectl aliases and explore plugin ecosystem
- Experiment with different service types and exposing applications

**2. Intermediate Skills (Next 2-4 Weeks):**
- **Helm**: Learn Kubernetes package management
- **Persistent Volumes**: Implement stateful applications
- **Ingress Controllers**: Advanced traffic routing and SSL
- **StatefulSets**: Deploy databases and stateful services

**3. Advanced Kubernetes (1-3 Months):**
- **Custom Resources (CRDs)**: Extend Kubernetes functionality
- **Operators**: Automated application management
- **Service Mesh (Istio)**: Advanced networking and security
- **Multi-cluster Management**: Scaling across environments

**4. Production Readiness:**
- **Monitoring**: Prometheus, Grafana, and observability
- **Security**: RBAC, Network Policies, Pod Security Standards
- **CI/CD Integration**: GitOps with ArgoCD or Flux
- **Disaster Recovery**: Backup, restore, and migration strategies

### Essential Resources for Continued Learning

**Official Documentation:**
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Reference](https://kubernetes.io/docs/reference/kubectl/)

**Practice Environments:**
- [Kubernetes Playground](https://labs.play-with-k8s.com/)
- [Katacoda Kubernetes Scenarios](https://katacoda.com/courses/kubernetes)

**Community Tools:**
- [kubectl plugins (krew)](https://krew.sigs.k8s.io/)
- [k9s Terminal UI](https://k9scli.io/)
- [lens Kubernetes IDE](https://k8slens.dev/)

### Final kubectl Cheat Sheet

**Quick Reference:**
```bash
# Cluster and context
kubectl cluster-info
kubectl config get-contexts
kubectl config use-context <context>

# Resource management
kubectl get <resource> -o wide --show-labels
kubectl describe <resource> <name>
kubectl delete <resource> <name>

# Application deployment
kubectl apply -f <file.yaml>
kubectl create deployment <name> --image=<image>
kubectl expose deployment <name> --port=<port>

# Scaling and updates
kubectl scale deployment <name> --replicas=<count>
kubectl set image deployment/<name> <container>=<image>
kubectl rollout status/history/undo deployment/<name>

# Debugging and troubleshooting
kubectl logs -f <pod> [--previous]
kubectl exec -it <pod> -- <command>
kubectl port-forward <resource>/<name> <local>:<remote>
kubectl top nodes/pods

# Configuration management
kubectl create configmap <name> --from-literal=<key>=<value>
kubectl create secret generic <name> --from-literal=<key>=<value>
```

**🎉 Congratulations!** You've mastered kubectl and are ready for production Kubernetes operations. The skills you've developed bridge the gap between container development and enterprise orchestration, preparing you for real-world DevOps challenges.

Your journey from Day 4's container fundamentals to Day 5's Kubernetes orchestration represents a significant milestone in modern infrastructure management. Keep practicing these workflows - they form the backbone of cloud-native application deployment and management.
