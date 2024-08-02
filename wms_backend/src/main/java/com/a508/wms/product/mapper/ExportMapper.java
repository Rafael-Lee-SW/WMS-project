package com.a508.wms.product.mapper;

import com.a508.wms.product.domain.Export;
import com.a508.wms.product.dto.ExportResponseDto;
import java.time.LocalDate;

public class ExportMapper {

    public static Export fromExportResponseDto(ExportResponseDto exportResponseDto) {
        return Export.builder()
            .trackingNumber(exportResponseDto.getTrackingNumber())
            .barcode(exportResponseDto.getBarcode())
            .locationName(exportResponseDto.getLocationName())
            .productName(exportResponseDto.getProductName())
            .quantity(exportResponseDto.getQuantity())
            .floorLevel(exportResponseDto.getFloorLevel())
            .date(exportResponseDto.getDate().atStartOfDay())
            .expirationDate(exportResponseDto.getExpirationDate())
            .productStorageType(exportResponseDto.getProductStorageType())
            .warehouseId(exportResponseDto.getWarehouseId())
            .warehouseName(exportResponseDto.getWarehouseName())
            .build();
    }

    public static ExportResponseDto toExportResponseDto(Export export) {
        return ExportResponseDto.builder()
            .trackingNumber(export.getTrackingNumber())
            .barcode(export.getBarcode())
            .locationName(export.getLocationName())
            .productName(export.getProductName())
            .quantity(export.getQuantity())
            .floorLevel(export.getFloorLevel())
            .date(LocalDate.from(export.getDate()))
            .expirationDate(export.getExpirationDate())
            .productStorageType(export.getProductStorageType())
            .warehouseId(export.getWarehouseId())
            .warehouseName(export.getWarehouseName())
            .build();
    }
}
