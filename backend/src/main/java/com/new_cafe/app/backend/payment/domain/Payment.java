package com.new_cafe.app.backend.payment.domain;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class Payment {
    private Long id;
    private Long orderId;
    private Integer amount;
    private String paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String redirectUrl;
    private LocalDateTime paymentTime;
}
