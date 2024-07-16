package com.a508.wms.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductInfos {
    private int quantity;
    private LocalDateTime expirationDate;
    private String comment;
    private ProductDetailResponse productDetail;
}
