package com.a508.wms.dto;

import com.a508.wms.domain.Product;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponse {
    private int quantity;
    private LocalDateTime expirationDate;
    private String comment;
    private ProductDetailResponse productDetail;

    public static ProductResponse fromProduct(Product product) {
        return ProductResponse.builder()
            .comment(product.getComment())
            .expirationDate(product.getExpirationDate())
            .comment(product.getComment())
            .productDetail(ProductDetailResponse.fromProductDetail(product.getProductDetail()))
            .build();
    }
}
