let taskManager = (() => {

    function loadAllTasks() {
        requester.get('/tasks')
            .then(loadTasksByCategory)
            .catch(displayError);
    }

    function loadTasksByCategory(tasks) {
        let tasksSelector = $('#todoTasks');
        tasksSelector.empty();

        for (let task of tasks) {
            appendTask(task);
        }
    }

    function showTaskDiv() {
        $('#taskDiv').show();
    }

    function hideTaskDiv() {
        $('#taskDiv').hide();

        $('#newTaskName').val('');
        $('#newTaskDeadline').val('');
    }

    function createTask() {
        let taskNameInput = $('#newTaskName');
        let taskDeadlineInput = $('#newTaskDeadline');

        let taskName = taskNameInput.val();
        let taskDeadline = taskDeadlineInput.val();
        let taskCategoryName = categoryManager.getSelectedCategory();

        taskNameInput.val('');
        taskDeadlineInput.val('');

        if (taskCategoryName === '') {
            displayError('Select a category!');
            return;
        }

        let todoTask = {
            name: taskName,
            deadline: taskDeadline,
            category: taskCategoryName
        };

        hideTaskDiv();
        addTask(todoTask);
    }

    function addTask(todoTask) {
        requester.post('/tasks/add', todoTask)
            .then(appendTask)
            .catch(displayError);
    }

    function getTasksByCategory(category) {
        if (category === 'All') {
            taskManager.loadAllTasks();
            return;
        }

        requester.get(`/tasks/category=${category}`)
            .then(taskManager.loadTasksByCategory)
            .catch(displayError);
    }

    function appendTask(task) {
        let id = task['id'];
        let name = task['name'];
        let deadline = formatDate(task['deadline']);

        $('#todoTasks')
            .append(
                $('<div>')
                    .attr('data-id', id)
                    .addClass('row')
                    .append(
                        $('<input type="checkbox">')
                            .addClass('checkbox')
                            .click(() => alert('CLICKED'))
                    )
                    .append(
                        $('<input/>')
                            .addClass('updateNameClass form-control col-sm-5')
                            .val(name))
                    .append(
                        $('<input/>')
                            .addClass('updateDeadlineClass form-control col-sm-3')
                            .val(deadline))
                    .on('change', editTask)
                    .on('keyup', removeTask)
            );
    }

    function editTask() {
        let currentDOMTask = $(this);

        let taskId = currentDOMTask.attr('data-id');
        let taskName = currentDOMTask.find('.updateNameClass').val();
        let taskDeadline = parseDate(currentDOMTask.find('.updateDeadlineClass').val());

        let toDoItem = {
            id: taskId,
            name: taskName,
            deadline: taskDeadline
        };

        updateTask(toDoItem);
    }

    function removeTask(e) {
        if (e.which === 27) {
            let domTask = $(this);
            let taskId = domTask.attr('data-id');

            deleteTask(taskId);

            domTask.remove();
        }
    }

    function updateTask(item) {
        requester.update('/tasks/edit', item)
            .catch(displayError);
    }

    function searchBy() {
        let selectedCategory = categoryManager.getSelectedCategory();
        let taskInput = $('#searchInput').val();

        getTasksBySearchedInput(selectedCategory, taskInput);
    }

    function getTasksBySearchedInput(category, substring) {
        let url = `/tasks/search?category=${category}&task=${substring}`;

        requester.get(url)
            .then(loadTasksByCategory)
            .catch(displayError);
    }

    function deleteTask(id) {
        requester.remove('/tasks/delete/' + id);
    }

    function formatDate(dateInNumber) {
        let date = new Date(dateInNumber);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return year + '/' + month + '/' + day;
    }

    function parseDate(dateAsString) {
        let tokens = dateAsString.split('/');
        let year = tokens[0];
        let month = tokens[1] - 1;
        let day = tokens[2];

        return new Date(year, month, day);
    }

    return {
        loadAllTasks,
        loadTasksByCategory,
        showTaskDiv,
        hideTaskDiv,
        createTask,
        searchBy,
        getTasksByCategory
    };

})();