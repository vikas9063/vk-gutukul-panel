package com.vk.gurkul.panel.users.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vk.gurkul.panel.users.entity.PermissionEntity;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Integer> {
	Set<PermissionEntity> findByPermissionNameIn(List<String> names);
}