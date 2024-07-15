package com.a508.wms.util;

import lombok.Getter;

@Getter
public enum ProductStorageTypeEnum {
    FROZEN("냉동"),
    LOW_TEMPERATURE("냉장"),
    ROOM_TEMPERATURE("상온");
    private final String value;

    ProductStorageTypeEnum(String value) {
        this.value = value;

    }

}
