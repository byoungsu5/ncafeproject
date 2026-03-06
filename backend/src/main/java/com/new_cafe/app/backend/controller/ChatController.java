package com.new_cafe.app.backend.controller;

import com.new_cafe.app.backend.dto.ChatMessageRequest;
import com.new_cafe.app.backend.dto.ChatMessageResponse;
import com.new_cafe.app.backend.service.GeminiService;
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

    private final GeminiService geminiService;
    private static final List<ChatMessageResponse> messages = new CopyOnWriteArrayList<>();

    static {
        messages.add(ChatMessageResponse.builder()
                .id(UUID.randomUUID().toString())
                .sender("시스템")
                .content("Gemini 기능이 추가되었습니다! 메시지를 보내면 Gemini가 답변합니다.")
                .timestamp(LocalDateTime.now())
                .build());
    }

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping
    public ResponseEntity<List<ChatMessageResponse>> getMessages() {
        return ResponseEntity.ok(new ArrayList<>(messages));
    }

    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
        ChatMessageResponse newMessage = ChatMessageResponse.builder()
                .id(UUID.randomUUID().toString())
                .sender(request.getSender() != null && !request.getSender().trim().isEmpty() ? request.getSender() : "익명")
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .build();
        
        addMessage(newMessage);

        // Asynchronously call Gemini if the sender is not Gemini itself
        if (!"Gemini".equalsIgnoreCase(newMessage.getSender())) {
            geminiService.getChatResponse(request.getContent())
                .subscribe(aiResponse -> {
                    ChatMessageResponse geminiMsg = ChatMessageResponse.builder()
                            .id(UUID.randomUUID().toString())
                            .sender("Gemini")
                            .content(aiResponse)
                            .timestamp(LocalDateTime.now())
                            .build();
                    addMessage(geminiMsg);
                });
        }
        
        return ResponseEntity.ok(newMessage);
    }

    private void addMessage(ChatMessageResponse msg) {
        if (messages.size() >= 50) {
            messages.remove(0);
        }
        messages.add(msg);
    }
}
