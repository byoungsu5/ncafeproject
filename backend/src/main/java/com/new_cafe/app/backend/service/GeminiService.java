package com.new_cafe.app.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final WebClient webClient;
    private static final String GEMINI_MODEL = "gemini-1.5-flash"; // Using 1.5 Flash as 2.5 is not a thing yet

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models/").build();
    }

    public Mono<String> getChatResponse(String userMessage) {
        if (apiKey == null || apiKey.isEmpty()) {
            return Mono.just("Gemini API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.");
        }

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", userMessage)
                ))
            )
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path(GEMINI_MODEL + ":generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        return (String) parts.get(0).get("text");
                    } catch (Exception e) {
                        return "Gemini 응답을 파싱하는 중 오류가 발생했습니다: " + e.getMessage();
                    }
                })
                .onErrorResume(e -> Mono.just("Gemini 호출 중 오류가 발생했습니다: " + e.getMessage()));
    }
}
