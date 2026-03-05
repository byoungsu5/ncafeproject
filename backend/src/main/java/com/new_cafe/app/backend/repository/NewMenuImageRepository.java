package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.MenuImage;

@Repository
public class NewMenuImageRepository implements MenuImageRepository {

    private final DataSource dataSource;

    public NewMenuImageRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

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
                            .url(rs.getString("src_url"))
                            .sortOrder(rs.getInt("sort_order"))
                            .createdAt(rs.getTimestamp("created_at") != null
                                    ? rs.getTimestamp("created_at").toLocalDateTime()
                                    : null)
                            .build());
                }
            }
        } catch (SQLException e) {
            System.err.println("NewMenuImageRepository.findAllByMenuId Error: " + e.getMessage());
        }
        return list;
    }

    @Override
    public MenuImage save(MenuImage menuImage) {
        String sql = "INSERT INTO menu_images (menu_id, src_url, sort_order) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, menuImage.getMenuId());
            pstmt.setString(2, menuImage.getUrl());
            pstmt.setInt(3, menuImage.getSortOrder());
            pstmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println("NewMenuImageRepository.save Error: " + e.getMessage());
        }
        return menuImage;
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM menu_images WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, id);
            pstmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println("NewMenuImageRepository.deleteById Error: " + e.getMessage());
        }
    }
}
