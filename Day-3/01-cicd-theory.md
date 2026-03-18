# 1️⃣ CI/CD Theory & Fundamentals

**Duration**: 2 hours  
**Mode**: Theory + Discussion

---

## 📌 Table of Contents

1. [Why CI/CD?](#why-cicd)
2. [Pipeline Stages](#pipeline-stages)
3. [Artifacts](#artifacts)
4. [Rollbacks](#rollbacks)
5. [Deployment Strategies](#deployment-strategies)
6. [CI/CD Best Practices](#cicd-best-practices)

---

## 🚀 Why CI/CD?

### The Problem Without CI/CD

**Traditional Development Flow:**
```
Developer writes code → Manual build → Manual testing → Wait for QA
→ Manual deployment → Hope nothing breaks → Manual rollback if it does
```

**Problems:**
- ❌ Slow feedback (days or weeks)
- ❌ Human errors in deployment
- ❌ "Works on my machine" syndrome
- ❌ Fear of deploying
- ❌ Integration nightmares
- ❌ Difficult rollbacks

### The Solution: CI/CD

**Automated Flow:**
```
Code push → Auto build → Auto test → Auto deploy → Monitor → Rollback if needed
```

**Benefits:**
- ✅ **Fast feedback** - Know in minutes if code works
- ✅ **Confidence** - Automated tests catch issues
- ✅ **Frequent releases** - Deploy multiple times per day
- ✅ **Reduced risk** - Small changes are easier to fix
- ✅ **Consistency** - Same process every time
- ✅ **Developer productivity** - Focus on features, not deployment

---

## 🔄 Pipeline Stages

### Complete CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     CI/CD PIPELINE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CODE → BUILD → TEST → PACKAGE → DEPLOY → MONITOR          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. **CODE** 💻

**What happens:**
- Developer writes code
- Commits to version control
- Opens pull request

**Actions:**
- Linting and code formatting
- Static code analysis
- Security scanning

**Tools:**
- ESLint, Pylint, RuboCop
- SonarQube, CodeQL
- SAST scanners

**Example checks:**
```yaml
# Linting
- Run ESLint on JavaScript
- Check PEP 8 compliance for Python
- Verify code formatting

# Security
- Check for hardcoded secrets
- Scan dependencies for vulnerabilities
- Static security analysis
```

---

### 2. **BUILD** 🏗️

**What happens:**
- Compile source code (if needed)
- Install dependencies
- Generate artifacts

**For Different Languages:**

**JavaScript/Node.js:**
```bash
npm ci                    # Clean install dependencies
npm run build            # Build production bundle
```

**Python:**
```bash
pip install -r requirements.txt
python setup.py build
```

**Java:**
```bash
mvn clean install
gradle build
```

**Go:**
```bash
go build -o app
```

**Build Artifacts:**
- Compiled binaries
- Bundled JavaScript
- JAR/WAR files
- Docker images

---

### 3. **TEST** 🧪

**Test Pyramid:**
```
        ┌─────────┐
        │   E2E   │  (Few, slow, expensive)
        ├─────────┤
        │Integration│ (Some, medium speed)
        ├─────────┤
        │   Unit   │  (Many, fast, cheap)
        └─────────┘
```

**Unit Tests:**
- Test individual functions/methods
- Fast execution (milliseconds)
- Mock dependencies
- High coverage (80%+)

```javascript
// Example: Jest unit test
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

**Integration Tests:**
- Test component interactions
- Database, API calls
- Medium speed (seconds)

```python
# Example: Integration test
def test_user_creation():
    response = client.post('/api/users', json={'name': 'Alice'})
    assert response.status_code == 201
    assert User.query.count() == 1
```

**End-to-End (E2E) Tests:**
- Test complete user flows
- Browser automation
- Slow (minutes)

```javascript
// Example: Cypress E2E test
it('should complete checkout', () => {
  cy.visit('/products');
  cy.get('.add-to-cart').click();
  cy.get('.checkout').click();
  cy.get('#payment').type('4111111111111111');
  cy.get('#submit').click();
  cy.contains('Order confirmed');
});
```

**Test Coverage:**
- Aim for 80%+ code coverage
- Focus on critical paths
- Don't chase 100% (diminishing returns)

---

### 4. **PACKAGE** 📦

**What happens:**
- Create deployable artifacts
- Version artifacts
- Store in registry

**Packaging Options:**

**Docker Image:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Benefits of Docker:**
- ✅ Consistent environments
- ✅ Portable across platforms
- ✅ Version controlled
- ✅ Easy rollback

**Other Package Types:**
- **npm packages** - JavaScript libraries
- **PyPI packages** - Python modules
- **JAR/WAR files** - Java applications
- **Binaries** - Compiled executables
- **ZIP/TAR archives** - Application bundles

**Artifact Storage:**
- Docker Hub / GitHub Container Registry
- npm registry
- PyPI
- Artifactory / Nexus
- AWS S3 / Azure Blob Storage

---

### 5. **DEPLOY** 🚀

**Deployment Environments:**

```
Development → Staging → Production
    (Test)    (Pre-prod)  (Live users)
```

**Development:**
- Feature testing
- Integration testing
- Frequent deployments
- May be unstable

**Staging:**
- Production-like environment
- Final testing before release
- Performance testing
- Security testing

**Production:**
- Live users
- Monitored 24/7
- Requires approval
- Careful deployment

**Deployment Methods:**

1. **Manual Deployment** (Traditional)
   - SSH into server
   - Pull code
   - Restart service
   - ❌ Error-prone, slow

2. **Automated Deployment** (Modern)
   - Push button or auto-trigger
   - Automated process
   - Consistent every time
   - ✅ Fast, reliable

---

### 6. **MONITOR** 📊

**What to Monitor:**

**Application Metrics:**
- Request rate
- Response time
- Error rate
- CPU/Memory usage

**Business Metrics:**
- User signups
- Revenue
- Conversion rate
- Active users

**Alerts:**
- Error rate > 5%
- Response time > 1 second
- CPU > 80%
- Memory usage > 90%

**Monitoring Tools:**
- Prometheus + Grafana
- Datadog
- New Relic
- AWS CloudWatch
- Azure Monitor

**Logging:**
- Centralized logging (ELK, Splunk)
- Structured logs (JSON)
- Log levels (DEBUG, INFO, WARN, ERROR)

---

## 📦 Artifacts

### What are Artifacts?

**Artifacts** are files produced during the CI/CD pipeline that are needed for deployment or later stages.

### Types of Artifacts

**Build Artifacts:**
- Compiled code
- Bundled assets
- Generated files

**Test Artifacts:**
- Test reports
- Coverage reports
- Screenshots (E2E tests)
- Performance benchmarks

**Deployment Artifacts:**
- Docker images
- Application packages
- Configuration files

### Artifact Management

**Storage:**
```yaml
# GitHub Actions example
- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: dist/
    retention-days: 7
```

**Download in later job:**
```yaml
- name: Download artifact
  uses: actions/download-artifact@v3
  with:
    name: build-output
```

**Best Practices:**
- Version artifacts (semantic versioning)
- Tag with git commit SHA
- Set retention policies (save storage costs)
- Compress large artifacts

---

## ⏪ Rollbacks

### Why Rollback?

- Bug discovered in production
- Performance degradation
- Security vulnerability
- Breaking changes

### Rollback Strategies

#### 1. **Rollback to Previous Version**

**Traditional approach:**
```bash
# Deploy previous version
docker pull myapp:v1.2.3  # Previous stable version
docker stop myapp-current
docker run myapp:v1.2.3
```

**Time to rollback:** 2-5 minutes

#### 2. **Blue-Green with Instant Switch**

Keep old version running, instant switch:
```bash
# Already running: blue (v1.2.3) and green (v1.2.4)
# If v1.2.4 has issues:
# Switch traffic back to blue
# Time: < 10 seconds
```

#### 3. **Canary Rollback**

Stop rolling out new version:
```bash
# Currently: 90% old, 10% new
# Rollback: Set to 100% old, 0% new
# Time: Immediate
```

#### 4. **Database Rollback** (Complex!)

**Challenges:**
- Can't "undo" data changes
- Migrations are one-way
- May require data recovery

**Solutions:**
- **Backward compatible migrations** - Old code works with new schema
- **Feature flags** - Disable features without code changes
- **Data versioning** - Keep historical data

### Rollback Best Practices

✅ **Always test rollback procedure**
✅ **Automate rollback**
✅ **Monitor after rollback**
✅ **Document rollback steps**
✅ **Have rollback SLA** (e.g., < 5 minutes)

---

## 🎯 Deployment Strategies

### 1. **Recreate (Simplest)**

**Process:**
```
Version 1 → Shutdown → Deploy Version 2 → Startup
```

**Characteristics:**
- ⏱️ **Downtime:** Yes (full shutdown)
- 💰 **Cost:** Low (only one version running)
- 🔄 **Rollback:** Redeploy old version

**When to use:**
- Development environments
- Acceptable downtime
- Budget constraints

---

### 2. **Rolling Update**

**Process:**
```
┌─────────────────────────────────────────┐
│ Update servers one by one:              │
│                                         │
│ Server 1: v1 → v2 ✅                     │
│ Server 2: v1 → v2 ✅                     │
│ Server 3: v1 → v2 ✅                     │
│ Server 4: v1 → v2 ✅                     │
└─────────────────────────────────────────┘
```

**Characteristics:**
- ⏱️ **Downtime:** No
- 💰 **Cost:** Low (no extra resources)
- 🔄 **Rollback:** Reverse rolling update

**When to use:**
- Production with multiple instances
- Zero downtime required
- Limited resources

**Kubernetes example:**
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
```

---

### 3. **Blue-Green Deployment**

**Setup:**
```
┌─────────────────┐       ┌─────────────────┐
│  BLUE (v1)      │       │  GREEN (v2)     │
│  Production     │       │  Idle/Testing   │
└─────────────────┘       └─────────────────┘
         ↑                         ↑
         │                         │
    Load Balancer ────────────────┘
         │
    (Switch traffic)
```

**Process:**
1. **Blue** serves all traffic (v1)
2. Deploy **Green** with v2
3. Test Green thoroughly
4. **Switch** traffic from Blue to Green
5. Keep Blue running (instant rollback)
6. After confidence, shutdown Blue

**Characteristics:**
- ⏱️ **Downtime:** No (instant switch)
- 💰 **Cost:** High (2x resources temporarily)
- 🔄 **Rollback:** Instant (switch back)

**When to use:**
- Critical applications
- Need instant rollback
- Can afford double resources

---

### 4. **Canary Deployment**

**Process:**
```
Step 1: 95% v1, 5% v2    (Canary)
        ↓ (Monitor)
Step 2: 90% v1, 10% v2
        ↓ (Monitor)
Step 3: 75% v1, 25% v2
        ↓ (Monitor)
Step 4: 50% v1, 50% v2
        ↓ (Monitor)
Step 5: 0% v1, 100% v2   (Complete)
```

**Characteristics:**
- ⏱️ **Downtime:** No
- 💰 **Cost:** Medium (gradual)
- 🔄 **Rollback:** Stop rollout, revert %
- 🔍 **Risk:** Very low (limited blast radius)

**When to use:**
- Large user base
- Risk-averse deployments
- A/B testing new features

**Metrics to monitor:**
- Error rate comparison
- Response time comparison
- User complaints
- Business metrics

---

### 5. **Feature Flags / Toggles**

**Concept:**
Deploy code with features turned OFF, enable gradually.

```javascript
// Code example
if (featureFlags.isEnabled('newCheckout')) {
  return <NewCheckoutFlow />;
} else {
  return <OldCheckoutFlow />;
}
```

**Benefits:**
- ✅ Deploy without enabling
- ✅ Enable for specific users (beta testers)
- ✅ Instant rollback (toggle off)
- ✅ A/B testing
- ✅ Gradual rollout

**Tools:**
- LaunchDarkly
- Unleash
- ConfigCat
- Custom solution

---

## 📋 CI/CD Best Practices

### 1. **Commit Often, Deploy Often**

✅ Small, frequent changes
✅ Easier to debug
✅ Faster feedback
✅ Lower risk

### 2. **Automate Everything**

✅ Testing
✅ Building
✅ Deployment
✅ Rollback
✅ Monitoring

### 3. **Fail Fast**

Run fastest tests first:
```
1. Linting (seconds)
2. Unit tests (seconds)
3. Integration tests (minutes)
4. E2E tests (minutes)
```

Stop pipeline on first failure.

### 4. **Make Pipeline Fast**

**Targets:**
- Linting: < 1 minute
- Unit tests: < 5 minutes
- Integration tests: < 10 minutes
- Full pipeline: < 15 minutes

**Optimization:**
- Parallel execution
- Dependency caching
- Test only changed code
- Use faster runners

### 5. **Security in Pipeline**

✅ Scan dependencies for vulnerabilities
✅ Static security analysis
✅ Container image scanning
✅ Secret scanning
✅ Compliance checks

### 6. **Monitoring & Alerting**

✅ Monitor pipeline health
✅ Track deployment frequency
✅ Track failure rate
✅ Track recovery time
✅ Set up alerts

### 7. **Documentation**

✅ Document pipeline stages
✅ Runbook for failures
✅ Rollback procedures
✅ Deployment checklist

---

## 🎯 CI/CD Metrics

### DORA Metrics (Industry Standard)

**1. Deployment Frequency**
- How often do you deploy?
- Elite: Multiple times per day
- High: Once per day to once per week
- Medium: Once per week to once per month
- Low: Less than once per month

**2. Lead Time for Changes**
- Time from commit to production
- Elite: < 1 hour
- High: < 1 day
- Medium: < 1 week
- Low: > 1 month

**3. Change Failure Rate**
- % of deployments causing failure
- Elite: 0-15%
- High: 16-30%
- Medium: 31-45%
- Low: > 45%

**4. Time to Restore Service**
- Recovery time after failure
- Elite: < 1 hour
- High: < 1 day
- Medium: < 1 week
- Low: > 1 week

---

## 🎓 Summary

### CI/CD in One Sentence
> Automate everything from code commit to production deployment, enabling fast, reliable, and frequent releases.

### Key Takeaways

1. ✅ **CI/CD = Speed + Reliability**
2. ✅ **Pipeline stages:** Code → Build → Test → Package → Deploy → Monitor
3. ✅ **Artifacts** are crucial for reproducibility
4. ✅ **Rollbacks** must be fast and tested
5. ✅ **Deployment strategies** reduce risk:
   - Recreate (simple, downtime)
   - Rolling (no downtime, gradual)
   - Blue-Green (instant switch)
   - Canary (minimal risk)
6. ✅ **Best practices:** Automate, fail fast, monitor

---

## 💡 Discussion Questions

1. How would CI/CD benefit your current project?
2. What deployment strategy would you choose and why?
3. How would you handle database migrations in CI/CD?
4. What's your acceptable pipeline execution time?
5. How would you measure CI/CD success?

---

**Next**: [GitHub Actions Deep Dive →](./02-github-actions.md)
