package com.procurement.dao;

import com.procurement.db.DBConnection;
import com.procurement.model.UserRole;

import java.sql.*;

public class UserDAO {

    public UserRole getUserRole(String email, String passwordHash) {
        String sql = "SELECT u.user_id, u.full_name, r.role_name " +
                     "FROM users u JOIN roles r ON u.role_id = r.role_id " +
                     "WHERE u.email = ? AND u.password_hash = ? AND u.is_active = TRUE";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, passwordHash);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new UserRole(
                    rs.getInt("user_id"),
                    rs.getString("full_name"),
                    rs.getString("role_name")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}