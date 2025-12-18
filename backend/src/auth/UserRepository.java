package auth;

import database.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class UserRepository {
    
    public void save(User user) {
        String sql = "INSERT INTO users (username, password_hash, role, active) VALUES (?, ?, ?, ?) " +
                     "ON CONFLICT (username) DO UPDATE SET password_hash = ?, role = ?, active = ?";
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, user.getUsername());
            stmt.setString(2, user.getPasswordHash());
            stmt.setString(3, user.getRole());
            stmt.setBoolean(4, user.isActive());
            stmt.setString(5, user.getPasswordHash());
            stmt.setString(6, user.getRole());
            stmt.setBoolean(7, user.isActive());
            
            stmt.executeUpdate();
            
            try (ResultSet rs = stmt.getGeneratedKeys()) {
                if (rs.next()) {
                    user.setId(rs.getInt(1));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to save user: " + e.getMessage(), e);
        }
    }
    
    public Optional<User> findByUsername(String username) {
        String sql = "SELECT id, username, password_hash, role, active FROM users WHERE username = ?";
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to find user: " + e.getMessage(), e);
        }
        return Optional.empty();
    }
    
    public Optional<User> findById(int id) {
        String sql = "SELECT id, username, password_hash, role, active FROM users WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to find user: " + e.getMessage(), e);
        }
        return Optional.empty();
    }
    
    public List<User> findAll() {
        String sql = "SELECT id, username, password_hash, role, active FROM users ORDER BY username";
        List<User> users = new ArrayList<>();
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Failed to fetch users: " + e.getMessage(), e);
        }
        return users;
    }
    
    public void delete(String username) {
        String sql = "DELETE FROM users WHERE username = ?";
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }
    
    public void updatePassword(String username, String newPasswordHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE username = ?";
        
        try (Connection conn = DatabaseConnection.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, newPasswordHash);
            stmt.setString(2, username);
            stmt.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to update password: " + e.getMessage(), e);
        }
    }
    
    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        return new User(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getString("password_hash"),
            rs.getString("role"),
            rs.getBoolean("active")
        );
    }
}
