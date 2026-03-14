# 1️⃣ Advanced Git Techniques

**Duration**: 4 hours  
**Mode**: Hands-on Practice

---

## 📌 Table of Contents

1. [Merge vs Rebase](#merge-vs-rebase)
2. [Resolving Merge Conflicts](#resolving-merge-conflicts)
3. [Git Stash](#git-stash)
4. [Git Cherry-Pick](#git-cherry-pick)
5. [Reset vs Revert](#reset-vs-revert)
6. [Tagging Versions](#tagging-versions)
7. [Practical Exercises](#practical-exercises)

---

## 🔀 Merge vs Rebase

### Understanding the Difference

Both `merge` and `rebase` integrate changes from one branch into another, but they do it **differently**.

### Git Merge

**Merge** creates a new "merge commit" that combines two branches.

```bash
git checkout main
git merge feature-branch
```

**Visual Representation:**

```
Before merge:
main:        A---B---C
                  \
feature:           D---E

After merge:
main:        A---B---C-------F (merge commit)
                  \         /
feature:           D---E---
```

**Characteristics:**
- ✅ **Non-destructive** - Preserves complete history
- ✅ **Traceable** - Clear when features were merged
- ✅ **Safe** - No history rewriting
- ❌ **Cluttered** - Many merge commits can make history messy
- ❌ **Harder to read** - Complex graph with many branches

---

### Git Rebase

**Rebase** rewrites history by moving commits to a new base.

```bash
git checkout feature-branch
git rebase main
```

**Visual Representation:**

```
Before rebase:
main:        A---B---C
                  \
feature:           D---E

After rebase:
main:        A---B---C
                        \
feature:                 D'---E'
```

**Characteristics:**
- ✅ **Clean history** - Linear, easy to follow
- ✅ **No merge commits** - Cleaner git log
- ✅ **Easier bisect** - Simpler to find bugs
- ❌ **Rewrites history** - Can cause issues if already pushed
- ❌ **Conflicts** - May need to resolve conflicts multiple times

---

### When to Use What?

| **Scenario** | **Use** | **Why** |
|-------------|---------|---------|
| **Feature branch not yet pushed** | Rebase | Clean history |
| **Shared/public branch** | Merge | Don't rewrite shared history |
| **Long-lived feature branch** | Rebase regularly | Keep up-to-date with main |
| **Release branches** | Merge | Preserve release history |
| **Hotfixes** | Merge | Quick, traceable fixes |
| **Local cleanup** | Rebase | Clean commits before pushing |

---

### Merge Workflow

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/user-auth

# Work on feature
# ... make changes ...
git add .
git commit -m "Add authentication module"

# Merge into main
git checkout main
git merge feature/user-auth
git push origin main
```

---

### Rebase Workflow

```bash
# Update main
git checkout main
git pull origin main

# Rebase feature branch onto latest main
git checkout feature/user-auth
git rebase main

# If conflicts occur, resolve them:
# ... fix conflicts ...
git add .
git rebase --continue

# Force push (only if not shared!)
git push origin feature/user-auth --force-with-lease
```

---

### Interactive Rebase

Clean up commits before merging:

```bash
git rebase -i HEAD~3  # Edit last 3 commits
```

**Interactive rebase options:**
```
pick 1a2b3c4 Add login form
squash 5d6e7f8 Fix typo in login
reword 9g0h1i2 Add validation

# Commands:
# p, pick = use commit
# r, reword = use commit, but edit message
# e, edit = use commit, but stop for amending
# s, squash = merge into previous commit
# f, fixup = like squash but discard commit message
# d, drop = remove commit
```

---

### Golden Rule of Rebasing

> **NEVER rebase commits that have been pushed to a shared/public branch!**

**Safe:**
```bash
# Rebasing your local feature branch
git checkout my-feature
git rebase main  # ✅ OK - your local branch
```

**Dangerous:**
```bash
# Rebasing a shared branch
git checkout main
git rebase feature  # ❌ DANGEROUS - rewrites shared history
```

---

## ⚔️ Resolving Merge Conflicts

### What Causes Conflicts?

Conflicts occur when:
- Same lines modified in different branches
- File deleted in one branch, modified in another
- Binary files changed differently

### Conflict Markers

When a conflict occurs, Git marks the file:

```javascript
<<<<<<< HEAD (Current Branch)
const port = 3000;
=======
const port = 8080;
>>>>>>> feature-branch (Incoming Changes)
```

**Anatomy:**
- `<<<<<<< HEAD` - Your current branch
- `=======` - Separator
- `>>>>>>> feature-branch` - Incoming changes

---

### Resolving Conflicts Step-by-Step

#### 1. Attempt merge and encounter conflict

```bash
git checkout main
git merge feature-login

# Output:
# Auto-merging app.js
# CONFLICT (content): Merge conflict in app.js
# Automatic merge failed; fix conflicts and then commit the result.
```

#### 2. Check conflict status

```bash
git status

# Output:
# Unmerged paths:
#   both modified:   app.js
```

#### 3. Open and resolve conflicts

```javascript
// Before resolution:
<<<<<<< HEAD
const port = process.env.PORT || 3000;
const dbHost = 'localhost';
=======
const port = 8080;
const dbHost = 'production-db.example.com';
>>>>>>> feature-login

// After resolution (combine both):
const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST || 'localhost';
```

#### 4. Stage resolved files

```bash
git add app.js
```

#### 5. Complete the merge

```bash
git commit -m "Merge feature-login, resolved port configuration"
```

---

### Conflict Resolution Tools

#### VS Code (Built-in)

VS Code highlights conflicts with options:
- **Accept Current Change**
- **Accept Incoming Change**
- **Accept Both Changes**
- **Compare Changes**

#### Command Line Tools

```bash
# Use merge tool
git mergetool

# Use specific tool
git mergetool --tool=vimdiff
```

#### Abort Merge

If you want to start over:

```bash
git merge --abort
```

---

### Rebase Conflicts

Conflicts during rebase work differently:

```bash
git rebase main

# CONFLICT: ... 

# Fix conflicts, then:
git add .
git rebase --continue

# Skip this commit (if needed):
git rebase --skip

# Abort rebase:
git rebase --abort
```

---

## 💼 Git Stash

### What is Stash?

**Stash** temporarily saves uncommitted changes so you can work on something else.

### Basic Stash Commands

#### Save Work-in-Progress

```bash
# Stash changes
git stash

# Stash with message
git stash save "WIP: authentication feature"

# Include untracked files
git stash -u

# Include all files (even ignored)
git stash -a
```

#### List Stashes

```bash
git stash list

# Output:
# stash@{0}: WIP: authentication feature
# stash@{1}: On main: bug fix attempt
# stash@{2}: WIP: refactoring
```

#### Apply Stashed Changes

```bash
# Apply most recent stash
git stash pop

# Apply specific stash (keeps it in stash list)
git stash apply stash@{1}

# Apply and remove specific stash
git stash pop stash@{1}
```

#### View Stash Contents

```bash
# Show latest stash
git stash show

# Show with diff
git stash show -p

# Show specific stash
git stash show stash@{1}
```

#### Delete Stashes

```bash
# Drop specific stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

---

### Practical Stash Scenarios

#### Scenario 1: Switch Branches Mid-Work

```bash
# Working on feature
git checkout feature-branch
# ... make changes ...

# Urgent bug fix needed!
git stash save "WIP: half-done feature"
git checkout main
# ... fix bug ...
git commit -am "Fix critical bug"

# Return to feature
git checkout feature-branch
git stash pop
# Continue work
```

#### Scenario 2: Test Changes on Different Branch

```bash
# Working on experiment
git stash
git checkout test-branch
git stash pop
# Test changes here
git stash  # Save again
git checkout original-branch
git stash pop
```

#### Scenario 3: Create Branch from Stash

```bash
git stash
git stash branch new-feature-branch
# Creates new branch and applies stash
```

---

## 🍒 Git Cherry-Pick

### What is Cherry-Pick?

**Cherry-pick** applies specific commits from one branch to another.

### Basic Cherry-Pick

```bash
# On target branch
git checkout main

# Cherry-pick specific commit
git cherry-pick abc1234
```

**Visual:**
```
main:     A---B---C
               \
feature:        D---E---F

After cherry-pick E:
main:     A---B---C---E'
               \
feature:        D---E---F
```

---

### Cherry-Pick Multiple Commits

```bash
# Cherry-pick range (exclusive)
git cherry-pick abc1234..def5678

# Cherry-pick multiple specific commits
git cherry-pick abc1234 def5678 ghi9012
```

---

### Cherry-Pick Options

```bash
# Cherry-pick without committing
git cherry-pick -n abc1234
git cherry-pick --no-commit abc1234

# Edit commit message
git cherry-pick -e abc1234

# Cherry-pick and sign-off
git cherry-pick -s abc1234
```

---

### Handling Cherry-Pick Conflicts

```bash
git cherry-pick abc1234

# If conflict occurs:
# ... resolve conflicts ...
git add .
git cherry-pick --continue

# Skip this commit
git cherry-pick --skip

# Abort cherry-pick
git cherry-pick --abort
```

---

### When to Use Cherry-Pick

✅ **Good Use Cases:**
- Applying hotfix to multiple release branches
- Selectively backporting features
- Applying specific bug fixes
- Recovering lost commits

❌ **Avoid:**
- Regular feature merging (use merge/rebase instead)
- Large sets of commits (use rebase)
- Shared history manipulation

---

## ⏪ Reset vs Revert

### Understanding Undo Operations

Both **reset** and **revert** undo changes, but work **very differently**.

### Git Reset

**Reset** moves the branch pointer backward (rewrites history).

```bash
git reset <mode> <commit>
```

#### Reset Modes

##### 1. **--soft** (Keep changes staged)

```bash
git reset --soft HEAD~1
```

- Moves HEAD back one commit
- Keeps changes in staging area
- Useful for re-committing with different message

```
Before:  A---B---C (HEAD)
After:   A---B (HEAD)
         Changes from C are staged
```

##### 2. **--mixed** (Default - unstage changes)

```bash
git reset HEAD~1
git reset --mixed HEAD~1  # Same
```

- Moves HEAD back
- Unstages changes
- Changes remain in working directory

```
Before:  A---B---C (HEAD)
After:   A---B (HEAD)
         Changes from C are in working directory
```

##### 3. **--hard** (Discard all changes)

```bash
git reset --hard HEAD~1
```

- Moves HEAD back
- **Deletes all changes** (dangerous!)
- Working directory matches commit

```
Before:  A---B---C (HEAD)
After:   A---B (HEAD)
         All changes from C are GONE
```

---

### Git Revert

**Revert** creates a **new commit** that undoes previous changes (preserves history).

```bash
git revert abc1234
```

```
Before:  A---B---C (bad commit)
After:   A---B---C---D (revert commit that undoes C)
```

**Characteristics:**
- ✅ Safe for public branches
- ✅ Preserves history
- ✅ Traceable undo
- ❌ Creates extra commit

---

### Reset vs Revert Comparison

| **Aspect** | **Reset** | **Revert** |
|-----------|----------|-----------|
| **History** | Rewrites | Preserves |
| **Safety** | Dangerous on shared branches | Safe for shared branches |
| **Commits** | Removes commits | Adds new commit |
| **Use on public branch?** | ❌ NO | ✅ YES |
| **Undo method** | Move pointer backward | Create inverse commit |
| **Best for** | Local changes | Published commits |

---

### Practical Examples

#### Undo Last Commit (Not Pushed)

```bash
# Keep changes, re-commit
git reset --soft HEAD~1
# Edit files
git commit -m "Better commit message"
```

#### Undo Last Commit (Already Pushed)

```bash
# Safe way - use revert
git revert HEAD
git push origin main
```

#### Discard Local Changes

```bash
# Discard all uncommitted changes
git reset --hard HEAD

# Discard changes in specific file
git checkout -- filename.txt
```

#### Undo Multiple Commits

```bash
# Not pushed yet
git reset --hard HEAD~3

# Already pushed
git revert HEAD~3..HEAD
```

---

### ⚠️ Dangerous Reset Scenarios

```bash
# VERY DANGEROUS - loses all local changes
git reset --hard origin/main

# DANGEROUS - rewrites public history
git reset --hard HEAD~5
git push --force  # ❌ Don't do this on shared branches!
```

**Safer alternative:**
```bash
git revert HEAD~5..HEAD
git push origin main
```

---

## 🏷️ Tagging Versions

### What are Tags?

**Tags** mark specific points in history (usually releases).

### Types of Tags

#### 1. Lightweight Tags

Simple pointer to a commit:

```bash
git tag v1.0.0
```

#### 2. Annotated Tags (Recommended)

Full objects with metadata:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
```

---

### Creating Tags

```bash
# Annotated tag
git tag -a v1.0.0 -m "First stable release"

# Lightweight tag
git tag v1.0.0

# Tag specific commit
git tag -a v0.9.0 abc1234 -m "Beta release"

# Tag with detailed message
git tag -a v2.0.0 -m "Version 2.0.0

- Added user authentication
- Improved performance
- Fixed critical bugs"
```

---

### Listing Tags

```bash
# List all tags
git tag

# List tags matching pattern
git tag -l "v1.*"

# Show tag details
git show v1.0.0
```

---

### Pushing Tags

```bash
# Push single tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# Push annotated tags only
git push --follow-tags
```

---

### Deleting Tags

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
# OR
git push origin :refs/tags/v1.0.0
```

---

### Checking Out Tags

```bash
# View code at tag
git checkout v1.0.0

# Create branch from tag
git checkout -b hotfix/v1.0.1 v1.0.0
```

---

### Semantic Versioning (SemVer)

Format: **MAJOR.MINOR.PATCH**

```
v1.2.3
│ │ └─ PATCH: Bug fixes, small changes
│ └─── MINOR: New features, backwards compatible
└───── MAJOR: Breaking changes
```

**Examples:**
- `v1.0.0` - Initial release
- `v1.1.0` - Added new feature
- `v1.1.1` - Bug fix
- `v2.0.0` - Breaking change

---

### Practical Tagging Workflow

```bash
# Finish feature development
git checkout main
git merge --no-ff release/2.0.0

# Tag the release
git tag -a v2.0.0 -m "Version 2.0.0

Major Changes:
- Redesigned authentication system
- New API endpoints
- Improved database schema

Breaking Changes:
- Old API v1 endpoints deprecated"

# Push to remote
git push origin main
git push origin v2.0.0

# Create GitHub release (using GitHub CLI)
gh release create v2.0.0 --title "Version 2.0.0" --notes "See CHANGELOG.md"
```

---

## 💪 Practical Exercises

### Exercise 1: Merge vs Rebase Practice

```bash
# Setup
mkdir git-practice && cd git-practice
git init

# Create initial commits
echo "# Project" > README.md
git add README.md
git commit -m "Initial commit"

# Create feature branch
git checkout -b feature/add-footer
echo "<footer>Copyright 2024</footer>" > footer.html
git add footer.html
git commit -m "Add footer"

# Simulate main branch changes
git checkout main
echo "## Features" >> README.md
git commit -am "Update README"

# Practice merge
git checkout feature/add-footer
git merge main
git log --graph --oneline

# Reset and try rebase
git reset --hard HEAD~1
git rebase main
git log --graph --oneline
```

### Exercise 2: Resolve Conflicts

```bash
# Create conflict scenario
git checkout -b feature-a
echo "Version A" > conflict.txt
git add conflict.txt
git commit -m "Add version A"

git checkout main
git checkout -b feature-b
echo "Version B" > conflict.txt
git add conflict.txt
git commit -m "Add version B"

# Create conflict
git checkout main
git merge feature-a  # This works
git merge feature-b  # CONFLICT!

# Resolve it
# Edit conflict.txt
git add conflict.txt
git commit -m "Resolve conflict between feature-a and feature-b"
```

### Exercise 3: Stash Workflow

```bash
# Start working
echo "// Work in progress" >> app.js
git add app.js

# Need to switch branches
git stash save "WIP: new feature"

# Do other work
git checkout other-branch
# ... work ...

# Return to original work
git checkout main
git stash pop
```

### Exercise 4: Cherry-Pick

```bash
# On feature branch
git checkout feature-branch
echo "Bug fix" >> bugfix.txt
git add bugfix.txt
git commit -m "Fix critical bug"
git log --oneline  # Note commit hash

# Apply to main
git checkout main
git cherry-pick <commit-hash>
```

### Exercise 5: Tagging

```bash
# Create release
git tag -a v1.0.0 -m "First release"

# List tags
git tag

# View tag
git show v1.0.0

# Push tag
git push origin v1.0.0
```

---

## 🎯 Summary

### Key Takeaways

1. **Merge vs Rebase**
   - Merge: Preserves history, creates merge commits
   - Rebase: Clean history, rewrites commits
   - Never rebase shared branches!

2. **Resolving Conflicts**
   - Understand conflict markers
   - Use tools to help resolve
   - Test after resolution

3. **Git Stash**
   - Temporarily save work
   - Switch contexts easily
   - Apply or pop when ready

4. **Cherry-Pick**
   - Apply specific commits
   - Useful for hotfixes
   - Avoid for regular merging

5. **Reset vs Revert**
   - Reset: Rewrites history (local only)
   - Revert: Creates new commit (safe for shared)

6. **Tagging**
   - Mark releases
   - Use semantic versioning
   - Push tags separately

---

## 📖 Further Reading

- [Git Branching - Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Pro Git Book - Advanced Topics](https://git-scm.com/book/en/v2)
- [Semantic Versioning](https://semver.org/)

---

**Next**: [GitHub Deep Dive →](./02-github-deep-dive.md)
