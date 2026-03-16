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
public class TossPaymentAdapter implements PaymentGateway {

    @Value("${payment.toss.secret-key}")
    private String secretKey;

    @Override
    public boolean supports(String paymentMethod) {
        return "TOSS".equalsIgnoreCase(paymentMethod);
    }

    @Override
    public Payment confirmPayment(Long orderId, Integer amount, String paymentMethod, String pgToken) {
        // In a real Toss integration, the frontend would provide 'paymentKey'.
        // For actual implementation, you would use WebClient to call Toss API.
        
        String transactionId = "TOSS-" + UUID.randomUUID().toString().substring(0, 8);
        
        return Payment.builder()
                .orderId(orderId)
                .amount(amount)
                .paymentMethod("TOSS")
                .status(PaymentStatus.PAID)
                .transactionId(transactionId)
                .build();
    }
}
