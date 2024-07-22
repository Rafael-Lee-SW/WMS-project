package com.a508.wms.util.constant;

public enum LoginTypeEnum {
    GOOGLE("구글"),
    KAKAO("카카오"),
    NAVER("네이버");

    private final String value;
    LoginTypeEnum(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
}
