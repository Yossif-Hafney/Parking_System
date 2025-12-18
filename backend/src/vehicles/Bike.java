package vehicles;

import parking.FeeCalculator;

public class Bike extends Vehicle {

    private static final double DEFAULT_RATE = 5.0;
    private static final int FREE_HOURS = 1;

    public Bike(String plateNumber, String color, String brand) {
        this(plateNumber, color, brand, FeeCalculator.withFreeHours(
            FeeCalculator.flatRate(DEFAULT_RATE), FREE_HOURS));
    }

    public Bike(String plateNumber, String color, String brand, FeeCalculator feeCalculator) {
        super(plateNumber, color, brand, feeCalculator);
    }
}