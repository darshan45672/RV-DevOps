# 🚀 5-Day DevOps Workshop

Welcome to the **5-Day DevOps Workshop**! This comprehensive program will take you from DevOps fundamentals to practical implementation of CI/CD pipelines, containerization with Docker, and orchestration with Kubernetes.

---

## 📚 Workshop Overview

This intensive workshop provides hands-on experience with essential DevOps tools and practices:

- 🎯 **DevOps Theory & Culture** - Master principles, lifecycle, and best practices
- 🔧 **Git & GitHub** - Version control, branching strategies, and collaboration workflows
- 💻 **Linux & Shell Scripting** - Command-line proficiency and automation scripts
- 🚀 **CI/CD Pipelines** - Automated testing, building, and deployment with GitHub Actions
- 🐳 **Docker** - Containerization, Dockerfile creation, multi-container applications with Docker Compose
- ☸️ **Kubernetes** - Container orchestration, deployments, services, and cluster management

### What You'll Build

By the end of this workshop, you'll have:
- ✅ A complete CI/CD pipeline deploying containerized applications
- ✅ Dockerized microservices with proper networking
- ✅ Kubernetes deployments running in a cluster
- ✅ Production-ready infrastructure as code
- ✅ Automated testing and deployment workflows

---

## 📅 Daily Agenda

### [🟢 Day 1 – DevOps Foundations + Linux + Git Basics](./Day-1/)
**Duration**: Full day (8 hours)

#### Morning Session (3 hours)
- ✅ DevOps theory and fundamentals
- ✅ DevOps lifecycle (Plan → Monitor)
- ✅ CI/CD concepts
- ✅ Infrastructure as Code introduction
- ✅ Agile + DevOps relationship

#### Afternoon Session (5 hours)
- ✅ Linux file system navigation
- ✅ Essential shell commands
- ✅ File permissions (chmod, chown)
- ✅ Environment variables
- ✅ Basic bash scripting
- ✅ Git core commands (init, add, commit, push, pull)
- ✅ Git branching and merging
- ✅ Git best practices

**📖 Materials:**
- [DevOps Theory](./Day-1/01-devops-theory.md)
- [Linux Basics](./Day-1/02-linux-basics.md)
- [Git Hands-On](./Day-1/03-git-hands-on.md)

---

### [🟡 Day 2 – Advanced Git + GitHub Workflows](./Day-2/)
**Duration**: Full day (8 hours)

#### Morning Session (4 hours)
- ✅ Advanced Git techniques (merge vs rebase)
- ✅ Resolving merge conflicts effectively
- ✅ Git stash for context switching
- ✅ Cherry-pick specific commits
- ✅ Reset vs Revert strategies
- ✅ Version tagging with semantic versioning

#### Afternoon Session (4 hours)
- ✅ Pull Requests best practices
- ✅ Code review guidelines and process
- ✅ Forking model and workflows
- ✅ GitHub Issues and Projects
- ✅ Branching strategies (Git Flow vs GitHub Flow)
- ✅ Mini Project: Build Todo API with complete workflow

**📖 Materials:**
- [Advanced Git Techniques](./Day-2/01-advanced-git.md)
- [GitHub Deep Dive](./Day-2/02-github-deep-dive.md)
- [Mini Project - Todo API](./Day-2/03-mini-project.md)

**🎯 Hands-On Projects:**
- Complete Todo API (Node.js or Python)
- Practice feature branch workflow
- Create and review pull requests
- Tag releases with semantic versioning

---

### [🟠 Day 3 – CI/CD Pipelines with GitHub Actions](./Day-3/)
**Duration**: Full day (8 hours)

#### Morning Session (3.5 hours)
- ✅ CI/CD theory and fundamentals
- ✅ Pipeline stages: Code → Build → Test → Package → Deploy
- ✅ Artifacts and rollback strategies
- ✅ Deployment strategies (Blue-Green, Canary, Rolling)
- ✅ GitHub Actions introduction
- ✅ Workflow YAML syntax and structure

#### Afternoon Session (4.5 hours)
- ✅ GitHub Actions deep dive (jobs, steps, runners)
- ✅ Actions Marketplace and reusable workflows
- ✅ Secrets and environment variables
- ✅ Artifacts and caching for speed
- ✅ Matrix builds across multiple versions
- ✅ Pipeline best practices (fail fast, security scanning)
- ✅ Optimization for GitHub Actions free tier

**📖 Materials:**
- [CI/CD Theory & Fundamentals](./Day-3/01-cicd-theory.md)
- [GitHub Actions Deep Dive](./Day-3/02-github-actions.md)
- [Pipeline Best Practices](./Day-3/03-pipeline-best-practices.md)
- [Practical CI/CD Project](./Day-3/04-cicd-project.md)

**🎯 Hands-On Project:**
- Complete CI/CD pipeline for web application
- Automated testing (unit, integration, E2E)
- Multi-stage deployment (staging → production)
- Docker containerization with GitHub Actions
- Automated rollback on failure
- Security scanning and code quality checks

**💡 Free Tier Optimization:**
- 2,000 minutes/month for private repos
- Unlimited minutes for public repos
- Caching strategies to reduce build time by 90%
- Path filtering to avoid unnecessary runs

---

### [🔵 Day 4 – Podman Deep Dive](./Day-4/)
**Duration**: Full day (8 hours)

#### Morning Session (4 hours)
- ✅ Containerization fundamentals
- ✅ VM vs Container comparison
- ✅ Podman architecture (daemonless & rootless)
- ✅ Podman vs Docker differences
- ✅ Images, containers, volumes, networks, pods
- ✅ Essential Podman commands
- ✅ Working with containers and images

#### Afternoon Session (4 hours)
- ✅ Containerfile syntax and best practices
- ✅ Multi-stage builds for optimization
- ✅ Security hardening (rootless, non-root users)
- ✅ Podman Compose for multi-container apps
- ✅ Networking and volume management
- ✅ Complete full-stack project

**📖 Materials:**
- [Podman Theory & Fundamentals](./Day-4/01-podman-theory.md)
- [Podman Hands-On Commands](./Day-4/02-podman-hands-on.md)
- [Containerfile Best Practices](./Day-4/03-containerfile-guide.md)
- [Podman Compose Guide](./Day-4/04-podman-compose.md)
- [Practical Podman Project](./Day-4/05-podman-project.md)

**🎯 Hands-On Project:**
- Full-stack Todo application
- Frontend (React) + Backend (Node.js) + Database (PostgreSQL) + Cache (Redis)
- Multi-stage Containerfiles for optimization
- Podman Compose orchestration
- Production-ready setup with health checks
- Persistent data with volumes
- Network segmentation (frontend/backend)

**🔒 Security Focus:**
- Daemonless architecture (no single point of failure)
- Rootless containers (run without root privileges)
- Non-root users in containers
- Security scanning and best practices
- SELinux and seccomp integration

---

### [🟣 Day 5 – Basic Kubernetes](./Day-5/)
**Duration**: Full day (8 hours)

#### Morning Session (4 hours)
- ✅ Container orchestration fundamentals
- ✅ Why Kubernetes? (scaling, self-healing, automation)
- ✅ Kubernetes architecture (control plane + worker nodes)
- ✅ etcd, API server, scheduler, controller-manager
- ✅ Kubelet, kube-proxy, container runtime
- ✅ Declarative model and reconciliation loop
- ✅ Core objects: Pods, Deployments, ReplicaSets
- ✅ Services (ClusterIP, NodePort, LoadBalancer)
- ✅ ConfigMaps and Secrets

#### Afternoon Session (4 hours)
- ✅ Install kubectl and Minikube
- ✅ Start Minikube with Podman driver
- ✅ Essential kubectl commands (get, apply, describe, logs)
- ✅ Create and manage pods
- ✅ Deploy applications with Deployments
- ✅ Expose services with ClusterIP and NodePort
- ✅ Debug pods and troubleshoot issues
- ✅ Complete deployment project: Podman → Kubernetes

**📖 Materials:**
- [Kubernetes Theory](./Day-5/01-kubernetes-theory.md)
- [Core Kubernetes Objects](./Day-5/02-core-objects.md)
- [kubectl Hands-On Guide](./Day-5/03-kubectl-hands-on.md)
- [Deploy to Kubernetes Project](./Day-5/04-deploy-to-k8s.md)

**🎯 Hands-On Project:**
- Deploy Day 4 Todo app to Kubernetes
- Build images with Podman
- Push to Docker Hub/Quay.io
- Create Kubernetes YAML manifests (Deployment, Service, ConfigMap, Secret)
- Deploy multi-tier app (Frontend + Backend + PostgreSQL + Redis)
- Expose with LoadBalancer or NodePort
- Scale deployments (3 → 5 replicas)
- Perform rolling updates and rollbacks
- Troubleshoot common issues

**🔧 Tools Used:**
- **kubectl**: Kubernetes CLI
- **Minikube**: Local Kubernetes cluster
- **Podman**: Container image building (from Day 4)
- **Docker Hub/Quay.io**: Container registry

**🎓 Learning Outcomes:**
- Understand Kubernetes architecture and components
- Master kubectl commands for cluster management
- Deploy and manage multi-tier applications
- Implement high availability with replicas
- Use ConfigMaps and Secrets for configuration
- Troubleshoot pods and services effectively
- Integrate Podman → Kubernetes workflow

---

## 🎯 Learning Objectives

By the end of this 5-day workshop, you will:

### Core Competencies
1. ✅ **Understand DevOps Culture** - Grasp DevOps principles, lifecycle, and shift-left practices
2. ✅ **Master Git & GitHub** - Version control, branching strategies, pull requests, and collaboration
3. ✅ **Linux Proficiency** - Navigate file systems, manage permissions, write bash scripts
4. ✅ **Build CI/CD Pipelines** - Create automated workflows with GitHub Actions
5. ✅ **Containerize Applications** - Write Dockerfiles, build images, use Docker Compose
6. ✅ **Orchestrate with Kubernetes** - Deploy and manage containerized apps in clusters
7. ✅ **Apply Best Practices** - Security, testing, monitoring, and documentation

### Practical Skills
- 🔧 Set up complete DevOps toolchain from scratch
- 🚀 Deploy production-ready applications automatically
- 🐛 Debug and troubleshoot containerized environments
- 📊 Monitor application performance and health
- 🔒 Implement security best practices throughout the pipeline
- 👥 Collaborate effectively in team environments

---

## 🛠️ Prerequisites

### Required Software

Install these tools before the workshop:

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Git** | Version control | [Download](https://git-scm.com/downloads) |
| **Docker Desktop** | Containerization platform | [Download](https://www.docker.com/products/docker-desktop) |
| **Visual Studio Code** | Code editor | [Download](https://code.visualstudio.com/) |
| **kubectl** | Kubernetes CLI | [Install Guide](https://kubernetes.io/docs/tasks/tools/) |
| **Terminal** | Command-line interface | macOS/Linux (built-in), Windows (Git Bash/WSL) |

### VS Code Extensions (Recommended)
- Docker (ms-azuretools.vscode-docker)
- Kubernetes (ms-kubernetes-tools.vscode-kubernetes-tools)
- YAML (redhat.vscode-yaml)
- GitLens (eamodio.gitlens)

### Accounts

Create these accounts (all free):

- 🐙 **GitHub** - [Sign up](https://github.com/join) - For version control and CI/CD
- 🐳 **Docker Hub** - [Sign up](https://hub.docker.com/signup) - For container images (optional)
- ☁️ **Cloud Platform** (optional) - AWS/Azure/GCP free tier for deployment practice

### Knowledge Prerequisites

- ✅ Basic programming knowledge (any language)
- ✅ Familiarity with command line (helpful but not required)
- ✅ Understanding of web applications (frontend/backend concept)
- ✅ Willingness to learn and experiment!

### System Requirements

- **OS**: macOS, Linux, or Windows 10/11
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 20GB free space
- **Internet**: Stable connection for downloads and cloud operations

---

## 📂 Repository Structure

```
RV-DevOps/
├── Day-1/                    # DevOps Foundations + Linux + Git
│   ├── 01-devops-theory.md
│   ├── 02-linux-basics.md
│   ├── 03-git-hands-on.md
│   └── README.md
├── Day-2/                    # Advanced Git + GitHub Workflows
│   ├── 01-advanced-git.md
│   ├── 02-github-deep-dive.md
│   ├── 03-mini-project.md
│   └── README.md
├── Day-3/                    # CI/CD Pipelines with GitHub Actions
│   ├── 01-cicd-theory.md
│   ├── 02-github-actions.md
│   ├── 03-pipeline-best-practices.md
│   ├── 04-cicd-project.md
│   └── README.md
├── Day-4/                    # Podman Containerization
│   ├── 01-podman-theory.md
│   ├── 02-podman-hands-on.md
│   ├── 03-containerfile-guide.md
│   ├── 04-podman-compose.md
│   ├── 05-podman-project.md
│   └── README.md
├── Day-5/                    # Basic Kubernetes
│   ├── 01-kubernetes-theory.md
│   ├── 02-core-objects.md
│   ├── 03-kubectl-hands-on.md
│   ├── 04-deploy-to-k8s.md
│   └── README.md
└── README.md                 # This file
```

---

## 🚀 Getting Started

### 1. Clone This Repository

```bash
git clone https://github.com/darshan45672/RV-DevOps.git
cd RV-DevOps
```

### 2. Start with Day 1

```bash
cd Day-1
cat README.md
```

### 3. Follow Along

Each day has its own folder with detailed materials, exercises, and hands-on labs.

---

## 📖 Additional Resources

### 📚 Books
- [**The Phoenix Project**](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592) - DevOps novel that explains the principles
- [**The DevOps Handbook**](https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002) - Practical implementation guide
- [**Pro Git Book**](https://git-scm.com/book/en/v2) - Complete Git reference (Free)
- [**Docker Deep Dive**](https://www.amazon.com/Docker-Deep-Dive-Nigel-Poulton/dp/1521822808) - Comprehensive Docker guide
- [**Kubernetes Up & Running**](https://www.oreilly.com/library/view/kubernetes-up-and/9781492046523/) - K8s fundamentals

### 🌐 Online Learning Platforms
- [**DevOps Roadmap**](https://roadmap.sh/devops) - Complete learning path
- [**Kubernetes Documentation**](https://kubernetes.io/docs/) - Official K8s docs
- [**Docker Documentation**](https://docs.docker.com/) - Official Docker docs
- [**GitHub Skills**](https://skills.github.com/) - Interactive GitHub tutorials
- [**KillerCoda**](https://killercoda.com/) - Interactive DevOps scenarios

### 🛠️ Tools Documentation
- [**Git Official Docs**](https://git-scm.com/doc) - Git command reference
- [**GitHub Actions**](https://docs.github.com/en/actions) - CI/CD workflows
- [**Docker CLI**](https://docs.docker.com/engine/reference/commandline/cli/) - Docker commands
- [**kubectl Cheat Sheet**](https://kubernetes.io/docs/reference/kubectl/cheatsheet/) - K8s commands
- [**Docker Compose**](https://docs.docker.com/compose/) - Multi-container apps

### 🎓 Interactive Practice
- [**Learn Git Branching**](https://learngitbranching.js.org/) - Visual Git tutorial
- [**Play with Docker**](https://labs.play-with-docker.com/) - Docker playground
- [**Play with Kubernetes**](https://labs.play-with-k8s.com/) - K8s playground
- [**Katacoda**](https://www.katacoda.com/) - Interactive scenarios

### 🎥 Video Tutorials
- [**Docker for Beginners**](https://www.youtube.com/watch?v=fqMOX6JJhGo) - FreeCodeCamp
- [**Kubernetes Tutorial**](https://www.youtube.com/watch?v=X48VuDVv0do) - TechWorld with Nana
- [**GitHub Actions Tutorial**](https://www.youtube.com/watch?v=R8_veQiYBjI) - GitHub official

### 📰 Blogs & Communities
- [**DevOps.com**](https://devops.com/) - DevOps news and articles
- [**CNCF Blog**](https://www.cncf.io/blog/) - Cloud native computing
- [**Docker Blog**](https://www.docker.com/blog/) - Container updates
- [**/r/devops**](https://www.reddit.com/r/devops/) - Reddit community

---

## 👥 Contributing

This workshop is open for improvements! If you find issues or want to add content:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m "Add improvement"`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

This workshop is built upon knowledge and best practices from:

- **Git & GitHub** - Official documentation and community resources
- **Docker** - Docker official documentation and Docker community
- **Kubernetes** - CNCF and Kubernetes official documentation
- **DevOps Community** - Contributions from practitioners worldwide
- **Context7** - Up-to-date technical documentation and code examples
- **Open Source Contributors** - Thousands of developers making DevOps tools better

### Special Thanks
- Linux Foundation for Kubernetes and cloud native technologies
- Docker Inc. for revolutionizing containerization
- GitHub for making collaboration seamless
- The entire DevOps community for sharing knowledge

---

## ❓ FAQ

<details>
<summary><b>Do I need prior DevOps experience?</b></summary>
No! This workshop starts from fundamentals and progressively builds your skills.
</details>

<details>
<summary><b>Can I complete this workshop at my own pace?</b></summary>
Absolutely! All materials are self-paced. The 5-day structure is a suggested timeline.
</details>

<details>
<summary><b>What if I get stuck on an exercise?</b></summary>
Check the documentation links, review the examples, or open an issue in the repository for help.
</details>

<details>
<summary><b>Will I get a certificate?</b></summary>
This is a self-paced learning workshop. Focus on building skills and a portfolio of projects.
</details>

<details>
<summary><b>Can I use this for commercial training?</b></summary>
Yes, this content is open source. Please provide attribution to the original repository.
</details>

---

## 📧 Contact

For questions or feedback:
- **Repository**: [RV-DevOps](https://github.com/darshan45672/RV-DevOps)
- **Issues**: [Create an issue](https://github.com/darshan45672/RV-DevOps/issues)

---

**🎉 Ready to start your DevOps journey? Begin with [Day 1](./Day-1/)!**

---

## 📊 Workshop Statistics

- **Total Duration**: 40 hours (5 days × 8 hours)
- **Hands-On Projects**: 15+ practical exercises
- **Technologies Covered**: 10+ tools and platforms
- **Lines of Code**: 1000+ across examples and projects
- **Real-World Scenarios**: Production-ready implementations

---

## 🌟 Star This Repository

If you find this workshop helpful, please ⭐ star this repository to show your support and help others discover it!

```bash
# Clone and get started today!
git clone https://github.com/darshan45672/RV-DevOps.git
cd RV-DevOps
cat Day-1/README.md
```

**Happy Learning! 🚀**