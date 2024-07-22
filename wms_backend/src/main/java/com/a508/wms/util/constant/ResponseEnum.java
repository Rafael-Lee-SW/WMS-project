package com.a508.wms.util.constant;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResponseEnum {
    SUCCESS(true, 1000, HttpStatus.OK.value(), "요청에 성공하였습니다."),  //성공 코드

    // Request 오류
    BAD_REQUEST(false, 2000, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 요청입니다."),
    URL_NOT_FOUND(false, 2001, HttpStatus.BAD_REQUEST.value(), "유효하지 않은 URL 입니다."),
    METHOD_NOT_ALLOWED(false, 2002, HttpStatus.METHOD_NOT_ALLOWED.value(), "해당 URL에서는 지원하지 않는 HTTP Method 입니다."),

    // Server, Database 오류
    SERVER_ERROR(false, 3000, HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버에서 오류가 발생하였습니다."),
    DATABASE_ERROR(false, 3001, HttpStatus.INTERNAL_SERVER_ERROR.value(), "데이터베이스에서 오류가 발생하였습니다."),
    BAD_SQL_GRAMMAR(false, 3002, HttpStatus.INTERNAL_SERVER_ERROR.value(), "SQL에 오류가 있습니다."),

    // User 오류
    INVALID_USER_VALUE(false, 5000, HttpStatus.BAD_REQUEST.value(), "회원가입 요청에서 잘못된 값이 존재합니다."),
    DUPLICATE_EMAIL(false, 5001, HttpStatus.BAD_REQUEST.value(), "이미 존재하는 이메일입니다."),
    USER_NOT_FOUND(false, 5002, HttpStatus.BAD_REQUEST.value(), "존재하지 않는 회원입니다."),
    PASSWORD_NO_MATCH(false, 5003, HttpStatus.BAD_REQUEST.value(), "비밀번호가 일치하지 않습니다."),
    USER_DELETED(false, 5004, HttpStatus.BAD_REQUEST.value(), "삭제된 사용자입니다."),
    USER_NOT_LOGGED_IN(false, 5005, HttpStatus.UNAUTHORIZED.value(), "로그인하지 않은 사용자입니다."),
    SAME_AS_OLD_PASSWORD(false, 5006, HttpStatus.BAD_REQUEST.value(), "새 비밀번호는 기존 비밀번호와 달라야 합니다.");

    private final boolean success;  //성공여부
    private final int statusCode;
    private final int httpStatus; //HTTP 상태코드
    private final String message; //메시지

    ResponseEnum(boolean success, int statusCode, int httpStatus, String message) {
        this.success = success;
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.message = message;
    }

}
