package com.backend.procurement.service;

import com.backend.procurement.dto.*;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.BadRequestException;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.*;
import com.backend.procurement.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.backend.procurement.security.CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new BadRequestException("Username already exists");
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BadRequestException("Email already exists");

        Role role;
        try { role = Role.valueOf(req.getRole().toUpperCase().replace(" ", "_")); }
        catch (Exception e) { throw new BadRequestException("Invalid role: " + req.getRole()); }

        Department department = null;
        if (req.getDepartmentId() != null) {
            department = departmentRepository.findById(req.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", req.getDepartmentId()));
        }

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(role)
                .department(department)
                .active(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        UserDetails ud = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(ud);
        return AuthResponse.builder().token(token).tokenType("Bearer").user(Mappers.toDto(user)).build();
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        User user = userRepository.findByUsername(req.getUsername())
                .or(() -> userRepository.findByEmail(req.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("User", req.getUsername()));
        UserDetails ud = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(ud);
        return AuthResponse.builder().token(token).tokenType("Bearer").user(Mappers.toDto(user)).build();
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User with email", req.getEmail()));
        String token = UUID.randomUUID().toString();
        PasswordResetToken prt = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(1))
                .used(false)
                .build();
        tokenRepository.save(prt);
        // Real system: send email. Return token for now.
        return token;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        PasswordResetToken prt = tokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        if (prt.isUsed()) throw new BadRequestException("Token already used");
        if (prt.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new BadRequestException("Token expired");
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        prt.setUsed(true);
        tokenRepository.save(prt);
    }
}
