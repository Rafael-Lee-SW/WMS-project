package com.a508.wms.productlocation.dto;

import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductLocationResponseDto {
    private long id;
    private long floorId;
    private long productId;
    private int productQuantity;
    private ExportTypeEnum exportTypeEnum;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;

}
