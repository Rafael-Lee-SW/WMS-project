package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;

public interface ProductPickingLocationDto {

    String getWarehouseName();

    String getLocationName();

    String getProductName();

    Integer getFloorLevel();

    Long getProductId();

    Integer getQuantity();

    Long getWarehouseId();

    ProductStorageTypeEnum getProductStorageType();
}
