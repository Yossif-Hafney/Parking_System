package database;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ParkingHistoryRepository {

    private final DatabaseConnection db;

    public ParkingHistoryRepository() {
        this.db = DatabaseConnection.getInstance();
    }

    public void save(int slotNumber, String plateNumber, String vehicleType, String color, String brand,
                     Timestamp startTime, Timestamp endTime, double fee) throws SQLException {
        String sql = 
            "INSERT INTO parking_history (slot_number, plate_number, vehicle_type, color, brand, start_time, end_time, fee) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setInt(1, slotNumber);
            pstmt.setString(2, plateNumber);
            pstmt.setString(3, vehicleType);
            pstmt.setString(4, color);
            pstmt.setString(5, brand);
            pstmt.setTimestamp(6, startTime);
            pstmt.setTimestamp(7, endTime);
            pstmt.setDouble(8, fee);
            pstmt.executeUpdate();
        }
    }

    public List<ParkingRecord> findAll() throws SQLException {
        String sql = "SELECT * FROM parking_history ORDER BY created_at DESC";
        return executeQuery(sql);
    }

    public List<ParkingRecord> findByPlate(String plateNumber) throws SQLException {
        String sql = "SELECT * FROM parking_history WHERE plate_number = ? ORDER BY created_at DESC";
        List<ParkingRecord> records = new ArrayList<>();

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setString(1, plateNumber);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                records.add(mapToRecord(rs));
            }
        }
        return records;
    }

    public List<ParkingRecord> findRecent(int limit) throws SQLException {
        String sql = "SELECT * FROM parking_history ORDER BY created_at DESC LIMIT ?";
        List<ParkingRecord> records = new ArrayList<>();

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setInt(1, limit);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                records.add(mapToRecord(rs));
            }
        }
        return records;
    }

    public double getTotalRevenue() throws SQLException {
        String sql = "SELECT COALESCE(SUM(fee), 0) as total FROM parking_history";

        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            if (rs.next()) {
                return rs.getDouble("total");
            }
        }
        return 0;
    }

    public double getTodayRevenue() throws SQLException {
        String sql = 
            "SELECT COALESCE(SUM(fee), 0) as total FROM parking_history " +
            "WHERE DATE(created_at) = CURRENT_DATE";

        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            if (rs.next()) {
                return rs.getDouble("total");
            }
        }
        return 0;
    }

    private List<ParkingRecord> executeQuery(String sql) throws SQLException {
        List<ParkingRecord> records = new ArrayList<>();

        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                records.add(mapToRecord(rs));
            }
        }
        return records;
    }

    private ParkingRecord mapToRecord(ResultSet rs) throws SQLException {
        return new ParkingRecord(
            rs.getInt("id"),
            rs.getInt("slot_number"),
            rs.getString("plate_number"),
            rs.getString("vehicle_type"),
            rs.getString("color"),
            rs.getString("brand"),
            rs.getTimestamp("start_time"),
            rs.getTimestamp("end_time"),
            rs.getDouble("fee"),
            rs.getTimestamp("created_at")
        );
    }

    public record ParkingRecord(
        int id,
        int slotNumber,
        String plateNumber,
        String vehicleType,
        String color,
        String brand,
        Timestamp startTime,
        Timestamp endTime,
        double fee,
        Timestamp createdAt
    ) {}
}
