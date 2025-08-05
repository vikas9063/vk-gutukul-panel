package com.vk.gurkul.panel.users.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vk.gurkul.panel.users.entity.RefreshTokenEntity;

public interface RefreshTokenRepo extends JpaRepository<RefreshTokenEntity, Long> {

	public Optional<RefreshTokenEntity> findByRefreshToken(String refreshToken);

}