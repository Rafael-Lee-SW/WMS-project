package com.a508.wms.location.repository;

import com.a508.wms.location.domain.Location;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT l FROM Location l JOIN FETCH l.floors WHERE l.warehouse.id = :warehouseId")
    List<Location> findAllByWarehouseId(Long warehouseId);

    @Query("SELECT l from Location l where l.name = :name")
    Location findByName(@Param("name") String name);
}
