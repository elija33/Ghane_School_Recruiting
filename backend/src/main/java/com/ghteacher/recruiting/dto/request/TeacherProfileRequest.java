package com.ghteacher.recruiting.dto.request;

import com.ghteacher.recruiting.dto.ReferenceDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherProfileRequest {

    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;

    @Pattern(regexp = "^[+]?[0-9\\s\\-()]{7,20}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Size(max = 255, message = "Subject specialization must not exceed 255 characters")
    private String subjectSpecialization;

    @Min(value = 0, message = "Years of experience cannot be negative")
    private Integer yearsOfExperience;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    private LocalDate dateOfBirth;

    @Size(max = 100, message = "ID number must not exceed 100 characters")
    private String idNumber;

    private List<ReferenceDto> references;
}
