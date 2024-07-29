package com.a508.wms.productlocation.dto;

import com.a508.wms.util.constant.ExportTypeEnum;
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
    private ExportTypeEnum exportTypeEnum;

}
