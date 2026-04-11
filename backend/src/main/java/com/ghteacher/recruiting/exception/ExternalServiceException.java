package com.ghteacher.recruiting.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class ExternalServiceException extends RuntimeException {

    public ExternalServiceException(String service, String message) {
        super(String.format("External service '%s' error: %s", service, message));
    }
}
