document.addEventListener('DOMContentLoaded', () => {

    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskSubjectInput = document.getElementById('task-subject');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            // ## NEW: Add a 'completed' class to the li if the task is complete ##
            const li = document.createElement('li');
            li.className = `task-item ${task.isComplete ? 'completed' : ''}`;

            const formattedDate = dateFns.format(new Date(task.dueDate), 'PPP');

            // ## NEW: Add a checkbox to the HTML ##
            li.innerHTML = `
                <div class="info">
                    <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${task.isComplete ? 'checked' : ''}>
                    <div class="text-content">
                        <span class="title">${task.title}</span>
                        <span class="subject">${task.subject}</span>
                    </div>
                </div>
                <div class="actions">
                    <span class="due-date">Due: ${formattedDate}</span>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTask = (e) => {
        e.preventDefault();

        if (tasks.length >= 5) {
            alert("You can only have a maximum of 5 tasks! Please complete or delete a task to add more.");
            return;
        }

        const newTask = {
            id: Date.now(),
            title: taskTitleInput.value,
            subject: taskSubjectInput.value,
            dueDate: `${taskDueDateInput.value}T00:00:00`,
            isComplete: false // ## NEW: All new tasks start as incomplete ##
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    };

    const handleListClick = (e) => {
        // Handle Delete Button Clicks
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }

        // ## NEW: Handle Checkbox Clicks ##
        if (e.target.classList.contains('complete-checkbox')) {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            // Find the task that was clicked
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                // Flip its completion status
                task.isComplete = !task.isComplete;
                saveTasks();
                renderTasks();
            }
        }
    };

    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleListClick);

    renderTasks();
});