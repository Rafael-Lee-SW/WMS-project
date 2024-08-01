package com.a508.wms.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class ProductExportData {
    private String trackingNumber;
    private Long barcode;
    private String locationName;
    private String productName;
    private int quantity;
    private int floorLevel;
    private LocalDate date;
}
