package com.a508.wms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductDetailRequest {
    private int originalPrice;
    private int sellingPrice;
    private Long barcode;
    private Long productStorageTypeId;
    private Long size;
    private Long unit;
    private String name;
    private Long businessId;
}
