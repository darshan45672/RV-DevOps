# 4️⃣ Practical CI/CD Project

**Duration**: 2.5 hours  
**Mode**: Hands-on Project

---

## 📌 Project Overview

### What We're Building

A **complete CI/CD pipeline** for a real-world web application with:
- ✅ Automated testing (unit, integration, E2E)
- ✅ Code quality checks (linting, formatting, security)
- ✅ Multi-stage deployment (staging → production)
- ✅ Automated rollback on failure
- ✅ Notifications and monitoring
- ✅ Optimized for GitHub Actions free tier

### Tech Stack

**Backend Options:**
- **Node.js** - Express REST API
- **Python** - Flask REST API

**Features:**
- User authentication (JWT)
- CRUD operations
- PostgreSQL database
- Docker containerization
- GitHub Actions CI/CD

---

## 🎯 Project Structure

```
ci-cd-project/
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous Integration
│       ├── cd-staging.yml      # Deploy to Staging
│       └── cd-production.yml   # Deploy to Production
├── src/
│   ├── app.js / app.py        # Main application
│   ├── routes/                # API routes
│   ├── models/                # Database models
│   └── middleware/            # Auth, error handling
├── tests/
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Local development
├── package.json / requirements.txt
└── README.md
```

---

## 📝 Step-by-Step Implementation

### Step 1: Initialize Project

#### Option A: Node.js (Express)

```bash
# Create project directory
mkdir ci-cd-project && cd ci-cd-project

# Initialize npm project
npm init -y

# Install dependencies
npm install express pg bcryptjs jsonwebtoken dotenv
npm install --save-dev jest supertest eslint prettier nodemon

# Create directory structure
mkdir -p src/{routes,models,middleware} tests/{unit,integration,e2e} .github/workflows
```

**package.json scripts:**
```json
{
  "name": "ci-cd-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "lint": "eslint src tests",
    "lint:fix": "eslint src tests --fix",
    "format": "prettier --write \"src/**/*.js\" \"tests/**/*.js\""
  },
  "jest": {
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### Option B: Python (Flask)

```bash
# Create project directory
mkdir ci-cd-project && cd ci-cd-project

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create requirements.txt
cat > requirements.txt << EOF
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.9
PyJWT==2.8.0
bcrypt==4.1.2
python-dotenv==1.0.0
EOF

# Install dependencies
pip install -r requirements.txt

# Dev dependencies
cat > requirements-dev.txt << EOF
pytest==7.4.3
pytest-cov==4.1.0
flake8==6.1.0
black==23.12.1
pylint==3.0.3
EOF

pip install -r requirements-dev.txt

# Create directory structure
mkdir -p src/{routes,models,middleware} tests/{unit,integration,e2e} .github/workflows
```

---

### Step 2: Create Application Code

#### Node.js Application (`src/app.js`)

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  res.status(201).json({ id: 1, name, email });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
```

#### Python Application (`src/app.py`)

```python
from flask import Flask, jsonify, request
from datetime import datetime
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({'users': []}), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    
    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400
    
    return jsonify({'id': 1, 'name': name, 'email': email}), 201

@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

### Step 3: Write Tests

#### Node.js Tests (`tests/unit/app.test.js`)

```javascript
const request = require('supertest');
const app = require('../../src/app');

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/users', () => {
    it('should return empty users array', async () => {
      const res = await request(app).get('/api/users');
      
      expect(res.status).toBe(200);
      expect(res.body.users).toEqual([]);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' };
      const res = await request(app)
        .post('/api/users')
        .send(userData);
      
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(userData.name);
      expect(res.body.email).toBe(userData.email);
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'john@example.com' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });
});
```

#### Python Tests (`tests/unit/test_app.py`)

```python
import pytest
from src.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'
    assert 'timestamp' in response.json

def test_get_users(client):
    """Test get users endpoint"""
    response = client.get('/api/users')
    assert response.status_code == 200
    assert response.json['users'] == []

def test_create_user(client):
    """Test create user endpoint"""
    user_data = {'name': 'John Doe', 'email': 'john@example.com'}
    response = client.post('/api/users', json=user_data)
    assert response.status_code == 201
    assert response.json['name'] == user_data['name']
    assert response.json['email'] == user_data['email']
    assert 'id' in response.json

def test_create_user_missing_name(client):
    """Test create user with missing name"""
    response = client.post('/api/users', json={'email': 'john@example.com'})
    assert response.status_code == 400
    assert 'error' in response.json

def test_create_user_missing_email(client):
    """Test create user with missing email"""
    response = client.post('/api/users', json={'name': 'John Doe'})
    assert response.status_code == 400
    assert 'error' in response.json
```

---

### Step 4: Create Dockerfile

```dockerfile
# Multi-stage build for smaller image size

# Stage 1: Build
FROM node:18-alpine AS builder
# For Python: FROM python:3.11-slim AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
# For Python: COPY requirements.txt ./

# Install dependencies
RUN npm ci --only=production
# For Python: RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ ./src/

# Stage 2: Production
FROM node:18-alpine
# For Python: FROM python:3.11-slim

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "src/app.js"]
```

---

### Step 5: CI Workflow

**`.github/workflows/ci.yml`**

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

# Cancel in-progress runs on new push
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Stage 1: Fast quality checks (parallel)
  lint:
    name: Lint Code
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
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npx prettier --check "src/**/*.js" "tests/**/*.js"

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Stage 2: Tests (after quality checks)
  test:
    name: Run Tests
    needs: [lint, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run all tests with coverage
        run: npm test
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: false

  # Stage 3: Build (after tests pass)
  build:
    name: Build Docker Image
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Test Docker image
        run: |
          docker run -d -p 3000:3000 --name test-container myapp:${{ github.sha }}
          sleep 5
          curl --fail http://localhost:3000/health || exit 1
          docker stop test-container

  # Stage 4: Notify
  notify:
    name: Notify Results
    needs: [lint, security-scan, test, build]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Check status
        run: |
          if [ "${{ needs.build.result }}" == "success" ]; then
            echo "✅ CI Pipeline passed!"
          else
            echo "❌ CI Pipeline failed!"
            exit 1
          fi
```

---

### Step 6: CD Staging Workflow

**`.github/workflows/cd-staging.yml`**

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.myapp.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/myapp:staging
            ${{ secrets.DOCKER_USERNAME }}/myapp:staging-${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Deploy to staging server
        run: |
          echo "Deploying to staging environment..."
          # SSH into staging server and update container
          # ssh user@staging-server "docker pull myapp:staging && docker-compose up -d"
      
      - name: Run smoke tests
        run: |
          echo "Running smoke tests..."
          # curl https://staging.myapp.com/health
          # Run critical E2E tests

      - name: Notify deployment
        if: always()
        run: |
          if [ "${{ job.status }}" == "success" ]; then
            echo "✅ Deployed to staging successfully!"
          else
            echo "❌ Staging deployment failed!"
          fi
```

---

### Step 7: CD Production Workflow

**`.github/workflows/cd-production.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        default: 'latest'

jobs:
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Extract version
        id: version
        run: |
          if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
            echo "version=${{ github.event.inputs.version }}" >> $GITHUB_OUTPUT
          else
            echo "version=$(cat package.json | jq -r .version)" >> $GITHUB_OUTPUT
          fi
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/myapp:latest
            ${{ secrets.DOCKER_USERNAME }}/myapp:${{ steps.version.outputs.version }}
            ${{ secrets.DOCKER_USERNAME }}/myapp:prod-${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Create deployment backup
        run: |
          echo "Creating backup of current production deployment..."
          # Backup current deployment for rollback
      
      - name: Deploy to production (Blue-Green)
        run: |
          echo "Deploying version ${{ steps.version.outputs.version }} to production..."
          # 1. Deploy to green environment
          # 2. Run health checks
          # 3. Switch traffic from blue to green
          # 4. Keep blue running for instant rollback
      
      - name: Run smoke tests
        run: |
          echo "Running production smoke tests..."
          sleep 30  # Wait for deployment to stabilize
          # curl https://myapp.com/health
          # Run critical tests
      
      - name: Monitor deployment
        run: |
          echo "Monitoring deployment for 5 minutes..."
          # Monitor error rates, response times
          # Automatically rollback if metrics degrade
      
      - name: Rollback on failure
        if: failure()
        run: |
          echo "❌ Deployment failed! Rolling back..."
          # Switch traffic back to blue (previous version)
          # Instant rollback
      
      - name: Notify deployment
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Production Deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Status*: ${{ job.status }}\n*Version*: ${{ steps.version.outputs.version }}\n*Commit*: ${{ github.sha }}\n*URL*: https://myapp.com"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🔐 Required Secrets

### GitHub Repository Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKER_USERNAME` | Docker Hub username | `johndoe` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `dckr_pat_xxxxx` |
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | `https://hooks.slack.com/...` |
| `SSH_PRIVATE_KEY` | SSH key for deployment | `-----BEGIN RSA PRIVATE KEY-----...` |
| `STAGING_SERVER` | Staging server address | `staging.example.com` |
| `PRODUCTION_SERVER` | Production server address | `prod.example.com` |

---

## 🧪 Testing the Pipeline

### 1. Test Locally First

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build Docker image
docker build -t myapp:test .

# Run container
docker run -p 3000:3000 myapp:test

# Test health endpoint
curl http://localhost:3000/health
```

### 2. Test CI Pipeline

```bash
# Create feature branch
git checkout -b feature/test-ci

# Make changes
echo "// Test change" >> src/app.js

# Commit and push
git add .
git commit -m "Test CI pipeline"
git push origin feature/test-ci

# Open pull request
# CI pipeline will run automatically
```

### 3. Test CD Pipeline

```bash
# Merge to develop (staging deployment)
git checkout develop
git merge feature/test-ci
git push origin develop

# Staging deployment runs automatically

# Merge to main (production deployment)
git checkout main
git merge develop
git push origin main

# Production deployment runs (may require approval)
```

---

## 📊 Monitoring Pipeline

### GitHub Actions Dashboard

1. Go to **Actions** tab
2. See all workflow runs
3. Click on run to see details
4. View logs for each job/step

### Pipeline Metrics

Track these metrics:
- **Deployment frequency** - How often you deploy
- **Lead time** - Time from commit to production
- **Failure rate** - % of failed deployments
- **Recovery time** - Time to fix failed deployment

### Setting Up Monitoring

```yaml
# Add to production workflow
- name: Record deployment metrics
  run: |
    echo "Recording deployment metrics..."
    # Send metrics to monitoring service
    # Track deployment time, version, status
```

---

## 🎯 Project Challenges

### Challenge 1: Add Database Integration

- Add PostgreSQL to `docker-compose.yml`
- Create database models
- Add database migrations
- Update tests to use test database
- Update CI to run with database service

### Challenge 2: Add E2E Tests

- Install Playwright or Cypress
- Write E2E tests for critical user flows
- Add E2E test job to CI pipeline
- Upload test screenshots on failure

### Challenge 3: Implement Canary Deployment

- Modify production workflow for canary deployment
- Deploy to 10% of users first
- Monitor metrics (error rate, latency)
- Gradually roll out to 100%
- Auto-rollback if metrics degrade

### Challenge 4: Add Performance Testing

- Install k6 or Artillery
- Write performance tests
- Run load tests after deployment
- Fail deployment if response time > threshold

---

## 🎓 Summary

### What You Built

✅ Complete CI/CD pipeline with GitHub Actions  
✅ Automated testing (unit, integration, E2E)  
✅ Code quality checks (lint, format, security)  
✅ Multi-environment deployment (staging, production)  
✅ Docker containerization  
✅ Automated rollback on failure  
✅ Notifications and monitoring  
✅ Optimized for free tier  

### Pipeline Flow

```
Code Push
    ↓
Lint + Security Scan (parallel, 30s)
    ↓
Tests (unit, integration, 2 min)
    ↓
Build Docker Image (1 min)
    ↓
Deploy to Staging (develop branch)
    ↓
Smoke Tests
    ↓
Deploy to Production (main branch)
    ↓
Monitor + Auto-Rollback
```

### Time to Production

- **Before CI/CD:** Days or weeks
- **After CI/CD:** Minutes! 🚀

---

**Congratulations!** You've built a production-ready CI/CD pipeline! 🎉

**Next Steps:**
- Day 4: [Docker Deep Dive →](../Day-4/README.md)
- Day 5: [Kubernetes Basics →](../Day-5/README.md)
