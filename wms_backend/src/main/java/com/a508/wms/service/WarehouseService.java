package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.repository.WarehouseRepository;
import com.a508.wms.util.StatusEnum;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
    public class WarehouseService {
    //의존성 주입

    private final WarehouseRepository warehouseRepository;
    private final BusinessRepository businessRepository;

    /*
    최초 창고를 생성하는 메서드
     */
    public WarehouseDto createWarehouse(WarehouseDto warehouseDto) {
        // 사업체 ID로 사업체를 조회
        Business business = businessRepository.findById(warehouseDto.getBusinessId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid business ID"));

        //수직 배치수 수평 배치수 계산
        // 수직 배치수 수평 배치수 계산
        int rowCnt = calculateRowCount(warehouseDto.getSize());
        int columnCnt = calculateRowCount(warehouseDto.getSize());

        //warehouse 엔티티를 생성하고 DTO에서 필드를 설정
        Warehouse warehouse = new Warehouse();
        warehouse.setBusiness(business);
        warehouse.setSize(warehouseDto.getSize());
        warehouse.setName(warehouseDto.getName());
        warehouse.setRowCount(rowCnt);
        warehouse.setColumnCount(columnCnt);
        warehouse.setPriority(warehouseDto.getPriority());

        warehouse = warehouseRepository.save(warehouse);
        return WarehouseDto.fromEntity(warehouse);
    }

    /*
    비지니스 id로 창고 목록을 조회하는 메서드
     */
    public List<WarehouseDto> getWarehousesByBusinessId(Long businessId) {
        List<Warehouse> warehouses = warehouseRepository.findByBusinessId(businessId); // 창고 목록 조회
        return warehouses.stream()
            .map(WarehouseDto::fromEntity)
            .collect(Collectors.toList());
    }

    /*
   창고 id로 창고를 조회하는 메서드
    */
    public WarehouseDto getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID"));
        return WarehouseDto.fromEntity(warehouse);
    }

    /*
   사업자 id와 창고 id를 기반으로 창고를 조회하는 메서드
    */
    public WarehouseDto getWarehouseByBusinessIdAndWarehouseId(Long businessId, Long warehouseId) {
        Warehouse warehouse = warehouseRepository.findByBusinessIdAndId(businessId, warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID or business ID"));
        return WarehouseDto.fromEntity(warehouse);
    }

    /*
    창고 정보를 부분적으로 업데이트하는 메서드 (PATCH)
     */
    @Transactional
    public WarehouseDto patchWarehouse(Long businessId, Long warehouseId, WarehouseDto warehouseDto) {
        Warehouse warehouse = warehouseRepository.findByBusinessIdAndId(businessId, warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID or business ID"));

        if (warehouseDto.getSize() != 0) {
            warehouse.setSize(warehouseDto.getSize());
            // 수직 및 수평 배치 수를 다시 계산
            int rowCnt = calculateRowCount(warehouseDto.getSize());
            int columnCnt = calculateRowCount(warehouseDto.getSize());
            warehouse.setRowCount(rowCnt);
            warehouse.setColumnCount(columnCnt);
        }
        if (warehouseDto.getName() != null) warehouse.setName(warehouseDto.getName());
        if (warehouseDto.getPriority() != 0) warehouse.setPriority(warehouseDto.getPriority());

        // 수정된 창고 정보를 저장
        warehouse = warehouseRepository.save(warehouse);

        return WarehouseDto.fromEntity(warehouse);
    }
    /*
   창고를 비활성화하는 메서드 (상태를 INACTIVE로 설정, PATCH)
    */
    @Transactional
    public void deactivateWarehouse(Long businessId, Long warehouseId) {
        Warehouse warehouse = warehouseRepository.findByBusinessIdAndId(businessId, warehouseId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid warehouse ID or business ID"));
        warehouse.setStatusEnum(StatusEnum.INACTIVE);
    }

    private int calculateRowCount(int size) {
        double sizeInSquareMeters = size * 3.305785; // 평을 제곱미터로 변환
        return (int) Math.sqrt(sizeInSquareMeters); // 제곱근 계산
    }

}
