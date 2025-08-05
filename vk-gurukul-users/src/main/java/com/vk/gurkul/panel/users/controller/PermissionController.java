package com.vk.gurkul.panel.users.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vk.gurkul.panel.users.dto.GenericResponseDto;
import com.vk.gurkul.panel.users.dto.PermissionUpdateRequest;
import com.vk.gurkul.panel.users.dto.RoleUpdateReqDto;
import com.vk.gurkul.panel.users.service.PermissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
public class PermissionController {

	private final PermissionService permissionService;

	@GetMapping("/view")
	public ResponseEntity<GenericResponseDto> getAllPermissions() {
		return ResponseEntity.ok(permissionService.getAllPermissions());
	}

	@GetMapping("/view-all-roles")
	public ResponseEntity<GenericResponseDto> getAllRoles() {
		return ResponseEntity.ok(permissionService.getAllRoles());
	}

	@GetMapping("/role/{roleId}")
	public ResponseEntity<GenericResponseDto> getRolePermissions(@PathVariable Integer roleId) {
		return ResponseEntity.ok(permissionService.getPermissionsByRole(roleId));
	}

	@PutMapping("/update-role-permissions/{roleId}")
	public ResponseEntity<GenericResponseDto> updateRolePermissions(@PathVariable Integer roleId,
			@RequestBody PermissionUpdateRequest request) {
		GenericResponseDto updatePermissionsForRole = permissionService.updatePermissionsForRole(roleId, request.getPermissionIds());
		return ResponseEntity.ok(updatePermissionsForRole);
	}

	@GetMapping("/user-permissions/{userId}")
	public ResponseEntity<GenericResponseDto> getUserPermissions(@PathVariable String userId) {
		return ResponseEntity.ok(permissionService.getPermissionsByUser(userId));
	}

	@PutMapping("/user/{userId}")
	public ResponseEntity<GenericResponseDto> updateUserPermissions(@PathVariable String userId,
			@RequestBody PermissionUpdateRequest request) {
		GenericResponseDto updatePermissionsForUser = permissionService.updatePermissionsForUser(userId, request.getPermissionIds());
		return ResponseEntity.ok(updatePermissionsForUser);
	}
	@PutMapping("/user/role/{userId}")
	public ResponseEntity<GenericResponseDto> updateUserRoles(@PathVariable String userId,
			@RequestBody RoleUpdateReqDto request) {
		return ResponseEntity.ok(this.permissionService.updateRolesForUser(userId, request.getRoleIds()));
	}
}
