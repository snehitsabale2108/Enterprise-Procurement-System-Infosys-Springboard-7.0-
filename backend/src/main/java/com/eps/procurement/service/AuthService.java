package com.eps.procurement.service;

import com.eps.procurement.model.User;
import com.eps.procurement.store.DataStore;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Login, registration and profile lookups backed by the in-memory store. */
@Service
public class AuthService {

    private final DataStore store;
    private final AuditService audit;

    public AuthService(DataStore store, AuditService audit) {
        this.store = store;
        this.audit = audit;
    }

    public Map<String, Object> login(String username, String password) {
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }
        User user = store.users.stream()
                .filter(u -> u.email.equalsIgnoreCase(username.trim()) || u.id.equalsIgnoreCase(username.trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No account found with this email address"));

        if (!"active".equals(user.status)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Your account has been deactivated. Contact admin.");
        }
        if (!password.equals(user.password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = UUID.randomUUID().toString();
        store.activeTokens.put(token, user.id);
        audit.record(user, "LOGIN", "User", user.id, null, "logged in", "User signed in");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("token", token);
        body.put("refreshToken", UUID.randomUUID().toString());
        body.put("user", user);
        body.put("expiresIn", 86400);
        return body;
    }

    public Map<String, Object> loginById(String userId) {
        User user = findById(userId);
        String token = UUID.randomUUID().toString();
        store.activeTokens.put(token, user.id);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("token", token);
        body.put("user", user);
        body.put("expiresIn", 86400);
        return body;
    }

    public User register(String name, String email, String password, String department) {
        if (name == null || name.isBlank() || email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All fields are required");
        }
        boolean exists = store.users.stream().anyMatch(u -> u.email.equalsIgnoreCase(email.trim()));
        if (exists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        User user = new User(
                DataStore.nextId("U", store.users.size(), 3),
                name.trim(), email.trim().toLowerCase(), "employee",
                department == null || department.isBlank() ? "Engineering" : department,
                "#6366f1", "", "active", LocalDate.now().toString(), password);
        store.users.add(user);
        audit.record(user, "CREATE_USER", "User", user.id, null, "self registered", "New employee account created");
        return user;
    }

    public User profileFromToken(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        String userId = store.activeTokens.get(token);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return findById(userId);
    }

    public Map<String, String> logout(String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        store.activeTokens.remove(token);
        return Map.of("message", "Logged out successfully");
    }

    public Map<String, String> requestPasswordReset(String email) {
        store.users.stream()
                .filter(u -> u.email.equalsIgnoreCase(String.valueOf(email).trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No account found with this email address"));
        return Map.of("message", "Password reset link sent to " + email);
    }

    public Map<String, String> resetPassword(String email, String oldPassword, String newPassword) {
        User user = store.users.stream()
                .filter(u -> u.email.equalsIgnoreCase(String.valueOf(email).trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No account found with this email address"));
        if (oldPassword != null && !oldPassword.isBlank() && !oldPassword.equals(user.password)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be at least 6 characters");
        }
        user.password = newPassword;
        return Map.of("message", "Password reset successfully");
    }

    public User findById(String userId) {
        return store.users.stream()
                .filter(u -> u.id.equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String extractToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.toLowerCase().startsWith("bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing bearer token");
        }
        return authorizationHeader.substring(7).trim();
    }
}
