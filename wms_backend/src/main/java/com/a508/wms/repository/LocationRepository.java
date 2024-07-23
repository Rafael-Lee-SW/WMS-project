package com.a508.wms.repository;

import com.a508.wms.domain.Location;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findLocationsByWarehouseId(Long warehouseId);
    @Query("SELECT l from Location l where l.name = :name")
    Location findLocationByName(@Param("name") String name);
}
