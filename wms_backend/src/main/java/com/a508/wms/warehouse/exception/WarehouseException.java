package com.a508.wms.warehouse.exception;

import com.a508.wms.util.BaseExceptionResponse;
import com.a508.wms.util.constant.ResponseEnum;

public class WarehouseException extends BaseExceptionResponse {
    String packageName = "[Warehouse] ";

    public WarehouseException(ResponseEnum responseEnum) {
        super(responseEnum.isSuccess(),
                responseEnum.getStatusCode(),
                responseEnum.getHttpStatus(),
                responseEnum.getMessage());
    }

    public WarehouseException(boolean success, int statusCode, int httpStatus, String message) {
        super(success, statusCode, httpStatus, message);
    }

    public static class WarehouseNotFoundException extends WarehouseException {
        public WarehouseNotFoundException(ResponseEnum responseEnum) {
            super(responseEnum);
        }
    }

    public static class BusinessNotFoundException extends WarehouseException {
        public BusinessNotFoundException(String message, ResponseEnum responseEnum) {
            super(responseEnum.isSuccess(),
                    responseEnum.getStatusCode(),
                    responseEnum.getHttpStatus(),
                    responseEnum.getMessage() + message);
        }
    }

    public static class InvalidInputException extends WarehouseException {
        public InvalidInputException(String message, ResponseEnum responseEnum) {
            super(responseEnum.isSuccess(),
                    responseEnum.getStatusCode(),
                    responseEnum.getHttpStatus(),
                    responseEnum.getMessage() + message);
        }
    }
}
