package com.app.services;

import com.app.entities.Category;
import com.app.models.viewModels.ViewCategory;

import java.util.List;

public interface CategoryService {

    List<ViewCategory> getAllCategories();

    Category categoryByName(String name);
}
