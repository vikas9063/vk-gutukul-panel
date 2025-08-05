package com.vk.gurkul.panel.institute.dto;

import com.vk.gurkul.panel.institute.modal.InstitutionType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionRequestDTO {
	@NotBlank(message = "Name is required")
	private String name;

	@NotBlank(message = "Institution code is required")
	private String code;

	@Email(message = "Invalid email address")
	private String contactEmail;

	private String logoUrl;
	private String themeColor;
	private String address;

	@Pattern(regexp = "\\d{10}", message = "Contact phone must be 10 digits")
	private String contactPhone;

	@NotNull(message = "Institution type is required")
	private InstitutionType type;

	private String parentInstitutionId;
	private String smsGatewayConfig;
	private String emailGatewayConfig;
}
