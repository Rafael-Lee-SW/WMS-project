package com.a508.wms.util.mapper;

import com.a508.wms.domain.Product;
import com.a508.wms.dto.ProductResponseDto;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * Product -> ProductResponseDto
     *
     * @param product
     * @return
     */
    public static ProductResponseDto fromProduct(Product product) {
        return ProductResponseDto.builder()
            .comment(product.getComment())
            .expirationDate(product.getExpirationDate())
            .comment(product.getComment())
            .productDetail(ProductDetailMapper.fromProductDetail(product.getProductDetail()))
            .build();
    }
}
