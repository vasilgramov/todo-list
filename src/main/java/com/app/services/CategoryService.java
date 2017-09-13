package com.app.services;

import com.app.entities.Category;
import com.app.models.bindingModels.AddCategory;
import com.app.models.bindingModels.EditCategory;
import com.app.models.viewModels.ViewCategory;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CategoryService {

    List<ViewCategory> getAllCategories();

    Category categoryByName(String name);

    ViewCategory addCategory(AddCategory addCategory);

    void delete(long id);

    ViewCategory editCategory(EditCategory editCategory);
}
