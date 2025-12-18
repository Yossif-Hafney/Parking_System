package auth;

import java.util.Optional;

public class AuthService {
    
    private final UserRepository userRepository;
    private final SessionManager sessionManager;
    
    public AuthService() {
        this.userRepository = new UserRepository();
        this.sessionManager = SessionManager.getInstance();
    }
    
    public record LoginResult(boolean success, String message, String token, String username, String role) {}
    
    public LoginResult login(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            return new LoginResult(false, "Username is required", null, null, null);
        }
        if (password == null || password.isEmpty()) {
            return new LoginResult(false, "Password is required", null, null, null);
        }
        
        Optional<User> userOpt = userRepository.findByUsername(username.trim());
        
        if (userOpt.isEmpty()) {
            return new LoginResult(false, "Invalid username or password", null, null, null);
        }
        
        User user = userOpt.get();
        
        if (!user.isActive()) {
            return new LoginResult(false, "Account is deactivated", null, null, null);
        }
        
        if (!PasswordUtils.verifyPassword(password, user.getPasswordHash())) {
            return new LoginResult(false, "Invalid username or password", null, null, null);
        }
        
        Session session = sessionManager.createSession(user);
        
        return new LoginResult(true, "Login successful", session.getToken(), user.getUsername(), user.getRole());
    }
    
    public boolean logout(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        sessionManager.invalidateSession(token);
        return true;
    }
    
    public Optional<Session> validateToken(String token) {
        return sessionManager.getSession(token);
    }
    
    public record RegisterResult(boolean success, String message) {}
    
    public RegisterResult register(String username, String password, String role) {
        if (username == null || username.trim().isEmpty()) {
            return new RegisterResult(false, "Username is required");
        }
        if (password == null || password.length() < 4) {
            return new RegisterResult(false, "Password must be at least 4 characters");
        }
        if (role == null || (!role.equals("admin") && !role.equals("operator"))) {
            role = "operator";
        }
        
        Optional<User> existing = userRepository.findByUsername(username.trim());
        if (existing.isPresent()) {
            return new RegisterResult(false, "Username already exists");
        }
        
        String passwordHash = PasswordUtils.hashPassword(password);
        User user = new User(username.trim(), passwordHash, role);
        userRepository.save(user);
        
        return new RegisterResult(true, "User registered successfully");
    }
    
    public void createDefaultAdmin() {
        Optional<User> admin = userRepository.findByUsername("admin");
        if (admin.isEmpty()) {
            String passwordHash = PasswordUtils.hashPassword("admin123");
            User adminUser = new User("admin", passwordHash, "admin");
            userRepository.save(adminUser);
            System.out.println("Default admin created (username: admin, password: admin123)");
        }
    }
}
