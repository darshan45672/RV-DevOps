# 3️⃣ Git Hands-On Workshop

**Duration**: 3 hours  
**Mode**: Hands-on Practice

---

## 📌 Table of Contents

1. [What is Git?](#what-is-git)
2. [Git Setup](#git-setup)
3. [Core Git Commands](#core-git-commands)
4. [Branching & Merging](#branching--merging)
5. [Git Workflow Best Practices](#git-workflow-best-practices)
6. [Practical Exercises](#practical-exercises)
7. [Common Scenarios](#common-scenarios)

---

## 🔰 What is Git?

**Git** is a **distributed version control system** that tracks changes in source code during development.

### Why Git?

- ✅ **Track changes** - Know who changed what and when
- ✅ **Collaboration** - Multiple developers work simultaneously
- ✅ **Branching** - Work on features in isolation
- ✅ **Backup** - Code is stored remotely (GitHub, GitLab)
- ✅ **History** - Revert to previous versions if needed

### Git vs GitHub

| **Git** | **GitHub** |
|---------|------------|
| Version control tool | Hosting service for Git repositories |
| Runs locally | Cloud-based |
| Command-line tool | Web interface + CLI |
| Created by Linus Torvalds | Owned by Microsoft |

**Alternatives to GitHub**: GitLab, Bitbucket, Azure Repos

---

## ⚙️ Git Setup

### Installation

**macOS:**
```bash
brew install git
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
```

**Windows:**
Download from [git-scm.com](https://git-scm.com/downloads)

### Verify Installation

```bash
git --version
# Output: git version 2.39.0 (or similar)
```

### Initial Configuration

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code --wait"  # VS Code
# OR
git config --global core.editor "nano"         # Nano

# Set default branch name to 'main'
git config --global init.defaultBranch main

# View configuration
git config --list
```

### SSH Key Setup (for GitHub)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

Then add this key to GitHub: **Settings → SSH and GPG keys → New SSH key**

---

## 🛠️ Core Git Commands

### 1. `git init` - Initialize Repository

Creates a new Git repository in the current directory.

```bash
mkdir my-project
cd my-project
git init
```

Output:
```
Initialized empty Git repository in /path/to/my-project/.git/
```

### 2. `git clone` - Clone Remote Repository

```bash
# HTTPS
git clone https://github.com/username/repo.git

# SSH
git clone git@github.com:username/repo.git

# Clone into specific directory
git clone https://github.com/username/repo.git my-folder
```

### 3. `git status` - Check Repository Status

Shows modified, staged, and untracked files.

```bash
git status
```

Example output:
```
On branch main
Changes not staged for commit:
  modified:   README.md

Untracked files:
  new-file.txt
```

### 4. `git add` - Stage Changes

```bash
git add filename.txt           # Add specific file
git add .                      # Add all changes
git add *.js                   # Add all .js files
git add -A                     # Add all (including deletions)
git add -p                     # Interactive staging (choose hunks)
```

**Staging Area**: Intermediate area before committing.

```
Working Directory → (git add) → Staging Area → (git commit) → Repository
```

### 5. `git commit` - Save Changes

```bash
# Commit with message
git commit -m "Add login feature"

# Commit with detailed message
git commit -m "Add user authentication" -m "- Implemented JWT tokens - Added password hashing - Created login endpoint"

# Stage and commit in one command
git commit -am "Fix bug in payment module"

# Amend last commit (change message or add forgotten files)
git commit --amend -m "New commit message"
```

### 6. `git log` - View Commit History

```bash
git log                        # Full log
git log --oneline              # Compact view
git log --graph --oneline      # Visual branch graph
git log --author="John"        # Filter by author
git log --since="2 weeks ago"  # Filter by date
git log -n 5                   # Last 5 commits
git log --stat                 # Show file changes
```

Example output:
```bash
$ git log --oneline --graph
* a1b2c3d (HEAD -> main) Add authentication
* d4e5f6g Implement user model
* g7h8i9j Initial commit
```

### 7. `git diff` - View Changes

```bash
git diff                       # Unstaged changes
git diff --staged              # Staged changes
git diff HEAD                  # All changes since last commit
git diff branch1 branch2       # Compare branches
git diff commit1 commit2       # Compare commits
git diff filename.txt          # Changes in specific file
```

---

## 🌿 Branching & Merging

### Why Branches?

Branches allow you to:
- ✅ Work on features without affecting main code
- ✅ Experiment safely
- ✅ Collaborate without conflicts
- ✅ Keep production code stable

### Branching Commands

#### `git branch` - List/Create Branches

```bash
git branch                     # List local branches
git branch -a                  # List all (local + remote)
git branch feature-login       # Create new branch
git branch -d feature-login    # Delete branch (safe)
git branch -D feature-login    # Force delete
git branch -m old-name new-name # Rename branch
```

#### `git checkout` - Switch Branches

```bash
git checkout feature-login     # Switch to branch
git checkout -b new-feature    # Create and switch in one command
git checkout -                 # Switch to previous branch
```

#### `git switch` (Modern Alternative)

```bash
git switch feature-login       # Switch to branch
git switch -c new-feature      # Create and switch
git switch -                   # Switch to previous branch
```

### Merging

#### `git merge` - Merge Branches

```bash
# Merge feature-login into main
git checkout main
git merge feature-login
```

**Types of Merges:**

1. **Fast-forward merge** (no conflicts):
```
Before:
main:    A---B
               \
feature:        C---D

After fast-forward:
main:    A---B---C---D
```

2. **Three-way merge** (creates merge commit):
```
Before:
main:    A---B---E
               \
feature:        C---D

After merge:
main:    A---B---E---F (merge commit)
               \   /
feature:        C-D
```

### Resolving Merge Conflicts

When Git can't automatically merge:

```bash
git merge feature-login
# Output: CONFLICT (content): Merge conflict in app.js
```

**Steps to resolve:**

1. Open conflicting file:
```javascript
<<<<<<< HEAD
const port = 3000;
=======
const port = 8080;
>>>>>>> feature-login
```

2. Edit to resolve:
```javascript
const port = 8080;  // Choose one or combine
```

3. Stage and commit:
```bash
git add app.js
git commit -m "Resolve merge conflict in app.js"
```

### Rebasing

`git rebase` rewrites commit history to create a linear history.

```bash
git checkout feature-login
git rebase main
```

**Before rebase:**
```
main:    A---B---E
               \
feature:        C---D
```

**After rebase:**
```
main:    A---B---E
                   \
feature:            C'---D'
```

**When to use:**
- ✅ Keeping feature branches up-to-date with main
- ✅ Cleaning up local commit history
- ❌ **NEVER** rebase commits pushed to shared branches

---

## ✅ Git Workflow Best Practices

### 1. Meaningful Commit Messages

❌ **Bad:**
```
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

✅ **Good:**
```
git commit -m "Fix authentication bug in login endpoint"
git commit -m "Add user profile page with avatar upload"
git commit -m "Refactor database connection pool settings"
```

**Format:**
```
<type>: <short description>

<optional detailed description>

<optional footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: Add email notification service

- Implemented SendGrid integration
- Added email templates for password reset
- Created notification queue system

Closes #123
```

### 2. Small, Atomic Commits

✅ **Each commit should:**
- Address one logical change
- Be self-contained
- Pass tests (if applicable)

❌ **Avoid:**
```
git commit -am "Add login, fix bug, update README, refactor utils"
```

✅ **Better:**
```
git commit -m "Add user login endpoint"
git commit -m "Fix JWT token expiration bug"
git commit -m "Update README with API documentation"
git commit -m "Refactor string utilities to separate module"
```

### 3. Feature Branches

Always create a branch for new features:

```bash
git checkout -b feature/user-authentication
# Work on feature
git add .
git commit -m "Implement user authentication"
git checkout main
git merge feature/user-authentication
```

**Branch Naming Conventions:**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Urgent production fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### 4. Avoid Committing Secrets

❌ **NEVER commit:**
- API keys
- Passwords
- Database credentials
- Private SSH keys
- `.env` files with secrets

✅ **Use `.gitignore`:**

Create `.gitignore`:
```
# Environment variables
.env
.env.local

# Dependencies
node_modules/
venv/
__pycache__/

# Build outputs
dist/
build/
*.pyc

# IDE
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db
```

**If you accidentally commit a secret:**
```bash
# Remove from history (DANGEROUS - rewrites history)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret" \
  --prune-empty --tag-name-filter cat -- --all

# Then immediately rotate the exposed secret!
```

### 5. `.gitignore` Best Practices

```bash
# Create .gitignore before first commit
touch .gitignore

# Add patterns
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore

# Commit .gitignore
git add .gitignore
git commit -m "Add .gitignore"
```

**GitHub provides templates:**
[github.com/github/gitignore](https://github.com/github/gitignore)

---

## 💪 Practical Exercises

### Exercise 1: First Repository

```bash
# Create project
mkdir git-workshop
cd git-workshop

# Initialize Git
git init

# Create README
echo "# Git Workshop" > README.md

# Check status
git status

# Stage and commit
git add README.md
git commit -m "Initial commit: Add README"

# View history
git log
```

### Exercise 2: Making Changes

```bash
# Create new file
echo "console.log('Hello, Git!');" > app.js

# Check status
git status

# Stage and commit
git add app.js
git commit -m "Add app.js with hello message"

# Modify file
echo "console.log('Updated!');" >> app.js

# View changes
git diff

# Stage and commit
git add app.js
git commit -m "Update app.js with additional log"

# View history
git log --oneline
```

### Exercise 3: Branching

```bash
# Create and switch to feature branch
git checkout -b feature/add-greeting

# Add new feature
cat > greet.js << EOF
function greet(name) {
    return \`Hello, \${name}!\`;
}
module.exports = greet;
EOF

# Commit
git add greet.js
git commit -m "Add greeting function"

# Switch back to main
git checkout main

# Merge feature
git merge feature/add-greeting

# Delete feature branch
git branch -d feature/add-greeting

# View history
git log --graph --oneline
```

### Exercise 4: Simulating Merge Conflict

```bash
# Create conflict scenario
git checkout -b branch-a
echo "Version A" > conflict.txt
git add conflict.txt
git commit -m "Add version A"

git checkout main
git checkout -b branch-b
echo "Version B" > conflict.txt
git add conflict.txt
git commit -m "Add version B"

# Try to merge (will conflict)
git checkout main
git merge branch-a  # This works
git merge branch-b  # CONFLICT!

# Resolve manually
cat conflict.txt    # See conflict markers
echo "Version B"  > conflict.txt  # Choose one
git add conflict.txt
git commit -m "Resolve merge conflict"
```

### Exercise 5: Working with Remote

```bash
# Create repo on GitHub, then:
git remote add origin git@github.com:username/repo.git

# Push to remote
git push -u origin main

# Clone from remote
cd ..
git clone git@github.com:username/repo.git cloned-repo
cd cloned-repo

# Make changes
echo "Remote change" >> README.md
git add README.md
git commit -m "Update README from clone"
git push

# Pull changes in original repo
cd ../git-workshop
git pull origin main
```

---

## 🔧 Common Scenarios

### Undo Changes

```bash
# Unstage file (keep changes)
git restore --staged filename.txt

# Discard changes in working directory
git restore filename.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert commit (creates new commit)
git revert commit-hash
```

### Stashing Changes

```bash
# Save work-in-progress
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Delete stash
git stash drop stash@{0}
```

### Tagging Releases

```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# List tags
git tag

# Push tags to remote
git push origin v1.0.0
git push origin --tags  # Push all tags
```

### Viewing History

```bash
# Show specific commit
git show commit-hash

# Show files changed in commit
git show --name-only commit-hash

# Search commit messages
git log --grep="bug fix"

# Show who changed each line
git blame filename.txt
```

---

## 🎯 Git Workflow Summary

### Basic Workflow

```bash
# 1. Clone or init
git clone <repo-url>
# OR
git init

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# ... edit files ...

# 4. Stage changes
git add .

# 5. Commit
git commit -m "Add feature description"

# 6. Push to remote
git push origin feature/my-feature

# 7. Merge into main (via Pull Request or locally)
git checkout main
git merge feature/my-feature
git push origin main

# 8. Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

---

## 🏆 Best Practices Checklist

- ✅ Commit **early and often**
- ✅ Write **meaningful commit messages**
- ✅ Use **feature branches**
- ✅ **Pull before you push** to avoid conflicts
- ✅ Use `.gitignore` to exclude unnecessary files
- ✅ **NEVER commit secrets** (API keys, passwords)
- ✅ Review changes with `git diff` before committing
- ✅ Keep commits **small and focused**
- ✅ Use **pull requests** for code review
- ✅ Tag releases with **semantic versioning** (v1.0.0)

---

## 📖 Additional Resources

- [Pro Git Book](https://git-scm.com/book/en/v2) - Free comprehensive guide
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Learn Git Branching](https://learngitbranching.js.org/) - Interactive tutorial
- [Oh Shit, Git!](https://ohshitgit.com/) - Fixing common mistakes
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎉 Day 1 Complete!

Congratulations! You've completed:
- ✅ DevOps theory fundamentals
- ✅ Linux shell basics
- ✅ Git version control

**Tomorrow**: GitHub workflows and CI/CD pipelines!

---

**← Back**: [Linux Basics](./02-linux-basics.md) | **Home**: [Day 1 Overview](./README.md)
