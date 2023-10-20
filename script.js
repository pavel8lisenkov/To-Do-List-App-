const form = document.querySelector('#form');
const input = document.querySelector('#app__input');
const taskList = document.querySelector('#task-list');
const emptyList = document.querySelector('#emptyList');
let tasksControl = document.querySelector('#tasksControl');
let statusDone = false;

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));

  tasks.forEach(function (task) {
    renderTask(task);
  });
}

checkEmptyList();
checkTasksControl();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);

// Добавление новой задачи

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
  checkTasksControl();
}

// Удаление задачи

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
  checkTasksControl();
}

// Изменение статуса задачи

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.task-item');
  const childNode = event.target.querySelector('img');

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  task.done = !task.done;
  statusDone = !statusDone;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title_done');

  childNode.src = setTaskIcon(task);
  event.target.title = setButtonDoneTitle(task);
}

// Проверка пустого списка

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

// Кнопки управления списком задач

function checkTasksControl() {

  if (tasks.length > 1 && !document.querySelector('#tasksControl')) {
    tasksControl = `<div id="tasksControl" class="tasks-control-item">
      <button type="button" data-action="doneAllTasks" class="btn-action">Выполнить все задачи</button>
      <button type="button" data-action="deleteAllTasks" class="btn-action">Удалить все задачи</button>
    </div>`;
    taskList.insertAdjacentHTML('afterEnd', tasksControl);
    document.querySelector('#tasksControl').addEventListener('click', doneAllTasks);
    document.querySelector('#tasksControl').addEventListener('click', deleteAllTasks);
  } else if (tasks.length < 2) {
    document.querySelector('#tasksControl') ? document.querySelector('#tasksControl').remove() : null;
  }

}

// Сохранение списка задач в локалСторадж

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Добавление задачи в список задач

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title_done" : "task-title";

  const inputHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
	  	<span class="${cssClass}">${task.text}</span>
	  	<div class="task-item__buttons">
	  		<button type="button" data-action="done" class="btn-action" title="${setButtonDoneTitle(task)}">
	  			<img src="${setTaskIcon(task)}" alt="done-icon" width="24" height="24">
	  		</button>
	  		<button type="button" data-action="delete" class="btn-action" title="Удалить задачу">
	  			<img src="./img/delete-icon.svg" alt="delete-icon" width="24" height="24">
	  		</button>
	  	</div>
	  </li>
  `;

  taskList.insertAdjacentHTML('beforeend', inputHTML);
}

// Измение иконки статуса задачи

function setTaskIcon(task) {
  return task.done ? "./img/done-icon_red.svg" : "./img/done-icon_green.svg";
}

// Изменение подсказки на кнопке статуса задачи

function setButtonDoneTitle(task) {
  return task.done ? "Отменить выполнение задачи" : "Выполнить задачу";
}

// Изменение статуса выполнения всех задач списка

function doneAllTasks(event) {
  if (event.target.dataset.action !== 'doneAllTasks') return;

  tasks.forEach(function (task) {
    task.done = true;
  })

  saveToLocalStorage();
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasks.forEach(function (task) {
    renderTask(task);
  })

}

// Удаление всех задач из списка

function deleteAllTasks(event) {
  if (event.target.dataset.action !== 'deleteAllTasks') return;

  tasks.length = 0;

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  saveToLocalStorage();
  checkEmptyList();
  checkTasksControl();
}
