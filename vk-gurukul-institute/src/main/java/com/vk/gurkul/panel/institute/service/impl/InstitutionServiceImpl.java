package com.vk.gurkul.panel.institute.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.vk.gurkul.panel.institute.dto.InstitutionRequestDTO;
import com.vk.gurkul.panel.institute.dto.InstitutionResponseDTO;
import com.vk.gurkul.panel.institute.exception.CustomAppException;
import com.vk.gurkul.panel.institute.exception.EntityNotFoundException;
import com.vk.gurkul.panel.institute.modal.Institution;
import com.vk.gurkul.panel.institute.repo.InstitutionRepository;
import com.vk.gurkul.panel.institute.service.InstitutionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstitutionServiceImpl implements InstitutionService {

	private final InstitutionRepository institutionRepository;

	@Override
	public InstitutionResponseDTO createInstitution(InstitutionRequestDTO dto) {
		List<Institution> list = institutionRepository.findByCodeOrContactEmailOrContactPhone(dto.getCode(), dto.getContactEmail(),
				dto.getContactPhone());
		if(!list.isEmpty()) {
			throw new CustomAppException("Institute with same code or email or phone no is already present", HttpStatus.BAD_REQUEST);
		}
		Institution institution = new Institution();
		mapDtoToEntity(dto, institution);
		institution = institutionRepository.save(institution);
		return mapToDto(institution);
	}

	@Override
	public InstitutionResponseDTO updateInstitution(String id, InstitutionRequestDTO dto) {
		Institution institution = institutionRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Institution not found"));
		mapDtoToEntity(dto, institution);
		institution = institutionRepository.save(institution);
		return mapToDto(institution);
	}

	@Override
	public InstitutionResponseDTO getInstitution(String id) {
		return institutionRepository.findById(id).map(this::mapToDto)
				.orElseThrow(() -> new EntityNotFoundException("Institution not found"));
	}

	@Override
	public List<InstitutionResponseDTO> getAllInstitutions() {
		return institutionRepository.findByIsActiveTrue().stream().map(this::mapToDto).collect(Collectors.toList());
	}

	@Override
	public void deleteInstitution(String id) {
		Institution institution = institutionRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Institution not found"));
		institution.setActive(false);
		institutionRepository.save(institution);
	}

	private void mapDtoToEntity(InstitutionRequestDTO dto, Institution institution) {
		institution.setName(dto.getName());
		institution.setCode(dto.getCode());
		institution.setLogoUrl(dto.getLogoUrl());
		institution.setThemeColor(dto.getThemeColor());
		institution.setAddress(dto.getAddress());
		institution.setContactEmail(dto.getContactEmail());
		institution.setContactPhone(dto.getContactPhone());
		institution.setType(dto.getType());
		institution.setSmsGatewayConfig(dto.getSmsGatewayConfig());
		institution.setEmailGatewayConfig(dto.getEmailGatewayConfig());

		if (dto.getParentInstitutionId() != null) {
			Institution parent = institutionRepository.findById(dto.getParentInstitutionId())
					.orElseThrow(() -> new EntityNotFoundException("Parent Institution not found"));
			institution.setParentInstitution(parent);
		} else {
			institution.setParentInstitution(null);
		}
	}

	private InstitutionResponseDTO mapToDto(Institution institution) {
		InstitutionResponseDTO dto = new InstitutionResponseDTO();
		dto.setId(institution.getId());
		dto.setName(institution.getName());
		dto.setCode(institution.getCode());
		dto.setLogoUrl(institution.getLogoUrl());
		dto.setThemeColor(institution.getThemeColor());
		dto.setAddress(institution.getAddress());
		dto.setContactEmail(institution.getContactEmail());
		dto.setContactPhone(institution.getContactPhone());
		dto.setType(institution.getType());
		dto.setActive(institution.isActive());
		dto.setCreatedAt(institution.getCreatedAt());
		dto.setUpdatedAt(institution.getUpdatedAt());
		dto.setParentInstitutionId(
				institution.getParentInstitution() != null ? institution.getParentInstitution().getId() : null);
		return dto;
	}
}
