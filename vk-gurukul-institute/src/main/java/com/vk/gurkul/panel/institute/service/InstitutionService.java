package com.vk.gurkul.panel.institute.service;

import java.util.List;

import com.vk.gurkul.panel.institute.dto.InstitutionRequestDTO;
import com.vk.gurkul.panel.institute.dto.InstitutionResponseDTO;

public interface InstitutionService {
	InstitutionResponseDTO createInstitution(InstitutionRequestDTO dto);

	InstitutionResponseDTO updateInstitution(String id, InstitutionRequestDTO dto);

	InstitutionResponseDTO getInstitution(String id);

	List<InstitutionResponseDTO> getAllInstitutions();

	void deleteInstitution(String id);
}
