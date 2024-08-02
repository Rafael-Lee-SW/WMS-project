package com.a508.wms.product.mapper;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductData;
import com.a508.wms.product.dto.ProductMainResponseDto;
import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.productdetail.domain.ProductDetail;
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
    public static ProductMainResponseDto fromProduct(Product product) {
        return ProductMainResponseDto.builder()
            .id(product.getId())
            .expirationDate(product.getExpirationDate())
            .quantity(product.getQuantity())
            .createdDate(product.getCreatedDate())
            .updatedDate(product.getUpdatedDate())
            .statusEnum(product.getStatusEnum())
            .productDetail(ProductDetailMapper.fromProductDetail(product.getProductDetail()))
            .build();
    }

    public static ProductResponseDto.DetailedResponse toProductResponseDetailedResponseDto(
        Product product) {
        ProductDetail productDetail = product.getProductDetail();

        return ProductResponseDto.DetailedResponse.builder()
            .info(toProductResponseInfoDto(product))
            .name(productDetail.getName())
            .barcode(productDetail.getBarcode())
            .build();
    }

    public static ProductResponseDto.Info toProductResponseInfoDto(Product product) {
        return ProductResponseDto.Info.builder()
            .id(product.getId())
            .expirationDate(product.getExpirationDate())
            .quantity(product.getQuantity())
            .floorLevel(product.getFloor().getFloorLevel())
            .locationName(product.getFloor().getLocation().getName())
            .build();
    }

    public static Product fromProductData(ProductData productImportRequestData,
        ProductDetail productDetail,
        Floor floor) {
        return Product.builder()
            .productDetail(productDetail)
            .floor(floor)
            .quantity(productImportRequestData.getQuantity())
            .expirationDate(productImportRequestData.getExpirationDate())
            .build();
    }
}
