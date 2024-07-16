package com.a508.wms.repository;

import com.a508.wms.domain.Location;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
    public List<Location> findLocationsByWarehouseId(Long warehouseId);
}
