package com.a508.wms.warehouse.mapper;

import com.a508.wms.warehouse.domain.Warehouse;
import com.a508.wms.warehouse.dto.WarehouseDto;
import org.springframework.stereotype.Component;

@Component
public class WarehouseMapper {
    /**
     * WarehouseDto -> Warehouse 객체. business와 locations 직접 설정하기
     * @param warehouseDto
     * @return Warehouse
     */
    public static Warehouse fromDto(WarehouseDto warehouseDto) {
       return Warehouse.builder()
                .id(warehouseDto.getId())
                .size(warehouseDto.getSize())
                .name(warehouseDto.getName())
                .rowCount(warehouseDto.getRowCount())
                .columnCount(warehouseDto.getColumnCount())
                .facilityTypeEnum(warehouseDto.getFacilityTypeEnum())
                .statusEnum(warehouseDto.getStatusEnum())
                .build();
    }

    /**
     * Warehouse -> WarehouseDto 변환
     * @param warehouse
     * @return WarehouseDto
     */
    public static WarehouseDto fromWarehouse(Warehouse warehouse) {
        return WarehouseDto.builder()
                .id(warehouse.getId())
                .businessId(warehouse.getBusiness().getId())
                .size(warehouse.getSize())
                .name(warehouse.getName())
                .rowCount(warehouse.getRowCount())
                .columnCount(warehouse.getColumnCount())
                .facilityTypeEnum(warehouse.getFacilityTypeEnum())
                .priority(warehouse.getPriority())
                .createdDate(warehouse.getCreatedDate())
                .updatedDate(warehouse.getUpdatedDate())
                .statusEnum(warehouse.getStatusEnum())
                .build();
    }
}
