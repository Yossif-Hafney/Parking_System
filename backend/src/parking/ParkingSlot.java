package parking;

import vehicles.Vehicle;

public class ParkingSlot {

    private static final long MILLIS_PER_HOUR = 1000L * 60 * 60;

    private final int id;
    private boolean available = true;
    private Vehicle vehicle;
    private long startTime;

    public ParkingSlot(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public synchronized boolean isAvailable() {
        return available;
    }

    public synchronized Vehicle getVehicle() {
        return vehicle;
    }

    public synchronized long getStartTime() {
        return startTime;
    }

    public synchronized void parkVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
        this.available = false;
        this.startTime = System.currentTimeMillis();
    }

    public synchronized double releaseVehicle() {
        if (available || vehicle == null) {
            return 0;
        }

        long duration = System.currentTimeMillis() - startTime;
        long hours = Math.max(1, duration / MILLIS_PER_HOUR);
        double fee = vehicle.calculateFee(hours);

        this.vehicle = null;
        this.available = true;
        this.startTime = 0;

        return fee;
    }
}

