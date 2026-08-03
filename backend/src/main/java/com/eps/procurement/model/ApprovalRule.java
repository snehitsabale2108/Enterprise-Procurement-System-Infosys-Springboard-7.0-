package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** Amount-based routing rule that decides which approval levels are required. */
public class ApprovalRule {
    public String id;
    public double minAmount;
    public double maxAmount;
    public List<String> levels = new ArrayList<>();
    public String description;

    public ApprovalRule() {}

    public ApprovalRule(String id, double minAmount, double maxAmount, List<String> levels, String description) {
        this.id = id;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.levels = levels;
        this.description = description;
    }
}
