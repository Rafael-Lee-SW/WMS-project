package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ProductPickingDto {

    private String locationName;
    private int floorLevel;
    private String productName;
    private int amount;
}
