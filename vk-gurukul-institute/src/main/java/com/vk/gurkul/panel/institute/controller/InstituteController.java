package com.vk.gurkul.panel.institute.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vk.gurkul.panel.institute.dto.InstitutionRequestDTO;
import com.vk.gurkul.panel.institute.dto.InstitutionResponseDTO;
import com.vk.gurkul.panel.institute.service.InstitutionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
public class InstituteController {

	private final InstitutionService institutionService;

	@PostMapping
	public ResponseEntity<InstitutionResponseDTO> create(@Valid @RequestBody InstitutionRequestDTO dto) {
		return ResponseEntity.ok(institutionService.createInstitution(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<InstitutionResponseDTO> update(@PathVariable String id,
			@RequestBody InstitutionRequestDTO dto) {
		return ResponseEntity.ok(institutionService.updateInstitution(id, dto));
	}

	@GetMapping("/{id}")
	public ResponseEntity<InstitutionResponseDTO> get(@PathVariable String id) {
		return ResponseEntity.ok(institutionService.getInstitution(id));
	}

	@GetMapping
	public ResponseEntity<List<InstitutionResponseDTO>> getAll() {
		return ResponseEntity.ok(institutionService.getAllInstitutions());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable String id) {
		institutionService.deleteInstitution(id);
		return ResponseEntity.noContent().build();
	}
}
