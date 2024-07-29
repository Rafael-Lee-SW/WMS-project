package com.a508.wms.location.dto;

import com.a508.wms.floor.dto.FloorDto;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class LocationDto {

    private Long id;
    private Long warehouseId;
    @Builder.Default
    private ProductStorageTypeEnum productStorageTypeEnum = ProductStorageTypeEnum.상온;
    private String name;
    @Builder.Default
    private int xPosition = -1;
    @Builder.Default
    private int yPosition = -1;
    @Builder.Default
    private int width = -1;
    @Builder.Default
    private int height = -1;
    private List<FloorDto> floorDtos;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    @Builder.Default
    private StatusEnum statusEnum = StatusEnum.ACTIVE;

}
