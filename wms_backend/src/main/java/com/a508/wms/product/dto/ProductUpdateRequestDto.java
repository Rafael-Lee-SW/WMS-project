package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@ToString
public class ProductUpdateRequestDto {
    private Long productId;
    private Integer floorLevel;
    private String locationName;
    private ProductRequestDto productRequestDto;

}
