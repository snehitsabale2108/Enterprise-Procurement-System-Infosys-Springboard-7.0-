package com.backend.procurement.service;

import com.backend.procurement.dto.PurchaseRequestCreateDto;
import com.backend.procurement.dto.PurchaseRequestDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.BadRequestException;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.DepartmentRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseRequestService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    public List<PurchaseRequestDto> findAll() {
        return purchaseRequestRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    public PurchaseRequestDto findById(Long id) {
        return Mappers.toDto(purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseRequest", id)));
    }

    public List<PurchaseRequestDto> findMy(User employee) {
        return purchaseRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee).stream()
                .map(Mappers::toDto).toList();
    }

    @Transactional
    public PurchaseRequestDto create(PurchaseRequestCreateDto dto, User employee) {
        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", dto.getDepartmentId()));
        } else if (employee.getDepartment() != null) {
            dept = employee.getDepartment();
        }

        Priority priority = Priority.MEDIUM;
        if (dto.getPriority() != null) {
            try { priority = Priority.valueOf(dto.getPriority().toUpperCase()); }
            catch (Exception ignored) {}
        }

        PurchaseRequest pr = PurchaseRequest.builder()
                .requestNumber("PR-" + System.currentTimeMillis())
                .employee(employee)
                .department(dept)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .quantity(dto.getQuantity())
                .estimatedCost(dto.getEstimatedCost())
                .justification(dto.getJustification())
                .priority(priority)
                .currentStatus(RequestStatus.PENDING)
                .approvalStage(ApprovalStage.MANAGER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        pr = purchaseRequestRepository.save(pr);

        notificationService.notify(employee, "PR_CREATED",
                "Request submitted",
                "Your purchase request " + pr.getRequestNumber() + " is pending manager approval.");
        return Mappers.toDto(pr);
    }

    @Transactional
    public PurchaseRequestDto update(Long id, PurchaseRequestCreateDto dto, User employee) {
        PurchaseRequest pr = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseRequest", id));
        if (!pr.getEmployee().getId().equals(employee.getId()) && employee.getRole() != Role.ADMIN)
            throw new BadRequestException("Cannot modify another user's request");
        if (pr.getCurrentStatus() != RequestStatus.PENDING && pr.getCurrentStatus() != RequestStatus.RETURNED)
            throw new BadRequestException("Only PENDING or RETURNED requests can be edited");

        pr.setCategory(dto.getCategory());
        pr.setDescription(dto.getDescription());
        pr.setQuantity(dto.getQuantity());
        pr.setEstimatedCost(dto.getEstimatedCost());
        pr.setJustification(dto.getJustification());
        if (dto.getPriority() != null) {
            try { pr.setPriority(Priority.valueOf(dto.getPriority().toUpperCase())); }
            catch (Exception ignored) {}
        }
        pr.setUpdatedAt(LocalDateTime.now());
        return Mappers.toDto(purchaseRequestRepository.save(pr));
    }

    @Transactional
    public void delete(Long id, User employee) {
        PurchaseRequest pr = purchaseRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseRequest", id));
        if (!pr.getEmployee().getId().equals(employee.getId()) && employee.getRole() != Role.ADMIN)
            throw new BadRequestException("Cannot delete another user's request");
        purchaseRequestRepository.delete(pr);
    }
}
