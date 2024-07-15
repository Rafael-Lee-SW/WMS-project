public enum ProductStorageType {
    FROZEN("냉동"),
    LOW_TEMPERATURE("냉장"),
    ROOM_TEMPERATURE("상온");
    private final String value;

    ProductStorageType(String value) {
        this.value = value;

    }

    public String getValue() {
        return value;
    }
}
