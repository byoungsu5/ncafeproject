package com.new_cafe.app.backend.admin.order.adapter.in.web;

import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.domain.Order;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderUseCase orderUseCase;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderUseCase.getAllOrders());
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody StatusUpdateRequest request) {
        
        String statusStr = request.status();
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            System.out.println("[AdminOrderController] Updating order " + orderId + " to status " + statusStr);
            OrderStatus status = OrderStatus.valueOf(statusStr);
            Order updatedOrder = orderUseCase.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            System.err.println("[AdminOrderController] Invalid status: " + statusStr);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("[AdminOrderController] Failed to update order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    public record StatusUpdateRequest(String status) {}
}