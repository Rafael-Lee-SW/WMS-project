package com.a508.wms.product.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductRequestDto {

    private Long productDetailId;
    private int quantity;
    private LocalDateTime expirationDate;
    private String comment;
}
