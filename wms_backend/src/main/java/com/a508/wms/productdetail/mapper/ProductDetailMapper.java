package com.a508.wms.productdetail.mapper;

import com.a508.wms.productdetail.domain.ProductDetail;
import com.a508.wms.productdetail.dto.ProductDetailRequestDto;
import com.a508.wms.productdetail.dto.ProductDetailResponseDto;
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
            .productStorageTypeEnum(productDetail.getProductStorageTypeEnum())
            .originalPrice(productDetail.getOriginalPrice())
            .sellingPrice(productDetail.getSellingPrice())
            .createdDate(productDetail.getCreatedDate())
            .updateDate(productDetail.getUpdatedDate())
            .statusEnum(productDetail.getStatusEnum())
            .build();
    }

    /**
     * requestDto -> entity로 변환하는 기능
     *
     * @param productDetailRequestDto
     * @return
     */
    public static ProductDetail fromDto(ProductDetailRequestDto productDetailRequestDto) {
        return ProductDetail.builder()
            .productStorageTypeEnum(productDetailRequestDto.getProductStorageTypeEnum())
            .barcode(productDetailRequestDto.getBarcode())
            .name(productDetailRequestDto.getName())
            .size(productDetailRequestDto.getSize())
            .unit(productDetailRequestDto.getUnit())
            .originalPrice(productDetailRequestDto.getOriginalPrice())
            .sellingPrice(productDetailRequestDto.getSellingPrice())
            .build();
    }
}
