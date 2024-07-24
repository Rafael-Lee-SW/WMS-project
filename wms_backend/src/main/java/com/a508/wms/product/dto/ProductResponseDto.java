package com.a508.wms.product;

import com.a508.wms.productdetail.ProductDetailResponseDto;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ProductResponseDto {

    private Long id;
    private int quantity;
    private LocalDateTime expirationDate;
    private String comment;
    private ProductDetailResponseDto productDetail;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private StatusEnum statusEnum;
}
