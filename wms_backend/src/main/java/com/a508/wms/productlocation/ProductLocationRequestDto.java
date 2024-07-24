package com.a508.wms.product;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductLocationRequestDto {
    private long id;
    private long barcode;
    private int productQuantity;
    private int floorLevel;
    private String locationName;

}
