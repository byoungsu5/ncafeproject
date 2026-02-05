package com.new_cafe.app.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.junit.jupiter.api.Test;

public class SchemaTest {

    @Test
    public void printSchema() {
        String url = "jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
        String user = "postgres.qcqecucgtjpbolmzfgdk";
        String password = "skdi_newlec";

        try (Connection conn = DriverManager.getConnection(url, user, password);
                Statement stmt = conn.createStatement()) {

            System.out.println("--- Table: menu_images ---");
            try (ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'menu_images'")) {
                while (rs.next()) {
                    System.out.println(rs.getString("column_name") + " : " + rs.getString("data_type"));
                }
            }

            System.out.println("--- Table: menu_image (try singular) ---");
            try (ResultSet rs = stmt.executeQuery(
                    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'menu_image'")) {
                while (rs.next()) {
                    System.out.println(rs.getString("column_name") + " : " + rs.getString("data_type"));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
