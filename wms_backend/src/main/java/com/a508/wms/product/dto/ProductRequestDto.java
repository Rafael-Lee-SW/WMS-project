package com.a508.wms.product.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
public class ProductRequestDto {

    private Long productDetailId;
    // 미입력시 -1로 설정(수정시에 필요함)
    @Builder.Default
    private int quantity = -1;
    private LocalDateTime expirationDate;
    private String comment;
}
