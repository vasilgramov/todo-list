$(() => {

    $('#btnCancel').click(hideTaskDiv);
    $('#showTaskDiv').click(showTaskDiv);
    $('#btnSave').click(addTask);

    loadCategories();
    // loadTasks();

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

function loadCategories() {
    $.ajax({
        method: 'GET',
        url: '/categories',
        success: appendCategories,
        error: displayError
    });
}

function appendCategories(categories) {
    let categoriesUL = $('#categoriesUL');

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
    $.ajax({
        method: 'GET',
        url: `/tasks/category=${categoryName}`,
        success: appendTasks,
        error: displayError
    });
}

function deselectSelectedCategory() {
    $('#categoriesUL').find('li .active').removeClass('active');
}

function addTask() {
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

    $.ajax({
        type: 'POST',
        url: '/tasks/add',
        data: JSON.stringify(todoTask),
        contentType: 'application/json',
        success: appendAddedTask,
        error: displayError
    });
}

function appendAddedTask(task) {
    let name = task['name'];
    let deadline = formatDate(task['deadline']);

    $('#todoTasks')
        .append($('<div>').addClass('row').append(
            $('<input/>')
                .addClass('updateNameClass form-control col-sm-9')
                .val(name))
            .append(
                $('<input/>')
                    .addClass('updateDeadlineClass form-control col-sm-3')
                    .val(deadline)));

    hideTaskDiv();
}

function formatDate(dateInNumber) {
    let date = new Date(dateInNumber);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return year + '/' + month + '/' + day;
}

function getSelectedCategory() {
    return $('#categoriesUL').find('li .active').text();
}

function loadTasks() {
    $.ajax({
        method: 'GET',
        url: '/tasks',
        success: appendTasks,
        error: displayError
    });
}

function appendTasks(tasks) {
    let tasksSelector = $('#todoTasks');
    tasksSelector.empty();

    for (let task of tasks) {
        let name = task['name'];
        let deadline = formatDate(task['deadline']);

        tasksSelector
            .append($('<div>').addClass('row').append(
                $('<input/>')
                    .addClass('updateNameClass form-control col-sm-9')
                    .val(name))
                .append(
                    $('<input/>')
                        .addClass('updateDeadlineClass form-control col-sm-3')
                        .val(deadline)));
    }
}