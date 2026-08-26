package com.eps.procurement.controller;

import com.eps.procurement.model.*;
import com.eps.procurement.service.AdminService;
import com.eps.procurement.service.AuditService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Administration endpoints: users, departments, categories, roles, rules, audit logs. */
@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService admin;
    private final AuditService audit;

    public AdminController(AdminService admin, AuditService audit) {
        this.admin = admin;
        this.audit = audit;
    }

    @GetMapping("/users")
    public Map<String, Object> users(@RequestParam(required = false) String role,
                                     @RequestParam(required = false) String department,
                                     @RequestParam(required = false) String status) {
        return admin.searchUsers(role, department, status);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(admin.createUser(payload));
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User payload) {
        return admin.updateUser(id, payload);
    }

    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable String id) {
        return admin.deleteUser(id);
    }

    @GetMapping("/departments")
    public List<Department> departments() {
        return admin.departments();
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(admin.createDepartment(payload));
    }

    @PutMapping("/departments/{id}")
    public Department updateDepartment(@PathVariable String id, @RequestBody Department payload) {
        return admin.updateDepartment(id, payload);
    }

    @GetMapping("/categories")
    public List<Category> categories() {
        return admin.categories();
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(admin.createCategory(payload));
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody Category payload) {
        return admin.updateCategory(id, payload);
    }

    @GetMapping("/roles")
    public List<Role> roles() {
        return admin.roles();
    }

    @GetMapping("/approval-rules")
    public List<ApprovalRule> approvalRules() {
        return admin.approvalRules();
    }

    @PutMapping("/approval-rules/{id}")
    public ApprovalRule updateApprovalRule(@PathVariable String id, @RequestBody ApprovalRule payload) {
        return admin.updateApprovalRule(id, payload);
    }

    @GetMapping("/audit-logs")
    public Map<String, Object> auditLogs(@RequestParam(required = false) String userId,
                                         @RequestParam(required = false) String action,
                                         @RequestParam(required = false) String entity,
                                         @RequestParam(required = false) String entityId) {
        return audit.search(userId, action, entity, entityId);
    }
}
