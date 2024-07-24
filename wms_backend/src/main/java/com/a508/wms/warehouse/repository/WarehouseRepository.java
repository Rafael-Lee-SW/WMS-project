package com.a508.wms.warehouse.repository;

import java.util.List;
import java.util.Optional;

import com.a508.wms.warehouse.domain.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByBusinessId(Long  businessId );
    Optional<Warehouse> findByBusinessIdAndId(Long businessId, Long id);
}
