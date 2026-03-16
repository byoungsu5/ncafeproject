package com.new_cafe.app.backend.payment.application.port.in;

import com.new_cafe.app.backend.payment.domain.Payment;

public interface PaymentUseCase {
    Payment processPayment(ConfirmPaymentCommand command);
    
    String initiatePayment(Long orderId, Integer amount, String paymentMethod);

    record ConfirmPaymentCommand(
            Long orderId,
            Integer amount,
            String paymentMethod,
            String pgToken
    ) {}
}
