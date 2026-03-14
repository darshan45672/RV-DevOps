# 2️⃣ GitHub Deep Dive

**Duration**: 2 hours  
**Mode**: Hands-on Practice

---

## 📌 Table of Contents

1. [Pull Requests (PRs)](#pull-requests-prs)
2. [Code Reviews](#code-reviews)
3. [Forking Model](#forking-model)
4. [GitHub Issues](#github-issues)
5. [GitHub Projects](#github-projects)
6. [Semantic Versioning](#semantic-versioning)
7. [Branching Strategies](#branching-strategies)

---

## 🔀 Pull Requests (PRs)

### What is a Pull Request?

A **Pull Request (PR)** is a proposal to merge changes from one branch into another. It's the heart of collaborative development on GitHub.

### Why Pull Requests?

- ✅ **Code Review** - Get feedback before merging
- ✅ **Discussion** - Collaborate on implementation
- ✅ **Testing** - Run CI/CD before merge
- ✅ **Documentation** - Track what changed and why
- ✅ **Quality Control** - Maintain code standards

---

### Creating a Pull Request

#### 1. Create a Branch and Make Changes

```bash
# Create feature branch
git checkout -b feature/add-user-profile

# Make changes
echo "User Profile Page" > profile.html
git add profile.html
git commit -m "Add user profile page"

# Push to GitHub
git push origin feature/add-user-profile
```

#### 2. Open PR on GitHub

**Via Web Interface:**
1. Go to your repository on GitHub
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your feature branch
5. Click "Create pull request"

**Via GitHub CLI:**
```bash
gh pr create --title "Add user profile page" \
  --body "Implements user profile with avatar and bio" \
  --base main \
  --head feature/add-user-profile
```

---

### PR Best Practices

#### 1. Write Descriptive Titles

❌ **Bad:**
```
Update files
Fix bug
Changes
```

✅ **Good:**
```
feat: Add user authentication with JWT
fix: Resolve memory leak in file upload
docs: Update API documentation for v2.0
```

#### 2. Provide Detailed Descriptions

**Template Example:**

```markdown
## Description
Implements user profile page with customizable avatar and bio.

## Changes Made
- Created `profile.html` template
- Added `ProfileController` with edit/update methods
- Implemented avatar upload functionality
- Added input validation for bio field (max 500 chars)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manually tested on Chrome, Firefox, Safari

## Screenshots
![Profile Page](./screenshots/profile.png)

## Related Issues
Closes #42
Related to #38

## Breaking Changes
None

## Additional Notes
- Avatar images are stored in `/uploads/avatars/`
- Maximum file size: 2MB
```

#### 3. Keep PRs Small

✅ **Ideal PR size:**
- **< 200 lines changed** - Easy to review
- **Single purpose** - One feature/fix per PR
- **Focused** - Related changes only

❌ **Avoid:**
- Mixing multiple features
- Including unrelated refactoring
- Changing 1000+ lines in one PR

---

### PR Workflow

```
1. Create Branch        →  feature/new-feature
2. Make Changes         →  git commit -m "..."
3. Push to Remote       →  git push origin feature/new-feature
4. Open Pull Request    →  On GitHub
5. Code Review          →  Reviewers comment
6. Address Feedback     →  Make changes, push again
7. Approval             →  Reviewers approve
8. CI/CD Passes         →  All checks green ✅
9. Merge                →  Merge into main
10. Delete Branch       →  Clean up
```

---

### PR Types and Labels

Use labels to categorize PRs:

- 🆕 `feature` - New functionality
- 🐛 `bugfix` - Bug fixes
- 📝 `documentation` - Docs only
- 🎨 `style` - Code style/formatting
- ♻️ `refactor` - Code refactoring
- ⚡ `performance` - Performance improvements
- 🔒 `security` - Security patches
- 🚨 `hotfix` - Urgent production fix

---

### Draft Pull Requests

Create a draft PR for early feedback:

```bash
gh pr create --draft --title "WIP: Add search feature"
```

**When to use:**
- Getting early feedback
- Showing work in progress
- Running CI tests before review
- Collaborative brainstorming

**Convert to ready:**
```bash
gh pr ready <pr-number>
```

---

## 👀 Code Reviews

### Why Code Review?

- 🐛 **Find bugs** - Catch issues before production
- 📚 **Knowledge sharing** - Learn from each other
- 📏 **Maintain standards** - Consistent code quality
- 🤝 **Team collaboration** - Shared ownership
- 📖 **Documentation** - Discuss decisions

---

### How to Review Code

#### 1. Review the Description

- Understand what the PR does
- Check if it solves the stated problem
- Verify tests are included

#### 2. Review the Code

**Look for:**

✅ **Functionality**
- Does it work as intended?
- Are edge cases handled?
- Any potential bugs?

✅ **Readability**
- Is the code easy to understand?
- Are variable names clear?
- Is it well-organized?

✅ **Performance**
- Any performance issues?
- Efficient algorithms?
- Database query optimization?

✅ **Security**
- Input validation?
- SQL injection risks?
- Authentication/authorization?

✅ **Testing**
- Are tests included?
- Do tests cover edge cases?
- Are tests meaningful?

#### 3. Leave Constructive Comments

❌ **Bad feedback:**
```
This is wrong.
Bad code.
Why did you do this?
```

✅ **Good feedback:**
```
Consider using a more descriptive variable name here. 
`userData` would be clearer than `d`.

This function might throw an error if `user` is null. 
Could we add a null check?

Great approach to error handling! This makes debugging 
much easier.
```

---

### Review Comment Types

#### **Suggestions (Code Suggestions)**

```javascript
// Instead of:
const result = data.map(function(item) {
  return item.id;
});

// Suggestion:
const result = data.map(item => item.id);
```

GitHub allows inserting code suggestions reviewers can apply with one click.

#### **Questions**

> Why did we choose Redis over Memcached here?

#### **Nitpicks (Minor)**

> Nit: Missing space after comma

Use "nit" for very minor issues that don't block approval.

#### **Blocking Issues**

> ⚠️ **Blocking:** This introduces a security vulnerability. 
> User input is not sanitized before database query.

---

### Responding to Reviews

#### As PR Author:

1. **Thank reviewers**
   ```
   Thanks for catching that! Fixed in abc123.
   ```

2. **Address each comment**
   - Fix issues
   - Explain decisions
   - Ask for clarification

3. **Push changes**
   ```bash
   # Make fixes
   git add .
   git commit -m "Address review feedback"
   git push origin feature-branch
   ```

4. **Request re-review**
   ```bash
   gh pr review <pr-number> --request-changes
   ```

#### As Reviewer:

1. **Approve** - Code looks good ✅
   ```bash
   gh pr review <pr-number> --approve
   ```

2. **Request Changes** - Issues need fixing ⚠️
   ```bash
   gh pr review <pr-number> --request-changes
   ```

3. **Comment** - Feedback without approval/rejection 💬
   ```bash
   gh pr review <pr-number> --comment
   ```

---

### Code Review Checklist

```markdown
## Code Review Checklist

### Functionality
- [ ] Code does what it's supposed to
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality
- [ ] Code is readable and maintainable
- [ ] No code duplication
- [ ] Functions are focused and small
- [ ] Naming is clear and consistent

### Testing
- [ ] Tests are included
- [ ] Tests cover main scenarios
- [ ] Tests cover edge cases
- [ ] All tests pass

### Security
- [ ] Input is validated
- [ ] No SQL injection risks
- [ ] Authentication is checked
- [ ] Sensitive data is protected

### Performance
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] No N+1 query problems

### Documentation
- [ ] Code comments where needed
- [ ] README updated if needed
- [ ] API docs updated if needed
```

---

## 🍴 Forking Model

### What is Forking?

**Forking** creates a complete copy of a repository under your account.

### When to Fork?

- ✅ Contributing to open source
- ✅ You don't have write access
- ✅ Experimenting with someone's code
- ✅ Creating your own variant

---

### Fork vs Clone

| **Fork** | **Clone** |
|---------|----------|
| Creates copy on GitHub | Downloads to local machine |
| Under your account | No GitHub copy |
| Can create PRs | Can't create PRs (without push access) |
| Independent repository | Linked to original |

---

### Forking Workflow

#### 1. Fork the Repository

**On GitHub:**
1. Go to repository
2. Click "Fork" button (top right)
3. Select your account

**Via CLI:**
```bash
gh repo fork owner/repository
```

#### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/repository.git
cd repository
```

#### 3. Add Upstream Remote

```bash
# Add original repo as upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/repository.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/repository.git
# upstream  https://github.com/ORIGINAL-OWNER/repository.git
```

#### 4. Create Feature Branch

```bash
git checkout -b feature/my-contribution
```

#### 5. Make Changes and Commit

```bash
# Make changes
git add .
git commit -m "Add my contribution"
```

#### 6. Keep Fork Synced

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

#### 7. Push Feature Branch

```bash
git push origin feature/my-contribution
```

#### 8. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Ensure base is `original-owner/main`
4. Ensure compare is `your-username/feature-branch`
5. Fill in PR details
6. Submit

---

### Syncing Your Fork (Automated)

**Via GitHub Web:**
1. Go to your fork
2. Click "Sync fork"
3. Click "Update branch"

**Via CLI:**
```bash
gh repo sync owner/repository
```

---

## 📝 GitHub Issues

### What are Issues?

**Issues** track bugs, feature requests, tasks, and discussions.

### Creating Good Issues

#### Bug Report Template

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to login page
2. Enter username: test@example.com
3. Leave password blank
4. Click login

## Expected Behavior
Should show "Password required" error.

## Actual Behavior
Page crashes with 500 error.

## Environment
- Browser: Chrome 120
- OS: macOS 14.1
- App Version: 2.3.1

## Screenshots
![Error Screenshot](link-to-image)

## Additional Context
This only happens when username contains special characters.
```

#### Feature Request Template

```markdown
## Feature Description
Add ability to export user data as CSV.

## Problem It Solves
Users need to analyze their data in Excel/Sheets.

## Proposed Solution
Add "Export CSV" button on user dashboard.

## Alternatives Considered
- JSON export (too technical for users)
- PDF export (not suitable for data analysis)

## Additional Context
This has been requested by 15+ users.
```

---

### Issue Labels

Common label categories:

- **Type:** `bug`, `feature`, `documentation`, `question`
- **Priority:** `critical`, `high`, `medium`, `low`
- **Status:** `in progress`, `blocked`, `needs review`
- **Difficulty:** `good first issue`, `help wanted`, `expert`

---

### Linking Issues to PRs

In PR description or commits:

```markdown
Closes #42
Fixes #123
Resolves #456
Related to #789
```

When PR merges, linked issues auto-close.

---

## 📊 GitHub Projects

### What are GitHub Projects?

**Projects** are Kanban-style boards for organizing work.

### Creating a Project

1. Go to repository → "Projects" tab
2. Click "New project"
3. Choose template (Kanban, table, etc.)
4. Add columns (e.g., To Do, In Progress, Done)

### Project Columns

**Classic setup:**
```
📋 Backlog  →  🎯 To Do  →  🚧 In Progress  →  👀 Review  →  ✅ Done
```

### Automation

Set up automation rules:

- **New issues** → Automatically to "To Do"
- **PR opened** → Move to "In Progress"
- **PR merged** → Move to "Done"
- **Issue closed** → Move to "Done"

---

## 📦 Semantic Versioning

### Version Format

```
MAJOR.MINOR.PATCH
  │     │     └─ Bug fixes (backwards compatible)
  │     └─────── New features (backwards compatible)
  └───────────── Breaking changes (not backwards compatible)
```

### Examples

- `1.0.0` → Initial release
- `1.1.0` → Added new API endpoint (compatible)
- `1.1.1` → Fixed bug in API (compatible)
- `2.0.0` → Changed API format (BREAKING)

### Pre-release Versions

- `1.0.0-alpha.1` → Alpha release
- `1.0.0-beta.2` → Beta release
- `1.0.0-rc.1` → Release candidate

### Version Bumping Rules

Given version `1.2.3`:

| Change Type | New Version | Example |
|------------|-------------|---------|
| Bug fix | `1.2.4` | Fixed login error |
| New feature (compatible) | `1.3.0` | Added export feature |
| Breaking change | `2.0.0` | Changed API structure |

---

## 🌳 Branching Strategies

### 1. GitHub Flow (Recommended for Beginners)

**Simple and effective for continuous deployment.**

```
main (production-ready)
  ├─ feature/user-auth
  ├─ bugfix/login-error
  └─ feature/dashboard
```

**Workflow:**
1. Create branch from `main`
2. Work and commit
3. Open PR
4. Review and test
5. Merge to `main`
6. Deploy immediately

**Pros:**
- ✅ Simple
- ✅ Fast deployment
- ✅ Easy to understand

**Cons:**
- ❌ Not ideal for multiple versions
- ❌ No release staging

**Best for:**
- Web apps
- SaaS products
- Continuous deployment

---

### 2. Git Flow

**More complex, with dedicated release branches.**

```
main (production releases)
  └─ develop (integration)
      ├─ feature/user-auth
      ├─ feature/dashboard
      └─ release/v2.0
      └─ hotfix/critical-bug
```

**Branches:**

- `main` - Production releases only
- `develop` - Integration branch
- `feature/*` - New features
- `release/*` - Release preparation
- `hotfix/*` - Emergency fixes

**Workflow:**

1. Feature Development:
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # Work
   git checkout develop
   git merge feature/new-feature
   ```

2. Release:
   ```bash
   git checkout -b release/v1.2.0 develop
   # Final testing, version bumps
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git checkout develop
   git merge release/v1.2.0
   ```

3. Hotfix:
   ```bash
   git checkout -b hotfix/critical-bug main
   # Fix
   git checkout main
   git merge hotfix/critical-bug
   git tag v1.2.1
   git checkout develop
   git merge hotfix/critical-bug
   ```

**Pros:**
- ✅ Clear release management
- ✅ Supports multiple versions
- ✅ Organized hotfixes

**Cons:**
- ❌ Complex
- ❌ Slower releases
- ❌ More branches to manage

**Best for:**
- Desktop software
- Mobile apps
- Scheduled releases

---

### 3. Trunk-Based Development

**Everyone commits to `main`, uses feature flags.**

```
main (always deployable)
  ├─ short-lived feature branch (< 1 day)
  └─ merge frequently
```

**Characteristics:**
- Very short-lived branches
- Frequent integration
- Feature flags for incomplete features
- High level of automation

**Best for:**
- Teams with strong CI/CD
- High deployment frequency
- Mature testing practices

---

### Choosing a Strategy

| **Team/Project** | **Recommended Strategy** |
|-----------------|------------------------|
| Small team, web app | GitHub Flow |
| Mobile/desktop app | Git Flow |
| Large team, microservices | Trunk-Based |
| Open source project | GitHub Flow + Forks |
| Scheduled releases | Git Flow |
| Continuous deployment | GitHub Flow or Trunk-Based |

---

## 🎯 Summary

### Key Takeaways

1. **Pull Requests**
   - Central to GitHub collaboration
   - Include description, tests, screenshots
   - Keep them small and focused

2. **Code Reviews**
   - Essential for quality
   - Be constructive and specific
   - Use checklists

3. **Forking**
   - For open source contributions
   - Keep fork synced with upstream
   - PR from fork to original

4. **Issues**
   - Track bugs and features
   - Use templates
   - Link to PRs

5. **Semantic Versioning**
   - MAJOR.MINOR.PATCH
   - Communicate changes clearly
   - Tag releases

6. **Branching Strategies**
   - Choose based on team/project needs
   - GitHub Flow for simplicity
   - Git Flow for release management

---

## 📖 Further Reading

- [GitHub Docs - Pull Requests](https://docs.github.com/en/pull-requests)
- [About Code Reviews](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)
- [Forking Workflow](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [Git Flow Original Post](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

---

**Next**: [Mini Project →](./03-mini-project.md)
