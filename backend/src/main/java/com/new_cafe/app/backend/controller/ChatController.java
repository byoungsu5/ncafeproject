package com.new_cafe.app.backend.controller;

import com.new_cafe.app.backend.dto.ChatMessageRequest;
import com.new_cafe.app.backend.dto.ChatMessageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    // Using CopyOnWriteArrayList for thread-safe in-memory storage
    private static final List<ChatMessageResponse> messages = new CopyOnWriteArrayList<>();

    static {
        // Adding some dummy data
        messages.add(ChatMessageResponse.builder()
                .id(UUID.randomUUID().toString())
                .sender("시스템")
                .content("NCafe 채팅방에 오신 것을 환영합니다!")
                .timestamp(LocalDateTime.now().minusMinutes(10))
                .build());
        messages.add(ChatMessageResponse.builder()
                .id(UUID.randomUUID().toString())
                .sender("메타몽")
                .content("무엇을 도와드릴까요?")
                .timestamp(LocalDateTime.now().minusMinutes(5))
                .build());
    }

    @GetMapping
    public ResponseEntity<List<ChatMessageResponse>> getMessages() {
        return ResponseEntity.ok(new ArrayList<>(messages));
    }

    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
        ChatMessageResponse newMessage = ChatMessageResponse.builder()
                .id(UUID.randomUUID().toString())
                .sender(request.getSender() != null ? request.getSender() : "익명")
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .build();
        
        // Keep only last 50 messages to prevent memory issues
        if (messages.size() >= 50) {
            messages.remove(0);
        }
        messages.add(newMessage);
        
        return ResponseEntity.ok(newMessage);
    }
}
