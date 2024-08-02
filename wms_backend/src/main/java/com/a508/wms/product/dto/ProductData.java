package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@SuperBuilder
@ToString
@RequiredArgsConstructor
public class ProductData {

    private String name;
    private Long barcode;
    private int quantity;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;
    private String warehouseName;
    private Long warehouseId;

}
