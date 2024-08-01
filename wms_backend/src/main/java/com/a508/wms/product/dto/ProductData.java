package com.a508.wms.product.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@SuperBuilder
@ToString
@RequiredArgsConstructor
public class ProductData {

    private Long barcode;
    private LocalDateTime expirationDate;
    private String name;
    private int quantity;
    private ProductStorageTypeEnum productStorageTypeEnum;
    private LocalDate date;

}
