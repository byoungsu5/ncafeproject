package com.new_cafe.app.backend.payment.adapter.out.payment;

import com.new_cafe.app.backend.payment.application.port.out.PaymentGateway;
import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class KakaoPayAdapter implements PaymentGateway {

    @Value("${payment.kakao.secret-key}")
    private String secretKey;

    @Value("${payment.kakao.cid}")
    private String cid;

    @Value("${payment.success-url}")
    private String successUrl;

    @Override
    public boolean supports(String paymentMethod) {
        return "KAKAO".equalsIgnoreCase(paymentMethod);
    }

    @Override
    public Payment confirmPayment(Long orderId, Integer amount, String paymentMethod) {
        // Kakao Pay normally follows a redirect flow. 
        // For actual implementation, you would use WebClient to call Kakao Approve API.
        
        String transactionId = "KAKAO-" + UUID.randomUUID().toString().substring(0, 8);
        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentMethod("KAKAO")
                .status(PaymentStatus.PAID)
                .transactionId(transactionId)
                .build();
    }

    @Override
    public String initiatePayment(Long orderId, Integer amount) {
        // Return a mock redirect URL that would go to our success page directly for demo
        return successUrl + "?orderId=" + orderId;
    }
}
