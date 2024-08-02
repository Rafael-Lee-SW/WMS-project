package com.a508.wms.product.dto;

import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductImportDto {

    private Long businessId;
    private Long warehouseId;
    private ProductDetailRequestDto productDetail;
    private ProductRequestDto product;
}
