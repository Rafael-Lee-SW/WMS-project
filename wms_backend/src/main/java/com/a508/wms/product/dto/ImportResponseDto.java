package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class ImportResponseDto {
    private String name;
    private Long barcode;
    private int quantity;
    private LocalDateTime expirationDate;
    private ProductStorageTypeEnum productStorageType;
    private String warehouseName;
    private Long warehouseId;
    private LocalDateTime date;

}
