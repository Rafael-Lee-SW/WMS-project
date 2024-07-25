package com.a508.wms.floor.repository;

import com.a508.wms.floor.domain.Floor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FloorRepository extends JpaRepository<Floor, Long> {

    List<Floor> findAllByLocationId(Long locationId);

    @Query("SELECT f FROM Floor f " +
        "JOIN f.location l " +
        "JOIN l.warehouse w " +
        "WHERE w.id = :warehouseID "
        + "AND l.name LIKE '00-00' "
        + " AND f.floorLevel=:floorLevel")
    Floor findFloorByWarehouseId(@Param("warehouseID") Long warehouseID,
        @Param("floorLevel") int floorLevel);

    @Query("SELECT f FROM Floor f " +
        "WHERE f.location.id = :locationId " +
        "AND f.floorLevel = :floorLevel")
    Floor findByLocationIdAndFloorLevel(@Param("locationId") Long locationId,
        @Param("floorLevel") Integer floorLevel);
}
