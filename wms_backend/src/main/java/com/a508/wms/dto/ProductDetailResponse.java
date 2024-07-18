package com.a508.wms.dto;

import com.a508.wms.domain.ProductDetail;
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

    public static ProductDetailResponse fromProductDetail(ProductDetail productDetail) {
        return ProductDetailResponse.builder()
            .barcode(productDetail.getBarcode())
            .name(productDetail.getName())
            .size(productDetail.getSize())
            .unit(productDetail.getUnit())
            .originalPrice(productDetail.getOriginalPrice())
            .sellingPrice(productDetail.getSellingPrice())
            .build();
    }
}
