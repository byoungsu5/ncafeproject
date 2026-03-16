package com.new_cafe.app.backend.payment.adapter.out.payment;

import com.new_cafe.app.backend.payment.application.port.out.PaymentGateway;
import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class KakaoPayAdapter implements PaymentGateway {

    private final org.springframework.web.reactive.function.client.WebClient webClient;
    private final java.util.Map<Long, String> tidMap = new ConcurrentHashMap<>();
    
    @Value("${payment.kakao.secret-key}")
    private String secretKey;

    @Value("${payment.kakao.cid}")
    private String cid;

    @Value("${payment.success-url}")
    private String successUrl;

    public KakaoPayAdapter(org.springframework.web.reactive.function.client.WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://open-api.kakaopay.com/online/v1").build();
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
            // Fallback for demo if tid is missing (though it shouldn't be)
            tid = "MOCK_TID_" + orderId;
        }

        try {
            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("cid", cid);
            body.put("tid", tid);
            body.put("partner_order_id", String.valueOf(orderId));
            body.put("partner_user_id", "user_" + orderId);
            body.put("pg_token", pgToken);

            java.util.Map result = webClient.post()
                    .uri("/payment/approve")
                    .header("Authorization", "SECRET_KEY " + secretKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(java.util.Map.class)
                    .block();

            tidMap.remove(orderId); // Clean up
            
            if (result != null && result.containsKey("aid")) {
                System.out.println("[KakaoPay] Approve success for order: " + orderId);
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

        // Return error status if failed
        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentMethod("KAKAO")
                .status(PaymentStatus.CANCELLED)
                .build();
    }

    @Override
    public String initiatePayment(Long orderId, Integer amount) {
        // Kakao Pay Ready API Call
        try {
            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("cid", cid);
            body.put("partner_order_id", String.valueOf(orderId));
            body.put("partner_user_id", "user_" + orderId);
            body.put("item_name", "Cafe Order #" + orderId);
            body.put("quantity", 1);
            body.put("total_amount", amount);
            body.put("tax_free_amount", 0);
            body.put("approval_url", successUrl + "?orderId=" + orderId);
            body.put("cancel_url", successUrl.replace("success", "cancel") + "?orderId=" + orderId);
            body.put("fail_url", successUrl.replace("success", "fail") + "?orderId=" + orderId);

            java.util.Map result = webClient.post()
                    .uri("/payment/ready")
                    .header("Authorization", "SECRET_KEY " + secretKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(java.util.Map.class)
                    .block();

            if (result != null && result.containsKey("next_redirect_pc_url")) {
                String tid = (String) result.get("tid");
                tidMap.put(orderId, tid);
                System.out.println("[KakaoPay] Ready success, tid: " + tid);
                return (String) result.get("next_redirect_pc_url");
            }
        } catch (Exception e) {
            System.err.println("[KakaoPay] Ready failed: " + e.getMessage());
        }

        // Fallback or Error
        return successUrl + "?orderId=" + orderId;
    }
}
