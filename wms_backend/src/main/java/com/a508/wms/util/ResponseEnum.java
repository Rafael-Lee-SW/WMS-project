package com.a508.wms.util;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResponseEnum {
    SUCCESS(true, HttpStatus.OK.value(), "요청에 성공하였습니다.");  //성공 코드

    private final boolean success;  //성공여부
    private final int statusCode; //HTTP 상태코드
    private final String message; //메시지

    ResponseEnum(boolean success, int statusCode, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
    }

}
