package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A procurement category and the team that fulfils it. */
public class Category {
    public String id;
    public String name;
    public List<String> subcategories = new ArrayList<>();
    public String routeTo;
    public String icon;

    public Category() {}

    public Category(String id, String name, List<String> subcategories, String routeTo, String icon) {
        this.id = id;
        this.name = name;
        this.subcategories = subcategories;
        this.routeTo = routeTo;
        this.icon = icon;
    }
}
