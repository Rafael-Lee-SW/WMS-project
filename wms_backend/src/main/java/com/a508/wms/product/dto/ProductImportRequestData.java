package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@ToString
@RequiredArgsConstructor
public class ProductImportRequestData {

    private Long barcode;
    private LocalDateTime expiry;
    private String name;
    private int quantity;
    private ProductStorageTypeEnum productStorageTypeEnum;
    private LocalDate date;

}
