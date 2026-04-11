package com.ghteacher.recruiting.enums;

public enum SubscriptionTier {
    BASIC,
    STANDARD,
    ENTERPRISE;

    /** Returns amount in Ghana Pesewas */
    public int getAmountInPesewas() {
        return switch (this) {
            case BASIC      -> 20000;
            case STANDARD   -> 50000;
            case ENTERPRISE -> 120000;
        };
    }

    /** Returns human-readable amount in GHS */
    public String getDisplayAmount() {
        return switch (this) {
            case BASIC      -> "GHS 200";
            case STANDARD   -> "GHS 500";
            case ENTERPRISE -> "GHS 1,200";
        };
    }
}
