package com.vk.gurkul.panel.users.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenReqDto {

	@NotBlank(message = "refresh token is inavild")
	private String refreshToken;
}
