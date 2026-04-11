package com.ghteacher.recruiting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {

    private long totalTeachers;
    private long verifiedTeachers;
    private long pendingVerificationTeachers;
    private long totalSchools;
    private long activeSubscriptions;
    private long totalJobPostings;
    private long totalApplications;
}
