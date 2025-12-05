package database;

import vehicles.Vehicle;
import vehicles.Car;
import vehicles.Bike;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class VehicleRepository {

    private final DatabaseConnection db;

    public VehicleRepository() {
        this.db = DatabaseConnection.getInstance();
    }

    public int save(Vehicle vehicle) throws SQLException {
        String sql = 
            "INSERT INTO vehicles (plate_number, color, brand, type) " +
            "VALUES (?, ?, ?, ?) " +
            "ON CONFLICT (plate_number) DO UPDATE SET color = EXCLUDED.color, brand = EXCLUDED.brand " +
            "RETURNING id";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setString(1, vehicle.getPlateNumber());
            pstmt.setString(2, vehicle.getColor());
            pstmt.setString(3, vehicle.getBrand());
            pstmt.setString(4, getVehicleType(vehicle));

            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getInt("id");
            }
        }
        return -1;
    }

    public Optional<Vehicle> findByPlate(String plateNumber) throws SQLException {
        String sql = "SELECT * FROM vehicles WHERE plate_number = ?";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setString(1, plateNumber);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                return Optional.of(mapToVehicle(rs));
            }
        }
        return Optional.empty();
    }

    public List<Vehicle> findAll() throws SQLException {
        String sql = "SELECT * FROM vehicles ORDER BY created_at DESC";
        List<Vehicle> vehicles = new ArrayList<>();

        try (Statement stmt = db.getConnection().createStatement()) {
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                vehicles.add(mapToVehicle(rs));
            }
        }
        return vehicles;
    }

    public boolean delete(String plateNumber) throws SQLException {
        String sql = "DELETE FROM vehicles WHERE plate_number = ?";

        try (PreparedStatement pstmt = db.getConnection().prepareStatement(sql)) {
            pstmt.setString(1, plateNumber);
            return pstmt.executeUpdate() > 0;
        }
    }

    private Vehicle mapToVehicle(ResultSet rs) throws SQLException {
        String plate = rs.getString("plate_number");
        String color = rs.getString("color");
        String brand = rs.getString("brand");
        String type = rs.getString("type");

        return "car".equals(type) ? new Car(plate, color, brand) : new Bike(plate, color, brand);
    }

    private String getVehicleType(Vehicle vehicle) {
        return (vehicle instanceof Car) ? "car" : "bike";
    }
}
