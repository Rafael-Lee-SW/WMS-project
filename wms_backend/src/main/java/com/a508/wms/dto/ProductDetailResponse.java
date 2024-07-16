package com.a508.wms.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductDetailResponse {
    private long barcode;
    private String name;
    private long size;
    private long unit;
    private int originalPrice;
    private int sellingPrice;
}
