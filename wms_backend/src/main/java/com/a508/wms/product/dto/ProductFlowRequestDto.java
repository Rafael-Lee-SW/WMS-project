package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductFlowTypeEnum;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ProductFlowRequestDto {
    private String productId;
    private Long warehouseId;
    private Long barcode;
    private String locationName;
    private Integer floorLevel;
    private String productName;
    private Integer quantity;
    private LocalDateTime expirationDate;
    private LocalDateTime date;
    private ProductStorageTypeEnum productStorageType;
    private String warehouseName;
    private ProductFlowTypeEnum productFlowType;
}
