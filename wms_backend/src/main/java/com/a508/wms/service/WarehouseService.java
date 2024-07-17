package com.a508.wms.service;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Location;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.LocationDto;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.repository.BusinessRepository;
import com.a508.wms.repository.WarehouseRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
        int rowCnt =(int) Math.sqrt(warehouseDto.getSize());
        int columnCnt = warehouseDto.getSize() / rowCnt;

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

}
