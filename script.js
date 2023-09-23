const form = document.querySelector('#form');
const input = document.querySelector('#app__input');
const button = document.querySelector('#app__button');
const taskList = document.querySelector('#task-list');
const emptyList = document.querySelector('#emptyList');
const taskControl = document.querySelector('.tasks-control');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));

  tasks.forEach(function (task) {
    renderTask(task);
  });
}

checkEmptyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

// Функции

function addTask(event) {
  event.preventDefault();

  if (!input.value) {
    return;
  }

  const inputText = input.value;

  const newTask = {
    id: Date.now(),
    text: inputText,
    done: false
  };

  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  input.value = '';
  input.focus();

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return;

  const parentNode = event.target.closest('.task-item');

  const id = Number(parentNode.id);

  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveToLocalStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.task-item');

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title_done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="empty-task-item">
      <img
        src="./img/list.png"
        alt="List"
        width="48"
        class="mt-3"
      />
      <div class="empty-list__title">Список задач пуст</div>
    </li>`;

    taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
  } else {
    const emptyListElement = document.querySelector('#emptyList');

    emptyListElement ? emptyListElement.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title_done" : "task-title";

  const inputHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
	  	<span class="${cssClass}">${task.text}</span>
	  	<div class="task-item__buttons">
	  		<button type="button" data-action="done" class="btn-action">
	  			<img src="./img/tick.svg" alt="Done" width="18" height="18">
	  		</button>
	  		<button type="button" data-action="delete" class="btn-action">
	  			<img src="./img/cross.svg" alt="Done" width="18" height="18">
	  		</button>
	  	</div>
	  </li>
  `;

  taskList.insertAdjacentHTML('beforeend', inputHTML);
}