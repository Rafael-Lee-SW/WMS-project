package com.a508.wms.dto;

import com.a508.wms.domain.Floor;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class FloorDto {

    private Long id;
    private Long locationId;
    private int floorLevel; //층수
    private ExportTypeEnum exportType;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private StatusEnum statusEnum;

    public static FloorDto fromFloor(Floor floor) {
        return FloorDto.builder()
            .id(floor.getId())
            .locationId(floor.getLocation().getId())
            .floorLevel(floor.getFloorLevel())
            .exportType(floor.getExportTypeEnum())
            .createdDate(floor.getCreatedDate())
            .updatedDate(floor.getUpdatedDate())
            .statusEnum(floor.getStatusEnum())
            .build();
    }
}
