package database;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ParkingSlotRepository {

    private final DatabaseConnection db;

    public ParkingSlotRepository() {
        this.db = DatabaseConnection.getInstance();
    }

    public Optional<Integer> findAvailableSlot() throws SQLException {
        String sql = 
            "SELECT slot_number FROM parking_slots " +
            "WHERE is_available = TRUE " +
            "ORDER BY slot_number LIMIT 1";

        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            if (rs.next()) {
                return Optional.of(rs.getInt("slot_number"));
            }
        }
        return Optional.empty();
    }

    public boolean parkVehicle(int slotNumber, int vehicleId) throws SQLException {
        String sql = 
            "UPDATE parking_slots " +
            "SET is_available = FALSE, vehicle_id = ?, start_time = NOW(), updated_at = NOW() " +
            "WHERE slot_number = ? AND is_available = TRUE";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setInt(1, vehicleId);
            pstmt.setInt(2, slotNumber);
            return pstmt.executeUpdate() > 0;
        }
    }

    public Optional<SlotInfo> releaseSlot(String plateNumber) throws SQLException {
        String findSql = 
            "SELECT ps.slot_number, ps.start_time, v.plate_number, v.type, v.color, v.brand " +
            "FROM parking_slots ps " +
            "JOIN vehicles v ON ps.vehicle_id = v.id " +
            "WHERE v.plate_number = ? AND ps.is_available = FALSE";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(findSql)) {
            pstmt.setString(1, plateNumber);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                SlotInfo info = new SlotInfo(
                    rs.getInt("slot_number"),
                    rs.getString("plate_number"),
                    rs.getString("type"),
                    rs.getString("color"),
                    rs.getString("brand"),
                    rs.getTimestamp("start_time")
                );

                // Release the slot
                String releaseSql = 
                    "UPDATE parking_slots " +
                    "SET is_available = TRUE, vehicle_id = NULL, start_time = NULL, updated_at = NOW() " +
                    "WHERE slot_number = ?";

                try (PreparedStatement releaseStmt = db.getConnection().prepareStatement(releaseSql)) {
                    releaseStmt.setInt(1, info.slotNumber());
                    releaseStmt.executeUpdate();
                }

                return Optional.of(info);
            }
        }
        return Optional.empty();
    }

    public Optional<SlotInfo> findByPlate(String plateNumber) throws SQLException {
        String sql = 
            "SELECT ps.slot_number, ps.start_time, v.plate_number, v.type, v.color, v.brand " +
            "FROM parking_slots ps " +
            "JOIN vehicles v ON ps.vehicle_id = v.id " +
            "WHERE v.plate_number = ? AND ps.is_available = FALSE";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setString(1, plateNumber);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return Optional.of(new SlotInfo(
                    rs.getInt("slot_number"),
                    rs.getString("plate_number"),
                    rs.getString("type"),
                    rs.getString("color"),
                    rs.getString("brand"),
                    rs.getTimestamp("start_time")
                ));
            }
        }
        return Optional.empty();
    }

    public List<SlotStatus> getAllSlots() throws SQLException {
        String sql = 
            "SELECT ps.slot_number, ps.is_available, v.plate_number, v.type as vehicle_type, v.color, v.brand, ps.start_time as occupied_since " +
            "FROM parking_slots ps " +
            "LEFT JOIN vehicles v ON ps.vehicle_id = v.id " +
            "ORDER BY ps.slot_number";

        List<SlotStatus> slots = new ArrayList<>();
        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                slots.add(new SlotStatus(
                    rs.getInt("slot_number"),
                    rs.getBoolean("is_available"),
                    rs.getString("plate_number"),
                    rs.getString("vehicle_type"),
                    rs.getString("color"),
                    rs.getString("brand"),
                    rs.getTimestamp("occupied_since")
                ));
            }
        }
        return slots;
    }

    // Record classes for data transfer
    public record SlotInfo(int slotNumber, String plateNumber, String vehicleType, String color, String brand, Timestamp startTime) {}
    public record SlotStatus(int slotNumber, boolean available, String plateNumber, String vehicleType, String color, String brand, Timestamp startTime) {}
}
