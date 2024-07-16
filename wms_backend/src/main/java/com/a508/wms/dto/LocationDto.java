package com.a508.wms.dto;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Location;
import com.a508.wms.util.StatusEnum;
import java.sql.Timestamp;
import java.util.List;
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
    private List<Floor> floors;
    private Timestamp createdDate;
    private Timestamp updatedDate;
    private StatusEnum status;

    public static LocationDto fromEntity(Location location) {
        return LocationDto.builder()
            .id(location.getId())
            .warehouseId(location.getWarehouse().getId())
            .productStorageTypeId(location.getProductStorageType().getId())
            .locationName(location.getName())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .width(location.getWidth())
            .height(location.getHeight())
            .status(location.getStatusEnum())
            .createdDate(Timestamp.valueOf(location.getCreatedDate()))
            .updatedDate(Timestamp.valueOf(location.getUpdatedDate()))
            .build();
    }

}
