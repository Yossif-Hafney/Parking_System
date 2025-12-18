package database;

import vehicles.Bike;
import vehicles.Car;
import vehicles.Vehicle;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for parking operations using PostgreSQL database.
 */
public class ParkingService {

    private final VehicleRepository vehicleRepo;
    private final ParkingSlotRepository slotRepo;
    private final ParkingHistoryRepository historyRepo;

    public ParkingService() {
        this.vehicleRepo = new VehicleRepository();
        this.slotRepo = new ParkingSlotRepository();
        this.historyRepo = new ParkingHistoryRepository();
    }

    /**
     * Parks a vehicle and returns the slot number, or -1 if no slots available.
     */
    public int parkVehicle(String plate, String color, String brand, String type) throws SQLException {
        // Find available slot
        Optional<Integer> slotOpt = slotRepo.findAvailableSlot();
        if (slotOpt.isEmpty()) {
            return -1;
        }

        // Create and save vehicle
        Vehicle vehicle = createVehicle(plate, color, brand, type);
        int vehicleId = vehicleRepo.save(vehicle);

        // Park in slot
        int slotNumber = slotOpt.get();
        slotRepo.parkVehicle(slotNumber, vehicleId);

        return slotNumber;
    }

    /**
     * Removes a vehicle and returns the fee, or -1 if not found.
     */
    public double removeVehicle(String plate) throws SQLException {
        Optional<ParkingSlotRepository.SlotInfo> slotOpt = slotRepo.releaseSlot(plate);
        if (slotOpt.isEmpty()) {
            return -1;
        }

        ParkingSlotRepository.SlotInfo info = slotOpt.get();
        Timestamp endTime = new Timestamp(System.currentTimeMillis());

        // Calculate fee
        long hours = calculateHours(info.startTime(), endTime);
        Vehicle vehicle = createVehicle(info.plateNumber(), info.color(), info.brand(), info.vehicleType());
        double fee = vehicle.calculateFee(hours);

        // Save to history
        historyRepo.save(
            info.slotNumber(),
            info.plateNumber(),
            info.vehicleType(),
            info.color(),
            info.brand(),
            info.startTime(),
            endTime,
            fee
        );

        return fee;
    }

    /**
     * Finds a parked vehicle by plate number.
     */
    public Optional<ParkingSlotRepository.SlotInfo> findVehicle(String plate) throws SQLException {
        return slotRepo.findByPlate(plate);
    }

    /**
     * Gets the status of all parking slots.
     */
    public List<ParkingSlotRepository.SlotStatus> getStatus() throws SQLException {
        return slotRepo.getAllSlots();
    }

    /**
     * Gets parking history.
     */
    public List<ParkingHistoryRepository.ParkingRecord> getHistory(int limit) throws SQLException {
        return historyRepo.findRecent(limit);
    }

    /**
     * Gets total revenue.
     */
    public double getTotalRevenue() throws SQLException {
        return historyRepo.getTotalRevenue();
    }

    /**
     * Gets today's revenue.
     */
    public double getTodayRevenue() throws SQLException {
        return historyRepo.getTodayRevenue();
    }

    /**
     * Converts status list to JSON.
     */
    public String statusToJson(List<ParkingSlotRepository.SlotStatus> slots) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;

        for (var slot : slots) {
            if (!first) sb.append(',');
            sb.append('{');
            sb.append("\"slotNumber\":").append(slot.slotNumber()).append(',');
            sb.append("\"available\":").append(slot.available());
            if (!slot.available() && slot.plateNumber() != null) {
                sb.append(",\"plateNumber\":\"").append(slot.plateNumber()).append("\"");
                if (slot.vehicleType() != null) {
                    sb.append(",\"vehicleType\":\"").append(slot.vehicleType()).append("\"");
                }
                if (slot.color() != null) {
                    sb.append(",\"color\":\"").append(slot.color()).append("\"");
                }
                if (slot.brand() != null) {
                    sb.append(",\"brand\":\"").append(slot.brand()).append("\"");
                }
                if (slot.startTime() != null) {
                    sb.append(",\"startTime\":\"").append(slot.startTime().toInstant().toString()).append("\"");
                }
            }
            sb.append('}');
            first = false;
        }

        sb.append(']');
        return sb.toString();
    }

    private Vehicle createVehicle(String plate, String color, String brand, String type) {
        return "car".equalsIgnoreCase(type)
            ? new Car(plate, color, brand)
            : new Bike(plate, color, brand);
    }

    private long calculateHours(Timestamp start, Timestamp end) {
        long millis = end.getTime() - start.getTime();
        return Math.max(1, millis / (1000 * 60 * 60));
    }
}
