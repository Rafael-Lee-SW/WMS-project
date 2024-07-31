package com.a508.wms.warehouse.controller;

import com.a508.wms.util.BaseSuccessResponse;
import com.a508.wms.warehouse.dto.WarehouseDto;
import com.a508.wms.warehouse.service.WarehouseService;
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
        return new BaseSuccessResponse<>(warehouseService.create(warehouseDto));
    }

    /**
     * 비지니스 id로 창고 생성 창고 id로 창고 생성 GET 방식
     */
    @GetMapping
    public BaseSuccessResponse<List<WarehouseDto>> findAllByIdWarehouses(
        @RequestParam Long businessId) {
        log.info("Getting warehouses for business ID: {}", businessId);
        return new BaseSuccessResponse<>(warehouseService.findByBusinessId(businessId));
    }

    @GetMapping("/{id}")
    public BaseSuccessResponse<WarehouseDto> findById(@PathVariable Long id) {
        log.info("Getting warehouse {}", id);
        return new BaseSuccessResponse<>(warehouseService.findById(id));
    }

    /**
     * 창고 id로 창고 정보 수정 PUT 방식
     */
    @PutMapping("/{warehouseId}")
    public BaseSuccessResponse<WarehouseDto> update(
        @PathVariable Long warehouseId,
        @RequestBody WarehouseDto warehouseDto) {
        log.info("Updating warehouse with ID: {}", warehouseId);
        return new BaseSuccessResponse<>(warehouseService.updateWarehouse(
            warehouseId, warehouseDto));
    }

    /*
   창고 id의 상태를 비활성화 (status를 0으로 변경) PATCH 방식
   */
    @PatchMapping("/{warehouseId}")
    public BaseSuccessResponse<Void> delete(@PathVariable Long warehouseId) {
        log.info("Deactivating warehouse with ID: {}", warehouseId);
        warehouseService.delete(warehouseId);
        return new BaseSuccessResponse<>(null);
    }


}
