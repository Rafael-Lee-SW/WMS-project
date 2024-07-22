package com.a508.wms.util.mapper;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Location;
import com.a508.wms.dto.LocationDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
@Component
public class LocationMapper {
    /**
     * from Location -> to LocationDto
     * @param location
     * @return LocationDto
     */
    public static LocationDto fromLocation(Location location) {
        return LocationDto.builder()
                .id(location.getId())
                .warehouseId(location.getWarehouse().getId())
                .productStorageTypeId(location.getProductStorageType().getId())
                .name(location.getName())
                .xPosition(location.getXPosition())
                .yPosition(location.getYPosition())
                .width(location.getWidth())
                .height(location.getHeight())
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
     * @param locationDto
     * @return Location
     */
    public static Location fromDto(LocationDto locationDto) {
        Location location = Location.builder()
                .id(locationDto.getId())
                .name(locationDto.getName())
                .xPosition(locationDto.getXPosition())
                .yPosition(locationDto.getYPosition())
                .width(locationDto.getWidth())
                .height(locationDto.getHeight())
                .statusEnum(locationDto.getStatusEnum())
                .build();
        if(locationDto.getFloorDtos() != null)
        {
            List<Floor> floors = locationDto.getFloorDtos()
                    .stream().map(FloorMapper::fromDto)
                    .toList();
            location.setFloors(floors);
        }
        return location;
    }

}
