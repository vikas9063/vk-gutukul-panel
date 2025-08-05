package com.vk.gurkul.panel.users.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateReqDto {

	private List<Integer> roleIds;
	
}
