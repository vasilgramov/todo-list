package com.app.serivceImpls;

import com.app.entities.Category;
import com.app.entities.Task;
import com.app.models.bindingModels.AddTask;
import com.app.models.bindingModels.EditTask;
import com.app.models.viewModels.ViewTask;
import com.app.repositories.TaskRepository;
import com.app.services.CategoryService;
import com.app.services.TaskService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    private final ModelMapper modelMapper;

    private final CategoryService categoryService;

    @Autowired
    public TaskServiceImpl(
            TaskRepository taskRepository,
            ModelMapper modelMapper,
            CategoryService categoryService) {
        this.taskRepository = taskRepository;
        this.modelMapper = modelMapper;
        this.categoryService = categoryService;
    }

    @Override
    public ViewTask addTask(AddTask addTask) {
        Category category = this.categoryService.categoryByName(addTask.getCategoryName());
        Task task = this.modelMapper.map(addTask, Task.class);
        task.setCategory(category);
        this.taskRepository.saveAndFlush(task);

        ViewTask viewTask = this.modelMapper.map(task, ViewTask.class);
        viewTask.setId(task.getId());
        return viewTask;
    }

    @Override
    public List<ViewTask> getAllTasks() {
        List<Task> all = this.taskRepository.findAll();
        List<ViewTask> viewTasks = new ArrayList<>();

        for (Task t : all) {
            viewTasks.add(this.modelMapper.map(t, ViewTask.class));
        }

        return viewTasks;
    }

    @Override
    public List<ViewTask> getTasksByCategoryName(String categoryName) {
        List<Task> all = this.taskRepository.findAllByCategoryName(categoryName);
        List<ViewTask> viewTasks = new ArrayList<>();

        for (Task t : all) {
            viewTasks.add(this.modelMapper.map(t, ViewTask.class));
        }

        return viewTasks;
    }

    @Override
    public void editTask(EditTask editTask) {
        Task task = this.taskRepository.findById(editTask.getId());

        task.setName(editTask.getName());
        task.setDueDate(editTask.getDueDate());
        task.setCategory(this.categoryService.categoryByName(editTask.getCategoryName()));

        this.taskRepository.saveAndFlush(task);
    }

    @Override
    public void deleteById(long taskId) {
        this.taskRepository.delete(taskId);
    }

    @Override
    public List<ViewTask> getByCategoryAndSubstring(String category, String substring) {
        List<Task> tasks = new ArrayList<>();

        if (category.equals("All")) {
            tasks = this.taskRepository.findAllByName(substring);
        } else {
            long id = this.categoryService.categoryByName(category).getId();
            tasks = this.taskRepository.findAllByCategoryIdAndName(id, substring);
        }

        List<ViewTask> result = new ArrayList<>();
        for (Task task : tasks) {
            result.add(this.modelMapper.map(task, ViewTask.class));
        }

        return result;
    }

    @Override
    public void completeTask(long id) {
        Task one = this.taskRepository.findById(id);

        one.setCompleted(!one.isCompleted());
        this.taskRepository.saveAndFlush(one);
    }
}
