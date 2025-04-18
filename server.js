const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'temp', 'todos.json'); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

function loadTodos() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeJsonSync(DATA_FILE, []);
    }
    
    return fs.readJsonSync(DATA_FILE) || [];
  } catch (err) {
    console.error("Error loading todos:", err);
    return [];
  }
}


// Save todos to file
function saveTodos(todos) {
  try {
    fs.writeJsonSync(DATA_FILE, todos, { spaces: 2 });
  } catch (err) {
    console.error("Error saving todos:", err);
  }
}

// Get all todos
app.get("/todos", (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

// Add a new todo
app.post("/todos", (req, res) => {
  const todos = loadTodos();
  const newTodo = {
    id: Date.now(),
    task: req.body.task
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  let todos = loadTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  saveTodos(todos);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
