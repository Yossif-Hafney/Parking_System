package vehicles;

import parking.FeeCalculator;

public class Car extends Vehicle {

    private static final double DEFAULT_RATE = 10.0;
    private static final double DAILY_CAP = 50.0;

    public Car(String plateNumber, String color, String brand) {
        this(plateNumber, color, brand, FeeCalculator.withDailyCap(
            FeeCalculator.flatRate(DEFAULT_RATE), DAILY_CAP));
    }

    public Car(String plateNumber, String color, String brand, FeeCalculator feeCalculator) {
        super(plateNumber, color, brand, feeCalculator);
    }
}