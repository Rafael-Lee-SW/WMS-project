package com.a508.wms.product.mapper;

import com.a508.wms.product.domain.Import;
import com.a508.wms.product.dto.ProductImportDto;
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
                .build();
    }

}
