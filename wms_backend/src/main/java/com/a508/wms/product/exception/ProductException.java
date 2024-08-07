package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductException extends Throwable {

    private static final String PACKAGE_NAME = "[PRODUCTS] ";

    private final ResponseEnum responseEnum;
    private final String exceptionMessage;

    public ProductException(ResponseEnum responseEnum, String exceptionMessage) {
        this.responseEnum = responseEnum;
        this.exceptionMessage = PACKAGE_NAME + responseEnum.getMessage() + exceptionMessage;
    }
}
