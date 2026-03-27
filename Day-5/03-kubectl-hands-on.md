# 🛠️ kubectl Hands-On Guide

## 📚 Table of Contents
- [Introduction](#introduction)
- [Setup: Installing Tools](#setup-installing-tools)
- [Starting Minikube](#starting-minikube)
- [Essential kubectl Commands](#essential-kubectl-commands)
- [Working with Pods](#working-with-pods)
- [Working with Deployments](#working-with-deployments)
- [Working with Services](#working-with-services)
- [ConfigMaps and Secrets](#configmaps-and-secrets)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Practical Exercises](#practical-exercises)

---

## 🎯 Introduction

**kubectl** (Kube Control) is the command-line tool for interacting with Kubernetes clusters. Think of it as your **remote control** for Kubernetes.

**What we'll learn:**
- Install and configure kubectl
- Set up Minikube with Podman driver
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

### 2. Install Minikube

#### macOS
```bash
# Using Homebrew
brew install minikube

# Verify installation
minikube version
```

#### Linux
```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify installation
minikube version
```

#### Windows
```powershell
# Using Chocolatey
choco install minikube

# Verify installation
minikube version
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

## 🚀 Starting Minikube

### Start Minikube with Podman Driver

```bash
# Start Minikube using Podman as container runtime
minikube start --driver=podman --container-runtime=cri-o
```

**What happens:**
1. Downloads Kubernetes images
2. Creates a VM (or container) for the cluster
3. Configures kubectl to use Minikube cluster
4. Starts control plane components

**Expected Output:**
```
😄  minikube v1.32.0 on Darwin 14.1.1
✨  Using the podman driver based on user configuration
👍  Starting control plane node minikube in cluster minikube
🚜  Pulling base image ...
🔥  Creating podman container (CPUs=2, Memory=4096MB) ...
🐳  Preparing Kubernetes v1.28.3 on CRI-O 1.28.2 ...
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

### Verify Cluster Status

```bash
# Check Minikube status
minikube status
```

**Output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### Check kubectl Configuration

```bash
# View current context
kubectl config current-context
# minikube

# View cluster info
kubectl cluster-info
# Kubernetes control plane is running at https://192.168.49.2:8443
# CoreDNS is running at https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

### Access Kubernetes Dashboard (Optional)

```bash
# Enable dashboard addon
minikube addons enable dashboard

# Start dashboard
minikube dashboard
```

Opens browser with Kubernetes dashboard UI!

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
nginx-pod   1/1     Running   0          30s   10.244.0.4   minikube
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

# Get Minikube IP
minikube ip
# 192.168.49.2

# Access service
curl http://192.168.49.2:30080
```

**Or use Minikube service command:**
```bash
minikube service nginx-nodeport
```

### 6. Expose with LoadBalancer (Minikube)

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

# In separate terminal, run tunnel (required for Minikube)
minikube tunnel
```

**Check external IP:**
```bash
kubectl get service nginx-loadbalancer
# NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)
# nginx-loadbalancer   LoadBalancer   10.96.45.123    127.0.0.1        80:31234/TCP
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
  Normal   Scheduled  30s   default-scheduler  Successfully assigned default/nginx-pod to minikube
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

### Exercise 1: Deploy a Simple App

**Create nginx deployment with 3 replicas:**
```bash
kubectl create deployment nginx --image=nginx:1.24 --replicas=3
```

**Expose as NodePort:**
```bash
kubectl expose deployment nginx --type=NodePort --port=80
```

**Access the app:**
```bash
minikube service nginx
```

**Scale to 5 replicas:**
```bash
kubectl scale deployment nginx --replicas=5
kubectl get pods
```

**Update image:**
```bash
kubectl set image deployment/nginx nginx=nginx:1.25
kubectl rollout status deployment/nginx
```

**Rollback:**
```bash
kubectl rollout undo deployment/nginx
```

**Cleanup:**
```bash
kubectl delete deployment nginx
kubectl delete service nginx
```

### Exercise 2: ConfigMap and Secret

**Create ConfigMap:**
```bash
kubectl create configmap app-config \
  --from-literal=LOG_LEVEL=info \
  --from-literal=MAX_CONNECTIONS=100
```

**Create Secret:**
```bash
kubectl create secret generic api-key \
  --from-literal=key=super-secret-api-key-12345
```

**Create pod using both:**
```yaml
# app-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: busybox
    image: busybox
    command: ["/bin/sh", "-c", "env && sleep 3600"]
    envFrom:
    - configMapRef:
        name: app-config
    env:
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: api-key
          key: key
```

```bash
kubectl apply -f app-pod.yaml

# Check environment variables
kubectl logs app-pod
```

**Cleanup:**
```bash
kubectl delete pod app-pod
kubectl delete configmap app-config
kubectl delete secret api-key
```

### Exercise 3: Debug a Broken Pod

**Create broken pod:**
```yaml
# broken-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-pod
spec:
  containers:
  - name: app
    image: nginx:wrong-tag  # Intentional error
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f broken-pod.yaml
```

**Debug:**
```bash
# Check status
kubectl get pods

# Describe pod
kubectl describe pod broken-pod

# Look for error in events
# Fix the YAML (change to nginx:1.24)
kubectl delete pod broken-pod
kubectl apply -f broken-pod.yaml
```

---

## 🎓 kubectl Cheat Sheet

### Basic Commands
```bash
# Cluster info
kubectl cluster-info
kubectl version
kubectl config view

# Contexts
kubectl config get-contexts
kubectl config use-context minikube

# Namespaces
kubectl get namespaces
kubectl create namespace dev
kubectl config set-context --current --namespace=dev
```

### Resource Management
```bash
# Get resources
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get all

# Describe resource
kubectl describe pod <name>

# Delete resource
kubectl delete pod <name>
kubectl delete deployment <name>
kubectl delete -f file.yaml
```

### Logs and Debugging
```bash
# Logs
kubectl logs <pod>
kubectl logs -f <pod>
kubectl logs <pod> -c <container>

# Execute commands
kubectl exec -it <pod> -- bash
kubectl exec <pod> -- ls /app

# Port forwarding
kubectl port-forward pod/<pod> 8080:80
kubectl port-forward service/<svc> 8080:80
```

### Apply Configuration
```bash
# Apply YAML
kubectl apply -f deployment.yaml
kubectl apply -f directory/

# Create from command
kubectl create deployment nginx --image=nginx
kubectl run test --image=busybox -- sleep 3600

# Expose deployment
kubectl expose deployment nginx --port=80 --type=NodePort
```

---

## 🚀 What's Next?

You now have hands-on experience with kubectl! Let's deploy a **real application** to Kubernetes.

**Next:** `04-deploy-to-k8s.md` – Complete deployment project!

---

## 🧹 Cleanup

**Stop Minikube:**
```bash
minikube stop
```

**Delete Minikube cluster:**
```bash
minikube delete
```

**Delete all resources in namespace:**
```bash
kubectl delete all --all
```

---

**Practice more:** Try deploying your Day 4 Todo app to Kubernetes! We'll do this in the next guide.
