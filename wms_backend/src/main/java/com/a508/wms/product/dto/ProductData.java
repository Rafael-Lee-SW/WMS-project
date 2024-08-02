package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@Builder
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
