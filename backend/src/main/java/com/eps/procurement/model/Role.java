package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A role and the permissions it grants. */
public class Role {
    public String id;
    public String name;
    public String displayName;
    public List<String> permissions = new ArrayList<>();

    public Role() {}

    public Role(String id, String name, String displayName, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.permissions = permissions;
    }
}
