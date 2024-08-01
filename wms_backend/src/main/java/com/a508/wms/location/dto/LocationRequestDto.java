package com.a508.wms.location.dto;

import com.a508.wms.floor.dto.FloorRequestDto;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class LocationRequestDto {

    private Long warehouseId;
    private String name;
    @Builder.Default
    private ProductStorageTypeEnum productStorageType = ProductStorageTypeEnum.상온;
    @Builder.Default
    private int rotation = 0;
    @Builder.Default
    private int xPosition = -1;
    @Builder.Default
    private int yPosition = -1;
    @Builder.Default
    private int xSize = -1;
    @Builder.Default
    private int ySize = -1;
    @Builder.Default
    private int zSize = -1;
    private List<FloorRequestDto> floorRequests;
}
