package com.a508.wms.warehouse.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.service.BusinessModuleService;
import com.a508.wms.floor.domain.Floor;
import com.a508.wms.floor.service.FloorModuleService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationDto;
import com.a508.wms.location.mapper.LocationMapper;
import com.a508.wms.location.service.LocationModuleService;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.warehouse.domain.Wall;
import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WallDto;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.mapper.WallMapper;
import com.a508.wms.warehouse.mapper.WarehouseMapper;
import com.a508.wms.warehouse.repository.WallRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseModuleService warehouseModuleService;
    private final BusinessModuleService businessModuleService;
    private final LocationModuleService locationModuleService;
    private final FloorModuleService floorModuleService;
    private final WallRepository wallRepository;
    private final WallModuleService wallModuleService;
    private final WallMapper wallMapper;

    /*
    최초 창고를 생성하는 메서드
     */
    @Transactional
    public WarehouseDto save(WarehouseDto warehouseDto) {
////        default floor 설정(값을 안 넣으면 default)하고 List로 변환
//        List<FloorDto> floorDtos = List.of(FloorDto.builder().build());
////        Default location 생성(기본값으로 들어감)
////        이 때 locationDto에 floorDto 값을 넣어주면 floor도 함께 생성됨
//        LocationDto locationDto = LocationDto.builder()
//            .floorDtos(floorDtos).build();
//        locationModuleService.save(locationDto);
//        log.info("locationDto: {}", locationDto);
//        //warehouse 엔티티를 생성하고 DTO에서 필드를 설정
//        Warehouse warehouse = createWarehouse(warehouseDto);
////        warehouse에 저장 후 반환
//        return WarehouseMapper.fromWarehouse(warehouseModuleService.save(warehouse));

        Warehouse warehouse = createWarehouse(warehouseDto);
        warehouse = warehouseModuleService.save(warehouse);
        log.info("warehouse.FT:{}", warehouse.getFacilityTypeEnum());
        Location defaultLocation = Location.builder()
            .productStorageTypeEnum(ProductStorageTypeEnum.상온)
            .warehouse(warehouse)
            .build();
        locationModuleService.save(defaultLocation);

        Floor defaultFloor = Floor.builder()
            .location(defaultLocation)
            .build();
        floorModuleService.save(defaultFloor);

        return WarehouseMapper.fromWarehouse(warehouse);
    }

    /*
    비지니스 id로 창고 목록을 조회하는 메서드
     */
    public List<WarehouseDto> findByBusinessId(Long businessId) {
        List<Warehouse> warehouses = warehouseModuleService.findByBusinessId(
            businessId); // 창고 목록 조회

        return warehouses.stream()
            .map(WarehouseMapper::fromWarehouse)
            .toList();
    }

    /*
   창고 id로 창고를 조회하는 메서드
    */
    public WarehouseDto findByWarehouseId(Long id) {
        Warehouse warehouse = warehouseModuleService.findByWarehouseId(id);

        //location 넣어주기
        List<Location> locations = locationModuleService.findByWarehouseId(id);
        warehouse.setLocations(locations);
        WarehouseDto warehouseDto = WarehouseMapper.fromWarehouse(warehouse);
        List<LocationDto> locationDtos = new ArrayList<>();
        for (Location location : locations) {
            locationDtos.add(LocationMapper.fromLocation(location));
        }
        warehouseDto.setLocations(locationDtos);

        //wall 넣어주기
        List<Wall> walls = wallModuleService.findByWarehouseId(id);
        warehouse.setWalls(walls);
        List<WallDto> wallDtos = new ArrayList<>();
        for (Wall wall : walls) {
            wallDtos.add(WallMapper.fromWall(wall));
        }
        warehouseDto.setWalls(wallDtos);
        return warehouseDto;
    }

    /*
    창고 정보를 부분적으로 업데이트하는 메서드 (businessId 제거 필요)
     */
    @Transactional
    public WarehouseDto updateWarehouse(Long warehouseId, WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseModuleService.findById(warehouseId);

        if (warehouseDto.getSize() != 0) {
            warehouse.setSize(warehouseDto.getSize());
            int rowCnt = calculateRowCount(warehouseDto.getSize());
            int columnCnt = calculateRowCount(warehouseDto.getSize());
            warehouse.setRowCount(rowCnt);
            warehouse.setColumnCount(columnCnt);
        }
        if (warehouseDto.getName() != null) {
            warehouse.setName(warehouseDto.getName());
        }
        if (warehouseDto.getPriority() != 0) {
            warehouse.setPriority(warehouseDto.getPriority());
        }
        if (warehouseDto.getFacilityTypeEnum() != null) {
            warehouse.setFacilityTypeEnum(warehouseDto.getFacilityTypeEnum());
        }
        if (warehouseDto.getWalls() != null) {
            List<Wall> walls = new ArrayList<>();
            for (WallDto wall : warehouseDto.getWalls()) {
                Wall saveWall = wallRepository.save(WallMapper.fromDto(wall));
                walls.add(saveWall);
            }
            warehouse.setWalls(walls);
        }

        Warehouse savedWarehouse = warehouseModuleService.save(warehouse);

        return WarehouseMapper.fromWarehouse(savedWarehouse);
    }

    /*
   창고를 비활성화하는 메서드 (상태를 INACTIVE로 설정, PATCH)
    */
    @Transactional
    public void deleteWarehouse(Long warehouseId) {
        Warehouse warehouse = warehouseModuleService.findById(warehouseId);
        warehouseModuleService.delete(warehouse);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }

    private Warehouse createWarehouse(WarehouseDto warehouseDto) {

        // 사업체 ID로 사업체를 조회
        Business business = businessModuleService.findById(warehouseDto.getBusinessId());

        //수직 배치수 수평 배치수 계산
        int rowCnt = calculateRowCount(warehouseDto.getSize());
        //수직 배치수 수평 배치수 계산
        int columnCnt = calculateRowCount(warehouseDto.getSize());
        return Warehouse.builder()
            .business(business)
            .size(warehouseDto.getSize())
            .name(warehouseDto.getName())
            .rowCount(rowCnt)
            .columnCount(columnCnt)
            .priority(warehouseDto.getPriority())
            .facilityTypeEnum(warehouseDto.getFacilityTypeEnum())
            .build();
    }

}
