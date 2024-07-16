package com.a508.wms.service;

import com.a508.wms.domain.Warehouse;
import com.a508.wms.repository.WarehouseRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
    public class WarehouseService {
    //의존성 주입
    @Autowired
    private final WarehouseRepository warehouseRepository;

    //모든 창고 조회
    public List<Warehouse> findAll() {
        return warehouseRepository.findAll();
    }

    //창고 하나 조회
    public Optional<Warehouse> findById(Long id) {
        return warehouseRepository.findById(id);
    }

    //사업자id로 비지니스 id 조회
    public List<Warehouse> findByBusinessId(Long businessId) {
        return warehouseRepository.findByBusinessId(businessId);
    }

    //창고 저장
    public void save(Warehouse warehouse)  {
        warehouseRepository.save(warehouse);
    }
    //창고삭제
    public void deleteById(Long id) {
        warehouseRepository.deleteById(id);
    }
}
