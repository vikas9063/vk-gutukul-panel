package com.vk.gurkul.panel.users.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomAppException.class)
    public ProblemDetail handleCustomAppException(CustomAppException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(ex.getStatus());
        pd.setTitle("Application Error");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        pd.setTitle("Unexpected Error");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }
	
}
