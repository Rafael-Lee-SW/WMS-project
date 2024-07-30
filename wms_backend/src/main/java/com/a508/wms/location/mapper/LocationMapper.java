package com.a508.wms.location.mapper;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.mapper.FloorMapper;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationDto;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class LocationMapper {

    /**
     * from Location -> to LocationDto
     *
     * @param location
     * @return LocationDto
     */
    public static LocationDto fromLocation(Location location) {
        return LocationDto.builder()
            .id(location.getId())
            .warehouseId(location.getWarehouse().getId())
            .productStorageTypeEnum(location.getProductStorageTypeEnum())
            .name(location.getName())
            .rotation(location.getRotation())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .xSize(location.getXSize())
            .ySize(location.getYSize())
            .zSize(location.getZSize())
            .floorDtos(location.getFloors().stream()
                .map(FloorMapper::fromFloor)
                .collect(Collectors.toList()))
            .createdDate(location.getCreatedDate())
            .updatedDate(location.getUpdatedDate())
            .statusEnum(location.getStatusEnum())
            .build();
    }

    /**
     * LocationDto -> Location 변환
     *
     * @param locationDto
     * @return Location
     */
    public static Location fromDto(LocationDto locationDto) {
        Location location = Location.builder()
            .id(locationDto.getId())
            .name(locationDto.getName())
            .rotation(locationDto.getRotation())
            .xPosition(locationDto.getXPosition())
            .yPosition(locationDto.getYPosition())
            .xSize(locationDto.getXSize())
            .ySize(locationDto.getYSize())
            .zSize(locationDto.getZSize())
            .statusEnum(locationDto.getStatusEnum())
            .build();
        if (locationDto.getFloorDtos() != null) {
            List<Floor> floors = locationDto.getFloorDtos()
                .stream().map(FloorMapper::fromDto)
                .toList();
            location.setFloors(floors);
        }
        return location;
    }

}
