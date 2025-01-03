let todos = [];

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

function renderTodos() {
  // Sort todos by priority: High > Medium > Low
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    const container = document.createElement("div");
    container.classList.add("todo-container");

    // Adding a green tick if the task is completed
    const tick = todo.completed ? "✅ " : "";

    container.innerHTML = `
      <span class="todo-text">${tick}${index + 1}. ${todo.task} 
        <span class="priority priority-${todo.priority.toLowerCase()}">(${todo.priority})</span>
      </span>
      <span class="actions">
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
        <button class="completed-btn" data-index="${index}" ${todo.completed ? "disabled" : ""}>Completed</button>
      </span>
    `;

    if (todo.completed) {
      container.querySelector(".todo-text").classList.add("completed");
    }

    li.appendChild(container);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const task = todoInput.value.trim();
  const priority = document.getElementById("priority-select").value; // Get the selected priority
  if (task !== "") {
    const todo = { task, priority, completed: false };
    todos.push(todo);
    todoInput.value = "";
    renderTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function editTodo(event) {
  const index = parseInt(event.target.dataset.index, 10); // Get the correct index
  const currentTask = todos[index].task; // Retrieve the current task
  const newTask = prompt("Edit your task:", currentTask);

  if (newTask !== null && newTask.trim() !== "") {
    todos[index].task = newTask.trim(); // Update the task
    renderTodos(); // Re-render the updated list
    localStorage.setItem("todos", JSON.stringify(todos)); // Save to localStorage
  }
}

function deleteTodo(event) {
  const index = parseInt(event.target.dataset.index, 10);
  todos.splice(index, 1); // Remove the task from the array
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

function completeTodo(event) {
  const index = parseInt(event.target.dataset.index, 10);
  todos[index].completed = true; // Mark the task as completed
  renderTodos();
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Attach the click event listeners
addBtn.addEventListener("click", addTodo);

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-btn")) {
    editTodo(event); // Pass the event object
  }
  if (event.target.classList.contains("delete-btn")) {
    deleteTodo(event); // Pass the event object
  }
  if (event.target.classList.contains("completed-btn")) {
    completeTodo(event); // Pass the event object
  }
});

// Initialize the Todo List with the stored Todos
const storedTodos = localStorage.getItem("todos");
if (storedTodos) {
  todos = JSON.parse(storedTodos);
  renderTodos();
}
