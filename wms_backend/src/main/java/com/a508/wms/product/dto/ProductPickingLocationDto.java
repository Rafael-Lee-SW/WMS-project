package com.a508.wms.product;

public interface ProductPickingLocationDto {

    String getWarehouseName();

    String getLocationName();

    String getProductName();

    Integer getFloorLevel();

    Long getProductLocationId();

    Integer getProductQuantity();
}
