package com.a508.wms.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductPickingDto {

    private String locationName;
    private int floorLevel;
    private String productName;
    private int amount;
}
