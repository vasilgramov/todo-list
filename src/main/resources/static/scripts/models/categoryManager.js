let categoryManager = (() => {

    function loadAllCategories() {
        requester.get('/categories')
            .then(appendCategories)
            .catch(displayError);
    }

    function appendCategories(categories) {

        appendCategory({name: 'All'});

        let cUL = $('#categoriesUL');
        cUL.find('li:first-child').find('a.nav-link').addClass('active');

        for (let c of categories) {
            appendCategory(c);
        }
    }

    function showCategoryDiv() {
        $('#categoryDiv').show();
        taskManager.hideTaskDiv();
    }

    function hideCategoryDiv() {
        $('#categoryDiv').hide();
        $('#newCategoryName').val('');
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
        requester.post('categories/add', category)
            .then(appendCategory)
            .catch(displayError);
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

    function selectCategory() {
        endEditing();

        deselectSelectedCategory();

        $(this).addClass('active');
        $(this).next().show();

        let categoryName = $(this).text();
        taskManager.getTasksByCategory(categoryName);
    }

    function deselectSelectedCategory() {
        let categoriesUL = $('#categoriesUL');
        categoriesUL.find('li .active').next().hide();
        categoriesUL.find('li .active').removeClass('active');
    }

    function getSelectedCategory() {
        return $('#categoriesUL').find('li .active').text();
    }

    function removeCategory() {
        let id = $(this).parent().prev().attr('data-id');
        $(this).parent().prev().parent().remove();

        deleteCategory(id);

        $('#categoriesUL').find('li:first-child').find('a.nav-link').addClass('active');
    }

    function deleteCategory(id) {
        let url = '/categories/delete/' + id;

        requester.remove(url)
            .then(taskManager.loadAllTasks)
            .catch(displayError);
    }

    function editCategory() {

        let parent = $(this).parent().parent();

        let categoryId = $(this).parent().prev().attr('data-id');
        let categoryName = $(this).parent().prev().text();

        sessionStorage.setItem('categoryName', categoryName);

        parent.empty();
        parent
            .append($('<input id="editing" class="categoryEdit">')
                .attr('data-id', categoryId)
                .val(categoryName)
                .on('keyup', function (e) {

                    if (e.which === 27) {
                        endEditing();
                    } else if (e.which === 13) {

                        let newCategoryName = $(this).val();
                        let editedCategory = {
                            id: categoryId,
                            name: newCategoryName
                        };

                        requester.update('/categories/edit', editedCategory)
                            .then(endEditing)
                            .catch(displayError);
                    }
                })
            );
    }

    function endEditing(editedCategory) {
        let input = $('#categoriesUL').find('#editing');

        if (input.val() !== undefined) {
            let id = input.attr('data-id');
            let name = sessionStorage.getItem('categoryName');

            if (editedCategory !== undefined) {
                id = editedCategory['id'];
                name = editedCategory['name'];
            }

            let selector = input.parent();
            selector.empty();

            selector
                .append($('<a class="nav-link active" href="#"></a>')
                    .text(name)
                    .attr('data-id', id)
                    .click(categoryManager.selectCategory))
                .append($('<div class="categoryEditDelete" style="display: block">')
                    .append($('<a href="#" class="edit">&#9998;</a>')
                        .click(categoryManager.editCategory))
                    .append($('<a href="#" class="delete">&#10006;</a>')
                        .click(categoryManager.removeCategory))
                );

            return id;
        }
    }

    return {
        loadAllCategories,
        showCategoryDiv,
        hideCategoryDiv,
        createCategory,
        selectCategory,
        removeCategory,
        editCategory,
        getSelectedCategory
    };

})();