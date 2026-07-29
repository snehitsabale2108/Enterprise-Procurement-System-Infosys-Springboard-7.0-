package com.backend.procurement.controller;

import com.backend.procurement.dto.ApprovalActionDto;
import com.backend.procurement.dto.PurchaseRequestDto;
import com.backend.procurement.entity.ApprovalStage;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.ApprovalService;
import com.backend.procurement.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    // Manager
    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<PurchaseRequestDto>>> managerPending() {
        return ResponseEntity.ok(ApiResponse.ok(approvalService.pendingForStage(ApprovalStage.MANAGER)));
    }

    @PutMapping("/{id}/manager/approve")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> managerApprove(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Approved",
                approvalService.act(id, ApprovalStage.MANAGER, "APPROVED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/manager/reject")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> managerReject(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Rejected",
                approvalService.act(id, ApprovalStage.MANAGER, "REJECTED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/manager/return")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> managerReturn(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Returned",
                approvalService.act(id, ApprovalStage.MANAGER, "RETURNED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    // Senior Manager
    @GetMapping("/senior-manager")
    @PreAuthorize("hasAnyRole('SENIOR_MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<List<PurchaseRequestDto>>> smPending() {
        return ResponseEntity.ok(ApiResponse.ok(approvalService.pendingForStage(ApprovalStage.SENIOR_MANAGER)));
    }

    @PutMapping("/{id}/senior-manager/approve")
    @PreAuthorize("hasAnyRole('SENIOR_MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> smApprove(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Approved",
                approvalService.act(id, ApprovalStage.SENIOR_MANAGER, "APPROVED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/senior-manager/reject")
    @PreAuthorize("hasAnyRole('SENIOR_MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> smReject(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Rejected",
                approvalService.act(id, ApprovalStage.SENIOR_MANAGER, "REJECTED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/senior-manager/return")
    @PreAuthorize("hasAnyRole('SENIOR_MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> smReturn(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Returned",
                approvalService.act(id, ApprovalStage.SENIOR_MANAGER, "RETURNED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    // Head
    @GetMapping("/head")
    @PreAuthorize("hasAnyRole('HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<List<PurchaseRequestDto>>> headPending() {
        return ResponseEntity.ok(ApiResponse.ok(approvalService.pendingForStage(ApprovalStage.HEAD)));
    }

    @PutMapping("/{id}/head/approve")
    @PreAuthorize("hasAnyRole('HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> headApprove(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Approved",
                approvalService.act(id, ApprovalStage.HEAD, "APPROVED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/head/reject")
    @PreAuthorize("hasAnyRole('HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> headReject(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Rejected",
                approvalService.act(id, ApprovalStage.HEAD, "REJECTED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/head/return")
    @PreAuthorize("hasAnyRole('HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> headReturn(@PathVariable Long id, @RequestBody(required = false) ApprovalActionDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Returned",
                approvalService.act(id, ApprovalStage.HEAD, "RETURNED", commentsOf(dto), authenticatedUserProvider.currentUser())));
    }

    private String commentsOf(ApprovalActionDto dto) {
        return dto != null ? dto.getComments() : null;
    }
}
