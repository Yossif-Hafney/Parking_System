package vehicles;

import parking.FeeCalculator;

public abstract class Vehicle {

    private final String plateNumber;
    private final String color;
    private final String brand;
    private final FeeCalculator feeCalculator;

    public Vehicle(String plateNumber, String color, String brand, FeeCalculator feeCalculator) {
        this.plateNumber = plateNumber;
        this.color = color;
        this.brand = brand;
        this.feeCalculator = feeCalculator;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public String getColor() {
        return color;
    }

    public String getBrand() {
        return brand;
    }

    public FeeCalculator getFeeCalculator() {
        return feeCalculator;
    }

    public double calculateFee(long hours) {
        return feeCalculator.calculateFee(hours);
    }
}