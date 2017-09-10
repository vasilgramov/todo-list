$(() => {

    $('#btnCancel').click(hideTaskDiv);
    $('#showTaskDiv').click(showTaskDiv);
    $('#btnSave').click(createTask);

    loadAllCategories();
    loadAllTasks();

    hideTaskDiv();
});

function hideTaskDiv() {
    $('#taskDiv').hide();
}

function showTaskDiv() {
    $('#taskDiv').show();
}

function displayError(message) {
    let errBox = $('#errorBox');
    errBox.text(message).show();
    setTimeout(() => errBox.hide(), 3000)
}

function loadAllCategories() {
    $.ajax({
        method: 'GET',
        url: '/categories',
        success: appendCategories,
        error: displayError
    });
}

function appendCategories(categories) {
    let categoriesUL = $('#categoriesUL');

    // all
    categoriesUL.append(
        $('<li class="nav-item"></li>')
            .append($('<a class="nav-link active" href="#"></a>')
                .text('All')
                .click(selectCategory))
    );

    // by category
    for (let c of categories) {
        categoriesUL.append(
            $('<li class="nav-item"></li>')
                .append($('<a class="nav-link" href="#"></a>')
                    .text(c['name'])
                    .click(selectCategory))
        );
    }
}

function selectCategory() {
    deselectSelectedCategory();

    $(this).addClass('active');

    let categoryName = $(this).text();
    getTasksByCategory(categoryName);
}

function getTasksByCategory(category) {
    if (category === 'All') {
        loadAllTasks();
        return;
    }

    $.ajax({
        method: 'GET',
        url: `/tasks/category=${category}`,
        success: loadTasksByCategory,
        error: displayError
    });
}

function deselectSelectedCategory() {
    $('#categoriesUL').find('li .active').removeClass('active');
}

function createTask() {
    let taskInput = $('#newTaskName');
    let taskDeadlineInput = $('#newTaskDeadline');

    let taskName = taskInput.val();
    let taskDeadline = taskDeadlineInput.val();
    let taskCategoryName = getSelectedCategory();

    if (taskCategoryName === '') {
        displayError('Select a category!');
        return;
    }

    let todoTask = {
        name: taskName,
        deadline: taskDeadline,
        category: taskCategoryName
    };

    addTask(todoTask);
}

function addTask(todoTask) {
    $.ajax({
        type: 'POST',
        url: '/tasks/add',
        data: JSON.stringify(todoTask),
        contentType: 'application/json',
        success: appendTask,
        error: displayError
    });
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
                        .addClass('updateNameClass form-control col-sm-8')
                        .val(name))
                .append(
                    $('<input/>')
                        .addClass('updateDeadlineClass form-control col-sm-3')
                        .val(deadline))
                .on('change', editTask)
                .on('keyup', removeTask)
            );

    hideTaskDiv();
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
    let year = tokens[0] - 1;
    let month = tokens[1] - 1;
    let day = tokens[2] + 1;

    return new Date(year, month, day);
}

function getSelectedCategory() {
    return $('#categoriesUL').find('li .active').text();
}

function loadTasksByCategory(tasks) {
    let tasksSelector = $('#todoTasks');
    tasksSelector.empty();

    for (let task of tasks) {
        appendTask(task);
    }
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

    updateItem(toDoItem);
}

function updateItem(item) {
    $.ajax({
        method: 'PUT',
        url: '/tasks/edit',
        data: JSON.stringify(item),
        contentType: 'application/json',
        error: displayError
    });
}

function removeTask(e) {
    if (e.which === 27) {
        let domTask = $(this);
        let taskId = domTask.attr('data-id');

        deleteTask(taskId);

        domTask.remove();
    }
}

function deleteTask(id) {
    $.ajax({
        type: 'DELETE',
        url: '/tasks/delete/' + id
    });
}

function loadAllTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: loadTasksByCategory,
        error: displayError
    })
}