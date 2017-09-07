package com.app.controllers;

import com.app.models.viewModels.ViewCategory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/categories")
public class CategoryController {

//    private

    public List<ResponseEntity<ViewCategory>> getCategories() {

    }
}
