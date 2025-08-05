package com.vk.gurkul.panel.users.dto;

import java.util.List;

import lombok.Data;

@Data
public class PermissionUpdateRequest {
    private List<Integer> permissionIds;
}
