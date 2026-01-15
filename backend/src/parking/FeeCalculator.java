package parking;

public interface FeeCalculator {

    double calculateFee(long hours);


    /** Flat rate per hour */
    static FeeCalculator flatRate(double ratePerHour) {
        return hours -> ratePerHour * hours;
    }

    /** First hour at one rate, subsequent hours at another */
    static FeeCalculator tieredRate(double firstHourRate, double subsequentRate) {
        return hours -> {
            if (hours <= 1) return firstHourRate;
            return firstHourRate + (hours - 1) * subsequentRate;
        };
    }

    /** Maximum daily cap */
    static FeeCalculator withDailyCap(FeeCalculator base, double dailyCap) {
        return hours -> Math.min(base.calculateFee(hours), dailyCap);
    }

    /** Weekend surcharge (multiply by factor) */
    static FeeCalculator withWeekendSurcharge(FeeCalculator base, double surchargeMultiplier) {
        return hours -> {
            java.time.DayOfWeek day = java.time.LocalDate.now().getDayOfWeek();
            boolean isWeekend = (day == java.time.DayOfWeek.SATURDAY || day == java.time.DayOfWeek.SUNDAY);
            double fee = base.calculateFee(hours);
            return isWeekend ? fee * surchargeMultiplier : fee;
        };
    }

    /** Free parking for first N hours */
    static FeeCalculator withFreeHours(FeeCalculator base, int freeHours) {
        return hours -> {
            if (hours <= freeHours) return 0;
            return base.calculateFee(hours - freeHours);
        };
    }
}
