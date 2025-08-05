package com.vk.gurkul.panel.users.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.vk.gurkul.panel.users.config.JWTConfig;
import com.vk.gurkul.panel.users.dto.GenericPaginationResponseDto;
import com.vk.gurkul.panel.users.dto.GenericResponseDto;
import com.vk.gurkul.panel.users.dto.LoginReqDto;
import com.vk.gurkul.panel.users.dto.LoginResponseDto;
import com.vk.gurkul.panel.users.dto.PaginationMetaDto;
import com.vk.gurkul.panel.users.dto.RefreshTokenReqDto;
import com.vk.gurkul.panel.users.entity.RefreshTokenEntity;
import com.vk.gurkul.panel.users.entity.UserEntity;
import com.vk.gurkul.panel.users.exception.CustomAppException;
import com.vk.gurkul.panel.users.repo.UsersRepo;

@Service
public class UserService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JWTConfig jwtConfig;

	@Autowired
	private RefreshTokenService refreshTokenService;

	@Autowired
	private UserInfoUserDetailsService userDetailsService; // Your implementation of UserDetailsService

	@Autowired
	private UsersRepo usersRepo;

	public LoginResponseDto doLogin(LoginReqDto loginReqDto) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginReqDto.getUsername(), loginReqDto.getPassword()));
		if (authentication.isAuthenticated()) {
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			String token = jwtConfig.generateToken(userDetails); // ✅ now passes authorities
			RefreshTokenEntity refreshToken = this.refreshTokenService.createRefreshToken(loginReqDto.getUsername());

			return LoginResponseDto.builder().accessToken(token).refreshToken(refreshToken.getRefreshToken())
					.refreshTokenExpiresOn(refreshToken.getExpiry()).username(loginReqDto.getUsername())
					.status("success").message("token generated successfully...").build();

		} else {
			throw new CustomAppException("invalid user request !", HttpStatus.NOT_FOUND);
		}
	}

	public LoginResponseDto tokenWithRefreshToken(RefreshTokenReqDto refreshTokenReqDto) {
		RefreshTokenEntity verifyRefreshToken = this.refreshTokenService
				.verifyRefreshToken(refreshTokenReqDto.getRefreshToken());

		// ✅ Load UserDetails (to get roles/authorities)
		UserDetails userDetails = userDetailsService.loadUserByUsername(verifyRefreshToken.getUser().getUserEmail());

		// ✅ Generate new access token with authorities
		String newAccessToken = this.jwtConfig.generateToken(userDetails);

		return LoginResponseDto.builder().accessToken(newAccessToken).message("Token Generated Successfully ...")
				.refreshToken(verifyRefreshToken.getRefreshToken())
				.refreshTokenExpiresOn(verifyRefreshToken.getExpiry()).status("success")
				.username(verifyRefreshToken.getUser().getUsername()).build();
	}

	public GenericPaginationResponseDto<List<UserEntity>> searchUser(String keyword, int page, int size, String sortBy, String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		Page<UserEntity> userPage = usersRepo
				.findByUserIdContainingIgnoreCaseOrUserEmailContainingIgnoreCaseOrMobileNoContainingIgnoreCase(keyword,
						keyword, keyword, pageable);
		// Build pagination metadata
		PaginationMetaDto paginationMeta = new PaginationMetaDto(userPage.getNumber(), userPage.getSize(),
				userPage.getTotalElements(), userPage.getTotalPages());
		return new GenericPaginationResponseDto<>(userPage.getContent(), "Users fetched successfully", "SUCCESS",
				paginationMeta);
	}

	public GenericResponseDto getUserById(String userId) {
		UserEntity userEntity = usersRepo.findById(userId)
				.orElseThrow(() -> new CustomAppException("User not found with Id :" + userId, HttpStatus.BAD_REQUEST));
		return GenericResponseDto.builder().message("users found").status("Success").result(userEntity).build();
	}

	public GenericPaginationResponseDto<List<UserEntity>> getAllUsers(int page, int size, String sortBy, String sortDir,
			String type) {
		// Determine sorting direction
		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(page, size, sort);

		// Default to all users
		Page<UserEntity> userPage;

		switch (type.toUpperCase()) {
		case "DELETED":
			userPage = usersRepo.findByIsDeleted(true, pageable);
			break;
		case "NOT_DELETED":
			userPage = usersRepo.findByIsDeleted(false, pageable);
			break;
		case "ACTIVE":
			userPage = usersRepo.findByIsEnabled(true, pageable);
			break;
		case "DISABLED":
			userPage = usersRepo.findByIsEnabled(false, pageable);
			break;
		case "ALL":
		default:
			userPage = usersRepo.findAll(pageable);
			break;
		}

		// Build pagination metadata
		PaginationMetaDto paginationMeta = new PaginationMetaDto(userPage.getNumber(), userPage.getSize(),
				userPage.getTotalElements(), userPage.getTotalPages());

		// Return response
		return new GenericPaginationResponseDto<>(userPage.getContent(), "Users fetched successfully", "SUCCESS",
				paginationMeta);
	}

	public GenericResponseDto disableUser(String userId) {
		try {
			UserEntity userEntity = usersRepo.findById(userId).orElseThrow(
					() -> new CustomAppException("User not found with Id :" + userId, HttpStatus.BAD_REQUEST));
			userEntity.setEnabled(false);
			userEntity = usersRepo.save(userEntity);
			return GenericResponseDto.builder().status("Success").message("User Updated Successfully").result(userEntity).build();
		} catch (Exception e) {
			throw new CustomAppException("Error in disabling user", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	public GenericResponseDto enableUser(String userId) {
		try {
			UserEntity userEntity = usersRepo.findById(userId).orElseThrow(
					() -> new CustomAppException("User not found with Id :" + userId, HttpStatus.BAD_REQUEST));
			userEntity.setEnabled(true);
			userEntity = usersRepo.save(userEntity);
			return GenericResponseDto.builder().status("Success").message("User Updated Successfully").result(userEntity).build();
		} catch (Exception e) {
			throw new CustomAppException("Error in disabling user", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

}
