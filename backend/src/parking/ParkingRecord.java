package parking;

public class ParkingRecord {

    private final int slotId;
    private final String plate;
    private final long startTime;
    private final long endTime;
    private final double fee;

    public ParkingRecord(int slotId, String plate, long startTime, long endTime, double fee) {
        this.slotId = slotId;
        this.plate = plate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.fee = fee;
    }

    public int getSlotId() {
        return slotId;
    }

    public String getPlate() {
        return plate;
    }

    public long getStartTime() {
        return startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public double getFee() {
        return fee;
    }
}