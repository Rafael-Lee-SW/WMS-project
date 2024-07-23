package com.a508.wms.util.mapper;

import com.a508.wms.domain.ProductLocation;
import com.a508.wms.dto.ProductLocationRequestDto;
import com.a508.wms.dto.ProductLocationResponseDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductLocationMapper {
    public static ProductLocationResponseDto fromProductLocation(ProductLocation productLocation) {
        return ProductLocationResponseDto.builder()
                .id(productLocation.getId())
                .productId(productLocation.getProduct().getId())
                .floorId(productLocation.getFloor().getId())
                .productQuantity(productLocation.getProduct_quantity())
                .exportTypeEnum(productLocation.getExportTypeEnum())
                .statusEnum(productLocation.getStatusEnum())
                .createdDate(productLocation.getCreatedDate())
                .updatedDate(productLocation.getUpdatedDate())
                .build();
    }
    /*public static ProductLocation fromDto(ProductLocationRequestDto productLocationRequestDto) {
        return ProductLocation.builder()
                .id(productLocationRequestDto.getId())
    }*/
    public static List<ProductLocationResponseDto> fromProductLocations(List<ProductLocation> productLocations) {
        List<ProductLocationResponseDto> productLocationResponseDtos = new ArrayList<>();
        for (ProductLocation productLocation : productLocations) {
            productLocationResponseDtos.add(fromProductLocation(productLocation));
        }
        return productLocationResponseDtos;
    }
}
