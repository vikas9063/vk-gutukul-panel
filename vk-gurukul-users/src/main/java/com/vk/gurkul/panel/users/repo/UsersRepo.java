package com.vk.gurkul.panel.users.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vk.gurkul.panel.users.entity.UserEntity;

public interface UsersRepo extends JpaRepository<UserEntity, String> {

	// Search by email OR mobile number
	Optional<UserEntity> findByUserEmailOrMobileNo(String email, String mobileNo);

	// Search by ID OR email OR mobile
	Page<UserEntity> findByUserIdContainingIgnoreCaseOrUserEmailContainingIgnoreCaseOrMobileNoContainingIgnoreCase(
			String userId, String userEmail, String mobileNo, Pageable pageable);
	
	Page<UserEntity> findByIsDeleted(boolean isDeleted, Pageable pageable);
	Page<UserEntity> findByIsEnabled(boolean isActive, Pageable pageable);

}
