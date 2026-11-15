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
        if (username.trim().length() > 50) {
            return new RegisterResult(false, "Username must be 50 characters or fewer");
        }
        if (password == null || password.length() < 4) {
            return new RegisterResult(false, "Password must be at least 4 characters");
        }
        if (role == null || (!role.equals("admin") && !role.equals("operator"))) {
            role = "operator";
        }

        User user = new User(username.trim(), PasswordUtils.hashPassword(password), role);
        if (!userRepository.createIfAbsent(user)) {
            return new RegisterResult(false, "Username already exists");
        }

        return new RegisterResult(true, "User registered successfully");
    }
    
    public void createDefaultAdmin() {
        boolean production = "production".equalsIgnoreCase(System.getenv("APP_ENV"));
        String username = getEnv("DEFAULT_ADMIN_USERNAME");
        String password = getEnv("DEFAULT_ADMIN_PASSWORD");

        if (production && (username == null || username.isBlank()
                || password == null || password.length() < 12)) {
            throw new IllegalStateException(
                "Production requires DEFAULT_ADMIN_USERNAME and a DEFAULT_ADMIN_PASSWORD of at least 12 characters");
        }

        if (username == null || username.isBlank()) {
            username = "admin";
        }
        if (password == null || password.isBlank()) {
            password = "admin123";
        }

        Optional<User> admin = userRepository.findByUsername(username);
        if (admin.isEmpty()) {
            String passwordHash = PasswordUtils.hashPassword(password);
            User adminUser = new User(username, passwordHash, "admin");
            userRepository.save(adminUser);
            System.out.println("Default admin created (username: " + username + ")");
        }
    }

    private static String getEnv(String key) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? null : value;
    }
}
