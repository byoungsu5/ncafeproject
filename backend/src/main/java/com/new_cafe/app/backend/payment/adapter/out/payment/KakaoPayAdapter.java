package com.new_cafe.app.backend.payment.adapter.out.payment;

import com.new_cafe.app.backend.payment.application.port.out.PaymentGateway;
import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class KakaoPayAdapter implements PaymentGateway {

    private final org.springframework.web.reactive.function.client.WebClient webClient;
    private final Map<Long, String> tidMap = new ConcurrentHashMap<>();
    
    @Value("${payment.kakao.secret-key}")
    private String secretKey; // 여기에 REST API 키를 넣으시면 됩니다.

    @Value("${payment.kakao.cid}")
    private String cid;

    @Value("${payment.success-url}")
    private String successUrl;

    public KakaoPayAdapter(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://kapi.kakao.com").build();
    }

    @Override
    public boolean supports(String paymentMethod) {
        return "KAKAO".equalsIgnoreCase(paymentMethod);
    }

    @Override
    public Payment confirmPayment(Long orderId, Integer amount, String paymentMethod, String pgToken) {
        String tid = tidMap.get(orderId);
        if (tid == null) {
            System.err.println("[KakaoPay] No TID found for order: " + orderId);
            return Payment.builder()
                    .orderId(orderId)
                    .amount(amount)
                    .paymentMethod("KAKAO")
                    .status(PaymentStatus.CANCELLED)
                    .build();
        }

        try {
            org.springframework.util.MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
            formData.add("cid", cid);
            formData.add("tid", tid);
            formData.add("partner_order_id", String.valueOf(orderId));
            formData.add("partner_user_id", "user_" + orderId);
            formData.add("pg_token", pgToken);

            Map<String, Object> result = webClient.post()
                    .uri("/v1/payment/approve")
                    .header("Authorization", "KakaoAK " + secretKey)
                    .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                    .body(org.springframework.web.functions.client.BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(java.util.Map.class)
                    .block();

            tidMap.remove(orderId);
            
            if (result != null && result.containsKey("aid")) {
                return Payment.builder()
                        .orderId(orderId)
                        .amount(amount)
                        .paymentMethod("KAKAO")
                        .status(PaymentStatus.PAID)
                        .transactionId(tid)
                        .build();
            }
        } catch (Exception e) {
            System.err.println("[KakaoPay] Approve failed: " + e.getMessage());
        }

        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentMethod("KAKAO")
                .status(PaymentStatus.CANCELLED)
                .build();
    }

    @Override
    public String initiatePayment(Long orderId, Integer amount) {
        try {
            org.springframework.util.MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
            formData.add("cid", cid);
            formData.add("partner_order_id", String.valueOf(orderId));
            formData.add("partner_user_id", "user_" + orderId);
            formData.add("item_name", "Cafe Order #" + orderId);
            formData.add("quantity", "1");
            formData.add("total_amount", String.valueOf(amount));
            formData.add("tax_free_amount", "0");
            formData.add("approval_url", successUrl + "?orderId=" + orderId + "&amount=" + amount);
            formData.add("cancel_url", successUrl.replace("success", "cancel") + "?orderId=" + orderId + "&amount=" + amount);
            formData.add("fail_url", successUrl.replace("success", "fail") + "?orderId=" + orderId + "&amount=" + amount);

            System.out.println("[KakaoPay] Ready Request (Legacy): " + formData);

            Map<String, Object> result = webClient.post()
                    .uri("/v1/payment/ready")
                    .header("Authorization", "KakaoAK " + secretKey)
                    .header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
                    .body(org.springframework.web.reactive.function.client.BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            System.out.println("[KakaoPay] Ready Response: " + result);

            if (result != null && result.containsKey("next_redirect_pc_url")) {
                String tid = (String) result.get("tid");
                tidMap.put(orderId, tid);
                return (String) result.get("next_redirect_pc_url");
            }
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            System.err.println("[KakaoPay] Ready failed (Legacy): " + e.getResponseBodyAsString());
            throw new RuntimeException("카카오페이 API 오류: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("[KakaoPay] Ready failed: " + e.getMessage());
            throw e;
        }

        return null;
    }
}
