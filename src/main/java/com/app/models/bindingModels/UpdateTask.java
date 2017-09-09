package com.app.models.bindingModels;

import java.util.Date;

public class UpdateTask {

    private long id;

    private String name;

    private Date deadline;

    public UpdateTask() {
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

    public Date getDeadline() {
        return this.deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }
}
