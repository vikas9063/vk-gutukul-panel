package com.vk.gurkul.panel.users.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vk.gurkul.panel.users.dto.LoginReqDto;
import com.vk.gurkul.panel.users.dto.LoginResponseDto;
import com.vk.gurkul.panel.users.dto.RefreshTokenReqDto;
import com.vk.gurkul.panel.users.service.UserService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> authenticateAndGetToken(@Valid @RequestBody LoginReqDto authRequest) {
		return ResponseEntity.ok().body(this.userService.doLogin(authRequest));
	}
	
	@PostMapping("/token")
	public ResponseEntity<LoginResponseDto> tokenWithRefreshToken(@Valid @RequestBody RefreshTokenReqDto authRequest) {
		return ResponseEntity.ok().body(this.userService.tokenWithRefreshToken(authRequest));
	}
}
