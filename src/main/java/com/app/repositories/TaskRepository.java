package com.app.repositories;

import com.app.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    Task findById(long id);

    List<Task> findAllByCategoryName(String categoryName);

    @Query(value = "SELECT t FROM Task AS t " +
            "WHERE t.name LIKE CONCAT('%', :substring, '%')")
    List<Task> findAllByName(@Param("substring") String substring);

    @Query(value = "SELECT t FROM Task AS t " +
            "WHERE t.category.id = :id " +
            "AND t.name LIKE CONCAT('%', :substring, '%')")
    List<Task> findAllByCategoryIdAndName(
            @Param("id") long id, @Param("substring") String substring);
}
