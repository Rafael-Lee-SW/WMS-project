package com.a508.wms.util.mapper;

import com.a508.wms.domain.Business;
import com.a508.wms.domain.Location;
import com.a508.wms.domain.ProductStorageType;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.WarehouseDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class WarehouseMapper {
    /**
     * , Business business, ProductStorageType productStorageType 제외. business와 locations 직접 설정하기
     * @param warehouseDto
     * @return
     */
    public static Warehouse fromDto(WarehouseDto warehouseDto) {
        Warehouse warehouse = Warehouse.builder()
                .id(warehouseDto.getId())
                .size(warehouseDto.getSize())
                .name(warehouseDto.getName())
                .rowCount(warehouseDto.getRowCount())
                .columnCount(warehouseDto.getColumnCount())
                .facilityType(warehouseDto.getFacilityType())
                .statusEnum(warehouseDto.getStatus())
                .build();

        return warehouse;
    }
    public static WarehouseDto fromWarehouse(Warehouse warehouse) {
        return WarehouseDto.builder()
                .id(warehouse.getId())
                .businessId(warehouse.getBusiness().getId())
                .size(warehouse.getSize())
                .name(warehouse.getName())
                .rowCount(warehouse.getRowCount())
                .columnCount(warehouse.getColumnCount())
                .facilityType(warehouse.getFacilityType())
                .priority(warehouse.getPriority())
                .createDate(warehouse.getCreatedDate())
                .updateDate(warehouse.getUpdatedDate())
                .status(warehouse.getStatusEnum())
                .build();
    }
}
