package com.vk.gurkul.panel.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Contains pagination metadata.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaginationMetaDto {
    private int currentPage;
    private int pageSize;
    private long totalItems;
    private int totalPages;
}
