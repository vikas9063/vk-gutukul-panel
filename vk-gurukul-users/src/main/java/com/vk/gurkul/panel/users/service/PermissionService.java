package com.vk.gurkul.panel.users.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.vk.gurkul.panel.users.dto.GenericResponseDto;
import com.vk.gurkul.panel.users.entity.PermissionEntity;
import com.vk.gurkul.panel.users.entity.RoleEntity;
import com.vk.gurkul.panel.users.entity.UserEntity;
import com.vk.gurkul.panel.users.entity.UserRoleMapEntity;
import com.vk.gurkul.panel.users.exception.CustomAppException;
import com.vk.gurkul.panel.users.repo.PermissionRepository;
import com.vk.gurkul.panel.users.repo.RoleRepository;
import com.vk.gurkul.panel.users.repo.UsersRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

	private final PermissionRepository permissionRepo;
	private final RoleRepository roleRepo;
	private final UsersRepo userRepo;

	public GenericResponseDto getAllPermissions() {
		List<PermissionEntity> list = permissionRepo.findAll();
		return GenericResponseDto.builder().message("All Permissions").status("Success").result(list).build();
	}

	public GenericResponseDto getAllRoles() {
		List<RoleEntity> list = roleRepo.findAll();
		return GenericResponseDto.builder().message("All Roles").status("Success").result(list).build();
	}

	public GenericResponseDto getPermissionsByRole(Integer roleId) {
		RoleEntity role = roleRepo.findById(roleId)
				.orElseThrow(() -> new CustomAppException("Role not found", HttpStatus.NOT_FOUND));
		return GenericResponseDto.builder().message("Role found successfully").status("Success").result(role).build();
	}

	public GenericResponseDto updatePermissionsForRole(Integer roleId, List<Integer> permissionIds) {
		RoleEntity role = roleRepo.findById(roleId)
				.orElseThrow(() -> new CustomAppException("Role not found", HttpStatus.NOT_FOUND));

		Set<PermissionEntity> permissions = StreamSupport
				.stream(permissionRepo.findAllById(permissionIds).spliterator(), false).collect(Collectors.toSet());
		role.setPermissions(permissions);
		RoleEntity roleEntity = roleRepo.save(role);
		return GenericResponseDto.builder().message("Role Updated successfully").status("Success").result(roleEntity)
				.build();
	}

	public GenericResponseDto getPermissionsByUser(String userId) {
		UserEntity user = userRepo.findById(userId)
				.orElseThrow(() -> new CustomAppException("User not found", HttpStatus.NOT_FOUND));
		Set<PermissionEntity> userPermissions = user.getUserPermissions();
		user.getUserRoles().forEach(roles -> {
			RoleEntity roleEntity = roles.getRoles();
			userPermissions.addAll(roleEntity.getPermissions());
		});
		return GenericResponseDto.builder().message("User permission").status("Success").result(userPermissions)
				.build();
	}

	public GenericResponseDto updatePermissionsForUser(String userId, List<Integer> permissionIds) {
		UserEntity user = userRepo.findById(userId)
				.orElseThrow(() -> new CustomAppException("User not found", HttpStatus.NOT_FOUND));

		Set<PermissionEntity> permissions = StreamSupport
				.stream(permissionRepo.findAllById(permissionIds).spliterator(), false).collect(Collectors.toSet());
		user.setUserPermissions(permissions);
		UserEntity save = userRepo.save(user);
		return GenericResponseDto.builder().message("User permission updated").status("Success").result(save).build();
	}

	public GenericResponseDto updateRolesForUser(String userId, List<Integer> newRoleIds) {
		UserEntity user = userRepo.findById(userId)
		        .orElseThrow(() -> new CustomAppException("User not found", HttpStatus.NOT_FOUND));

		    Set<UserRoleMapEntity> existingUserRoles = user.getUserRoles();

		    // Extract existing role IDs from user
		    Set<Integer> existingRoleIds = existingUserRoles.stream()
		        .map(roleMap -> roleMap.getRoles().getRoleId())
		        .collect(Collectors.toSet());

		    // Convert new role list to Set for easier comparison
		    Set<Integer> newRoleIdSet = new HashSet<>(newRoleIds);

		    // Find roles present in both
		    Set<Integer> presentInBoth = new HashSet<>(existingRoleIds);
		    presentInBoth.retainAll(newRoleIdSet);

		    // Find roles to add
		    Set<Integer> toAdd = new HashSet<>(newRoleIdSet);
		    toAdd.removeAll(existingRoleIds);

		    // Find roles to remove
		    Set<Integer> toRemove = new HashSet<>(existingRoleIds);
		    toRemove.removeAll(newRoleIdSet);

		    log.info("Roles already assigned (present in both): {}", presentInBoth);
		    log.info("Roles to add: {}", toAdd);
		    log.info("Roles to remove: {}", toRemove);

		    // Optionally act on those changes (remove and add)
		    // Remove unwanted role mappings
		    user.getUserRoles().removeIf(roleMap ->
		        toRemove.contains(roleMap.getRoles().getRoleId())
		    );

		    // Add new roles
		    List<RoleEntity> rolesToAdd = roleRepo.findAllById(toAdd);
		    for (RoleEntity role : rolesToAdd) {
		        UserRoleMapEntity newRoleMap = new UserRoleMapEntity();
		        newRoleMap.setUsers(user);
		        newRoleMap.setRoles(role);
		        user.getUserRoles().add(newRoleMap);
		    }

		    // Save updated user
		    user = userRepo.save(user);

		return GenericResponseDto.builder().message("User roles updated successfully").status("Success")
				.result(user).build();
	}

}