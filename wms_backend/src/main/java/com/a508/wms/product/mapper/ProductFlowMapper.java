package com.a508.wms.product.mapper;

import com.a508.wms.business.domain.Business;
import com.a508.wms.product.domain.ProductFlow;
import com.a508.wms.product.dto.*;
import com.a508.wms.util.constant.ProductFlowTypeEnum;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import static com.a508.wms.util.constant.ProductConstant.*;

@Component
public class ProductFlowMapper {
     public static ProductFlow fromExportProductResponseDto(ExportResponseDto exportResponseDto, Business business) {
         return ProductFlow.builder()
                 .business(business)
                 .warehouseId(exportResponseDto.getWarehouseId())
                 .barcode(exportResponseDto.getBarcode())
                 .currentLocationName(exportResponseDto.getLocationName())
                 .currentFloorLevel(exportResponseDto.getFloorLevel())
                 .productName(exportResponseDto.getProductName())
                 .quantity(exportResponseDto.getQuantity())
                 .trackingNumber(exportResponseDto.getTrackingNumber())
                 .expirationDate(exportResponseDto.getExpirationDate())
                 .date(exportResponseDto.getDate().atStartOfDay())
                 .productStorageType(exportResponseDto.getProductStorageType())
                 .warehouseName(exportResponseDto.getWarehouseName())
                 .productFlowType(ProductFlowTypeEnum.EXPORT)
                 .build();
     }
     public static ProductFlow fromImportResponseDto(ProductData request, Business business) {
         return ProductFlow.builder()
                 .business(business)
                 .warehouseId(request.getWarehouseId())
                 .barcode(request.getBarcode())
                 .currentLocationName(DEFAULT_LOCATION_NAME)
                 .currentFloorLevel(DEFAULT_FLOOR_LEVEL)
                 .productName(request.getName())
                 .quantity(request.getQuantity())
                 .trackingNumber(DEFAULT_TRACKING_NUMBER)
                 .expirationDate(request.getExpirationDate())
                 .date(LocalDateTime.now())
                 .productStorageType(request.getProductStorageType())
                 .warehouseName(request.getWarehouseName())
                 .productFlowType(ProductFlowTypeEnum.IMPORT)
                 .build();
     }
     public static ProductFlow fromProductFlowRequestDto(ProductFlowRequestDto productFlowRequestDto, Business business) {
         return ProductFlow.builder()
                 .business(business)
                 .warehouseId(productFlowRequestDto.getWarehouseId())
                 .barcode(productFlowRequestDto.getBarcode())
                 .currentLocationName(productFlowRequestDto.getLocationName())
                 .currentFloorLevel(productFlowRequestDto.getFloorLevel())
                 .productName(productFlowRequestDto.getProductName())
                 .quantity(productFlowRequestDto.getQuantity())
                 .trackingNumber(DEFAULT_TRACKING_NUMBER)
                 .expirationDate(productFlowRequestDto.getExpirationDate())
                 .date(productFlowRequestDto.getDate())
                 .productStorageType(productFlowRequestDto.getProductStorageType())
                 .warehouseName(productFlowRequestDto.getWarehouseName())
                 .productFlowType(ProductFlowTypeEnum.FLOW)
                 .build();
     }
public static ProductFlow fromProductMoveResponseDto(ProductMoveResponseDto productMoveResponseDto,
                                                     Business business) {
    return ProductFlow.builder()
            .business(business)
            .warehouseId(productMoveResponseDto.getWarehouseId())
            .barcode(productMoveResponseDto.getBarcode())
            .previousLocationName(productMoveResponseDto.getPreviousLocationName())
            .previousFloorLevel(productMoveResponseDto.getPreviousFloorLevel())
            .currentLocationName(productMoveResponseDto.getCurrentLocationName())
            .currentFloorLevel(productMoveResponseDto.getCurrentFloorLevel())
            .productName(productMoveResponseDto.getName())
            .quantity(productMoveResponseDto.getQuantity())
            .trackingNumber(DEFAULT_TRACKING_NUMBER)
            .expirationDate(productMoveResponseDto.getExpirationDate())
            .date(productMoveResponseDto.getDate())
            .productStorageType(productMoveResponseDto.getProductStorageType())
            .warehouseName(productMoveResponseDto.getWarehouseName())
            .productFlowType(ProductFlowTypeEnum.FLOW)
            .build();
}
}