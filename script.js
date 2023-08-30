document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const addButton = document.getElementById('add');
    const taskList = document.getElementById('task-list');

    // Function to create a new task item
    function createTaskItem(taskName, dueDate, dueTime) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${taskName}</span>
            <span>${dueDate} at ${dueTime}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="set-alarm">Set Alarm</button>
        `;

        // Attach event listeners for editing, deleting, and setting alarms
        const editButton = listItem.querySelector('.edit');
        const setAlarmButton = listItem.querySelector('.set-alarm');
        const deleteButton = listItem.querySelector('.delete');

        editButton.addEventListener('click', function () {
            const currentTaskName = listItem.querySelector('span:first-child').textContent;
            const newTaskName = prompt('Edit Task', currentTaskName);

            if (newTaskName !== null) {
                listItem.querySelector('span:first-child').textContent = newTaskName;
                updateLocalStorage();
            }
        });

        deleteButton.addEventListener('click', function () {
            listItem.remove();
            updateLocalStorage();
        });

        setAlarmButton.addEventListener('click', function () {
            const now = new Date();
            const taskDueDateTime = new Date(`${dueDate}T${dueTime}`);
            const taskName = taskInput.value.trim();
    
            if (taskDueDateTime > now) {
                const timeDifference = taskDueDateTime - now;

                // Request permission for notifications
                Notification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        const notification = new Notification(`Alarm: ${taskName}`, {
                            body: `Task due at ${dueTime}`,
                        });

                        // Handle clicks on notification
                        notification.onclick = function () {
                            // This code will run when the notification is clicked
                            // You can specify what action you want to take here
                            // For example, you can open a link or focus on your app
                            alert(`You clicked on the notification for: ${taskName}`);
                        };
                    } else {
                        alert('Permission for notification denied');
                    }
                });
                return listItem;
            }
        });

        taskList.appendChild(listItem);
        updateLocalStorage();
    }

    // Load tasks from local storage when the page loads
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(({ taskName, dueDate, dueTime }) => {
            createTaskItem(taskName, dueDate, dueTime);
        });
    }

    // Update local storage with current tasks
    function updateLocalStorage() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');
        taskItems.forEach((item) => {
            const taskName = item.querySelector('span:first-child').textContent;
            const dueDate = item.querySelector('span:nth-child(2)').textContent.split(' at ')[0];
            const dueTime = item.querySelector('span:nth-child(2)').textContent.split(' at ')[1];
            tasks.push({ taskName, dueDate, dueTime });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addButton.addEventListener('click', function () {
        const taskName = taskInput.value.trim();
        const dueDate = dateInput.value;
        const dueTime = timeInput.value;

        if (taskName && dueDate && dueTime) {
            createTaskItem(taskName, dueDate, dueTime);
            // Clear input fields
            taskInput.value = '';
            dateInput.value = '';
            timeInput.value = '';
        }
    });

    // Load tasks from local storage on page load
    loadTasksFromLocalStorage();
});