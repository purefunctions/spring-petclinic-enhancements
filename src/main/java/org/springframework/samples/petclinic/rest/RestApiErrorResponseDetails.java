package org.springframework.samples.petclinic.rest;

import java.time.LocalDateTime;

public class RestApiErrorResponseDetails {
    private LocalDateTime dateTime;
    private String error;
    private String message;
    private String details;

    public RestApiErrorResponseDetails(LocalDateTime dateTime, String error, String message, String details) {
        this.dateTime = dateTime;
        this.error = error;
        this.message = message;
        this.details = details;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
