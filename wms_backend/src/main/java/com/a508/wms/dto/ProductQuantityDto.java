package com.a508.wms.dto;

public interface ProductQuantityDto {

    Long getBarcode();

    Integer getPossibleQuantity();

    Integer getMovableQuantity();
}
