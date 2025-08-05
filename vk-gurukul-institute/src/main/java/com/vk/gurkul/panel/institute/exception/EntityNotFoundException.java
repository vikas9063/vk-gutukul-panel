package com.vk.gurkul.panel.institute.exception;

public class EntityNotFoundException extends RuntimeException {

	private static final long serialVersionUID = -6963308707636775113L;

	// Default constructor
    public EntityNotFoundException() {
        super("Entity not found");
    }

    // Constructor with custom message
    public EntityNotFoundException(String message) {
        super(message);
    }

    // Constructor with custom message and cause
    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // Constructor with cause only
    public EntityNotFoundException(Throwable cause) {
        super(cause);
    }
}

