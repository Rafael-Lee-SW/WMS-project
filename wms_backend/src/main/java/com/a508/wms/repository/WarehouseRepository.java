package com.a508.wms.repository;

import com.a508.wms.domain.Warehouse;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByBusinessId(Long  businessId );
}
