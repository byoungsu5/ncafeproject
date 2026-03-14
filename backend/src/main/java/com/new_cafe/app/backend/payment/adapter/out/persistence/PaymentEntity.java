package com.new_cafe.app.backend.payment.adapter.out.persistence;

import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String transactionId;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime paymentTime;

    public PaymentEntity(Long orderId, Integer amount, String paymentMethod, PaymentStatus status, String transactionId) {
        this.orderId = orderId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
    }

    public Payment toDomain() {
        return Payment.builder()
                .id(id)
                .orderId(orderId)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .status(status)
                .transactionId(transactionId)
                .paymentTime(paymentTime)
                .build();
    }
}
