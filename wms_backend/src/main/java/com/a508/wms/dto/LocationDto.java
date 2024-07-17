package com.a508.wms.dto;

import com.a508.wms.domain.Location;
import com.a508.wms.util.StatusEnum;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LocationDto {

    private Long id;
    private Long warehouseId;
    private Long productStorageTypeId;
    private String locationName;
    private int xPosition;
    private int yPosition;
    private int width;
    private int height;
    private List<FloorDto> floorDtos;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum status;

    public static LocationDto fromLocation(Location location) {
        return LocationDto.builder()
            .id(location.getId())
            .warehouseId(location.getWarehouse().getId())
            .productStorageTypeId(location.getProductStorageType().getId())
            .locationName(location.getName())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .width(location.getWidth())
            .height(location.getHeight())
            .floorDtos(location.getFloors().stream()
                .map(FloorDto::fromFloor)
                .collect(Collectors.toList()))
            .createdDate(location.getCreatedDate())
            .updatedDate(location.getUpdatedDate())
            .status(location.getStatusEnum())
            .build();
    }

}
