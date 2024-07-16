package com.a508.wms.controller;

import com.a508.wms.domain.Warehouse;
import com.a508.wms.service.WarehouseService;
import java.util.List;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequestMapping ("/warehouses")
public class WarehouseController {
    //의존성주입
    @Autowired
    private WarehouseService warehouseService;

    //모든 창고 조회
    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.findAll();
    }

    //창고 id로 조회
    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long id) {
        return warehouseService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    //창고 생성
    @PostMapping
    public ResponseEntity<Void> createWarehouse(@RequestBody Warehouse warehouse) {
        warehouseService.save(warehouse);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //비지니스 id로 조회
    @GetMapping(params = "businessId")
    public List<Warehouse> getWarehousesByBusinessId(@RequestParam Long businessId) {
        return warehouseService.findByBusinessId(businessId);
    }





}
