package com.app.services;

import com.app.models.bindingModels.AddTask;
import com.app.models.viewModels.ViewTask;

import java.util.List;

public interface TaskService {

    ViewTask addTask(AddTask addTask);

    List<ViewTask> getAllTasks();
}
