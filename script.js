document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tasksLeft = document.getElementById('tasksLeft');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        });
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${index}">
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn" data-id="${index}">Delete</button>
                `;
                taskList.appendChild(taskItem);
            });
        }
        
        updateTasksLeft();
    }
    
    // Add new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks(getCurrentFilter());
        }
    }
    
    // Delete task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(getCurrentFilter());
    }
    
    // Toggle task completion
    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(getCurrentFilter());
    }
    
    // Clear completed tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks(getCurrentFilter());
    }
    
    // Update tasks left counter
    function updateTasksLeft() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksLeft.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Get current filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    taskList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            deleteTask(parseInt(e.target.dataset.id));
        } else if (e.target.classList.contains('task-checkbox')) {
            toggleTask(parseInt(e.target.dataset.id));
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Initial render
    renderTasks();
});