package com.vk.gurkul.panel.users.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UsersUtils {

	public static String objectToString(Object object) {
		try {
			return new ObjectMapper().writeValueAsString(object);
		} catch (JsonProcessingException e) {
			return "";
		}
	}

}
