package com.new_cafe.app.backend.payment.application.port.out;

import com.new_cafe.app.backend.payment.domain.Payment;

public interface PaymentGateway {
    boolean supports(String paymentMethod);
    Payment confirmPayment(Long orderId, Integer amount, String paymentMethod, String pgToken);
    default String initiatePayment(Long orderId, Integer amount) { return null; }
}
