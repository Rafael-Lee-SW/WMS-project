package com.a508.wms.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProductQuantityDto {

    private Long barcode;
    private int possibleQuantity = 0;
    private int movableQuantity = 0;
}
