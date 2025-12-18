package parking;

import vehicles.Vehicle;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ParkingLot {

    private static final int DEFAULT_CAPACITY = 20;

    private static ParkingLot instance;
    private final List<ParkingSlot> slots = new ArrayList<>();
    private final List<ParkingRecord> history = new ArrayList<>();

    private ParkingLot(int totalSlots) {
        for (int i = 1; i <= totalSlots; i++) {
            slots.add(new ParkingSlot(i));
        }
    }

    public static synchronized ParkingLot getInstance() {
        if (instance == null) {
            instance = new ParkingLot(DEFAULT_CAPACITY);
        }
        return instance;
    }

    public synchronized int parkVehicle(Vehicle vehicle) {
        Optional<ParkingSlot> availableSlot = slots.stream()
                .filter(ParkingSlot::isAvailable)
                .findFirst();

        if (availableSlot.isPresent()) {
            ParkingSlot slot = availableSlot.get();
            slot.parkVehicle(vehicle);
            return slot.getId();
        }
        return -1;
    }

    public synchronized double releaseByPlate(String plate) {
        for (ParkingSlot slot : slots) {
            if (!slot.isAvailable() && slot.getVehicle().getPlateNumber().equalsIgnoreCase(plate)) {
                long startTime = slot.getStartTime();
                long endTime = System.currentTimeMillis();
                double fee = slot.releaseVehicle();

                history.add(new ParkingRecord(slot.getId(), plate, startTime, endTime, fee));
                return fee;
            }
        }
        return -1;
    }

    public synchronized ParkingSlot findByPlate(String plate) {
        for (ParkingSlot slot : slots) {
            if (!slot.isAvailable() && slot.getVehicle().getPlateNumber().equalsIgnoreCase(plate)) {
                return slot;
            }
        }
        return null;
    }

    public synchronized List<ParkingSlot> getSlots() {
        return new ArrayList<>(slots);
    }

    public synchronized List<ParkingRecord> getHistory() {
        return new ArrayList<>(history);
    }

    // ======================== JSON Helpers ========================

    public synchronized String toJsonSlots() {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;

        for (ParkingSlot slot : slots) {
            if (!first) sb.append(',');
            sb.append('{');
            sb.append("\"id\":").append(slot.getId()).append(',');
            sb.append("\"available\":").append(slot.isAvailable());

            if (!slot.isAvailable()) {
                sb.append(",\"plate\":\"").append(escapeJson(slot.getVehicle().getPlateNumber())).append("\"");
            }

            sb.append('}');
            first = false;
        }

        sb.append(']');
        return sb.toString();
    }

    private String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}