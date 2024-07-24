package com.a508.wms.productdetail;

import com.a508.wms.product.ProductMapper;
import org.springframework.stereotype.Component;

@Component
public class ProductDetailMapper {

    /**
     * ProductDetail -> ProductDetailResponseDto
     *
     * @param productDetail
     * @return
     */
    public static ProductDetailResponseDto fromProductDetail(ProductDetail productDetail) {
        return ProductDetailResponseDto.builder()
            .id(productDetail.getId())
            .barcode(productDetail.getBarcode())
            .name(productDetail.getName())
            .size(productDetail.getSize())
            .unit(productDetail.getUnit())
            .originalPrice(productDetail.getOriginalPrice())
            .sellingPrice(productDetail.getSellingPrice())
            .productResponseDtos(productDetail.getProducts().stream()
                .map(ProductMapper::fromProduct)
                .toList())
            .build();
    }
}
