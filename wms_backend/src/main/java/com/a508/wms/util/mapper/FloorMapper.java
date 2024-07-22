package com.a508.wms.util.mapper;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Location;
import com.a508.wms.dto.FloorDto;
import org.springframework.stereotype.Component;

@Component
public class FloorMapper {

    public static Floor fromFloor(FloorDto floorDto, Location location) {
        Floor floor = Floor.builder()
            .id(floorDto.getId())
            .location(location)
            .floorLevel(floorDto.getFloorLevel())
            .exportTypeEnum(floorDto.getExportType())
            .build();
        return floor;
    }
}
