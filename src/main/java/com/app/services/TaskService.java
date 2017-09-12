package com.app.services;

import com.app.models.bindingModels.AddTask;
import com.app.models.bindingModels.EditTask;
import com.app.models.viewModels.ViewTask;

import java.util.List;

public interface TaskService {

    ViewTask addTask(AddTask addTask);

    List<ViewTask> getAllTasks();

    List<ViewTask> getTasksByCategoryName(String categoryName);

    void updateTask(EditTask updateTask);

    void deleteById(long taskId);
}
