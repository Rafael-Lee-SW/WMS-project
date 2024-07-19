package com.a508.wms.repository;

import com.a508.wms.domain.Floor;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    List<Floor> findAllByLocationId(Long locationId);
}
