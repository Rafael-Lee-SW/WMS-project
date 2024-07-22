package com.a508.wms.dto;

import com.a508.wms.domain.Product;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductResponseDto {

    private Long id;
    private int quantity;
    private LocalDateTime expirationDate;
    private String comment;
    private ProductDetailResponseDto productDetail;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private StatusEnum statusEnum;

    public static ProductResponseDto fromProduct(Product product) {
        return ProductResponseDto.builder()
            .comment(product.getComment())
            .expirationDate(product.getExpirationDate())
            .comment(product.getComment())
            .productDetail(ProductDetailResponseDto.fromProductDetail(product.getProductDetail()))
            .build();
    }
}
