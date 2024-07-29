package com.a508.wms.productdetail.dto;

import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
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
    private ProductStorageTypeEnum productStorageTypeEnum;
    private Long barcode;
    private String name;
    private Long size;
    private Long unit;
    private int originalPrice;
    private int sellingPrice;
    // 해당 컬럼이 필요할지에 대한 의논 필요
    //private List<ProductResponseDto> productResponseDtos; 
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private StatusEnum statusEnum;
}
