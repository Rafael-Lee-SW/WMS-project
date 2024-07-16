package com.a508.wms.service;

import com.a508.wms.domain.Location;
import com.a508.wms.domain.ProductStorageType;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.LocationDto;
import com.a508.wms.repository.LocationRepository;
import com.a508.wms.repository.ProductStorageTypeRepository;
import com.a508.wms.repository.WarehouseRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductStorageTypeRepository productStorageTypeRepository;

    /**
     * 모든 로케이션 조회(Admin에서 사용)
     * @return 모든 로케이션
     */
    public List<LocationDto> findAll() {
        List<Location> locations = locationRepository.findAll();
        List<LocationDto> locationDtos = new ArrayList<>();
        for (Location location : locations) {
            locationDtos.add(LocationDto.fromEntity(location));
        }
        return locationDtos;
    }

    /**
     * 특정 로케이션 조회
     * @param id: location id
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public LocationDto findById(Long id) {
        Location location = locationRepository.findById(id).orElse(null);
        if (location != null) {
            return LocationDto.fromEntity(location);
        }
        return null;
    }

    /**
     * 특정 창고가 가지고 있는 로케이션 전부 조회
     * @param warehouseId: warehouse id
     * @return 입력 warehouseId를 가지고 있는 Location List
     */
    public List<LocationDto> findByWarehouseId(Long warehouseId) {
        List<Location> locations = locationRepository.findLocationsByWarehouseId(warehouseId);
        List<LocationDto> locationDtos = new ArrayList<>();
        for (Location location : locations) {
            locationDtos.add(LocationDto.fromEntity(location));
        }
        return locationDtos;
    }

    /**
     * location 정보 받아와서 DB에 저장하는 메서드
     * @param locationDto : 프론트에서 넘어오는 location 정보
     */
    public void save(LocationDto locationDto) {
        Warehouse warehouse = warehouseRepository.findById(locationDto.getWarehouseId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID"));
        ProductStorageType productStorageType = productStorageTypeRepository.findById(locationDto.getProductStorageTypeId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product storage type ID"));

        Location location = new Location(warehouse,productStorageType,locationDto.getXPosition(),
            locationDto.getYPosition(),locationDto.getWidth(),
            locationDto.getHeight(),locationDto.getFloors());

        System.out.println(location.toString());

        locationRepository.save(location);
    }



}
