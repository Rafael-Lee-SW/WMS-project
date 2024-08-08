package com.a508.wms.product.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@ToString
public class ProductUpdateRequestDto {
    Long productId;
    Long barcode;
    Long warehouseId;
    String name;
    Integer quantity;
    String locationName;
    Integer floorLevel;
    LocalDateTime expirationDate;

}
