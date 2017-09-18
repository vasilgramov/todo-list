let taskManager = (() => {

    function loadAllTasks() {
        requester.get('/tasks')
            .then(loadTasksByCategory)
            .catch(displayError);
    }

    function loadTasksByCategory(tasks) {
        $('#allTasks').empty();

        for (let task of tasks) {
            appendTask(task);
        }
    }

    function showTaskDiv() {
        $('#taskDiv').show();

        requester.get('/categories')
            .then(appendToSelect)
            .catch(displayError);

        categoryManager.hideCategoryDiv();
    }

    function appendToSelect(categories) {
        let selector = $('#newTaskCategory');
        selector.empty();
        selector.append($('<option>').text('None'));

        for (let c of categories) {
            selector
                .append($('<option>').text(c['name']));
        }
    }

    function hideTaskDiv() {
        $('#taskDiv').hide();

        $('#newTaskName').val('');
        $('#newTaskDeadline').val('');
    }

    function createTask() {
        let taskNameInput = $('#newTaskName');
        let taskDueDateInput = $('#newTaskDueDate');

        let taskName = taskNameInput.val();
        let taskCreatedOn = new Date();
        let taskDueDate = taskDueDateInput.val();
        let taskCategoryName = $('#newTaskCategory').find(':selected').text();

        taskNameInput.val('');
        taskDueDateInput.val('');

        let todoTask = {
            name: taskName,
            createdOn: taskCreatedOn,
            dueDate: taskDueDate,
            categoryName: taskCategoryName,
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

        $('#allTasks')
            .append(
                $('<tr>')
                    .attr('data-id', task['id'])
                    .append($('<th>')
                        .append($('<input type="checkbox">')
                                    .click(() => alert('CLICKED')))
                    )
                    .append($('<td>').text(task['name']))
                    .append($('<td>').text(formatDate(task['createdDate'])))
                    .append($('<td>').text(formatDate(task['dueDate'])))
                    .append($('<td>').text(task['categoryName']))
                    .append($('<td>')
                        .append($('<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">&#9998;</button>').click(showEditModal))
                        .append($('<span> | </span>'))
                        .append($('<a href="#">&#10005;</a>').click(removeTask)))
            );
    }

    function showEditModal() {
        let currentDOMTask = $(this);
        let categoriesSelector = $('#editTaskCategory');

        let taskId = currentDOMTask.parent().parent().attr('data-id');
        localStorage.setItem('taskId', taskId);

        let taskName = currentDOMTask.parent().prev().prev().prev().prev().text();
        let createdOn = (currentDOMTask.parent().prev().prev().prev().text());
        localStorage.setItem('taskCreatedOn', createdOn);

        categoriesSelector.empty();
        categoriesSelector.append($('<option>').text('None'));

        requester.get('/categories')
            .then(function (categories) {

                $('#editTaskName').val(taskName);

                for (let c of categories) {
                    categoriesSelector
                        .append($('<option>').text(c['name']));
                }
            }).catch(displayError);
    }

    function removeTask() {
        let domTask = $(this);
        let taskId = domTask.attr('data-id');

        deleteTask(taskId);

        domTask.remove();
    }

    function updateTask() {
        let editedTaskId = localStorage.getItem('taskId');
        let editedTaskName = $('#editTaskName').val();
        let editedTaskCreatedOn = parseDate(localStorage.getItem('taskCreatedOn'));
        let editedTaskDueDate = $('#editTaskDueDate').val();
        let editedTaskCategory = $('#editTaskCategory').find(':selected');

        let task = {
            id: editedTaskId,
            name: editedTaskName,
            createdOn: editedTaskCreatedOn,
            dueDate: editedTaskDueDate,
            categoryName: editedTaskCategory
        };

        console.log(task);
        requester.update('/tasks/edit', task)
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
        getTasksByCategory,
        updateTask
    };

})();