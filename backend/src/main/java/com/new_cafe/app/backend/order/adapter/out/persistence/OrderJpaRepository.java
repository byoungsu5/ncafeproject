package com.new_cafe.app.backend.order.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByNicknameOrderByOrderTimeDesc(String nickname);
    List<OrderEntity> findAllByOrderByOrderTimeDesc();
}
