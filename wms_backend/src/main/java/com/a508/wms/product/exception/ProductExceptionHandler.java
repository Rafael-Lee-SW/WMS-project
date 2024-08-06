package com.a508.wms.product.exception;

import com.a508.wms.util.BaseExceptionResponse;
import com.a508.wms.util.constant.ResponseEnum;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class ProductExceptionHandler {
    @ExceptionHandler(ProductInvalidRequestException.class)
    public BaseExceptionResponse inValidRequestError(ProductInvalidRequestException e){
        ResponseEnum responseEnum=e.getResponseEnum();
        String exceptionMessage=e.getExceptionMessage();
        return new ProductException(responseEnum.isSuccess(),responseEnum.getStatusCode(),responseEnum.getHttpStatus(),responseEnum.getMessage()+exceptionMessage);
    }

    @ExceptionHandler(ProductInvalidDataException.class)
    public BaseExceptionResponse inValidDataError(ProductInvalidDataException e){
        ResponseEnum responseEnum=e.getResponseEnum();
        String exceptionMessage=e.getExceptionMessage();
        return new ProductException(responseEnum.isSuccess(),responseEnum.getStatusCode(),responseEnum.getHttpStatus(),responseEnum.getMessage()+exceptionMessage);
    }

    @ExceptionHandler(ProductExportException.class)
    public BaseExceptionResponse exportError(ProductExportException e){
        ResponseEnum responseEnum=e.getResponseEnum();
        String exceptionMessage=e.getExceptionMessage();
        return new ProductException(responseEnum.isSuccess(),responseEnum.getStatusCode(),responseEnum.getHttpStatus(),responseEnum.getMessage()+exceptionMessage);
    }
}
