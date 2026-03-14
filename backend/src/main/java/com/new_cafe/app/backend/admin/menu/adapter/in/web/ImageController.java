package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/images")
public class ImageController {

    private final String uploadDir = "upload/";

    public ImageController() throws IOException {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("[ImageController] Received upload request for file: " + file.getOriginalFilename() + " (Size: " + file.getSize() + ")");
            if (file.isEmpty()) {
                System.err.println("[ImageController] Upload failed: File is empty");
                return ResponseEntity.badRequest().build();
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetPath = Paths.get(uploadDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);
            System.out.println("[ImageController] File saved to: " + targetPath.toAbsolutePath());

            return ResponseEntity.ok(new UploadResponse(fileName));
        } catch (Exception e) {
            System.err.println("[ImageController] Upload failed with exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public record UploadResponse(String url) {}
}
