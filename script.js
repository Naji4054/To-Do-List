let tasks = [];

function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
  } catch (e) {
    console.error('Could not parse tasks from localStorage', e);
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

function renderTasks() {
  taskList.innerHTML = '';

    if (tasks.length <= 0) {
        taskList.innerHTML = 'No tasks added'
        taskList.className= "noTask"
        return 
    }
    taskList.classList.remove('noTask')
    tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id; 

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = "check"
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));
    checkbox.title = 'Mark as completed';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.innerHTML = 'Delete';
    delBtn.title = 'Delete task';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
  updateTaskCount();
}

function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === '') return;
  const newTask = {
    id: Date.now().toString(),
    text: text,
    completed: false
  };

  tasks.unshift(newTask); 
  saveTasks()
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks()
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(tsk => {
    if (tsk.id === id) return { ...tsk, completed: !tsk.completed };
    return tsk;
  });
  saveTasks()
  renderTasks();
}

const totalTasks = document.querySelector('.total-tasks');
const completedTasks = document.querySelector('.completed-tasks');
function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter(tsk => tsk.completed).length;
  totalTasks.textContent = `${total} : Tasks`;
  completedTasks.textContent = `${completed} : Completed`;
}

const clearCompletedBtn = document.getElementById('clear-completed');
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks()
  renderTasks();
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

loadTasks();
renderTasks();
