package com.a508.wms.controller;

import com.a508.wms.domain.Warehouse;
import com.a508.wms.dto.WarehouseDto;
import com.a508.wms.service.WarehouseService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
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
    post
     */
    @PostMapping
    public ResponseEntity<WarehouseDto> add(@RequestBody WarehouseDto warehouseDto) {
        log.info("add warehouse {}", warehouseDto);
        //서비스 호출
        WarehouseDto createdWarehouse = warehouseService.createWarehouse(warehouseDto);
        return new ResponseEntity<>(createdWarehouse, HttpStatus.CREATED);
    }

     /*
    사업자 id를 파라미터로 모든 창고를 조회하는 기능
    get
     */
     @GetMapping("/{id}")
     public ResponseEntity<List<WarehouseDto>> getWarehousesByBusinessId(@PathVariable Long id) {
         log.info("Getting warehouses for business ID: {}", id); // 로그 출력
         List<WarehouseDto> warehouses = warehouseService.getWarehousesByBusinessId(id); // 서비스 호출하여 결과 반환
         return new ResponseEntity<>(warehouses, HttpStatus.OK); // 200 OK 응답 반환
     }


    /*
    사업자 id의 모든 창고를 조회하는 기능
    get
     */

    /*
    창고 id의 수직 수평 배치 수  , 지수를 수정하는 기능
     */






}
