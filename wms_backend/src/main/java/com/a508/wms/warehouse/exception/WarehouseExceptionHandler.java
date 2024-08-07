package com.a508.wms.warehouse.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class WarehouseExceptionHandler {

//    @ExceptionHandler(WarehouseException.WarehouseNotFoundException.class)
//    public BaseExceptionResponse warehouseNotFoundExceptionHandler(WarehouseException.WarehouseNotFoundException e) {
//        return new BaseExceptionResponse(e.isSuccess(),
//                e.getStatusCode(),
//                e.getHttpStatus(),
//                e.packageName + e.getMessage());
//    }
//
//    @ExceptionHandler(WarehouseException.BusinessNotFoundException.class)
//    public BaseExceptionResponse businessNotFoundExceptionHandler(WarehouseException.BusinessNotFoundException e) {
//        return new BaseExceptionResponse(e.isSuccess(),
//                e.getStatusCode(),
//                e.getHttpStatus(),
//                e.packageName + e.getMessage());
//    }
//
//    @ExceptionHandler(WarehouseException.InvalidInputException.class)
//    public BaseExceptionResponse invalidInputExceptionHandler(WarehouseException.InvalidInputException e) {
//        return new BaseExceptionResponse(e.isSuccess(),
//                e.getStatusCode(),
//                e.getHttpStatus(),
//                e.packageName + e.getMessage());
//    }
}
