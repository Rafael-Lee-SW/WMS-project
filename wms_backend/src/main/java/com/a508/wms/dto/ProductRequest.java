package com.a508.wms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductRequest {
    private Long productDetailId;
    private int productQuantity;
    private LocalDateTime expirationDate;
    private String comment;
}
