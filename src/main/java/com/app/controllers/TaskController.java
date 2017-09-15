package com.app.controllers;

import com.app.models.bindingModels.AddTask;
import com.app.models.bindingModels.EditTask;
import com.app.models.viewModels.ViewTask;
import com.app.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("")
    public ResponseEntity<List<ViewTask>> getTasks() {
        List<ViewTask> allTasks = this.taskService.getAllTasks();
        if (allTasks == null) {
            return new ResponseEntity<List<ViewTask>>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<List<ViewTask>>(allTasks, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ViewTask> addTask(@RequestBody AddTask addTask) {
        ViewTask viewTask = this.taskService.addTask(addTask);
        return new ResponseEntity<>(viewTask, HttpStatus.OK);
    }

    @GetMapping("/category={categoryName}")
    public ResponseEntity<List<ViewTask>> getTasksByCategoryName(@PathVariable String categoryName) {
        List<ViewTask> viewTasks = this.taskService.getTasksByCategoryName(categoryName);

        return new ResponseEntity<List<ViewTask>>(viewTasks, HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity editTask(@RequestBody EditTask updateTask) {
        this.taskService.editTask(updateTask);
        return new ResponseEntity(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity delete(@PathVariable long taskId){
        this.taskService.deleteById(taskId);

        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ViewTask>> getTasksByCategoryAndSubstring(
            @RequestParam("category") String categoryName, @RequestParam("task") String substring) {
        List<ViewTask> viewTasks = this.taskService.getByCategoryAndSubstring(categoryName, substring);

        return new ResponseEntity<List<ViewTask>>(viewTasks, HttpStatus.OK);
    }
}
