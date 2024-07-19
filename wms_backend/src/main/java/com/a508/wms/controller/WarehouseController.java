package com.a508.wms.controller;

import com.a508.wms.controller.response.BaseSuccessResponse;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.service.WarehouseService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/warehouses")
public class WarehouseController {

    //의존성주입
    private final WarehouseService warehouseService;

    /**
     * 사업자 id의 창고를 저장 POST 방식
     */
    @PostMapping
    public BaseSuccessResponse<WarehouseDto> createWarehouse(
        @RequestBody WarehouseDto warehouseDto) {
        log.info("add warehouse {}", warehouseDto);
        //서비스 호출
        warehouseService.save(warehouseDto);
        return new BaseSuccessResponse<>(null);
    }

    /**
     * 비지니스 id로 창고 생성 창고 id로 창고 생성 GET 방식
     */
    @GetMapping
    public BaseSuccessResponse<List<WarehouseDto>> getWarehouses(
        @RequestParam(required = false) Long businessId,
        @RequestParam(required = false) Long warehouseId) {
        if (businessId != null) {
            log.info("Getting warehouses for business ID: {}", businessId);
            List<WarehouseDto> warehouses = warehouseService.findByBusinessId(businessId);
            return new BaseSuccessResponse<>(warehouses);
        } else if (warehouseId != null) {
            log.info("Getting warehouse by ID: {}", warehouseId);
            WarehouseDto warehouse = warehouseService.findByWarehouseId(warehouseId);
            return new BaseSuccessResponse<>(List.of(warehouse));
        } else {
            throw new IllegalArgumentException("Either businessId or warehouseId must be provided");
        }
    }

    /**
     * 창고 id로 창고 정보 수정 PUT 방식
     */
    @PutMapping("/{warehouseId}")
    public BaseSuccessResponse<WarehouseDto> updateWarehouse(
        @PathVariable Long warehouseId,
        @RequestBody WarehouseDto warehouseDto) {
        log.info("Updating warehouse with ID: {}", warehouseId);
        WarehouseDto updatedWarehouse = warehouseService.updateWarehouse(
            warehouseDto.getBusinessId(), warehouseId, warehouseDto);
        return new BaseSuccessResponse<>(updatedWarehouse);
    }

    /**
     * 창고 id의 상태를 비활성화 (status를 0으로 변경) PATCH 방식
     */
    @PatchMapping("/{businessId}")
    public BaseSuccessResponse<Void> deleteWarehouse(@PathVariable Long businessId,
        @PathVariable Long warehouseId) {
        log.info("Deactivating warehouse with ID: {} for business ID: {}", warehouseId, businessId);
        warehouseService.deleteWarehouse(businessId, warehouseId);
        return new BaseSuccessResponse<>(null);
    }


}
