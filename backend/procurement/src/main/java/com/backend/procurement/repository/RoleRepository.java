package com.backend.procurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.procurement.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

}