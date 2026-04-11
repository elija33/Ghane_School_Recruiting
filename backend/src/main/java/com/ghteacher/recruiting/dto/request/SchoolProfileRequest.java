package com.ghteacher.recruiting.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SchoolProfileRequest {

    @Size(max = 255, message = "School name must not exceed 255 characters")
    private String schoolName;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 255, message = "Contact person name must not exceed 255 characters")
    private String contactPerson;

    @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,20}$", message = "Invalid phone number format")
    private String phoneNumber;
}
