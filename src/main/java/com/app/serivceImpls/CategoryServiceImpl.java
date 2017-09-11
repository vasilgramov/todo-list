package com.app.serivceImpls;

import com.app.entities.Category;
import com.app.models.bindingModels.AddCategory;
import com.app.models.viewModels.ViewCategory;
import com.app.repositories.CategoryRepository;
import com.app.services.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    private final ModelMapper modelMapper;

    @Autowired
    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }


    @Override
    public List<ViewCategory> getAllCategories() {
        List<Category> categories = this.categoryRepository.getAllCategories();
        List<ViewCategory> result = new ArrayList<>();
        for (Category c : categories) {
            result.add(this.modelMapper.map(c, ViewCategory.class));
        }

        return result;
    }

    @Override
    public Category categoryByName(String name) {
        return this.categoryRepository.findByName(name);
    }

    @Override
    public ViewCategory addCategory(AddCategory addCategory) {
        Category category = this.modelMapper.map(addCategory, Category.class);
        this.categoryRepository.saveAndFlush(category);

        return this.modelMapper.map(category, ViewCategory.class);
    }
}
