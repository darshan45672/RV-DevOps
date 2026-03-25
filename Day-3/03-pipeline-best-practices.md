# 3️⃣ CI/CD Pipeline Best Practices

**Duration**: 1.5 hours  
**Mode**: Best Practices + Examples

---

## 📌 Table of Contents

1. [Fail Fast Strategy](#fail-fast-strategy)
2. [Dependency Caching](#dependency-caching)
3. [Security Scanning](#security-scanning)
4. [Code Quality & Linting](#code-quality--linting)
5. [Testing Integration](#testing-integration)
6. [Optimization for Free Tier](#optimization-for-free-tier)
7. [Monitoring & Notifications](#monitoring--notifications)
8. [Documentation & Reproducibility](#documentation--reproducibility)

---

## ⚡ Fail Fast Strategy

### What is Fail Fast?

**Fail fast** means detecting and reporting errors as early as possible in the pipeline.

### Why Fail Fast?

✅ **Save time** - Don't waste minutes on builds that will fail anyway  
✅ **Save money** - Reduce GitHub Actions minutes usage  
✅ **Fast feedback** - Developers know immediately if something is wrong  
✅ **Better DX** - Quick iteration cycles

### Pipeline Order (Fastest → Slowest)

```
1. Linting          (5-30 seconds)    ← Fail here first
2. Type checking    (10-60 seconds)   ← Then here
3. Unit tests       (30-120 seconds)  ← Then here
4. Build            (1-3 minutes)     ← Then here
5. Integration tests (2-5 minutes)    ← Then here
6. E2E tests        (5-15 minutes)    ← Last resort
7. Deploy           (2-5 minutes)     ← Only if all pass
```

### Example: Fail Fast Pipeline

❌ **Bad: Run everything in one job**
```yaml
jobs:
  all-in-one:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci                    # 1 min
      - run: npm run build             # 2 min
      - run: npm test                  # 3 min
      - run: npm run lint              # 30 sec
      # If lint fails, you wasted 6 minutes!
```

✅ **Good: Separate fast checks**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint              # Fail in 30 seconds
  
  test:
    needs: lint                        # Only run if lint passes
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test
  
  build:
    needs: [lint, test]                # Only run if both pass
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

### Parallel Fast Checks

Run independent fast checks in parallel:

```yaml
jobs:
  # All these run simultaneously
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
  
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run type-check
  
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit
  
  # Only run after all checks pass
  build:
    needs: [lint, type-check, security-scan]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

**Time savings:**
- Sequential: 30s + 30s + 20s = 80s
- Parallel: max(30s, 30s, 20s) = 30s
- **Saved: 50 seconds** 🚀

---

## 💾 Dependency Caching

### Why Cache?

**Without caching:**
```
npm ci:  2 minutes, 15 seconds
```

**With caching:**
```
Restore cache:  5 seconds
npm ci:        10 seconds
Total:         15 seconds
```

**Savings: ~90% faster, 90% fewer minutes consumed**

### Node.js Caching

**Automatic (recommended):**
```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'           # ✅ Automatic caching
  
  - run: npm ci
```

**Manual (more control):**
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
  
  - run: npm ci
```

**Cache multiple directories:**
```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache
      node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}
```

### Python Caching

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: actions/setup-python@v5
    with:
      python-version: '3.11'
      cache: 'pip'           # ✅ Automatic pip caching
  
  - run: pip install -r requirements.txt
```

### Docker Layer Caching

```yaml
- name: Setup Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=gha      # Use GitHub Actions cache
    cache-to: type=gha,mode=max
    push: false
```

### Cache Best Practices

✅ **DO:**
- Cache dependencies (npm, pip, Maven)
- Cache build outputs
- Use `hashFiles()` for cache keys
- Set reasonable TTL (GitHub auto-deletes after 7 days of no use)

❌ **DON'T:**
- Cache final build artifacts (use `upload-artifact` instead)
- Cache secrets or sensitive data
- Cache more than 10 GB (GitHub limit)
- Use static cache keys (cache won't update)

---

## 🔒 Security Scanning

### 1. Dependency Vulnerability Scanning

#### npm audit (Node.js)

```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security audit
        run: npm audit --audit-level=moderate
        # Fails if moderate or higher vulnerabilities found
```

**Audit levels:**
- `low` - Low severity (warnings only)
- `moderate` - Moderate severity
- `high` - High severity
- `critical` - Critical severity

#### pip-audit (Python)

```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install pip-audit
        run: pip install pip-audit
      
      - name: Run security audit
        run: pip-audit -r requirements.txt
```

### 2. Secret Scanning

**Prevent committing secrets:**

```yaml
jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for scanning
      
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**What it catches:**
- AWS keys
- API tokens
- Database passwords
- Private keys
- OAuth tokens

### 3. Code Security Analysis (SAST)

**CodeQL (GitHub's free security scanner):**

```yaml
name: CodeQL Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1'  # Run weekly

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read
    
    strategy:
      matrix:
        language: [javascript, python]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
```

**CodeQL detects:**
- SQL injection
- XSS vulnerabilities
- Path traversal
- Command injection
- Hardcoded credentials

### 4. Container Image Scanning

**Trivy (Docker image scanner):**

```yaml
jobs:
  docker-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t myapp:latest .
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### Security Best Practices

✅ **DO:**
- Scan on every push and PR
- Fail builds on high/critical vulnerabilities
- Run weekly scheduled scans
- Keep dependencies updated
- Use Dependabot for automatic updates

❌ **DON'T:**
- Ignore security warnings
- Commit secrets to git
- Use deprecated packages
- Skip scanning to save time

---

## 🎨 Code Quality & Linting

### JavaScript/TypeScript Linting

**ESLint:**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Check formatting
        run: npx prettier --check "src/**/*.{js,ts,jsx,tsx}"
```

**package.json:**
```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.ts,.jsx,.tsx",
    "lint:fix": "eslint src --ext .js,.ts,.jsx,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,ts,jsx,tsx}\""
  }
}
```

### Python Linting

**flake8 + black:**

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install linters
        run: |
          pip install flake8 black isort mypy
      
      - name: Run flake8
        run: flake8 src tests --max-line-length=88
      
      - name: Check black formatting
        run: black --check src tests
      
      - name: Check import sorting
        run: isort --check-only src tests
      
      - name: Run type checking
        run: mypy src
```

### Code Coverage

**JavaScript (Jest):**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: true
```

**Python (pytest):**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - run: pip install pytest pytest-cov
      - run: pip install -r requirements.txt
      
      - name: Run tests with coverage
        run: pytest --cov=src --cov-report=xml tests/
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
```

**Enforce minimum coverage:**

```yaml
- name: Check coverage threshold
  run: |
    COVERAGE=$(python -c "import xml.etree.ElementTree as ET; print(ET.parse('coverage.xml').getroot().get('line-rate'))")
    THRESHOLD=0.80
    if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
      echo "Coverage $COVERAGE is below threshold $THRESHOLD"
      exit 1
    fi
```

---

## 🧪 Testing Integration

### Test Pyramid Integration

```yaml
jobs:
  # Stage 1: Fast unit tests (parallel)
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
  
  # Stage 2: Integration tests (after unit tests)
  integration-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
  
  # Stage 3: E2E tests (slowest, run last)
  e2e-tests:
    needs: integration-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### Testing with Multiple Databases

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        database: [postgres, mysql, mongodb]
        include:
          - database: postgres
            db_port: 5432
            db_image: postgres:15
            connection_string: postgresql://test:test@localhost:5432/test
          - database: mysql
            db_port: 3306
            db_image: mysql:8
            connection_string: mysql://test:test@localhost:3306/test
          - database: mongodb
            db_port: 27017
            db_image: mongo:7
            connection_string: mongodb://localhost:27017/test
    
    services:
      database:
        image: ${{ matrix.db_image }}
        env:
          POSTGRES_PASSWORD: test
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: test
        ports:
          - ${{ matrix.db_port }}:${{ matrix.db_port }}
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: ${{ matrix.connection_string }}
```

---

## 💰 Optimization for Free Tier

### Free Tier Limits

| Account Type | Minutes/Month | Multiplier |
|--------------|---------------|------------|
| Public repos | ♾️ Unlimited | N/A |
| Private repos (Free) | 2,000 | Linux: 1x, Windows: 2x, macOS: 10x |
| Private repos (Pro) | 3,000 | Same |

### Optimization Strategies

#### 1. Use Public Repos When Possible

```yaml
# Public repos = unlimited minutes!
# Make your open-source projects public
```

#### 2. Prefer Ubuntu Runners

```yaml
jobs:
  build:
    runs-on: ubuntu-latest  # ✅ 1x multiplier
    # runs-on: windows-latest  # ❌ 2x multiplier
    # runs-on: macos-latest    # ❌ 10x multiplier
```

**Cost example:**
- 100 minutes on Ubuntu = 100 minutes used
- 100 minutes on Windows = 200 minutes used
- 100 minutes on macOS = 1,000 minutes used

#### 3. Path Filtering

Only run on relevant changes:

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
    paths-ignore:
      - 'docs/**'
      - '**.md'
      - '.gitignore'
```

#### 4. Branch Filtering

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
```

#### 5. Concurrency Limits

Cancel in-progress runs when pushing new commits:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Before:**
```
Push commit A → Workflow runs (5 min)
Push commit B → Workflow runs (5 min)
Push commit C → Workflow runs (5 min)
Total: 15 minutes
```

**After:**
```
Push commit A → Workflow starts
Push commit B → Cancel A, start B
Push commit C → Cancel B, start C (5 min)
Total: ~5-7 minutes (saved 8-10 minutes!)
```

#### 6. Cache Aggressively

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'  # Saves ~2 minutes per run
```

**Monthly savings:**
- Without cache: 100 runs × 2 min = 200 minutes
- With cache: 100 runs × 0.2 min = 20 minutes
- **Saved: 180 minutes** (9% of free tier!)

#### 7. Combine Jobs Strategically

❌ **Too many jobs (overhead):**
```yaml
jobs:
  lint: ...      # 1 min + 30s setup
  format: ...    # 1 min + 30s setup
  typecheck: ... # 1 min + 30s setup
# Total: 4.5 min (3 min work + 1.5 min overhead)
```

✅ **Combined job:**
```yaml
jobs:
  quality-checks:
    steps:
      - run: npm run lint      # 1 min
      - run: npm run format    # 1 min
      - run: npm run typecheck # 1 min
# Total: 3.5 min (3 min work + 0.5 min setup)
```

**Saved: 1 minute per run**

#### 8. Skip CI for Docs

```yaml
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

Or use commit message:

```bash
git commit -m "Update README [skip ci]"
```

### Monitor Usage

Check your usage:
1. Go to **Settings** → **Billing and plans**
2. View **Actions** usage
3. Track minutes consumed
4. Set spending limits (optional)

---

## 📊 Monitoring & Notifications

### Workflow Status Badges

Add to your README:

```markdown
![CI Status](https://github.com/username/repo/workflows/CI/badge.svg)
![Deploy Status](https://github.com/username/repo/workflows/Deploy/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

### Slack Notifications

```yaml
jobs:
  notify:
    runs-on: ubuntu-latest
    if: always()  # Run even if previous jobs fail
    needs: [build, test, deploy]
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Workflow*: ${{ github.workflow }}\n*Status*: ${{ job.status }}\n*Commit*: ${{ github.sha }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Email Notifications

GitHub sends email by default for workflow failures. Configure in:
**Settings** → **Notifications** → **Actions**

### GitHub Checks Summary

```yaml
- name: Test Report
  uses: dorny/test-reporter@v1
  if: success() || failure()
  with:
    name: Test Results
    path: reports/jest-*.xml
    reporter: jest-junit
```

---

## 📚 Documentation & Reproducibility

### 1. Document Your Workflows

Add comments:

```yaml
name: Production Deployment

# This workflow deploys to production after:
# 1. All tests pass
# 2. Manual approval
# 3. Smoke tests succeed

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Checkout code from repository
      - uses: actions/checkout@v4
      
      # Install Node.js with caching for speed
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
```

### 2. Pin Action Versions

❌ **Bad: Using latest**
```yaml
- uses: actions/checkout@main  # Could break anytime
```

✅ **Good: Pin to version**
```yaml
- uses: actions/checkout@v4  # Stable, won't break
```

✅ **Best: Pin to commit SHA**
```yaml
- uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab
# Most secure, immutable
```

### 3. Environment Variables Documentation

```yaml
env:
  # Node.js version used across all jobs
  NODE_VERSION: '18'
  
  # Build output directory
  BUILD_DIR: 'dist'
  
  # Deployment environment
  DEPLOY_ENV: 'production'
```

### 4. Workflow Visualization

Use GitHub's visual editor:
1. Go to **Actions** tab
2. Click workflow
3. Click **"View workflow file"**
4. See visual graph of jobs

---

## 🎯 Complete Best Practices Checklist

### Security ✅
- [ ] Run `npm audit` / `pip-audit` on every PR
- [ ] Enable CodeQL security scanning
- [ ] Scan Docker images with Trivy
- [ ] Use secrets, never hardcode credentials
- [ ] Scan for committed secrets with Gitleaks
- [ ] Keep dependencies updated (Dependabot)

### Performance ✅
- [ ] Cache dependencies (npm, pip, etc.)
- [ ] Use path filters to skip unnecessary runs
- [ ] Cancel in-progress runs on new commits
- [ ] Use ubuntu-latest for cost efficiency
- [ ] Parallel jobs for independent tasks
- [ ] Fail fast with fastest checks first

### Quality ✅
- [ ] Lint code (ESLint, flake8)
- [ ] Check code formatting (Prettier, black)
- [ ] Run type checking (TypeScript, mypy)
- [ ] Enforce code coverage minimum (80%+)
- [ ] Review test reports in PR

### Testing ✅
- [ ] Unit tests run on every commit
- [ ] Integration tests before deployment
- [ ] E2E tests on staging
- [ ] Test across multiple versions (matrix)
- [ ] Upload test artifacts on failure

### Deployment ✅
- [ ] Require manual approval for production
- [ ] Use environments (dev, staging, prod)
- [ ] Smoke tests after deployment
- [ ] Automated rollback on failure
- [ ] Notifications on deployment status

### Documentation ✅
- [ ] Comments in workflow files
- [ ] README badges for build status
- [ ] Document required secrets
- [ ] Pin action versions
- [ ] Changelog for deployments

---

## 🎓 Summary

### Key Takeaways

1. ✅ **Fail fast** - Run cheapest checks first
2. ✅ **Cache everything** - Save 90% on build time
3. ✅ **Security first** - Scan dependencies and code
4. ✅ **Optimize for free tier** - Use ubuntu, path filters, concurrency
5. ✅ **Monitor actively** - Badges, notifications, alerts
6. ✅ **Document well** - Future you will thank you

### Estimated Savings (Free Tier)

| Practice | Minutes Saved/Month |
|----------|---------------------|
| Dependency caching | ~180 min |
| Path filtering | ~200 min |
| Concurrency limits | ~150 min |
| Combined jobs | ~100 min |
| **Total saved** | **~630 minutes** |

**Result:** Free tier (2,000 min) → Effective 2,630 min! 🎉

---

**Next**: [Practical CI/CD Project →](./04-cicd-project.md)
