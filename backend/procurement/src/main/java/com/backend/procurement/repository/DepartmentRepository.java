package com.backend.procurement.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.procurement.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}