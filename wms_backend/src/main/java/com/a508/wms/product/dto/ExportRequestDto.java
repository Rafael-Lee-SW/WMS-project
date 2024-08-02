package com.a508.wms.product.dto;


import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ExportRequestDto {

    private Long businessId;
    private Long trackingNumber;
    private Long barcode;
    private int quantity;
    private LocalDateTime date;
}
