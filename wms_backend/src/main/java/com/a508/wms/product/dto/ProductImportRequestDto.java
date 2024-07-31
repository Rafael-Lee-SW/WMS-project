package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class ProductImportRequestDto {

    private Long businessId;
    private Long warehouseId;
    private List<ProductData> data;

}
