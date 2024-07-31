package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@ToString
public class ProductData {

    private Long barcode;
    private LocalDateTime expirationDate;
    private String name;
    private int quantity;
    private ProductStorageTypeEnum productStorageTypeEnum;
    private LocalDate date;

}
