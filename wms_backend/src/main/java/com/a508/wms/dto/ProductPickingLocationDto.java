package com.a508.wms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductPickingLocationDto {

    private String warehouseName;
    private String locationName;
    private String productName;
    private int floorLevel;
    private Long productLocationId;
    private int productQuantity;
}
