package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseConnection {

    private static DatabaseConnection instance;
    private final DatabaseConfig config;
    private Connection connection;

    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("PostgreSQL driver not found: " + e.getMessage());
        }
    }

    private DatabaseConnection(DatabaseConfig config) {
        this.config = config;
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection(new DatabaseConfig());
        }
        return instance;
    }

    public static synchronized DatabaseConnection getInstance(DatabaseConfig config) {
        if (instance == null) {
            instance = new DatabaseConnection(config);
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(
                config.getConnectionUrl(),
                config.getUser(),
                config.getPassword()
            );
        }
        return connection;
    }

    public void close() {
        if (connection != null) {
            try {
                connection.close();
                System.out.println("Database connection closed.");
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }

    public void initializeSchema() throws SQLException {
        String createUsersTable =
            "CREATE TABLE IF NOT EXISTS users (" +
            "id SERIAL PRIMARY KEY, " +
            "username VARCHAR(50) UNIQUE NOT NULL, " +
            "password_hash VARCHAR(255) NOT NULL, " +
            "role VARCHAR(20) NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'operator')), " +
            "active BOOLEAN DEFAULT TRUE, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

        String createVehiclesTable = 
            "CREATE TABLE IF NOT EXISTS vehicles (" +
            "id SERIAL PRIMARY KEY, " +
            "plate_number VARCHAR(20) UNIQUE NOT NULL, " +
            "color VARCHAR(50) NOT NULL, " +
            "brand VARCHAR(50), " +
            "type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike')), " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";        
        String addBrandColumn = 
            "ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand VARCHAR(50)";

        String createSlotsTable = 
            "CREATE TABLE IF NOT EXISTS parking_slots (" +
            "id SERIAL PRIMARY KEY, " +
            "slot_number INT UNIQUE NOT NULL, " +
            "is_available BOOLEAN DEFAULT TRUE, " +
            "vehicle_id INT REFERENCES vehicles(id) ON DELETE SET NULL, " +
            "start_time TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

        String createHistoryTable = 
            "CREATE TABLE IF NOT EXISTS parking_history (" +
            "id SERIAL PRIMARY KEY, " +
            "slot_number INT NOT NULL, " +
            "plate_number VARCHAR(20) NOT NULL, " +
            "vehicle_type VARCHAR(10) NOT NULL, " +
            "color VARCHAR(50), " +
            "brand VARCHAR(50), " +
            "start_time TIMESTAMP NOT NULL, " +
            "end_time TIMESTAMP NOT NULL, " +
            "fee DECIMAL(10, 2) NOT NULL, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
        
        String addHistoryColorColumn = 
            "ALTER TABLE parking_history ADD COLUMN IF NOT EXISTS color VARCHAR(50)";
        String addHistoryBrandColumn = 
            "ALTER TABLE parking_history ADD COLUMN IF NOT EXISTS brand VARCHAR(50)";

        try (Statement stmt = getConnection().createStatement()) {
            stmt.execute(createUsersTable);
            stmt.execute(createVehiclesTable);
            stmt.execute(addBrandColumn);
            stmt.execute(createSlotsTable);
            stmt.execute(createHistoryTable);
            stmt.execute(addHistoryColorColumn);
            stmt.execute(addHistoryBrandColumn);
            System.out.println("Database schema initialized.");
        }
    }

    public void initializeSlots(int totalSlots) throws SQLException {
        String insertSlot = 
            "INSERT INTO parking_slots (slot_number, is_available) " +
            "VALUES (?, TRUE) " +
            "ON CONFLICT (slot_number) DO NOTHING";

        try (var pstmt = getConnection().prepareStatement(insertSlot)) {
            for (int i = 1; i <= totalSlots; i++) {
                pstmt.setInt(1, i);
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            System.out.println("Initialized " + totalSlots + " parking slots.");
        }
    }
}
