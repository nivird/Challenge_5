// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  return `
    <div id="task-${task.id}" class="task card mb-3" draggable="true">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">${task.dueDate}</small></p>
        <button type="button" class="btn btn-danger btn-sm delete-btn">Delete</button>
      </div>
    </div>
  `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing task cards
  $('.lane .card-body').empty();

  // Loop through taskList and render each task card
  taskList.forEach(task => {
    let laneId = task.status.toLowerCase().replace(/\s+/g, '-');
    $(`#${laneId}-cards`).append(createTaskCard(task));
  });

  // Make task cards draggable
  $('.task').draggable({
    revert: "invalid",
    zIndex: 1000,
    cursor: "move"
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // Retrieve task details from the form
  let title = $('#title').val();
  let description = $('#description').val();
  let dueDate = $('#dueDate').val();

  // Generate a unique id for the new task
  let taskId = generateTaskId();

  // Create a new task object
  let newTask = {
    id: taskId,
    title: title,
    description: description,
    dueDate: dueDate,
    status: 'To Do'
  };

  // Add the task to the task list
  taskList.push(newTask);

  // Save task list and nextId to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);

  // Render the updated task list
  renderTaskList();

  // Clear the form fields
  $('#title').val('');
  $('#description').val('');
  $('#dueDate').val('');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  // Identify the task to delete
  let taskId = parseInt($(this).closest('.task').attr('id').split('-')[1]);

  // Remove the task from the task list
  taskList = taskList.filter(task => task.id !== taskId);

  // Save task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Determine the status lane where the task was dropped
  let laneId = $(this).attr('id');
  let status = laneId.replace('-', ' ');

  // Retrieve the task id from the draggable element
  let taskId = parseInt(ui.draggable.attr('id').split('-')[1]);

  // Find the dropped task in the task list
  let droppedTask = taskList.find(task => task.id === taskId);

  // Update the status of the dropped task
  droppedTask.status = status;

  // Save task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render the updated task list
  renderTaskList();
}

// When the page loads
$(document).ready(function () {
  // Render the task list
  renderTaskList();

  // Add event listener for adding tasks
  $('#addTaskForm').submit(handleAddTask);

  // Add event listener for deleting tasks
  $(document).on('click', '.delete-btn', handleDeleteTask);

  // Make lanes droppable
  $('.lane').droppable({
    drop: handleDrop
  });

  // Make the due date field a date picker
  $('#dueDate').datepicker();
});
