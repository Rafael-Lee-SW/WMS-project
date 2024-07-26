package com.a508.wms.service;

import com.a508.wms.domain.Floor;
import com.a508.wms.domain.Location;
import com.a508.wms.domain.ProductStorageType;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.FloorDto;
import com.a508.wms.dto.LocationDto;
import com.a508.wms.repository.FloorRepository;
import com.a508.wms.repository.LocationRepository;
import com.a508.wms.repository.ProductStorageTypeRepository;
import com.a508.wms.repository.WarehouseRepository;
import com.a508.wms.util.StatusEnum;
import jakarta.transaction.Transactional;
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
    private final FloorRepository floorRepository;

    /**
     * 모든 로케이션 조회(Admin에서 사용)
     *
     * @return 모든 로케이션
     */
    public List<LocationDto> findAll() {
        List<Location> locations = locationRepository.findAll();
        List<LocationDto> locationDtos = new ArrayList<>();
        for (Location location : locations) {
            locationDtos.add(LocationDto.fromLocation(location));
        }
        return locationDtos;
    }

    /**
     * 특정 로케이션 조회
     *
     * @param id: location id
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public LocationDto findById(Long id) {
        Location location = locationRepository.findById(id).orElse(null);
        if (location != null) {
            return LocationDto.fromLocation(location);
        }
        return null;
    }

    /**
     * 특정 창고가 가지고 있는 로케이션 전부 조회
     *
     * @param warehouseId: warehouse id
     * @return 입력 warehouseId를 가지고 있는 Location List
     */
    public List<LocationDto> findByWarehouseId(Long warehouseId) {
        List<Location> locations = locationRepository.findLocationsByWarehouseId(warehouseId);
        List<LocationDto> locationDtos = new ArrayList<>();
        for (Location location : locations) {
            locationDtos.add(LocationDto.fromLocation(location));
        }
        return locationDtos;
    }

    /**
     * location 정보 받아와서 DB에 저장하는 메서드
     * 1.locationDto내부의 창고,저장타입 id를 통해 저장소에 조회해서 location에 담은 후 저장
     * 2.floorDto들을 floor객체로 바꿔주고 내부에 location정보 담아줌
     * 3.floor객체들을 전부 저장하고 location에도 floor 객체정보 담아줌
     *
     * @param locationDto : 프론트에서 넘어오는 location 정보 모든 작업이 하나의 트랜잭션에서 일어나야하므로 @Transactional 추가
     */
    @Transactional
    public void save(LocationDto locationDto) {
        Warehouse warehouse = warehouseRepository.findById(locationDto.getWarehouseId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID"));
        ProductStorageType productStorageType = productStorageTypeRepository.findById(
                locationDto.getProductStorageTypeId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid product storage type ID"));

        Location location = new Location(warehouse, productStorageType, locationDto.getXPosition(),
            locationDto.getYPosition(), locationDto.getWidth(),
            locationDto.getHeight());
        location.setWarehouse(warehouse);
        locationRepository.save(location); //우선 로케이션 저장

        List<FloorDto> floorDtos = locationDto.getFloorDtos();

        List<Floor> floors = floorDtos.stream()
            .map(floorDto -> {
                return Floor.fromDto(floorDto, location);    // Floor 객체로 변환, location정보 넣어주기
            })
            .toList();

        floorRepository.saveAll(floors);    //floor 전부 저장
        location.setFloors(floors);  //location에 층 정보 넣어주기
    }

    /**
     * location 정보 수정 수정 가능한 정보는 이름과 좌표값들
     *
     * @param locationDto: 바꿀 로케이션 정보들
     */
    public LocationDto update(Long id, LocationDto locationDto) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid location ID"));
        location.updateName(locationDto.getLocationName());
        location.updatePosition(locationDto.getXPosition(), locationDto.getYPosition());
        return LocationDto.fromLocation(locationRepository.save(location));
    }

    /**
     * location 삭제 -> id로 location을 조회하고 해당 location의 상태값을 DELETED로 변경 location내부의 모든 층도 상태값을
     * DELETED로 변경
     *
     * @param id: locationId
     */
    public void delete(Long id) {
        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid location ID"));
        location.updateStatusEnum(StatusEnum.DELETED);

        List<Floor> floors = floorRepository.findAllByLocationId(
            location.getId()); //location의 층 전부 조회
        for (Floor floor : floors) {
            floor.updateStatusEnum(StatusEnum.DELETED);
        }   //층들 전부 DELETED상태로 변경

        floorRepository.saveAll(floors); //변경사항 저장 
        locationRepository.save(location); //변경사항 저장
    }

}