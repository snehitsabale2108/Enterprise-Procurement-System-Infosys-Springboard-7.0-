package com.backend.procurement.service;

import com.backend.procurement.dto.PurchaseRequestDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.BadRequestException;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.ApprovalRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final ApprovalRepository approvalRepository;
    private final NotificationService notificationService;

    public List<PurchaseRequestDto> pendingForStage(ApprovalStage stage) {
        return purchaseRequestRepository.findByApprovalStageAndCurrentStatus(stage, RequestStatus.PENDING)
                .stream().map(Mappers::toDto).toList();
    }

    @Transactional
    public PurchaseRequestDto act(Long id, ApprovalStage stage, String action, String comments, User approver) {
        PurchaseRequest pr = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseRequest", id));
        if (pr.getApprovalStage() != stage)
            throw new BadRequestException("Request is not at stage " + stage);
        if (pr.getCurrentStatus() != RequestStatus.PENDING)
            throw new BadRequestException("Request is not pending");

        Approval approval = Approval.builder()
                .purchaseRequest(pr).approver(approver).stage(stage)
                .action(action).comments(comments).actionDate(LocalDateTime.now())
                .build();
        approvalRepository.save(approval);

        switch (action) {
            case "APPROVED" -> {
                ApprovalStage next = nextStage(stage);
                pr.setApprovalStage(next);
                if (next == ApprovalStage.COMPLETED) {
                    pr.setCurrentStatus(RequestStatus.APPROVED);
                } else if (next == ApprovalStage.PROCUREMENT) {
                    pr.setCurrentStatus(RequestStatus.IN_PROCUREMENT);
                } else {
                    pr.setCurrentStatus(RequestStatus.PENDING);
                }
            }
            case "REJECTED" -> pr.setCurrentStatus(RequestStatus.REJECTED);
            case "RETURNED" -> {
                pr.setCurrentStatus(RequestStatus.RETURNED);
                pr.setApprovalStage(ApprovalStage.MANAGER);
            }
            default -> throw new BadRequestException("Unknown action: " + action);
        }
        pr.setUpdatedAt(LocalDateTime.now());
        purchaseRequestRepository.save(pr);

        notificationService.notify(pr.getEmployee(), "APPROVAL_" + action,
                "Request " + pr.getRequestNumber() + " " + action.toLowerCase(),
                (comments != null ? comments : "Your request was " + action.toLowerCase() + " at " + stage + " stage."));
        return Mappers.toDto(pr);
    }

    private ApprovalStage nextStage(ApprovalStage current) {
        return switch (current) {
            case MANAGER -> ApprovalStage.SENIOR_MANAGER;
            case SENIOR_MANAGER -> ApprovalStage.HEAD;
            case HEAD -> ApprovalStage.PROCUREMENT;
            case PROCUREMENT -> ApprovalStage.COMPLETED;
            case COMPLETED -> ApprovalStage.COMPLETED;
        };
    }
}
