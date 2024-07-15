package com.a508.wms.util;

public enum ProductStorageTypeEnum {
    FROZEN("냉동"),
    LOW_TEMPERATURE("냉장"),
    ROOM_TEMPERATURE("상온");
    private final String value;

    ProductStorageTypeEnum(String value) {
        this.value = value;

    }

    public String getValue() {
        return value;
    }
}
