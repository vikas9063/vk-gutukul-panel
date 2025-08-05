package com.vk.gurkul.panel.institute.dto;

import java.time.LocalDateTime;

import com.vk.gurkul.panel.institute.modal.InstitutionType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstitutionResponseDTO {
	private String id;
	private String name;
	private String code;
	private String logoUrl;
	private String themeColor;
	private String address;
	private String contactEmail;
	private String contactPhone;
	private InstitutionType type;
	private String parentInstitutionId;
	private boolean isActive;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
