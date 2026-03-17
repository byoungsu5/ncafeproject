package com.new_cafe.app.backend.order.adapter.in.web;

import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.domain.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderUseCase orderUseCase;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String nickname = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal()))
                ? auth.getName()
                : "비회원";

        OrderUseCase.PlaceOrderCommand command = new OrderUseCase.PlaceOrderCommand(
                nickname,
                request.items().stream()
                        .map(item -> new OrderUseCase.OrderItemCommand(
                                item.menuId(),
                                item.menuName(),
                                item.price(),
                                item.quantity()
                        ))
                        .collect(Collectors.toList())
        );

        System.out.println("[OrderController] POST /api/orders - Items: " + (request.items() != null ? request.items().size() : 0) + ", User: " + nickname);
        Order order = orderUseCase.placeOrder(command);
        return ResponseEntity.ok(order);
    }

    @GetMapping(value = {"", "/me"})
    public ResponseEntity<List<Order>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentNickname = null;

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            currentNickname = auth.getName();
        }

        System.out.println("[OrderController] GET /api/orders - Auth: " + (auth != null ? auth.getClass().getSimpleName() : "null") 
            + ", Name: " + (auth != null ? auth.getName() : "null")
            + ", Principal: " + (auth != null ? auth.getPrincipal() : "null"));

        if (currentNickname == null) {
            System.err.println("[OrderController] 401 Unauthorized: currentNickname is null");
            return ResponseEntity.status(401).build();
        }

        List<Order> orders = orderUseCase.getOrdersByNickname(currentNickname);
        System.out.println("[OrderController] Returning " + orders.size() + " orders for: " + currentNickname);
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all-debug")
    public ResponseEntity<List<Order>> getAllOrdersDebug() {
        System.out.println("[OrderController] DEBUG: Requesting ALL orders from DB");
        List<Order> allOrders = orderUseCase.getAllOrders(); // UseCase에 메서드 추가 필요
        System.out.println("[OrderController] DEBUG: Found " + allOrders.size() + " total orders in DB");
        return ResponseEntity.ok(allOrders);
    }

    public record OrderRequest(List<OrderItemRequest> items) {}
    public record OrderItemRequest(Long menuId, String menuName, Integer price, Integer quantity) {}
}
