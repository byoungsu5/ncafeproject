package com.new_cafe.app.backend.payment.application.service;

import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import com.new_cafe.app.backend.payment.adapter.out.persistence.PaymentEntity;
import com.new_cafe.app.backend.payment.adapter.out.persistence.PaymentJpaRepository;
import com.new_cafe.app.backend.payment.application.port.in.PaymentUseCase;
import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService implements PaymentUseCase {

    private final PaymentJpaRepository paymentJpaRepository;
    private final OrderUseCase orderUseCase;

    @Override
    public Payment processPayment(ConfirmPaymentCommand command) {
        // Mock payment processing logic
        // In reality, this might involve calling an external payment gateway API
        
        String transactionId = "TOSS-" + UUID.randomUUID().toString().substring(0, 8);
        
        PaymentEntity entity = new PaymentEntity(
                command.orderId(),
                command.amount(),
                command.paymentMethod(),
                PaymentStatus.PAID,
                transactionId
        );
        
        PaymentEntity savedEntity = paymentJpaRepository.save(entity);
        
        // 결제 완료 시 주문 상태를 ACCEPTED로 변경
        orderUseCase.updateOrderStatus(command.orderId(), OrderStatus.ACCEPTED);
        
        return savedEntity.toDomain();
    }
}
