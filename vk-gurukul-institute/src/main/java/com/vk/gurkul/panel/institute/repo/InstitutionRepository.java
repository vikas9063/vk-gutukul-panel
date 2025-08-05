package com.vk.gurkul.panel.institute.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vk.gurkul.panel.institute.modal.Institution;

public interface InstitutionRepository extends JpaRepository<Institution, String> {
	List<Institution> findByIsActiveTrue();

	List<Institution> findByCodeOrContactEmailOrContactPhone(String code, String email, String phone);
}
