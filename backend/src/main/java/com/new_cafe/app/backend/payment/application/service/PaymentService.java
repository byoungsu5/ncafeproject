package com.new_cafe.app.backend.payment.application.service;

import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import com.new_cafe.app.backend.payment.adapter.out.persistence.PaymentEntity;
import com.new_cafe.app.backend.payment.adapter.out.persistence.PaymentJpaRepository;
import com.new_cafe.app.backend.payment.application.port.in.PaymentUseCase;
import com.new_cafe.app.backend.payment.application.port.out.PaymentGateway;
import com.new_cafe.app.backend.payment.domain.Payment;
import com.new_cafe.app.backend.payment.domain.PaymentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService implements PaymentUseCase {

    private final PaymentJpaRepository paymentJpaRepository;
    private final OrderUseCase orderUseCase;
    private final List<PaymentGateway> gateways;

    @Override
    public Payment processPayment(ConfirmPaymentCommand command) {
        PaymentGateway gateway = gateways.stream()
                .filter(g -> g.supports(command.paymentMethod()))
                .findFirst()
                .orElse(null);

        Payment payment;
        if (gateway != null) {
            payment = gateway.confirmPayment(command.orderId(), command.amount(), command.paymentMethod());
        } else {
            // Fallback for generic methods or MOCK
            String transactionId = "MOCK-" + UUID.randomUUID().toString().substring(0, 8);
            payment = Payment.builder()
                    .orderId(command.orderId())
                    .amount(command.amount())
                    .paymentMethod(command.paymentMethod())
                    .status(PaymentStatus.PAID)
                    .transactionId(transactionId)
                    .build();
        }
        
        PaymentEntity entity = new PaymentEntity(
                payment.getOrderId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getTransactionId()
        );
        
        PaymentEntity savedEntity = paymentJpaRepository.save(entity);
        
        // 결제 완료 시 주문 상태를 ACCEPTED로 변경
        orderUseCase.updateOrderStatus(command.orderId(), OrderStatus.ACCEPTED);
        
        return savedEntity.toDomain();
    }

    @Override
    public String initiatePayment(Long orderId, Integer amount, String paymentMethod) {
        return gateways.stream()
                .filter(g -> g.supports(paymentMethod))
                .map(g -> g.initiatePayment(orderId, amount))
                .findFirst()
                .orElse(null);
    }
}
