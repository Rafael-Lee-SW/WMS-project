package com.a508.wms.product.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductImportRequestDto {

    private Long businessId;
    private Long warehouseId;
    private List<ProductImportRequestData> data;

}
