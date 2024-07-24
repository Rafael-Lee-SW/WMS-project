package com.a508.wms.productdetail.dto;

import com.a508.wms.product.dto.ProductResponseDto;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Builder
@Setter
@ToString
public class ProductDetailResponseDto {

    private Long id;
    private Long businessId;
    private Long productStorageTypeId;
    private Long barcode;
    private String name;
    private Long size;
    private Long unit;
    private int originalPrice;
    private int sellingPrice;
    private List<ProductResponseDto> productResponseDtos;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private StatusEnum statusEnum;
}
