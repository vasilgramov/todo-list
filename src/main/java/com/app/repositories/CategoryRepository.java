package com.app.repositories;

import com.app.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category AS c")
    List<Category> getAllCategories();

    Category findByName(String name);

    Category findById(long id);
}
