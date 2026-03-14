# 3️⃣ Mini Project: Todo API with Git Workflow

**Duration**: 2 hours  
**Mode**: Hands-on Project

---

## 📌 Project Overview

Build a simple **Todo API** and practice the complete GitHub workflow:

- ✅ Create feature branches
- ✅ Make commits with good messages
- ✅ Open pull requests
- ✅ Perform code reviews
- ✅ Merge via review process
- ✅ Tag releases

**Choose your language:**
- [Node.js Version](#nodejs-version)
- [Python Version](#python-version)

---

## 🎯 Learning Objectives

- Practice feature branch workflow
- Write effective commits and PRs
- Conduct code reviews
- Apply semantic versioning
- Use GitHub Issues and Projects

---

## 📋 Project Requirements

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |

### Todo Object

```json
{
  "id": 1,
  "title": "Learn Git",
  "completed": false,
  "createdAt": "2024-03-14T10:00:00Z"
}
```

---

## 🟢 Node.js Version

### Step 1: Project Setup

```bash
# Create project directory
mkdir todo-api
cd todo-api

# Initialize Git
git init
git branch -M main

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors

# Install dev dependencies
npm install --save-dev nodemon

# Create .gitignore
cat > .gitignore << EOF
node_modules/
.env
*.log
.DS_Store
EOF
```

### Step 2: Create Initial Structure

```bash
# Create directory structure
mkdir -p src/{routes,controllers,models}

# Create files
touch src/app.js src/server.js
touch src/routes/todos.js
touch src/controllers/todoController.js
touch src/models/todo.js
touch README.md
```

### Step 3: Initial Commit

**`package.json`** - Update scripts:
```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "description": "Simple Todo API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["todo", "api", "express"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

**`README.md`**:
```markdown
# Todo API

Simple REST API for managing todos.

## Installation

\`\`\`bash
npm install
\`\`\`

## Running

\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Version

1.0.0
```

**`src/server.js`**:
```javascript
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**`src/app.js`**:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo API is running' });
});

module.exports = app;
```

**Commit:**
```bash
git add .
git commit -m "chore: initial project setup with Express

- Initialize npm project
- Add Express and CORS dependencies
- Create basic server structure
- Add health check endpoint
- Setup dev environment with nodemon"
```

### Step 4: Feature Branch - Add Todo Model

```bash
# Create feature branch
git checkout -b feature/todo-model
```

**`src/models/todo.js`**:
```javascript
class TodoModel {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  getAll() {
    return this.todos;
  }

  getById(id) {
    return this.todos.find(todo => todo.id === parseInt(id));
  }

  create(title) {
    const todo = {
      id: this.nextId++,
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.todos.push(todo);
    return todo;
  }

  update(id, updates) {
    const todo = this.getById(id);
    if (!todo) return null;
    
    Object.assign(todo, updates);
    return todo;
  }

  delete(id) {
    const index = this.todos.findIndex(todo => todo.id === parseInt(id));
    if (index === -1) return false;
    
    this.todos.splice(index, 1);
    return true;
  }
}

// Singleton instance
const todoModel = new TodoModel();

module.exports = todoModel;
```

**Commit:**
```bash
git add src/models/todo.js
git commit -m "feat: add Todo model with CRUD operations

- Implement in-memory todo storage
- Add methods: getAll, getById, create, update, delete
- Use singleton pattern for shared state
- Include timestamps for created todos"
```

### Step 5: Feature Branch - Add Controller

**`src/controllers/todoController.js`**:
```javascript
const todoModel = require('../models/todo');

const todoController = {
  getAllTodos: (req, res) => {
    const todos = todoModel.getAll();
    res.json({ success: true, data: todos });
  },

  getTodoById: (req, res) => {
    const todo = todoModel.getById(req.params.id);
    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }
    res.json({ success: true, data: todo });
  },

  createTodo: (req, res) => {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        error: 'Title is required' 
      });
    }

    const todo = todoModel.create(title);
    res.status(201).json({ success: true, data: todo });
  },

  updateTodo: (req, res) => {
    const updates = req.body;
    const todo = todoModel.update(req.params.id, updates);
    
    if (!todo) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ success: true, data: todo });
  },

  deleteTodo: (req, res) => {
    const deleted = todoModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Todo not found' 
      });
    }

    res.json({ success: true, message: 'Todo deleted' });
  }
};

module.exports = todoController;
```

**Commit:**
```bash
git add src/controllers/todoController.js
git commit -m "feat: add todo controller with validation

- Implement all CRUD operations
- Add input validation for create
- Return appropriate HTTP status codes
- Include error handling for not found cases"
```

### Step 6: Feature Branch - Add Routes

**`src/routes/todos.js`**:
```javascript
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
```

**Update `src/app.js`**:
```javascript
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Todo API is running' });
});

app.use('/api/todos', todoRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

module.exports = app;
```

**Commit:**
```bash
git add src/routes/todos.js src/app.js
git commit -m "feat: add todo routes and integrate with app

- Create RESTful routes for todos
- Mount routes on /api/todos
- Add 404 handler for undefined routes"
```

### Step 7: Push and Create Pull Request

```bash
# Push feature branch
git push origin feature/todo-model

# Create PR using GitHub CLI
gh pr create \
  --title "feat: Implement Todo CRUD functionality" \
  --body "## Description
Implements complete Todo API with CRUD operations.

## Changes
- Added Todo model with in-memory storage
- Implemented todo controller with validation
- Created RESTful routes
- Added error handling

## Testing
Tested manually with curl:
- ✅ Create todo
- ✅ Get all todos
- ✅ Get single todo
- ✅ Update todo
- ✅ Delete todo

## Closes
#1" \
  --base main
```

### Step 8: Code Review Simulation

**Review checklist:**
- [ ] Code follows project conventions
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] HTTP status codes appropriate
- [ ] No hardcoded values
- [ ] README updated

**Leave review comment (simulate):**
```
Great implementation! Just a few suggestions:

1. Consider adding JSDoc comments to controller methods
2. Could we add a `maxTodos` limit to prevent memory issues?
3. The error messages are clear and helpful 👍

Overall looks good to merge!
```

### Step 9: Address Review (Optional Improvements)

```bash
# Make improvements based on review
# Update todoController.js with JSDoc

git add src/controllers/todoController.js
git commit -m "docs: add JSDoc comments to controller methods"
git push origin feature/todo-model
```

### Step 10: Merge and Tag Release

```bash
# Merge PR (via GitHub UI or CLI)
gh pr merge --squash --delete-branch

# Pull updated main
git checkout main
git pull origin main

# Tag release
git tag -a v1.0.0 -m "Release v1.0.0

Initial release with full CRUD functionality:
- Create todos
- Read todos (all and by ID)
- Update todos
- Delete todos

API is stable and ready for use."

# Push tag
git push origin v1.0.0

# Create GitHub release
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "First stable release of Todo API"
```

---

## 🐍 Python Version

### Step 1: Project Setup

```bash
# Create project directory
mkdir todo-api
cd todo-api

# Initialize Git
git init
git branch -M main

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Create requirements.txt
cat > requirements.txt << EOF
Flask==3.0.0
Flask-CORS==4.0.0
EOF

# Install dependencies
pip install -r requirements.txt

# Create .gitignore
cat > .gitignore << EOF
venv/
__pycache__/
*.pyc
.env
*.log
.DS_Store
EOF
```

### Step 2: Create Initial Structure

```bash
# Create directory structure
mkdir -p app/{models,routes,controllers}
touch app/__init__.py
touch app/models/__init__.py
touch app/routes/__init__.py
touch app/controllers/__init__.py

# Create files
touch run.py README.md
```

### Step 3: Initial Commit

**`README.md`**:
```markdown
# Todo API

Simple REST API for managing todos built with Flask.

## Setup

\`\`\`bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
\`\`\`

## Running

\`\`\`bash
python run.py
\`\`\`

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create todo
- `PUT /api/todos/<id>` - Update todo
- `DELETE /api/todos/<id>` - Delete todo

## Version

1.0.0
```

**`run.py`**:
```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

**`app/__init__.py`**:
```python
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Health check
    @app.route('/health')
    def health():
        return {'status': 'OK', 'message': 'Todo API is running'}, 200
    
    return app
```

**Commit:**
```bash
git add .
git commit -m "chore: initial project setup with Flask

- Initialize Flask project
- Add Flask and Flask-CORS dependencies
- Create basic app structure
- Add health check endpoint
- Setup virtual environment"
```

### Step 4: Feature Branch - Add Todo Model

```bash
git checkout -b feature/todo-model
```

**`app/models/todo.py`**:
```python
from datetime import datetime

class TodoModel:
    def __init__(self):
        self.todos = []
        self.next_id = 1
    
    def get_all(self):
        return self.todos
    
    def get_by_id(self, todo_id):
        return next((todo for todo in self.todos if todo['id'] == todo_id), None)
    
    def create(self, title):
        todo = {
            'id': self.next_id,
            'title': title,
            'completed': False,
            'createdAt': datetime.utcnow().isoformat() + 'Z'
        }
        self.todos.append(todo)
        self.next_id += 1
        return todo
    
    def update(self, todo_id, updates):
        todo = self.get_by_id(todo_id)
        if not todo:
            return None
        
        todo.update(updates)
        return todo
    
    def delete(self, todo_id):
        todo = self.get_by_id(todo_id)
        if not todo:
            return False
        
        self.todos.remove(todo)
        return True

# Singleton instance
todo_model = TodoModel()
```

**`app/models/__init__.py`**:
```python
from .todo import todo_model
```

**Commit:**
```bash
git add app/models/
git commit -m "feat: add Todo model with CRUD operations

- Implement in-memory todo storage
- Add methods: get_all, get_by_id, create, update, delete
- Use singleton pattern for shared state
- Include timestamps for created todos"
```

### Step 5: Feature Branch - Add Controller and Routes

**`app/controllers/todo_controller.py`**:
```python
from flask import request, jsonify
from app.models import todo_model

def get_all_todos():
    todos = todo_model.get_all()
    return jsonify({'success': True, 'data': todos}), 200

def get_todo_by_id(todo_id):
    todo = todo_model.get_by_id(todo_id)
    if not todo:
        return jsonify({'success': False, 'error': 'Todo not found'}), 404
    return jsonify({'success': True, 'data': todo}), 200

def create_todo():
    data = request.get_json()
    title = data.get('title', '').strip()
    
    if not title:
        return jsonify({'success': False, 'error': 'Title is required'}), 400
    
    todo = todo_model.create(title)
    return jsonify({'success': True, 'data': todo}), 201

def update_todo(todo_id):
    updates = request.get_json()
    todo = todo_model.update(todo_id, updates)
    
    if not todo:
        return jsonify({'success': False, 'error': 'Todo not found'}), 404
    
    return jsonify({'success': True, 'data': todo}), 200

def delete_todo(todo_id):
    deleted = todo_model.delete(todo_id)
    
    if not deleted:
        return jsonify({'success': False, 'error': 'Todo not found'}), 404
    
    return jsonify({'success': True, 'message': 'Todo deleted'}), 200
```

**`app/routes/todos.py`**:
```python
from flask import Blueprint
from app.controllers import todo_controller

todos_bp = Blueprint('todos', __name__)

todos_bp.route('/', methods=['GET'])(todo_controller.get_all_todos)
todos_bp.route('/<int:todo_id>', methods=['GET'])(todo_controller.get_todo_by_id)
todos_bp.route('/', methods=['POST'])(todo_controller.create_todo)
todos_bp.route('/<int:todo_id>', methods=['PUT'])(todo_controller.update_todo)
todos_bp.route('/<int:todo_id>', methods=['DELETE'])(todo_controller.delete_todo)
```

**Update `app/__init__.py`**:
```python
from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    from app.routes.todos import todos_bp
    app.register_blueprint(todos_bp, url_prefix='/api/todos')
    
    # Health check
    @app.route('/health')
    def health():
        return jsonify({'status': 'OK', 'message': 'Todo API is running'}), 200
    
    # 404 handler
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'success': False, 'error': 'Route not found'}), 404
    
    return app
```

**Commit:**
```bash
git add app/controllers/ app/routes/ app/__init__.py
git commit -m "feat: add todo controller and routes

- Implement all CRUD operations
- Add input validation
- Return appropriate HTTP status codes
- Register blueprint with Flask app"
```

### Step 6: Push and Create Pull Request

```bash
git push origin feature/todo-model

gh pr create \
  --title "feat: Implement Todo CRUD functionality" \
  --body "## Description
Implements complete Todo API with CRUD operations using Flask.

## Changes
- Added Todo model with in-memory storage
- Implemented todo controller with validation
- Created RESTful routes using Blueprint
- Added error handling

## Testing
Tested manually with curl:
- ✅ Create todo
- ✅ Get all todos
- ✅ Get single todo
- ✅ Update todo
- ✅ Delete todo" \
  --base main
```

### Step 7-10: Same as Node.js Version

Follow the same review, merge, and tagging process as the Node.js version.

---

## 🧪 Testing the API

### Using curl

```bash
# Create todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Git workflows"}'

# Get all todos
curl http://localhost:3000/api/todos

# Get single todo
curl http://localhost:3000/api/todos/1

# Update todo
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1
```

### Using Postman

1. Import collection
2. Create requests for each endpoint
3. Test all CRUD operations

---

## 📝 Additional Improvements (Optional)

### Create Issues First

```bash
# Create issues for future work
gh issue create --title "Add data persistence with database" \
  --body "Currently todos are stored in memory. Add database support for persistence."

gh issue create --title "Add unit tests" \
  --body "Implement unit tests for all API endpoints."

gh issue create --title "Add authentication" \
  --body "Implement JWT authentication for API endpoints."
```

### Add More Features

**Feature ideas:**
- [ ] Add pagination
- [ ] Add filtering/search
- [ ] Add due dates
- [ ] Add categories/tags
- [ ] Add user authentication
- [ ] Add database persistence

**Each feature = new branch + PR!**

---

## 🎯 Project Checklist

- [ ] Created repository
- [ ] Made initial commit
- [ ] Created feature branch
- [ ] Made multiple commits with good messages
- [ ] Pushed branch to GitHub
- [ ] Created pull request with description
- [ ] Reviewed code (or had someone review)
- [ ] Addressed review feedback
- [ ] Merged PR
- [ ] Tagged release with semantic version
- [ ] Created GitHub release

---

## 🏆 Bonus Challenges

1. **Add GitHub Actions CI**
   - Run tests on PR
   - Lint code automatically

2. **Create Issues and Project Board**
   - Plan future features as issues
   - Organize in project board

3. **Add CHANGELOG.md**
   - Document all versions
   - Follow Keep a Changelog format

4. **Write Contributing Guidelines**
   - Add CONTRIBUTING.md
   - Include PR template

---

## 📖 Summary

Congratulations! You've completed a full Git workflow:

✅ Feature branch development  
✅ Meaningful commit messages  
✅ Pull request creation  
✅ Code review process  
✅ Semantic versioning  
✅ Release tagging  

**These skills apply to any project, any language, any team!**

---

**← Back**: [GitHub Deep Dive](./02-github-deep-dive.md) | **Home**: [Day 2 Overview](./README.md)
