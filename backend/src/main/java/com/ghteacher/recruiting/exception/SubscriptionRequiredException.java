package com.ghteacher.recruiting.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class SubscriptionRequiredException extends RuntimeException {

    public SubscriptionRequiredException() {
        super("An active subscription is required to access this resource");
    }

    public SubscriptionRequiredException(String message) {
        super(message);
    }
}
