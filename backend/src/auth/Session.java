package auth;

import java.time.LocalDateTime;
import java.util.UUID;

public class Session {
    private final String token;
    private final int userId;
    private final String username;
    private final String role;
    private final LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
    private static final int SESSION_TIMEOUT_MINUTES = 60;

    public Session(int userId, String username, String role) {
        this.token = UUID.randomUUID().toString();
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
    }

    public String getToken() { return token; }
    public int getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }

    public void updateLastAccess() {
        this.lastAccessedAt = LocalDateTime.now();
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(lastAccessedAt.plusMinutes(SESSION_TIMEOUT_MINUTES));
    }

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(role);
    }
}
