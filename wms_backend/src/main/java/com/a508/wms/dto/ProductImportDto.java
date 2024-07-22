package com.a508.wms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductImportDto {

    private Long businessId;
    private ProductDetailRequestDto productDetail;
    private ProductRequestDto product;
}
