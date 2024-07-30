package com.a508.wms.product.mapper;

import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.productdetail.mapper.ProductDetailMapper;
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
            .id(product.getId())
            .expirationDate(product.getExpirationDate())
            .quantity(product.getProductQuantity())
            .createdDate(product.getCreatedDate())
            .updateDate(product.getUpdatedDate())
            .statusEnum(product.getStatusEnum())
            .productDetail(ProductDetailMapper.fromProductDetail(product.getProductDetail()))
            .build();
    }
}
