package auth;

public class User {
    private int id;
    private String username;
    private String passwordHash;
    private String role;
    private boolean active;

    public User(String username, String passwordHash, String role) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = true;
    }

    public User(int id, String username, String passwordHash, String role, boolean active) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = active;
    }

    // Getters
    public int getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }

    // Setters
    public void setId(int id) { this.id = id; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase(role);
    }
}
