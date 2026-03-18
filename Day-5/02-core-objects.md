# 🧩 Kubernetes Core Objects

## 📚 Table of Contents
- [Introduction](#introduction)
- [Pods](#pods)
- [ReplicaSets](#replicasets)
- [Deployments](#deployments)
- [Services](#services)
- [ConfigMaps](#configmaps)
- [Secrets](#secrets)
- [Namespaces](#namespaces)

---

## 🎯 Introduction

Kubernetes uses **objects** to represent the state of your cluster. Think of them as **building blocks**:

```
Pod         → Single container or group of containers
ReplicaSet  → Maintains multiple pod replicas
Deployment  → Manages ReplicaSets with updates/rollbacks
Service     → Network access to pods
ConfigMap   → Non-sensitive configuration
Secret      → Sensitive data (passwords, tokens)
Namespace   → Virtual cluster for isolation
```

**Important:** All objects are defined in **YAML files** using a declarative approach.

---

## 🎁 Pods

### What is a Pod?

A **Pod** is the **smallest deployable unit** in Kubernetes. It represents **one or more containers** that share:
- Network namespace (same IP address)
- Storage volumes
- Lifecycle (start/stop together)

### Single-Container Pod (Most Common)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-container
    image: nginx:1.24
    ports:
    - containerPort: 80
```

**Breakdown:**
- `apiVersion: v1` – API version for Pods
- `kind: Pod` – Object type
- `metadata` – Name and labels (key-value pairs for identification)
- `spec` – Desired state
  - `containers` – List of containers in this pod
  - `image` – Container image to use
  - `containerPort` – Port the container listens on

**Create the pod:**
```bash
kubectl apply -f nginx-pod.yaml
```

**Check status:**
```bash
kubectl get pods
# NAME        READY   STATUS    RESTARTS   AGE
# nginx-pod   1/1     Running   0          10s
```

### Multi-Container Pod (Sidecar Pattern)

Sometimes you need multiple containers in one pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-with-logger
spec:
  containers:
  # Main application
  - name: app
    image: my-app:v1
    ports:
    - containerPort: 8080
    volumeMounts:
    - name: logs
      mountPath: /var/log
  
  # Sidecar: Log collector
  - name: log-collector
    image: fluentd:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log
  
  volumes:
  - name: logs
    emptyDir: {}
```

**Use Cases for Multi-Container Pods:**
- **Logging sidecar** – Collects logs from main container
- **Proxy sidecar** – Handles network communication
- **Config watcher** – Reloads config when changed

### Pod Lifecycle

```
Pending → ContainerCreating → Running → Succeeded/Failed
```

**States:**
1. **Pending** – Scheduled but not started yet
2. **ContainerCreating** – Pulling image, creating container
3. **Running** – At least one container is running
4. **Succeeded** – All containers completed successfully
5. **Failed** – At least one container failed
6. **CrashLoopBackOff** – Container repeatedly crashing

**Check pod details:**
```bash
kubectl describe pod nginx-pod
```

### Pod with Resource Requests/Limits

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
  containers:
  - name: app
    image: nginx
    resources:
      requests:
        memory: "64Mi"  # Minimum needed
        cpu: "250m"     # 0.25 CPU cores
      limits:
        memory: "128Mi" # Maximum allowed
        cpu: "500m"     # 0.5 CPU cores
```

**Requests vs Limits:**
- **Requests** – Guaranteed resources (used for scheduling)
- **Limits** – Maximum resources (pod killed if exceeded)

### Pod with Environment Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-pod
spec:
  containers:
  - name: app
    image: node-backend:v1
    env:
    - name: DB_HOST
      value: "postgres.default.svc.cluster.local"
    - name: DB_PORT
      value: "5432"
    - name: NODE_ENV
      value: "production"
```

---

## 🔄 ReplicaSets

### What is a ReplicaSet?

A **ReplicaSet** ensures a specified number of pod replicas are running at all times.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicaset
spec:
  replicas: 3  # Desired number of pods
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

**Key Sections:**
- `replicas: 3` – Run 3 pods
- `selector` – How to identify pods to manage (matches labels)
- `template` – Pod specification (same as Pod YAML)

**Create ReplicaSet:**
```bash
kubectl apply -f nginx-replicaset.yaml
```

**Check pods:**
```bash
kubectl get pods
# NAME                     READY   STATUS    RESTARTS   AGE
# nginx-replicaset-abc12   1/1     Running   0          5s
# nginx-replicaset-def34   1/1     Running   0          5s
# nginx-replicaset-ghi56   1/1     Running   0          5s
```

### Self-Healing in Action

**Delete one pod:**
```bash
kubectl delete pod nginx-replicaset-abc12
```

**Immediately check:**
```bash
kubectl get pods
# NAME                     READY   STATUS              RESTARTS   AGE
# nginx-replicaset-def34   1/1     Running             0          2m
# nginx-replicaset-ghi56   1/1     Running             0          2m
# nginx-replicaset-jkl78   0/1     ContainerCreating   0          1s  ← NEW!
```

ReplicaSet detected 2 pods (desired: 3) and **automatically created a new one**!

### Scaling ReplicaSets

**Scale up:**
```bash
kubectl scale replicaset nginx-replicaset --replicas=5
```

**Check:**
```bash
kubectl get replicaset
# NAME               DESIRED   CURRENT   READY   AGE
# nginx-replicaset   5         5         5       5m
```

---

## 🚀 Deployments

### What is a Deployment?

A **Deployment** is a higher-level object that manages ReplicaSets and provides:
- **Declarative updates** – Change image version, rollout gradually
- **Rollback** – Revert to previous version if issues
- **Scaling** – Adjust replicas easily

**Hierarchy:**
```
Deployment
    ↓
ReplicaSet (version 1)
    ↓
Pods (replicas)
```

### Basic Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: backend:v1
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

**Create deployment:**
```bash
kubectl apply -f backend-deployment.yaml
```

**Check deployment:**
```bash
kubectl get deployments
# NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
# backend-deployment   3/3     3            3           30s

kubectl get replicasets
# NAME                           DESIRED   CURRENT   READY   AGE
# backend-deployment-6d4b8c7f9   3         3         3       30s

kubectl get pods
# NAME                                 READY   STATUS    RESTARTS   AGE
# backend-deployment-6d4b8c7f9-abc12   1/1     Running   0          30s
# backend-deployment-6d4b8c7f9-def34   1/1     Running   0          30s
# backend-deployment-6d4b8c7f9-ghi56   1/1     Running   0          30s
```

### Rolling Update (Zero Downtime)

**Update image version:**
```bash
kubectl set image deployment/backend-deployment backend=backend:v2
```

**What happens internally:**
```
Step 1: [v1] [v1] [v1]          ← 3 pods running v1
Step 2: [v1] [v1] [v1] [v2]     ← Start 1 v2 pod
Step 3: [v1] [v1] [v2] [v2]     ← Terminate 1 v1, add 1 v2
Step 4: [v1] [v2] [v2] [v2]     ← Gradual transition
Step 5: [v2] [v2] [v2]          ← All running v2
```

**Watch rollout:**
```bash
kubectl rollout status deployment/backend-deployment
# Waiting for deployment "backend-deployment" rollout to finish: 1 out of 3 new replicas have been updated...
# deployment "backend-deployment" successfully rolled out
```

### Rollback

**If v2 has bugs:**
```bash
kubectl rollout undo deployment/backend-deployment
```

**Rollback to specific version:**
```bash
kubectl rollout history deployment/backend-deployment
# REVISION  CHANGE-CAUSE
# 1         <none>
# 2         Image updated to v2
# 3         Image updated to v3

kubectl rollout undo deployment/backend-deployment --to-revision=1
```

### Deployment Strategies

#### 1. RollingUpdate (Default)

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Max extra pods during update
      maxUnavailable: 0  # Min available pods
```

**Example with 3 replicas:**
- `maxSurge: 1` → Can have 4 pods temporarily
- `maxUnavailable: 0` → Always have 3 pods running

#### 2. Recreate (Downtime)

```yaml
spec:
  strategy:
    type: Recreate
```

**Process:**
1. Delete all old pods
2. Wait for deletion
3. Create new pods

**Use case:** Database migrations requiring downtime.

### Complete Deployment with Best Practices

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-app
  labels:
    app: production-app
spec:
  replicas: 5
  selector:
    matchLabels:
      app: production-app
  template:
    metadata:
      labels:
        app: production-app
    spec:
      containers:
      - name: app
        image: myapp:v2.1.0
        ports:
        - containerPort: 8080
        
        # Resource management
        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        
        # Health checks
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
        
        # Environment variables
        env:
        - name: DB_HOST
          value: "postgres-service"
        - name: CACHE_HOST
          value: "redis-service"
```

**Health Checks:**
- **Liveness Probe** – Is container alive? (Restart if fails)
- **Readiness Probe** – Is container ready for traffic? (Remove from service if fails)

---

## 🌐 Services

### What is a Service?

A **Service** provides a **stable network endpoint** for accessing pods. Why needed?
- Pod IPs change when pods restart
- Multiple pod replicas need load balancing
- Pods need DNS names for discovery

### Types of Services

#### 1. ClusterIP (Default) – Internal Access Only

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80          # Service port
    targetPort: 3000  # Container port
```

**How it works:**
```
[Frontend Pod] → backend-service:80 → [Backend Pod 1:3000]
                                   → [Backend Pod 2:3000]
                                   → [Backend Pod 3:3000]
```

**Accessible via:**
- `backend-service` (within same namespace)
- `backend-service.default.svc.cluster.local` (FQDN)
- Service IP: `kubectl get svc` shows ClusterIP

**Use case:** Internal microservices communication.

#### 2. NodePort – External Access via Node IP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
    nodePort: 30080  # External port (30000-32767)
```

**How it works:**
```
External User → http://<node-ip>:30080
                         ↓
                [Frontend Pods]
```

**Access:**
```bash
# Get node IP
kubectl get nodes -o wide

# Access app
curl http://<node-ip>:30080
```

**Use case:** Development, testing (not for production).

#### 3. LoadBalancer – Cloud Load Balancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

**How it works (on cloud providers):**
```
Internet
   ↓
[Cloud Load Balancer] ← External IP (e.g., 203.0.113.50)
   ↓
[NodePort Service]
   ↓
[Pods across nodes]
```

**Check external IP:**
```bash
kubectl get svc app-loadbalancer
# NAME               TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)
# app-loadbalancer   LoadBalancer   10.0.45.12    203.0.113.50    80:31234/TCP
```

**Access:**
```bash
curl http://203.0.113.50
```

**Use case:** Production apps needing public access.

**Note:** Works on AWS (ELB), GCP (Cloud Load Balancer), Azure (Load Balancer). On Minikube, use `minikube tunnel`.

### Service Discovery

**Pods can discover services via DNS:**

```yaml
# Backend pod config
env:
- name: DATABASE_URL
  value: "postgres://postgres-service:5432/mydb"
- name: REDIS_URL
  value: "redis://redis-service:6379"
```

Kubernetes DNS automatically resolves `<service-name>` to the service IP.

### Service with Multiple Ports

```yaml
apiVersion: v1
kind: Service
metadata:
  name: multi-port-service
spec:
  selector:
    app: my-app
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 8080
  - name: https
    protocol: TCP
    port: 443
    targetPort: 8443
  - name: metrics
    protocol: TCP
    port: 9090
    targetPort: 9090
```

---

## ⚙️ ConfigMaps

### What is a ConfigMap?

A **ConfigMap** stores **non-sensitive configuration data** as key-value pairs.

**Use cases:**
- Application configuration
- Command-line arguments
- Environment variables
- Config files

### Creating ConfigMaps

#### Method 1: From Literal Values

```bash
kubectl create configmap app-config \
  --from-literal=database_host=postgres.default.svc.cluster.local \
  --from-literal=database_port=5432 \
  --from-literal=log_level=info
```

#### Method 2: From File

```bash
# config.properties
database_host=postgres.default.svc.cluster.local
database_port=5432
log_level=info

kubectl create configmap app-config --from-file=config.properties
```

#### Method 3: From YAML

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_host: "postgres.default.svc.cluster.local"
  database_port: "5432"
  log_level: "info"
  app.properties: |
    server.port=8080
    server.timeout=30
    cache.enabled=true
```

**Apply:**
```bash
kubectl apply -f configmap.yaml
```

### Using ConfigMaps in Pods

#### Option 1: Environment Variables

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

**Result:** All ConfigMap keys become env variables.

#### Option 2: Specific Environment Variables

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:v1
    env:
    - name: DB_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_host
    - name: DB_PORT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_port
```

#### Option 3: Volume Mount (Config File)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:v1
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

**Result:**
```
/etc/config/database_host  (contains: postgres.default.svc.cluster.local)
/etc/config/database_port  (contains: 5432)
/etc/config/log_level      (contains: info)
```

### ConfigMap Example: Redis Configuration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
data:
  redis.conf: |
    maxmemory 256mb
    maxmemory-policy allkeys-lru
    save 900 1
    save 300 10
---
apiVersion: v1
kind: Pod
metadata:
  name: redis
spec:
  containers:
  - name: redis
    image: redis:7
    command:
      - redis-server
      - /etc/redis/redis.conf
    volumeMounts:
    - name: config
      mountPath: /etc/redis
  volumes:
  - name: config
    configMap:
      name: redis-config
```

---

## 🔐 Secrets

### What is a Secret?

A **Secret** stores **sensitive data** (passwords, tokens, keys) in base64-encoded format.

**Difference from ConfigMap:**
- ConfigMap → Non-sensitive config
- Secret → Sensitive data (encrypted at rest in etcd)

### Creating Secrets

#### Method 1: From Literal

```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=SuperSecret123
```

#### Method 2: From File

```bash
echo -n 'admin' > username.txt
echo -n 'SuperSecret123' > password.txt

kubectl create secret generic db-secret \
  --from-file=username=username.txt \
  --from-file=password=password.txt
```

#### Method 3: From YAML (Base64 Encoded)

```bash
# Encode values
echo -n 'admin' | base64
# YWRtaW4=

echo -n 'SuperSecret123' | base64
# U3VwZXJTZWNyZXQxMjM=
```

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=                # base64 encoded
  password: U3VwZXJTZWNyZXQxMjM=    # base64 encoded
```

**Apply:**
```bash
kubectl apply -f secret.yaml
```

### Using Secrets in Pods

#### Option 1: Environment Variables

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

#### Option 2: Volume Mount

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:v1
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
```

**Result:**
```
/etc/secrets/username  (contains: admin)
/etc/secrets/password  (contains: SuperSecret123)
```

**Read in app:**
```javascript
const fs = require('fs');
const username = fs.readFileSync('/etc/secrets/username', 'utf8');
const password = fs.readFileSync('/etc/secrets/password', 'utf8');
```

### Secret Types

```yaml
# Generic (default)
type: Opaque

# Docker registry credentials
type: kubernetes.io/dockerconfigjson

# TLS certificates
type: kubernetes.io/tls

# SSH authentication
type: kubernetes.io/ssh-auth
```

### Docker Registry Secret

```bash
kubectl create secret docker-registry regcred \
  --docker-server=docker.io \
  --docker-username=myusername \
  --docker-password=mypassword \
  --docker-email=my@email.com
```

**Use in pod:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: private-image-pod
spec:
  containers:
  - name: app
    image: myusername/private-repo:v1
  imagePullSecrets:
  - name: regcred
```

---

## 🏷️ Namespaces

### What is a Namespace?

A **Namespace** provides **virtual clusters** within a physical cluster for resource isolation.

**Default namespaces:**
```bash
kubectl get namespaces
# NAME              STATUS   AGE
# default           Active   10d  ← Your apps go here by default
# kube-system       Active   10d  ← Kubernetes system components
# kube-public       Active   10d  ← Public resources
# kube-node-lease   Active   10d  ← Node heartbeat data
```

### Creating Namespaces

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: development
---
apiVersion: v1
kind: Namespace
metadata:
  name: production
```

**Apply:**
```bash
kubectl apply -f namespaces.yaml
```

**Or via command:**
```bash
kubectl create namespace staging
```

### Using Namespaces

**Deploy to specific namespace:**
```bash
kubectl apply -f deployment.yaml --namespace=development
```

**Or specify in YAML:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: development  # ← Deploy to development namespace
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: backend:dev
```

**List resources in namespace:**
```bash
kubectl get pods --namespace=development
kubectl get all --namespace=production
```

**Set default namespace:**
```bash
kubectl config set-context --current --namespace=development
```

### Cross-Namespace Communication

**Service DNS format:**
```
<service-name>.<namespace>.svc.cluster.local
```

**Example:**
```yaml
# Frontend in "production" namespace calling backend in "development" namespace
env:
- name: BACKEND_URL
  value: "http://backend-service.development.svc.cluster.local:3000"
```

---

## 🎓 Summary

| Object | Purpose | Example Use Case |
|--------|---------|------------------|
| **Pod** | Run containers | Single nginx instance |
| **ReplicaSet** | Maintain pod replicas | Ensure 3 pods always running |
| **Deployment** | Manage ReplicaSets with updates | Deploy app v2 with rollback capability |
| **Service** | Network access to pods | Load balance traffic across 5 backend pods |
| **ConfigMap** | Non-sensitive config | Database host, port, log level |
| **Secret** | Sensitive data | Database password, API keys |
| **Namespace** | Resource isolation | Separate dev/staging/production |

---

## 🚀 What's Next?

Now you understand Kubernetes objects. Let's learn **kubectl commands** to interact with them!

**Next:** `03-kubectl-hands-on.md`

---

**Practice Exercise:**

Create a complete app stack:
1. **ConfigMap** with database config
2. **Secret** with database password
3. **Deployment** for Node.js backend (3 replicas)
4. **Service** to expose backend
5. **Namespace** called "todo-app"

(We'll implement this in the hands-on guide!)
