package com.a508.wms.product.exception;

import com.a508.wms.util.constant.ResponseEnum;
import lombok.Getter;

@Getter
public class ProductInvalidDataException extends IllegalArgumentException {
    private static final String EXCEPTION_MESSAGE_FORMAT=" 잘못된 데이터 = %s : %s ";
    private static final ResponseEnum responseEnum=ResponseEnum.SERVER_ERROR;
    private final String exceptionMessage;

    public ProductInvalidDataException(String invalidRequestName,Object value){
        exceptionMessage=String.format(EXCEPTION_MESSAGE_FORMAT,invalidRequestName,String.valueOf(value));
    }

    public ResponseEnum getResponseEnum(){
        return responseEnum;
    }
}
