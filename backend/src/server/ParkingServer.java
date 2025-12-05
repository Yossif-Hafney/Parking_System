package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import auth.AuthService;
import auth.Session;
import database.ParkingService;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.Optional;

public class ParkingServer {

    private static final String CONTENT_TYPE = "Content-Type";
    private static final String APPLICATION_JSON = "application/json";
    private static final String METHOD_NOT_ALLOWED = "{\"error\": \"Method not allowed\"}";
    private static final String UNAUTHORIZED = "{\"error\": \"Unauthorized. Please login first.\"}";

    private final HttpServer server;
    private final ParkingService parkingService;
    private final AuthService authService;
    private final int port;

    public ParkingServer(int port) throws IOException {
        this.port = port;
        this.parkingService = new ParkingService();
        this.authService = new AuthService();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        registerEndpoints();
    }

    private void registerEndpoints() {
        // Public endpoints
        server.createContext("/", this::handleRoot);
        server.createContext("/login", this::handleLogin);
        server.createContext("/logout", this::handleLogout);
        server.createContext("/register", this::handleRegister);
        
        // Protected endpoints
        server.createContext("/park", this::handlePark);
        server.createContext("/remove", this::handleRemove);
        server.createContext("/status", this::handleStatus);
        server.createContext("/find", this::handleFind);
        server.createContext("/history", this::handleHistory);
        server.createContext("/revenue", this::handleRevenue);
        server.createContext("/me", this::handleMe);
    }

    public void start() {
        authService.createDefaultAdmin();
        server.setExecutor(null);
        server.start();
        System.out.println("Parking Server started on http://localhost:" + port);
    }

    public void stop() {
        server.stop(0);
        System.out.println("Parking Server stopped.");
    }

    // ======================== Handlers ========================

    private void handleRoot(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;
        String response = "{\"message\": \"Parking Car System API\", \"endpoints\": [" +
            "\"/login\", \"/logout\", \"/register\", \"/me\", " +
            "\"/park\", \"/remove\", \"/status\", \"/find\", \"/history\", \"/revenue\"]}";
        sendJsonResponse(exchange, 200, response);
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"POST".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        String body = readRequestBody(exchange);
        String username = extractJsonValue(body, "username");
        String password = extractJsonValue(body, "password");

        var result = authService.login(username, password);

        if (result.success()) {
            sendJsonResponse(exchange, 200, String.format(
                "{\"success\": true, \"message\": \"%s\", \"token\": \"%s\", \"username\": \"%s\", \"role\": \"%s\"}",
                result.message(), result.token(), result.username(), result.role()));
        } else {
            sendJsonResponse(exchange, 401, String.format(
                "{\"success\": false, \"message\": \"%s\"}", result.message()));
        }
    }

    private void handleLogout(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"POST".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        String token = getAuthToken(exchange);
        boolean success = authService.logout(token);

        if (success) {
            sendJsonResponse(exchange, 200, "{\"success\": true, \"message\": \"Logged out successfully\"}");
        } else {
            sendJsonResponse(exchange, 400, "{\"success\": false, \"message\": \"Invalid or missing token\"}");
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"POST".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        // Only admin can register new users
        Optional<Session> sessionOpt = validateSession(exchange);
        if (sessionOpt.isEmpty() || !sessionOpt.get().isAdmin()) {
            sendJsonResponse(exchange, 403, "{\"error\": \"Only admin can register new users\"}");
            return;
        }

        String body = readRequestBody(exchange);
        String username = extractJsonValue(body, "username");
        String password = extractJsonValue(body, "password");
        String role = extractJsonValue(body, "role");

        var result = authService.register(username, password, role);

        if (result.success()) {
            sendJsonResponse(exchange, 201, String.format(
                "{\"success\": true, \"message\": \"%s\"}", result.message()));
        } else {
            sendJsonResponse(exchange, 400, String.format(
                "{\"success\": false, \"message\": \"%s\"}", result.message()));
        }
    }

    private void handleMe(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        Optional<Session> sessionOpt = validateSession(exchange);
        if (sessionOpt.isEmpty()) {
            sendJsonResponse(exchange, 401, UNAUTHORIZED);
            return;
        }

        Session session = sessionOpt.get();
        sendJsonResponse(exchange, 200, String.format(
            "{\"username\": \"%s\", \"role\": \"%s\", \"loggedInSince\": \"%s\"}",
            session.getUsername(), session.getRole(), session.getCreatedAt()));
    }

    private void handlePark(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"POST".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        // Require authentication
        Optional<Session> sessionOpt = validateSession(exchange);
        if (sessionOpt.isEmpty()) {
            sendJsonResponse(exchange, 401, UNAUTHORIZED);
            return;
        }

        String body = readRequestBody(exchange);
        String plate = extractJsonValue(body, "plate");
        String color = extractJsonValue(body, "color");
        String brand = extractJsonValue(body, "brand");
        String type = extractJsonValue(body, "type");

        if (plate == null || type == null) {
            sendJsonResponse(exchange, 400, "{\"error\": \"Missing plate or type\"}");
            return;
        }

        if (color == null || color.trim().isEmpty()) {
            sendJsonResponse(exchange, 400, "{\"error\": \"Color is required\"}");
            return;
        }

        if (!"car".equalsIgnoreCase(type) && !"bike".equalsIgnoreCase(type)) {
            sendJsonResponse(exchange, 400, "{\"error\": \"Invalid type. Use 'car' or 'bike'\"}");
            return;
        }

        try {
            int slotId = parkingService.parkVehicle(plate, color, brand, type);
            if (slotId > 0) {
                sendJsonResponse(exchange, 200, String.format(
                    "{\"message\": \"Vehicle parked\", \"plate\": \"%s\", \"slotId\": %d}", plate, slotId));
            } else {
                sendJsonResponse(exchange, 400, "{\"error\": \"No available slots\"}");
            }
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    private void handleRemove(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"POST".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        // Require authentication
        Optional<Session> sessionOpt = validateSession(exchange);
        if (sessionOpt.isEmpty()) {
            sendJsonResponse(exchange, 401, UNAUTHORIZED);
            return;
        }

        String body = readRequestBody(exchange);
        String plate = extractJsonValue(body, "plate");

        if (plate == null) {
            sendJsonResponse(exchange, 400, "{\"error\": \"Missing plate\"}");
            return;
        }

        try {
            double fee = parkingService.removeVehicle(plate);
            if (fee >= 0) {
                sendJsonResponse(exchange, 200, String.format(
                    "{\"message\": \"Vehicle removed\", \"plate\": \"%s\", \"fee\": %.2f}", plate, fee));
            } else {
                sendJsonResponse(exchange, 404, "{\"error\": \"Vehicle not found\"}");
            }
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    private void handleStatus(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        try {
            var slots = parkingService.getStatus();
            sendJsonResponse(exchange, 200, parkingService.statusToJson(slots));
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    private void handleFind(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        String plate = getQueryParam(exchange, "plate");
        if (plate == null) {
            sendJsonResponse(exchange, 400, "{\"error\": \"Missing plate parameter\"}");
            return;
        }

        try {
            var slotOpt = parkingService.findVehicle(plate);
            if (slotOpt.isPresent()) {
                var slot = slotOpt.get();
                sendJsonResponse(exchange, 200, String.format(
                    "{\"found\": true, \"slotId\": %d, \"plate\": \"%s\", \"type\": \"%s\"}",
                    slot.slotNumber(), plate, slot.vehicleType()));
            } else {
                sendJsonResponse(exchange, 404, String.format(
                    "{\"found\": false, \"plate\": \"%s\"}", plate));
            }
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    private void handleHistory(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        try {
            String limitStr = getQueryParam(exchange, "limit");
            int limit = (limitStr != null) ? Integer.parseInt(limitStr) : 50;

            var history = parkingService.getHistory(limit);
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;

            for (var record : history) {
                if (!first) sb.append(',');
                sb.append(String.format(
                    "{\"id\":%d,\"slot\":%d,\"plate\":\"%s\",\"type\":\"%s\",\"color\":\"%s\",\"brand\":\"%s\",\"fee\":%.2f,\"endTime\":\"%s\"}",
                    record.id(), record.slotNumber(), record.plateNumber(),
                    record.vehicleType(), 
                    record.color() != null ? record.color() : "",
                    record.brand() != null ? record.brand() : "",
                    record.fee(), record.endTime()));
                first = false;
            }
            sb.append(']');

            sendJsonResponse(exchange, 200, sb.toString());
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    private void handleRevenue(HttpExchange exchange) throws IOException {
        if (handleCors(exchange)) return;

        if (!"GET".equals(exchange.getRequestMethod())) {
            sendJsonResponse(exchange, 405, METHOD_NOT_ALLOWED);
            return;
        }

        // Only admin can view revenue
        Optional<Session> sessionOpt = validateSession(exchange);
        if (sessionOpt.isEmpty()) {
            sendJsonResponse(exchange, 401, UNAUTHORIZED);
            return;
        }
        if (!sessionOpt.get().isAdmin()) {
            sendJsonResponse(exchange, 403, "{\"error\": \"Admin access required\"}");
            return;
        }

        try {
            double total = parkingService.getTotalRevenue();
            double today = parkingService.getTodayRevenue();
            sendJsonResponse(exchange, 200, String.format(
                "{\"total\": %.2f, \"today\": %.2f}", total, today));
        } catch (SQLException e) {
            sendJsonResponse(exchange, 500, "{\"error\": \"Database error: " + escapeJson(e.getMessage()) + "\"}");
        }
    }

    // ======================== Helper Methods ========================

    private Optional<Session> validateSession(HttpExchange exchange) {
        String token = getAuthToken(exchange);
        return authService.validateToken(token);
    }

    private String getAuthToken(HttpExchange exchange) {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        // Also check query parameter for easier testing
        return getQueryParam(exchange, "token");
    }

    private boolean handleCors(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return true;
        }
        return false;
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set(CONTENT_TYPE, APPLICATION_JSON);
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private String getQueryParam(HttpExchange exchange, String key) {
        String query = exchange.getRequestURI().getQuery();
        if (query == null) return null;

        for (String param : query.split("&")) {
            String[] kv = param.split("=", 2);
            if (kv.length == 2 && key.equals(kv[0])) {
                return kv[1];
            }
        }
        return null;
    }

    private String extractJsonValue(String json, String key) {
        String search = "\"" + key + "\"";
        int keyIndex = json.indexOf(search);
        if (keyIndex == -1) return null;

        int colonIndex = json.indexOf(':', keyIndex);
        if (colonIndex == -1) return null;

        int startQuote = json.indexOf('"', colonIndex);
        if (startQuote == -1) return null;

        int endQuote = json.indexOf('"', startQuote + 1);
        if (endQuote == -1) return null;

        return json.substring(startQuote + 1, endQuote);
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
