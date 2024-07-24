package com.a508.wms.dto;

public interface ProductPickingLocationDto {

    String getWarehouseName();

    String getLocationName();

    String getProductName();

    Integer getFloorLevel();

    Long getProductLocationId();

    Integer getProductQuantity();
}
