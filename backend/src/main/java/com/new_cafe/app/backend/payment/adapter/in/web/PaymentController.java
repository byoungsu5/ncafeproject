package com.new_cafe.app.backend.payment.adapter.in.web;

import com.new_cafe.app.backend.payment.application.port.in.PaymentUseCase;
import com.new_cafe.app.backend.payment.domain.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentUseCase paymentUseCase;

    @PostMapping("/confirm")
    public ResponseEntity<Payment> confirmPayment(@RequestBody PaymentRequest request) {
        PaymentUseCase.ConfirmPaymentCommand command = new PaymentUseCase.ConfirmPaymentCommand(
                request.orderId(),
                request.amount(),
                request.paymentMethod()
        );
        
        Payment payment = paymentUseCase.processPayment(command);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@RequestBody PaymentRequest request) {
        String redirectUrl = paymentUseCase.initiatePayment(request.orderId(), request.amount(), request.paymentMethod());
        return ResponseEntity.ok(Map.of("redirectUrl", redirectUrl != null ? redirectUrl : ""));
    }

    public record PaymentRequest(Long orderId, Integer amount, String paymentMethod) {}
}
