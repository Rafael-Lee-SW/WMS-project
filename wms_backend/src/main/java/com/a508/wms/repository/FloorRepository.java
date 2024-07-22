package com.a508.wms.repository;

import com.a508.wms.domain.Floor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FloorRepository extends JpaRepository<Floor, Long> {

    List<Floor> findAllByLocationId(Long locationId);

    @Query("SELECT f FROM Floor f " +
        "JOIN f.location l " +
        "JOIN l.warehouse w " +
        "JOIN w.business b " +
        "WHERE b.id = :businessID "
        + "AND l.name LIKE '00-00'")
    Floor findDefaultFloorByBusinessId(@Param("businessID") Long BusinessID);
}
