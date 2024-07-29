package com.a508.wms.floor.mapper;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorDto;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    /**
     * Floor가 포함하고 있는 location 객체를 제외하고 Convert. 해당 메서드를 호출한 Service Layer에서 location을 직접 설정하기
     *
     * @param floorDto
     * @return Floor
     */
    public static Floor fromDto(FloorDto floorDto) {
        return Floor.builder()
            .id(floorDto.getId())
            .floorLevel(floorDto.getFloorLevel())
            .exportTypeEnum(floorDto.getExportType())
            .build();
    }

    /**
     * Floor 객체를 FloorDto로 변환
     *
     * @param floor
     * @return FloorDto
     */
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
