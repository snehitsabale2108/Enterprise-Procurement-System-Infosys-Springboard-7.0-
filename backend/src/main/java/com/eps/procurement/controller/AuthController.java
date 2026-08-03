package com.eps.procurement.controller;

import com.eps.procurement.model.User;
import com.eps.procurement.service.AuthService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Authentication endpoints: /api/auth/** */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", body.get("email"));
        return auth.login(username, body.get("password"));
    }

    /** Quick-access demo login by user id (used by the role picker on the login screen). */
    @PostMapping("/login-as")
    public Map<String, Object> loginAs(@RequestBody Map<String, String> body) {
        return auth.loginById(body.get("userId"));
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> body) {
        User user = auth.register(body.get("name"), body.get("email"), body.get("password"), body.get("department"));
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/profile")
    public User profile(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return auth.profileFromToken(authorization);
    }

    @PostMapping("/logout")
    public Map<String, String> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return auth.logout(authorization);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
        return auth.requestPasswordReset(body.get("email"));
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> body) {
        return auth.resetPassword(body.get("email"), body.get("oldPassword"), body.get("newPassword"));
    }
}
