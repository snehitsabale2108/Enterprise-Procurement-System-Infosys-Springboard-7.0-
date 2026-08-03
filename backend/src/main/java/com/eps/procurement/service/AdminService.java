package com.eps.procurement.service;

import com.eps.procurement.model.*;
import com.eps.procurement.store.DataStore;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** User, department, category, role and approval-rule administration. */
@Service
public class AdminService {

    private final DataStore store;

    public AdminService(DataStore store) {
        this.store = store;
    }

    // ── Users ────────────────────────────────────────────────
    public Map<String, Object> searchUsers(String role, String department, String status) {
        List<User> list = store.users.stream()
                .filter(u -> role == null || role.isBlank() || u.role.equals(role))
                .filter(u -> department == null || department.isBlank() || u.department.equals(department))
                .filter(u -> status == null || status.isBlank() || u.status.equals(status))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public User createUser(User payload) {
        if (payload.email == null || payload.email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        payload.id = DataStore.nextId("U", store.users.size(), 3);
        payload.status = payload.status == null ? "active" : payload.status;
        payload.avatar = payload.avatar == null ? "#6366f1" : payload.avatar;
        payload.createdAt = LocalDate.now().toString();
        payload.password = payload.password == null ? "password123" : payload.password;
        store.users.add(payload);
        return payload;
    }

    public User updateUser(String id, User payload) {
        User existing = store.users.stream().filter(u -> u.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (payload.name != null) existing.name = payload.name;
        if (payload.email != null) existing.email = payload.email;
        if (payload.role != null) existing.role = payload.role;
        if (payload.department != null) existing.department = payload.department;
        if (payload.phone != null) existing.phone = payload.phone;
        if (payload.status != null) existing.status = payload.status;
        return existing;
    }

    public Map<String, String> deleteUser(String id) {
        boolean removed = store.users.removeIf(u -> u.id.equals(id));
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return Map.of("message", "User deleted");
    }

    // ── Departments ──────────────────────────────────────────
    public List<Department> departments() {
        return store.departments;
    }

    public Department createDepartment(Department payload) {
        payload.id = DataStore.nextId("D", store.departments.size(), 3);
        payload.status = payload.status == null ? "active" : payload.status;
        store.departments.add(payload);
        return payload;
    }

    public Department updateDepartment(String id, Department payload) {
        Department existing = store.departments.stream().filter(d -> d.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
        if (payload.name != null) existing.name = payload.name;
        if (payload.head != null) existing.head = payload.head;
        if (payload.budget > 0) existing.budget = payload.budget;
        if (payload.budgetUsed > 0) existing.budgetUsed = payload.budgetUsed;
        if (payload.employeeCount > 0) existing.employeeCount = payload.employeeCount;
        if (payload.status != null) existing.status = payload.status;
        return existing;
    }

    // ── Categories ───────────────────────────────────────────
    public List<Category> categories() {
        return store.categories;
    }

    public Category createCategory(Category payload) {
        payload.id = DataStore.nextId("C", store.categories.size(), 3);
        if (payload.subcategories == null) {
            payload.subcategories = new ArrayList<>();
        }
        store.categories.add(payload);
        return payload;
    }

    public Category updateCategory(String id, Category payload) {
        Category existing = store.categories.stream().filter(c -> c.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        if (payload.name != null) existing.name = payload.name;
        if (payload.subcategories != null) existing.subcategories = payload.subcategories;
        if (payload.routeTo != null) existing.routeTo = payload.routeTo;
        if (payload.icon != null) existing.icon = payload.icon;
        return existing;
    }

    // ── Roles & approval rules ───────────────────────────────
    public List<Role> roles() {
        return store.roles;
    }

    public List<ApprovalRule> approvalRules() {
        return store.approvalRules;
    }

    public ApprovalRule updateApprovalRule(String id, ApprovalRule payload) {
        ApprovalRule existing = store.approvalRules.stream().filter(r -> r.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Approval rule not found"));
        if (payload.levels != null) existing.levels = payload.levels;
        if (payload.description != null) existing.description = payload.description;
        existing.minAmount = payload.minAmount;
        existing.maxAmount = payload.maxAmount;
        return existing;
    }
}
