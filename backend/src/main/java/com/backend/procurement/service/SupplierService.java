package com.backend.procurement.service;

import com.backend.procurement.dto.SupplierDto;
import com.backend.procurement.entity.Supplier;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public List<SupplierDto> findAll() {
        return supplierRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    public SupplierDto findById(Long id) {
        return Mappers.toDto(supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", id)));
    }

    @Transactional
    public SupplierDto create(SupplierDto dto) {
        Supplier s = Supplier.builder()
                .name(dto.getName()).contactPerson(dto.getContactPerson())
                .phone(dto.getPhone()).email(dto.getEmail()).address(dto.getAddress())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .rating(dto.getRating()).kycExpiry(dto.getKycExpiry())
                .createdAt(LocalDateTime.now()).build();
        return Mappers.toDto(supplierRepository.save(s));
    }

    @Transactional
    public SupplierDto update(Long id, SupplierDto dto) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", id));
        s.setName(dto.getName());
        s.setContactPerson(dto.getContactPerson());
        s.setPhone(dto.getPhone());
        s.setEmail(dto.getEmail());
        s.setAddress(dto.getAddress());
        if (dto.getStatus() != null) s.setStatus(dto.getStatus());
        s.setRating(dto.getRating());
        s.setKycExpiry(dto.getKycExpiry());
        return Mappers.toDto(supplierRepository.save(s));
    }

    @Transactional
    public void delete(Long id) {
        if (!supplierRepository.existsById(id))
            throw new ResourceNotFoundException("Supplier", id);
        supplierRepository.deleteById(id);
    }
}
