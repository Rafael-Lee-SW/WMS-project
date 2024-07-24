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
    // 미입력시 -1로 설정(수정시에 필요함)
    @Builder.Default
    private int productQuantity = -1;
    private LocalDateTime expirationDate;
    private String comment;
}
