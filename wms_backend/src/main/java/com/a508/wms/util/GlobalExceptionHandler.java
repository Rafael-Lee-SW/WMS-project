package com.a508.wms.util;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public BaseExceptionResponse globalException(GlobalException e) {
        return new BaseExceptionResponse(e.getResponseEnum(), e.getExceptionMessage());
    }
}
