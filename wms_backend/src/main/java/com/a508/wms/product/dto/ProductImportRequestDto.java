package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Getter;
import lombok.Builder;
import lombok.ToString;
import java.util.List;
@Getter
@Builder
@ToString
public class ProductImportRequestDto {

    private Long businessId;
    private Long warehouseId;
    private List<ProductData> data;
    @Getter
    @Builder
    @ToString
    public static class ProductData {
        private Long barcode;
        private String expirationDate;
        private String name;
        private int quantity;
        private ProductStorageTypeEnum productStorageTypeEnum;
    }
}
