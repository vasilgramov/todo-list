$(() => {

    $('#showCategoryDiv').click(categoryManager.showCategoryDiv);
    $('#btnSaveCategory').click(categoryManager.createCategory);
    $('#btnCancelCategory').click(categoryManager.hideCategoryDiv);

    $('#showTaskDiv').click(taskManager.showTaskDiv);
    $('#btnSaveTask').click(taskManager.createTask);
    $('#btnCancelTask').click(taskManager.hideTaskDiv);

    $('#doneTasksAnchor').click(taskManager.toggle);

    $('#btnEditTask').click(taskManager.updateTask);

    $('#searchInput').on('input', taskManager.searchBy);

    categoryManager.loadAllCategories();
    taskManager.loadAllTasks();

    categoryManager.hideCategoryDiv();
    taskManager.hideTaskDiv();
});

// TODO: in a handler ???

function displayError(message) {
    let errBox = $('#errorBox');
    errBox.text(message).show();
    setTimeout(() => errBox.hide(), 3000)
}







