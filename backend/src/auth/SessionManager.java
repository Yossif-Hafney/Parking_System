package auth;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class SessionManager {
    
    private static SessionManager instance;
    private final Map<String, Session> sessions;
    
    private SessionManager() {
        this.sessions = new ConcurrentHashMap<>();
    }
    
    public static synchronized SessionManager getInstance() {
        if (instance == null) {
            instance = new SessionManager();
        }
        return instance;
    }
    
    public Session createSession(User user) {
        // Remove any existing sessions for this user
        sessions.values().removeIf(s -> s.getUserId() == user.getId());
        
        Session session = new Session(user.getId(), user.getUsername(), user.getRole());
        sessions.put(session.getToken(), session);
        return session;
    }
    
    public Optional<Session> getSession(String token) {
        if (token == null || token.isEmpty()) {
            return Optional.empty();
        }
        
        Session session = sessions.get(token);
        if (session == null) {
            return Optional.empty();
        }
        
        if (session.isExpired()) {
            sessions.remove(token);
            return Optional.empty();
        }
        
        session.updateLastAccess();
        return Optional.of(session);
    }
    
    public void invalidateSession(String token) {
        if (token != null) {
            sessions.remove(token);
        }
    }
    
    public void invalidateUserSessions(int userId) {
        sessions.values().removeIf(s -> s.getUserId() == userId);
    }
    
    public void cleanupExpiredSessions() {
        sessions.values().removeIf(Session::isExpired);
    }
    
    public int getActiveSessionCount() {
        cleanupExpiredSessions();
        return sessions.size();
    }
}
