package com.vk.gurkul.panel.users.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vk.gurkul.panel.users.entity.RefreshTokenEntity;
import com.vk.gurkul.panel.users.entity.UserEntity;
import com.vk.gurkul.panel.users.exception.CustomAppException;
import com.vk.gurkul.panel.users.repo.RefreshTokenRepo;
import com.vk.gurkul.panel.users.repo.UsersRepo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RefreshTokenService {

	@Autowired
	private RefreshTokenRepo refreshTokenRepo;

	@Autowired
	private UsersRepo usersRepo;

	// three days
	private static final long REFRESH_TOKEN_VALIDATION_TIME = 1000 * 60 * 60 * 24 * 3;

	public RefreshTokenEntity createRefreshToken(String userName) {

		UserEntity user = this.usersRepo.findByUserEmailOrMobileNo(userName, userName)
				.orElseThrow(() -> new UsernameNotFoundException("User Not found"));
		RefreshTokenEntity refreshToken = user.getRefreshToken();
		if (refreshToken == null) {
			log.info("-------- Inside if :: token is null ------------");
			refreshToken = RefreshTokenEntity.builder().refreshToken(UUID.randomUUID().toString())
					.expiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDATION_TIME))
					.user(this.usersRepo.findByUserEmailOrMobileNo(userName, userName).get()).build();
		} else {
			log.info("-------- Inside else :: token is not null ------------");
			refreshToken.setExpiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDATION_TIME));
		}
		user.setRefreshToken(refreshToken);
		try {
			refreshToken = refreshTokenRepo.save(refreshToken);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return refreshToken;
	}

	public RefreshTokenEntity verifyRefreshToken(String refreshToken) {
		RefreshTokenEntity refreshTokenObj = refreshTokenRepo.findByRefreshToken(refreshToken)
				.orElseThrow(() -> new CustomAppException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED));
		if (refreshTokenObj.getExpiry().compareTo(Instant.now()) < 0) {
			System.out.println("----------------");
			refreshTokenRepo.delete(refreshTokenObj);
			throw new CustomAppException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED);
		}
		return refreshTokenObj;
	}

}
