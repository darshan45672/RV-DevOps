# 2️⃣ Linux & Shell Basics

**Duration**: 2 hours  
**Mode**: Hands-on Practice

---

## 📌 Table of Contents

1. [Why Linux for DevOps?](#why-linux-for-devops)
2. [File System Navigation](#file-system-navigation)
3. [File Operations](#file-operations)
4. [Permissions (chmod, chown)](#permissions-chmod-chown)
5. [Essential Commands](#essential-commands)
6. [Environment Variables](#environment-variables)
7. [Basic Bash Scripting](#basic-bash-scripting)
8. [Hands-On Exercises](#hands-on-exercises)

---

## 🐧 Why Linux for DevOps?

Linux is essential for DevOps because:

- ✅ **Most servers run Linux** (Ubuntu, CentOS, Alpine)
- ✅ **Docker containers** are Linux-based
- ✅ **Kubernetes** orchestrates Linux containers
- ✅ **Cloud platforms** (AWS, Azure, GCP) use Linux extensively
- ✅ **Automation tools** (Ansible, Terraform) work best on Linux
- ✅ **Open source** and highly customizable

---

## 📂 File System Navigation

### Linux Directory Structure

```
/                   (root directory)
├── bin/            (essential binaries)
├── etc/            (configuration files)
├── home/           (user home directories)
│   └── username/
├── opt/            (optional applications)
├── tmp/            (temporary files)
├── usr/            (user programs)
│   ├── bin/
│   └── local/
└── var/            (variable data: logs, databases)
    └── log/
```

### Navigation Commands

#### `pwd` - Print Working Directory
Shows your current location.

```bash
pwd
# Output: /home/username/projects
```

#### `ls` - List Directory Contents

```bash
ls                  # List files
ls -l               # Long format (permissions, size, date)
ls -la              # Include hidden files (starting with .)
ls -lh              # Human-readable sizes (KB, MB, GB)
ls -lt              # Sort by modification time
```

Example output:
```bash
$ ls -lh
drwxr-xr-x  3 user  staff   96B Jan 15 10:30 projects
-rw-r--r--  1 user  staff  1.2K Jan 15 09:15 README.md
```

#### `cd` - Change Directory

```bash
cd /path/to/directory    # Absolute path
cd projects              # Relative path
cd ..                    # Go up one level
cd ~                     # Go to home directory
cd -                     # Go to previous directory
```

#### `tree` - Display Directory Structure

```bash
tree                     # Show directory tree
tree -L 2                # Limit to 2 levels deep
tree -a                  # Include hidden files
```

---

## 📁 File Operations

### Creating Files and Directories

```bash
# Create empty file
touch filename.txt

# Create multiple files
touch file1.txt file2.txt file3.txt

# Create directory
mkdir mydir

# Create nested directories
mkdir -p parent/child/grandchild

# Create directory with specific permissions
mkdir -m 755 mydir
```

### Viewing File Contents

```bash
cat filename.txt          # Display entire file
head filename.txt         # First 10 lines
head -n 5 filename.txt    # First 5 lines
tail filename.txt         # Last 10 lines
tail -n 20 filename.txt   # Last 20 lines
tail -f /var/log/app.log  # Follow log file (real-time)
less filename.txt         # Paginated view (press q to quit)
more filename.txt         # Another paginated viewer
```

### Editing Files

```bash
nano filename.txt         # Simple editor
vim filename.txt          # Advanced editor
code filename.txt         # VS Code (if installed)
```

### Copying, Moving, Deleting

```bash
# Copy
cp source.txt destination.txt          # Copy file
cp -r sourcedir/ destdir/              # Copy directory recursively

# Move/Rename
mv oldname.txt newname.txt             # Rename
mv file.txt /path/to/destination/      # Move

# Delete
rm filename.txt                        # Delete file
rm -r directory/                       # Delete directory recursively
rm -rf directory/                      # Force delete (no confirmation)
rm -i file.txt                         # Interactive (ask before delete)
```

⚠️ **Warning**: `rm -rf` is dangerous! It permanently deletes without confirmation.

---

## 🔐 Permissions (chmod, chown)

### Understanding Permissions

Every file/directory has:
- **Owner** (user)
- **Group**
- **Others** (everyone else)

Each has 3 permission types:
- **r** (read) = 4
- **w** (write) = 2
- **x** (execute) = 1

### Reading Permissions

```bash
$ ls -l script.sh
-rwxr-xr--  1 user  staff  128 Jan 15 10:30 script.sh
```

Breakdown:
```
-rwxr-xr--
│└┬┘└┬┘└┬┘
│ │  │  └─ Others: r-- (read only) = 4
│ │  └──── Group:  r-x (read, execute) = 5
│ └─────── Owner:  rwx (read, write, execute) = 7
└───────── File type: - (file), d (directory), l (link)
```

### `chmod` - Change Permissions

#### Numeric (Octal) Method

```bash
chmod 755 script.sh
# 7 (rwx) owner
# 5 (r-x) group
# 5 (r-x) others

chmod 644 file.txt
# 6 (rw-) owner
# 4 (r--) group
# 4 (r--) others

chmod 700 private.sh
# 7 (rwx) owner
# 0 (---) group
# 0 (---) others
```

#### Symbolic Method

```bash
chmod u+x script.sh         # Add execute for owner
chmod g-w file.txt          # Remove write for group
chmod o+r file.txt          # Add read for others
chmod a+x script.sh         # Add execute for all (user, group, others)
chmod u=rwx,g=rx,o=r file   # Set specific permissions
```

### `chown` - Change Ownership

```bash
chown username file.txt                  # Change owner
chown username:groupname file.txt        # Change owner and group
chown -R username:groupname directory/   # Recursive
```

### Common Permission Patterns

| **Permissions** | **Octal** | **Use Case** |
|-----------------|-----------|--------------|
| `-rw-r--r--` | `644` | Regular files (readable by all, writable by owner) |
| `-rwxr-xr-x` | `755` | Executables, scripts |
| `-rw-------` | `600` | Private files (owner only) |
| `-rwx------` | `700` | Private executables |
| `drwxr-xr-x` | `755` | Directories |

---

## 🔧 Essential Commands

### `grep` - Search Text

```bash
grep "pattern" filename.txt                # Search in file
grep -r "pattern" directory/               # Recursive search
grep -i "pattern" file.txt                 # Case-insensitive
grep -n "pattern" file.txt                 # Show line numbers
grep -v "pattern" file.txt                 # Invert match (exclude)
grep -E "pattern1|pattern2" file.txt       # Extended regex (OR)

# Practical examples
ps aux | grep python                       # Find Python processes
cat /var/log/app.log | grep ERROR          # Find errors in logs
```

### `find` - Search Files

```bash
find . -name "*.txt"                       # Find .txt files
find /home -type d -name "projects"        # Find directories
find . -type f -mtime -7                   # Files modified in last 7 days
find . -type f -size +10M                  # Files larger than 10MB
find . -name "*.log" -delete               # Find and delete

# Practical examples
find . -name "node_modules" -type d -prune -exec rm -rf {} +  # Delete node_modules
find /var/log -name "*.log" -mtime +30 -delete                # Delete old logs
```

### `curl` - Transfer Data

```bash
curl https://example.com                           # GET request
curl -I https://example.com                        # Headers only
curl -o output.html https://example.com            # Save to file
curl -X POST https://api.example.com/data          # POST request
curl -H "Content-Type: application/json" \
     -d '{"key":"value"}' \
     https://api.example.com/endpoint              # POST with JSON
```

### Process Management

```bash
ps aux                      # List all processes
ps aux | grep nginx         # Find specific process
top                         # Real-time process monitor
htop                        # Enhanced top (if installed)
kill PID                    # Terminate process by PID
kill -9 PID                 # Force kill
pkill processname           # Kill by name
killall processname         # Kill all instances
```

### Disk Usage

```bash
df -h                       # Disk space (human-readable)
du -sh directory/           # Directory size
du -h --max-depth=1         # Size of subdirectories
free -h                     # Memory usage
```

### Networking

```bash
ping google.com             # Test connectivity
ifconfig                    # Network interfaces (older systems)
ip addr                     # Network interfaces (modern systems)
netstat -tuln               # Listening ports
ss -tuln                    # Socket statistics (modern alternative)
nslookup example.com        # DNS lookup
dig example.com             # Advanced DNS lookup
```

---

## 🌍 Environment Variables

### What Are Environment Variables?

Variables that store system-wide or user-specific configuration.

### Viewing Environment Variables

```bash
env                         # List all environment variables
echo $PATH                  # Print PATH variable
echo $HOME                  # User home directory
echo $USER                  # Current username
echo $SHELL                 # Current shell
printenv PATH               # Alternative to echo
```

### Setting Environment Variables

#### Temporary (Current Session Only)

```bash
export MY_VAR="value"
echo $MY_VAR
```

#### Permanent (Add to Shell Config)

For **bash** (add to `~/.bashrc` or `~/.bash_profile`):
```bash
export MY_VAR="value"
export PATH="$PATH:/new/path"
```

For **zsh** (add to `~/.zshrc`):
```bash
export MY_VAR="value"
export PATH="$PATH:/new/path"
```

Then reload:
```bash
source ~/.bashrc    # For bash
source ~/.zshrc     # For zsh
```

### Common Environment Variables

| **Variable** | **Description** |
|--------------|----------------|
| `$PATH` | Directories to search for executables |
| `$HOME` | User's home directory |
| `$USER` | Current username |
| `$SHELL` | Current shell |
| `$PWD` | Present working directory |
| `$EDITOR` | Default text editor |

---

## 📝 Basic Bash Scripting

### Creating Your First Script

```bash
#!/bin/bash
# This is a comment

echo "Hello, DevOps!"
```

Save as `hello.sh`, then:
```bash
chmod +x hello.sh
./hello.sh
```

### Variables

```bash
#!/bin/bash

NAME="DevOps Engineer"
AGE=25

echo "I am a $NAME"
echo "I am $AGE years old"
```

### User Input

```bash
#!/bin/bash

echo "What is your name?"
read NAME
echo "Hello, $NAME!"
```

### Conditionals

```bash
#!/bin/bash

if [ -f "/etc/passwd" ]; then
    echo "File exists"
else
    echo "File not found"
fi

# Numeric comparison
if [ $AGE -gt 18 ]; then
    echo "Adult"
fi
```

Comparison operators:
- `-eq` (equal)
- `-ne` (not equal)
- `-gt` (greater than)
- `-lt` (less than)
- `-f` (file exists)
- `-d` (directory exists)

### Loops

#### For Loop
```bash
#!/bin/bash

for i in 1 2 3 4 5
do
    echo "Number: $i"
done

# Loop through files
for file in *.txt
do
    echo "Processing $file"
done
```

#### While Loop
```bash
#!/bin/bash

COUNT=1
while [ $COUNT -le 5 ]
do
    echo "Count: $COUNT"
    COUNT=$((COUNT + 1))
done
```

### Functions

```bash
#!/bin/bash

greet() {
    echo "Hello, $1!"
}

greet "DevOps Engineer"
greet "World"
```

### Practical Script Example

```bash
#!/bin/bash
# Backup script

BACKUP_DIR="/backup"
SOURCE_DIR="/var/www"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

echo "Starting backup at $DATE"
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $SOURCE_DIR

if [ $? -eq 0 ]; then
    echo "Backup successful!"
else
    echo "Backup failed!"
    exit 1
fi
```

---

## 💪 Hands-On Exercises

### Exercise 1: File System Navigation

```bash
# Create directory structure
mkdir -p ~/devops-workshop/{projects,scripts,logs}

# Navigate and verify
cd ~/devops-workshop
tree

# Create files
touch projects/app.py scripts/deploy.sh logs/app.log

# List with details
ls -lR
```

### Exercise 2: Permissions Practice

```bash
# Create a script
echo '#!/bin/bash' > test.sh
echo 'echo "Hello from script"' >> test.sh

# Make it executable
chmod +x test.sh

# Run it
./test.sh

# Check permissions
ls -l test.sh
```

### Exercise 3: Search and Filter

```bash
# Create sample log file
cat > sample.log << EOF
2024-01-15 10:00:00 INFO Application started
2024-01-15 10:05:00 ERROR Database connection failed
2024-01-15 10:06:00 WARN Retrying connection
2024-01-15 10:07:00 INFO Connected to database
2024-01-15 10:10:00 ERROR API timeout
EOF

# Find all ERROR lines
grep ERROR sample.log

# Count ERROR lines
grep -c ERROR sample.log

# Find ERROR or WARN
grep -E "ERROR|WARN" sample.log
```

### Exercise 4: Simple Backup Script

Create `backup.sh`:

```bash
#!/bin/bash

# Configuration
SOURCE="$HOME/devops-workshop"
DEST="$HOME/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $DEST

# Create backup
tar -czf $DEST/backup_$DATE.tar.gz $SOURCE

# Verify
if [ $? -eq 0 ]; then
    echo "✅ Backup created: backup_$DATE.tar.gz"
    ls -lh $DEST/backup_$DATE.tar.gz
else
    echo "❌ Backup failed"
    exit 1
fi
```

Run:
```bash
chmod +x backup.sh
./backup.sh
```

---

## 🎯 Summary

### Key Commands Learned

| **Category** | **Commands** |
|--------------|--------------|
| Navigation | `pwd`, `ls`, `cd`, `tree` |
| Files | `touch`, `cat`, `cp`, `mv`, `rm` |
| Permissions | `chmod`, `chown` |
| Search | `grep`, `find` |
| Network | `curl`, `ping`, `netstat` |
| Process | `ps`, `top`, `kill` |
| Scripting | Variables, loops, conditionals |

### Best Practices

1. ✅ Always use **tab completion** to avoid typos
2. ✅ Use `man command` to read manual pages
3. ✅ Test destructive commands (`rm -rf`) in safe environments
4. ✅ Use version control (Git) for scripts
5. ✅ Add comments to your scripts

---

## 📖 Further Resources

- [Linux Journey](https://linuxjourney.com/)
- [Bash Scripting Tutorial](https://linuxconfig.org/bash-scripting-tutorial)
- [ExplainShell](https://explainshell.com/) - Explains shell commands
- [Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)

---

**Next**: [Git Hands-On →](./03-git-hands-on.md)
