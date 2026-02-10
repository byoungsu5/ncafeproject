package com.new_cafe.app.backend.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.new_cafe.app.backend.entity.Menu;

@Repository
public class NewMenuRepository implements MenuRepository {

    private DataSource dataSource;

    public NewMenuRepository() {
    }

    @Autowired
    public NewMenuRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public List<Menu> findAll() {
        return findAllByCategoryId(null);
    }

    @Override
    public List<Menu> findAllByCategoryId(Integer categoryId) {
        List<Menu> list = new ArrayList<>();
        String sql = "SELECT * FROM menus";

        if (categoryId != null)
            sql += " WHERE category_id=" + categoryId;

        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(new Menu(
                        rs.getLong("id"),
                        rs.getString("kor_name"),
                        rs.getString("eng_name"),
                        rs.getString("description"),
                        rs.getInt("price"),
                        rs.getLong("category_id"),
                        rs.getBoolean("is_available"),
                        getLocalDateTime(rs, "created_at"),
                        getLocalDateTime(rs, "updated_at"),
                        null));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    @Override
    public List<Menu> findAllByName(String name) {
        List<Menu> list = new ArrayList<>();
        String sql = "SELECT * FROM menus WHERE kor_name LIKE '%" + name + "%'";

        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(new Menu(
                        rs.getLong("id"),
                        rs.getString("kor_name"),
                        rs.getString("eng_name"),
                        rs.getString("description"),
                        rs.getInt("price"),
                        rs.getLong("category_id"),
                        rs.getBoolean("is_available"),
                        getLocalDateTime(rs, "created_at"),
                        getLocalDateTime(rs, "updated_at"),
                        null));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    @Override
    public List<Menu> findAllByCategoryAndSearchQuery(Integer categoryId, String searchQuery) {
        List<Menu> list = new ArrayList<>();
        String sql = "SELECT * FROM menus WHERE 1=1";

        if (categoryId != null)
            sql += " AND category_id=" + categoryId;

        if (searchQuery != null && !searchQuery.isEmpty())
            sql += " AND kor_name LIKE '%" + searchQuery + "%'";

        try {
            try (Connection conn = dataSource.getConnection();
                    Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(sql)) {

                while (rs.next()) {
                    list.add(new Menu(
                            rs.getLong("id"),
                            rs.getString("kor_name"),
                            rs.getString("eng_name"),
                            rs.getString("description"),
                            rs.getInt("price"),
                            rs.getLong("category_id"),
                            rs.getBoolean("is_available"),
                            getLocalDateTime(rs, "created_at"),
                            getLocalDateTime(rs, "updated_at"),
                            null));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    @Override
    public Menu findById(Long id) {
        String sql = "SELECT * FROM menus WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Menu(
                            rs.getLong("id"),
                            rs.getString("kor_name"),
                            rs.getString("eng_name"),
                            rs.getString("description"),
                            rs.getInt("price"),
                            rs.getLong("category_id"),
                            rs.getBoolean("is_available"),
                            getLocalDateTime(rs, "created_at"),
                            getLocalDateTime(rs, "updated_at"),
                            null);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }


    private LocalDateTime getLocalDateTime(ResultSet rs, String columnLabel) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(columnLabel);
        return (timestamp != null) ? timestamp.toLocalDateTime() : null;
    }
}
