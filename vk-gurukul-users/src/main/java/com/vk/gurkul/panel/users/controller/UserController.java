package com.vk.gurkul.panel.users.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vk.gurkul.panel.users.dto.GenericPaginationResponseDto;
import com.vk.gurkul.panel.users.dto.GenericResponseDto;
import com.vk.gurkul.panel.users.entity.UserEntity;
import com.vk.gurkul.panel.users.service.UserService;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	@Autowired
	private UserService userService;

//	@GetMapping("/search/{keyword}")
//	public ResponseEntity<GenericResponseDto> searchUser(@PathVariable String keyword) {
//		return ResponseEntity.ok(userService.searchUser(keyword));
//	}

	@GetMapping("/id/{userId}")
	public ResponseEntity<GenericResponseDto> getUserById(@PathVariable String userId) {
		return ResponseEntity.ok(userService.getUserById(userId));
	}

	@GetMapping("/all-users")
	public ResponseEntity<GenericPaginationResponseDto<List<UserEntity>>> getAllUsers(
			@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
			@RequestParam(defaultValue = "userId") String sortBy, @RequestParam(defaultValue = "asc") String sortDir,
			@RequestParam(defaultValue = "ALL") String type, @RequestParam(defaultValue = "") String keyword) {
		if (keyword != null && !keyword.trim().equals("")) {
			return ResponseEntity.ok(userService.searchUser(keyword, page, size, sortBy, sortDir));
		} else {
			return ResponseEntity.ok(this.userService.getAllUsers(page, size, sortBy, sortDir, type));
		}
	}

	@PutMapping("/disable/{userId}")
	public ResponseEntity<GenericResponseDto> disableUser(@PathVariable String userId) {
		GenericResponseDto updatedUser = this.userService.disableUser(userId);
		return ResponseEntity.ok(updatedUser);
	}

	@PutMapping("/enable/{userId}")
	public ResponseEntity<GenericResponseDto> enableUser(@PathVariable String userId) {
		GenericResponseDto updatedUser = this.userService.enableUser(userId);
		return ResponseEntity.ok(updatedUser);
	}

}
