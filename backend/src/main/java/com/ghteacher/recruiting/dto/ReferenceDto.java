package com.ghteacher.recruiting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceDto {
    private String name;
    private String position;
    private String phone;
    private String email;
}
