package com.a508.wms.location.mapper;

import com.a508.wms.floor.mapper.FloorMapper;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationDto;
import com.a508.wms.location.dto.LocationResponseDto;
import com.a508.wms.warehouse.domain.Warehouse;
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
            .FloorResponseDtos(location.getFloors().stream()
                .map(FloorMapper::toFloorResponseDto)
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
    public static Location fromDto(LocationDto locationDto, Warehouse warehouse) {
        Location location = Location.builder()
            .id(locationDto.getId())
            .name(locationDto.getName())
            .rotation(locationDto.getRotation())
            .xPosition(locationDto.getXPosition())
            .yPosition(locationDto.getYPosition())
            .xSize(locationDto.getXSize())
            .ySize(locationDto.getYSize())
            .zSize(locationDto.getZSize())
            .warehouse(warehouse)
            .productStorageTypeEnum(locationDto.getProductStorageTypeEnum())
            .build();
        return location;
    }

    public static Location fromLocationResponseDto(LocationResponseDto locationResponseDto,
        Warehouse warehouse) {
        return Location.builder()
            .id(locationResponseDto.getId())
            .name(locationResponseDto.getName())
            .rotation(locationResponseDto.getRotation())
            .xPosition(locationResponseDto.getXPosition())
            .yPosition(locationResponseDto.getYPosition())
            .xSize(locationResponseDto.getXSize())
            .ySize(locationResponseDto.getYSize())
            .zSize(locationResponseDto.getZSize())
            .warehouse(warehouse)
            .productStorageTypeEnum(locationResponseDto.getStorageType())
            .build();
    }

    public static LocationResponseDto toLocationResponseDto(Location location) {
        return LocationResponseDto.builder()
            .id(location.getId())
            .xPosition(location.getXPosition())
            .yPosition(location.getYPosition())
            .xSize(location.getXSize())
            .ySize(location.getYSize())
            .zSize(location.getZSize())
            .name(location.getName())
            .storageType(location.getProductStorageTypeEnum())
            .rotation(location.getRotation())
            .build();
    }

}
