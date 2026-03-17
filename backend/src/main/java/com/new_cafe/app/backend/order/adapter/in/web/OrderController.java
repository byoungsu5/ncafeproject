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

        Order order = orderUseCase.placeOrder(command);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("[OrderController] getMyOrders request. Auth: " + auth);
        
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            System.err.println("[OrderController] Unauthenticated request to getMyOrders");
            return ResponseEntity.status(401).build();
        }

        System.out.println("[OrderController] Fetching orders for user: " + auth.getName());
        List<Order> orders = orderUseCase.getOrdersByNickname(auth.getName());
        System.out.println("[OrderController] Found " + orders.size() + " orders for " + auth.getName());
        
        return ResponseEntity.ok(orders);
    }

    public record OrderRequest(List<OrderItemRequest> items) {}
    public record OrderItemRequest(Long menuId, String menuName, Integer price, Integer quantity) {}
}
