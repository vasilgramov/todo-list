package com.app.models.viewModels;

import java.util.Date;

public class ViewTask {

    private long id;

    private String name;

    private Date createdDate;

    private Date dueDate;

    private String categoryName;

    private boolean isCompleted;

    public ViewTask() {
        super();
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedDate() {
        return this.createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public boolean isCompleted() {
        return this.isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }
}
