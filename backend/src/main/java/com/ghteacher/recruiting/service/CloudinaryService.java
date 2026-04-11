package com.ghteacher.recruiting.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ghteacher.recruiting.exception.ExternalServiceException;
import com.ghteacher.recruiting.exception.FileSizeExceededException;
import com.ghteacher.recruiting.exception.InvalidFileTypeException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private static final long MAX_RESUME_SIZE = 5 * 1024 * 1024L;    // 5 MB
    private static final long MAX_PHOTO_SIZE  = 2 * 1024 * 1024L;    // 2 MB
    private static final long MAX_VIDEO_SIZE  = 100 * 1024 * 1024L;  // 100 MB

    private static final List<String> ALLOWED_RESUME_TYPES = List.of("application/pdf");
    private static final List<String> ALLOWED_PHOTO_TYPES  = List.of("image/jpeg", "image/png", "image/jpg");
    private static final List<String> ALLOWED_VIDEO_TYPES  = List.of(
            "video/mp4", "video/quicktime", "video/x-msvideo", "video/webm");

    private final Cloudinary cloudinary;

    public String uploadResume(MultipartFile file) {
        validateFile(file, ALLOWED_RESUME_TYPES, MAX_RESUME_SIZE, "Resume");
        return upload(file, "teacher-recruiting/resumes", "raw", null);
    }

    public String uploadPhoto(MultipartFile file) {
        validateFile(file, ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE, "Photo");
        return upload(file, "teacher-recruiting/photos", "image", null);
    }

    public String uploadVideo(MultipartFile file) {
        validateFile(file, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE, "Video");
        // Apply transformation: max 2 minutes duration, 720p quality
        Map<String, Object> transformation = ObjectUtils.asMap(
                "quality", "auto:good",
                "width", 1280,
                "height", 720,
                "crop", "limit",
                "duration", "120"
        );
        return upload(file, "teacher-recruiting/videos", "video", transformation);
    }

    private String upload(MultipartFile file, String folder, String resourceType,
                          Map<String, Object> transformation) {
        try {
            Map<String, Object> params = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", resourceType,
                    "use_filename", true,
                    "unique_filename", true
            );

            if (transformation != null) {
                params.put("eager", List.of(transformation));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), params);
            String secureUrl = (String) result.get("secure_url");

            if (secureUrl == null) {
                throw new ExternalServiceException("Cloudinary", "Upload returned no URL");
            }

            log.info("File uploaded to Cloudinary: {}", secureUrl);
            return secureUrl;

        } catch (IOException e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new ExternalServiceException("Cloudinary", "Upload failed: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file, List<String> allowedTypes,
                               long maxSize, String fileLabel) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileTypeException(fileLabel + " file is empty or missing");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw new InvalidFileTypeException(
                    fileLabel + " must be one of: " + String.join(", ", allowedTypes));
        }

        if (file.getSize() > maxSize) {
            throw new FileSizeExceededException(
                    fileLabel + " size exceeds the maximum allowed size of " + (maxSize / (1024 * 1024)) + "MB");
        }
    }
}
