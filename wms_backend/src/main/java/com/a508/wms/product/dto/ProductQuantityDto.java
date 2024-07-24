package com.a508.wms.product;

public interface ProductQuantityDto {

    Long getBarcode();

    Integer getPossibleQuantity();

    Integer getMovableQuantity();
}
