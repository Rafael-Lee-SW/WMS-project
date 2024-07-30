package com.a508.wms.location.service;

import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.dto.FloorDto;
import com.a508.wms.floor.mapper.FloorMapper;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationDto;
import com.a508.wms.location.mapper.LocationMapper;
import com.a508.wms.util.constant.ExportTypeEnum;
import com.a508.wms.util.constant.FacilityTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.service.WarehouseModuleService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {

    private final LocationModuleService locationModuleService;
    private final WarehouseModuleService warehouseModuleService;
    private final FloorModuleService floorModuleService;

    /**
     * 모든 로케이션 조회(Admin에서 사용)
     *
     * @return 모든 로케이션
     */
    public List<LocationDto> findAll() {
        List<Location> locations = locationModuleService.findAll();

        return locations.stream()
            .map(LocationMapper::fromLocation)
            .toList();
    }

    /**
     * 특정 로케이션 조회
     *
     * @param id: location id
     * @return id값과 일치하는 Location 하나, 없으면 null 리턴
     */
    public LocationDto findById(Long id) {
        Location location = locationModuleService.findById(id);

        return LocationMapper.fromLocation(location);
    }

    /**
     * 특정 창고가 가지고 있는 로케이션 전부 조회
     *
     * @param warehouseId: warehouse id
     * @return 입력 warehouseId를 가지고 있는 Location List
     */
    public List<LocationDto> findByWarehouseId(Long warehouseId) {
        List<Location> locations = locationModuleService.findByWarehouseId(warehouseId);

        return locations.stream()
            .map(LocationMapper::fromLocation)
            .toList();
    }

    /**
     * location 정보 받아와서 DB에 저장하는 메서드 1.locationDto내부의 창고,저장타입 id를 통해 저장소에 조회해서 location에 담은 후 저장
     * 2.floorDto들을 floor객체로 바꿔주고 내부에 location정보 담아줌 3.floor객체들을 전부 저장하고 location에도 floor 객체정보 담아줌
     *
     * @param locationDto : 프론트에서 넘어오는 location 정보 모든 작업이 하나의 트랜잭션에서 일어나야하므로 @Transactional 추가
     */
    @Transactional
    public LocationDto save(LocationDto locationDto) {
        log.info("Saving location: {}", locationDto);

        Warehouse warehouse = warehouseModuleService.findById(locationDto.getWarehouseId());

        Location location = Location.builder()
            .warehouse(warehouse)
            .productStorageTypeEnum(locationDto.getProductStorageTypeEnum())
            .name(locationDto.getName())
            .rotation(locationDto.getRotation())
            .xPosition(locationDto.getXPosition())
            .yPosition(locationDto.getYPosition())
            .xSize(locationDto.getXSize())
            .ySize(locationDto.getYSize())
            .zSize(locationDto.getZSize())
            .build();

        locationModuleService.save(location);

        List<FloorDto> floorDtos = locationDto.getFloorDtos();

        log.info("Floor convert");
        List<Floor> floors = floorDtos.stream()
            .map(floorDto -> {
                modifyExportType(floorDto, warehouse);
                log.info("{}", floorDto);
                // Floor 객체로 변환, location정보 넣어주기
                return FloorMapper.fromDto(floorDto).setLocation(location);
            })
            .toList();

        log.info("floors save");
        floorModuleService.saveAll(floors);    //floor 전부 저장\

        log.info("update location?");
        location.setFloors(floors);  //location에 층 정보 넣어주기

        return LocationMapper.fromLocation(location);
    }


    /**
     * 창고의 타입에 맞게 floor의 타입을 수정 하는 기능
     *
     * @param floorDto
     * @param warehouse : 해당 floor에 해당하는 Warehouse, 타입 확인을 위함.
     * @return Floor : 타입이 반영된 Floor 객체
     */
    private void modifyExportType(FloorDto floorDto, Warehouse warehouse) {
        //warehouse가 STORE(매장)인 경우
        if (warehouse.getFacilityTypeEnum().equals(FacilityTypeEnum.STORE)) {
            floorDto.setExportType(ExportTypeEnum.STORE);
        }
    }


    /**
     * location 정보 수정 수정 가능한 정보는 이름과 좌표값들
     *
     * @param locationDto: 바꿀 로케이션 정보들
     */
    public LocationDto update(Long id, LocationDto locationDto) {
        Location location = locationModuleService.findById(id);

        if (locationDto.getName() != null) {
            location.updateName(locationDto.getName());
        }

        location.updatePosition(locationDto.getXPosition(), locationDto.getYPosition());

        Location savedLocation = locationModuleService.save(location);
        return LocationMapper.fromLocation(savedLocation);
    }

    /**
     * location 삭제 -> id로 location을 조회하고 해당 location의 상태값을 DELETED로 변경 location내부의 모든 층도 상태값을
     * DELETED로 변경
     *
     * @param id: locationId
     */
    public void delete(Long id) {
        Location location = locationModuleService.findById(id);

        List<Floor> floors = floorModuleService.findAllByLocationId(
            location.getId()); //location의 층 전부 조회

        floors.stream().forEach(
            floor -> floor.updateStatusEnum(StatusEnum.DELETED)
        );

        floorModuleService.saveAll(floors); //변경사항 저장
        locationModuleService.delete(location);
    }

}
