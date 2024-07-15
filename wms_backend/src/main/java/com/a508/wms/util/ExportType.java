package com.a508.wms.util;

public enum ExportType {
    STORE("매장"),
    DISPLAY("전시"),
    KEEP("보관"),
    IMPORT("입고");

    private final String value;

    ExportType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

}
