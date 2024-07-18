package com.a508.wms.controller;

import com.a508.wms.controller.response.BaseSuccessResponse;
import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.service.WarehouseService;
import jakarta.validation.constraints.Null;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

    /*
    사업자 id의 창고를 저장하는 기능
    POST 방식
     */
    @PostMapping
    public BaseSuccessResponse<WarehouseDto> add(@RequestBody WarehouseDto warehouseDto) {
        log.info("add warehouse {}", warehouseDto);
        //서비스 호출
        WarehouseDto createdWarehouse = warehouseService.createWarehouse(warehouseDto);
        return new BaseSuccessResponse<>(createdWarehouse);
    }

     /*
    사업자 id를 파라미터로 모든 창고를 조회하는 기능
    GET 방식
     */
     @GetMapping("/{businessId}")
     public BaseSuccessResponse<List<WarehouseDto>> getWarehousesByBusinessId(@PathVariable Long businessId) {
         log.info("Getting warehouses for business ID: {}", businessId); // 로그 출력
         List<WarehouseDto> warehouses = warehouseService.getWarehousesByBusinessId(businessId); // 서비스 호출하여 결과 반환
         return new BaseSuccessResponse<>(warehouses); // 200 OK 응답 반환
     }

    /*
   창고 id로 창고를 조회하는 기능
   GET 방식
    */
    @GetMapping("/warehouses/{warehouseId}")
    public BaseSuccessResponse<WarehouseDto> getWarehouseById(@PathVariable Long warehouseId) {
        log.info("Getting warehouse by ID: {}", warehouseId);
        WarehouseDto warehouse = warehouseService.getWarehouseById(warehouseId);
        return new BaseSuccessResponse<>(warehouse);
    }

    /*
   사업자 id와 창고 id를 기반으로 특정 창고를 조회하는 기능
   GET 방식
    */
    @GetMapping("/{businessId}/warehouses/{warehouseId}")
    public BaseSuccessResponse<WarehouseDto> getWarehouseByBusinessIdAndWarehouseId(@PathVariable Long businessId, @PathVariable Long warehouseId) {
        log.info("Getting warehouse with ID: {} for business ID: {}", warehouseId, businessId);
        WarehouseDto warehouse = warehouseService.getWarehouseByBusinessIdAndWarehouseId(businessId, warehouseId);
        return new BaseSuccessResponse<>(warehouse);
    }

    /*
    창고 id의 수직 수평 배치 수, 지수 등 창고의 정보를 부분적으로 수정하는 기능
    PATCH 방식
     */
    @PatchMapping("/{businessId}/warehouses/{warehouseId}")
    public BaseSuccessResponse<WarehouseDto> patchWarehouse(@PathVariable Long businessId, @PathVariable Long warehouseId, @RequestBody WarehouseDto warehouseDto) {
        log.info("Patching warehouse with ID: {} for business ID: {}", warehouseId, businessId);
        WarehouseDto updatedWarehouse = warehouseService.patchWarehouse(businessId, warehouseId, warehouseDto);
        return new BaseSuccessResponse<>(updatedWarehouse);
    }
    /*
    창고 id의 상태를 비활성화 (status를 0으로 변경)
    PATCH 방식
     */
    @PatchMapping("/{businessId}/warehouses/{warehouseId}/deactivate")
    public BaseSuccessResponse<Void> deactivateWarehouse(@PathVariable Long businessId, @PathVariable Long warehouseId) {
        log.info("Deactivating warehouse with ID: {} for business ID: {}", warehouseId, businessId);
        warehouseService.deactivateWarehouse(businessId, warehouseId);
        return new BaseSuccessResponse<>(null);
    }



}
