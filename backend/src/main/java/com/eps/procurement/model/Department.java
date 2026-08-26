package com.eps.procurement.model;

/** An organisational department with its procurement budget. */
public class Department {
    public String id;
    public String name;
    public String head;
    public double budget;
    public double budgetUsed;
    public int employeeCount;
    public String status;

    public Department() {}

    public Department(String id, String name, String head, double budget, double budgetUsed,
                      int employeeCount, String status) {
        this.id = id;
        this.name = name;
        this.head = head;
        this.budget = budget;
        this.budgetUsed = budgetUsed;
        this.employeeCount = employeeCount;
        this.status = status;
    }
}
