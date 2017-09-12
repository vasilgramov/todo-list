package com.app.controllers;

import com.app.models.bindingModels.AddCategory;
import com.app.models.bindingModels.EditCategory;
import com.app.models.viewModels.ViewCategory;
import com.app.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(
            CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("")
    public ResponseEntity<List<ViewCategory>> getCategories() {
        List<ViewCategory> categories = this.categoryService.getAllCategories();
        if (categories == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ViewCategory> addCategory(@RequestBody AddCategory addCategory) {
        ViewCategory viewCategory = this.categoryService.addCategory(addCategory);
        return new ResponseEntity<ViewCategory>(viewCategory, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<ViewCategory> editCategory(@RequestParam EditCategory editCategory) {
        return null;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ViewCategory> deleteCategory(@PathVariable long id) {
        this.categoryService.delete(id);

        return new ResponseEntity<ViewCategory>(HttpStatus.OK);
    }
}
