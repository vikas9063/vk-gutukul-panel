package com.vk.gurkul.panel.institute.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Entity not found
    @ExceptionHandler(EntityNotFoundException.class)
    public ProblemDetail handleEntityNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        pd.setTitle("Entity Not Found");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    // 2. Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Validation Failed");
        pd.setDetail("Invalid request parameters");

        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

        pd.setProperty("errors", fieldErrors);
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    // 3. Type mismatch in query/path variables
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Type Mismatch");
        pd.setDetail("Invalid parameter: " + ex.getName() + " should be of type " + ex.getRequiredType().getSimpleName());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    // 4. Missing required parameters
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ProblemDetail handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pd.setTitle("Missing Parameter");
        pd.setDetail("Missing required parameter: " + ex.getParameterName());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    // 5. Custom application exceptions (optional)
    @ExceptionHandler(CustomAppException.class)
    public ProblemDetail handleCustomAppException(CustomAppException ex, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatus(ex.getStatus());
        pd.setTitle("Application Error");
        pd.setDetail(ex.getMessage());
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("path", request.getRequestURI());
        return pd;
    }

    // 6. Generic fallback exception
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
