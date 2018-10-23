package org.springframework.samples.petclinic.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.samples.petclinic.service.Exceptions.BadRequestException;
import org.springframework.samples.petclinic.service.Exceptions.EntityConflictException;
import org.springframework.samples.petclinic.service.Exceptions.EntityNotFoundException;
import org.springframework.samples.petclinic.service.Exceptions.InternalErrorException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
@RestController
public class RestApiResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(EntityConflictException.class)
    public final ResponseEntity<RestApiErrorResponseDetails> handleAppointmentConflictException(
        EntityConflictException ex, WebRequest request
    )
    {
        RestApiErrorResponseDetails details = new RestApiErrorResponseDetails(
            LocalDateTime.now(),
            "conflict",
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public final ResponseEntity<RestApiErrorResponseDetails> handleEntityNotFoundException(
        EntityNotFoundException ex, WebRequest request
    )
    {
        RestApiErrorResponseDetails details = new RestApiErrorResponseDetails(
            LocalDateTime.now(),
            "not found",
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InternalErrorException.class)
    public final ResponseEntity<RestApiErrorResponseDetails> handleInternalErrorException(
        InternalErrorException ex, WebRequest request
    )
    {
        RestApiErrorResponseDetails details = new RestApiErrorResponseDetails(
            LocalDateTime.now(),
            "internal error",
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BadRequestException.class)
    public final ResponseEntity<RestApiErrorResponseDetails> handleInternalErrorException(
        BadRequestException ex, WebRequest request
    )
    {
        RestApiErrorResponseDetails details = new RestApiErrorResponseDetails(
            LocalDateTime.now(),
            "bad request",
            ex.getMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public final ResponseEntity<RestApiErrorResponseDetails> handleMethodArgumentTypeMismatchException(
        MethodArgumentTypeMismatchException ex, WebRequest request
    )
    {
        RestApiErrorResponseDetails details = new RestApiErrorResponseDetails(
            LocalDateTime.now(),
            "Invalid values in JSON",
            ex.getLocalizedMessage(),
            request.getDescription(false)
        );
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
}
