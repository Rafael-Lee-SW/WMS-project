package com.a508.wms.dto;

import com.a508.wms.domain.ProductDetail;
import com.a508.wms.util.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductDetailResponseDto {

    private Long id;
    private Long businessId;
    private Long productStorageTypeId;
    private Long barcode;
    private String name;
    private Long size;
    private Long unit;
    private int originalPrice;
    private int sellingPrice;
    private List<ProductResponseDto> productResponseDtos;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private StatusEnum statusEnum;

    public static ProductDetailResponseDto fromProductDetail(ProductDetail productDetail) {
        return ProductDetailResponseDto.builder()
            .barcode(productDetail.getBarcode())
            .name(productDetail.getName())
            .size(productDetail.getSize())
            .unit(productDetail.getUnit())
            .originalPrice(productDetail.getOriginalPrice())
            .sellingPrice(productDetail.getSellingPrice())
            .productResponseDtos(productDetail.getProducts().stream()
                .map(ProductResponseDto::fromProduct)
                .toList())
            .build();
    }
}
