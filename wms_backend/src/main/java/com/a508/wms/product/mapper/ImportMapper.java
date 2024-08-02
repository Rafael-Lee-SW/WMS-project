package com.a508.wms.product.mapper;

import com.a508.wms.product.domain.Import;
import com.a508.wms.product.domain.Product;
import com.a508.wms.product.dto.ProductImportDto;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class ImportMapper {

    public static Import fromDto(ProductImportDto productImportDto) {
        return Import.builder()
            .warehouseId(productImportDto.getWarehouseId())
            .barcode(productImportDto.getProductDetail().getBarcode())
            .expirationDate(productImportDto.getProduct().getExpirationDate())
            .name(productImportDto.getProductDetail().getName())
            .quantity(productImportDto.getProduct().getQuantity())
            .productStorageType(productImportDto.getProductDetail().getProductStorageType())
            .build();
    }

    public static Import fromProduct(Product product, LocalDateTime date) {
        return Import.builder()
            .business(product.getProductDetail().getBusiness())
            .warehouseId(product.getFloor().getLocation().getWarehouse().getId())
            .barcode(product.getProductDetail().getBarcode())
            .expirationDate(product.getExpirationDate())
            .date(date)
            .name(product.getProductDetail().getName())
            .quantity(product.getQuantity())
            .build();
    }

}
