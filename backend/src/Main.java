import database.DatabaseConnection;
import server.ParkingServer;

import java.io.IOException;
import java.sql.SQLException;

public class Main {

    private static final int DEFAULT_PORT = 8080;
    private static final int DEFAULT_SLOTS = 20;

    public static void main(String[] args) {
        System.out.println("Welcome to Parking Car System!");

        int port = parsePort(args);

        try {
            // Initialize database
            initializeDatabase();

            // Start server
            ParkingServer server = new ParkingServer(port);
            server.start();
            registerShutdownHook(server);

            System.out.println("Press Ctrl+C to stop the server.");
        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    }

    private static void initializeDatabase() throws SQLException {
        DatabaseConnection db = DatabaseConnection.getInstance();
        db.initializeSchema();
        db.initializeSlots(DEFAULT_SLOTS);
        System.out.println("Database connected and initialized.");
    }

    private static int parsePort(String[] args) {
        if (args.length > 0) {
            try {
                return Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("Invalid port, using default: " + DEFAULT_PORT);
            }
        }
        return DEFAULT_PORT;
    }

    private static void registerShutdownHook(ParkingServer server) {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nShutting down server...");
            server.stop();
            DatabaseConnection.getInstance().close();
        }));
    }
}
