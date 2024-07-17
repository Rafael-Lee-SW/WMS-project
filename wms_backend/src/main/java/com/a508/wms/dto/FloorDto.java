package com.a508.wms.dto;

import com.a508.wms.domain.Floor;
import com.a508.wms.util.ExportTypeEnum;
import com.a508.wms.util.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FloorDto {
    private Long id;
    private Long locationId;
    private int floorLevel; //층수
    private ExportTypeEnum exportType;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum status;

    public static FloorDto fromFloor(Floor floor) {
        return FloorDto.builder()
            .id(floor.getId())
            .locationId(floor.getLocation().getId())
            .floorLevel(floor.getFloorLevel())
            .exportType(floor.getExportTypeEnum())
            .createdDate(floor.getCreatedDate())
            .updatedDate(floor.getUpdatedDate())
            .status(floor.getStatusEnum())
            .build();
    }
}
