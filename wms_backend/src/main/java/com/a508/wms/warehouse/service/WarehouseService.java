package com.a508.wms.warehouse.service;

import com.a508.wms.business.domain.Business;
import com.a508.wms.business.repository.BusinessRepository;
import com.a508.wms.floor.dto.FloorDto;
import com.a508.wms.floor.service.FloorService;
import com.a508.wms.location.domain.Location;
import com.a508.wms.location.dto.LocationDto;
import com.a508.wms.location.mapper.LocationMapper;
import com.a508.wms.location.repository.LocationRepository;
import com.a508.wms.location.service.LocationService;
import com.a508.wms.util.constant.ProductStorageTypeEnum;
import com.a508.wms.util.constant.StatusEnum;
import java.util.List;

import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.mapper.WarehouseMapper;
import com.a508.wms.warehouse.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private static final Logger log = LoggerFactory.getLogger(WarehouseService.class);
    //의존성 주입

    private final WarehouseRepository warehouseRepository;
    private final BusinessRepository businessRepository;
    private final LocationService locationService;
    /*
    최초 창고를 생성하는 메서드
     */
    @Transactional
    public WarehouseDto save(WarehouseDto warehouseDto) {
//        default floor 설정(값을 안 넣으면 default)하고 List로 변환
        List <FloorDto> floorDtos = List.of(FloorDto.builder().build());
//        Default location 생성(기본값으로 들어감)
//        이 때 locationDto에 floorDto 값을 넣어주면 floor도 함께 생성됨
        LocationDto locationDto = LocationDto.builder()
                .floorDtos(floorDtos).build();
        locationService.save(locationDto);
        log.info("locationDto: {}", locationDto);
        //warehouse 엔티티를 생성하고 DTO에서 필드를 설정
        Warehouse warehouse = createWarehouse(warehouseDto);
//        warehouse에 저장 후 반환
        return WarehouseMapper.fromWarehouse(warehouseRepository.save(warehouse));
    }
    /*
    비지니스 id로 창고 목록을 조회하는 메서드
     */
    public List<WarehouseDto> findByBusinessId(Long businessId) {
        List<Warehouse> warehouses = warehouseRepository.findByBusinessId(businessId); // 창고 목록 조회
        return warehouses.stream()
            .map(WarehouseMapper::fromWarehouse)
                .toList();
    }

    /*
   창고 id로 창고를 조회하는 메서드
    */
    public WarehouseDto findByWarehouseId(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID"));
        return WarehouseMapper.fromWarehouse(warehouse);
    }

    /*
    창고 정보를 부분적으로 업데이트하는 메서드
     */
    @Transactional
    public WarehouseDto updateWarehouse(Long businessId, Long warehouseId,
        WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseRepository.findByBusinessIdAndId(businessId, warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID or business ID"));

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
        if (warehouseDto.getFacilityType() != null) {
            warehouse.setFacilityType(warehouseDto.getFacilityType());
        }

        warehouseRepository.save(warehouse);

        return WarehouseMapper.fromWarehouse(warehouse);
    }

    /*
   창고를 비활성화하는 메서드 (상태를 INACTIVE로 설정, PATCH)
    */
    @Transactional
    public void deleteWarehouse(Long warehouseId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID"));
        warehouse.setStatusEnum(StatusEnum.INACTIVE);
        warehouseRepository.save(warehouse);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }
    public Warehouse createWarehouse(WarehouseDto warehouseDto) {

        // 사업체 ID로 사업체를 조회
        Business business = businessRepository.findById(warehouseDto.getBusinessId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid business ID"));
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
                .facilityType(warehouseDto.getFacilityType())
                .build();
    }

}
