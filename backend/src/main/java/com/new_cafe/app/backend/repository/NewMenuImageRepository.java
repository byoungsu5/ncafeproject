package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.MenuImage;

@Repository
public class NewMenuImageRepository implements MenuImageRepository {

    @Autowired
    private DataSource dataSource;

    @Override
    public List<MenuImage> findAllByMenuId(Long menuId) {
        List<MenuImage> list = new ArrayList<>();
        String sql = "SELECT * FROM menu_images WHERE menu_id = ? ORDER BY sort_order";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, menuId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(MenuImage.builder()
                            .id(rs.getLong("id"))
                            .menuId(rs.getLong("menu_id"))
                            .srcUrl(rs.getString("src_url"))
                            .createdAt(getLocalDateTime(rs, "created_at"))
                            .sortOrder(rs.getInt("sort_order"))
                            .build());
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    private LocalDateTime getLocalDateTime(ResultSet rs, String columnLabel) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(columnLabel);
        return (timestamp != null) ? timestamp.toLocalDateTime() : null;
    }
}
