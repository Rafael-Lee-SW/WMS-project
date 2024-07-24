package com.a508.wms.product;

import com.a508.wms.productdetail.ProductDetailRequestDto;
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
