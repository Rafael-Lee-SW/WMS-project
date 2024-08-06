package com.a508.wms.product.exception;

import com.a508.wms.util.BaseExceptionResponse;
import org.springframework.security.core.parameters.P;

public class ProductException extends BaseExceptionResponse {
    private static final String PACKAGE_NAME="[PRODUCTS] ";

    public ProductException(boolean success, int statusCode, int httpStatus, String message) {
        super(success, statusCode, httpStatus, PACKAGE_NAME+message);
    }
}
