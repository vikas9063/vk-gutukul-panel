package com.vk.gurkul.panel.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public final class GenericPaginationResponseDto<T> {
	private T result;
	private String message;
	private String status;
	private PaginationMetaDto pagination;
}
