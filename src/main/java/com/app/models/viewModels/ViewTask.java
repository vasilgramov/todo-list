package com.app.models.viewModels;

import java.util.Date;

public class ViewTask {

    private String name;

    private Date deadline;

    public ViewTask() {
        super();
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
