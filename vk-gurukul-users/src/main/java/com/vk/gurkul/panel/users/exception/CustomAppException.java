package com.vk.gurkul.panel.users.exception;

import org.springframework.http.HttpStatus;

public class CustomAppException extends RuntimeException {
	private static final long serialVersionUID = 7533375703194349671L;
	private final HttpStatus status;

	public CustomAppException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}
}