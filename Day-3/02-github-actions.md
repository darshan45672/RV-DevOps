# 2️⃣ GitHub Actions Deep Dive

**Duration**: 3 hours  
**Mode**: Hands-on + Practical Examples

---

## 📌 Table of Contents

1. [Introduction to GitHub Actions](#introduction-to-github-actions)
2. [Workflow Basics](#workflow-basics)
3. [YAML Syntax](#yaml-syntax)
4. [Jobs & Steps](#jobs--steps)
5. [Runners](#runners)
6. [Actions Marketplace](#actions-marketplace)
7. [Secrets & Environment Variables](#secrets--environment-variables)
8. [Artifacts & Caching](#artifacts--caching)
9. [Matrix Builds](#matrix-builds)
10. [Event Triggers](#event-triggers)
11. [Contexts](#contexts)
12. [Hands-on Examples](#hands-on-examples)

---

## 🚀 Introduction to GitHub Actions

### What is GitHub Actions?

**GitHub Actions** is a CI/CD platform that allows you to automate your build, test, and deployment pipeline directly within GitHub.

**Key Features:**
- ✅ Integrated with GitHub repositories
- ✅ Free tier: 2,000 minutes/month (private repos), unlimited (public repos)
- ✅ Native support for Docker
- ✅ Marketplace with 20,000+ ready-to-use actions
- ✅ Matrix builds for multiple versions
- ✅ Self-hosted runners option

### GitHub Actions vs. Other CI/CD

| Feature | GitHub Actions | Jenkins | GitLab CI | CircleCI |
|---------|---------------|---------|-----------|----------|
| **Hosting** | Cloud + Self-hosted | Self-hosted | Cloud + Self-hosted | Cloud |
| **Free Tier** | 2,000 min/month | Unlimited (self-hosted) | 400 min/month | 6,000 min/month |
| **Config File** | `.github/workflows/*.yml` | `Jenkinsfile` | `.gitlab-ci.yml` | `.circleci/config.yml` |
| **Setup** | Zero config | Complex | Medium | Easy |
| **Integration** | Native GitHub | Plugins | Native GitLab | OAuth apps |

---

## 📝 Workflow Basics

### What is a Workflow?

A **workflow** is an automated process defined in YAML that runs when triggered by an event.

### Workflow File Location

```
your-repo/
├── .github/
│   └── workflows/
│       ├── ci.yml          ✅ This runs
│       ├── deploy.yml      ✅ This runs
│       └── test.yaml       ✅ This runs (.yaml works too)
├── src/
└── README.md
```

### Basic Workflow Structure

```yaml
name: CI Pipeline              # Workflow name (shows in GitHub UI)

on: [push, pull_request]      # When to run this workflow

jobs:                          # Define jobs
  build:                       # Job ID
    runs-on: ubuntu-latest     # Which runner to use
    steps:                     # Steps to execute
      - name: Checkout code    # Step name
        uses: actions/checkout@v4  # Use an action
      
      - name: Run tests        # Another step
        run: npm test          # Run a command
```

**Workflow Execution:**
```
Event (push) → Trigger Workflow → Run Jobs → Execute Steps → Complete
```

---

## 📋 YAML Syntax

### YAML Basics

**YAML** (YAML Ain't Markup Language) is a human-readable data serialization format.

**Key Rules:**
- Indentation matters (use 2 spaces, NOT tabs)
- Colons separate key-value pairs
- Hyphens indicate list items
- Strings can be quoted or unquoted

```yaml
# Comments start with #

# Key-value pairs
name: My Workflow
version: 1.0

# Lists
on:
  - push
  - pull_request

# OR using brackets
on: [push, pull_request]

# Nested objects
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Step 1
        run: echo "Hello"

# Multi-line strings (pipe preserves newlines)
script: |
  echo "Line 1"
  echo "Line 2"
  echo "Line 3"

# Multi-line strings (fold into single line)
description: >
  This is a very long
  description that will
  be folded into one line.
```

**Common YAML Mistakes:**

❌ **Wrong: Using tabs**
```yaml
jobs:
	build:  # This will fail
```

✅ **Correct: Using spaces**
```yaml
jobs:
  build:  # This works
```

❌ **Wrong: Inconsistent indentation**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
   steps:  # Wrong indentation
```

✅ **Correct: Consistent indentation**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:  # Aligned properly
```

---

## 🔧 Jobs & Steps

### Jobs

**Jobs** are a set of steps that run on the same runner. By default, jobs run in parallel.

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 1"
  
  job2:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 2"
```

**Execution:** `job1` and `job2` run simultaneously (parallel).

### Job Dependencies (Sequential Execution)

Use `needs` to make jobs run sequentially:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."
  
  test:
    needs: build          # Wait for build to complete
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing..."
  
  deploy:
    needs: [build, test]  # Wait for both build and test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

**Execution Flow:**
```
build → test → deploy
  ↓      ↓       ↓
 (serial execution)
```

### Job Outputs

Share data between jobs:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build_id: ${{ steps.build_step.outputs.build_id }}
    steps:
      - name: Generate build ID
        id: build_step
        run: echo "build_id=$(date +%s)" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Use build ID
        run: echo "Deploying build ${{ needs.build.outputs.build_id }}"
```

### Steps

**Steps** are individual tasks within a job. They run sequentially.

```yaml
steps:
  - name: Step 1
    run: echo "First"
  
  - name: Step 2
    run: echo "Second"
  
  - name: Step 3
    run: echo "Third"
```

**Two types of steps:**

**1. Run commands** (`run`)
```yaml
- name: Install dependencies
  run: npm install

- name: Run multiple commands
  run: |
    npm install
    npm run build
    npm test
```

**2. Use actions** (`uses`)
```yaml
- name: Checkout code
  uses: actions/checkout@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
```

### Conditional Steps

Run steps only if condition is met:

```yaml
steps:
  - name: Run on main branch only
    if: github.ref == 'refs/heads/main'
    run: echo "This is the main branch"
  
  - name: Run on PR only
    if: github.event_name == 'pull_request'
    run: echo "This is a pull request"
  
  - name: Run if previous step failed
    if: failure()
    run: echo "Previous step failed"
  
  - name: Always run (even if job fails)
    if: always()
    run: echo "This always runs"
```

---

## 🖥️ Runners

### What is a Runner?

A **runner** is a server that runs your workflows. It can be GitHub-hosted or self-hosted.

### GitHub-Hosted Runners

**Available runners:**

| Runner | OS | Architecture | Specs |
|--------|-----|------------|-------|
| `ubuntu-latest` | Ubuntu 22.04 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `ubuntu-22.04` | Ubuntu 22.04 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `ubuntu-20.04` | Ubuntu 20.04 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `windows-latest` | Windows Server 2022 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `windows-2022` | Windows Server 2022 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `windows-2019` | Windows Server 2019 | x64 | 2 CPU, 7 GB RAM, 14 GB SSD |
| `macos-latest` | macOS 14 (Sonoma) | ARM64 (M1) | 3 CPU, 7 GB RAM, 14 GB SSD |
| `macos-14` | macOS 14 (Sonoma) | ARM64 (M1) | 3 CPU, 7 GB RAM, 14 GB SSD |
| `macos-13` | macOS 13 (Ventura) | x64 | 3 CPU, 7 GB RAM, 14 GB SSD |
| `macos-12` | macOS 12 (Monterey) | x64 | 3 CPU, 7 GB RAM, 14 GB SSD |

**Most common:** `ubuntu-latest` (fastest, cheapest)

### Usage Example

```yaml
jobs:
  build-ubuntu:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running on Ubuntu"
  
  build-windows:
    runs-on: windows-latest
    steps:
      - run: echo "Running on Windows"
  
  build-macos:
    runs-on: macos-latest
    steps:
      - run: echo "Running on macOS"
```

### Pre-installed Software

GitHub-hosted runners come with many tools pre-installed:

**Ubuntu:**
- Node.js, Python, Ruby, Java, PHP, Go, Rust
- Docker, Docker Compose
- Git, GitHub CLI
- npm, pip, yarn, Maven, Gradle
- Databases: PostgreSQL, MySQL, MongoDB
- Browsers: Chrome, Firefox

[Full list of pre-installed software](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md)

### Free Tier Minutes Calculation

**GitHub Actions Free Tier:**

| Repository | Minutes/Month | Cost Multiplier |
|-----------|---------------|-----------------|
| **Public repos** | ♾️ Unlimited | Free |
| **Private repos** | 2,000 minutes | 1x (Linux), 2x (Windows), 10x (macOS) |

**Example calculation:**

If you use in a **private repo**:
- 1,000 minutes on `ubuntu-latest` = 1,000 minutes used
- 500 minutes on `windows-latest` = 1,000 minutes used (500 × 2)
- 100 minutes on `macos-latest` = 1,000 minutes used (100 × 10)
- **Total: 3,000 minutes used** (exceeds free tier by 1,000)

**Optimization tip:** Always use `ubuntu-latest` in private repos to maximize free tier.

---

## 🛒 Actions Marketplace

### What are Actions?

**Actions** are reusable units of code that perform specific tasks.

**Official GitHub Actions:** https://github.com/marketplace?type=actions

### Popular Actions

**1. Checkout Code**
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
Downloads your repository code to the runner.

**2. Setup Node.js**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Automatically cache npm dependencies
```

**3. Setup Python**
```yaml
- name: Setup Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'  # Automatically cache pip dependencies
```

**4. Upload Artifacts**
```yaml
- name: Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7
```

**5. Download Artifacts**
```yaml
- name: Download build artifacts
  uses: actions/download-artifact@v5
  with:
    name: build-output
    path: dist/
```

**6. Cache Dependencies**
```yaml
- name: Cache node modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**7. Docker Build and Push**
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: user/app:latest
```

### Using Actions

**Syntax:**
```yaml
- uses: owner/repo@version
  with:
    input1: value1
    input2: value2
```

**Versions:**
- `@v4` - Major version (recommended, auto-updates minor/patch)
- `@v4.1` - Minor version
- `@v4.1.2` - Exact version
- `@main` - Latest from main branch (not recommended)
- `@abc123` - Specific commit SHA (most secure)

---

## 🔐 Secrets & Environment Variables

### Environment Variables

**Workflow-level:**
```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "API URL is $API_URL"
```

**Job-level:**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: postgres://localhost:5432/db
    steps:
      - run: echo "DB URL is $DATABASE_URL"
```

**Step-level:**
```yaml
steps:
  - name: Deploy
    env:
      DEPLOY_ENV: staging
    run: echo "Deploying to $DEPLOY_ENV"
```

**Precedence:** Step-level > Job-level > Workflow-level

### Secrets

**Secrets** store sensitive information like API keys, passwords, tokens.

#### Creating Secrets

**Repository Secrets:**
1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `MY_SECRET`
5. Value: `secret_value_here`
6. Click **Add secret**

#### Using Secrets

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.MY_SECRET }}
      DATABASE_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: |
      echo "Deploying with API key..."
      # API_KEY is available as environment variable
      deploy.sh
```

**⚠️ Security:**
- Secrets are encrypted
- Never logged in output (GitHub automatically masks them)
- Can't be viewed after creation
- Available only to workflows in the same repository

**Example: Deploy with secrets**
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync ./dist s3://my-bucket
```

### GitHub Default Environment Variables

Available in all workflows:

```yaml
steps:
  - name: Print GitHub info
    run: |
      echo "Repository: ${{ github.repository }}"
      echo "Branch: ${{ github.ref }}"
      echo "Commit SHA: ${{ github.sha }}"
      echo "Actor: ${{ github.actor }}"
      echo "Event: ${{ github.event_name }}"
      echo "Workflow: ${{ github.workflow }}"
```

---

## 📦 Artifacts & Caching

### Artifacts

**Artifacts** are files generated during workflow runs (build outputs, test reports, logs).

#### Upload Artifacts

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build project
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: |
            dist/
            build/
          retention-days: 7  # Keep for 7 days (max 90 days)
```

#### Download Artifacts (Same Workflow)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v5
        with:
          name: build-files
          path: dist/
      
      - name: Deploy
        run: |
          ls -la dist/
          # Deploy dist/ to server
```

### Caching

**Caching** speeds up workflows by storing dependencies between runs.

**Cache vs Artifacts:**
- **Cache**: Reuse dependencies (node_modules, pip cache)
- **Artifacts**: Share build outputs between jobs

#### Cache Node.js Dependencies

**Manual caching:**
```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Cache node modules
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  
  - name: Install dependencies
    run: npm ci
```

**Automatic caching (setup-node):**
```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'  # Automatically handles caching!
  
  - run: npm ci
```

#### Cache Python Dependencies

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-python@v5
    with:
      python-version: '3.11'
      cache: 'pip'  # Automatically cache pip dependencies
  
  - run: pip install -r requirements.txt
```

#### Cache Performance Impact

**Without cache:**
- npm install: ~2 minutes

**With cache:**
- npm install: ~10 seconds

**Savings:** ~90% faster! 🚀

---

## 🔀 Matrix Builds

**Matrix builds** let you test across multiple versions/OS simultaneously.

### Basic Matrix

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm ci
      - run: npm test
```

**This creates 9 jobs (3 OS × 3 Node versions):**
```
ubuntu-latest + Node 16
ubuntu-latest + Node 18
ubuntu-latest + Node 20
windows-latest + Node 16
windows-latest + Node 18
windows-latest + Node 20
macos-latest + Node 16
macos-latest + Node 18
macos-latest + Node 20
```

### Matrix with Include/Exclude

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [16, 18, 20]
    exclude:
      - os: windows-latest
        node-version: 16  # Don't test Windows + Node 16
    include:
      - os: macos-latest
        node-version: 20  # Add macOS + Node 20
```

### Fail-Fast Strategy

By default, all matrix jobs are cancelled if one fails.

**Disable fail-fast:**
```yaml
strategy:
  fail-fast: false  # Continue even if one job fails
  matrix:
    node-version: [16, 18, 20]
```

---

## ⚡ Event Triggers

### Common Events

**Push:**
```yaml
on: push
```

**Pull Request:**
```yaml
on: pull_request
```

**Multiple Events:**
```yaml
on: [push, pull_request]
```

### Branch Filtering

**Run on specific branches:**
```yaml
on:
  push:
    branches:
      - main
      - develop
      - 'release/**'  # Matches release/v1, release/v2, etc.
```

**Exclude branches:**
```yaml
on:
  push:
    branches-ignore:
      - 'temp/**'
      - 'experimental'
```

### Path Filtering

**Run only when specific files change:**
```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
```

**Ignore specific paths:**
```yaml
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

### Scheduled Workflows (Cron)

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight UTC
    - cron: '0 */6 * * *'  # Run every 6 hours
```

**Cron syntax:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday = 0)
│ │ │ │ │
* * * * *
```

### Manual Triggers (workflow_dispatch)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      debug_enabled:
        description: 'Enable debug mode'
        required: false
        type: boolean

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ github.event.inputs.environment }}
        run: echo "Deploying to ${{ github.event.inputs.environment }}"
```

**Trigger from GitHub UI:**
1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Fill in inputs
5. Click **Run workflow**

---

## 🔍 Contexts

**Contexts** provide information about workflow runs, jobs, and steps.

### Common Contexts

**`github` context:**
```yaml
steps:
  - run: |
      echo "Repository: ${{ github.repository }}"
      echo "Branch: ${{ github.ref }}"
      echo "Commit: ${{ github.sha }}"
      echo "Actor: ${{ github.actor }}"
      echo "Event: ${{ github.event_name }}"
```

**`env` context:**
```yaml
env:
  MY_VAR: hello

steps:
  - run: echo "${{ env.MY_VAR }}"
```

**`secrets` context:**
```yaml
steps:
  - env:
      API_KEY: ${{ secrets.API_KEY }}
    run: echo "API key is set"
```

**`runner` context:**
```yaml
steps:
  - run: |
      echo "OS: ${{ runner.os }}"
      echo "Arch: ${{ runner.arch }}"
      echo "Temp dir: ${{ runner.temp }}"
```

**`needs` context (job outputs):**
```yaml
jobs:
  build:
    outputs:
      version: ${{ steps.get_version.outputs.version }}
    steps:
      - id: get_version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    steps:
      - run: echo "Version: ${{ needs.build.outputs.version }}"
```

---

## 🛠️ Hands-on Examples

### Example 1: Simple Node.js CI

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
```

### Example 2: Python with Multiple Versions

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ['3.9', '3.10', '3.11']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        run: pytest --cov=src tests/
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Example 3: Build → Test → Deploy Pipeline

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm test
  
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v5
        with:
          name: build-output
          path: dist/
      
      - name: Deploy to production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: |
          echo "Deploying to production..."
          # Your deployment script here
```

---

## 🎯 Summary

### Key Concepts

1. ✅ **Workflows** are defined in `.github/workflows/*.yml`
2. ✅ **Jobs** run in parallel by default, use `needs` for dependencies
3. ✅ **Steps** run sequentially within a job
4. ✅ **Runners** execute workflows (ubuntu, windows, macos)
5. ✅ **Actions** are reusable components from marketplace
6. ✅ **Secrets** store sensitive data securely
7. ✅ **Artifacts** share files between jobs
8. ✅ **Caching** speeds up workflows significantly
9. ✅ **Matrix builds** test across multiple versions/OS
10. ✅ **Event triggers** control when workflows run

### Free Tier Optimization

- ✅ Use `ubuntu-latest` (1x multiplier vs 2x/10x for Windows/macOS)
- ✅ Enable caching to reduce build time
- ✅ Use `paths` filters to avoid unnecessary runs
- ✅ Public repos = unlimited minutes 🎉

---

**Next**: [Pipeline Best Practices →](./03-pipeline-best-practices.md)
