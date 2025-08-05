package com.vk.gurkul.panel.users.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vk.gurkul.panel.users.entity.RoleEntity;

public interface RoleRepository extends JpaRepository<RoleEntity, Integer>{

}
