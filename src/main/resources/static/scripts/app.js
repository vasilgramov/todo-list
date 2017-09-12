$(() => {

    $('#showTaskDiv').click(showTaskDiv);
    $('#btnSaveTask').click(createTask);
    $('#btnCancelTask').click(hideTaskDiv);

    $('#showCategoryDiv').click(showCategoryDiv);
    $('#btnSaveCategory').click(createCategory);
    $('#btnCancelCategory').click(hideCategoryDiv);

    loadAllCategories();
    loadAllTasks();

    hideTaskDiv();
    hideCategoryDiv();
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

    appendCategory({name: 'All'});

    let cUL = $('#categoriesUL');
    cUL.find('li:first-child').find('a.nav-link').addClass('active');

    for (let c of categories) {
        appendCategory(c);
    }
}

function selectCategory() {
    deselectSelectedCategory();

    $(this).addClass('active');
    $(this).next().show();

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
    let categoriesUL = $('#categoriesUL');
    categoriesUL.find('li .active').next().hide();
    categoriesUL.find('li .active').removeClass('active');
}

function createTask() {
    let taskNameInput = $('#newTaskName');
    let taskDeadlineInput = $('#newTaskDeadline');

    let taskName = taskNameInput.val();
    let taskDeadline = taskDeadlineInput.val();
    let taskCategoryName = getSelectedCategory();

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
    console.log('EDITING');

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

function showCategoryDiv() {
    $('#categoryDiv').show();
}

function hideCategoryDiv() {
    $('#categoryDiv').hide();
}

function createCategory() {
    let categoryInput = $('#newCategoryName');
    let categoryName = categoryInput.val();

    categoryInput.val('');

    let category = {
        name: categoryName
    };

    hideCategoryDiv();
    addCategory(category);
}

function addCategory(category) {
    $.ajax({
        method: 'POST',
        url: 'categories/add',
        data: JSON.stringify(category),
        contentType: 'application/json',
        success: appendCategory,
        error: displayError
    });
}

function appendCategory(c) {
    let categoriesUL = $('#categoriesUL');

    if (c['name'] === 'All') {
        categoriesUL.append(
            $('<li class="nav-item categoryLi"></li>')
                .append($('<a class="nav-link" href="#"></a>')
                    .text(c['name'])
                    .click(selectCategory))
        );
    } else {
        categoriesUL.append(
            $('<li class="nav-item categoryLi"></li>')
                .append($('<a class="nav-link" href="#"></a>')
                    .text(c['name'])
                    .attr('data-id', c['id'])
                    .click(selectCategory))
                .append($('<div class="categoryEditDelete">')
                    .append($('<a href="#" class="edit">&#9998;</a>')
                        .click(editCategory))
                    .append($('<a href="#" class="delete">&#10006;</a>')
                        .click(removeCategory))
                )
        );
    }
}


function editCategory() {
    let parent = $(this).parent().prev().parent();
    let child = parent.html();
    let categoryName = $(this).parent().prev().text();

    
}

function removeCategory() {
    let id = $(this).parent().prev().attr('data-id');
    $(this).parent().prev().parent().remove();

    deleteCategory(id);
}

function deleteCategory(id) {
    $.ajax({
        method: 'DELETE',
        url: '/categories/delete/' + id,
        error: displayError
    });
}


